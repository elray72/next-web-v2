import type { TenantConfig, TenantHost, TenantName, Zone } from './types';

export * from './types';

export const TENANTS: TenantConfig[] = [
  {
    name: 'mcd',
    host: 'diet.mayoclinic.org',
    zones: ['marketing', 'member', 'onboarding'],
    defaultZone: 'marketing',
  },
  {
    name: 'twd',
    host: 'www.totalwellbeingdiet.com',
    zones: ['marketing', 'member', 'onboarding'],
    defaultZone: 'marketing',
  },
  {
    name: 'dw',
    host: 'www.digitalwellness.com',
    zones: ['marketing'],
    defaultZone: 'marketing',
  },
];

// Map host to tenant config
const HOST_TO_TENANT = new Map(TENANTS.map((t) => [t.host, t]));
const NAME_TO_TENANT = new Map(TENANTS.map((t) => [t.name, t]));

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

export function isValidTenant(host: string): host is TenantHost {
  return host in TENANT_ZONES;
}

export function isValidTenantName(name: string): name is TenantName {
  return NAME_TO_TENANT.has(name as TenantName);
}

export function getTenantByHost(host: TenantHost): TenantConfig | undefined {
  return HOST_TO_TENANT.get(host);
}

export function getTenantByName(name: TenantName): TenantConfig | undefined {
  return NAME_TO_TENANT.get(name);
}

export function isValidZoneForTenant(
  host: TenantHost,
  zone: string
): zone is Zone {
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
