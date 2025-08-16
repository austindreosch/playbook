/**
 * Rate limiter for external API calls with configurable limits per platform
 * Implements token bucket algorithm with exponential backoff retry mechanism
 */

export class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000, platformId = 'default') {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.platformId = platformId;
    
    // Token bucket implementation
    this.tokens = maxRequests;
    this.lastRefill = Date.now();
    
    // Request tracking
    this.requestQueue = [];
    this.activeRequests = 0;
    
    // Exponential backoff state
    this.consecutiveFailures = 0;
    this.lastFailureTime = null;
    
    // Platform-specific configurations
    this.platformConfig = this.getPlatformConfig(platformId);
  }

  /**
   * Execute a request with rate limiting
   * @param {Function} requestFn - Function that returns a Promise for the API request
   * @param {Object} options - Rate limiting options
   * @returns {Promise} - Promise that resolves with the request result
   */
  async execute(requestFn, options = {}) {
    const {
      maxRetries = 3,
      retryDelay = null,
      priority = 'normal',
      timeout = 30000
    } = options;

    return new Promise((resolve, reject) => {
      const request = {
        fn: requestFn,
        resolve,
        reject,
        maxRetries,
        retryDelay,
        priority,
        timeout,
        attempts: 0,
        createdAt: Date.now()
      };

      this.enqueueRequest(request);
      this.processQueue();
    });
  }

  /**
   * Add request to queue with priority handling
   * @param {Object} request - Request object
   */
  enqueueRequest(request) {
    if (request.priority === 'high') {
      // Insert high priority requests at the beginning
      const highPriorityIndex = this.requestQueue.findIndex(r => r.priority !== 'high');
      if (highPriorityIndex === -1) {
        this.requestQueue.push(request);
      } else {
        this.requestQueue.splice(highPriorityIndex, 0, request);
      }
    } else {
      this.requestQueue.push(request);
    }
  }

  /**
   * Process the request queue
   */
  async processQueue() {
    if (this.requestQueue.length === 0 || this.activeRequests >= this.platformConfig.maxConcurrent) {
      return;
    }

    // Check if we're in backoff period
    if (this.isInBackoffPeriod()) {
      setTimeout(() => this.processQueue(), this.getBackoffDelay());
      return;
    }

    // Refill tokens if needed
    this.refillTokens();

    // Check if we have tokens available
    if (this.tokens <= 0) {
      const waitTime = this.getTokenRefillTime();
      setTimeout(() => this.processQueue(), waitTime);
      return;
    }

    // Get next request from queue
    const request = this.requestQueue.shift();
    if (!request) {
      return;
    }

    // Check if request has timed out in queue
    if (Date.now() - request.createdAt > request.timeout) {
      request.reject(new Error(`Request timed out in queue after ${request.timeout}ms`));
      this.processQueue(); // Continue processing
      return;
    }

    // Execute the request
    this.executeRequest(request);
    
    // Continue processing queue
    setTimeout(() => this.processQueue(), 0);
  }

  /**
   * Execute a single request with retry logic
   * @param {Object} request - Request object
   */
  async executeRequest(request) {
    this.activeRequests++;
    this.tokens--;

    try {
      const result = await this.executeWithTimeout(request.fn, request.timeout);
      
      // Reset failure count on success
      this.consecutiveFailures = 0;
      this.lastFailureTime = null;
      
      request.resolve(result);
    } catch (error) {
      await this.handleRequestError(request, error);
    } finally {
      this.activeRequests--;
    }
  }

  /**
   * Execute request function with timeout
   * @param {Function} requestFn - Request function
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise} - Promise that resolves with result or rejects with timeout
   */
  async executeWithTimeout(requestFn, timeout) {
    return Promise.race([
      requestFn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }

  /**
   * Handle request errors with retry logic
   * @param {Object} request - Request object
   * @param {Error} error - Error that occurred
   */
  async handleRequestError(request, error) {
    request.attempts++;
    
    // Check if error is retryable
    if (!this.isRetryableError(error) || request.attempts >= request.maxRetries) {
      this.consecutiveFailures++;
      this.lastFailureTime = Date.now();
      request.reject(error);
      return;
    }

    // Calculate retry delay
    const retryDelay = request.retryDelay || this.calculateRetryDelay(request.attempts, error);
    
    // Handle rate limiting specifically
    if (this.isRateLimitError(error)) {
      this.handleRateLimitError(error);
    }

    // Schedule retry
    setTimeout(() => {
      this.enqueueRequest(request);
      this.processQueue();
    }, retryDelay);
  }

  /**
   * Check if error is retryable
   * @param {Error} error - Error to check
   * @returns {boolean} - Whether error is retryable
   */
  isRetryableError(error) {
    // Network errors
    if (error.code === 'ENOTFOUND' || 
        error.code === 'ETIMEDOUT' || 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ECONNRESET') {
      return true;
    }

    // HTTP status codes that are retryable
    if (error.response?.status) {
      const status = error.response.status;
      return status === 429 || // Rate limited
             status === 502 || // Bad Gateway
             status === 503 || // Service Unavailable
             status === 504;   // Gateway Timeout
    }

    return false;
  }

  /**
   * Check if error is a rate limit error
   * @param {Error} error - Error to check
   * @returns {boolean} - Whether error is rate limit related
   */
  isRateLimitError(error) {
    return error.response?.status === 429 ||
           error.message?.toLowerCase().includes('rate limit') ||
           error.message?.toLowerCase().includes('too many requests');
  }

  /**
   * Handle rate limit errors
   * @param {Error} error - Rate limit error
   */
  handleRateLimitError(error) {
    // Extract retry-after header if available
    const retryAfter = error.response?.headers?.['retry-after'];
    if (retryAfter) {
      const retryAfterMs = parseInt(retryAfter) * 1000;
      this.lastFailureTime = Date.now();
      this.consecutiveFailures++;
      
      // Temporarily reduce token bucket
      this.tokens = 0;
      setTimeout(() => {
        this.refillTokens();
      }, retryAfterMs);
    }
  }

  /**
   * Calculate exponential backoff retry delay
   * @param {number} attempt - Current attempt number
   * @param {Error} error - Error that occurred
   * @returns {number} - Delay in milliseconds
   */
  calculateRetryDelay(attempt, error) {
    // Base delay from platform config
    let baseDelay = this.platformConfig.baseRetryDelay;

    // Check for retry-after header
    if (error.response?.headers?.['retry-after']) {
      return parseInt(error.response.headers['retry-after']) * 1000;
    }

    // Exponential backoff: baseDelay * (2 ^ (attempt - 1))
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * exponentialDelay;
    
    // Cap at maximum delay
    const totalDelay = Math.min(
      exponentialDelay + jitter,
      this.platformConfig.maxRetryDelay
    );

    return Math.floor(totalDelay);
  }

  /**
   * Refill token bucket based on time elapsed
   */
  refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    
    if (timePassed >= this.windowMs) {
      // Full refill if window has passed
      this.tokens = this.maxRequests;
      this.lastRefill = now;
    } else {
      // Partial refill based on time passed
      const tokensToAdd = Math.floor((timePassed / this.windowMs) * this.maxRequests);
      this.tokens = Math.min(this.maxRequests, this.tokens + tokensToAdd);
      
      if (tokensToAdd > 0) {
        this.lastRefill = now;
      }
    }
  }

  /**
   * Get time until next token refill
   * @returns {number} - Time in milliseconds
   */
  getTokenRefillTime() {
    const timeSinceLastRefill = Date.now() - this.lastRefill;
    const timeUntilRefill = this.windowMs - timeSinceLastRefill;
    
    // Calculate time for next single token
    const timePerToken = this.windowMs / this.maxRequests;
    
    return Math.max(timePerToken, timeUntilRefill);
  }

  /**
   * Check if we're in exponential backoff period
   * @returns {boolean} - Whether we're in backoff period
   */
  isInBackoffPeriod() {
    if (!this.lastFailureTime || this.consecutiveFailures === 0) {
      return false;
    }

    const backoffDelay = this.getBackoffDelay();
    return Date.now() - this.lastFailureTime < backoffDelay;
  }

  /**
   * Get current backoff delay
   * @returns {number} - Backoff delay in milliseconds
   */
  getBackoffDelay() {
    if (this.consecutiveFailures === 0) {
      return 0;
    }

    const baseDelay = this.platformConfig.baseRetryDelay;
    const exponentialDelay = baseDelay * Math.pow(2, this.consecutiveFailures - 1);
    
    return Math.min(exponentialDelay, this.platformConfig.maxRetryDelay);
  }

  /**
   * Get platform-specific configuration
   * @param {string} platformId - Platform identifier
   * @returns {Object} - Platform configuration
   */
  getPlatformConfig(platformId) {
    const configs = {
      fantrax: {
        maxConcurrent: 5,
        baseRetryDelay: 1000,
        maxRetryDelay: 30000,
        burstLimit: 10
      },
      sleeper: {
        maxConcurrent: 3,
        baseRetryDelay: 2000,
        maxRetryDelay: 60000,
        burstLimit: 5
      },
      yahoo: {
        maxConcurrent: 4,
        baseRetryDelay: 1500,
        maxRetryDelay: 45000,
        burstLimit: 8
      },
      espn: {
        maxConcurrent: 3,
        baseRetryDelay: 2000,
        maxRetryDelay: 30000,
        burstLimit: 6
      },
      default: {
        maxConcurrent: 3,
        baseRetryDelay: 1000,
        maxRetryDelay: 30000,
        burstLimit: 5
      }
    };

    return configs[platformId] || configs.default;
  }

  /**
   * Get current rate limiter status
   * @returns {Object} - Status information
   */
  getStatus() {
    return {
      platform: this.platformId,
      tokens: this.tokens,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
      queueLength: this.requestQueue.length,
      activeRequests: this.activeRequests,
      consecutiveFailures: this.consecutiveFailures,
      isInBackoff: this.isInBackoffPeriod(),
      backoffDelay: this.getBackoffDelay(),
      nextRefill: this.getTokenRefillTime()
    };
  }

  /**
   * Reset rate limiter state
   */
  reset() {
    this.tokens = this.maxRequests;
    this.lastRefill = Date.now();
    this.requestQueue = [];
    this.activeRequests = 0;
    this.consecutiveFailures = 0;
    this.lastFailureTime = null;
  }

  /**
   * Create platform-specific rate limiter instances
   * @param {string} platformId - Platform identifier
   * @returns {RateLimiter} - Configured rate limiter instance
   */
  static createForPlatform(platformId) {
    const platformLimits = {
      fantrax: { maxRequests: 100, windowMs: 60000 },
      sleeper: { maxRequests: 1000, windowMs: 60000 },
      yahoo: { maxRequests: 5000, windowMs: 3600000 }, // 5000 per hour
      espn: { maxRequests: 100, windowMs: 60000 }
    };

    const limits = platformLimits[platformId] || { maxRequests: 100, windowMs: 60000 };
    return new RateLimiter(limits.maxRequests, limits.windowMs, platformId);
  }
}

export default RateLimiter;