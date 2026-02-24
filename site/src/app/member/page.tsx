import { getTenantFromHeaders, getZoneFromHeaders } from '@web/shared/tenants';
import { headers } from 'next/headers';

export default async function MemberPage() {
  const h = await headers();
  const tenant = getTenantFromHeaders(h) ?? 'localhost';
  const zone = getZoneFromHeaders(h) ?? 'member';

  return (
    <main>
      <h1>Member Zone</h1>
      <p>Tenant: {tenant}</p>
      <p>Zone: {zone}</p>
    </main>
  );
}
