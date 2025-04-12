/**
 * THIS IS THE NOW /API/SAVE/SAVEEXPERTRANKINGS.JS
 * 
 * NEED TO USE THIS FOR SAVING ALL SPORTS EXPERT RANKINGS DATA FROM CSV FILES ETC
 */



import fs from 'fs/promises';
import Fuse from 'fuse.js';
import { MongoClient } from 'mongodb';
import Papa from 'papaparse';
import path from 'path';

const mongoUri = process.env.MONGODB_URI;

// MongoDB connection
async function connectToDb() {
    const client = new MongoClient(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await client.connect();
    return { client, db: client.db('playbook') };
}

// Custom name mappings for each sport
const customNameMaps = {
    NBA: {
        'Alexandre Sarr': 'Alex Sarr',
        'Nic Claxton': 'Nicolas Claxton',
        'Cam Thomas': 'Cameron Thomas',
        'Ronald Holland II': 'Ron Holland',
        // add more NBA mappings
    },
    MLB: {
        // MLB name mappings
    },
    NFL: {
        // NFL name mappings
    }
};

// Stats collection queries for each sport
const statsQueries = {
    NBA: { sport: 'nba', endpoint: 'seasonalPlayerStats', addon: 'stats' },
    MLB: { sport: 'mlb', endpoint: 'seasonalPlayerStats' },
    NFL: { sport: 'nfl', endpoint: 'seasonalPlayerStats' }
};

// Parse CSV rankings
async function parseExpertRankingsCSV(sport, format, scoring) {
    // Example file name: nba_redraft_categories_rankings.csv
    const fileName = `${sport.toLowerCase()}_${format.toLowerCase()}_${scoring.toLowerCase()}_rankings.csv`;
    const filePath = path.join(process.cwd(), 'public', 'docs', fileName);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const parsed = Papa.parse(fileContents, {
        header: true,
        comments: true // This will skip lines starting with #
    });
    return parsed.data;
}








// API handler
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sport, format, scoring, source } = req.body;

    if (!sport || !format || !scoring) {
        return res.status(400).json({
            error: 'Missing required parameters',
            details: 'sport, format, and scoring are required'
        });
    }

    let client;
    try {
        // Parse the CSV file using our dedicated function
        const csvData = await parseExpertRankingsCSV(sport, format, scoring);

        // Extract source from second comment line
        const fileName = `${sport.toLowerCase()}_${format.toLowerCase()}_${scoring.toLowerCase()}_rankings.csv`;
        const filePath = path.join(process.cwd(), 'public', 'docs', fileName);
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const lines = fileContents.split('\n');
        let csvSource = 'Unknown';
        for (let i = 0; i < lines.length && i < 5; i++) {
            if (lines[i].startsWith('#')) {
                if (i === 1) {
                    csvSource = lines[i].substring(1).trim();
                    break;
                }
            }
        }

        if (!csvData || csvData.length === 0) {
            return res.status(400).json({
                error: 'Invalid CSV data',
                details: 'CSV file is empty or invalid'
            });
        }

        // Convert CSV data to rankings format
        const csvRankings = csvData
            .filter(row => row.Rank && row.Player)
            .map(row => ({
                rank: parseInt(row.Rank),
                name: row.Player
            }))
            .sort((a, b) => a.rank - b.rank);

        // Now connect to MongoDB and process
        const { client: mongoClient, db } = await connectToDb();
        client = mongoClient;
        const statsQuery = statsQueries[sport];

        if (!statsQuery) {
            return res.status(400).json({
                error: 'Invalid sport',
                details: `Sport ${sport} is not supported`
            });
        }

        // Get all players from stats collection
        const raw = await db.collection('stats').findOne(statsQuery);
        console.log('🔍 Stats Query:', JSON.stringify(statsQuery));
        console.log('📊 Found stats data?', !!raw);
        console.log('📊 Stats data keys:', raw ? Object.keys(raw) : 'NO DATA');
        console.log('📊 Player totals array?', !!raw?.data?.playerStatsTotals);
        console.log('📊 Number of players:', raw?.data?.playerStatsTotals?.length || 0);
        if (raw?.data?.playerStatsTotals?.[0]) {
            console.log('📊 First player example:', JSON.stringify(raw.data.playerStatsTotals[0].player));
        }

        const allPlayers = raw?.data?.playerStatsTotals || [];
        if (allPlayers.length === 0) {
            console.error('❌ No players found in stats collection with query:', statsQuery);
            return res.status(500).json({
                error: 'No player data found',
                details: 'Could not find player stats in database'
            });
        }

        // Setup fuzzy search with more lenient matching
        const fuse = new Fuse(allPlayers, {
            keys: [(item) => `${item.player.firstName} ${item.player.lastName}`],
            threshold: 0.4,  // More lenient matching
            ignoreLocation: true,  // Don't care where the match occurs
            useExtendedSearch: true,  // Enable extended search features
            distance: 100,  // Allow more characters between matches
            includeScore: true  // Include match score in results
        });

        // Helper function to normalize text for comparison
        const normalizeText = (text) => {
            return text.normalize('NFKD')  // Normalize special characters
                .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
                .toLowerCase()
                .trim();
        };

        // Process rankings with name matching
        const results = csvRankings.map((row) => {
            const searchName = customNameMaps[sport]?.[row.name] || row.name;
            // Try exact match first
            const exactMatch = allPlayers.find(p =>
                normalizeText(`${p.player.firstName} ${p.player.lastName}`) === normalizeText(searchName)
            );

            // If no exact match, try fuzzy search
            const fuzzyMatch = !exactMatch ? fuse.search(searchName)?.[0]?.item : null;
            const match = exactMatch || fuzzyMatch;
            const matched = !!match;

            if (!matched) {
                console.log(`❌ No match found for: ${searchName}`);
            } else {
                // console.log(`✅ Found match for ${searchName} -> ${match.player.firstName} ${match.player.lastName} (ID: ${match.player.id})`);
            }

            return {
                playerId: match?.player?.id || null,
                rank: row.rank,
                name: row.name,
                matched,
            };
        });

        // Log unmatched players
        const unmatchedPlayers = results.filter(r => !r.matched).map(r => r.name);
        // if (unmatchedPlayers.length > 0) {
        //     console.log(`❌ Unmatched players for ${sport} ${format} ${scoring}:`);
        //     unmatchedPlayers.forEach(name => console.log(name));
        // }

        // Start a session for transaction
        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                // Find the current latest ranking
                const currentLatest = await db.collection('rankings').findOne({
                    sport: sport.toUpperCase(),
                    format: format.charAt(0).toUpperCase() + format.slice(1).toLowerCase(),
                    scoring: scoring.charAt(0).toUpperCase() + scoring.slice(1).toLowerCase(),
                    isLatest: true
                }, { session });

                // If we have current latest, check if rankings are the same
                if (currentLatest) {
                    const currentTop25 = currentLatest.rankings
                        .slice(0, 25)
                        .map(r => ({ rank: r.rank, name: r.name }))
                        .sort((a, b) => a.rank - b.rank);

                    const newTop25 = results
                        .slice(0, 25)
                        .map(r => ({ rank: r.rank, name: r.name }))
                        .sort((a, b) => a.rank - b.rank);

                    // If top 25 are identical, no need to update
                    if (JSON.stringify(currentTop25) === JSON.stringify(newTop25)) {
                        await session.abortTransaction();
                        return res.status(200).json({
                            message: 'Rankings unchanged',
                            skipped: true,
                            currentTop5: currentTop25.slice(0, 5),
                            newTop5: newTop25.slice(0, 5)
                        });
                    }

                    // Mark current latest as not latest
                    await db.collection('rankings').updateOne(
                        { _id: currentLatest._id },
                        { $set: { isLatest: false } },
                        { session }
                    );
                }

                // Save new rankings
                await db.collection('rankings').insertOne(
                    {
                        name: `${sport} ${format} ${scoring} Rankings`,
                        sport: sport.toUpperCase(),
                        format: format.charAt(0).toUpperCase() + format.slice(1).toLowerCase(),
                        scoring: scoring.charAt(0).toUpperCase() + scoring.slice(1).toLowerCase(),
                        source: csvSource,
                        rankings: results,
                        version: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
                        importedAt: new Date(),
                        isLatest: true,
                    },
                    { session }
                );
            });

            res.status(200).json({
                inserted: results.length,
                matched: results.length - unmatchedPlayers.length,
                unmatched: unmatchedPlayers.length,
                unmatchedPlayers,
            });
        } finally {
            await session.endSession();
        }
    } catch (err) {
        console.error(`Error saving ${sport} ${format} ${scoring} rankings:`, err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    } finally {
        if (client) {
            await client.close();
        }
    }
} 