/**
 * OAuth callback endpoint for handling platform OAuth flows
 * Currently supports Yahoo Fantasy Sports OAuth
 */

import { getSession } from '@auth0/nextjs-auth0';
import AuthenticationHelper from '../../../lib/auth/AuthenticationHelper.js';

const authHelper = new AuthenticationHelper();

export default async function handler(req, res) {
  try {
    const { method, query } = req;

    if (method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
    }

    const { platform, code, state, error: oauthError } = query;

    // Handle OAuth errors
    if (oauthError) {
      const errorMessages = {
        'access_denied': 'You denied access to your account. Please try again and grant permission.',
        'invalid_request': 'Invalid OAuth request. Please try again.',
        'server_error': 'OAuth server error. Please try again later.'
      };

      const message = errorMessages[oauthError] || `OAuth error: ${oauthError}`;
      
      return res.redirect(`/import?error=${encodeURIComponent(message)}`);
    }

    // Validate required parameters
    if (!platform || !code || !state) {
      return res.redirect('/import?error=' + encodeURIComponent('Missing OAuth parameters'));
    }

    // Get user session
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.redirect('/api/auth/login?returnTo=' + encodeURIComponent(req.url));
    }

    const userId = session.user.sub;

    try {
      // Handle OAuth callback
      const tokens = await authHelper.handleOAuthCallback(
        platform,
        code,
        state,
        `${process.env.AUTH0_BASE_URL}/api/auth/oauth-callback`
      );

      // Store the OAuth tokens as credentials
      const credentialId = await authHelper.storeCredentials(
        userId,
        platform,
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenType: tokens.tokenType,
          scope: tokens.scope
        },
        tokens.expiresIn
      );

      // Redirect to import page with success message
      return res.redirect(`/import?platform=${platform}&success=connected`);

    } catch (error) {
      console.error('OAuth callback error:', error);
      
      const errorMessage = error.message.includes('Invalid or expired OAuth state') 
        ? 'OAuth session expired. Please try connecting again.'
        : `Failed to connect ${platform}: ${error.message}`;

      return res.redirect(`/import?error=${encodeURIComponent(errorMessage)}`);
    }

  } catch (error) {
    console.error('OAuth callback handler error:', error);
    return res.redirect('/import?error=' + encodeURIComponent('OAuth callback failed'));
  }
}