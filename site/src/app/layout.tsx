import type { Metadata } from 'next';
import { tenantConfig } from '@/tenants/tenant-config';
import './globals.scss';

export const metadata: Metadata = {
  title: tenantConfig.branding?.title || 'Wellness Platform',
  description: tenantConfig.branding?.description || 'Multi-tenant wellness platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
