/**
 * Authentication Helper for managing platform authentication flows
 * Provides unified interface for all authentication operations
 */

import { createPlatformIntegration } from '../leagueImport/platformIntegrations.js';
import CredentialManager from './CredentialManager.js';
import OAuthManager from './OAuthManager.js';

export class AuthenticationHelper {
  constructor() {
    this.credentialManager = new CredentialManager();
    this.oauthManager = new OAuthManager();
    
    // Platform authentication types
    this.authTypes = {
      fantrax: 'userSecret',
      sleeper: 'userId', 
      yahoo: 'oauth',
      espn: 'cookies'
    };
  }

  /**
   * Get authentication type for a platform
   * @param {string} platform - Platform identifier
   * @returns {string} - Authentication type
   */
  getAuthType(platform) {
    return this.authTypes[platform] || 'unknown';
  }

  /**
   * Validate credentials for any platform
   * @param {string} platform - Platform identifier
   * @param {Object} credentials - Platform-specific credentials
   * @returns {Promise<{valid: boolean, error?: string, user?: Object}>}
   */
  async validateCredentials(platform, credentials) {
    try {
      const integration = createPlatformIntegration(platform);
      return await integration.validateCredentials(credentials);
    } catch (error) {
      return {
        valid: false,
        error: `Platform validation failed: ${error.message}`
      };
    }
  }

  /**
   * Store validated credentials for a user
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @param {Object} credentials - Validated credentials
   * @param {number} expiresIn - Expiration time in seconds
   * @returns {Promise<string>} - Credential ID
   */
  async storeCredentials(userId, platform, credentials, expiresIn = null) {
    // Validate credentials before storing
    const validation = await this.validateCredentials(platform, credentials);
    if (!validation.valid) {
      throw new Error(`Cannot store invalid credentials: ${validation.error}`);
    }

    const integration = createPlatformIntegration(platform);
    return await integration.storeUserCredentials(userId, credentials, expiresIn);
  }

  /**
   * Get stored credentials for a user and platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {Promise<Object|null>} - Stored credentials or null
   */
  async getCredentials(userId, platform) {
    const integration = createPlatformIntegration(platform);
    return await integration.getUserCredentials(userId);
  }

  /**
   * Refresh credentials if supported by platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {Promise<Object>} - Refreshed credentials
   */
  async refreshCredentials(userId, platform) {
    const integration = createPlatformIntegration(platform);
    const currentCredentials = await integration.getUserCredentials(userId);
    
    if (!currentCredentials) {
      throw new Error('No stored credentials found to refresh');
    }

    try {
      const refreshedCredentials = await integration.refreshAuthentication(currentCredentials);
      
      // Store refreshed credentials
      await integration.storeUserCredentials(userId, refreshedCredentials);
      
      return refreshedCredentials;
    } catch (error) {
      // Mark credentials as invalid if refresh fails
      await this.credentialManager.markCredentialsInvalid(userId, platform);
      throw error;
    }
  }

  /**
   * Revoke credentials for a user and platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {Promise<boolean>} - Success status
   */
  async revokeCredentials(userId, platform) {
    const integration = createPlatformIntegration(platform);
    
    // Get credentials before revoking for OAuth token revocation
    const credentials = await integration.getUserCredentials(userId);
    
    // Revoke OAuth tokens if applicable
    if (credentials && this.authTypes[platform] === 'oauth') {
      try {
        await this.oauthManager.revokeToken(platform, credentials.accessToken);
      } catch (error) {
        console.warn(`Failed to revoke OAuth token for ${platform}:`, error.message);
      }
    }

    // Remove from credential store
    return await this.credentialManager.revokeCredentials(userId, platform);
  }

  /**
   * Check if user has valid credentials for a platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {Promise<boolean>} - Whether valid credentials exist
   */
  async hasValidCredentials(userId, platform) {
    const integration = createPlatformIntegration(platform);
    return await integration.hasValidCredentials(userId);
  }

  /**
   * Get all platforms with valid credentials for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of platform identifiers
   */
  async getUserPlatforms(userId) {
    return await this.credentialManager.getUserPlatforms(userId);
  }

  /**
   * Initiate OAuth flow for supported platforms
   * @param {string} platform - Platform identifier
   * @param {string} redirectUri - OAuth callback URI
   * @param {string} userId - User ID
   * @returns {Promise<{authUrl: string, state: string}>}
   */
  async initiateOAuth(platform, redirectUri, userId) {
    if (this.authTypes[platform] !== 'oauth') {
      throw new Error(`OAuth not supported for platform: ${platform}`);
    }

    return await this.oauthManager.initiateOAuth(platform, redirectUri, userId);
  }

  /**
   * Handle OAuth callback
   * @param {string} platform - Platform identifier
   * @param {string} code - Authorization code
   * @param {string} state - State parameter
   * @param {string} redirectUri - Original redirect URI
   * @returns {Promise<Object>} - OAuth tokens
   */
  async handleOAuthCallback(platform, code, state, redirectUri) {
    if (this.authTypes[platform] !== 'oauth') {
      throw new Error(`OAuth not supported for platform: ${platform}`);
    }

    return await this.oauthManager.handleCallback(platform, code, state, redirectUri);
  }

  /**
   * Get credential requirements for a platform
   * @param {string} platform - Platform identifier
   * @returns {Object} - Credential requirements
   */
  getCredentialRequirements(platform) {
    const requirements = {
      fantrax: {
        type: 'userSecret',
        fields: [
          {
            name: 'userSecretId',
            label: 'User Secret ID',
            type: 'text',
            required: true,
            description: 'Your Fantrax User Secret ID found in account settings'
          }
        ],
        instructions: 'Log into Fantrax, go to Account Settings, and copy your User Secret ID.'
      },
      sleeper: {
        type: 'userId',
        fields: [
          {
            name: 'userId',
            label: 'User ID',
            type: 'text',
            required: true,
            description: 'Your Sleeper User ID (username or numeric ID)'
          },
          {
            name: 'season',
            label: 'Season',
            type: 'text',
            required: false,
            default: '2024',
            description: 'NFL season year (optional, defaults to current year)'
          }
        ],
        instructions: 'Enter your Sleeper username or find your User ID in the Sleeper app settings.'
      },
      yahoo: {
        type: 'oauth',
        fields: [],
        instructions: 'Click "Connect with Yahoo" to authorize access to your Yahoo Fantasy leagues.'
      },
      espn: {
        type: 'cookies',
        fields: [
          {
            name: 'cookies',
            label: 'Session Cookies',
            type: 'textarea',
            required: true,
            description: 'ESPN session cookies from your browser'
          },
          {
            name: 'testLeagueId',
            label: 'Test League ID',
            type: 'text',
            required: true,
            description: 'ID of an ESPN league you have access to (for validation)'
          }
        ],
        instructions: 'Log into ESPN Fantasy, open browser developer tools, copy session cookies, and provide a league ID for testing.'
      }
    };

    return requirements[platform] || { type: 'unknown', fields: [], instructions: 'Platform not supported' };
  }

  /**
   * Clean up expired credentials and OAuth states
   * @returns {Promise<{expiredCredentials: number, expiredStates: number}>}
   */
  async cleanup() {
    const [expiredCredentials, expiredStates] = await Promise.all([
      this.credentialManager.cleanupExpiredCredentials(),
      this.oauthManager.cleanupExpiredStates()
    ]);

    return { expiredCredentials, expiredStates };
  }
}

export default AuthenticationHelper;