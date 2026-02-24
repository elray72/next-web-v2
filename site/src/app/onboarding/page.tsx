import { tenantConfig, currentTenant } from '@/tenants/tenant-config';
import { headers } from 'next/headers';

export default async function OnboardingPage() {
  const h = await headers();
  const zone = h.get('x-zone') ?? 'onboarding';

  return (
    <main>
      <h1>Onboarding Zone</h1>
      <p>Tenant: {currentTenant} ({tenantConfig.branding?.title})</p>
      <p>Zone: {zone}</p>
    </main>
  );
}
