/**
 * Build-time tenant configuration
 * This module exports the tenant config selected at build time via TENANT env var
 */

import { getCurrentTenant } from '@web/shared/tenants';
import type { TenantConfig, TenantName } from '@web/shared/tenants';
import { config as mcdConfig } from '@web/shared/tenants/mcd/config';
import { config as twdConfig } from '@web/shared/tenants/twd/config';
import { config as dwConfig } from '@web/shared/tenants/dw/config';
import { config as defaultConfig } from '@web/shared/tenants/default/config';

// Get tenant from build-time environment variable
export const currentTenant: TenantName = getCurrentTenant();

// Map of all tenant configurations
const configs: Record<TenantName, TenantConfig> = {
    mcd: mcdConfig,
    twd: twdConfig,
    dw: dwConfig,
    default: defaultConfig,
};

// Export the configuration for the current tenant
export const tenantConfig = configs[currentTenant];
