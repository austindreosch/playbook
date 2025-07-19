import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  const { pathname } = req.nextUrl;

  const LOGIN_COUNT_CLAIM = 'https://www.playbookfantasy.com/logins_count';
  const REGISTRATION_COMPLETE_CLAIM = 'https://www.playbookfantasy.com/registration_complete';

  if (session?.user) {
    const { user } = session;

    const registrationComplete = user[REGISTRATION_COMPLETE_CLAIM];

    if (!user.email_verified && pathname !== '/verify-email') {
      return NextResponse.redirect(new URL('/verify-email', req.url));
    }

    if (user.email_verified) {
      const loginsCount = user[LOGIN_COUNT_CLAIM];

      if (loginsCount === 1 && !registrationComplete && pathname !== '/register') {
        return NextResponse.redirect(new URL('/register', req.url));
      }

      if ((loginsCount > 1 || registrationComplete) && (pathname === '/verify-email' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  } else {
  }

  return res;
}

export const config = {
  // Run this middleware on all relevant pages.
  matcher: ['/', '/dashboard/:path*', '/rankings/:path*', '/verify-email', '/register'],
}; 