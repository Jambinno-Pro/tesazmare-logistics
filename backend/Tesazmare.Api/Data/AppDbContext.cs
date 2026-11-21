
using Microsoft.EntityFrameworkCore;
using Tesazmare.Api.Models;

namespace Tesazmare.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    public DbSet<Booking> Bookings => Set<Booking>();

    public DbSet<PricingRule> PricingRules => Set<PricingRule>();

    public DbSet<Review> Reviews { get; set; }

    public DbSet<EmailMessage> EmailMessages => Set<EmailMessage>();

    public DbSet<EmailReply> EmailReplies => Set<EmailReply>();


    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Admin Users
        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(e => e.Email)
                .HasMaxLength(254)
                .IsRequired();

            entity.Property(e => e.EmailNormalized)
                .HasMaxLength(254)
                .IsRequired();

            entity.HasIndex(e => e.EmailNormalized)
                .IsUnique();

            entity.Property(e => e.PasswordHash)
                .IsRequired();

            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsRequired();
        });

        // Bookings
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.BookingReference)
                .HasMaxLength(30)
                .IsRequired();

            entity.HasIndex(e => e.BookingReference)
                .IsUnique();

            entity.Property(e => e.CustomerName)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(e => e.CustomerEmail)
                .HasMaxLength(254)
                .IsRequired();

            entity.Property(e => e.CustomerPhone)
                .HasMaxLength(30)
                .IsRequired();

            entity.Property(e => e.ServiceType)
                .HasMaxLength(60)
                .IsRequired();

            entity.Property(e => e.PickupLocation)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.DropoffLocation)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(30);

            entity.Property(e => e.CustomerNotes)
                .HasMaxLength(2000);

            entity.Property(e => e.AdminNotes)
                .HasMaxLength(2000);
        });


        // Pricing Rules
        modelBuilder.Entity<PricingRule>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.ServiceType)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.RouteName)
                .HasMaxLength(150);

            entity.Property(e => e.PickupLocation)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.DropoffLocation)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.PricingBasis)
                .HasMaxLength(30)
                .IsRequired();

            entity.Property(e => e.Amount)
                .HasPrecision(12, 2);

            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .IsRequired();

            entity.Property(e => e.Description)
                .HasMaxLength(1000);

            entity.HasIndex(e => new
            {
                e.ServiceType,
                e.PickupLocation,
                e.DropoffLocation,
                e.MinimumPassengers,
                e.MaximumPassengers
            });
        });

         // Gallery Images
         modelBuilder.Entity<GalleryImage>(entity =>
{
    entity.HasKey(e => e.Id);

    entity.Property(e => e.Title)
        .HasMaxLength(150)
        .IsRequired();

    entity.Property(e => e.Category)
        .HasMaxLength(100)
        .IsRequired();

    entity.Property(e => e.Description)
        .HasMaxLength(1000);

    entity.Property(e => e.ImageUrl)
        .HasMaxLength(500)
        .IsRequired();

    entity.Property(e => e.AltText)
        .HasMaxLength(250);

    entity.HasIndex(e => new
    {
        e.IsPublished,
        e.DisplayOrder
    });
});


    }
}
