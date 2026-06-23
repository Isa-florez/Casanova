using CasaNova.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;

namespace CasaNova.Infrastructure.Services;

public class StorageService : IStorageService
{
    private readonly string _basePath;
    private readonly byte[] _encryptionKey;

    public StorageService(IConfiguration config)
    {
        _basePath = config["Storage:BasePath"] ?? Path.Combine(Path.GetTempPath(), "casanova_storage");
        Directory.CreateDirectory(_basePath);

        var keyBase64 = config["Storage:EncryptionKey"];
        _encryptionKey = string.IsNullOrEmpty(keyBase64)
            ? RandomNumberGenerator.GetBytes(32)
            : Convert.FromBase64String(keyBase64);
    }

    public async Task<string> UploadEncryptedAsync(Stream file, string fileName, CancellationToken ct = default)
    {
        var encrypted = Path.Combine(_basePath, $"{Guid.NewGuid()}_{fileName}.enc");

        using var aes = Aes.Create();
        aes.Key = _encryptionKey;
        aes.GenerateIV();

        await using var output = File.Create(encrypted);
        await output.WriteAsync(aes.IV, ct);

        await using var cryptoStream = new CryptoStream(output, aes.CreateEncryptor(), CryptoStreamMode.Write);
        file.Seek(0, SeekOrigin.Begin);
        await file.CopyToAsync(cryptoStream, ct);

        return encrypted;
    }

    public Task DeleteAsync(string path, CancellationToken ct = default)
    {
        if (File.Exists(path))
            File.Delete(path);
        return Task.CompletedTask;
    }
}