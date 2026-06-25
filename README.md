# Casa Nova — Plataforma de Rentas Cortas

Plataforma de rentas cortas con validación de identidad por IA (KYC),
dashboard de propietarios, wishlist, notificaciones por email y exportación Excel.
Desarrollada como prueba técnica para Riwi.

---

## Requisitos Previos

- Docker Desktop instalado y corriendo
- Git
- Cuenta de Gmail con contraseña de aplicación (para emails)
- API Key de OpenAI con GPT-4o (para el KYC — opcional para pruebas)

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con tus credenciales:

```env
OPENAI_API_KEY=sk-proj-...tu-key...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=tucorreo@gmail.com
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASSWORD=tucontraseñadeaplicacion
```

> Si no tienes API Key de OpenAI, déjala vacía. El sistema levanta igual
> pero el módulo KYC no procesará imágenes.

---

## Levantar el Proyecto

```bash
git clone <url-del-repo>
cd Casa_Nova
docker compose up --build
```

Eso es todo. Docker levanta la base de datos, aplica las migraciones
automáticamente y levanta la API y el frontend.

Una vez arriba accede a:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| API / Swagger | http://localhost:8080/swagger |
| Base de datos | localhost:5432 |

Credenciales de la BD: usuario `postgres`, contraseña `postgres`.

---

## Arquitectura

El sistema sigue **Clean Architecture** en 4 capas:

src/

├── CasaNova.Domain/          # Entidades, enums, excepciones e interfaces de dominio

├── CasaNova.Application/     # Casos de uso con CQRS (MediatR), interfaces de servicios

├── CasaNova.Infrastructure/  # EF Core, PostgreSQL, JWT, MailKit, OpenAI, ClosedXML

├── CasaNova.API/             # Controllers REST, Program.cs, Swagger

└── CasaNova.Web/             # React 19 + Vite 8 + Tailwind CSS 4

---

## Estructura de Carpetas

```
Casa_Nova/
├── docker-compose.yml
├── .env                          # Variables sensibles (no se sube al repo)
├── .gitignore
├── README.md
└── src/
    ├── CasaNova.Domain/
    │   ├── Entities/
    │   │   ├── BaseEntity.cs
    │   │   ├── User.cs
    │   │   ├── Property.cs
    │   │   ├── Booking.cs
    │   │   ├── Wishlist.cs
    │   │   ├── Notification.cs
    │   │   └── PropertyPhoto.cs
    │   ├── Enum/
    │   │   └── DomainEnums.cs
    │   ├── Exceptions/
    │   │   └── DomainExceptions.cs
    │   └── Interfaces/
    │       └── IRepositories.cs
    │
    ├── CasaNova.Application/
    │   ├── Interfaces/
    │   │   └── IApplicationServices.cs
    │   └── UseCases/
    │       ├── Users/
    │       │   ├── RegisterUser.cs
    │       │   └── LoginUser.cs
    │       ├── Properties/
    │       │   ├── SearchProperties.cs
    │       │   ├── GetPropertyById.cs
    │       │   └── CreateProperty.cs
    │       ├── Bookings/
    │       │   ├── CreateBooking.cs
    │       │   ├── CancelBooking.cs
    │       │   └── GetUserBooking.cs
    │       ├── KYC/
    │       │   └── SubmitKyc.cs
    │       ├── Wishlist/
    │       │   └── ToggleWishlist.cs
    │       └── Reports/
    │           ├── GetDashboard.cs
    │           └── ExportBookingExcel.cs
    │
    ├── CasaNova.Infrastructure/
    │   ├── Persistence/
    │   │   ├── AppDbContext.cs
    │   │   ├── Configurations/
    │   │   │   ├── UserConfiguration.cs
    │   │   │   ├── PropertyConfiguration.cs
    │   │   │   ├── BookingConfigurations.cs
    │   │   │   ├── WishlistConfiguration.cs
    │   │   │   └── NotificationConfigurations.cs
    │   │   └── Migrations/
    │   ├── Repositories/
    │   │   ├── BaseRepository.cs
    │   │   ├── UserRepository.cs
    │   │   ├── PropertyRepository.cs
    │   │   ├── BookingRepository.cs
    │   │   ├── WishlistRepository.cs
    │   │   ├── NotificationRepository.cs
    │   │   └── UnitOfWork.cs
    │   ├── Services/
    │   │   ├── AI/
    │   │   │   └── KycService.cs
    │   │   ├── Auth/
    │   │   │   ├── JwtService.cs
    │   │   │   ├── PasswordHasher.cs
    │   │   │   └── CurrentUserService.cs
    │   │   ├── Email/
    │   │   │   └── EmailService.cs
    │   │   └── Storage/
    │   │       ├── StorageService.cs
    │   │       └── ExcelExportService.cs
    │   └── DependencyInjection.cs
    │
    ├── CasaNova.API/
    │   ├── Controllers/
    │   │   ├── AuthController.cs
    │   │   ├── PropertiesController.cs
    │   │   ├── BookingsController.cs
    │   │   ├── KycController.cs
    │   │   └── ReportsController.cs
    │   ├── appsettings.json
    │   ├── Program.cs
    │   └── Dockerfile
    │
    └── CasaNova.Web/
        ├── src/
        │   ├── App.jsx
        │   ├── main.jsx
        │   └── index.css
        ├── Dockerfile
        ├── nginx.conf
        └── package.json
```

## Decisiones Técnicas

### Prevención de Double-Booking
Antes de confirmar cualquier reserva, `BookingRepository` consulta si existe
alguna reserva activa que solape el rango de fechas solicitado para el mismo
inmueble. La validación ocurre tanto en el dominio como en la base de datos.

### Check-in / Check-out Fijo
El caso de uso `CreateBooking` normaliza automáticamente los horarios:
check-in a las **14:00** y check-out a las **12:00**, sin importar la hora
que envíe el cliente.

### KYC con IA (GPT-4o Vision)
Al subir la foto de la cédula, `KycService` envía la imagen a GPT-4o Vision
con un prompt estructurado que extrae nombre, apellido, número de documento
y fecha de nacimiento en formato JSON. El documento se elimina de forma
segura tras la validación.

### Autenticación Diferida
El catálogo de propiedades y los filtros por ciudad/fechas son endpoints
públicos. El JWT solo se exige al momento de reservar, guardar en wishlist
o completar el KYC, permitiendo navegación anónima.

### Notificaciones por Email
`EmailService` usa MailKit sobre SMTP para enviar correos de confirmación
de reserva, resultado de KYC y recordatorios de llegada/salida.

### Exportación Excel
`ExcelExportService` genera reportes `.xlsx` con ClosedXML, filtrables por
propietario o por inmueble, con columnas de fechas, precio pagado, datos
del huésped y propiedad asociada.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | .NET 10, ASP.NET Core, EF Core, MediatR |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT Bearer |
| KYC / IA | OpenAI GPT-4o Vision |
| Email | MailKit (SMTP / Gmail) |
| Excel | ClosedXML |
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Infraestructura | Docker Compose |