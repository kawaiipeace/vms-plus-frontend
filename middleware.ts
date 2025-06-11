import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  // Example: If you need to make a fetch request
  // Remove internal headers before forwarding
  const headers = new Headers(request.headers);
  headers.delete('x-middleware-subrequest-id');

  // Example fetch (if needed)
  // await fetch('https://third-party.example/api', { headers });

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};