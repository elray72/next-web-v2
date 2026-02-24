export type TenantName = 'mcd' | 'twd' | 'dw' | 'default';

export type TenantHost =
  | 'diet.mayoclinic.org'
  | 'www.totalwellbeingdiet.com'
  | 'www.digitalwellness.com'
  | 'localhost';

export type Zone = 'marketing' | 'member' | 'onboarding';

/**
 * Theme configuration for a tenant
 * @deprecated Styles are now in separate SCSS files per tenant (site/src/styles/tenants/)
 * This interface is kept for backward compatibility but is no longer used.
 */
export interface TenantTheme {
  /**
   * Primary brand color (oklch format)
   */
  primary: string;
  /**
   * Primary foreground color
   */
  primaryForeground: string;
  /**
   * Secondary color
   */
  secondary?: string;
  /**
   * Secondary foreground color
   */
  secondaryForeground?: string;
  /**
   * Accent color
   */
  accent?: string;
  /**
   * Accent foreground color
   */
  accentForeground?: string;
  /**
   * Destructive/error color
   */
  destructive?: string;
  /**
   * Border radius (CSS value)
   */
  radius?: string;
}

/**
 * Typography configuration for a tenant
 */
export interface TenantTypography {
  /**
   * Primary font family
   */
  fontFamily?: string;
  /**
   * Heading font family
   */
  headingFont?: string;
  /**
   * Base font size
   */
  fontSize?: string;
}

/**
 * Branding assets for a tenant
 */
export interface TenantBranding {
  /**
   * Logo URL or path
   */
  logo?: string;
  /**
   * Favicon URL or path
   */
  favicon?: string;
  /**
   * Site title
   */
  title?: string;
  /**
   * Site description
   */
  description?: string;
}

/**
 * API configuration for a tenant
 */
export interface TenantApiConfig {
  /**
   * Umbraco CMS API URL
   */
  cmsUrl?: string;
  /**
   * Umbraco API Key
   */
  cmsApiKey?: string;
  /**
   * Analytics tracking ID
   */
  analyticsId?: string;
}

/**
 * Feature flags for a tenant
 */
export interface TenantFeatures {
  /**
   * Enable member portal
   */
  memberPortal?: boolean;
  /**
   * Enable onboarding flow
   */
  onboarding?: boolean;
  /**
   * Enable dark mode
   */
  darkMode?: boolean;
  /**
   * Enable blog
   */
  blog?: boolean;
}

export interface TenantConfig {
  name: TenantName;
  host: TenantHost;
  zones: Zone[];
  defaultZone: Zone;
  /**
   * Theme configuration
   * @deprecated Styles now in site/src/styles/tenants/{tenant}/theme.scss
   */
  theme?: TenantTheme;
  /**
   * Typography configuration
   */
  typography?: TenantTypography;
  /**
   * Branding assets
   */
  branding?: TenantBranding;
  /**
   * API configuration
   */
  api?: TenantApiConfig;
  /**
   * Feature flags
   */
  features?: TenantFeatures;
}
