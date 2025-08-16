/**
 * OAuth Manager for handling OAuth flows across different platforms
 * Supports Yahoo Fantasy Sports and future OAuth-based platforms
 */

import crypto from 'crypto';
import axios from 'axios';
import { connectToDatabase } from '../mongodb.js';

export class OAuthManager {
  constructor() {
    this.platforms = {
      yahoo: {
        authUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
        tokenUrl: 'https://api.login.yahoo.com/oauth2/get_token',
        clientId: process.env.YAHOO_CLIENT_ID,
        clientSecret: process.env.YAHOO_CLIENT_SECRET,
        scope: 'fspt-r', // Fantasy Sports Read permission
        responseType: 'code'
      }
    };
  }

  /**
   * Initiate OAuth flow for a platform
   * @param {string} platform - Platform identifier (e.g., 'yahoo')
   * @param {string} redirectUri - Callback URI for OAuth flow
   * @param {string} userId - User ID for state tracking
   * @returns {Promise<{authUrl: string, state: string}>}
   */
  async initiateOAuth(platform, redirectUri, userId) {
    if (!this.platforms[platform]) {
      throw new Error(`OAuth not supported for platform: ${platform}`);
    }

    const config = this.platforms[platform];
    
    // Generate secure state parameter for CSRF protection
    const state = this.generateSecureState(userId, platform);
    
    // Store state in database for validation
    await this.storeOAuthState(state, userId, platform, redirectUri);

    // Build authorization URL
    const authParams = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: config.responseType,
      scope: config.scope,
      state: state
    });

    const authUrl = `${config.authUrl}?${authParams.toString()}`;

    return {
      authUrl,
      state
    };
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   * @param {string} platform - Platform identifier
   * @param {string} code - Authorization code from OAuth callback
   * @param {string} state - State parameter for validation
   * @param {string} redirectUri - Original redirect URI
   * @returns {Promise<{accessToken: string, refreshToken: string, expiresIn: number}>}
   */
  async handleCallback(platform, code, state, redirectUri) {
    if (!this.platforms[platform]) {
      throw new Error(`OAuth not supported for platform: ${platform}`);
    }

    // Validate state parameter
    const stateData = await this.validateOAuthState(state);
    if (!stateData || stateData.platform !== platform) {
      throw new Error('Invalid or expired OAuth state');
    }

    const config = this.platforms[platform];

    try {
      // Exchange authorization code for access token
      const tokenResponse = await axios.post(config.tokenUrl, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code: code
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const tokenData = tokenResponse.data;

      // Clean up OAuth state
      await this.cleanupOAuthState(state);

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type || 'Bearer',
        scope: tokenData.scope
      };

    } catch (error) {
      // Clean up OAuth state on error
      await this.cleanupOAuthState(state);
      
      if (error.response?.data) {
        throw new Error(`OAuth token exchange failed: ${error.response.data.error_description || error.response.data.error}`);
      }
      throw new Error(`OAuth token exchange failed: ${error.message}`);
    }
  }

  /**
   * Refresh expired access token
   * @param {string} platform - Platform identifier
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<{accessToken: string, refreshToken: string, expiresIn: number}>}
   */
  async refreshToken(platform, refreshToken) {
    if (!this.platforms[platform]) {
      throw new Error(`OAuth not supported for platform: ${platform}`);
    }

    const config = this.platforms[platform];

    try {
      const tokenResponse = await axios.post(config.tokenUrl, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const tokenData = tokenResponse.data;

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || refreshToken, // Some platforms don't return new refresh token
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type || 'Bearer',
        scope: tokenData.scope
      };

    } catch (error) {
      if (error.response?.data) {
        throw new Error(`Token refresh failed: ${error.response.data.error_description || error.response.data.error}`);
      }
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Revoke OAuth tokens
   * @param {string} platform - Platform identifier
   * @param {string} accessToken - Access token to revoke
   * @returns {Promise<boolean>}
   */
  async revokeToken(platform, accessToken) {
    if (!this.platforms[platform]) {
      throw new Error(`OAuth not supported for platform: ${platform}`);
    }

    // Yahoo doesn't have a standard revoke endpoint, but we can try
    // For now, we'll just return true as token cleanup happens in CredentialManager
    return true;
  }

  /**
   * Generate secure state parameter
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {string}
   */
  generateSecureState(userId, platform) {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const payload = `${userId}:${platform}:${timestamp}:${randomBytes}`;
    
    // Create HMAC for integrity
    const hmac = crypto.createHmac('sha256', process.env.OAUTH_STATE_SECRET || 'default-secret');
    hmac.update(payload);
    const signature = hmac.digest('hex');
    
    return Buffer.from(`${payload}:${signature}`).toString('base64url');
  }

  /**
   * Store OAuth state in database
   * @param {string} state - State parameter
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @param {string} redirectUri - Redirect URI
   */
  async storeOAuthState(state, userId, platform, redirectUri) {
    const { db } = await connectToDatabase();
    
    await db.collection('oauthStates').insertOne({
      state,
      userId,
      platform,
      redirectUri,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    });
  }

  /**
   * Validate OAuth state parameter
   * @param {string} state - State parameter to validate
   * @returns {Promise<Object|null>}
   */
  async validateOAuthState(state) {
    try {
      // Decode and verify state
      const decoded = Buffer.from(state, 'base64url').toString();
      const parts = decoded.split(':');
      
      if (parts.length !== 5) {
        return null;
      }

      const [userId, platform, timestamp, randomBytes, signature] = parts;
      const payload = `${userId}:${platform}:${timestamp}:${randomBytes}`;
      
      // Verify HMAC signature
      const hmac = crypto.createHmac('sha256', process.env.OAUTH_STATE_SECRET || 'default-secret');
      hmac.update(payload);
      const expectedSignature = hmac.digest('hex');
      
      if (signature !== expectedSignature) {
        return null;
      }

      // Check if state exists in database and hasn't expired
      const { db } = await connectToDatabase();
      const stateDoc = await db.collection('oauthStates').findOne({
        state,
        expiresAt: { $gt: new Date() }
      });

      return stateDoc;

    } catch (error) {
      console.error('OAuth state validation error:', error);
      return null;
    }
  }

  /**
   * Clean up OAuth state from database
   * @param {string} state - State parameter to clean up
   */
  async cleanupOAuthState(state) {
    const { db } = await connectToDatabase();
    await db.collection('oauthStates').deleteOne({ state });
  }

  /**
   * Clean up expired OAuth states (should be run periodically)
   */
  async cleanupExpiredStates() {
    const { db } = await connectToDatabase();
    const result = await db.collection('oauthStates').deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    return result.deletedCount;
  }
}

export default OAuthManager;