/**
 * API endpoint for managing platform credentials
 * Handles validation, storage, and retrieval of platform authentication
 */

import { getSession } from '@auth0/nextjs-auth0';
import AuthenticationHelper from '../../../lib/auth/AuthenticationHelper.js';

const authHelper = new AuthenticationHelper();

export default async function handler(req, res) {
  try {
    // Get user session
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = session.user.sub;
    const { method } = req;

    switch (method) {
      case 'GET':
        return await handleGet(req, res, userId);
      case 'POST':
        return await handlePost(req, res, userId);
      case 'PUT':
        return await handlePut(req, res, userId);
      case 'DELETE':
        return await handleDelete(req, res, userId);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Platform credentials API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

/**
 * GET - Retrieve user's platform credentials or requirements
 */
async function handleGet(req, res, userId) {
  const { platform, action } = req.query;

  if (action === 'requirements') {
    // Get credential requirements for a platform
    if (!platform) {
      return res.status(400).json({ error: 'Platform parameter required for requirements' });
    }

    const requirements = authHelper.getCredentialRequirements(platform);
    return res.status(200).json(requirements);
  }

  if (action === 'platforms') {
    // Get all platforms with valid credentials for user
    const platforms = await authHelper.getUserPlatforms(userId);
    return res.status(200).json({ platforms });
  }

  if (platform) {
    // Check if user has valid credentials for specific platform
    const hasCredentials = await authHelper.hasValidCredentials(userId, platform);
    const authType = authHelper.getAuthType(platform);
    
    return res.status(200).json({ 
      platform,
      hasCredentials,
      authType
    });
  }

  // Get all platform statuses
  const platforms = ['fantrax', 'sleeper', 'yahoo', 'espn'];
  const statuses = await Promise.all(
    platforms.map(async (p) => ({
      platform: p,
      hasCredentials: await authHelper.hasValidCredentials(userId, p),
      authType: authHelper.getAuthType(p)
    }))
  );

  return res.status(200).json({ platforms: statuses });
}

/**
 * POST - Validate and store new credentials
 */
async function handlePost(req, res, userId) {
  const { platform, credentials, expiresIn } = req.body;

  if (!platform || !credentials) {
    return res.status(400).json({ 
      error: 'Missing required fields: platform and credentials' 
    });
  }

  try {
    // Validate credentials first
    const validation = await authHelper.validateCredentials(platform, credentials);
    
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Credential validation failed',
        message: validation.error,
        needsRefresh: validation.needsRefresh
      });
    }

    // Store validated credentials
    const credentialId = await authHelper.storeCredentials(
      userId, 
      platform, 
      credentials, 
      expiresIn
    );

    return res.status(201).json({ 
      success: true,
      credentialId,
      user: validation.user,
      message: `${platform} credentials stored successfully`
    });

  } catch (error) {
    return res.status(400).json({ 
      error: 'Failed to store credentials',
      message: error.message 
    });
  }
}

/**
 * PUT - Refresh existing credentials
 */
async function handlePut(req, res, userId) {
  const { platform } = req.body;

  if (!platform) {
    return res.status(400).json({ 
      error: 'Missing required field: platform' 
    });
  }

  try {
    const refreshedCredentials = await authHelper.refreshCredentials(userId, platform);
    
    return res.status(200).json({ 
      success: true,
      message: `${platform} credentials refreshed successfully`,
      expiresIn: refreshedCredentials.expiresIn
    });

  } catch (error) {
    return res.status(400).json({ 
      error: 'Failed to refresh credentials',
      message: error.message 
    });
  }
}

/**
 * DELETE - Revoke credentials
 */
async function handleDelete(req, res, userId) {
  const { platform } = req.query;

  if (!platform) {
    return res.status(400).json({ 
      error: 'Missing required parameter: platform' 
    });
  }

  try {
    const success = await authHelper.revokeCredentials(userId, platform);
    
    if (success) {
      return res.status(200).json({ 
        success: true,
        message: `${platform} credentials revoked successfully`
      });
    } else {
      return res.status(404).json({ 
        error: 'No credentials found to revoke' 
      });
    }

  } catch (error) {
    return res.status(400).json({ 
      error: 'Failed to revoke credentials',
      message: error.message 
    });
  }
}