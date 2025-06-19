import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  const { pathname } = req.nextUrl;

  // If the user is logged in, handle verification and registration redirects.
  if (session?.user) {
    const { user } = session;

    // 1. If email is not verified, force user to the verify-email page.
    if (!user.email_verified && pathname !== '/verify-email') {
      return NextResponse.redirect(new URL('/verify-email', req.url));
    }

    // 2. If email IS verified...
    if (user.email_verified) {
      // ...and they are a new user, force them to the register page.
      if (user.newUser && pathname !== '/register') {
        return NextResponse.redirect(new URL('/register', req.url));
      }
      // ...and they are an existing user trying to access onboarding pages, redirect to dashboard.
      if (!user.newUser && (pathname === '/verify-email' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  // If no session, continue. Assumes pages are protected individually
  // or that unauthenticated access is intended.
  return res;
}

export const config = {
  // Run this middleware on all relevant pages.
  matcher: ['/dashboard/:path*', '/rankings/:path*', '/verify-email', '/register'],
}; 