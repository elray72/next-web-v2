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
| Host | Zones |
|------|-------|
| diet.mayoclinic.org | marketing, member, onboarding |
| www.totalwellbeingdiet.com | marketing, member, onboarding |
| www.digitalwellness.com | marketing |

**Zones (Path-Based):**
- `marketing` - Public-facing content
- `member` - Member-exclusive content
- `onboarding` - Tenant onboarding flows

### Shared Configuration
Tenant config lives in `@web/shared/tenants` and is imported by both:
- **CMS**: `cms/Configuration/TenantConfiguration.cs` (C# version)
- **Site**: `import { TENANT_ZONES } from '@web/shared/tenants'`

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
```

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
| `shared/tenants/` | Shared tenant configuration |
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

*Context saved: 2026-02-03*
