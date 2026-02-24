import type { TenantConfig } from '../types';

export const config: TenantConfig = {
    name: 'mcd',
    host: 'diet.mayoclinic.org',
    zones: ['marketing', 'member', 'onboarding'],
    defaultZone: 'marketing',
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
};

export default config;
