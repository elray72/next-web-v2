# Project Context: Digital Wellness Web Platform

## Session Summary

This document captures the planning and implementation conversation for a multi-tenant web platform with Umbraco CMS and Next.js frontend.

---

## User Requirements

- Umbraco 17 on .NET 10 LTS
- SQL Server 2022 hosted via Docker
- Next.js frontend (multi-tenant, multi-zone)
- Shared tenant configuration between CMS and frontend
- Flat folder structure: `web/cms`, `web/site`, `web/shared`

---

## Project Structure

```
web/
├── cms/                      # Umbraco CMS (.NET 10)
│   ├── Web.csproj
│   ├── Program.cs
│   ├── Configuration/
│   │   └── TenantConfiguration.cs
│   ├── Middleware/
│   │   └── TenantMiddleware.cs
│   └── Services/
│       ├── ITenantService.cs
│       └── TenantService.cs
├── site/                     # Next.js frontend
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── marketing/
│       │   ├── member/
│       │   └── onboarding/
│       └── middleware.ts
├── shared/                   # Shared code (pnpm workspace)
│   ├── package.json
│   └── tenants/
│       ├── index.ts
│       └── types.ts
├── docker-compose.yml
├── package.json              # Workspace root
└── pnpm-workspace.yaml
```

---

## Key Decisions

### Stack
- **.NET 10 LTS** + **Umbraco 17.1.0 LTS** (supported until Nov 2028)
- **Next.js 16.1** + **React 19.1**
- **SQL Server 2022** in Docker
- **pnpm workspaces** for monorepo management

### Multi-Tenancy Architecture

**Tenants (Domain-Based):**
| Name | Host | Zones |
|------|------|-------|
| mcd | diet.mayoclinic.org | marketing, member, onboarding |
| twd | www.totalwellbeingdiet.com | marketing, member, onboarding |
| dw | www.digitalwellness.com | marketing |

**Zones (Path-Based):**
- `marketing` - Public-facing content
- `member` - Member exclusive content
- `onboarding` - Member onboarding flows

### Shared Configuration
Tenant config lives in `@web/shared/tenants` with both short names and host domains:
```typescript
export const TENANTS = [
  { name: 'mcd', host: 'diet.mayoclinic.org', zones: [...], defaultZone: 'marketing' },
  { name: 'twd', host: 'www.totalwellbeingdiet.com', zones: [...], defaultZone: 'marketing' },
  { name: 'dw', host: 'www.digitalwellness.com', zones: [...], defaultZone: 'marketing' },
];
```

- **CMS**: `cms/Configuration/TenantConfiguration.cs` (C# version)
- **Site**: `import { TENANTS, getTenantByHost } from '@web/shared/tenants'`

---

## Configuration

### Connection String
```
Server=localhost,1433;Database=UmbracoDb;User Id=sa;Password=UmbracoDevP@ss123!;TrustServerCertificate=True;MultipleActiveResultSets=True
```

### Docker Compose
- SQL Server 2022 on port 1433
- Volume: `sqlserver-data`
- SA Password: `UmbracoDevP@ss123!`

---

## Commands Reference

```bash
# Install dependencies
pnpm install

# Start SQL Server
docker-compose up -d

# CMS
dotnet build cms
dotnet run --project cms

# Site
pnpm dev
pnpm --filter @web/site lint
pnpm --filter @web/site format  # Auto-organizes imports

# Shared
pnpm --filter @web/shared lint:fix
pnpm --filter @web/shared format
```

## Development Tools

### Linting & Formatting
- **ESLint**: TypeScript linting in both `site` and `shared`
- **Prettier**: Code formatting with 80-char limit
- **Import Organization**: Automatic via `prettier-plugin-organize-imports`
  - Removes unused imports
  - Sorts alphabetically
  - Groups: built-ins → external → internal

---

## Apple Silicon Compatibility

**Issue:** SQL Server on Docker Desktop has AVX emulation problems on M1/M2/M3/M4 Macs.

**User's Mac:** Apple M4, macOS 15.7.1 (Sequoia)

**Workaround:** Install OrbStack (`brew install orbstack`)

---

## Files Created

| File | Purpose |
|------|---------|
| `cms/` | Umbraco CMS (renamed from src) |
| `site/` | Next.js frontend |
| `site/eslint.config.mjs` | ESLint configuration for Next.js |
| `site/.prettierrc.json` | Prettier config with import organization |
| `shared/tenants/` | Shared tenant configuration |
| `shared/eslint.config.mjs` | ESLint configuration for shared code |
| `shared/.prettierrc.json` | Prettier config with import organization |
| `package.json` | pnpm workspace root |
| `pnpm-workspace.yaml` | Workspace config |
| `docker-compose.yml` | SQL Server container |
| `README.md` | Project documentation |

---

## External References

- [Umbraco 17 LTS](https://umbraco.com/blog/umbraco-17-lts-release/)
- [Umbraco .NET CLI Install](https://docs.umbraco.com/umbraco-cms/fundamentals/setup/install/install-umbraco-with-templates)
- [Next.js App Router](https://nextjs.org/docs/app)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

*Last updated: 2026-02-24*
