import type { TenantHost, Zone, TenantConfig } from './types';

export * from './types';

export const TENANT_ZONES: Record<TenantHost, Zone[]> = {
  'diet.mayoclinic.org': ['marketing', 'member', 'onboarding'],
  'www.totalwellbeingdiet.com': ['marketing', 'member', 'onboarding'],
  'www.digitalwellness.com': ['marketing'],
};

export const TENANT_DEFAULT_ZONE: Record<TenantHost, Zone> = {
  'diet.mayoclinic.org': 'marketing',
  'www.totalwellbeingdiet.com': 'marketing',
  'www.digitalwellness.com': 'marketing',
};

export const TENANTS: TenantConfig[] = [
  { host: 'diet.mayoclinic.org', zones: ['marketing', 'member', 'onboarding'], defaultZone: 'marketing' },
  { host: 'www.totalwellbeingdiet.com', zones: ['marketing', 'member', 'onboarding'], defaultZone: 'marketing' },
  { host: 'www.digitalwellness.com', zones: ['marketing'], defaultZone: 'marketing' },
];

export function isValidTenant(host: string): host is TenantHost {
  return host in TENANT_ZONES;
}

export function isValidZoneForTenant(host: TenantHost, zone: string): zone is Zone {
  return TENANT_ZONES[host]?.includes(zone as Zone) ?? false;
}

export function getDefaultZone(host: TenantHost): Zone {
  return TENANT_DEFAULT_ZONE[host] ?? 'marketing';
}

export function getTenantFromHeaders(headers: Headers): TenantHost | null {
  const tenant = headers.get('x-tenant') || headers.get('host');
  if (tenant && isValidTenant(tenant)) {
    return tenant;
  }
  return null;
}

export function getZoneFromHeaders(headers: Headers): Zone | null {
  const zone = headers.get('x-zone');
  if (zone && ['marketing', 'member', 'onboarding'].includes(zone)) {
    return zone as Zone;
  }
  return null;
}
