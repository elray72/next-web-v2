import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTenantFromHeaders } from '@web/shared/tenants';
import './globals.css';

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
  const tenant = getTenantFromHeaders(h);

  return (
    <html lang="en" data-tenant={tenant ?? 'default'}>
      <body>{children}</body>
    </html>
  );
}
