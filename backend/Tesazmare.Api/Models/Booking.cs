
using Tesazmare.Api.Models.Enums;

namespace Tesazmare.Api.Models;

public class Booking
{
    public int Id { get; set; }

    public string BookingReference { get; set; } = string.Empty;

    // Customer information
    public string CustomerName { get; set; } = string.Empty;

    public string CustomerEmail { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;

    // Shuttle booking information
    public string ServiceType { get; set; } = "Shuttle";

    public string PickupLocation { get; set; } = string.Empty;

    public string DropoffLocation { get; set; } = string.Empty;

    public DateTime TravelDate { get; set; }

    public int PassengerCount { get; set; }

    // Optional return journey
    public bool IsReturnTrip { get; set; }

    public DateTime? ReturnTravelDate { get; set; }

    // Booking management
    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    public string? CustomerNotes { get; set; }

    public string? AdminNotes { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }
}
