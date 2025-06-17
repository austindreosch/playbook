import { handleLogin } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  try {
    // This route acts as the redirect target from the email verification link.
    // It calls handleLogin, which intelligently refreshes the user's session
    // using their existing Auth0 session, and then redirects them to the dashboard.
    await handleLogin(req, res, {
      returnTo: '/dashboard',
    });
  } catch (error) {
    // If something goes wrong, redirect to a generic error page or login.
    res.status(error.status || 500).end(error.message);
  }
} 