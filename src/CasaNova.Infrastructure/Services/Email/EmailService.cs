using CasaNova.Application.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace CasaNova.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly string _host;
    private readonly int _port;
    private readonly string _from;
    private readonly string _user;
    private readonly string _password;

    public EmailService(IConfiguration config)
    {
        _host = config["Email:Host"] ?? "smtp.gmail.com";
        _port = int.Parse(config["Email:Port"] ?? "587");
        _from = config["Email:From"] ?? "noreply@casanova.com";
        _user = config["Email:User"] ?? "";
        _password = config["Email:Password"] ?? "";
    }

    public async Task SendAsync(string to, string subject, string body, CancellationToken ct = default)
    {
        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(_from));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = body };

        using var client = new SmtpClient();
        await client.ConnectAsync(_host, _port, MailKit.Security.SecureSocketOptions.StartTls, ct);
        await client.AuthenticateAsync(_user, _password, ct);
        await client.SendAsync(message, ct);
        await client.DisconnectAsync(true, ct);
    }
}