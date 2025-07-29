import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'playbook';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local or equivalent');
}

// Global variables for connection caching
let cachedClient = null;
let cachedDb = null;
let isConnecting = false;
let connectionPromise = null;

// MongoDB Client options optimized for connection pooling
const clientOptions = {
  // Connection Pool Settings
  maxPoolSize: 50, // Maximum number of connections in the pool
  minPoolSize: 5,  // Minimum number of connections in the pool
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  maxConnecting: 10, // Maximum number of connections attempting to connect
  
  // Timeout Settings
  serverSelectionTimeoutMS: 10000, // 10 second timeout for server selection
  socketTimeoutMS: 45000, // 45 second timeout for individual operations
  connectTimeoutMS: 30000, // 30 second timeout for initial connection
  
  // Retry Settings
  retryWrites: true,
  retryReads: true,
  
  // Other optimizations
  compressors: ['zstd', 'zlib'], // Enable compression
  bufferMaxEntries: 0, // Disable mongoose buffering in production
};

/**
 * Establishes connection to MongoDB with connection pooling
 * This function implements singleton pattern to reuse connections
 * @returns {Promise<{client: MongoClient, db: Db}>}
 */
export async function connectToDatabase() {
  try {
    // If we already have a cached connection, return it
    if (cachedClient && cachedDb) {
      // Verify the connection is still active
      await cachedClient.db('admin').command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    }

    // If a connection is already in progress, wait for it
    if (isConnecting && connectionPromise) {
      return await connectionPromise;
    }

    // Start new connection process
    isConnecting = true;
    connectionPromise = createConnection();
    
    const result = await connectionPromise;
    isConnecting = false;
    connectionPromise = null;
    
    return result;
  } catch (error) {
    isConnecting = false;
    connectionPromise = null;
    console.error('MongoDB connection error:', error);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

/**
 * Creates a new MongoDB connection
 * @returns {Promise<{client: MongoClient, db: Db}>}
 */
async function createConnection() {
  console.log('Creating new MongoDB connection...');
  
  const client = new MongoClient(MONGODB_URI, clientOptions);
  
  await client.connect();
  
  // Test the connection
  await client.db('admin').command({ ping: 1 });
  console.log('MongoDB connection established successfully');
  
  const db = client.db(DATABASE_NAME);
  
  // Cache the connection
  cachedClient = client;
  cachedDb = db;
  
  // Set up connection event listeners for monitoring
  client.on('connectionPoolCreated', () => {
    console.log('MongoDB connection pool created');
  });
  
  client.on('connectionPoolClosed', () => {
    console.log('MongoDB connection pool closed');
    // Clear cache when pool is closed
    cachedClient = null;
    cachedDb = null;
  });
  
  client.on('error', (error) => {
    console.error('MongoDB client error:', error);
    // Clear cache on error
    cachedClient = null;
    cachedDb = null;
  });
  
  return { client, db };
}

/**
 * Get database instance (convenience function)
 * @returns {Promise<Db>}
 */
export async function getDatabase() {
  const { db } = await connectToDatabase();
  return db;
}

/**
 * Get a specific collection (convenience function)
 * @param {string} collectionName 
 * @returns {Promise<Collection>}
 */
export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

/**
 * Execute a database operation with automatic connection management
 * @param {Function} operation - Function that receives db as parameter
 * @returns {Promise<any>}
 */
export async function withDatabase(operation) {
  const db = await getDatabase();
  return await operation(db);
}

/**
 * Gracefully close all connections (for app shutdown)
 */
export async function closeDatabaseConnection() {
  if (cachedClient) {
    console.log('Closing MongoDB connection...');
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('MongoDB connection closed');
  }
}

/**
 * Get connection pool statistics for monitoring
 * @returns {Object|null}
 */
export function getConnectionStats() {
  if (!cachedClient) {
    return null;
  }
  
  try {
    // Note: This is a simplified stats object
    // Real connection pool stats would require additional MongoDB driver features
    return {
      isConnected: !!cachedClient && !!cachedDb,
      hasClient: !!cachedClient,
      hasDatabase: !!cachedDb,
    };
  } catch (error) {
    console.error('Error getting connection stats:', error);
    return null;
  }
}

// Legacy support - maintain backward compatibility
export { connectToDatabase as default }; 