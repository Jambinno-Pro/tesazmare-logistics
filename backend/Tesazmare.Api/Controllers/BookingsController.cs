
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tesazmare.Api.Data;
using Tesazmare.Api.Models;
using Tesazmare.Api.Models.Enums;

namespace Tesazmare.Api.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookingsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/bookings
    // Optional: ?search=John&status=Pending
    [HttpGet]
    public async Task<IActionResult> GetBookings(
        [FromQuery] string? search,
        [FromQuery] string? status)
    {
        var query = _context.Bookings.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();

            query = query.Where(b =>
                b.CustomerName.Contains(term) ||
                b.CustomerEmail.Contains(term) ||
                b.CustomerPhone.Contains(term) ||
                b.BookingReference.Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            if (!Enum.TryParse<BookingStatus>(
                    status, true, out var parsedStatus) ||
                !Enum.IsDefined(parsedStatus))
            {
                return BadRequest(new { message = "Invalid booking status." });
            }

            query = query.Where(b => b.Status == parsedStatus);
        }

        var bookings = await query
            .OrderByDescending(b => b.CreatedAtUtc)
            .Select(b => new
            {
                b.Id,
                b.BookingReference,
                b.CustomerName,
                b.CustomerEmail,
                b.CustomerPhone,
                b.ServiceType,
                b.PickupLocation,
                b.DropoffLocation,
                b.TravelDate,
                b.PassengerCount,
                b.IsReturnTrip,
                b.ReturnTravelDate,
                Status = b.Status.ToString(),
                b.CustomerNotes,
                b.AdminNotes,
                b.CreatedAtUtc,
                b.UpdatedAtUtc
            })
            .ToListAsync();

        return Ok(bookings);
    }

    // GET: api/bookings/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBooking(int id)
    {
        var booking = await _context.Bookings
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new
            {
                b.Id,
                b.BookingReference,
                b.CustomerName,
                b.CustomerEmail,
                b.CustomerPhone,
                b.ServiceType,
                b.PickupLocation,
                b.DropoffLocation,
                b.TravelDate,
                b.PassengerCount,
                b.IsReturnTrip,
                b.ReturnTravelDate,
                Status = b.Status.ToString(),
                b.CustomerNotes,
                b.AdminNotes,
                b.CreatedAtUtc,
                b.UpdatedAtUtc
            })
            .FirstOrDefaultAsync();

        if (booking == null)
            return NotFound(new { message = "Booking not found." });

        return Ok(booking);
    }

    // PATCH: api/bookings/1/status
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateBookingStatus(
        int id,
        [FromBody] UpdateBookingStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Status) ||
            !Enum.TryParse<BookingStatus>(
                request.Status, true, out var newStatus) ||
            !Enum.IsDefined(newStatus))
        {
            return BadRequest(new { message = "Invalid booking status." });
        }

        var booking = await _context.Bookings.FindAsync(id);

        if (booking == null)
            return NotFound(new { message = "Booking not found." });

        booking.Status = newStatus;
        booking.UpdatedAtUtc = DateTime.UtcNow;

        if (request.AdminNotes != null)
            booking.AdminNotes = request.AdminNotes.Trim();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Booking updated successfully.",
            id = booking.Id,
            status = booking.Status.ToString(),
            adminNotes = booking.AdminNotes
        });
    }

    // DELETE: api/bookings/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);

        if (booking == null)
            return NotFound(new { message = "Booking not found." });

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Booking deleted successfully." });
    }
}

public class UpdateBookingStatusRequest
{
    public string Status { get; set; } = string.Empty;

    public string? AdminNotes { get; set; }
}
