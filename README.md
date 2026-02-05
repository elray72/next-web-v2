# Digital Wellness Web Platform

A multi-tenant, multi-zone platform with Umbraco CMS backend and Next.js frontend.

## Stack

| Component | Technology | Version |
|-----------|------------|---------|
| CMS | Umbraco | 17.1.0 LTS |
| Backend | .NET | 10 LTS |
| Frontend | Next.js | 16.1.x |
| Database | SQL Server | 2022 |
| Package Manager | pnpm | 9.x |

## Project Structure

```
web/
├── cms/                      # Umbraco CMS (.NET)
│   ├── Web.csproj
│   ├── Program.cs
│   ├── Configuration/
│   ├── Middleware/
│   └── Services/
├── site/                     # Next.js frontend
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── marketing/
│       │   ├── member/
│       │   └── onboarding/
│       └── middleware.ts
├── shared/                   # Shared code
│   ├── package.json
│   └── tenants/
│       ├── index.ts
│       └── types.ts
├── docker-compose.yml
├── package.json              # Workspace root
└── pnpm-workspace.yaml
```

## Multi-Tenant Architecture

### Tenants (Domain-Based)

| Tenant Host | Allowed Zones |
|-------------|---------------|
| `diet.mayoclinic.org` | marketing, member, onboarding |
| `www.totalwellbeingdiet.com` | marketing, member, onboarding |
| `www.digitalwellness.com` | marketing |

### Zones (Path-Based)

| Zone | Purpose |
|------|---------|
| `marketing` | Public-facing marketing content |
| `member` | Member-exclusive content |
| `onboarding` | Tenant onboarding flows |

Tenant configuration is shared between CMS and Site via `@web/shared/tenants`.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [OrbStack](https://orbstack.dev/)

### Install Dependencies (macOS)

```bash
# .NET 10
brew install dotnet

# pnpm
brew install pnpm

# Install JS dependencies
pnpm install
```

## Setup

### 1. Start SQL Server

```bash
docker-compose up -d
```

### 2. Build & Run CMS (Umbraco)

```bash
dotnet build cms
dotnet run --project cms
```

Navigate to `https://localhost:5001` to complete Umbraco setup.

### 3. Run Site (Next.js)

```bash
pnpm dev
```

Navigate to `http://localhost:3000`.

## Configuration

### Connection String (CMS)

Located in `cms/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "umbracoDbDSN": "Server=localhost,1433;Database=UmbracoDb;User Id=sa;Password=UmbracoDevP@ss123!;TrustServerCertificate=True;MultipleActiveResultSets=True"
  }
}
```

### Docker Compose

SQL Server configuration in `docker-compose.yml`:

```yaml
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: umbraco-sqlserver
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=UmbracoDevP@ss123!
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql
```

### Tenant Configuration

Shared tenant config in `shared/tenants/index.ts`:

```typescript
export const TENANT_ZONES = {
  'diet.mayoclinic.org': ['marketing', 'member', 'onboarding'],
  'www.totalwellbeingdiet.com': ['marketing', 'member', 'onboarding'],
  'www.digitalwellness.com': ['marketing'],
};
```

## Commands

### Root Workspace

```bash
# Install all dependencies
pnpm install

# Run Next.js dev server
pnpm dev

# Build Next.js
pnpm build
```

### CMS (Umbraco)

```bash
# Build
dotnet build cms

# Run
dotnet run --project cms

# Run with hot reload
dotnet watch --project cms
```

### Site (Next.js)

```bash
# Dev server
pnpm --filter @web/site dev

# Build
pnpm --filter @web/site build

# Lint
pnpm --filter @web/site lint
```

### Docker

```bash
# Start SQL Server
docker-compose up -d

# Stop
docker-compose down

# View logs
docker logs -f umbraco-sqlserver
```

## Troubleshooting

### Apple Silicon (M1/M2/M3/M4) Macs

SQL Server on Docker Desktop may fail due to AVX instruction emulation issues.

**Solution**: Use OrbStack instead:

```bash
brew install orbstack
```

### pnpm workspace issues

If shared package isn't resolving:

```bash
pnpm install --force
```
