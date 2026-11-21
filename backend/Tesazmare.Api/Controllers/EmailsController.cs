
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Tesazmare.Api.Data;
using Tesazmare.Api.Models;
using Tesazmare.Api.Services;

namespace Tesazmare.Api.Controllers;

[ApiController]
[Route("api/emails")]
public class EmailsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly CpanelEmailService _emailService;
    private readonly ILogger<EmailsController> _logger;

    public EmailsController(
        AppDbContext context,
        CpanelEmailService emailService,
        ILogger<EmailsController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    // PUBLIC: Receive contact and booking enquiries
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> ReceiveEmail(
        [FromBody] CreateEmailMessageRequest request)
    {
        var category = request.Category.Trim();

        if (!category.Equals("Contact", StringComparison.OrdinalIgnoreCase) &&
            !category.Equals("Booking", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "Category must be Contact or Booking."
            });
        }

        var normalizedCategory = category.Equals(
            "Booking",
            StringComparison.OrdinalIgnoreCase
        ) ? "Booking" : "Contact";

        var recipient = normalizedCategory == "Booking"
            ? "booking@tesazmarelogistics.co.za"
            : "info@tesazmarelogistics.co.za";

        var email = new EmailMessage
        {
            SenderName = request.SenderName.Trim(),
            SenderEmail = request.SenderEmail.Trim(),
            SenderPhone = string.IsNullOrWhiteSpace(request.SenderPhone)
                ? null
                : request.SenderPhone.Trim(),
            RecipientEmail = recipient,
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
            Category = normalizedCategory,
            IsRead = false,
            IsArchived = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.EmailMessages.Add(email);
        await _context.SaveChangesAsync();

        var notificationSent = false;

        try
        {
            var mailbox = normalizedCategory == "Booking"
                ? "booking"
                : "info";

            var emailBody = $"""
                New {normalizedCategory} Enquiry

                Customer Name: {email.SenderName}
                Customer Email: {email.SenderEmail}
                Customer Phone: {email.SenderPhone ?? "Not provided"}

                Subject: {email.Subject}

                Message:
                {email.Message}

                Received: {email.CreatedAtUtc:yyyy-MM-dd HH:mm:ss} UTC
                """;

            await _emailService.SendAsync(
                mailbox,
                email.RecipientEmail,
                email.Subject,
                emailBody,
                email.SenderEmail
            );

            notificationSent = true;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to send {Category} notification for enquiry {EmailId}",
                normalizedCategory,
                email.Id
            );
        }

        return Ok(new
        {
            message = notificationSent
                ? "Your enquiry has been received successfully."
                : "Your enquiry has been saved. Email notification could not be sent.",
            email.Id,
            email.Category,
            notificationSent
        });
    }

    // ADMIN: Get website enquiries from MySQL
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetEmails(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] bool archived = false,
        [FromQuery] bool unreadOnly = false)
    {
        var query = _context.EmailMessages
            .AsNoTracking()
            .AsQueryable();

        query = query.Where(e => e.IsArchived == archived);

        if (unreadOnly)
            query = query.Where(e => !e.IsRead);

        if (!string.IsNullOrWhiteSpace(category) &&
            !category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(e => e.Category == category.Trim());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();

            query = query.Where(e =>
                e.SenderName.Contains(term) ||
                e.SenderEmail.Contains(term) ||
                e.Subject.Contains(term) ||
                e.Message.Contains(term));
        }

        var emails = await query
            .OrderByDescending(e => e.CreatedAtUtc)
            .Select(e => new
            {
                e.Id,
                e.SenderName,
                e.SenderEmail,
                e.SenderPhone,
                e.RecipientEmail,
                e.Subject,
                e.Message,
                e.Category,
                e.IsRead,
                e.IsArchived,
                e.CreatedAtUtc,
                ReplyCount = e.Replies.Count
            })
            .ToListAsync();

        return Ok(emails);
    }

    // ADMIN: Get one website enquiry and mark it as read
    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetEmail(int id)
    {
        var email = await _context.EmailMessages
            .Include(e => e.Replies)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (email == null)
            return NotFound(new { message = "Email not found." });

        if (!email.IsRead)
        {
            email.IsRead = true;
            email.UpdatedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            email.Id,
            email.SenderName,
            email.SenderEmail,
            email.SenderPhone,
            email.RecipientEmail,
            email.Subject,
            email.Message,
            email.Category,
            email.IsRead,
            email.IsArchived,
            email.CreatedAtUtc,
            email.UpdatedAtUtc,
            Replies = email.Replies
                .OrderBy(r => r.CreatedAtUtc)
                .Select(r => new
                {
                    r.Id,
                    r.RecipientEmail,
                    r.Subject,
                    r.Body,
                    r.DeliveryStatus,
                    r.ProviderMessageId,
                    r.ErrorMessage,
                    r.CreatedAtUtc,
                    r.SentAtUtc
                })
        });
    }

    // ADMIN: Mark website enquiry as read or unread
    [Authorize]
    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> UpdateReadStatus(
        int id,
        [FromBody] UpdateEmailReadRequest request)
    {
        var email = await _context.EmailMessages.FindAsync(id);

        if (email == null)
            return NotFound(new { message = "Email not found." });

        email.IsRead = request.IsRead;
        email.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Email read status updated successfully.",
            email.Id,
            email.IsRead
        });
    }

    // ADMIN: Archive or restore website enquiry
    [Authorize]
    [HttpPatch("{id:int}/archive")]
    public async Task<IActionResult> UpdateArchiveStatus(
        int id,
        [FromBody] UpdateEmailArchiveRequest request)
    {
        var email = await _context.EmailMessages.FindAsync(id);

        if (email == null)
            return NotFound(new { message = "Email not found." });

        email.IsArchived = request.IsArchived;
        email.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = request.IsArchived
                ? "Email archived successfully."
                : "Email restored to inbox successfully.",
            email.Id,
            email.IsArchived
        });
    }

    // ADMIN: Delete website enquiry and reply history
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteEmail(int id)
    {
        var email = await _context.EmailMessages.FindAsync(id);

        if (email == null)
            return NotFound(new { message = "Email not found." });

        _context.EmailMessages.Remove(email);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Email deleted successfully."
        });
    }

    // =====================================================
    // CPANEL MAILBOX ENDPOINTS
    // These fetch actual emails directly through IMAP.
    // =====================================================

    // ADMIN: Get cPanel inbox
    [Authorize]
    [HttpGet("cpanel/inbox")]
    public async Task<IActionResult> GetCpanelInbox(
        [FromQuery] string mailbox = "info",
        [FromQuery] int limit = 50)
    {
        if (!IsValidMailbox(mailbox))
            return BadRequest(new { message = "Invalid mailbox. Use info or booking." });

        if (limit < 1 || limit > 100)
            return BadRequest(new { message = "Limit must be between 1 and 100." });

        try
        {
            var emails = await _emailService.GetInboxAsync(
                mailbox.ToLowerInvariant(),
                limit
            );

            return Ok(emails);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch {Mailbox} inbox.", mailbox);

            return StatusCode(502, new
            {
                message = "Unable to connect to the mailbox. Please try again."
            });
        }
    }

    // ADMIN: Get an individual cPanel email
    [Authorize]
    [HttpGet("cpanel/message/{id}")]
    public async Task<IActionResult> GetCpanelEmail(
        string id,
        [FromQuery] string mailbox = "info")
    {
        if (!IsValidMailbox(mailbox))
            return BadRequest(new { message = "Invalid mailbox. Use info or booking." });

        try
        {
            var email = await _emailService.GetEmailAsync(
                mailbox.ToLowerInvariant(),
                id
            );

            return Ok(email);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Mailbox email not found." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to open cPanel email {EmailId}.", id);

            return StatusCode(502, new
            {
                message = "Unable to open this email."
            });
        }
    }

    // ADMIN: Mark cPanel email as read or unread
    [Authorize]
    [HttpPatch("cpanel/message/{id}/read")]
    public async Task<IActionResult> UpdateCpanelReadStatus(
        string id,
        [FromBody] UpdateCpanelReadRequest request)
    {
        if (!IsValidMailbox(request.Mailbox))
            return BadRequest(new { message = "Invalid mailbox. Use info or booking." });

        try
        {
            await _emailService.UpdateReadStatusAsync(
                request.Mailbox.ToLowerInvariant(),
                id,
                request.IsRead
            );

            return Ok(new
            {
                message = "Mailbox email read status updated successfully.",
                id,
                request.Mailbox,
                request.IsRead
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Mailbox email not found." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update cPanel email read status.");

            return StatusCode(502, new
            {
                message = "Unable to update email read status."
            });
        }
    }

    // ADMIN: Reply to a cPanel email
    [Authorize]
    [HttpPost("cpanel/reply")]
    public async Task<IActionResult> ReplyToCpanelEmail(
        [FromBody] CpanelReplyRequest request)
    {
        if (!IsValidMailbox(request.Mailbox))
            return BadRequest(new { message = "Invalid mailbox. Use info or booking." });

        try
        {
            var messageId = await _emailService.ReplyAsync(
                request.Mailbox.ToLowerInvariant(),
                request.Id,
                request.Body
            );

            return Ok(new
            {
                message = "Reply sent successfully.",
                messageId
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Original email not found." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to reply to cPanel email {EmailId}.", request.Id);

            return StatusCode(502, new
            {
                message = "Unable to send your reply."
            });
        }
    }

    // ADMIN: Compose and send a new cPanel email
    [Authorize]
    [HttpPost("cpanel/send")]
    public async Task<IActionResult> SendCpanelEmail(
        [FromBody] SendCpanelEmailRequest request)
    {
        if (!IsValidMailbox(request.Mailbox))
            return BadRequest(new { message = "Invalid mailbox. Use info or booking." });

       try
{
    var messageId = await _emailService.SendAsync(
        request.Mailbox.ToLowerInvariant(),
        request.Recipient,
        request.Subject,
        request.Body,
        request.ReplyTo
    );

    return Ok(new
    {
        message = "Email sent successfully.",
        messageId
    });
}
catch (Exception ex)
{
    _logger.LogError(
        ex,
        "Failed to send cPanel email from {Mailbox}.",
        request.Mailbox
    );

    return StatusCode(502, new
    {
        message = "Unable to send your email. Please try again."
    });
}
    }

    private static bool IsValidMailbox(string? mailbox)
    {
        return mailbox?.Trim().ToLowerInvariant() is "info" or "booking";
    }
}

// =====================================================
// REQUEST DTOs
// =====================================================

public class CreateEmailMessageRequest
{
    [Required]
    [MaxLength(100)]
    public string SenderName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(254)]
    public string SenderEmail { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? SenderPhone { get; set; }

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Message { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Category { get; set; } = "Contact";
}

public class UpdateEmailReadRequest
{
    public bool IsRead { get; set; }
}

public class UpdateEmailArchiveRequest
{
    public bool IsArchived { get; set; }
}

public class UpdateCpanelReadRequest
{
    [Required]
    public string Mailbox { get; set; } = "info";

    public bool IsRead { get; set; }
}

public class CpanelReplyRequest
{
    [Required]
    public string Mailbox { get; set; } = "info";

    [Required]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Body { get; set; } = string.Empty;
}

public class SendCpanelEmailRequest
{
    [Required]
    public string Mailbox { get; set; } = "info";

    [Required]
    [EmailAddress]
    [MaxLength(254)]
    public string Recipient { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Body { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(254)]
    public string? ReplyTo { get; set; }
}
