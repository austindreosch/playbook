/**
 * Tests for ErrorHandler class
 */

import { ErrorHandler } from '../ErrorHandler.js';

describe('ErrorHandler', () => {
  let errorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler('fantrax');
  });

  describe('normalize', () => {
    it('should normalize HTTP 401 error', () => {
      const error = {
        response: { status: 401, statusText: 'Unauthorized' },
        message: 'Request failed with status code 401'
      };

      const normalized = errorHandler.normalize(error);

      expect(normalized.code).toBe('AUTHENTICATION_FAILED');
      expect(normalized.platform).toBe('fantrax');
      expect(normalized.retryable).toBe(false);
      expect(normalized.message).toContain('Fantrax credentials have expired');
    });

    it('should normalize rate limit error', () => {
      const error = {
        response: { 
          status: 429, 
          statusText: 'Too Many Requests',
          headers: { 'retry-after': '60' }
        },
        message: 'Request failed with status code 429'
      };

      const normalized = errorHandler.normalize(error);

      expect(normalized.code).toBe('RATE_LIMITED');
      expect(normalized.retryable).toBe(true);
      expect(normalized.retryAfter).toBe(60000); // 60 seconds in ms
    });

    it('should normalize network error', () => {
      const error = {
        code: 'ENOTFOUND',
        message: 'getaddrinfo ENOTFOUND api.fantrax.com'
      };

      const normalized = errorHandler.normalize(error);

      expect(normalized.code).toBe('NETWORK_ERROR');
      expect(normalized.retryable).toBe(true);
      expect(normalized.message).toContain('Unable to connect to Fantrax');
    });

    it('should handle platform-specific errors', () => {
      const error = {
        message: 'Invalid Fantrax user secret ID'
      };

      const normalized = errorHandler.normalize(error);

      expect(normalized.code).toBe('INVALID_USER_SECRET');
      expect(normalized.message).toContain('Invalid Fantrax User Secret ID');
    });
  });

  describe('createMissingCredentialsError', () => {
    it('should create missing credentials error', () => {
      const error = errorHandler.createMissingCredentialsError('userSecretId');

      expect(error.code).toBe('MISSING_CREDENTIALS');
      expect(error.message).toContain('Missing userSecretId for Fantrax');
      expect(error.retryable).toBe(false);
    });
  });

  describe('createValidationError', () => {
    it('should create validation error', () => {
      const error = errorHandler.createValidationError('credentials', 'Invalid format');

      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toContain('Fantrax credentials validation failed');
      expect(error.message).toContain('Invalid format');
    });
  });

  describe('platform-specific behavior', () => {
    it('should handle Sleeper-specific errors', () => {
      const sleeperHandler = new ErrorHandler('sleeper');
      const error = { message: 'Sleeper user not found' };

      const normalized = sleeperHandler.normalize(error);

      expect(normalized.code).toBe('USER_NOT_FOUND');
      expect(normalized.message).toContain('Sleeper user not found');
    });

    it('should handle Yahoo-specific errors', () => {
      const yahooHandler = new ErrorHandler('yahoo');
      const error = { message: 'Invalid OAuth access token' };

      const normalized = yahooHandler.normalize(error);

      expect(normalized.code).toBe('INVALID_ACCESS_TOKEN');
      expect(normalized.message).toContain('Yahoo access token is invalid');
    });

    it('should handle ESPN-specific errors', () => {
      const espnHandler = new ErrorHandler('espn');
      const error = { message: 'Invalid ESPN session cookies' };

      const normalized = espnHandler.normalize(error);

      expect(normalized.code).toBe('INVALID_COOKIES');
      expect(normalized.message).toContain('ESPN session cookies are invalid');
    });
  });

  describe('retry logic', () => {
    it('should determine retryable errors correctly', () => {
      const retryableError = { response: { status: 500 } };
      const nonRetryableError = { response: { status: 400 } };

      expect(errorHandler.isRetryable(retryableError)).toBe(true);
      expect(errorHandler.isRetryable(nonRetryableError)).toBe(false);
    });

    it('should calculate retry delays correctly', () => {
      const rateLimitError = {
        response: { 
          status: 429,
          headers: { 'retry-after': '30' }
        }
      };

      const delay = errorHandler.getRetryDelay(rateLimitError);
      expect(delay).toBe(30000); // 30 seconds in ms
    });
  });
});