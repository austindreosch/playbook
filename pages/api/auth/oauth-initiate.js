/**
 * OAuth initiation endpoint for starting platform OAuth flows
 * Currently supports Yahoo Fantasy Sports OAuth
 */

import { getSession } from '@auth0/nextjs-auth0';
import AuthenticationHelper from '../../../lib/auth/AuthenticationHelper.js';

const authHelper = new AuthenticationHelper();

export default async function handler(req, res) {
  try {
    const { method } = req;

    if (method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
    }

    // Get user session
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = session.user.sub;
    const { platform } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'Missing required field: platform' });
    }

    // Check if platform supports OAuth
    const authType = authHelper.getAuthType(platform);
    if (authType !== 'oauth') {
      return res.status(400).json({ 
        error: `OAuth not supported for platform: ${platform}`,
        authType 
      });
    }

    try {
      // Generate OAuth URL
      const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/oauth-callback`;
      const oauthData = await authHelper.initiateOAuth(platform, redirectUri, userId);

      return res.status(200).json({
        success: true,
        authUrl: oauthData.authUrl,
        state: oauthData.state,
        platform
      });

    } catch (error) {
      console.error('OAuth initiation error:', error);
      
      return res.status(400).json({
        error: 'Failed to initiate OAuth flow',
        message: error.message
      });
    }

  } catch (error) {
    console.error('OAuth initiate handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}