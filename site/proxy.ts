/**
 * Next.js Proxy for zone-based routing
 * Handles routing between marketing, member, and onboarding zones
 * based on the build-time selected tenant configuration
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { tenantConfig } from './src/tenants/tenant-config';

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0] ?? '';

    const response = NextResponse.next();

    // Redirect root to default zone
    if (pathname === '/') {
        const defaultZone = tenantConfig.defaultZone;
        return NextResponse.redirect(new URL(`/${defaultZone}`, request.url));
    }

    // Check if first segment is a valid zone for this tenant
    const validZones = tenantConfig.zones || ['marketing'];
    if (validZones.includes(firstSegment as any)) {
        response.headers.set('x-zone', firstSegment);
        return response;
    }

    // Invalid zone - rewrite to default zone
    const defaultZone = tenantConfig.defaultZone;
    const newPath = `/${defaultZone}${pathname}`;
    const rewriteResponse = NextResponse.rewrite(new URL(newPath, request.url));
    rewriteResponse.headers.set('x-zone', defaultZone);
    return rewriteResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/|public/).*)',
    ],
};
