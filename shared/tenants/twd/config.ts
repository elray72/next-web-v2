import type { TenantConfig } from '../types';

export const config: TenantConfig = {
    name: 'twd',
    host: 'www.totalwellbeingdiet.com',
    zones: ['marketing', 'member', 'onboarding'],
    defaultZone: 'marketing',
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
};

export default config;
