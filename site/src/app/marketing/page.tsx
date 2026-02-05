import { headers } from 'next/headers';
import { getTenantFromHeaders, getZoneFromHeaders } from '@web/shared/tenants';

export default async function MarketingPage() {
  const h = await headers();
  const tenant = getTenantFromHeaders(h) ?? 'localhost';
  const zone = getZoneFromHeaders(h) ?? 'marketing';

  return (
    <main>
      <h1>Marketing Zone</h1>
      <p>Tenant: {tenant}</p>
      <p>Zone: {zone}</p>
    </main>
  );
}
