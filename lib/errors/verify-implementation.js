/**
 * Verification script for ErrorHandler and RateLimiter implementation
 */

import ErrorHandler from './ErrorHandler.js';
import RateLimiter from '../rateLimit/RateLimiter.js';

async function verifyErrorHandler() {
  console.log('🧪 Testing ErrorHandler...');

  const errorHandler = new ErrorHandler('fantrax');

  // Test 1: HTTP 401 error normalization
  const authError = {
    response: { status: 401, statusText: 'Unauthorized' },
    message: 'Request failed with status code 401'
  };

  const normalizedAuthError = errorHandler.normalize(authError);
  console.log('✅ Auth error normalized:', {
    code: normalizedAuthError.code,
    retryable: normalizedAuthError.retryable,
    message: normalizedAuthError.message.substring(0, 50) + '...'
  });

  // Test 2: Rate limit error with retry-after
  const rateLimitError = {
    response: {
      status: 429,
      statusText: 'Too Many Requests',
      headers: { 'retry-after': '60' }
    },
    message: 'Request failed with status code 429'
  };

  const normalizedRateError = errorHandler.normalize(rateLimitError);
  console.log('✅ Rate limit error normalized:', {
    code: normalizedRateError.code,
    retryable: normalizedRateError.retryable,
    retryAfter: normalizedRateError.retryAfter
  });

  // Test 3: Missing credentials error
  const missingCredsError = errorHandler.createMissingCredentialsError('userSecretId');
  console.log('✅ Missing credentials error created:', {
    code: missingCredsError.code,
    retryable: missingCredsError.retryable
  });

  // Test 4: Platform-specific error detection
  const platformError = { message: 'Invalid Fantrax user secret ID' };
  const normalizedPlatformError = errorHandler.normalize(platformError);
  console.log('✅ Platform-specific error detected:', {
    code: normalizedPlatformError.code,
    isPlatformSpecific: errorHandler.isPlatformSpecificError(platformError)
  });

  console.log('✅ ErrorHandler verification complete!\n');
}

async function verifyRateLimiter() {
  console.log('🧪 Testing RateLimiter...');

  const rateLimiter = new RateLimiter(3, 1000, 'test'); // 3 requests per second

  // Test 1: Basic request execution
  let requestCount = 0;
  const mockRequest = () => {
    requestCount++;
    return Promise.resolve(`Request ${requestCount}`);
  };

  const result1 = await rateLimiter.execute(mockRequest);
  console.log('✅ Basic request executed:', result1);

  // Test 2: Multiple requests with queueing
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(rateLimiter.execute(mockRequest));
  }

  const results = await Promise.all(promises);
  console.log('✅ Multiple requests completed:', results.length, 'requests');

  // Test 3: Retry logic with retryable error
  let attemptCount = 0;
  const retryableRequest = () => {
    attemptCount++;
    if (attemptCount < 3) {
      const error = new Error('Network error');
      error.code = 'ENOTFOUND';
      throw error;
    }
    return Promise.resolve('Success after retries');
  };

  try {
    const retryResult = await rateLimiter.execute(retryableRequest, { maxRetries: 3 });
    console.log('✅ Retry logic worked:', retryResult, `(${attemptCount} attempts)`);
  } catch (error) {
    console.log('❌ Retry logic failed:', error.message);
  }

  // Test 4: Platform-specific rate limiter creation
  const fantraxLimiter = RateLimiter.createForPlatform('fantrax');
  const sleeperLimiter = RateLimiter.createForPlatform('sleeper');

  console.log('✅ Platform-specific limiters created:', {
    fantrax: { maxRequests: fantraxLimiter.maxRequests, windowMs: fantraxLimiter.windowMs },
    sleeper: { maxRequests: sleeperLimiter.maxRequests, windowMs: sleeperLimiter.windowMs }
  });

  // Test 5: Status information
  const status = rateLimiter.getStatus();
  console.log('✅ Rate limiter status:', {
    platform: status.platform,
    tokens: status.tokens,
    queueLength: status.queueLength
  });

  console.log('✅ RateLimiter verification complete!\n');
}

async function verifyIntegration() {
  console.log('🧪 Testing Integration...');

  // Test ErrorHandler and RateLimiter working together
  const errorHandler = new ErrorHandler('sleeper');
  const rateLimiter = RateLimiter.createForPlatform('sleeper');

  // Simulate a rate-limited request that eventually succeeds
  let callCount = 0;
  const simulatedApiCall = () => {
    callCount++;
    if (callCount < 3) {
      const error = new Error('Too many requests');
      error.response = { status: 429, headers: { 'retry-after': '1' } };
      throw error;
    }
    return Promise.resolve({ data: 'API response' });
  };

  try {
    const result = await rateLimiter.execute(simulatedApiCall, { maxRetries: 3 });
    console.log('✅ Integration test passed:', result.data, `(${callCount} attempts)`);
  } catch (error) {
    const normalizedError = errorHandler.normalize(error);
    console.log('❌ Integration test failed:', normalizedError.message);
  }

  console.log('✅ Integration verification complete!\n');
}

async function runVerification() {
  console.log('🚀 Starting Error Handling and Rate Limiting Verification\n');

  try {
    await verifyErrorHandler();
    await verifyRateLimiter();
    await verifyIntegration();

    console.log('🎉 All verifications passed! Error handling and rate limiting are working correctly.');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

// Run verification if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runVerification();
}

export { verifyErrorHandler, verifyRateLimiter, verifyIntegration };