
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tesazmare.Api.Data;
using Tesazmare.Api.DTOs.Pricing;
using Tesazmare.Api.Models;

namespace Tesazmare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PricingController : ControllerBase
{
    private readonly AppDbContext _context;

    public PricingController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/pricing
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var prices = await _context.PricingRules
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync();

        return Ok(prices.Select(ToResponse));
    }

    // GET: api/pricing/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pricing = await _context.PricingRules
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pricing == null)
            return NotFound(new { message = "Pricing rule not found." });

        return Ok(ToResponse(pricing));
    }

    // POST: api/pricing
    [HttpPost]
    public async Task<IActionResult> Create(PricingRequestDto request)
    {
        var validationError = ValidateRequest(request);

        if (validationError != null)
            return BadRequest(new { message = validationError });

        var pricing = new PricingRule
        {
            ServiceType = request.ServiceType.Trim(),
            RouteName = Clean(request.RouteName),
            PickupLocation = request.PickupLocation.Trim(),
            DropoffLocation = request.DropoffLocation.Trim(),
            MinimumPassengers = request.MinimumPassengers,
            MaximumPassengers = request.MaximumPassengers,
            PricingBasis = request.PricingBasis,
            Amount = request.Amount,
            Currency = "ZAR",
            IsActive = request.IsActive,
            EffectiveFromUtc = request.EffectiveFromUtc,
            EffectiveUntilUtc = request.EffectiveUntilUtc,
            Description = Clean(request.Description),
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.PricingRules.Add(pricing);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = pricing.Id },
            ToResponse(pricing)
        );
    }

    // PUT: api/pricing/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        PricingRequestDto request)
    {
        var pricing = await _context.PricingRules
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pricing == null)
            return NotFound(new { message = "Pricing rule not found." });

        var validationError = ValidateRequest(request);

        if (validationError != null)
            return BadRequest(new { message = validationError });

        pricing.ServiceType = request.ServiceType.Trim();
        pricing.RouteName = Clean(request.RouteName);
        pricing.PickupLocation = request.PickupLocation.Trim();
        pricing.DropoffLocation = request.DropoffLocation.Trim();
        pricing.MinimumPassengers = request.MinimumPassengers;
        pricing.MaximumPassengers = request.MaximumPassengers;
        pricing.PricingBasis = request.PricingBasis;
        pricing.Amount = request.Amount;
        pricing.Currency = "ZAR";
        pricing.IsActive = request.IsActive;
        pricing.EffectiveFromUtc = request.EffectiveFromUtc;
        pricing.EffectiveUntilUtc = request.EffectiveUntilUtc;
        pricing.Description = Clean(request.Description);
        pricing.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ToResponse(pricing));
    }

    // PATCH: api/pricing/5/status
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        PricingStatusDto request)
    {
        var pricing = await _context.PricingRules
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pricing == null)
            return NotFound(new { message = "Pricing rule not found." });

        pricing.IsActive = request.IsActive;
        pricing.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ToResponse(pricing));
    }

    // DELETE: api/pricing/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var pricing = await _context.PricingRules
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pricing == null)
            return NotFound(new { message = "Pricing rule not found." });

        _context.PricingRules.Remove(pricing);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Pricing rule deleted successfully." });
    }

    private static string? ValidateRequest(PricingRequestDto request)
    {
        if (request.MinimumPassengers > request.MaximumPassengers)
            return "Minimum passengers cannot exceed maximum passengers.";

        if (request.EffectiveUntilUtc.HasValue &&
            request.EffectiveUntilUtc.Value <= request.EffectiveFromUtc)
            return "The end date must be later than the start date.";

        if (string.IsNullOrWhiteSpace(request.ServiceType) ||
            string.IsNullOrWhiteSpace(request.PickupLocation) ||
            string.IsNullOrWhiteSpace(request.DropoffLocation))
            return "Service type, pickup and drop-off locations are required.";

        return null;
    }

    private static string? Clean(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static PricingResponseDto ToResponse(PricingRule pricing)
    {
        return new PricingResponseDto
        {
            Id = pricing.Id,
            ServiceType = pricing.ServiceType,
            RouteName = pricing.RouteName,
            PickupLocation = pricing.PickupLocation,
            DropoffLocation = pricing.DropoffLocation,
            MinimumPassengers = pricing.MinimumPassengers,
            MaximumPassengers = pricing.MaximumPassengers,
            PricingBasis = pricing.PricingBasis,
            Amount = pricing.Amount,
            Currency = pricing.Currency,
            IsActive = pricing.IsActive,
            EffectiveFromUtc = pricing.EffectiveFromUtc,
            EffectiveUntilUtc = pricing.EffectiveUntilUtc,
            Description = pricing.Description,
            CreatedAtUtc = pricing.CreatedAtUtc,
            UpdatedAtUtc = pricing.UpdatedAtUtc
        };
    }
}
