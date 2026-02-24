import type { TenantConfig, TenantHost, TenantName, Zone } from './types';

export * from './types';

export const TENANTS: TenantConfig[] = [
  {
    name: 'mcd',
    host: 'diet.mayoclinic.org',
    zones: ['marketing', 'member', 'onboarding'],
    defaultZone: 'marketing',
    theme: {
      primary: 'oklch(0.45 0.2 220)', // Mayo blue
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.7 0.15 180)',
      secondaryForeground: 'oklch(0.145 0 0)',
      accent: 'oklch(0.65 0.18 160)',
      accentForeground: 'oklch(0.985 0 0)',
      radius: '0.5rem',
    },
    branding: {
      title: 'Mayo Clinic Diet',
      description: 'Science-based weight loss program',
    },
    features: {
      memberPortal: true,
      onboarding: true,
      darkMode: true,
      blog: true,
    },
  },
  {
    name: 'twd',
    host: 'www.totalwellbeingdiet.com',
    zones: ['marketing', 'member', 'onboarding'],
    defaultZone: 'marketing',
    theme: {
      primary: 'oklch(0.55 0.22 140)', // Green/wellness theme
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.65 0.15 80)',
      secondaryForeground: 'oklch(0.145 0 0)',
      accent: 'oklch(0.7 0.2 100)',
      accentForeground: 'oklch(0.985 0 0)',
      radius: '0.75rem',
    },
    branding: {
      title: 'Total Wellbeing Diet',
      description: 'Holistic approach to health and wellness',
    },
    features: {
      memberPortal: true,
      onboarding: true,
      darkMode: true,
      blog: true,
    },
  },
  {
    name: 'dw',
    host: 'www.digitalwellness.com',
    zones: ['marketing'],
    defaultZone: 'marketing',
    theme: {
      primary: 'oklch(0.5 0.25 280)', // Purple/tech theme
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.6 0.2 320)',
      secondaryForeground: 'oklch(0.985 0 0)',
      accent: 'oklch(0.65 0.22 250)',
      accentForeground: 'oklch(0.985 0 0)',
      radius: '0.625rem',
    },
    branding: {
      title: 'Digital Wellness',
      description: 'Technology-driven wellness solutions',
    },
    features: {
      memberPortal: false,
      onboarding: false,
      darkMode: true,
      blog: true,
    },
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
