
using System.ComponentModel.DataAnnotations;

namespace Tesazmare.Api.Models;

public class EmailReply
{
    public int Id { get; set; }

    public int EmailMessageId { get; set; }

    public EmailMessage? EmailMessage { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(254)]
    public string RecipientEmail { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Body { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string DeliveryStatus { get; set; } = "Pending";

    [MaxLength(255)]
    public string? ProviderMessageId { get; set; }

    [MaxLength(1000)]
    public string? ErrorMessage { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? SentAtUtc { get; set; }
}
