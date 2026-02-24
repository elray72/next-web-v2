/**
 * Tenant-specific styles loader
 * Imports the correct global styles based on NEXT_PUBLIC_DEV_TENANT environment variable
 * This file is imported by layout.tsx
 */

// Import tenant-specific styles at build time
if (process.env.NEXT_PUBLIC_DEV_TENANT === 'mcd') {
    require('./globals-mcd.scss');
} else if (process.env.NEXT_PUBLIC_DEV_TENANT === 'twd') {
    require('./globals-twd.scss');
} else if (process.env.NEXT_PUBLIC_DEV_TENANT === 'dw') {
    require('./globals-dw.scss');
} else {
    // Default styles (no tenant)
    require('./globals.scss');
}

export { };
