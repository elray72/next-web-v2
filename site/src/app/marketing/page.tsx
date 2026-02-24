import { Button } from '@/components/ui/button';
import { getTenantFromHeaders, getZoneFromHeaders } from '@web/shared/tenants';
import { headers } from 'next/headers';

export default async function MarketingPage() {
  const h = await headers();
  const tenant = getTenantFromHeaders(h) ?? 'localhost';
  const zone = getZoneFromHeaders(h) ?? 'marketing';

  return (
    <main>
      <h1>Marketing Zone</h1>
      <p>Tenant: {tenant}</p>
      <p>Zone: {zone}</p>
      <Button>Click me</Button>
    </main>
  );
}
