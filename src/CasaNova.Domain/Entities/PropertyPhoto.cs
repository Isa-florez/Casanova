namespace CasaNova.Domain.Entities;

public class PropertyPhoto : BaseEntity
{
    public Guid PropertyId { get; private set; }
    public Property Property { get; private set; } = null!;
    public string Url { get; private set; } = string.Empty;
    public bool IsCover { get; private set; }
    public int Order { get; private set; }

    protected PropertyPhoto() { }

    public static PropertyPhoto Create(Guid propertyId, string url, bool isCover = false, int order = 0)
        => new() { PropertyId = propertyId, Url = url, IsCover = isCover, Order = order };
}