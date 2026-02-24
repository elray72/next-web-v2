import { getTenantFromHeaders, getZoneFromHeaders } from '@web/shared/tenants';
import { headers } from 'next/headers';

export default async function OnboardingPage() {
  const h = await headers();
  const tenant = getTenantFromHeaders(h) ?? 'localhost';
  const zone = getZoneFromHeaders(h) ?? 'onboarding';

  return (
    <main>
      <h1>Onboarding Zone</h1>
      <p>Tenant: {tenant}</p>
      <p>Zone: {zone}</p>
    </main>
  );
}
