import { tenantConfig, currentTenant } from '@/tenants/tenant-config';
import { headers } from 'next/headers';

export default async function MemberPage() {
  const h = await headers();
  const zone = h.get('x-zone') ?? 'member';

  return (
    <main>
      <h1>Member Zone</h1>
      <p>Tenant: {currentTenant} ({tenantConfig.branding?.title})</p>
      <p>Zone: {zone}</p>
    </main>
  );
}
