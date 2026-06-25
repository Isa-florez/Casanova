using CasaNova.Application.Interfaces;
using OpenAI;
using OpenAI.Chat;
using Microsoft.Extensions.Configuration;

namespace CasaNova.Infrastructure.Services;

public class KycService : IKycService
{
    private readonly ChatClient _chatClient;

    public KycService(IConfiguration config)
    {
        var apiKey = config["OpenAI:ApiKey"] ?? throw new InvalidOperationException("OpenAI:ApiKey no configurada.");
        var openAiClient = new OpenAIClient(apiKey);
        _chatClient = openAiClient.GetChatClient("gpt-4o");
    }

    public async Task<KycExtractionResult> ExtractDocumentDataAsync(Stream imageStream, CancellationToken ct = default)
    {
        try
        {
            using var ms = new MemoryStream();
            await imageStream.CopyToAsync(ms, ct);
            var imageBytes = ms.ToArray();

            var messages = new List<ChatMessage>
            {
                new UserChatMessage(
                    ChatMessageContentPart.CreateTextPart(
                        "Eres un sistema de extracción de datos de documentos de identidad. " +
                        "Extrae los siguientes campos: nombre, apellido, número de documento, fecha de nacimiento. " +
                        "Responde SOLO con JSON con este formato exacto (sin markdown): " +
                        "{\"firstName\":\"...\",\"lastName\":\"...\",\"documentNumber\":\"...\",\"dateOfBirth\":\"YYYY-MM-DD\"}" +
                        " Si no puedes extraer algún campo ponlo como null."
                    ),
                    ChatMessageContentPart.CreateImagePart(
                        BinaryData.FromBytes(imageBytes), "image/jpeg"
                    )
                )
            };

            var response = await _chatClient.CompleteChatAsync(messages, cancellationToken: ct);
            var json = response.Value.Content[0].Text.Trim();

            var doc = System.Text.Json.JsonDocument.Parse(json);
            var root = doc.RootElement;

            DateTime? dob = null;
            if (root.TryGetProperty("dateOfBirth", out var dobEl) && dobEl.ValueKind != System.Text.Json.JsonValueKind.Null)
                dob = DateTime.Parse(dobEl.GetString()!);

            return new KycExtractionResult(
                Success: true,
                FirstName: root.TryGetProperty("firstName", out var fn) ? fn.GetString() : null,
                LastName: root.TryGetProperty("lastName", out var ln) ? ln.GetString() : null,
                DocumentNumber: root.TryGetProperty("documentNumber", out var dn) ? dn.GetString() : null,
                DateOfBirth: dob,
                ErrorMessage: null
            );
        }
        catch (Exception ex)
        {
            return new KycExtractionResult(false, null, null, null, null, ex.Message);
        }
    }
}