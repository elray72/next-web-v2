# Troubleshooting

Common issues and solutions for the multi-tenant Next.js application.

## Running Multiple Tenants Simultaneously

**✅ You can run multiple tenant dev servers at the same time!**

Each tenant uses a separate port and build directory:
```bash
# Terminal 1
pnpm mcd    # http://localhost:3000

# Terminal 2  
pnpm twd    # http://localhost:3001

# Terminal 3
pnpm dw     # http://localhost:3002
```

This is useful for:
- Comparing tenant themes side-by-side
- Testing cross-tenant features
- Development with multiple team members on different tenants

---

## Next.js Dev Server Issues

### "Unable to acquire lock" Error

**Problem:**
```
⨯ Unable to acquire lock at /Users/.../site/.next/dev/lock, is another instance of next dev running?
```

**Cause:** A previous Next.js dev server is still running or didn't shut down cleanly.

**Solutions:**

1. **Kill any running Next.js processes:**
   ```bash
   pkill -f "next dev"
   ```

2. **Clean the build directories:**
   ```bash
   rm -rf site/.next site/.next-*
   ```

3. **Then restart:**
   ```bash
   pnpm mcd  # or twd, dw, dev
   ```

**Note:** As of the latest update, each tenant uses a separate build directory (`.next-mcd`, `.next-twd`, `.next-dw`) and port, so you can run multiple tenants simultaneously:
- `pnpm mcd` runs on port 3000
- `pnpm twd` runs on port 3001  
- `pnpm dw` runs on port 3002

---

## Tenant Build Issues

### "Invalid TENANT" Error

**Problem:**
```
Error: Invalid TENANT: xyz. Must be one of: mcd, twd, dw, default
```

**Cause:** The `TENANT` environment variable is set to an invalid value.

**Solution:** Use one of the valid tenant names:
```bash
pnpm build:mcd    # Mayo Clinic Diet
pnpm build:twd    # Total Wellbeing Diet
pnpm build:dw     # Digital Wellness
pnpm build:default # Default (greyscale)
```

### tenant-theme.scss Not Found

**Problem:**
```
Module not found: Can't resolve '../tenant-theme.scss'
```

**Cause:** The prebuild script didn't run to generate the tenant theme file.

**Solution:** The `predev` and `prebuild` hooks should run automatically. If not:
```bash
# Manually generate for a specific tenant
TENANT=mcd node site/scripts/generate-tenant-theme.js

# Or just run the dev/build command (it should trigger predev/prebuild)
pnpm mcd
```

---

## Import/Module Issues

### Can't Import from @web/shared

**Problem:**
```
Module not found: Can't resolve '@web/shared/tenants'
```

**Cause:** Workspace dependencies not installed or linked.

**Solution:**
```bash
# From root directory
pnpm install
```

### SVG Import Errors

**Problem:**
```
Cannot find module '*.svg' or its corresponding type declarations
```

**Cause:** TypeScript declarations for SVG imports are missing or not recognized.

**Solution:** Ensure [site/src/types/assets.d.ts](../site/src/types/assets.d.ts) exists and restart TypeScript server in your editor.

---

## Theme/Styling Issues

### Wrong Tenant Colors Showing

**Problem:** Seeing incorrect tenant colors (e.g., blue when expecting green).

**Cause:** Wrong tenant selected at build time or cached theme file.

**Solution:**
```bash
# Check which tenant was used
cat site/src/tenant-theme.scss

# Should show: @import '@web/shared/tenants/mcd/theme.scss';

# If wrong, regenerate with correct tenant:
TENANT=twd node site/scripts/generate-tenant-theme.js
pnpm twd
```

### Greyscale Theme Instead of Tenant Colors

**Problem:** All colors are grey/neutral instead of tenant brand colors.

**Cause:** Running default tenant or `tenant-theme.scss` import is missing.

**Solution:**
1. Check [site/src/app/layout.tsx](../site/src/app/layout.tsx) includes:
   ```tsx
   import '../tenant-theme.scss';
   ```

2. Verify tenant is set:
   ```bash
   # Use tenant-specific command, NOT plain dev
   pnpm mcd  # Not `pnpm dev`
   ```

---

## Logo/Asset Issues

### Logo Not Displaying

**Problem:** Blank space or error where logo should appear.

**Cause:** Asset import path issue or missing SVG files.

**Solution:**
1. Verify SVG files exist:
   ```bash
   ls -la shared/tenants/*/logo.svg
   ```

2. Check browser console for import errors

3. Ensure [site/next.config.ts](../site/next.config.ts) includes:
   ```typescript
   transpilePackages: ['@web/shared']
   ```

---

## Environment Variable Issues

### TENANT Variable Not Set

**Problem:** Build fails or uses wrong tenant.

**Cause:** Environment variable not passed correctly.

**Solution:**

**For Development:**
```bash
# Use pnpm scripts (they set TENANT automatically)
pnpm mcd
pnpm twd
pnpm dw

# NOT: pnpm dev (uses default tenant)
```

**For Production Builds:**
```bash
pnpm build:mcd
pnpm build:twd
pnpm build:dw
```

**For CI/CD:**
Set `TENANT` environment variable before build:
```yaml
# GitHub Actions example
- name: Build MCD
  env:
    TENANT: mcd
  run: pnpm build
```

---

## TypeScript Errors

### "Property 'branding' is possibly 'undefined'"

**Problem:**
```
'tenantConfig.branding' is possibly 'undefined'
```

**Solution:** Use optional chaining:
```tsx
tenantConfig.branding?.title
```

### Type Errors in tenant-config.ts

**Problem:** TypeScript can't resolve types from `@web/shared/tenants`.

**Solution:**
1. Restart TypeScript server in your editor
2. Check [shared/package.json](../shared/package.json) has correct exports
3. Run `pnpm install` from root

---

## Proxy/Routing Issues

### Redirects to Wrong Zone

**Problem:** Accessing root (`/`) doesn't redirect to expected zone.

**Cause:** `tenantConfig.defaultZone` might not match your expectation.

**Solution:** Check tenant config in [shared/tenants/{tenant}/config.ts](../shared/tenants/mcd/config.ts):
```typescript
defaultZone: 'marketing'  // or 'member', 'onboarding'
```

### Zone Not Found (404)

**Problem:** Accessing `/member` or `/onboarding` gives 404 or redirect.

**Cause:** That zone might not be enabled for the current tenant.

**Solution:** Check tenant config `zones` array:
```typescript
zones: ['marketing', 'member', 'onboarding']  // DW only has 'marketing'
```

---

## Build Performance

### Slow Build Times

**Problem:** Builds taking longer than expected.

**Optimization Tips:**

1. **Build only what you need:**
   ```bash
   # Build single tenant instead of all
   pnpm build:mcd  # Not `pnpm build:all`
   ```

2. **Parallel builds in CI:**
   ```bash
   pnpm build:mcd & pnpm build:twd & pnpm build:dw & wait
   ```

3. **Use build cache:**
   - Keep `.next` folder in CI cache
   - Don't clean before every build

---

## Getting Help

If you encounter issues not covered here:

1. Check the build output for specific error messages
2. Verify all dependencies are installed: `pnpm install`
3. Try cleaning and rebuilding:
   ```bash
   rm -rf site/.next
   pnpm build:mcd
   ```
4. Check the relevant source files mentioned in error messages
