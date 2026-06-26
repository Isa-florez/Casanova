using CasaNova.Application.UseCases.KYC;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaNova.API.Controllers;

public class KycSubmitDto
{
    public string DocumentNumber { get; set; } = string.Empty;
}

[ApiController]
[Route("api/kyc")]
[Authorize]
public class KycController : ControllerBase
{
    private readonly IMediator _mediator;
    public KycController(IMediator mediator) => _mediator = mediator;

    [HttpPost("submit")]
    public async Task<IActionResult> Submit([FromBody] KycSubmitDto dto, CancellationToken ct)
    {
        var command = new SubmitKycCommand(dto.DocumentNumber);
        await _mediator.Send(command, ct);
        return Ok(new { message = "Identidad verificada correctamente." });
    }
}