
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Tesazmare.Api.Data;
using Tesazmare.Api.Models;

namespace Tesazmare.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    // PUBLIC: Submit a customer review
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> SubmitReview(
        [FromBody] CreateReviewRequest request)
    {
        var review = new Review
        {
            CustomerName = request.CustomerName.Trim(),
            CustomerEmail = string.IsNullOrWhiteSpace(request.CustomerEmail)
                ? null
                : request.CustomerEmail.Trim(),
            Rating = request.Rating,
            Comment = request.Comment.Trim(),
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

       return Ok(new
{
    message = "Thank you! Your review has been submitted for approval.",
    review.Id,
    review.Status
});
    }

    // PUBLIC: Get approved reviews only
    [AllowAnonymous]
    [HttpGet("approved")]
    public async Task<IActionResult> GetApprovedReviews()
    {
        var reviews = await _context.Reviews
            .AsNoTracking()
            .Where(r => r.Status == "Approved")
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new
            {
                r.Id,
                r.CustomerName,
                r.Rating,
                r.Comment,
                r.CreatedAtUtc
            })
            .ToListAsync();

        var averageRating = reviews.Count > 0
            ? Math.Round(reviews.Average(r => r.Rating), 1)
            : 0;

        return Ok(new
        {
            totalReviews = reviews.Count,
            averageRating,
            reviews
        });
    }

    // ADMIN: Get all reviews
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetReviews(
        [FromQuery] string? search,
        [FromQuery] string? status)
    {
        var query = _context.Reviews
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();

            query = query.Where(r =>
                r.CustomerName.Contains(term) ||
                r.Comment.Contains(term) ||
                (r.CustomerEmail != null &&
                 r.CustomerEmail.Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalizedStatus = status.Trim();

            if (!new[] { "Pending", "Approved", "Rejected" }
                .Contains(normalizedStatus, StringComparer.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    message = "Invalid review status."
                });
            }

            query = query.Where(r =>
                r.Status.ToLower() == normalizedStatus.ToLower());
        }

        var reviews = await query
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new
            {
                r.Id,
                r.CustomerName,
                r.CustomerEmail,
                r.Rating,
                r.Comment,
                r.Status,
                r.CreatedAtUtc,
                r.UpdatedAtUtc
            })
            .ToListAsync();

        return Ok(reviews);
    }

    // ADMIN: Approve or reject a review
    [Authorize]
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateReviewStatus(
        int id,
        [FromBody] UpdateReviewStatusRequest request)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        var newStatus = request.Status.Trim();

        if (!new[] { "Pending", "Approved", "Rejected" }
            .Contains(newStatus, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "Status must be Pending, Approved or Rejected."
            });
        }

        review.Status = newStatus switch
        {
            "approved" => "Approved",
            "rejected" => "Rejected",
            "pending" => "Pending",
            _ => newStatus
        };

        review.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Review {review.Status.ToLower()} successfully.",
            review.Id,
            review.Status
        });
    }

    // ADMIN: Delete a review
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Review deleted successfully."
        });
    }
}

// Customer submission request
public class CreateReviewRequest
{
    [Required]
    [MaxLength(100)]
    public string CustomerName { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(254)]
    public string? CustomerEmail { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Comment { get; set; } = string.Empty;
}

// Admin status update request
public class UpdateReviewStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
