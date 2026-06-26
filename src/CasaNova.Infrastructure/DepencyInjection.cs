using CasaNova.Application.Interfaces;
using CasaNova.Domain.Interfaces;
using CasaNova.Infrastructure.Persistence;
using CasaNova.Infrastructure.Repositories;
using CasaNova.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CasaNova.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // EF Core + PostgreSQL
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)
            )
        );

        // Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Auth
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtService, JwtService>();

        // Servicios externos
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IExcelExportService, ExcelExportService>();

        return services;
    }
}