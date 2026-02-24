# Multi-Tenant System

## Overview

The platform supports multiple tenants, each with distinct branding, features, and routing. Tenancy is **build-time**, not runtime: the `TENANT` environment variable determines which tenant is active when the Next.js dev server or build starts. There is no dynamic tenant detection at request time.

| Tenant | Name | Host |
|--------|------|------|
| `mcd` | Mayo Clinic Diet | `diet.mayoclinic.org` |
| `twd` | Total Wellbeing Diet | `www.totalwellbeingdiet.com` |
| `dw` | Digital Wellness | `www.digitalwellness.com` |
| `default` | Local / fallback | `localhost` |

---

## Monorepo Structure

```
next-web/
├── shared/               # @web/shared — shared config, types, and SCSS themes
│   └── tenants/
│       ├── index.ts      # getCurrentTenant(), re-exports all configs
│       ├── types.ts      # TenantName, TenantConfig, Zone, etc.
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
├── site/                 # Next.js frontend
│   ├── proxy.ts          # Zone-based routing (Next.js 16 proxy convention)
│   ├── next.config.ts    # Per-tenant distDir, env, SCSS injection
│   └── src/
│       └── tenants/
│           └── tenant-config.ts  # Active tenant config (build-time resolved)
└── cms/                  # Umbraco .NET CMS (separate process)
```

The `shared/` package is consumed via the pnpm workspace alias `@web/shared`. The `site/` package lists it as a dependency (`"@web/shared": "workspace:*"`) and Next.js is configured to transpile it:

```ts
// site/next.config.ts
transpilePackages: ['@web/shared'],
```

TypeScript path resolution is configured in `site/tsconfig.json`:

```json
"paths": {
  "@/*": ["./src/*"],
  "@web/shared/*": ["../shared/*"]
}
```

---

## Running a Tenant

Each tenant has a dedicated dev script in `site/package.json` running on its own port:

```bash
pnpm dev:mcd   # TENANT=mcd  → port 3000, distDir .next-mcd
pnpm dev:twd   # TENANT=twd  → port 3001, distDir .next-twd
pnpm dev:dw    # TENANT=dw   → port 3002, distDir .next-dw
pnpm dev       # TENANT=default → port 3000, distDir .next
```

Convenience aliases exist at the monorepo root:

```bash
pnpm mcd   # → site: pnpm dev:mcd
pnpm twd   # → site: pnpm dev:twd
pnpm dw    # → site: pnpm dev:dw
```

Separate `distDir` values let all three tenant dev servers run simultaneously without overwriting each other's build cache.

---

## Tenant Configuration

Each tenant has a `config.ts` in `shared/tenants/<name>/config.ts` exporting a `TenantConfig` object:

```ts
// shared/tenants/mcd/config.ts
export const config: TenantConfig = {
  name: 'mcd',
  host: 'diet.mayoclinic.org',
  zones: ['marketing', 'member', 'onboarding'],
  defaultZone: 'marketing',
  branding: {
    title: 'Mayo Clinic Diet',
    description: 'Science-based weight loss program',
  },
  features: {
    memberPortal: true,
    onboarding: true,
    darkMode: true,
    blog: true,
  },
};
```

### TenantConfig shape

| Field | Type | Description |
|-------|------|-------------|
| `name` | `TenantName` | Tenant identifier (`mcd`, `twd`, `dw`, `default`) |
| `host` | `TenantHost` | Production hostname |
| `zones` | `Zone[]` | Routes the tenant exposes (`marketing`, `member`, `onboarding`) |
| `defaultZone` | `Zone` | Zone that `/` redirects to |
| `branding` | `TenantBranding` | Title, description, logo, favicon |
| `features` | `TenantFeatures` | Feature flags: `memberPortal`, `onboarding`, `darkMode`, `blog` |
| `api` | `TenantApiConfig` | CMS URL, API key, analytics ID |
| `typography` | `TenantTypography` | Font families, base font size |

### Loading at build time

`site/src/tenants/tenant-config.ts` imports all tenant configs statically (so Turbopack can tree-shake unused ones) and resolves the active one at build time:

```ts
import { getCurrentTenant } from '@web/shared/tenants';
import { config as mcdConfig } from '@web/shared/tenants/mcd/config';
import { config as twdConfig } from '@web/shared/tenants/twd/config';
import { config as dwConfig } from '@web/shared/tenants/dw/config';
import { config as defaultConfig } from '@web/shared/tenants/default/config';

export const currentTenant: TenantName = getCurrentTenant();

const configs: Record<TenantName, TenantConfig> = {
  mcd: mcdConfig, twd: twdConfig, dw: dwConfig, default: defaultConfig,
};

export const tenantConfig = configs[currentTenant];
export const DEFAULT_ZONE = tenantConfig.defaultZone || 'marketing';
```

`getCurrentTenant()` reads `process.env.NEXT_PUBLIC_TENANT`, which is injected by `next.config.ts`.

---

## SCSS Theming

Each tenant provides a `theme.scss` in `shared/tenants/<name>/theme.scss` that overrides CSS custom properties on `:root`, for example:

```scss
// shared/tenants/mcd/theme.scss
:root {
  --color-primary: oklch(55% 0.18 250);
  --color-primary-foreground: oklch(98% 0 0);
  --radius: 0.5rem;
}
```

### How themes are injected

`next.config.ts` uses Sass compiler options to prepend the tenant's theme to **every** SCSS file in the project:

```ts
// site/next.config.ts
sassOptions: {
  loadPaths: [path.resolve(__dirname, '..')],   // monorepo root
  additionalData: `@use 'shared/tenants/${tenant}/theme';`,
},
```

- `loadPaths` points the Sass compiler at the monorepo root so it can resolve `shared/tenants/…` paths.
- `additionalData` prepends the `@use` statement before every `.scss` file is compiled.

This means no explicit import of the theme is needed in application code — switching the `TENANT` env var is sufficient.

---

## Zone-Based Routing

Tenants expose a subset of zones: `marketing`, `member`, `onboarding`. The `proxy.ts` file at the `site/` root (Next.js 16 proxy convention) handles routing:

```ts
// site/proxy.ts
import { tenantConfig } from './src/tenants/tenant-config';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect / to the tenant's default zone
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${tenantConfig.defaultZone}`, request.url));
  }

  // Allow valid zones through, tagging the response header
  const validZones = tenantConfig.zones || ['marketing'];
  if (validZones.includes(firstSegment)) {
    response.headers.set('x-zone', firstSegment);
    return response;
  }

  // Rewrite unrecognised paths under the default zone
  return NextResponse.rewrite(new URL(`/${tenantConfig.defaultZone}${pathname}`, request.url));
}
```

The proxy is excluded from static assets (`_next/static`, images, favicons) via the `matcher` config. App Router pages live under `src/app/<zone>/` and the zone segment is used in layouts to scope navigation and content.

---

## Runtime Access to Tenant

In Server Components and shared utilities, import from `site/src/tenants/tenant-config.ts`:

```ts
import { tenantConfig, currentTenant, DEFAULT_ZONE } from '@/tenants/tenant-config';
```

In Client Components, use the injected env var directly or via `getCurrentTenant()`:

```ts
import { getCurrentTenant } from '@web/shared/tenants';

const tenant = getCurrentTenant(); // reads NEXT_PUBLIC_TENANT
```

---

## Feature Flags

Use `tenantConfig.features` to conditionally render features:

```tsx
import { tenantConfig } from '@/tenants/tenant-config';

export function Nav() {
  return (
    <nav>
      <a href="/marketing">Home</a>
      {tenantConfig.features?.memberPortal && <a href="/member">Dashboard</a>}
      {tenantConfig.features?.blog && <a href="/marketing/blog">Blog</a>}
    </nav>
  );
}
```

---

## Adding a New Tenant

1. **Add the name to the `TenantName` union** in `shared/tenants/types.ts`:
   ```ts
   export type TenantName = 'mcd' | 'twd' | 'dw' | 'newco' | 'default';
   ```

2. **Add the host to `TenantHost`** in `shared/tenants/types.ts`.

3. **Create `shared/tenants/newco/config.ts`** implementing `TenantConfig`.

4. **Create `shared/tenants/newco/theme.scss`** with `:root` CSS custom property overrides.

5. **Export from `shared/tenants/index.ts`**:
   ```ts
   export { config as newcoConfig } from './newco/config';
   ```

6. **Add to the configs map** in `site/src/tenants/tenant-config.ts`:
   ```ts
   import { config as newcoConfig } from '@web/shared/tenants/newco/config';
   const configs: Record<TenantName, TenantConfig> = { ..., newco: newcoConfig };
   ```

7. **Add dev script** in `site/package.json`:
   ```json
   "dev:newco": "TENANT=newco next dev -p 3003"
   ```

8. **Add public assets folder** at `site/public/tenants/newco/` for logo, favicon, etc.

9. **Validate tenant** — `next.config.ts` will throw at startup if `TENANT` is not in the `validTenants` array. Add `'newco'` to that array.
