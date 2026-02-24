import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTenantFromHeaders } from '@web/shared/tenants';
import './styles-loader';

export const metadata: Metadata = {
  title: 'Digital Wellness',
  description: 'Multi-tenant wellness platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();

  // In dev mode, use NEXT_PUBLIC_DEV_TENANT if set (from pnpm dev:mcd, dev:twd, etc.)
  const devTenant = process.env.NEXT_PUBLIC_DEV_TENANT;
  const tenant = devTenant || getTenantFromHeaders(h);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
