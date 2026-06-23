namespace RentaCorta.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}

public class NotFoundException : Exception
{
    public NotFoundException(string entity, object id)
        : base($"{entity} con id '{id}' no fue encontrado.") { }
}

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "No tienes permisos para realizar esta acción.")
        : base(message) { }
}

public class ConflictException : Exception
{
    public ConflictException(string message) : base(message) { }
}