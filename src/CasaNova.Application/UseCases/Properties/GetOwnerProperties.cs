using CasaNova.Domain.Exceptions;
using CasaNova.Domain.Interfaces;
using CasaNova.Application.Interfaces;
using MediatR;

namespace CasaNova.Application.UseCases.Properties;

public record GetOwnerPropertiesQuery : IRequest<IEnumerable<PropertyDto>>;

public class GetOwnerPropertiesHandler : IRequestHandler<GetOwnerPropertiesQuery, IEnumerable<PropertyDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public GetOwnerPropertiesHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<IEnumerable<PropertyDto>> Handle(GetOwnerPropertiesQuery request, CancellationToken ct)
    {
        if (!_currentUser.IsAuthenticated || !_currentUser.UserId.HasValue)
            throw new UnauthorizedException();

        var properties = await _uow.Properties.GetByOwnerAsync(_currentUser.UserId.Value, ct);

        return properties.Select(p => new PropertyDto(
            p.Id,
            p.Title,
            p.Description,
            p.City,
            p.Address,
            p.PricePerNight,
            p.MaxGuests,
            p.Bedrooms,
            p.Photos.FirstOrDefault(ph => ph.IsCover)?.Url
        ));
    }
}
