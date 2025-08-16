/**
 * Basic tests for authentication infrastructure
 * Tests core functionality without external dependencies
 */

import crypto from 'crypto';

// Mock environment variables for testing
process.env.CREDENTIAL_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64');
process.env.OAUTH_STATE_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

// Mock MongoDB connection
const mockDb = {
  collection: () => ({
    insertOne: async () => ({ insertedId: 'mock-id' }),
    findOne: async () => null,
    findOneAndUpdate: async () => ({ value: { _id: 'mock-id' } }),
    updateOne: async () => ({ modifiedCount: 1 }),
    deleteOne: async () => ({ deletedCount: 1 }),
    deleteMany: async () => ({ deletedCount: 0 }),
    distinct: async () => []
  })
};

// Mock the MongoDB module
const originalImport = await import('../../../lib/mongodb.js');
originalImport.connectToDatabase = async () => ({ client: {}, db: mockDb });

// Now import the classes that depend on MongoDB
import CredentialManager from '../CredentialManager.js';
import OAuthManager from '../OAuthManager.js';
import AuthenticationHelper from '../AuthenticationHelper.js';

// Test CredentialManager encryption/decryption
function testCredentialManagerEncryption() {
  console.log('Testing CredentialManager encryption...');
  
  const credManager = new CredentialManager();
  
  const testData = {
    accessToken: 'test-token-123',
    refreshToken: 'refresh-token-456',
    userId: 'test-user'
  };
  
  try {
    // Test encryption
    const encrypted = credManager.encrypt(JSON.stringify(testData));
    console.log('✓ Encryption successful');
    
    // Test decryption
    const decrypted = credManager.decrypt(encrypted);
    const parsedData = JSON.parse(decrypted);
    
    if (JSON.stringify(parsedData) === JSON.stringify(testData)) {
      console.log('✓ Decryption successful - data matches');
    } else {
      console.log('✗ Decryption failed - data mismatch');
    }
    
    // Test encryption key validation
    const validKey = credManager.validateEncryptionKey(process.env.CREDENTIAL_ENCRYPTION_KEY);
    if (validKey) {
      console.log('✓ Encryption key validation successful');
    } else {
      console.log('✗ Encryption key validation failed');
    }
    
  } catch (error) {
    console.log('✗ CredentialManager test failed:', error.message);
  }
}

// Test OAuthManager state generation
function testOAuthManagerState() {
  console.log('\nTesting OAuthManager state generation...');
  
  try {
    const oauthManager = new OAuthManager();
    
    const userId = 'test-user-123';
    const platform = 'yahoo';
    
    // Generate state
    const state = oauthManager.generateSecureState(userId, platform);
    console.log('✓ OAuth state generation successful');
    
    // Decode and verify state structure
    const decoded = Buffer.from(state, 'base64url').toString();
    const parts = decoded.split(':');
    
    if (parts.length === 5 && parts[0] === userId && parts[1] === platform) {
      console.log('✓ OAuth state structure valid');
    } else {
      console.log('✗ OAuth state structure invalid');
    }
    
  } catch (error) {
    console.log('✗ OAuthManager test failed:', error.message);
  }
}

// Test AuthenticationHelper requirements
function testAuthenticationHelperRequirements() {
  console.log('\nTesting AuthenticationHelper requirements...');
  
  try {
    const authHelper = new AuthenticationHelper();
    
    // Test platform auth types
    const fantraxType = authHelper.getAuthType('fantrax');
    const sleeperType = authHelper.getAuthType('sleeper');
    const yahooType = authHelper.getAuthType('yahoo');
    const espnType = authHelper.getAuthType('espn');
    
    if (fantraxType === 'userSecret' && 
        sleeperType === 'userId' && 
        yahooType === 'oauth' && 
        espnType === 'cookies') {
      console.log('✓ Platform auth types correct');
    } else {
      console.log('✗ Platform auth types incorrect');
    }
    
    // Test credential requirements
    const fantraxReqs = authHelper.getCredentialRequirements('fantrax');
    const yahooReqs = authHelper.getCredentialRequirements('yahoo');
    
    if (fantraxReqs.type === 'userSecret' && fantraxReqs.fields.length > 0 &&
        yahooReqs.type === 'oauth' && yahooReqs.fields.length === 0) {
      console.log('✓ Credential requirements structure correct');
    } else {
      console.log('✗ Credential requirements structure incorrect');
    }
    
  } catch (error) {
    console.log('✗ AuthenticationHelper test failed:', error.message);
  }
}

// Run tests
console.log('Running Authentication Infrastructure Tests\n');
testCredentialManagerEncryption();
testOAuthManagerState();
testAuthenticationHelperRequirements();
console.log('\nAuthentication infrastructure tests completed.');