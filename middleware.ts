import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if token is likely a JWT (has 3 parts separated by '.')
function isLikelyJWT(token: string) {
  return token.split('.').length === 3;
}

// Parse JWT payload without verifying signature (Base64 decode)
function parseJWT(token: string) {
  try {
    const base64Payload = token.split('.')[1];
    // Replace URL-safe base64 chars and add padding if needed
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token || !isLikelyJWT(token)) {
    // No token or invalid format — redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = parseJWT(token);

  if (
    !payload ||
    // Check expiration (exp is in seconds, Date.now() in ms)
    (payload.exp && payload.exp * 1000 < Date.now())
  ) {
    // Token expired or can't parse — redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Token looks valid (not verified though) — continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
