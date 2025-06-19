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
    console.log('[Middleware] Found session. User object:', JSON.stringify(user, null, 2));

    const registrationComplete = user[REGISTRATION_COMPLETE_CLAIM];

    if (!user.email_verified && pathname !== '/verify-email') {
      console.log('[Middleware] User not verified. Redirecting to /verify-email');
      return NextResponse.redirect(new URL('/verify-email', req.url));
    }

    if (user.email_verified) {
      const loginsCount = user[LOGIN_COUNT_CLAIM];
      console.log(`[Middleware] Logins count from claim: ${loginsCount}, Registration complete: ${registrationComplete}`);

      if (loginsCount === 1 && !registrationComplete && pathname !== '/register') {
        console.log('[Middleware] First login, registration not complete. Redirecting to /register.');
        return NextResponse.redirect(new URL('/register', req.url));
      }

      if ((loginsCount > 1 || registrationComplete) && (pathname === '/verify-email' || pathname === '/register')) {
        console.log('[Middleware] Existing user or registration complete on onboarding page. Redirecting to /dashboard.');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  } else {
    console.log('[Middleware] No session found.');
  }

  console.log(`[Middleware] Allowing request to ${pathname}`);
  return res;
}

export const config = {
  // Run this middleware on all relevant pages.
  matcher: ['/', '/dashboard/:path*', '/rankings/:path*', '/verify-email', '/register'],
}; 