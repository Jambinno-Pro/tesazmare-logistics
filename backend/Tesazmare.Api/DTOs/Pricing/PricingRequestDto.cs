
using System.ComponentModel.DataAnnotations;

namespace Tesazmare.Api.DTOs.Pricing;

public class PricingRequestDto
{
    [Required, StringLength(100)]
    public string ServiceType { get; set; } = "Shuttle";

    [StringLength(150)]
    public string? RouteName { get; set; }

    [Required, StringLength(200)]
    public string PickupLocation { get; set; } = string.Empty;

    [Required, StringLength(200)]
    public string DropoffLocation { get; set; } = string.Empty;

    [Range(1, 1000)]
    public int MinimumPassengers { get; set; }

    [Range(1, 1000)]
    public int MaximumPassengers { get; set; }

    [Required, RegularExpression("^(PerPassenger|FixedTrip)$")]
    public string PricingBasis { get; set; } = "PerPassenger";

    [Range(typeof(decimal), "0.01", "9999999999")]
    public decimal Amount { get; set; }

    [RegularExpression("^ZAR$")]
    public string Currency { get; set; } = "ZAR";

    public bool IsActive { get; set; } = true;

    public DateTime EffectiveFromUtc { get; set; } = DateTime.UtcNow;

    public DateTime? EffectiveUntilUtc { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }
}
