using CasaNova.Domain.Exceptions;
using CasaNova.Domain.Interfaces;
using CasaNova.Application.Interfaces;
using MediatR;

namespace CasaNova.Application.UseCases.Wishlist;

public record GetUserWishlistQuery : IRequest<IEnumerable<WishlistPropertyDto>>;

public record WishlistPropertyDto(
    Guid Id,
    string Title,
    string Description,
    string City,
    string Address,
    decimal PricePerNight,
    int MaxGuests,
    int Bedrooms,
    string? CoverPhotoUrl
);

public class GetUserWishlistHandler : IRequestHandler<GetUserWishlistQuery, IEnumerable<WishlistPropertyDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public GetUserWishlistHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<IEnumerable<WishlistPropertyDto>> Handle(GetUserWishlistQuery request, CancellationToken ct)
    {
        if (!_currentUser.IsAuthenticated || !_currentUser.UserId.HasValue)
            throw new UnauthorizedException();

        var wishlists = await _uow.Wishlists.GetByUserAsync(_currentUser.UserId.Value, ct);
        var wishlistList = wishlists.ToList();

        var properties = await Task.WhenAll(
            wishlistList.Select(w => _uow.Properties.GetByIdAsync(w.PropertyId, ct))
        );

        return properties
            .Where(p => p != null)
            .Select(p => new WishlistPropertyDto(
                p!.Id,
                p.Title,
                p.Description,
                p.City,
                p.Address,
                p.PricePerNight,
                p.MaxGuests,
                p.Bedrooms,
                p.Photos.FirstOrDefault(ph => ph.IsCover)?.Url
            ))
            .ToList();
    }
}
