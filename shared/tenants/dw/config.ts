import type { TenantConfig } from '../types';

export const config: TenantConfig = {
    name: 'dw',
    host: 'www.digitalwellness.com',
    zones: ['marketing'],
    defaultZone: 'marketing',
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
};

export default config;
