using CasaNova.Domain.Enums;
using CasaNova.Domain.Exceptions;
using CasaNova.Domain.Interfaces;
using CasaNova.Application.Interfaces;
using MediatR;

namespace CasaNova.Application.UseCases.KYC;

public record SubmitKycCommand(string DocumentNumber) : IRequest;

public class SubmitKycHandler : IRequestHandler<SubmitKycCommand>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public SubmitKycHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task Handle(SubmitKycCommand request, CancellationToken ct)
    {
        if (!_currentUser.IsAuthenticated || !_currentUser.UserId.HasValue)
            throw new UnauthorizedException();

        var user = await _uow.Users.GetByIdAsync(_currentUser.UserId.Value, ct)
            ?? throw new NotFoundException(nameof(Domain.Entities.User), _currentUser.UserId.Value);

        if (user.KycStatus == KycStatus.Approved)
            throw new DomainException("Tu identidad ya fue validada.");

        var documentNumber = request.DocumentNumber?.Trim() ?? string.Empty;

        if (documentNumber.Length < 7 || !documentNumber.All(char.IsDigit))
            throw new DomainException("El número de documento debe tener mínimo 7 dígitos numéricos.");

        user.VerifyKycWithDocumentNumber(documentNumber);

        var notification = Domain.Entities.Notification.Create(
            user.Id,
            NotificationType.KycApproved,
            "Identidad verificada",
            "Tu documento fue validado exitosamente. Ya puedes realizar reservas."
        );
        await _uow.Notifications.AddAsync(notification, ct);

        await _uow.SaveChangesAsync(ct);
    }
}