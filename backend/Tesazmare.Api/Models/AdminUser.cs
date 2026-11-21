
namespace Tesazmare.Api.Models;

public class AdminUser
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string EmailNormalized { get; set; } = string.Empty;

    // Store a password hash, NEVER a plain-text password.
    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "Administrator";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }

    public DateTime? LastLoginAtUtc { get; set; }
}
