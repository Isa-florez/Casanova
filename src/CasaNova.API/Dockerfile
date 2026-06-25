FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY ../../Casa_Nova.sln* ./
COPY ../CasaNova.Domain/CasaNova.Domain.csproj ./src/CasaNova.Domain/
COPY ../CasaNova.Application/CasaNova.Application.csproj ./src/CasaNova.Application/
COPY ../CasaNova.Infrastructure/CasaNova.Infrastructure.csproj ./src/CasaNova.Infrastructure/
COPY ./CasaNova.API.csproj ./src/CasaNova.API/

RUN dotnet restore ./src/CasaNova.API/CasaNova.API.csproj

COPY ../CasaNova.Domain/ ./src/CasaNova.Domain/
COPY ../CasaNova.Application/ ./src/CasaNova.Application/
COPY ../CasaNova.Infrastructure/ ./src/CasaNova.Infrastructure/
COPY . ./src/CasaNova.API/

RUN dotnet publish ./src/CasaNova.API/CasaNova.API.csproj -c Release -o /publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /publish .

RUN mkdir -p /app/uploads && chmod 777 /app/uploads

ENTRYPOINT ["dotnet", "CasaNova.API.dll"]