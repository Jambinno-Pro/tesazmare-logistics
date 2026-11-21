
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tesazmare.Api.Data;
using Tesazmare.Api.Models;

namespace Tesazmare.Api.Controllers;

[ApiController]
[Route("api/admin-setup")]
[AllowAnonymous]
public class AdminSetupController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<AdminUser> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AdminSetupController(
        AppDbContext context,
        IPasswordHasher<AdminUser> passwordHasher,
        IConfiguration configuration)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    [HttpPost]
    public async Task<IActionResult> CreateFirstAdmin(
        [FromBody] AdminSetupRequest request)
    {
        var configuredKey = _configuration["AdminSetup:Key"];

        if (string.IsNullOrWhiteSpace(configuredKey))
        {
            return StatusCode(503, new
            {
                message = "Administrator setup is not configured."
            });
        }

        var suppliedKey = Encoding.UTF8.GetBytes(request.SetupKey);
        var expectedKey = Encoding.UTF8.GetBytes(configuredKey);

        if (!CryptographicOperations.FixedTimeEquals(
                suppliedKey, expectedKey))
        {
            return Unauthorized(new
            {
                message = "Invalid setup key."
            });
        }

        if (await _context.AdminUsers.AnyAsync())
        {
            return Conflict(new
            {
                message = "An administrator already exists. Setup is closed."
            });
        }

        var email = request.Email.Trim();
        var normalizedEmail = email.ToUpperInvariant();

        var admin = new AdminUser
        {
            FullName = request.FullName.Trim(),
            Email = email,
            EmailNormalized = normalizedEmail,
            Role = "Administrator",
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        admin.PasswordHash = _passwordHasher.HashPassword(
            admin,
            request.Password
        );

        _context.AdminUsers.Add(admin);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "First administrator created successfully.",
            user = new
            {
                admin.Id,
                admin.FullName,
                admin.Email,
                admin.Role
            }
        });
    }
}

public class AdminSetupRequest
{
    [Required]
    [MinLength(32)]
    public string SetupKey { get; set; } = string.Empty;

    [Required]
    [StringLength(150, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(254)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(12)]
    [MaxLength(200)]
    public string Password { get; set; } = string.Empty;
}
