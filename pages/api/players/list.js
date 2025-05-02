import { MongoClient } from 'mongodb';
import { CORE_DATA_SOURCE_KEY } from '../../../lib/config.js'; // Adjust path as needed

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook';
const PLAYERS_COLLECTION = 'players';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sport } = req.query;

    if (!sport) {
        return res.status(400).json({ error: 'Sport query parameter is required' });
    }

    const lowerCaseSport = sport.toLowerCase();
    let client;

    try {
        client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(DB_NAME);
        const playersCollection = db.collection(PLAYERS_COLLECTION);

        console.log(`API: Fetching player identities for sport: ${lowerCaseSport}`);

        const players = await playersCollection.find(
            { sport: lowerCaseSport },
            {
                projection: {
                    _id: 1, // Keep the default _id as playbookId
                    [`${CORE_DATA_SOURCE_KEY}.id`]: 1, // Get the MySportsFeeds ID
                    primaryName: 1,
                    position: 1,
                    teamId: 1,
                    teamName: 1,
                    // Add any other essential lightweight fields needed for base display
                }
            }
        ).toArray();

        console.log(`API: Found ${players.length} player identities for ${lowerCaseSport}`);

        // Map the result to a cleaner structure if needed, renaming _id to playbookId
        const playerIdentities = players.map(p => ({
            playbookId: p._id,
            mySportsFeedsId: p[CORE_DATA_SOURCE_KEY]?.id?.toString() || null, // Ensure it's a string or null
            primaryName: p.primaryName,
            position: p.position,
            teamId: p.teamId,
            teamName: p.teamName,
        }));


        res.status(200).json(playerIdentities);

    } catch (error) {
        console.error(`API Error fetching player identities for ${lowerCaseSport}:`, error);
        res.status(500).json({ error: 'Failed to fetch player identities', details: error.message });
    } finally {
        if (client) {
            await client.close();
        }
    }
} 