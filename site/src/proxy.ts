import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TENANT_ZONES, TENANT_DEFAULT_ZONE, isValidTenant, isValidZoneForTenant } from '@web/shared/tenants';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0] ?? '';
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] ?? '';

  // Skip for non-tenant hosts (e.g., localhost)
  if (!isValidTenant(host)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Redirect root to default zone
  if (pathname === '/') {
    const defaultZone = TENANT_DEFAULT_ZONE[host];
    return NextResponse.redirect(new URL(`/${defaultZone}`, request.url));
  }

  // Check if first segment is a valid zone for this tenant
  if (isValidZoneForTenant(host, firstSegment)) {
    response.headers.set('x-tenant', host);
    response.headers.set('x-zone', firstSegment);
    return response;
  }

  // Invalid zone - rewrite to default zone
  const defaultZone = TENANT_DEFAULT_ZONE[host];
  const newPath = `/${defaultZone}${pathname}`;
  const rewriteResponse = NextResponse.rewrite(new URL(newPath, request.url));
  rewriteResponse.headers.set('x-tenant', host);
  rewriteResponse.headers.set('x-zone', defaultZone);
  return rewriteResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/|public/).*)',
  ],
};
