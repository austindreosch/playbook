import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'playbook'; // Hardcoding database name as seen in other user files

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local or equivalent');
}
// Removed check for MONGODB_DB_NAME as it's now hardcoded

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);

  await client.connect();
  const db = client.db(DATABASE_NAME); // Using the hardcoded database name

  cachedClient = client;
  cachedDb = db;

  return { client, db };
} 