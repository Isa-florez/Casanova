using CasaNova.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CasaNova.Infrastructure.Persistence.Configurations;

public class WishlistConfiguration : IEntityTypeConfiguration<Wishlist>
{
    public void Configure(EntityTypeBuilder<Wishlist> builder)
    {
        builder.HasKey(w => w.Id);

        // Un usuario no puede guardar el mismo inmueble dos veces
        builder.HasIndex(w => new { w.UserId, w.PropertyId }).IsUnique();

        builder.HasOne(w => w.User)
            .WithMany(u => u.Wishlists)
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(w => w.Property)
            .WithMany(p => p.Wishlists)
            .HasForeignKey(w => w.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}