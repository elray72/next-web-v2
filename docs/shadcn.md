# shadcn/ui Setup Guide

## Prerequisites

Before installing shadcn/ui, you need to have Tailwind CSS properly configured. This project uses **Tailwind CSS v4**, which has a different setup than v3.

## Installation Steps (In Order)

### Step 1: Install Tailwind CSS v4 Dependencies

First, ensure you have the base Tailwind CSS and PostCSS packages installed:

```bash
cd site
pnpm add -D tailwindcss postcss autoprefixer
```

### Step 2: Install Tailwind CSS v4 PostCSS Plugin

1. **Install @tailwindcss/postcss package**
   ```bash
   pnpm add -D @tailwindcss/postcss
   ```

2. **Create postcss.config.mjs**

   Create a new file at `site/postcss.config.mjs`:
   ```js
   const config = {
     plugins: {
       '@tailwindcss/postcss': {},
     },
   };

   export default config;
   ```

### Step 3: Create Global CSS File

Create `site/src/app/globals.css`:

```css
@import "tailwindcss";
```

**Important:** Tailwind v4 uses `@import "tailwindcss"` instead of the v3 directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)

### Step 4: Import Global CSS in Layout

Update `site/src/app/layout.tsx` to import the global CSS:

```tsx
import type { Metadata } from 'next';
import './globals.css';  // Add this line

export const metadata: Metadata = {
  // ... rest of your metadata
};

// ... rest of your layout
```

### Step 5: Install shadcn/ui

Now that Tailwind CSS v4 is properly configured, install shadcn/ui:

```bash
cd site
pnpm dlx shadcn@latest init
```

**During installation, you'll be prompted to:**
- Choose a style (Default, New York, etc.)
- Choose a base color
- Choose if you want to use CSS variables for colors
- Configure path aliases (default: `@/components`)

The init command will:
- Verify your Next.js installation
- Validate Tailwind CSS configuration
- Validate import aliases
- Install required dependencies (e.g., `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`)
- Create `components.json` configuration file
- Set up component directory structure
- Configure path aliases in `tsconfig.json` if needed

## Step 6: Adding Components

After successful initialization, you can add individual components:

```bash
cd site
pnpm dlx shadcn@latest add [component-name]
```

**Examples:**
```bash
# Add a single component
pnpm dlx shadcn@latest add button

# Add multiple components at once
pnpm dlx shadcn@latest add button card dialog

# Browse and select components interactively
pnpm dlx shadcn@latest add
```

Components will be added to your `src/components/ui` directory with full source code, which you can then customize as needed.

---

## Troubleshooting

### Issue: "No Tailwind CSS configuration found"

**Solution:** Make sure you've completed Steps 1-4 before running `shadcn init`. The shadcn CLI validates that:
1. `@tailwindcss/postcss` is installed
2. `postcss.config.mjs` exists and is configured correctly
3. Global CSS file exists with `@import "tailwindcss"`

### Issue: "No binaries found in tailwindcss"

**Cause:** Tailwind CSS v4 doesn't include the CLI binary in the main package.

**Solution:** Use `pnpm dlx tailwindcss init -p` instead of `pnpm exec`, or manually create the config files as shown in Steps 2-3.

### Issue: Commands not working from project root

**Solution:** Always run shadcn commands from the `/site` directory where your Next.js app is located:
```bash
cd site
pnpm dlx shadcn@latest init
```

---

## Key Differences: Tailwind v4 vs v3

- **PostCSS Plugin**: Uses `@tailwindcss/postcss` package instead of `tailwindcss` directly as a PostCSS plugin
- **CSS Configuration**: Configuration is done in CSS using `@theme` directives instead of `tailwind.config.js`
- **Import Syntax**: Uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities` directives
- **No autoprefixer needed**: Tailwind v4 handles vendor prefixing automatically
- **No CLI binary**: The v4 package doesn't include the `tailwindcss` CLI command

---

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [shadcn/ui Installation Guide](https://ui.shadcn.com/docs/installation)
- [Next.js + Tailwind Guide](https://tailwindcss.com/docs/guides/nextjs)
