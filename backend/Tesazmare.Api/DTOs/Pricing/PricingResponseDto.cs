
namespace Tesazmare.Api.DTOs.Pricing;

public class PricingResponseDto
{
    public int Id { get; set; }

    public string ServiceType { get; set; } = string.Empty;

    public string? RouteName { get; set; }

    public string PickupLocation { get; set; } = string.Empty;

    public string DropoffLocation { get; set; } = string.Empty;

    public int MinimumPassengers { get; set; }

    public int MaximumPassengers { get; set; }

    public string PricingBasis { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "ZAR";

    public bool IsActive { get; set; }

    public DateTime EffectiveFromUtc { get; set; }

    public DateTime? EffectiveUntilUtc { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}
