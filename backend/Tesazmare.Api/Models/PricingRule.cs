
namespace Tesazmare.Api.Models;

public class PricingRule
{
    public int Id { get; set; }

    // Service information
    public string ServiceType { get; set; } = "Shuttle";

    public string? RouteName { get; set; }

    public string PickupLocation { get; set; } = string.Empty;

    public string DropoffLocation { get; set; } = string.Empty;

    // Passenger range
    public int MinimumPassengers { get; set; }

    public int MaximumPassengers { get; set; }

    // Pricing
    // PerPassenger or FixedTrip
    public string PricingBasis { get; set; } = "PerPassenger";

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "ZAR";

    // Management
    public bool IsActive { get; set; } = true;

    public DateTime EffectiveFromUtc { get; set; } = DateTime.UtcNow;

    public DateTime? EffectiveUntilUtc { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }
}
