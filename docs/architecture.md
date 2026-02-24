#  Architecture

## Overview

This is a **multi-tenant wellness platform** built with Next.js 16 (App Router) and a pragmatic, API-driven architecture. The system supports three tenants (Mayo Clinic, The Wellness District, Digital Wellness) with distinct theming and features.

### Design Philosophy

- **Pragmatic over Dogmatic**: API-driven approach reusing DTOs directly instead of over-abstracting with domain models
- **Multi-tenant First**: Domain-based routing with tenant-specific theming, branding, and features
- **Service Locator Pattern**: Dependency injection for swappable providers (CMS, Auth, etc.)
- **Component-Driven**: Base UI headless components with SCSS modules for styling
- **Monorepo**: pnpm workspaces for shared code between site and CMS

## Technology Stack

### Frontend
- **Next.js 16.1** - React framework with App Router and Server Components
- **TypeScript 5.7** - Strict typing
- **SCSS (sass 1.97.3)** - CSS modules and global styles
- **Base UI (@base-ui/react 1.2.0)** - Headless accessible components
- **sanitize.css 13.0.0** - CSS reset
- **clsx 2.1.1** - Conditional className utility

### Backend/CMS
- **Umbraco CMS** - .NET 10 headless CMS
- **Content Delivery API v2** - RESTful content API

### Infrastructure
- **pnpm 9.15.0** - Fast, disk-space efficient package manager
- **Docker Compose** - Local development environment

## Project Structure

```
next-web/
├── package.json                 # Root workspace config with tenant dev scripts
├── pnpm-workspace.yaml         # Workspaces: shared, site
├── docker-compose.yml          # PostgreSQL, CMS containers
│
├── cms/                        # Umbraco CMS (.NET 10)
│   ├── DW.Cms.csproj
│   ├── Program.cs
│   ├── Configuration/          # Multi-tenant configuration
│   │   └── TenantConfiguration.cs
│   ├── Middleware/             # Tenant detection middleware
│   │   └── TenantMiddleware.cs
│   ├── Services/               # Tenant service logic
│   │   ├── ITenantService.cs
│   │   └── TenantService.cs
│   ├── Views/                  # Block grid, block list templates
│   └── wwwroot/                # Media, static assets
│
├── shared/                     # @web/shared workspace
│   ├── package.json
│   └── tenants/                # Multi-tenant definitions
│       ├── types.ts            # TenantConfig, TenantTheme, etc.
│       └── index.ts            # TENANTS array, getTenantFromHeaders()
│
├── site/                       # @web/site workspace (Next.js app)
│   ├── package.json            # mcd, twd, dw dev scripts
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── components.json         # Component library config
│   │
│   └── src/
│       ├── app/                # Next.js App Router (Primary Adapter)
│       │   ├── layout.tsx      # Root layout with tenant detection
│       │   ├── page.tsx        # Home page
│       │   ├── globals.scss    # Global styles + tenant themes
│       │   ├── marketing/      # Public marketing zone
│       │   │   ├── page.tsx
│       │   │   └── about/
│       │   ├── member/         # Member portal zone (authenticated)
│       │   │   └── page.tsx
│       │   └── onboarding/     # Onboarding flow zone
│       │       └── page.tsx
│       │
│       ├── components/
│       │   ├── hooks/          # UI/presentation hooks (empty - future)
│       │   └── ui/             # Reusable UI components
│       │       ├── button.tsx             # Base UI Button component
│       │       ├── button.module.scss     # Button styles
│       │       └── index.ts               # Barrel exports
│       │
│       ├── models/             # DTOs and type definitions
│       │   └── cms.ts          # ICmsProvider, ContentItem, CmsApiOptions
│       │
│       ├── providers/          # Secondary Adapters (external services)
│       │   ├── cms/
│       │   │   └── umbraco/
│       │   │       ├── index.ts           # Barrel export
│       │   │       ├── provider.ts        # UmbracoProvider class
│       │   │       ├── client.ts          # API client functions
│       │   │       └── types.ts           # Umbraco-specific types
│       │   └── models/         # Provider-specific models (empty)
│       │
│       ├── common/             # Shared utilities
│       │   ├── dependencies.ts # Service locator (getCmsProvider)
│       │   ├── constants/      # App constants
│       │   └── helpers/        # Utility functions
│       │
│       └── proxy.ts            # Middleware proxy (not yet wired up)
│
├── scripts/
│   └── create-database.sh      # Database initialization script
│
└── docs/
    ├── architecture.md         # This file
    ├── color-system.md         # Color token documentation
    └── shadcn.md               # (Legacy - removed shadcn/tailwind)
```

## Key Architectural Patterns

### 1. Multi-Tenant System

**Tenant Detection**:
- Production: Domain-based routing (mcd.example.com, twd.example.com, dw.example.com)
- Development: Environment variable override (`NEXT_PUBLIC_DEV_TENANT=mcd`)

**Tenant Configuration** (`shared/tenants/`):
```typescript
interface TenantConfig {
  name: TenantName;              // 'mcd' | 'twd' | 'dw'
  hosts: TenantHost[];           // Production domains
  theme?: TenantTheme;           // Colors, radius
  typography?: TenantTypography; // Fonts, sizes
  branding?: TenantBranding;     // Logo, favicon, titles
  api?: TenantApiConfig;         // CMS URL, API keys, analytics
  features?: TenantFeatures;     // Feature flags per tenant
}
```

**Tenant Theming**:
- CSS variables in `globals.scss` with `html[data-tenant='mcd']` selectors
- Comprehensive color system (primary, secondary, tertiary, accent, semantic, surfaces, borders, forms)
- Hex colors (not OKLCH) for broad browser compatibility
- Dark mode support via `.dark` class

### 2. Service Locator Pattern

**Purpose**: Dependency injection for swappable providers

**Implementation** (`common/dependencies.ts`):
```typescript
class ServiceLocator {
  register<T>(key: string, implementation: T): void
  resolve<T>(key: string): T
}

// Usage
export function getCmsProvider(): ICmsProvider {
  return ServiceLocator.resolve<ICmsProvider>(ServiceKeys.CMS_PROVIDER);
}

// Configuration
configureServices() {
  ServiceLocator.register(ServiceKeys.CMS_PROVIDER, umbracoProvider);
}
```

**Benefits**:
- Easy to swap CMS providers (Umbraco → Contentful, Strapi, etc.)
- Testable via mock providers
- Single source of truth for dependencies

### 3. Provider Pattern (Adapter)

**CMS Provider** (`providers/cms/`):
```typescript
interface ICmsProvider {
  getContentByPath(path: string): Promise<ContentItem | null>
  getContentById(id: string): Promise<ContentItem | null>
  getContentByIds(ids: string[]): Promise<ContentItem[]>
  getContent(params: ContentCollectionParams): Promise<ContentCollection>
  searchContent(params: SearchParams): Promise<ContentCollection>
}
```

**Umbraco Implementation**:
- `client.ts`: Low-level API calls
- `provider.ts`: Adapter implementing ICmsProvider
- `types.ts`: Umbraco-specific types
- Exported as singleton `umbracoProvider`

### 4. Component Architecture

**Base UI Approach**:
- Headless components (no styles included)
- Accessibility built-in (ARIA, keyboard navigation)
- Full control over styling via SCSS modules

**Button Component** (`components/ui/button.tsx`):
- 8 variants: primary, secondary, destructive, positive, warning, info, outline, ghost
- 3 sizes: sm, md, lg
- Loading state with spinner
- CSS variables for tenant theming

**Pattern**:
```tsx
// components/ui/button.tsx
import { Button as BaseButton } from '@base-ui/react';
import styles from './button.module.scss';

export function Button({ variant = 'primary', size = 'md', ... }) {
  return <BaseButton className={clsx(styles.button, styles[variant], styles[size])} />
}
```

### 5. Routing & Zones

**App Router Structure**:
- `/marketing` - Public pages (all tenants)
- `/member` - Member portal (requires authentication)
- `/onboarding` - Onboarding flow (specific tenants)

**Future**: Middleware-based zone routing and authentication checks

## Hooks Placement Guide

### Overview

In a Hexagonal Architecture for React, hooks are generally considered part of the **Providers Layer** (specifically the Primary Adapter) because they are a framework-specific technology.

However, their specific placement depends on what they are doing.

### Hook Categories

#### 1. `src/ui/hooks` (Primary Adapter / View Logic)

Hooks that manage UI state, animations, or DOM interactions should live near your components or in a global UI hooks folder.

**Examples:**
- `useModal`
- `useWindowSize`
- `useFormState`

**Role:** These drive the UI but do not contain business rules.

---

### 2. `src/application/hooks` (Use Case Orchestrators)

These hooks act as the bridge (Port) between your UI and the Domain. They call domain services and use-cases, effectively "adapting" the React world to your business logic.

**Examples:**
- `useGetProducts`
- `useAuthenticateUser`

**Role:** They orchestrate data flow—e.g., calling a Repository (Secondary Adapter), triggering a Domain Service, and then exposing the result as a React state.

---

#### 3. `src/providers/hooks` (Secondary Adapter / Side Effects)

If a hook is tightly coupled to an external library or browser API (like React Query or Firebase), it belongs here.

**Examples:**
- `useFirestoreSubscription`
- `useAxiosInterceptor`

**Role:** They wrap "outside world" technologies so the rest of your app doesn't have to import them directly.

---

### Recommended Folder Structure

For a clean separation, many developers use a "Vertical Slicing" approach where hooks live inside feature-specific folders:

```
src/
├── models/            # Pure DTOs (No Hooks allowed!)
│   └── cms.ts         # CMS interfaces, types
├── application/       # Use Cases (future)
│   └── hooks/         # Hooks that orchestrate Domain + Providers
├── providers/         # Adapters (API, Storage, Auth)
│   ├── cms/
│   │   └── umbraco/
│   └── hooks/         # Hooks wrapping external libraries (future)
├── components/        # UI Components
│   ├── ui/            # Reusable components (Button, Input, etc.)
│   └── hooks/         # Purely visual/UI hooks (future)
└── app/               # Next.js App Router
    ├── marketing/
    ├── member/
    └── onboarding/
```

### Key Principles

1. **Models Layer is Pure:** No hooks or React-specific code in models
2. **Application Hooks orchestrate:** They connect UI to domain logic without knowing React details
3. **Provider Hooks wrap external dependencies:** Keep third-party coupling isolated
4. **Component Hooks are presentation-only:** They handle visual state but not business logic

### Current Project Implementation

Our implementation follows a pragmatic approach:

- **`src/models/cms.ts`** - Pure TypeScript interfaces for CMS content (ICmsProvider, ContentItem, etc.)
- **`src/common/dependencies.ts`** - Service locator for dependency injection
- **`src/providers/cms/umbraco/`** - CMS adapter implementing ICmsProvider
- **`src/components/ui/`** - Base UI components with SCSS modules
- **`src/app/`** - Next.js pages and layouts (Server Components)
- **`src/components/hooks/`** - Reserved for future UI hooks
- **`src/application/hooks/`** - Reserved for future use case orchestration hooks

Future additions should follow the hooks placement guidelines above.

## Development Workflow

### Running the Application

```bash
# Root directory commands
pnpm install                # Install all dependencies
pnpm dev                    # Run site with default tenant
pnpm mcd                    # Run site as Mayo Clinic tenant
pnpm twd                    # Run site as The Wellness District tenant
pnpm dw                     # Run site as Digital Wellness tenant

# Site-specific commands (from site/ directory)
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm format                 # Format with Prettier

# CMS commands
pnpm cms:build             # Build Umbraco CMS
pnpm cms:run               # Run Umbraco CMS
```

### Adding a New Component

1. Create component file in `src/components/ui/[name].tsx`
2. Create SCSS module `src/components/ui/[name].module.scss`
3. Use Base UI headless components as foundation
4. Style with CSS variables from `globals.scss`
5. Export from `src/components/ui/index.ts`

Example:
```tsx
// src/components/ui/input.tsx
'use client';
import { Input as BaseInput } from '@base-ui/react';
import styles from './input.module.scss';

export function Input({ className, ...props }) {
  return <BaseInput className={clsx(styles.input, className)} {...props} />;
}
```

### Adding a New Provider

1. Create folder `src/providers/[provider-name]/`
2. Define interface in `src/models/[provider-name].ts`
3. Implement adapter in provider folder
4. Register in `src/common/dependencies.ts`
5. Create getter function (e.g., `getAuthProvider()`)

### Tenant Theming

To add or modify tenant colors, edit `src/app/globals.scss`:

```scss
html[data-tenant='new-tenant'] {
  --primary: #abcdef;
  --primary-foreground: #ffffff;
  --background: #fafafa;
  // ... other color tokens
}
```

See [color-system.md](color-system.md) for complete color token documentation.

## Future Enhancements

### Planned Features
- [ ] Middleware-based routing and authentication
- [ ] Application layer hooks for use case orchestration
- [ ] Authentication provider (Auth0, Clerk, or custom)
- [ ] More Base UI components (Input, Select, Dialog, Popover, etc.)
- [ ] Member portal features
- [ ] Onboarding flow implementation
- [ ] Analytics integration
- [ ] Dark mode toggle component

### Technical Debt
- Wire up `proxy.ts` as Next.js middleware
- Add comprehensive error boundaries
- Implement loading states for Server Components
- Add unit tests (Vitest)
- Add E2E tests (Playwright)
- Performance monitoring (Web Vitals)

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Base UI Documentation](https://base-ui.com/)
- [Umbraco Content Delivery API](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api)
- [Color System Documentation](./color-system.md)
- [SCSS Modules](https://sass-lang.com/documentation/at-rules/use)

---

**Last Updated**: February 2026
