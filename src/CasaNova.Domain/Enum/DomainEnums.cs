namespace CasaNova.Domain.Enums;

public enum BookingStatus
{
    Pending = 0,
    Confirmed = 1,
    Cancelled = 2,
    Completed = 3
}

public enum KycStatus
{
    NotStarted = 0,
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

public enum UserRole
{
    Guest = 0,   // Arrendatario / Huésped
    Owner = 1,   // Dueño / Anfitrión
    Admin = 2
}

public enum NotificationType
{
    BookingConfirmed = 0,
    BookingCancelled = 1,
    KycApproved = 2,
    KycRejected = 3,
    CheckInReminder = 4,
    CheckOutReminder = 5
}