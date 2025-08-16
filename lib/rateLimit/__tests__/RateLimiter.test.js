/**
 * Tests for RateLimiter class
 */

import { RateLimiter } from '../RateLimiter.js';

describe('RateLimiter', () => {
  let rateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(5, 1000, 'test'); // 5 requests per second for testing
  });

  describe('basic rate limiting', () => {
    it('should allow requests within limit', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      
      const result = await rateLimiter.execute(mockRequest);
      
      expect(result).toBe('success');
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    it('should queue requests when limit exceeded', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const promises = [];

      // Make 10 requests (exceeds limit of 5)
      for (let i = 0; i < 10; i++) {
        promises.push(rateLimiter.execute(mockRequest));
      }

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(10);
      expect(results.every(r => r === 'success')).toBe(true);
      expect(mockRequest).toHaveBeenCalledTimes(10);
    });

    it('should respect priority ordering', async () => {
      const results = [];
      const lowPriorityRequest = () => {
        results.push('low');
        return Promise.resolve('low');
      };
      const highPriorityRequest = () => {
        results.push('high');
        return Promise.resolve('high');
      };

      // Fill up the rate limiter
      for (let i = 0; i < 5; i++) {
        rateLimiter.execute(() => Promise.resolve('filler'));
      }

      // Queue high and low priority requests
      const promises = [
        rateLimiter.execute(lowPriorityRequest, { priority: 'normal' }),
        rateLimiter.execute(highPriorityRequest, { priority: 'high' }),
        rateLimiter.execute(lowPriorityRequest, { priority: 'normal' })
      ];

      await Promise.all(promises);

      // High priority should execute before low priority
      expect(results[0]).toBe('high');
    });
  });

  describe('retry logic', () => {
    it('should retry on retryable errors', async () => {
      let attempts = 0;
      const mockRequest = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          const error = new Error('Network error');
          error.code = 'ENOTFOUND';
          throw error;
        }
        return Promise.resolve('success');
      });

      const result = await rateLimiter.execute(mockRequest, { maxRetries: 3 });

      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should not retry on non-retryable errors', async () => {
      const mockRequest = jest.fn().mockImplementation(() => {
        const error = new Error('Bad request');
        error.response = { status: 400 };
        throw error;
      });

      await expect(rateLimiter.execute(mockRequest, { maxRetries: 3 }))
        .rejects.toThrow('Bad request');
      
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    it('should handle rate limit errors with exponential backoff', async () => {
      let attempts = 0;
      const mockRequest = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          const error = new Error('Rate limited');
          error.response = { status: 429 };
          throw error;
        }
        return Promise.resolve('success');
      });

      const startTime = Date.now();
      const result = await rateLimiter.execute(mockRequest, { maxRetries: 3 });
      const endTime = Date.now();

      expect(result).toBe('success');
      expect(attempts).toBe(3);
      // Should have some delay due to exponential backoff
      expect(endTime - startTime).toBeGreaterThan(100);
    });
  });

  describe('platform-specific configurations', () => {
    it('should create Fantrax rate limiter with correct limits', () => {
      const fantraxLimiter = RateLimiter.createForPlatform('fantrax');
      
      expect(fantraxLimiter.maxRequests).toBe(100);
      expect(fantraxLimiter.windowMs).toBe(60000);
      expect(fantraxLimiter.platformId).toBe('fantrax');
    });

    it('should create Sleeper rate limiter with correct limits', () => {
      const sleeperLimiter = RateLimiter.createForPlatform('sleeper');
      
      expect(sleeperLimiter.maxRequests).toBe(1000);
      expect(sleeperLimiter.windowMs).toBe(60000);
      expect(sleeperLimiter.platformId).toBe('sleeper');
    });

    it('should create Yahoo rate limiter with correct limits', () => {
      const yahooLimiter = RateLimiter.createForPlatform('yahoo');
      
      expect(yahooLimiter.maxRequests).toBe(5000);
      expect(yahooLimiter.windowMs).toBe(3600000); // 1 hour
      expect(yahooLimiter.platformId).toBe('yahoo');
    });
  });

  describe('token bucket algorithm', () => {
    it('should refill tokens over time', async () => {
      // Use up all tokens
      for (let i = 0; i < 5; i++) {
        await rateLimiter.execute(() => Promise.resolve('test'));
      }

      expect(rateLimiter.tokens).toBe(0);

      // Wait for refill (simulate time passage)
      rateLimiter.lastRefill = Date.now() - 1000; // 1 second ago
      rateLimiter.refillTokens();

      expect(rateLimiter.tokens).toBe(5); // Should be fully refilled
    });

    it('should provide accurate status information', () => {
      const status = rateLimiter.getStatus();

      expect(status).toHaveProperty('platform', 'test');
      expect(status).toHaveProperty('tokens');
      expect(status).toHaveProperty('maxRequests', 5);
      expect(status).toHaveProperty('windowMs', 1000);
      expect(status).toHaveProperty('queueLength');
      expect(status).toHaveProperty('activeRequests');
    });
  });

  describe('error handling', () => {
    it('should handle timeout errors', async () => {
      const slowRequest = () => new Promise(resolve => 
        setTimeout(() => resolve('slow'), 2000)
      );

      await expect(rateLimiter.execute(slowRequest, { timeout: 100 }))
        .rejects.toThrow('Request timeout');
    });

    it('should handle queue timeout', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');

      // Create request that will timeout in queue
      await expect(rateLimiter.execute(mockRequest, { timeout: 1 }))
        .rejects.toThrow('Request timed out in queue');
    });
  });

  describe('reset functionality', () => {
    it('should reset rate limiter state', async () => {
      // Use up tokens and add to queue
      for (let i = 0; i < 10; i++) {
        rateLimiter.execute(() => Promise.resolve('test'));
      }

      rateLimiter.consecutiveFailures = 5;
      rateLimiter.lastFailureTime = Date.now();

      rateLimiter.reset();

      expect(rateLimiter.tokens).toBe(5);
      expect(rateLimiter.requestQueue).toHaveLength(0);
      expect(rateLimiter.activeRequests).toBe(0);
      expect(rateLimiter.consecutiveFailures).toBe(0);
      expect(rateLimiter.lastFailureTime).toBeNull();
    });
  });
});