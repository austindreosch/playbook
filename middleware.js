import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  const { pathname } = req.nextUrl;

  // If the user is logged in but their email is not verified...
  if (session?.user && !session.user.email_verified) {
    // ...and they are NOT on the verify-email page, redirect them there.
    if (pathname !== '/verify-email') {
      return NextResponse.redirect(new URL('/verify-email', req.url));
    }
  }

  // If the user IS verified and they try to access the verify-email page...
  if (session?.user && session.user.email_verified && pathname === '/verify-email') {
    // ...redirect them to the dashboard.
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  // Run this middleware on all relevant pages.
  matcher: ['/dashboard/:path*', '/rankings/:path*', '/verify-email'],
}; 