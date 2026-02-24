import type { TenantName } from './types';

export * from './types';

/**
 * Get the current tenant based on build-time environment variable
 */
export function getCurrentTenant(): TenantName {
  const tenant = process.env.NEXT_PUBLIC_TENANT || 'default';
  return tenant as TenantName;
}

// Re-export tenant configs for convenience (tree-shakeable)
export { config as mcdConfig } from './mcd/config';
export { config as twdConfig } from './twd/config';
export { config as dwConfig } from './dw/config';
export { config as defaultConfig } from './default/config';
