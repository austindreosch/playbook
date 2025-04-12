import fs from 'fs/promises';
import Fuse from 'fuse.js';
import { MongoClient } from 'mongodb';
import Papa from 'papaparse';
import path from 'path';

// Parse CSV rankings
async function getNBADynastyCatsRankings() {
  const filePath = path.join(process.cwd(), 'public', 'docs', 'nba_dynasty_rankings_cat.csv');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const parsed = Papa.parse(fileContents, { header: true });
  return parsed.data;
}

// MongoDB connection
async function connectToDb() {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db('playbook');
}

const customNameMap = {
  'Alexandre Sarr': 'Alex Sarr',
  'Nic Claxton': 'Nicolas Claxton',
  'Cam Thomas': 'Cameron Thomas',
  'Ronald Holland II': 'Ron Holland',
  // add more if needed
};

// API handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rankings = await getNBADynastyCatsRankings();
    const db = await connectToDb();

    const raw = await db.collection('stats').findOne({ sport: 'nba', endpoint: 'seasonalPlayerStats' });
    const allPlayers = raw?.stats || [];

    const fuse = new Fuse(allPlayers, {
      keys: ['info.fullName'],
      threshold: 0.3,
    });

    const results = rankings.map((row, i) => {
      const searchName = customNameMap[row.Player] || row.Player;
      const match = fuse.search(searchName)?.[0]?.item;
      const matched = !!match;

      return {
        playerId: match?.info?.id || null,
        rank: parseInt(row.Rank || i + 1),
        name: row.Player,
        matched,
      };
    });

    const unmatchedPlayers = results.filter(r => !r.matched).map(r => r.name);

    if (unmatchedPlayers.length > 0) {
      console.log('❌ Unmatched players (not found in stats db):');
      unmatchedPlayers.forEach(name => console.log(name));
    }

    await db.collection('rankings').updateOne(
      {
        name: 'NBA Dynasty Categories Rankings',
        sport: 'NBA',
        format: 'Dynasty',
        scoring: 'Categories'
      },
      {
        $set: {
          rankings: results,
          importedAt: new Date(),
          isLatest: true,
          publishedAt: new Date().toISOString(),
          details: {
            source: 'CSV Import',
            notes: 'Automatically imported from CSV',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      },
      { upsert: true }
    );

    res.status(200).json({
      inserted: results.length,
      matched: results.length - unmatchedPlayers.length,
      unmatched: unmatchedPlayers.length,
      unmatchedPlayers,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
