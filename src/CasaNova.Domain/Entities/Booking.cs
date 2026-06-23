using CasaNova.Domain.Enums;
using CasaNova.Domain.Exceptions;

namespace CasaNova.Domain.Entities;

public class Booking : BaseEntity
{
    private static readonly TimeOnly CheckInTime = new(14, 0);
    private static readonly TimeOnly CheckOutTime = new(12, 0);

    public Guid PropertyId { get; private set; }
    public Property Property { get; private set; } = null!;

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public DateTime CheckIn { get; private set; }
    public DateTime CheckOut { get; private set; }
    public decimal TotalPrice { get; private set; }
    public BookingStatus Status { get; private set; } = BookingStatus.Pending;
    public int Nights { get; private set; }

    protected Booking() { }

    public static Booking Create(Guid userId, Property property, DateTime checkInDate, DateTime checkOutDate)
    {
        var checkIn = checkInDate.Date.Add(CheckInTime.ToTimeSpan());
        var checkOut = checkOutDate.Date.Add(CheckOutTime.ToTimeSpan());

        if (checkIn >= checkOut)
            throw new DomainException("La fecha de check-out debe ser posterior a la de check-in.");

        if (checkInDate.Date < DateTime.UtcNow.Date)
            throw new DomainException("No se pueden realizar reservas en fechas pasadas.");

        if (!property.IsAvailableFor(checkIn, checkOut))
            throw new DomainException("El inmueble no está disponible para las fechas seleccionadas.");

        var nights = (int)(checkOut.Date - checkIn.Date).TotalDays;

        return new Booking
        {
            UserId = userId,
            PropertyId = property.Id,
            Property = property,
            CheckIn = checkIn,
            CheckOut = checkOut,
            Nights = nights,
            TotalPrice = property.PricePerNight * nights,
            Status = BookingStatus.Confirmed
        };
    }

    public void Cancel()
    {
        if (Status == BookingStatus.Completed)
            throw new DomainException("No se puede cancelar una reserva ya completada.");
        if (Status == BookingStatus.Cancelled)
            throw new DomainException("La reserva ya está cancelada.");

        Status = BookingStatus.Cancelled;
        SetUpdatedAt();
    }

    public void Complete()
    {
        if (Status != BookingStatus.Confirmed)
            throw new DomainException("Solo se pueden completar reservas confirmadas.");

        Status = BookingStatus.Completed;
        SetUpdatedAt();
    }
}