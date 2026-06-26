namespace CasaNova.Application.Interfaces;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string body, CancellationToken ct = default);
}

public interface ICurrentUserService
{
    Guid? UserId { get; }
    bool IsAuthenticated { get; }
}

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}

public interface IJwtService
{
    string GenerateToken(CasaNova.Domain.Entities.User user);
}

public interface IExcelExportService
{
    byte[] ExportBookings(IEnumerable<CasaNova.Domain.Entities.Booking> bookings);
}