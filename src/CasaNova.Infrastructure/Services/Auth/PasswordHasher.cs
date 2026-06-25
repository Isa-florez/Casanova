using CasaNova.Application.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace CasaNova.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    private const int Iterations = 350_000;
    private const int HashSize = 32;
    private const int SaltSize = 16;

    public string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            HashSize
        );
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool Verify(string password, string storedHash)
    {
        var parts = storedHash.Split('.');
        if (parts.Length != 2) return false;

        var salt = Convert.FromBase64String(parts[0]);
        var expectedHash = Convert.FromBase64String(parts[1]);

        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            HashSize
        );
        return CryptographicOperations.FixedTimeEquals(hash, expectedHash);
    }
}