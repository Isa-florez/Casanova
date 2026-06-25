using CasaNova.Application.UseCases.KYC;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaNova.API.Controllers;

public class KycUploadDto
{
    public IFormFile Document { get; set; } = null!;
}

[ApiController]
[Route("api/kyc")]
[Authorize]
public class KycController : ControllerBase
{
    private readonly IMediator _mediator;
    public KycController(IMediator mediator) => _mediator = mediator;

    [HttpPost("submit")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Submit([FromForm] KycUploadDto dto, CancellationToken ct)
    {
        using var stream = dto.Document.OpenReadStream();
        var command = new SubmitKycCommand(stream, dto.Document.FileName);
        await _mediator.Send(command, ct);
        return Ok(new { message = "KYC enviado correctamente." });
    }
}
