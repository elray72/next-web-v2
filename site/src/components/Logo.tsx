/**
 * Logo component that displays the tenant-specific logo
 * Logo is selected at build-time based on TENANT environment variable
 */

import { currentTenant, tenantConfig } from '@/tenants/tenant-config';
import Image from 'next/image';

// Dynamic logo path based on build-time tenant
function getLogoPath() {
  // In a workspace package, we need to reference the actual file path
  // These will be bundled by Next.js at build time
  switch (currentTenant) {
    case 'mcd':
      return '/tenants/mcd/logo.svg';
    case 'twd':
      return '/tenants/twd/logo.svg';
    case 'dw':
      return '/tenants/dw/logo.svg';
    case 'default':
    default:
      return '/tenants/default/logo.svg';
  }
}

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 200, height = 60 }: LogoProps) {
  const logoPath = getLogoPath();
  const title = tenantConfig.branding?.title || 'Logo';

  return (
    <img
      src={logoPath}
      alt={`${title} logo`}
      className={className}
      width={width}
      height={height}
    />
  );
}
