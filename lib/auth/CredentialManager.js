/**
 * Credential Manager for secure storage and retrieval of platform credentials
 * Uses AES-256 encryption for sensitive data protection
 */

import crypto from 'crypto';
import { connectToDatabase } from '../mongodb.js';

export class CredentialManager {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16; // 128 bits
    this.tagLength = 16; // 128 bits
    
    // Use environment variable for encryption key, fallback to generated key
    this.encryptionKey = process.env.CREDENTIAL_ENCRYPTION_KEY || this.generateEncryptionKey();
  }

  /**
   * Store encrypted credentials for a user and platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @param {Object} credentials - Credential data to encrypt and store
   * @param {number} expiresIn - Expiration time in seconds (optional)
   * @returns {Promise<string>} - Credential ID
   */
  async storeCredentials(userId, platform, credentials, expiresIn = null) {
    if (!userId || !platform || !credentials) {
      throw new Error('Missing required parameters: userId, platform, or credentials');
    }

    // Encrypt the credentials
    const encryptedData = this.encrypt(JSON.stringify(credentials));
    
    // Calculate expiration date if provided
    const expiresAt = expiresIn ? new Date(Date.now() + (expiresIn * 1000)) : null;

    const { db } = await connectToDatabase();
    
    // Upsert credentials (update if exists, insert if not)
    const result = await db.collection('platformCredentials').findOneAndUpdate(
      { userId, platform },
      {
        $set: {
          userId,
          platform,
          encryptedData: encryptedData.encrypted,
          iv: encryptedData.iv,
          tag: encryptedData.tag,
          expiresAt,
          updatedAt: new Date(),
          lastUsed: new Date(),
          isActive: true
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { 
        upsert: true, 
        returnDocument: 'after' 
      }
    );

    return result.value._id.toString();
  }

  /**
   * Retrieve and decrypt credentials for a user and platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {Promise<Object|null>} - Decrypted credentials or null if not found/expired
   */
  async getCredentials(userId, platform) {
    if (!userId || !platform) {
      throw new Error('Missing required parameters: userId or platform');
    }

    const { db } = await connectToDatabase();
    
    // Find active, non-expired credentials
    const credentialDoc = await db.collection('platformCredentials').findOne({
      userId,
      platform,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    if (!credentialDoc) {
      return null;
    }

    try {
      // Decrypt the credentials
      const decryptedData = this.decrypt({
        encrypted: credentialDoc.encryptedData,
        iv: credentialDoc.iv,
        tag: credentialDoc.tag
      });

      // Update last used timestamp
      await db.collection('platformCredentials').updateOne(
        { _id: credentialDoc._id },
        { $set: { lastUsed: new Date() } }
      );

      return JSON.parse(decryptedData);

    } catch (error) {
      console.error('Failed to decrypt credentials:', error);
      
      // Mark credentials as invalid if decryption fails
      await this.markCredentialsInvalid(userId, platform);
      return null;
    }
  }

  /**
   * Update existing credentials (e.g., refresh tokens)
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @param {Object} updatedCredentials - Updated credential data
   * @param {number} expiresIn - New expiration time in seconds (optional)
   * @returns {Promise<boolean>} - Success status
   */
  async updateCredentials(userId, platform, updatedCredentials, expiresIn = null) {
    if (!userId || !platform || !updatedCredentials) {
      throw new Error('Missing required parameters: userId, platform, or updatedCredentials');
    }

    // Get existing credentials to merge with updates
    const existingCredentials = await this.getCredentials(userId, platform);
    if (!existingCredentials) {
      throw new Error('No existing credentials found to update');
    }

    // Merge existing with updated credentials
    const mergedCredentials = { ...existingCredentials, ...updatedCredentials };

    // Store the updated credentials
    await this.storeCredentials(userId, platform, mergedCredentials, expiresIn);
    return true;
  }

  /**
   * Revoke and delete credentials for a user and platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {Promise<boolean>} - Success status
   */
  async revokeCredentials(userId, platform) {
    if (!userId || !platform) {
      throw new Error('Missing required parameters: userId or platform');
    }

    const { db } = await connectToDatabase();
    
    // Mark credentials as inactive instead of deleting for audit trail
    const result = await db.collection('platformCredentials').updateOne(
      { userId, platform },
      { 
        $set: { 
          isActive: false, 
          revokedAt: new Date() 
        } 
      }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Check if credentials exist and are valid for a user and platform
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {Promise<boolean>} - Whether valid credentials exist
   */
  async hasValidCredentials(userId, platform) {
    const credentials = await this.getCredentials(userId, platform);
    return credentials !== null;
  }

  /**
   * Get credential metadata without decrypting sensitive data
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   * @returns {Promise<Object|null>} - Credential metadata
   */
  async getCredentialMetadata(userId, platform) {
    const { db } = await connectToDatabase();
    
    const credentialDoc = await db.collection('platformCredentials').findOne(
      { userId, platform, isActive: true },
      { 
        projection: { 
          platform: 1, 
          createdAt: 1, 
          updatedAt: 1, 
          lastUsed: 1, 
          expiresAt: 1,
          isActive: 1
        } 
      }
    );

    return credentialDoc;
  }

  /**
   * List all platforms with valid credentials for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of platform identifiers
   */
  async getUserPlatforms(userId) {
    const { db } = await connectToDatabase();
    
    const platforms = await db.collection('platformCredentials').distinct('platform', {
      userId,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    return platforms;
  }

  /**
   * Clean up expired credentials
   * @returns {Promise<number>} - Number of cleaned up credentials
   */
  async cleanupExpiredCredentials() {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('platformCredentials').updateMany(
      { 
        isActive: true,
        expiresAt: { $lt: new Date() }
      },
      { 
        $set: { 
          isActive: false, 
          expiredAt: new Date() 
        } 
      }
    );

    return result.modifiedCount;
  }

  /**
   * Mark credentials as invalid (e.g., after decryption failure)
   * @param {string} userId - User ID
   * @param {string} platform - Platform identifier
   */
  async markCredentialsInvalid(userId, platform) {
    const { db } = await connectToDatabase();
    
    await db.collection('platformCredentials').updateOne(
      { userId, platform },
      { 
        $set: { 
          isActive: false, 
          invalidatedAt: new Date(),
          invalidationReason: 'decryption_failed'
        } 
      }
    );
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   * @param {string} text - Text to encrypt
   * @returns {Object} - Encrypted data with IV and authentication tag
   */
  encrypt(text) {
    try {
      // Generate random IV for each encryption
      const iv = crypto.randomBytes(this.ivLength);
      
      // Create cipher with proper key format
      const key = Buffer.from(this.encryptionKey, 'base64');
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      cipher.setAAD(Buffer.from('playbook-credentials', 'utf8'));
      
      // Encrypt the text
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get authentication tag
      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };

    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt sensitive data using AES-256-GCM
   * @param {Object} encryptedData - Object containing encrypted data, IV, and tag
   * @returns {string} - Decrypted text
   */
  decrypt(encryptedData) {
    try {
      const { encrypted, iv, tag } = encryptedData;
      
      // Create decipher with proper key format
      const key = Buffer.from(this.encryptionKey, 'base64');
      const decipher = crypto.createDecipheriv(this.algorithm, key, Buffer.from(iv, 'hex'));
      decipher.setAAD(Buffer.from('playbook-credentials', 'utf8'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      
      // Decrypt the data
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;

    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Generate a secure encryption key
   * @returns {string} - Base64 encoded encryption key
   */
  generateEncryptionKey() {
    return crypto.randomBytes(this.keyLength).toString('base64');
  }

  /**
   * Validate encryption key format
   * @param {string} key - Encryption key to validate
   * @returns {boolean} - Whether key is valid
   */
  validateEncryptionKey(key) {
    try {
      const keyBuffer = Buffer.from(key, 'base64');
      return keyBuffer.length === this.keyLength;
    } catch (error) {
      return false;
    }
  }
}

export default CredentialManager;