using CasaNova.Domain.Enums;
using CasaNova.Domain.Exceptions;

namespace CasaNova.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }
    public KycStatus KycStatus { get; private set; } = KycStatus.NotStarted;
    public string? DocumentNumber { get; private set; }
    public DateTime? DateOfBirth { get; private set; }
    public string? EncryptedDocumentPath { get; private set; }

    public ICollection<Booking> Bookings { get; private set; } = new List<Booking>();
    public ICollection<Wishlist> Wishlists { get; private set; } = new List<Wishlist>();
    public ICollection<Property> OwnedProperties { get; private set; } = new List<Property>();
    public ICollection<Notification> Notifications { get; private set; } = new List<Notification>();

    protected User() { }

    public static User Create(string email, string firstName, string lastName, UserRole role)
    {
        return new User
        {
            Email = email.ToLowerInvariant().Trim(),
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            Role = role
        };
    }

    public void UpdateKycInfo(string documentNumber, DateTime dateOfBirth, string encryptedDocPath)
    {
        DocumentNumber = documentNumber;
        DateOfBirth = dateOfBirth;
        EncryptedDocumentPath = encryptedDocPath;
        KycStatus = KycStatus.Pending;
        SetUpdatedAt();
    }

    public void ApproveKyc()
    {
        KycStatus = KycStatus.Approved;
        EncryptedDocumentPath = null;
        SetUpdatedAt();
    }

    public void RejectKyc()
    {
        KycStatus = KycStatus.Rejected;
        EncryptedDocumentPath = null;
        SetUpdatedAt();
    }

    public bool NeedsKycForFirstBooking() => KycStatus != KycStatus.Approved;
    public string FullName => $"{FirstName} {LastName}";
}