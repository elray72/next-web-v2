export type TenantHost =
  | 'diet.mayoclinic.org'
  | 'www.totalwellbeingdiet.com'
  | 'www.digitalwellness.com';

export type Zone = 'marketing' | 'member' | 'onboarding';

export interface TenantConfig {
  host: TenantHost;
  zones: Zone[];
  defaultZone: Zone;
}
