import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const RANKINGS_COLLECTION = 'rankings'; // Ensure correct collection name

// Helper to safely lowercase strings
const safeLowerCase = (str) => (typeof str === 'string' ? str.toLowerCase() : str);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Destructure all potential parameters
    const { 
        sport, 
        format, 
        scoring,    // Optional
        source,     // Optional
        pprSetting, // Optional
        flexSetting, // Optional
        // fetchConsensus // Flag removed as source is ignored
    } = req.query;

    // Basic validation (only for required fields)
    if (!sport || !format) {
        return res.status(400).json({
            error: 'Missing required query parameters: sport, format'
        });
    }

    let client;

    try {
        client = new MongoClient(mongoUri); // Initialize the client
        await client.connect();
        const db = client.db('playbook');
        const collection = db.collection(RANKINGS_COLLECTION);

        // Start building the query dynamically
        const query = {
            sport: safeLowerCase(sport),
            format: safeLowerCase(format),
            isLatest: true
        };

        // Source field is intentionally ignored for fetching the latest ranking

        // Add scoring if present
        if (scoring) {
            query.scoring = safeLowerCase(scoring);
        }
        
        // Add NFL-specific optional fields
        if (safeLowerCase(sport) === 'nfl') {
            if (pprSetting) {
                query.pprSetting = safeLowerCase(pprSetting);
            }
            if (flexSetting) {
                query.flexSetting = safeLowerCase(flexSetting);
            }
        }


        // Get the latest version matching the constructed query
        const latestVersion = await collection.findOne(
            query,
            {
                sort: { dateFetched: -1 } // Sort by dateFetched to get the most recent
            }
        );

        if (!latestVersion) {
            return res.status(404).json({
                error: `No latest ranking found matching the criteria`
            });
        }

        // Return the *entire document* for backward compatibility
        res.status(200).json(latestVersion); 

    } catch (error) {
        console.error('Error fetching latest rankings:', error);
        res.status(500).json({ error: 'Failed to fetch latest rankings' });
    } finally {
        // Ensure client is defined and topology exists before checking connection
        if (client && client.topology && client.topology.isConnected()) { 
            await client.close();
        }
    }
} 