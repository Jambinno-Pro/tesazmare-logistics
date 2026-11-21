
using MailKit;
using MailKit.Net.Imap;
using MailKit.Net.Smtp;
using MailKit.Search;
using MailKit.Security;
using MimeKit;

namespace Tesazmare.Api.Services;

public class CpanelEmailService
{
    private readonly IConfiguration _configuration;

    public CpanelEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // GET MAILBOX CONFIGURATION
    private IConfigurationSection GetMailbox(string mailbox)
    {
        return mailbox.ToLowerInvariant() switch
        {
            "info" => _configuration.GetSection("Email:Info"),
            "booking" => _configuration.GetSection("Email:Booking"),
            _ => throw new ArgumentException("Unknown email mailbox.")
        };
    }

    private (string Host, int Port, string Username, string Password)
        GetCredentials(string mailbox, bool imap = false)
    {
        var section = GetMailbox(mailbox);

        var host = imap
            ? _configuration["Email:ImapHost"] ?? _configuration["Email:Host"]
            : _configuration["Email:Host"];

        var port = imap
            ? _configuration.GetValue<int>("Email:ImapPort", 993)
            : _configuration.GetValue<int>("Email:Port", 465);

        var username = section["Username"];
        var password = section["Password"];

        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException(
                $"Email configuration for {mailbox} is incomplete."
            );
        }

        return (host, port, username, password);
    }

    // CONNECT TO IMAP
    private async Task<ImapClient> ConnectImapAsync(string mailbox)
    {
        var credentials = GetCredentials(mailbox, true);

        var client = new ImapClient();

        try
        {
            await client.ConnectAsync(
                credentials.Host,
                credentials.Port,
                SecureSocketOptions.SslOnConnect
            );

            await client.AuthenticateAsync(
                credentials.Username,
                credentials.Password
            );

            return client;
        }
        catch
        {
            client.Dispose();
            throw;
        }
    }

    // FETCH INBOX EMAILS
    public async Task<IReadOnlyList<EmailSummaryDto>> GetInboxAsync(
        string mailbox,
        int limit = 50)
    {
        using var client = await ConnectImapAsync(mailbox);

        var folder = client.Inbox;

        await folder.OpenAsync(FolderAccess.ReadOnly);

        var uids = await folder.SearchAsync(SearchQuery.All);

        var latestUids = uids
            .OrderByDescending(x => x.Id)
            .Take(Math.Clamp(limit, 1, 100))
            .ToList();

        if (latestUids.Count == 0)
        {
            await client.DisconnectAsync(true);
            return Array.Empty<EmailSummaryDto>();
        }

        var summaries = await folder.FetchAsync(
            latestUids,
            MessageSummaryItems.Envelope |
            MessageSummaryItems.Flags |
            MessageSummaryItems.InternalDate
        );

       var emails = summaries
    .OrderByDescending(x => x.UniqueId.Id)
    .Select(x =>
    {
        var envelope = x.Envelope;
        var sender = envelope?.From?.Mailboxes?.FirstOrDefault();

        return new EmailSummaryDto
        {
            Id = x.UniqueId.Id.ToString(),
            SenderName = sender?.Name
                ?? sender?.Address
                ?? "Unknown",

            SenderEmail = sender?.Address ?? "",

            Subject = envelope?.Subject ?? "(No subject)",

            Date = envelope?.Date,

            IsRead = x.Flags?.HasFlag(MessageFlags.Seen) ?? false
        };
    })
    .ToList();

await client.DisconnectAsync(true);

return emails;
    }

    // READ INDIVIDUAL EMAIL
    public async Task<EmailDetailsDto?> GetEmailAsync(
        string mailbox,
        string id)
    {
        if (!uint.TryParse(id, out var uidValue))
        {
            throw new ArgumentException("Invalid email ID.");
        }

        using var client = await ConnectImapAsync(mailbox);

        var folder = client.Inbox;

        await folder.OpenAsync(FolderAccess.ReadWrite);

        var uid = new UniqueId(uidValue);

     var matchingMessages = await folder.FetchAsync(
    new[] { uid },
    MessageSummaryItems.UniqueId
    );

    if (matchingMessages.Count == 0)
    {
    throw new KeyNotFoundException("Email not found.");
    }

        var message = await folder.GetMessageAsync(uid);

        // Mark as read
        await folder.AddFlagsAsync(
            uid,
            MessageFlags.Seen,
            true
        );

        var sender = message.From.Mailboxes.FirstOrDefault();

        var result = new EmailDetailsDto
        {
            Id = id,
            SenderName = sender?.Name ?? sender?.Address ?? "Unknown",
            SenderEmail = sender?.Address ?? "",
            Recipients = message.To.Mailboxes
                .Select(x => x.Address)
                .ToList(),
            Subject = message.Subject ?? "(No subject)",
            TextBody = message.TextBody ?? "",
            HtmlBody = message.HtmlBody,
            Date = message.Date,
            MessageId = message.MessageId,
            IsRead = true
        };

        await client.DisconnectAsync(true);

        return result;
    }

    // MARK AS READ / UNREAD
    public async Task<bool> UpdateReadStatusAsync(
        string mailbox,
        string id,
        bool isRead)
    {
        if (!uint.TryParse(id, out var uidValue))
        {
            throw new ArgumentException("Invalid email ID.");
        }

        using var client = await ConnectImapAsync(mailbox);

        var folder = client.Inbox;

        await folder.OpenAsync(FolderAccess.ReadWrite);

        var uid = new UniqueId(uidValue);

       var matchingMessages = await folder.FetchAsync(
    new[] { uid },
    MessageSummaryItems.UniqueId
    );

    if (matchingMessages.Count == 0)
   {
    throw new KeyNotFoundException("Email not found.");
    }

        if (isRead)
        {
            await folder.AddFlagsAsync(uid, MessageFlags.Seen, true);
        }
        else
        {
            await folder.RemoveFlagsAsync(uid, MessageFlags.Seen, true);
        }

        await client.DisconnectAsync(true);

        return true;
    }

    // COMPOSE AND SEND EMAIL
    public async Task<string> SendAsync(
        string mailbox,
        string recipient,
        string subject,
        string body,
        string? replyTo = null)
    {
        var email = new MimeMessage();

        var credentials = GetCredentials(mailbox);

        email.From.Add(
            new MailboxAddress("TESAZMARE Logistics", credentials.Username)
        );

        email.To.Add(MailboxAddress.Parse(recipient));

        if (!string.IsNullOrWhiteSpace(replyTo))
        {
            email.ReplyTo.Add(MailboxAddress.Parse(replyTo));
        }

        email.Subject = subject;

        email.Body = new TextPart("plain")
        {
            Text = body
        };

        return await SendMessageAsync(mailbox, email);
    }

    // REPLY TO EXISTING EMAIL
    public async Task<string> ReplyAsync(
        string mailbox,
        string id,
        string body)
    {
        if (!uint.TryParse(id, out var uidValue))
        {
            throw new ArgumentException("Invalid email ID.");
        }

        using var client = await ConnectImapAsync(mailbox);

        var folder = client.Inbox;

        await folder.OpenAsync(FolderAccess.ReadOnly);

        var uid = new UniqueId(uidValue);

        var matchingMessages = await folder.FetchAsync(
    new[] { uid },
    MessageSummaryItems.UniqueId
    );

     if (matchingMessages.Count == 0)
  {
    throw new KeyNotFoundException("Email not found.");
   }

        var original = await folder.GetMessageAsync(uid);

        var credentials = GetCredentials(mailbox);

        var reply = new MimeMessage();

        reply.From.Add(
            new MailboxAddress("TESAZMARE Logistics", credentials.Username)
        );

      // Reply to the original sender
var recipients = original.ReplyTo.Count > 0
    ? original.ReplyTo
    : original.From;

reply.To.AddRange(recipients);

// Set reply subject safely
var originalSubject = original.Subject ?? string.Empty;

reply.Subject = originalSubject.StartsWith(
    "Re:",
    StringComparison.OrdinalIgnoreCase
)
    ? originalSubject
    : $"Re: {originalSubject}";

        // Preserve email conversation threading
        if (!string.IsNullOrWhiteSpace(original.MessageId))
        {
            reply.InReplyTo = original.MessageId;

            foreach (var reference in original.References)
            {
                reply.References.Add(reference);
            }

            reply.References.Add(original.MessageId);
        }

        reply.Body = new TextPart("plain")
        {
            Text = body
        };

        await client.DisconnectAsync(true);

        return await SendMessageAsync(mailbox, reply);
    }

    // SMTP SENDING
    private async Task<string> SendMessageAsync(
        string mailbox,
        MimeMessage email)
    {
        var credentials = GetCredentials(mailbox);

        using var smtp = new SmtpClient();

        try
        {
            await smtp.ConnectAsync(
                credentials.Host,
                credentials.Port,
                SecureSocketOptions.SslOnConnect
            );

            await smtp.AuthenticateAsync(
                credentials.Username,
                credentials.Password
            );

           await smtp.SendAsync(email);

           await smtp.DisconnectAsync(true);

           return email.MessageId ?? string.Empty;
        }
        finally
        {
            if (smtp.IsConnected)
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}

// EMAIL LIST DTO
public class EmailSummaryDto
{
    public string Id { get; set; } = "";

    public string SenderName { get; set; } = "";

    public string SenderEmail { get; set; } = "";

    public string Subject { get; set; } = "";

    public DateTimeOffset? Date { get; set; }

    public bool IsRead { get; set; }
}

// EMAIL DETAILS DTO
public class EmailDetailsDto
{
    public string Id { get; set; } = "";

    public string SenderName { get; set; } = "";

    public string SenderEmail { get; set; } = "";

    public List<string> Recipients { get; set; } = new();

    public string Subject { get; set; } = "";

    public string TextBody { get; set; } = "";

    public string? HtmlBody { get; set; }

    public DateTimeOffset Date { get; set; }

    public string? MessageId { get; set; }

    public bool IsRead { get; set; }
}
