using CasaNova.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CasaNova.Infrastructure.Persistence.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(b => b.Id);
        builder.Property(b => b.TotalPrice).HasPrecision(18, 2);
        builder.Property(b => b.Status).HasConversion<string>();

        // Índice para optimizar búsquedas de disponibilidad
        builder.HasIndex(b => new { b.PropertyId, b.CheckIn, b.CheckOut });

        builder.HasOne(b => b.Property)
            .WithMany(p => p.Bookings)
            .HasForeignKey(b => b.PropertyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}