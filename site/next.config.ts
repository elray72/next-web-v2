import type { NextConfig } from 'next';
import path from 'path';

const tenant = process.env.TENANT || 'default';
const validTenants = ['mcd', 'twd', 'dw', 'default'];

if (!validTenants.includes(tenant)) {
  throw new Error(
    `Invalid TENANT: ${tenant}. Must be one of: ${validTenants.join(', ')}`
  );
}

const nextConfig: NextConfig = {
  transpilePackages: ['@web/shared'],

  // Use separate build directories per tenant for parallel dev servers
  distDir: tenant !== 'default' ? `.next-${tenant}` : '.next',

  // Inject tenant as public env var for build-time replacement
  env: {
    NEXT_PUBLIC_TENANT: tenant,
  },

  sassOptions: {
    // Resolve Sass imports from the monorepo root
    loadPaths: [path.resolve(__dirname, '..')],
    // Prepend tenant theme import to every SCSS file
    additionalData: `@use 'shared/tenants/${tenant}/theme';`,
  },
};

export default nextConfig;
