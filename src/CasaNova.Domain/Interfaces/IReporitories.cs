using CasaNova.Domain.Entities;

namespace CasaNova.Domain.Interfaces;

public interface IUnitOfWork
{
    IPropertyRepository Properties { get; }
    IBookingRepository Bookings { get; }
    IUserRepository Users { get; }
    IWishlistRepository Wishlists { get; }
    INotificationRepository Notifications { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
}

public interface IPropertyRepository : IRepository<Property>
{
    Task<IEnumerable<Property>> SearchAsync(string? city, DateTime? checkIn, DateTime? checkOut, CancellationToken ct = default);
    Task<Property?> GetWithBookingsAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Property>> GetByOwnerAsync(Guid ownerId, CancellationToken ct = default);
}

public interface IBookingRepository : IRepository<Booking>
{
    Task<IEnumerable<Booking>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<IEnumerable<Booking>> GetByPropertyAsync(Guid propertyId, CancellationToken ct = default);
    Task<IEnumerable<Booking>> GetByOwnerAsync(Guid ownerId, DateTime? from, DateTime? to, CancellationToken ct = default);
    Task<bool> HasOverlapAsync(Guid propertyId, DateTime checkIn, DateTime checkOut, Guid? excludeBookingId = null, CancellationToken ct = default);
}

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
}

public interface IWishlistRepository : IRepository<Wishlist>
{
    Task<IEnumerable<Wishlist>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<Wishlist?> GetByUserAndPropertyAsync(Guid userId, Guid propertyId, CancellationToken ct = default);
}

public interface INotificationRepository : IRepository<Notification>
{
    Task<IEnumerable<Notification>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<IEnumerable<Notification>> GetUnsentEmailsAsync(CancellationToken ct = default);
}