/**
 * Centralized error handler for platform-specific error normalization
 * Converts platform errors to standardized format with user-friendly messages
 */

export class ErrorHandler {
  constructor(platformId) {
    this.platformId = platformId;
  }

  /**
   * Normalize platform-specific errors to standardized format
   * @param {Error} error - Original error from platform API
   * @returns {Object} Normalized error object
   */
  normalize(error) {
    const normalizedError = {
      code: this.getErrorCode(error),
      message: this.getUserFriendlyMessage(error),
      platform: this.platformId,
      retryable: this.isRetryable(error),
      retryAfter: this.getRetryDelay(error),
      originalError: {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        code: error.code
      },
      timestamp: new Date().toISOString()
    };

    return normalizedError;
  }

  /**
   * Get standardized error code from platform error
   * @param {Error} error - Original error
   * @returns {string} Standardized error code
   */
  getErrorCode(error) {
    // HTTP status code mapping
    if (error.response?.status) {
      const status = error.response.status;
      
      if (status === 400) return 'BAD_REQUEST';
      if (status === 401) return 'AUTHENTICATION_FAILED';
      if (status === 403) return 'ACCESS_DENIED';
      if (status === 404) return 'NOT_FOUND';
      if (status === 429) return 'RATE_LIMITED';
      if (status >= 500) return 'SERVER_ERROR';
    }

    // Network error codes
    if (error.code === 'ENOTFOUND') return 'NETWORK_ERROR';
    if (error.code === 'ETIMEDOUT') return 'TIMEOUT_ERROR';
    if (error.code === 'ECONNREFUSED') return 'CONNECTION_REFUSED';
    if (error.code === 'ECONNRESET') return 'CONNECTION_RESET';

    // Platform-specific error patterns
    if (this.isPlatformSpecificError(error)) {
      return this.getPlatformErrorCode(error);
    }

    return 'UNKNOWN_ERROR';
  }

  /**
   * Get user-friendly error message
   * @param {Error} error - Original error
   * @returns {string} User-friendly error message
   */
  getUserFriendlyMessage(error) {
    const code = this.getErrorCode(error);
    const platformName = this.getPlatformDisplayName();
    
    const baseMessages = {
      'AUTHENTICATION_FAILED': `Your ${platformName} credentials have expired or are invalid. Please re-authenticate.`,
      'ACCESS_DENIED': `You don't have permission to access this ${platformName} resource. Please check your account permissions.`,
      'NOT_FOUND': `The requested ${platformName} resource was not found. Please verify the ID and try again.`,
      'RATE_LIMITED': `Too many requests to ${platformName}. Please wait ${this.getRetryDelay(error) / 1000} seconds and try again.`,
      'SERVER_ERROR': `${platformName} servers are experiencing issues. Please try again in a few minutes.`,
      'NETWORK_ERROR': `Unable to connect to ${platformName}. Please check your internet connection and try again.`,
      'TIMEOUT_ERROR': `Request to ${platformName} timed out. Please try again.`,
      'CONNECTION_REFUSED': `Connection to ${platformName} was refused. The service may be temporarily unavailable.`,
      'CONNECTION_RESET': `Connection to ${platformName} was reset. Please try again.`,
      'BAD_REQUEST': `Invalid request to ${platformName}. Please check your input and try again.`
    };

    // Get platform-specific message if available
    const platformMessage = this.getPlatformSpecificMessage(error, code);
    if (platformMessage) {
      return platformMessage;
    }

    // Return base message or fallback
    return baseMessages[code] || `An unexpected error occurred with ${platformName}. Please try again later.`;
  }

  /**
   * Determine if error is retryable
   * @param {Error} error - Original error
   * @returns {boolean} Whether the error is retryable
   */
  isRetryable(error) {
    const code = this.getErrorCode(error);
    const retryableCodes = [
      'RATE_LIMITED',
      'SERVER_ERROR',
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'CONNECTION_REFUSED',
      'CONNECTION_RESET'
    ];
    
    return retryableCodes.includes(code);
  }

  /**
   * Get retry delay in milliseconds
   * @param {Error} error - Original error
   * @returns {number} Delay in milliseconds
   */
  getRetryDelay(error) {
    const code = this.getErrorCode(error);
    
    // Check for Retry-After header
    if (error.response?.headers?.['retry-after']) {
      const retryAfter = parseInt(error.response.headers['retry-after']);
      return retryAfter * 1000; // Convert to milliseconds
    }

    // Platform-specific rate limit delays
    if (code === 'RATE_LIMITED') {
      return this.getPlatformRateLimitDelay();
    }

    // Default delays by error type
    const defaultDelays = {
      'SERVER_ERROR': 5000,      // 5 seconds
      'NETWORK_ERROR': 2000,     // 2 seconds
      'TIMEOUT_ERROR': 3000,     // 3 seconds
      'CONNECTION_REFUSED': 5000, // 5 seconds
      'CONNECTION_RESET': 2000   // 2 seconds
    };

    return defaultDelays[code] || 1000; // Default 1 second
  }

  /**
   * Check if error is platform-specific
   * @param {Error} error - Original error
   * @returns {boolean} Whether error is platform-specific
   */
  isPlatformSpecificError(error) {
    const message = error.message?.toLowerCase() || '';
    
    switch (this.platformId) {
      case 'fantrax':
        return message.includes('fantrax') || 
               message.includes('user secret') ||
               message.includes('league not found');
      
      case 'sleeper':
        return message.includes('sleeper') ||
               message.includes('user not found') ||
               message.includes('invalid user');
      
      case 'yahoo':
        return message.includes('yahoo') ||
               message.includes('oauth') ||
               message.includes('access token');
      
      case 'espn':
        return message.includes('espn') ||
               message.includes('cookies') ||
               message.includes('session');
      
      default:
        return false;
    }
  }

  /**
   * Get platform-specific error code
   * @param {Error} error - Original error
   * @returns {string} Platform-specific error code
   */
  getPlatformErrorCode(error) {
    const message = error.message?.toLowerCase() || '';
    
    switch (this.platformId) {
      case 'fantrax':
        if (message.includes('user secret')) return 'INVALID_USER_SECRET';
        if (message.includes('league not found')) return 'LEAGUE_NOT_FOUND';
        break;
      
      case 'sleeper':
        if (message.includes('user not found')) return 'USER_NOT_FOUND';
        if (message.includes('invalid user')) return 'INVALID_USER_ID';
        break;
      
      case 'yahoo':
        if (message.includes('oauth')) return 'OAUTH_ERROR';
        if (message.includes('access token')) return 'INVALID_ACCESS_TOKEN';
        break;
      
      case 'espn':
        if (message.includes('cookies')) return 'INVALID_COOKIES';
        if (message.includes('session')) return 'SESSION_EXPIRED';
        break;
    }
    
    return 'PLATFORM_ERROR';
  }

  /**
   * Get platform-specific error message
   * @param {Error} error - Original error
   * @param {string} code - Error code
   * @returns {string|null} Platform-specific message or null
   */
  getPlatformSpecificMessage(error, code) {
    const platformName = this.getPlatformDisplayName();
    
    switch (this.platformId) {
      case 'fantrax':
        if (code === 'INVALID_USER_SECRET') {
          return 'Invalid Fantrax User Secret ID. Please check your credentials in your Fantrax account settings.';
        }
        if (code === 'LEAGUE_NOT_FOUND') {
          return 'Fantrax league not found. Please verify the league ID and your access permissions.';
        }
        break;
      
      case 'sleeper':
        if (code === 'USER_NOT_FOUND') {
          return 'Sleeper user not found. Please verify your User ID is correct.';
        }
        if (code === 'INVALID_USER_ID') {
          return 'Invalid Sleeper User ID format. Please check your User ID and try again.';
        }
        break;
      
      case 'yahoo':
        if (code === 'OAUTH_ERROR') {
          return 'Yahoo OAuth authentication failed. Please re-authorize the application.';
        }
        if (code === 'INVALID_ACCESS_TOKEN') {
          return 'Yahoo access token is invalid or expired. Please re-authenticate.';
        }
        break;
      
      case 'espn':
        if (code === 'INVALID_COOKIES') {
          return 'ESPN session cookies are invalid. Please update your cookies from a fresh ESPN login.';
        }
        if (code === 'SESSION_EXPIRED') {
          return 'ESPN session has expired. Please log into ESPN and update your cookies.';
        }
        break;
    }
    
    return null;
  }

  /**
   * Get platform display name
   * @returns {string} Human-readable platform name
   */
  getPlatformDisplayName() {
    const displayNames = {
      'fantrax': 'Fantrax',
      'sleeper': 'Sleeper',
      'yahoo': 'Yahoo Fantasy Sports',
      'espn': 'ESPN Fantasy Sports'
    };
    
    return displayNames[this.platformId] || this.platformId;
  }

  /**
   * Get platform-specific rate limit delay
   * @returns {number} Delay in milliseconds
   */
  getPlatformRateLimitDelay() {
    const rateLimitDelays = {
      'fantrax': 2000,   // 2 seconds
      'sleeper': 60000,  // 1 minute (Sleeper has strict limits)
      'yahoo': 5000,     // 5 seconds
      'espn': 3000       // 3 seconds
    };
    
    return rateLimitDelays[this.platformId] || 5000; // Default 5 seconds
  }

  /**
   * Create error for missing credentials
   * @param {string} credentialType - Type of missing credential
   * @returns {Object} Normalized error object
   */
  createMissingCredentialsError(credentialType) {
    const platformName = this.getPlatformDisplayName();
    
    return {
      code: 'MISSING_CREDENTIALS',
      message: `Missing ${credentialType} for ${platformName}. Please provide valid credentials.`,
      platform: this.platformId,
      retryable: false,
      retryAfter: 0,
      originalError: {
        message: `Missing ${credentialType}`,
        status: null,
        statusText: null,
        code: 'MISSING_CREDENTIALS'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create error for validation failures
   * @param {string} validationType - Type of validation that failed
   * @param {string} details - Additional details about the failure
   * @returns {Object} Normalized error object
   */
  createValidationError(validationType, details) {
    const platformName = this.getPlatformDisplayName();
    
    return {
      code: 'VALIDATION_ERROR',
      message: `${platformName} ${validationType} validation failed: ${details}`,
      platform: this.platformId,
      retryable: false,
      retryAfter: 0,
      originalError: {
        message: details,
        status: null,
        statusText: null,
        code: 'VALIDATION_ERROR'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Log error for monitoring and debugging
   * @param {Object} normalizedError - Normalized error object
   * @param {Object} context - Additional context for logging
   */
  logError(normalizedError, context = {}) {
    const logData = {
      ...normalizedError,
      context: {
        platform: this.platformId,
        userId: context.userId,
        operation: context.operation,
        ...context
      }
    };

    // In production, this would integrate with logging service
    console.error('[ErrorHandler]', JSON.stringify(logData, null, 2));
  }
}

export default ErrorHandler;