import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add cache headers for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next/static') ||
    request.nextUrl.pathname.startsWith('/_next/image') ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2)$/)
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
  } else if (request.nextUrl.pathname.startsWith('/adminmisspo')) {
    // Admin pages should not be cached for security
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate'
    )
  } else {
    // For public HTML pages, use bfcache-friendly cache headers
    // Avoid 'no-store' which prevents bfcache
    response.headers.set(
      'Cache-Control',
      'private, max-age=0, must-revalidate'
    )
  }

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/webpack-hmr (hot module replacement)
     */
    '/((?!api|_next/webpack-hmr).*)',
  ],
}
