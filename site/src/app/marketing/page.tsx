import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { tenantConfig, currentTenant } from '@/tenants/tenant-config';
import { headers } from 'next/headers';

export default async function MarketingPage() {
  const h = await headers();
  const zone = h.get('x-zone') ?? 'marketing';

  return (
    <main>
      <Logo />
      <h1>Marketing Zone</h1>
      <p>Tenant: {currentTenant} ({tenantConfig.branding?.title})</p>
      <p>Zone: {zone}</p>
      <Button>Click me</Button>
    </main>
  );
}
