import type { TenantConfig } from '../types';

export const config: TenantConfig = {
    name: 'default',
    host: 'localhost',
    zones: ['marketing'],
    defaultZone: 'marketing',
    branding: {
        title: 'Wellness Platform',
        description: 'Multi-tenant wellness platform',
    },
    features: {
        memberPortal: false,
        onboarding: false,
        darkMode: true,
        blog: false,
    },
};

export default config;
