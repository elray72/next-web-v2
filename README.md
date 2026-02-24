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
next-web/
├── cms/                      # Umbraco CMS (.NET 10)
│   ├── DW.Cms.csproj
│   ├── Program.cs
│   ├── Configuration/
│   ├── Middleware/
│   └── Services/
├── site/                     # Next.js frontend
│   ├── proxy.ts              # Zone-based routing (Next.js 16)
│   ├── next.config.ts
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── marketing/
│       │   ├── member/
│       │   └── onboarding/
│       └── tenants/
│           └── tenant-config.ts
├── shared/                   # @web/shared — shared config, types, SCSS themes
│   ├── package.json
│   └── tenants/
│       ├── index.ts
│       ├── types.ts
│       ├── mcd/
│       │   ├── config.ts
│       │   └── theme.scss
│       ├── twd/
│       │   ├── config.ts
│       │   └── theme.scss
│       ├── dw/
│       │   ├── config.ts
│       │   └── theme.scss
│       └── default/
│           ├── config.ts
│           └── theme.scss
├── docker-compose.yml
├── package.json              # Workspace root with tenant dev scripts
└── pnpm-workspace.yaml
```

## Multi-Tenant Architecture

Tenancy is **build-time**: the `TENANT` environment variable selects which tenant is active when the dev server or build starts. Each tenant gets a separate build cache (`distDir`).

### Tenants

| Tenant | Name | Host | Port (dev) |
|--------|------|------|------------|
| `mcd` | Mayo Clinic Diet | `diet.mayoclinic.org` | 3000 |
| `twd` | Total Wellbeing Diet | `www.totalwellbeingdiet.com` | 3001 |
| `dw` | Digital Wellness | `www.digitalwellness.com` | 3002 |
| `default` | Local / fallback | `localhost` | 3000 |

### Zones (Path-Based)

| Zone | Purpose |
|------|--------|
| `marketing` | Public-facing marketing content |
| `member` | Member-exclusive content |
| `onboarding` | Tenant onboarding flows |

`site/proxy.ts` reads `tenantConfig.zones` and `tenantConfig.defaultZone` to redirect `/` and route zone paths. See [docs/multi-tenant.md](docs/multi-tenant.md) for detailed documentation.

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

Wait 10-15 seconds for SQL Server to initialize.

### 2. Create Database

**Option A: Automated Script** (Recommended)

```bash
./scripts/create-database.sh
```

**Option B: Manual Creation**

```bash
docker exec umbraco-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'Jump2^Music$' -C \
  -Q "CREATE DATABASE UmbracoDb;"
```

**Note:** The database must exist before running Umbraco for the first time. The installation wizard will create the schema automatically.

### 3. Build & Run CMS (Umbraco)

#### Using CLI

```bash
# Build and run
dotnet build cms/DW.Cms.csproj
dotnet run --project cms/DW.Cms.csproj
```

**If build fails with "Assets file not found":**
```bash
dotnet restore cms/DW.Cms.csproj
dotnet build cms/DW.Cms.csproj
```

#### Using JetBrains Rider

1. Open the `cms/` folder or `cms/DW.Cms.csproj` in Rider
2. Build: `⌘F9` or **Build → Build Solution**
3. Run: `⌃R` or **Run → Run 'DW.Cms'**

**If build fails:** Right-click project → **Restore NuGet Packages**, then rebuild

#### Using Visual Studio (Windows)

1. Open `cms/DW.Cms.csproj` in Visual Studio
2. Build: `Ctrl+Shift+B` or **Build → Build Solution**
3. Run: `F5` or **Debug → Start Debugging**

Navigate to `https://localhost:44386` or `http://localhost:38608` to complete Umbraco installation wizard.

**First-time Setup:**
1. Create your admin account
2. Umbraco will automatically create database tables
3. No further configuration needed

### 4. Run Site (Next.js)

```bash
# From the monorepo root:
pnpm mcd        # Mayo Clinic Diet  → http://localhost:3000
pnpm twd        # Total Wellbeing   → http://localhost:3001
pnpm dw         # Digital Wellness  → http://localhost:3002
pnpm dev        # Default tenant    → http://localhost:3000
```

All three tenant dev servers can run simultaneously — each uses a separate build cache.

## Content Delivery API Integration

The Next.js frontend uses Umbraco's Content Delivery API for headless CMS functionality.

### Setup

1. **Enable Content Delivery API** in Umbraco (enabled by default in v13+)

2. **Configure environment variables** in `site/.env.local`:

```bash
UMBRACO_API_URL=https://localhost:5001
UMBRACO_API_KEY=  # Optional: Add API key if required
```

3. **Fetch content in Next.js**:

```typescript
import { getContentByPath } from '@/providers/umbraco';

export default async function Page() {
  const content = await getContentByPath('/marketing/about', {
    revalidate: 60, // ISR: revalidate every 60 seconds
  });

  return <h1>{content.properties.title}</h1>;
}
```

### API Client Methods

- `getContentByPath(path)` - Fetch content by route path
- `getContentById(id)` - Fetch content by ID
- `getContent(params)` - Get all content with pagination/filtering
- `searchContent(query)` - Search content by name

See [site/src/providers/umbraco/index.ts](site/src/providers/umbraco/index.ts) for full API.

### Example

Visit [site/src/app/marketing/about/page.tsx](site/src/app/marketing/about/page.tsx) for a complete example.

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

Each tenant has a `config.ts` in `shared/tenants/<name>/config.ts` and a `theme.scss` for CSS custom properties. The active tenant is selected at build time via `TENANT` and loaded in `site/src/tenants/tenant-config.ts`:

```typescript
// shared/tenants/mcd/config.ts
export const config: TenantConfig = {
  name: 'mcd',
  host: 'diet.mayoclinic.org',
  zones: ['marketing', 'member', 'onboarding'],
  defaultZone: 'marketing',
  branding: { title: 'Mayo Clinic Diet' },
  features: { memberPortal: true, onboarding: true, blog: true },
};
```

See [docs/multi-tenant.md](docs/multi-tenant.md) for the full system and how to add a new tenant.

## Development Tools

### Code Quality

**Linting:**
- ESLint for both `site` and `shared` workspaces
- TypeScript type checking
- Next.js-specific rules for `site`

**Formatting:**
- Prettier with 80-character line limit
- Automatic import organization via `prettier-plugin-organize-imports`
- Consistent code style across all workspaces

**Import Organization:**
Imports are automatically sorted and organized when running `format` commands:
- Removes unused imports
- Sorts imports alphabetically
- Groups: built-ins → external packages → internal modules

## Commands

### Root Workspace

```bash
# Install all dependencies
pnpm install

# Run Next.js dev server per tenant
pnpm mcd        # TENANT=mcd  → port 3000
pnpm twd        # TENANT=twd  → port 3001
pnpm dw         # TENANT=dw   → port 3002
pnpm dev        # Default tenant → port 3000

# Build Next.js
pnpm build
```

### CMS (Umbraco)

```bash
# Build
dotnet build cms/DW.Cms.csproj

# Run
dotnet run --project cms/DW.Cms.csproj

# Run with hot reload
dotnet watch --project cms/DW.Cms.csproj
```

### Site (Next.js)

```bash
# Dev server
pnpm --filter @web/site dev

# Build
pnpm --filter @web/site build

# Lint
pnpm --filter @web/site lint

# Lint and auto-fix
pnpm --filter @web/site lint:fix

# Format code with Prettier (includes import organization)
pnpm --filter @web/site format

# Check formatting
pnpm --filter @web/site format:check
```

### Shared Package

```bash
# Lint TypeScript
pnpm --filter @web/shared lint

# Lint and auto-fix
pnpm --filter @web/shared lint:fix

# Format code (includes import organization)
pnpm --filter @web/shared format

# Check formatting
pnpm --filter @web/shared format:check
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
