using CasaNova.Domain.Enums;

namespace CasaNova.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
    public NotificationType Type { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public bool IsRead { get; private set; }
    public bool EmailSent { get; private set; }

    protected Notification() { }

    public static Notification Create(Guid userId, NotificationType type, string title, string message)
        => new() { UserId = userId, Type = type, Title = title, Message = message };

    public void MarkAsRead() { IsRead = true; SetUpdatedAt(); }
    public void MarkEmailSent() { EmailSent = true; SetUpdatedAt(); }
}