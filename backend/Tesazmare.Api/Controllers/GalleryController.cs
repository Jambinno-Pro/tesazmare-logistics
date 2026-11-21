
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tesazmare.Api.Data;
using Tesazmare.Api.Models;

namespace Tesazmare.Api.Controllers;

[ApiController]
[Route("api/gallery")]
[Authorize]
public class GalleryController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    private const long MaxFileSize = 8 * 1024 * 1024;

    private static readonly string[] AllowedCategories =
    {
        "Our Fleet",
        "Destinations",
        "Travel Experiences",
        "Our Services"
    };

    public GalleryController(
        AppDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    private string GalleryFolder =>
        Path.Combine(
            _environment.ContentRootPath,
            "App_Data",
            "Gallery"
        );

    // PUBLIC: Get published gallery images
    [AllowAnonymous]
    [HttpGet("published")]
    public async Task<IActionResult> GetPublishedImages()
    {
        var images = await _context.GalleryImages
            .AsNoTracking()
            .Where(image => image.IsPublished)
            .OrderBy(image => image.DisplayOrder)
            .ThenByDescending(image => image.CreatedAtUtc)
            .Select(image => new
            {
                image.Id,
                image.Title,
                image.Category,
                image.Description,
                image.AltText,
                image.DisplayOrder,
                ImageUrl = $"/api/gallery/{image.Id}/image"
            })
            .ToListAsync();

        return Ok(images);
    }

    // ADMIN: Get all gallery images
    [HttpGet("admin")]
    public async Task<IActionResult> GetAllImages()
    {
        var images = await _context.GalleryImages
            .AsNoTracking()
            .OrderBy(image => image.DisplayOrder)
            .ThenByDescending(image => image.CreatedAtUtc)
            .Select(image => new
            {
                image.Id,
                image.Title,
                image.Category,
                image.Description,
                image.AltText,
                image.IsPublished,
                image.DisplayOrder,
                image.CreatedAtUtc,
                image.UpdatedAtUtc,
                ImageUrl = $"/api/gallery/admin/{image.Id}/image"
            })
            .ToListAsync();

        return Ok(images);
    }

    // PUBLIC: Retrieve an image only if it is published
    [AllowAnonymous]
    [HttpGet("{id:int}/image")]
    public async Task<IActionResult> GetPublishedImage(int id)
    {
        var image = await _context.GalleryImages
            .AsNoTracking()
            .FirstOrDefaultAsync(image =>
                image.Id == id && image.IsPublished);

        if (image == null)
            return NotFound();

        return await ServeImageAsync(image.ImageUrl);
    }

    // ADMIN: Retrieve published or unpublished images
    [HttpGet("admin/{id:int}/image")]
    public async Task<IActionResult> GetAdminImage(int id)
    {
        var image = await _context.GalleryImages
            .AsNoTracking()
            .FirstOrDefaultAsync(image => image.Id == id);

        if (image == null)
            return NotFound();

        return await ServeImageAsync(image.ImageUrl);
    }

    // ADMIN: Upload a new image
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage(
        [FromForm] GalleryImageRequest request)
    {
        var validationError = ValidateRequest(request);

        if (validationError != null)
            return BadRequest(new { message = validationError });

        var savedFileName = await SaveImageAsync(request.Image!);

        var image = new GalleryImage
        {
            Title = request.Title.Trim(),
            Category = request.Category.Trim(),
            Description = request.Description?.Trim() ?? string.Empty,
            AltText = request.AltText?.Trim() ?? request.Title.Trim(),
            ImageUrl = savedFileName,
            IsPublished = request.IsPublished,
            DisplayOrder = request.DisplayOrder,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.GalleryImages.Add(image);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetAdminImage),
            new { id = image.Id },
            new
            {
                image.Id,
                image.Title,
                image.Category,
                image.Description,
                image.AltText,
                image.IsPublished,
                image.DisplayOrder,
                ImageUrl = $"/api/gallery/admin/{image.Id}/image"
            }
        );
    }

    // ADMIN: Update image details or replace the image file
    [HttpPut("{id:int}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateImage(
        int id,
        [FromForm] GalleryImageRequest request)
    {
        var image = await _context.GalleryImages
            .FirstOrDefaultAsync(item => item.Id == id);

        if (image == null)
            return NotFound(new { message = "Gallery image not found." });

        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Title is required." });

        if (request.Title.Trim().Length > 150)
            return BadRequest(new { message = "Title cannot exceed 150 characters." });

        if (!IsValidCategory(request.Category))
            return BadRequest(new { message = "Please select a valid category." });

        if (request.Description?.Length > 1000)
            return BadRequest(new { message = "Description cannot exceed 1000 characters." });

        if (request.AltText?.Length > 250)
            return BadRequest(new { message = "Alternative text cannot exceed 250 characters." });

        string? oldFileName = null;

        if (request.Image != null)
        {
            var validationError = ValidateImage(request.Image);

            if (validationError != null)
                return BadRequest(new { message = validationError });

            oldFileName = image.ImageUrl;

            var newFileName = await SaveImageAsync(request.Image);

            image.ImageUrl = newFileName;
        }

        image.Title = request.Title.Trim();
        image.Category = request.Category.Trim();
        image.Description = request.Description?.Trim() ?? string.Empty;
        image.AltText = request.AltText?.Trim() ?? request.Title.Trim();
        image.IsPublished = request.IsPublished;
        image.DisplayOrder = request.DisplayOrder;
        image.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Delete the old file only after the database update succeeds
        if (!string.IsNullOrWhiteSpace(oldFileName))
        {
            DeleteStoredImage(oldFileName);
        }

        return Ok(new
        {
            message = "Gallery image updated successfully.",
            image.Id,
            image.Title,
            image.Category,
            image.Description,
            image.AltText,
            image.IsPublished,
            image.DisplayOrder,
            ImageUrl = $"/api/gallery/admin/{image.Id}/image"
        });
    }

    // ADMIN: Publish or unpublish an image
    [HttpPatch("{id:int}/publish")]
    public async Task<IActionResult> UpdatePublishStatus(
        int id,
        [FromBody] GalleryPublishRequest request)
    {
        var image = await _context.GalleryImages
            .FirstOrDefaultAsync(item => item.Id == id);

        if (image == null)
            return NotFound(new { message = "Gallery image not found." });

        image.IsPublished = request.IsPublished;
        image.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = request.IsPublished
                ? "Gallery image published successfully."
                : "Gallery image unpublished successfully.",
            image.Id,
            image.IsPublished
        });
    }

    // ADMIN: Delete an image and its stored file
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteImage(int id)
    {
        var image = await _context.GalleryImages
            .FirstOrDefaultAsync(item => item.Id == id);

        if (image == null)
            return NotFound(new { message = "Gallery image not found." });

        var fileName = image.ImageUrl;

        _context.GalleryImages.Remove(image);
        await _context.SaveChangesAsync();

        DeleteStoredImage(fileName);

        return Ok(new
        {
            message = "Gallery image deleted successfully."
        });
    }

    // Validate the image metadata and upload
    private string? ValidateRequest(GalleryImageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return "Image title is required.";

        if (request.Title.Trim().Length > 150)
            return "Image title cannot exceed 150 characters.";

        if (!IsValidCategory(request.Category))
            return "Please select a valid category.";

        if (request.Description?.Length > 1000)
            return "Description cannot exceed 1000 characters.";

        if (request.AltText?.Length > 250)
            return "Alternative text cannot exceed 250 characters.";

        if (request.Image == null)
            return "Please select an image to upload.";

        return ValidateImage(request.Image);
    }

    private static bool IsValidCategory(string? category)
    {
        return !string.IsNullOrWhiteSpace(category)
            && AllowedCategories.Contains(
                category.Trim(),
                StringComparer.OrdinalIgnoreCase
            );
    }

    private static string? ValidateImage(IFormFile file)
    {
        if (file.Length <= 0)
            return "The selected image is empty.";

        if (file.Length > MaxFileSize)
            return "Images cannot exceed 8 MB.";

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (extension is not ".jpg" and not ".jpeg" and not ".png" and not ".webp")
            return "Only JPG, PNG and WebP images are supported.";

        using var stream = file.OpenReadStream();

        var header = new byte[12];
        var bytesRead = stream.Read(header, 0, header.Length);

        var isJpeg =
            bytesRead >= 3 &&
            header[0] == 0xFF &&
            header[1] == 0xD8 &&
            header[2] == 0xFF;

        var isPng =
            bytesRead >= 8 &&
            header[0] == 0x89 &&
            header[1] == 0x50 &&
            header[2] == 0x4E &&
            header[3] == 0x47 &&
            header[4] == 0x0D &&
            header[5] == 0x0A &&
            header[6] == 0x1A &&
            header[7] == 0x0A;

        var isWebP =
            bytesRead >= 12 &&
            header[0] == (byte)'R' &&
            header[1] == (byte)'I' &&
            header[2] == (byte)'F' &&
            header[3] == (byte)'F' &&
            header[8] == (byte)'W' &&
            header[9] == (byte)'E' &&
            header[10] == (byte)'B' &&
            header[11] == (byte)'P';

        var extensionMatches =
            (isJpeg && (extension == ".jpg" || extension == ".jpeg")) ||
            (isPng && extension == ".png") ||
            (isWebP && extension == ".webp");

        if (!extensionMatches)
            return "The file content does not match a supported image format.";

        return null;
    }

    // Save uploads using generated filenames, never the supplied filename
    private async Task<string> SaveImageAsync(IFormFile file)
    {
        Directory.CreateDirectory(GalleryFolder);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(GalleryFolder, fileName);

        await using var stream = new FileStream(
            filePath,
            FileMode.CreateNew,
            FileAccess.Write,
            FileShare.None
        );

        await file.CopyToAsync(stream);

        return fileName;
    }

    // Serve only files referenced by a database record
    private async Task<IActionResult> ServeImageAsync(string storedFileName)
    {
        var safeFileName = Path.GetFileName(storedFileName);
        var filePath = Path.Combine(GalleryFolder, safeFileName);

        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var extension = Path.GetExtension(safeFileName).ToLowerInvariant();

        var contentType = extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };

        var stream = new FileStream(
            filePath,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read
        );

        return File(stream, contentType);
    }

    private void DeleteStoredImage(string storedFileName)
    {
        var safeFileName = Path.GetFileName(storedFileName);
        var filePath = Path.Combine(GalleryFolder, safeFileName);

        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);
    }
}

public class GalleryImageRequest
{
    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? AltText { get; set; }

    public bool IsPublished { get; set; }

    public int DisplayOrder { get; set; }

    public IFormFile? Image { get; set; }
}

public class GalleryPublishRequest
{
    public bool IsPublished { get; set; }
}
