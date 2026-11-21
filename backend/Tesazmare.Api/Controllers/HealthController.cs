
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tesazmare.Api.Data;

namespace Tesazmare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<HealthController> _logger;

    public HealthController(
        AppDbContext context,
        ILogger<HealthController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("database")]
    public async Task<IActionResult> CheckDatabase()
    {
        try
        {
            var connected = await _context.Database.CanConnectAsync();

            if (!connected)
            {
                return StatusCode(503, new
                {
                    status = "Error",
                    message = "Could not connect to MySQL."
                });
            }

            return Ok(new
            {
                status = "Success",
                message = "Connected to TESAZMARE MySQL database.",
                database = "tesazmare_logistics"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "MySQL database connection failed.");

            return StatusCode(503, new
            {
                status = "Error",
                message = "Database connection failed."
            });
        }
    }
}
