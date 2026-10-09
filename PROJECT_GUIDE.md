# QAScan Project Guide

This document is the quick reference for locating the main application code, configuration, and database integration.

## 1. Repository map

```text
QAScan/
├── frontend/                 React + Vite + TypeScript user interface
├── backend/                  ASP.NET Core API and database layer
├── tools/                    Local development and process scripts
├── docs/                     Design notes and implementation documentation
├── plan/                     Product and architecture planning files
├── .env.example              Safe environment-variable template
└── package.json              Root development commands
```

## 2. Frontend

The frontend is located in [`frontend/`](frontend/).

| Purpose | Location |
| --- | --- |
| Application entry point | [`frontend/src/app/main.tsx`](frontend/src/app/main.tsx) |
| Root application component | [`frontend/src/app/App.tsx`](frontend/src/app/App.tsx) |
| Routing | [`frontend/src/app/routing/`](frontend/src/app/routing/) |
| Public routes | [`frontend/src/app/routing/routes/publicRoutes.tsx`](frontend/src/app/routing/routes/publicRoutes.tsx) |
| Authenticated routes | [`frontend/src/app/routing/routes/privateRoutes.tsx`](frontend/src/app/routing/routes/privateRoutes.tsx) |
| Business features and pages | [`frontend/src/features/`](frontend/src/features/) |
| Shared API clients | [`frontend/src/shared/api/`](frontend/src/shared/api/) |
| Shared components and utilities | [`frontend/src/shared/`](frontend/src/shared/) |
| Theme and global styling | [`frontend/src/app/theme/`](frontend/src/app/theme/) and [`frontend/src/styles/`](frontend/src/styles/) |
| Frontend dependencies and scripts | [`frontend/package.json`](frontend/package.json) |
| Vite port and API proxy | [`frontend/vite.config.ts`](frontend/vite.config.ts) |

The Vite development server uses port `8085`. Requests beginning with `/api` are proxied to the backend target configured by `VITE_API_PROXY_TARGET`.

## 3. Backend/API

The backend is located in [`backend/`](backend/).

| Purpose | Location |
| --- | --- |
| .NET solution | [`backend/qMRI.sln`](backend/qMRI.sln) |
| API startup, middleware, Swagger, and controller mapping | [`backend/src/qMRI.Api/`](backend/src/qMRI.Api/) |
| API controllers | [`backend/src/qMRI.Api/Controllers/`](backend/src/qMRI.Api/Controllers/) |
| Application use cases, DTOs, and validation | [`backend/src/qMRI.Application/`](backend/src/qMRI.Application/) |
| Domain entities and business rules | [`backend/src/qMRI.Domain/`](backend/src/qMRI.Domain/) |
| Database, authentication, email, and infrastructure services | [`backend/src/qMRI.Infrastructure/`](backend/src/qMRI.Infrastructure/) |
| Shared contracts and utilities | [`backend/src/qMRI.Shared/`](backend/src/qMRI.Shared/) |
| Backend project references | `backend/src/*/*.csproj` |
| Backend ports and environment profile | [`backend/src/qMRI.Api/Properties/launchSettings.json`](backend/src/qMRI.Api/Properties/launchSettings.json) |
| Backend startup pipeline | [`backend/src/qMRI.Api/Program.cs`](backend/src/qMRI.Api/Program.cs) |

The HTTP API normally listens on port `6000`. Swagger is available in Development at `http://localhost:6000/swagger`.

## 4. Database configuration and code

QAScan uses SQL Server with Entity Framework Core.

| Database concern | Location |
| --- | --- |
| Default and production-style settings | [`backend/src/qMRI.Api/appsettings.json`](backend/src/qMRI.Api/appsettings.json) |
| Local development overrides | [`backend/src/qMRI.Api/appsettings.Development.json`](backend/src/qMRI.Api/appsettings.Development.json) |
| EF Core `DbContext` | [`backend/src/qMRI.Infrastructure/Persistence/qMRIDbContext.cs`](backend/src/qMRI.Infrastructure/Persistence/qMRIDbContext.cs) |
| Database registration and SQL Server wiring | [`backend/src/qMRI.Infrastructure/DependencyInjection/InfrastructureDependencyInjection.cs`](backend/src/qMRI.Infrastructure/DependencyInjection/InfrastructureDependencyInjection.cs) |
| Design-time database factory | [`backend/src/qMRI.Infrastructure/Persistence/qMRIDbContextFactory.cs`](backend/src/qMRI.Infrastructure/Persistence/qMRIDbContextFactory.cs) |
| EF Core migrations | [`backend/src/qMRI.Infrastructure/Persistence/Migrations/`](backend/src/qMRI.Infrastructure/Persistence/Migrations/) |
| Seed data | [`backend/src/qMRI.Infrastructure/Persistence/Seed/`](backend/src/qMRI.Infrastructure/Persistence/Seed/) and [`backend/src/qMRI.Infrastructure/Persistence/SeedData/`](backend/src/qMRI.Infrastructure/Persistence/SeedData/) |

The primary connection-string key is:

```text
ConnectionStrings:DefaultConnection
```

For a machine-specific or deployed environment, prefer an environment variable or secret store instead of committing credentials to a JSON file:

```text
ConnectionStrings__DefaultConnection=<sql-server-connection-string>
```

The API applies pending migrations and runs identity seed initialization during startup. Database startup behavior is implemented in [`backend/src/qMRI.Api/Program.cs`](backend/src/qMRI.Api/Program.cs).

## 5. Other configuration locations

| Configuration | Location or variable |
| --- | --- |
| Local environment variables | Root `.env` file; keep it private and uncommitted |
| Safe environment template | [`.env.example`](.env.example) |
| JWT issuer, audience, signing key, and token lifetime | `Jwt` section in the backend appsettings or variables such as `Jwt__SigningKey` |
| CORS allowed origins | `Cors:AllowedOrigins` in [`appsettings.Development.json`](backend/src/qMRI.Api/appsettings.Development.json) |
| SMTP/email settings | `Email__...` variables; see [`.env.example`](.env.example) |
| Frontend-to-API proxy target | `VITE_API_PROXY_TARGET` or [`frontend/vite.config.ts`](frontend/vite.config.ts) |
| Root start/stop commands | [`package.json`](package.json) and [`tools/dev.ps1`](tools/dev.ps1) |

Never place production passwords, JWT signing keys, SMTP passwords, or API keys in documentation or commit them to source control.

## 6. Local development

### Prerequisites

- Node.js and npm
- .NET 8 SDK
- SQL Server access configured through `ConnectionStrings__DefaultConnection` or the appropriate appsettings file

### Install dependencies

```powershell
npm --prefix frontend install
dotnet restore backend/qMRI.sln
```

### Start the application

To use the local API from the frontend, set the proxy target before starting the development stack:

```powershell
$env:VITE_API_PROXY_TARGET = "http://localhost:6000"
npm run dev
```

Open:

```text
Frontend: http://localhost:8085
Backend:  http://localhost:6000
Swagger:  http://localhost:6000/swagger
Health:   http://localhost:6000/api/v1/health
```

The default Vite proxy target is defined in `frontend/vite.config.ts`. If it is not overridden, it points to the configured shared/remote API address.

### Start services separately

```powershell
npm run dev:backend
npm run dev:frontend
```

Stop processes started by the root development script with:

```powershell
npm run stop:all
```

## 7. Build verification

```powershell
npm --prefix frontend run build
dotnet build backend/src/qMRI.Api/qMRI.Api.csproj
```

The frontend build validates TypeScript and creates the Vite output. The backend build validates the API and its referenced projects. Neither build alone proves live database, email, browser, or deployment behavior.

