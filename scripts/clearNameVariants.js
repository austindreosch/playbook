// scripts/clearNameVariants.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env.local or .env
dotenv.config({ path: '.env.local' });
dotenv.config(); // Load .env if .env.local doesn't exist or doesn't have the variable

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook'; // Make sure this matches your DB name
const PLAYERS_COLLECTION = 'players'; // Make sure this matches your collection name

if (!mongoUri) {
  console.error('Error: MONGODB_URI environment variable not set.');
  process.exit(1);
}

async function clearAllNameVariants() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();

    const db = client.db(DB_NAME);
    const playersCollection = db.collection(PLAYERS_COLLECTION);


    const result = await playersCollection.updateMany(
      {}, // Empty filter matches all documents
      [ // Use aggregation pipeline for the update
        { 
          $set: {
            nameVariants: ["$primaryName"] // Set nameVariants to an array containing the primaryName
          } 
        }
      ]
    );

    if (result.matchedCount !== result.modifiedCount) {
        console.warn('Warning: Not all matched documents were modified. This might happen if some documents already had an empty nameVariants array.');
    }

  } catch (error) {
    console.error('An error occurred during the script execution:', error);
  } finally {
    // Ensure the client connection is closed even if errors occurred
    if (client) {
        await client.close();
    }
  }
}

clearAllNameVariants(); 