# Multi-Tenant Architecture

## Overview

This application uses a **build-time tenant selection** approach rather than runtime switching. Each tenant (Mayo Clinic, The Wellness District, Digital Wellness) has completely isolated styles in their own folders, ensuring no shared files with mixed tenant styles.

## Design Principles

1. **Build-Time Selection**: Tenant is chosen via environment variable when running dev/build
2. **Isolated Styles**: Each tenant has its own folder - no shared style files with multiple tenant configs
3. **Configuration Only in Shared**: The `shared/tenants` workspace contains ONLY configuration data (API URLs, feature flags, branding), NOT styles
4. **Optimal Bundle Size**: Only the selected tenant's styles are included in the bundle

## Directory Structure

```
site/src/
├── app/
│   ├── globals.scss              # Default (no tenant)
│   ├── globals-mcd.scss          # Mayo Clinic entry point
│   ├── globals-twd.scss          # The Wellness District entry point
│   ├── globals-dw.scss           # Digital Wellness entry point
│   ├── styles-loader.tsx         # Dynamic loader based on env var
│   └── layout.tsx                # Imports styles-loader
│
└── styles/
    ├── base.scss                 # Base theme + CSS reset (shared)
    ├── dark.scss                 # Dark mode overrides (shared)
    ├── common.scss               # Common utilities (shared)
    │
    └── tenants/
        ├── mcd/
        │   └── theme.scss        # Mayo Clinic theme only
        ├── twd/
        │   └── theme.scss        # TWD theme only
        └── dw/
            └── theme.scss        # DW theme only

shared/tenants/                   # Configuration workspace
├── types.ts                      # TenantConfig, TenantBranding, etc.
└── index.ts                      # Runtime config (API URLs, features, hosts)
```

## How It Works

### 1. Development Scripts

```bash
pnpm mcd    # Sets NEXT_PUBLIC_DEV_TENANT=mcd
pnpm twd    # Sets NEXT_PUBLIC_DEV_TENANT=twd
pnpm dw     # Sets NEXT_PUBLIC_DEV_TENANT=dw
```

### 2. Style Loading Process

**app/layout.tsx** imports `styles-loader.tsx`:

```tsx
import './styles-loader';
```

**app/styles-loader.tsx** conditionally loads the correct global styles:

```tsx
if (process.env.NEXT_PUBLIC_DEV_TENANT === 'mcd') {
  require('./globals-mcd.scss');
} else if (process.env.NEXT_PUBLIC_DEV_TENANT === 'twd') {
  require('./globals-twd.scss');
} else if (process.env.NEXT_PUBLIC_DEV_TENANT === 'dw') {
  require('./globals-dw.scss');
} else {
  require('./globals.scss'); // Default
}
```

### 3. Global Style Entry Points

Each tenant's global file imports:
1. Base styles (CSS reset, default colors, semantic colors, shadows, etc.)
2. Tenant-specific theme (only their colors and radius)
3. Dark mode overrides (shared)
4. Common utilities (shared)

**Example: globals-mcd.scss**
```scss
@import '../styles/base.scss';
@import '../styles/tenants/mcd/theme.scss';
@import '../styles/dark.scss';
@import '../styles/common.scss';
```

### 4. Tenant Theme Files

Each tenant has a single `theme.scss` that defines ONLY their brand colors:

**styles/tenants/mcd/theme.scss**
```scss
:root {
  --primary: #0051a5;           // Mayo blue
  --primary-foreground: #ffffff;
  --primary-hover: #003d7a;
  --primary-active: #002952;
  
  --background: #f5f7fa;        // Pale blue-grey
  --radius: 0.5rem;
  // ... Mayo-specific colors only
}
```

**Key Point**: No `html[data-tenant='mcd']` selectors. The entire `:root` is Mayo-specific when this file is loaded.

## Shared Configuration (shared/tenants/)

This workspace provides **configuration data only**, NOT styles:

### What's Included

```typescript
// shared/tenants/index.ts
export const TENANTS: TenantConfig[] = [
  {
    name: 'mcd',
    host: 'diet.mayoclinic.org',
    zones: ['marketing', 'member', 'onboarding'],
    defaultZone: 'marketing',
    branding: {
      title: 'Mayo Clinic Diet',
      description: 'Science-based weight loss program',
    },
    api: {
      cmsUrl: 'https://cms.mayo.example.com',
      cmsApiKey: 'xxx',
      analyticsId: 'GA-123',
    },
    features: {
      memberPortal: true,
      onboarding: true,
      darkMode: true,
      blog: true,
    },
  },
  // ... twd, dw configs
];

// Helper functions
export function getTenantByHost(host: TenantHost): TenantConfig
export function getTenantFromHeaders(headers: Headers): TenantHost | null
export function isValidZoneForTenant(host: TenantHost, zone: string): boolean
```

### What's NOT Included

- ❌ Theme colors (moved to `site/src/styles/tenants/*/theme.scss`)
- ❌ Typography settings (if needed, add to tenant theme files)
- ❌ Any SCSS or CSS

The `TenantTheme` interface can be removed from `types.ts` as it's no longer used.

## Color System

All tenants share the same color token structure but with different values:

### Brand Colors (4 levels)
- Primary, Secondary, Tertiary, Accent
- Each with: base, foreground, hover, active

### Semantic Colors
- Positive (success), Negative (error), Warning, Info
- Each with: base, foreground, background, border

### Backgrounds (5 levels)
- `--background`, `--background-subtle`, `--background-muted`, `--background-overlay`, `--background-inverse`

### Surfaces (3 levels for cards)
- `--surface-1`, `--surface-2`, `--surface-3`

### Borders (5 states)
- `--border`, `--border-subtle`, `--border-strong`, `--border-hover`, `--border-focus`

### Forms (7 variables)
- Input backgrounds, borders (default/hover/focus), placeholder, disabled states

### Shadows
- `--shadow-sm/md/lg/xl`

See [color-system.md](./color-system.md) for complete documentation.

## Tenant Themes

### Mayo Clinic Diet (MCD)
- **Primary**: `#0051a5` (Mayo blue)
- **Background**: `#f5f7fa` (pale blue-grey)
- **Radius**: `0.5rem`
- **Vibe**: Professional, medical, trustworthy

### The Wellness District (TWD)
- **Primary**: `#00a65a` (wellness green)
- **Background**: `#f5faf7` (pale green tint)
- **Radius**: `0.75rem`
- **Vibe**: Natural, calming, holistic

### Digital Wellness (DW)
- **Primary**: `#7c3aed` (digital purple)
- **Background**: `#fafafa` (clean white)
- **Radius**: `0.625rem`
- **Vibe**: Modern, tech-forward, innovative

## Adding a New Tenant

1. **Create tenant config** in `shared/tenants/index.ts`:
   ```typescript
   {
     name: 'new',
     host: 'www.newtenant.com',
     zones: ['marketing'],
     defaultZone: 'marketing',
     branding: { ... },
     features: { ... }
   }
   ```

2. **Create theme file** at `site/src/styles/tenants/new/theme.scss`:
   ```scss
   :root {
     --primary: #abcdef;
     --primary-foreground: #ffffff;
     --background: #fafafa;
     // ... all required color tokens
   }
   ```

3. **Create global entry point** at `site/src/app/globals-new.scss`:
   ```scss
   @import '../styles/base.scss';
   @import '../styles/tenants/new/theme.scss';
   @import '../styles/dark.scss';
   @import '../styles/common.scss';
   ```

4. **Update styles-loader.tsx**:
   ```tsx
   if (process.env.NEXT_PUBLIC_DEV_TENANT === 'new') {
     require('./globals-new.scss');
   }
   ```

5. **Add dev script** in `site/package.json` and root `package.json`:
   ```json
   "new": "NEXT_PUBLIC_DEV_TENANT=new next dev"
   ```

## Production Builds

For production, build separate deployments per tenant:

```bash
# Build Mayo Clinic
NEXT_PUBLIC_DEV_TENANT=mcd pnpm build

# Build TWD
NEXT_PUBLIC_DEV_TENANT=twd pnpm build

# Build DW
NEXT_PUBLIC_DEV_TENANT=dw pnpm build
```

Each build contains ONLY that tenant's styles (optimal bundle size).

## Benefits of This Approach

### ✅ Pros
1. **Zero runtime overhead** - No CSS for other tenants in bundle
2. **Clear separation** - Each tenant's styles in their own folder
3. **Type-safe** - TypeScript ensures config consistency
4. **Easy to maintain** - Change one tenant without affecting others
5. **Optimal bundle size** - Only load what you need
6. **No naming conflicts** - No `data-tenant` attribute switching

### ⚠️ Considerations
1. **Multiple builds required** - One build per tenant for production
2. **Environment variable required** - Must set `NEXT_PUBLIC_DEV_TENANT`
3. **No runtime switching** - Can't switch tenants without rebuild

## Migration Notes

### Before (Runtime Switching)
```scss
html[data-tenant='mcd'] {
  --primary: #0051a5;
}
html[data-tenant='twd'] {
  --primary: #00a65a;
}
```
❌ All tenants' styles in one file
❌ All styles sent to browser (bloated bundle)
❌ Runtime attribute switching

### After (Build-Time Selection)
```scss
// styles/tenants/mcd/theme.scss
:root {
  --primary: #0051a5;
}

// styles/tenants/twd/theme.scss (separate file)
:root {
  --primary: #00a65a;
}
```
✅ Each tenant in separate file
✅ Only selected tenant's styles in bundle
✅ Build-time selection

## Testing

```bash
# Test Mayo Clinic
pnpm mcd
# Visit http://localhost:3000

# Test TWD
pnpm twd
# Visit http://localhost:3000

# Test DW
pnpm dw
# Visit http://localhost:3000
```

Each should show different colors and backgrounds according to their theme.

## Troubleshooting

### Styles not loading
- Check `NEXT_PUBLIC_DEV_TENANT` is set correctly
- Verify tenant name matches exactly ('mcd', 'twd', or 'dw')
- Check styles-loader.tsx is imported in layout.tsx

### Wrong tenant colors showing
- Clear Next.js cache: `rm -rf .next`
- Restart dev server
- Verify correct global-*.scss file is being imported

### Dark mode not working
- Check `.dark` class is applied to html/body
- Verify dark.scss is imported in global-*.scss files
- Check dark mode overrides in styles/dark.scss

## Future Enhancements

- [ ] Automated build script for all tenants
- [ ] Tenant-specific typography files
- [ ] Tenant-specific component overrides (optional)
- [ ] CI/CD pipeline for multi-tenant builds
- [ ] Environment-based configuration (dev/staging/prod per tenant)

---

**Last Updated**: February 2026
