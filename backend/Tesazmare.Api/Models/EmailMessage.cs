
using System.ComponentModel.DataAnnotations;

namespace Tesazmare.Api.Models;

public class EmailMessage
{
    public int Id { get; set; }

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
    [EmailAddress]
    [MaxLength(254)]
    public string RecipientEmail { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Message { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Category { get; set; } = "Contact";

    public bool IsRead { get; set; } = false;

    public bool IsArchived { get; set; } = false;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }

    public ICollection<EmailReply> Replies { get; set; } =
        new List<EmailReply>();
}
