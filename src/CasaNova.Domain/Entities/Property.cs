using CasaNova.Domain.Exceptions;

namespace CasaNova.Domain.Entities;

public class Property : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string City { get; private set; } = string.Empty;
    public string Address { get; private set; } = string.Empty;
    public decimal PricePerNight { get; private set; }
    public int MaxGuests { get; private set; }
    public int Bedrooms { get; private set; }
    public bool IsActive { get; private set; } = true;

    public Guid OwnerId { get; private set; }
    public User Owner { get; private set; } = null!;

    public ICollection<PropertyPhoto> Photos { get; private set; } = new List<PropertyPhoto>();
    public ICollection<Booking> Bookings { get; private set; } = new List<Booking>();
    public ICollection<Wishlist> Wishlists { get; private set; } = new List<Wishlist>();

    protected Property() { }

    public static Property Create(Guid ownerId, string title, string description,
        string city, string address, decimal pricePerNight, int maxGuests, int bedrooms)
    {
        if (pricePerNight <= 0)
            throw new DomainException("El precio por noche debe ser mayor a cero.");
        if (maxGuests <= 0)
            throw new DomainException("La capacidad de huéspedes debe ser mayor a cero.");

        return new Property
        {
            OwnerId = ownerId,
            Title = title.Trim(),
            Description = description.Trim(),
            City = city.Trim(),
            Address = address.Trim(),
            PricePerNight = pricePerNight,
            MaxGuests = maxGuests,
            Bedrooms = bedrooms
        };
    }

    public void Update(string title, string description, string city,
        string address, decimal pricePerNight, int maxGuests, int bedrooms)
    {
        if (pricePerNight <= 0)
            throw new DomainException("El precio por noche debe ser mayor a cero.");

        Title = title.Trim();
        Description = description.Trim();
        City = city.Trim();
        Address = address.Trim();
        PricePerNight = pricePerNight;
        MaxGuests = maxGuests;
        Bedrooms = bedrooms;
        SetUpdatedAt();
    }

    public void Deactivate() { IsActive = false; SetUpdatedAt(); }
    public void Activate() { IsActive = true; SetUpdatedAt(); }

    public bool IsAvailableFor(DateTime checkIn, DateTime checkOut)
    {
        return !Bookings.Any(b =>
            b.Status != Enums.BookingStatus.Cancelled &&
            b.CheckIn < checkOut &&
            b.CheckOut > checkIn);
    }
}