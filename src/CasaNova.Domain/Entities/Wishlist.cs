namespace CasaNova.Domain.Entities;

public class Wishlist : BaseEntity
{
    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public Guid PropertyId { get; private set; }
    public Property Property { get; private set; } = null!;

    protected Wishlist() { }

    public static Wishlist Create(Guid userId, Guid propertyId)
        => new() { UserId = userId, PropertyId = propertyId };
}