// /**
//  * API endpoint to save expert rankings for fantasy sports from CSV files.
//  * 
//  * Functionality:
//  * - Parses CSV files containing expert rankings for different sports (NFL, NBA, MLB)
//  * - Matches player names with existing player data in the database
//  * - Handles name variations using custom mappings and fuzzy matching
//  * - Stores rankings in MongoDB with version tracking
//  * - Prevents duplicate imports of unchanged rankings
//  * 
//  * File integrations:
//  * - Reads CSV files from public/docs directory (e.g., nfl_dynasty_points_rankings.csv)
//  * - CSV format requires 'Rank' and 'Player' columns with optional comment lines
//  * - Extracts source information from CSV comment lines
//  * 
//  * Database interactions:
//  * - Connects to MongoDB 'playbook' database
//  * - Queries 'stats' collection for player data
//  * - Updates 'rankings' collection with new rankings
//  */

// import fs from 'fs/promises';
// import Fuse from 'fuse.js';
// import { MongoClient } from 'mongodb';
// import Papa from 'papaparse';
// import path from 'path';
// import { customNameMaps } from '../../../lib/nameMappings'; // Import the maps

// // Ensure unmatched directory exists
// const unmatchedDir = path.join(process.cwd(), 'public', 'docs', 'unmatched');
// fs.mkdir(unmatchedDir, { recursive: true }).catch(console.error); // Create dir if not exists, ignore errors if it does

// const mongoUri = process.env.MONGODB_URI;

// // MongoDB connection
// async function connectToDb() {
//     const client = new MongoClient(mongoUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     await client.connect();
//     return { client, db: client.db('playbook') };
// }

// // Stats collection queries for each sport
// const statsQueries = {
//     NBA: { sport: 'nba', endpoint: 'seasonalPlayerStats', addon: 'stats' },
//     MLB: { sport: 'mlb', endpoint: 'seasonalPlayerStats', addon: 'stats' },
//     NFL: { sport: 'nfl', endpoint: 'seasonalPlayerStats', addon: 'stats' }
// };

// // Parse CSV rankings
// async function parseExpertRankingsCSV(sport, format, scoring) {
//     // Example file name: nba_redraft_categories_rankings.csv
//     const fileName = `${sport.toLowerCase()}_${format.toLowerCase()}_${scoring.toLowerCase()}_rankings.csv`;
//     const filePath = path.join(process.cwd(), 'public', 'docs', fileName);
//     const fileContents = await fs.readFile(filePath, 'utf-8');
//     const parsed = Papa.parse(fileContents, {
//         header: true,
//         comments: true // This will skip lines starting with #
//     });
//     return parsed.data;
// }

// // API handler
// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ error: 'Method not allowed' });
//     }

//     const { sport, format, scoring, source } = req.body;

//     if (!sport || !format || !scoring) {
//         return res.status(400).json({
//             error: 'Missing required parameters',
//             details: 'sport, format, and scoring are required'
//         });
//     }

//     let client;
//     try {
//         // Parse the CSV file using our dedicated function
//         const csvData = await parseExpertRankingsCSV(sport, format, scoring);

//         // Extract source from second comment line
//         const fileName = `${sport.toLowerCase()}_${format.toLowerCase()}_${scoring.toLowerCase()}_rankings.csv`;
//         const filePath = path.join(process.cwd(), 'public', 'docs', fileName);
//         const fileContents = await fs.readFile(filePath, 'utf-8');
//         const lines = fileContents.split('\n');
//         let csvSource = 'Unknown';
//         for (let i = 0; i < lines.length && i < 5; i++) {
//             if (lines[i].startsWith('#')) {
//                 if (i === 1) {
//                     csvSource = lines[i].substring(1).trim();
//                     break;
//                 }
//             }
//         }

//         if (!csvData || csvData.length === 0) {
//             return res.status(400).json({
//                 error: 'Invalid CSV data',
//                 details: 'CSV file is empty or invalid'
//             });
//         }

//         // Convert CSV data to rankings format
//         const csvRankings = csvData
//             .filter(row => row.Rank && row.Player)
//             .map(row => ({
//                 rank: parseInt(row.Rank),
//                 name: row.Player
//             }))
//             .sort((a, b) => a.rank - b.rank);

//         // Now connect to MongoDB and process
//         const { client: mongoClient, db } = await connectToDb();
//         client = mongoClient;
//         const statsQuery = statsQueries[sport];

//         if (!statsQuery) {
//             return res.status(400).json({
//                 error: 'Invalid sport',
//                 details: `Sport ${sport} is not supported`
//             });
//         }

//         // Get all players from stats collection
//         const raw = await db.collection('stats').findOne(statsQuery);
//         console.log('🔍 Stats Query:', JSON.stringify(statsQuery));
//         console.log('📊 Found stats data?', !!raw);
//         console.log('📊 Stats data keys:', raw ? Object.keys(raw) : 'NO DATA');
//         console.log('📊 Player totals array?', !!raw?.data?.playerStatsTotals);
//         console.log('📊 Number of players:', raw?.data?.playerStatsTotals?.length || 0);
//         if (raw?.data?.playerStatsTotals?.[0]) {
//             console.log('📊 First player example:', JSON.stringify(raw.data.playerStatsTotals[0].player));
//         }

//         const allPlayers = raw?.data?.playerStatsTotals || [];
//         if (allPlayers.length === 0) {
//             console.error('❌ No players found in stats collection with query:', statsQuery);
//             return res.status(500).json({
//                 error: 'No player data found',
//                 details: 'Could not find player stats in database'
//             });
//         }

//         // Setup fuzzy search with more lenient matching
//         const fuse = new Fuse(allPlayers, {
//             keys: [
//                 {
//                     name: 'fullName', // Define a key name for the combined name
//                     getFn: (item) => `${item.player.firstName} ${item.player.lastName}` // Function to get the full name
//                 }
//             ],
//             threshold: 0.3,  // Slightly more lenient threshold
//             ignoreLocation: true,
//             useExtendedSearch: true,
//             distance: 100,
//             includeScore: true
//         });

//         // Helper function to normalize text for comparison
//         const normalizeText = (text) => {
//             return text.normalize('NFKD')  // Normalize special characters
//                 .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
//                 .replace(/[.\\']/g, '') // Remove periods, apostrophes
//                 .replace(/\s+(jr|sr|iii|ii|iv)\.?$/i, '') // Remove suffixes like Jr., Sr., II, III, IV
//                 .toLowerCase()
//                 .trim();
//         };

//         // Process rankings with name matching
//         const results = csvRankings.map((row) => {
//             // Add detailed logging FOR the mapping lookup


//             const mappedName = customNameMaps[sport]?.[row.name];

//             const searchName = mappedName || row.name; // Use mapped name if found, otherwise original name

//             // Try exact match first
//             const exactMatch = allPlayers.find(p => {
//                 const fullName = `${p.player.firstName} ${p.player.lastName}`;
//                 const normalizedFullName = normalizeText(fullName);
//                 const normalizedSearchName = normalizeText(searchName);
//                 // console.log(`Comparing: "${normalizedFullName}" with "${normalizedSearchName}"`);
//                 return normalizedFullName === normalizedSearchName;
//             });

//             let fuzzyMatch = null;
//             if (!exactMatch) {
//                 const fuseResults = fuse.search(searchName);
//                 // console.log(` Fuzzy search results for \"${searchName}\":`, fuseResults.slice(0, 3));
//                 if (fuseResults.length > 0) {
//                     if (fuseResults[0].score <= 0.3) {
//                         fuzzyMatch = fuseResults[0].item;
//                     } else {
//                         // console.log(` Fuzzy match for \"${searchName}\" score (${fuseResults[0].score}) too high. Skipping.`);
//                     }
//                 }
//             }

//             const match = exactMatch || fuzzyMatch;
//             const matched = !!match;

//             if (!matched) {
//                 console.log(`❌ No match found for: ${searchName}`);
//             } else {

//             }

//             return {
//                 playerId: match?.player?.id || null,
//                 rank: row.rank,
//                 name: row.name, // Keep original name from CSV
//                 matched,
//             };
//         });

//         // Log unmatched players and generate CSV
//         const unmatchedPlayers = results.filter(r => !r.matched).map(r => ({ Name: r.name })); // Format for PapaParse header
//         let unmatchedFilePath = null;

//         if (unmatchedPlayers.length > 0) {
//             console.log(`❌ ${unmatchedPlayers.length} Unmatched players for ${sport} ${format} ${scoring}.`);
//             // Generate CSV
//             try {
//                 const csvString = Papa.unparse(unmatchedPlayers);
//                 const dateStamp = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
//                 const unmatchedFileName = `unmatched_${sport.toLowerCase()}_${format.toLowerCase()}_${scoring.toLowerCase()}_${dateStamp}.csv`;
//                 unmatchedFilePath = path.join('docs', 'unmatched', unmatchedFileName); // Relative path for response
//                 const fullUnmatchedPath = path.join(process.cwd(), 'public', unmatchedFilePath);

//                 await fs.writeFile(fullUnmatchedPath, csvString);
//                 console.log(`📝 Unmatched players saved to: ${unmatchedFilePath}`);
//             } catch (csvError) {
//                 console.error('❌ Error writing unmatched players CSV:', csvError);
//                 unmatchedFilePath = null; // Reset path if saving failed
//             }
//         }

//         // Start a session for transaction
//         const session = client.startSession();

//         try {
//             await session.withTransaction(async () => {
//                 // Find the current latest ranking
//                 const currentLatest = await db.collection('rankings').findOne({
//                     sport: sport.toUpperCase(),
//                     format: format.charAt(0).toUpperCase() + format.slice(1).toLowerCase(),
//                     scoring: scoring.charAt(0).toUpperCase() + scoring.slice(1).toLowerCase(),
//                     isLatest: true
//                 }, { session });

//                 // If we have current latest, check if rankings are the same
//                 if (currentLatest) {
//                     const currentTop25 = currentLatest.rankings
//                         .slice(0, 25)
//                         .map(r => ({ rank: r.rank, name: r.name }))
//                         .sort((a, b) => a.rank - b.rank);

//                     const newTop25 = results
//                         .slice(0, 25)
//                         .map(r => ({ rank: r.rank, name: r.name }))
//                         .sort((a, b) => a.rank - b.rank);

//                     // If top 25 are identical, no need to update
//                     if (JSON.stringify(currentTop25) === JSON.stringify(newTop25)) {
//                         await session.abortTransaction();
//                         return res.status(200).json({
//                             message: 'Rankings unchanged',
//                             skipped: true,
//                             currentTop5: currentTop25.slice(0, 5),
//                             newTop5: newTop25.slice(0, 5),
//                             unmatchedCount: unmatchedPlayers.length,
//                             unmatchedFilePath: unmatchedFilePath // Include path even if skipped
//                         });
//                     }

//                     // Mark current latest as not latest
//                     await db.collection('rankings').updateOne(
//                         { _id: currentLatest._id },
//                         { $set: { isLatest: false } },
//                         { session }
//                     );
//                 }

//                 // Save new rankings
//                 await db.collection('rankings').insertOne(
//                     {
//                         name: `${sport} ${format} ${scoring} Rankings`,
//                         sport: sport.toUpperCase(),
//                         format: format.charAt(0).toUpperCase() + format.slice(1).toLowerCase(),
//                         scoring: scoring.charAt(0).toUpperCase() + scoring.slice(1).toLowerCase(),
//                         source: csvSource,
//                         rankings: results,
//                         version: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
//                         importedAt: new Date(),
//                         isLatest: true,
//                     },
//                     { session }
//                 );
//             });

//             res.status(200).json({
//                 inserted: results.length,
//                 matched: results.length - unmatchedPlayers.length,
//                 unmatched: unmatchedPlayers.length,
//                 unmatchedFilePath: unmatchedFilePath // Add path to response
//             });
//         } finally {
//             await session.endSession();
//         }
//     } catch (err) {
//         console.error(`Error saving ${sport} ${format} ${scoring} rankings:`, err);
//         res.status(500).json({ error: 'Internal server error', details: err.message });
//     } finally {
//         if (client) {
//             await client.close();
//         }
//     }
// } 