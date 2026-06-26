using CasaNova.Application.UseCases.Users;
using CasaNova.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CasaNova.API.Controllers;

public sealed record RegisterRequest(string Email, string FirstName, string LastName, string Password, string Role);

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    public AuthController(IMediator mediator) => _mediator = mediator;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
        {
            role = UserRole.Guest;
        }

        var command = new RegisterUserCommand(request.Email, request.FirstName, request.LastName, request.Password, role);
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(Register), new { id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return Ok(result);
    }
}