// /api/fetch/nba.js
import Papa from 'papaparse';
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const client = new MongoClient(uri, options);

export default async function handler(req, res) {
    try {
        await client.connect();

        /* -----------------------------------------------------------
            1. Fetch all NBA stats and grab the needed datapoints.
        ----------------------------------------------------------- */
        const apiKeyToken = process.env.NEXT_PUBLIC_MYSPORTSFEEDS_API_KEY;
        const password = "MYSPORTSFEEDS"; //Not a secret, required default password
        const credentials = Buffer.from(`${apiKeyToken}:${password}`).toString('base64');
        const url = `https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/player_stats_totals.json`
        const fetchOptions = {
            method: 'GET',
            headers: {
                "Authorization": `Basic ${credentials}`,
                'User-Agent': 'node ' + process.version
            }
        };

        const response = await fetch(url, fetchOptions);
        const data = await response.json();

        const players = data.playerStatsTotals.map((playerStats) => ({
            info: {
                id: playerStats.player.id,
                firstName: playerStats.player.firstName,
                lastName: playerStats.player.lastName,
                fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
                age: playerStats.player.age,
                height: playerStats.player.height,
                weight: playerStats.player.weight,
                team: playerStats.team.abbreviation,
                teamId: playerStats.team.id,
                img: playerStats.player.officialImageSrc,
                pos: playerStats.player.primaryPosition,
                injStatus: playerStats.player.currentInjury,
                minPerGame: parseFloat((playerStats.stats.miscellaneous.minSecondsPerGame / 60).toFixed(1)),
            },
            stats: {
                gamesPlayed: playerStats.stats.gamesPlayed,
                fgPct: playerStats.stats.fieldGoals.fgPct,
                ptsPerGame: playerStats.stats.offense.ptsPerGame,
                fgaPerGame: playerStats.stats.fieldGoals.fgAttPerGame,
                fgmPerGame: playerStats.stats.fieldGoals.fgMadePerGame,
                ftPct: playerStats.stats.freeThrows.ftPct,
                rebPerGame: playerStats.stats.rebounds.rebPerGame,
                astPerGame: playerStats.stats.offense.astPerGame,
                ftaPerGame: playerStats.stats.freeThrows.ftAttPerGame,
                stlPerGame: playerStats.stats.defense.stlPerGame,
                ftmPerGame: playerStats.stats.freeThrows.ftMadePerGame,
                blkPerGame: playerStats.stats.defense.blkPerGame,
                fg2PtPct: playerStats.stats.fieldGoals.fg2PtPct,
                toPerGame: playerStats.stats.defense.tovPerGame,
                threePtPct: playerStats.stats.fieldGoals.fg3PtPct,
                offRebPerGame: playerStats.stats.rebounds.offRebPerGame,
                defRebPerGame: playerStats.stats.rebounds.defRebPerGame,
                fg3PtMadePerGame: playerStats.stats.fieldGoals.fg3PtMadePerGame,
                efgPct: (playerStats.stats.fieldGoals.fgMade + 0.5 * playerStats.stats.fieldGoals.fg3PtMade) / playerStats.stats.fieldGoals.fgAtt,
                tsPct: (playerStats.stats.offense.pts) / (2 * (playerStats.stats.fieldGoals.fgAtt + 0.44 * playerStats.stats.freeThrows.ftAtt)) * 100,
            }
        }));


        /* ------------------------------------------------------------------------
        * Handle duplicate players, accumlate their stats on one entry.
        --------------------------------------------------------------------------- */
        const uniquePlayers = Array.from(
            players.reduce((map, player) => {
                const id = player.info.id;
                if (!map.has(id)) {
                    map.set(id, player);
                } else {
                    // Accumulate stats for duplicate entries
                    const existing = map.get(id);
                    // ... your stat accumulation logic
                    // Add games played
                    existing.stats.gamesPlayed += player.stats.gamesPlayed;

                    // Calculate weighted averages based on games played
                    const existingGames = existing.stats.gamesPlayed - player.stats.gamesPlayed;
                    const totalGames = existing.stats.gamesPlayed;

                    // Helper function for weighted average
                    const average = (existingStat, newStat) => {
                        return (existingStat + newStat) / 2;
                    };

                    // Update per game stats with weighted averages
                    existing.stats.ptsPerGame = average(existing.stats.ptsPerGame, player.stats.ptsPerGame);
                    existing.stats.rebPerGame = average(existing.stats.rebPerGame, player.stats.rebPerGame);
                    existing.stats.astPerGame = average(existing.stats.astPerGame, player.stats.astPerGame);
                    existing.stats.stlPerGame = average(existing.stats.stlPerGame, player.stats.stlPerGame);
                    existing.stats.blkPerGame = average(existing.stats.blkPerGame, player.stats.blkPerGame);
                    existing.stats.toPerGame = average(existing.stats.toPerGame, player.stats.toPerGame);
                    existing.stats.fgaPerGame = average(existing.stats.fgaPerGame, player.stats.fgaPerGame);
                    existing.stats.fgmPerGame = average(existing.stats.fgmPerGame, player.stats.fgmPerGame);
                    existing.stats.ftaPerGame = average(existing.stats.ftaPerGame, player.stats.ftaPerGame);
                    existing.stats.ftmPerGame = average(existing.stats.ftmPerGame, player.stats.ftmPerGame);
                    existing.stats.offRebPerGame = average(existing.stats.offRebPerGame, player.stats.offRebPerGame);
                    existing.stats.defRebPerGame = average(existing.stats.defRebPerGame, player.stats.defRebPerGame);
                    existing.stats.fg3PtMadePerGame = average(existing.stats.fg3PtMadePerGame, player.stats.fg3PtMadePerGame);

                    // Update percentages with weighted averages
                    existing.stats.fgPct = average(existing.stats.fgPct, player.stats.fgPct);
                    existing.stats.ftPct = average(existing.stats.ftPct, player.stats.ftPct);
                    existing.stats.fg2PtPct = average(existing.stats.fg2PtPct, player.stats.fg2PtPct);
                    existing.stats.threePtPct = average(existing.stats.threePtPct, player.stats.threePtPct);
                    existing.stats.efgPct = average(existing.stats.efgPct, player.stats.efgPct);
                    existing.stats.tsPct = average(existing.stats.tsPct, player.stats.tsPct);

                    // Update minutes per game
                    existing.info.minPerGame = average(existing.info.minPerGame, player.info.minPerGame);
                }
                return map;
            }, new Map()).values()
        );


        /* ------------------------------------------------------------------------
        * 2. Process sco re rankings and add to processed player stats.
        --------------------------------------------------------------------------- */
        // const dynastyResponse = await fetch('https://drive.google.com/uc?export=download&id=1rYRWEIX7sdHkcIQ2CfhhZc8TtnGqcx0z');
        // const dynastyCsv = await dynastyResponse.text();
        // const dynastyRankings = Papa.parse(dynastyCsv, {
        //     header: false,
        //     skipEmptyLines: true
        // }).data;

        // const rankingMap = new Map();
        // dynastyRankings.forEach(([rank, name]) => {
        //     rankingMap.set(name, parseInt(rank, 10));
        // });


        // // const playersWithRanking = players.map(player => {
        // //     const fullName = player.info.fullName;
        // //     if (rankingMap.has(fullName)) {
        // //         player.info.dynastyRank = rankingMap.get(fullName);
        // //     }
        // //     return player;
        // // });
        // const playersWithRanking = uniquePlayers.map(player => {
        //     const fullName = player.info.fullName;
        //     if (rankingMap.has(fullName)) {
        //         player.info.dynastyRank = rankingMap.get(fullName);
        //     }
        //     return player;
        // });

        // Skip dynasty score calculation
        const playersWithRanking = uniquePlayers

        /* -----------------------------------------------------------
            3. Update the MongoDB database with the combined data.
        ----------------------------------------------------------- */
        const playbookDB = client.db('playbook');
        const statsCollection = playbookDB.collection('stats');

        // Update the database
        await statsCollection.updateOne(
            { league: 'nba' },
            {
                $set: {
                    stats: playersWithRanking,
                    lastUpdated: new Date()  // Add this line
                }
            },
            { upsert: true }
        );

        res.status(200).json(data);

    } catch (error) {
        console.error('Error:', error.message, error.stack);
        res.status(500).json({ error: 'An error occurred' });
    } finally {
        if (client.topology.isConnected()) {
            await client.close();
        }
    }
}
