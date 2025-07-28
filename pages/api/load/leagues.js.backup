import { MongoClient } from 'mongodb';
import { calculateScore } from '../../../utilities/calculateScore'; // adjust the path accordingly

const mongoUri = process.env.MONGODB_URI;

async function connectToDatabase() {
  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db('playbook');
}

/* -----------------------------------------------------------
   Method to fetch player stats from MongoDB collection
----------------------------------------------------------- */
async function fetchPlayerStats(db, playerNames) {
    const allPlayerStats = [];

    for (let playerName of playerNames) {
        // Query the 'stats' collection to fetch player stats
        const playerStat = await db.collection('stats')
            .findOne({
                league: 'nba',
                'stats.info.fullName': playerName
            }, {
                projection: { 'stats.$': 1 }
            });
        if (playerStat && playerStat.stats && playerStat.stats.length > 0) {
            allPlayerStats.push(playerStat.stats[0]);
        }
    }

    return allPlayerStats;
}

//if no stats are found for a player, use defaults
function getDefaultPlayerStats(playerName) {
    return {
        info: {
            id: null,
            firstName: "Unknown",
            lastName: "Player",
            fullName: playerName,
            age: null,
            height: "N/A",
            weight: null,
            team: "N/A",
            teamId: null,
            img: null,
            pos: "N/A",
            injStatus: null
        },
        stats: {
            gamesPlayed: 0,
            fgPct: 0,
            ptsPerGame: 0,
            fgaPerGame: 0,
            fgmPerGame: 0,
            ftPct: 0,
            rebPerGame: 0,
            astPerGame: 0,
            ftaPerGame: 0,
            stlPerGame: 0,
            ftmPerGame: 0,
            blkPerGame: 0,
            fg2PtPct: 0,
            fg3PtMadePerGame: 0,
            toPerGame: 0,
            threePtPct: 0,
            offRebPerGame: 0,
            defRebPerGame: 0,
            efgPct: 0,
            tsPct: 0
        }
    };
}

/* ---------------------------------------------------------------------------
    CALL DB FOR USER'S TEAMS AND ENRICH WITH CACHED STATS DATA FOR DISPLAY
---------------------------------------------------------------------------- */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }
  const { userAuthId, sport } = req.query;
  if (!userAuthId) {
    return res.status(400).json({ error: 'userAuthId is required.' });
  }

  try {
    const db = await connectToDatabase();
    const leagues = await db.collection("leagues").find({ userAuthId: userAuthId, leagueSport: sport }).toArray();
    if (!leagues.length) {
      return res.status(404).json({ error: 'No leagues found for the given userAuthId and sport.' });
    }
    /* -----------------------------------------------------------
       Gather data for each imported league for current user.
    ----------------------------------------------------------- */
    for (const league of leagues) {
        const myTeam = league.teams.find(team => team.teamId === league.userTeamId);
        if (myTeam) {
            const playerNames = myTeam.players.map(player => player.name);
            const playerStats = await fetchPlayerStats(db, playerNames);
    
            for (const player of myTeam.players) {
                const specificPlayerStats = playerStats.find(s => s.info.fullName === player.name);
                // info object, stats object, and calculated score for each player
                if (specificPlayerStats) {
                    player.info = specificPlayerStats.info;
                    player.stats = specificPlayerStats.stats;
                    player.playbookScore = calculateScore(player);
                  } else {
                    const defaultStats = getDefaultPlayerStats(player.name);
                    player.info = defaultStats.info;
                    player.stats = defaultStats.stats;
                    player.playbookScore = 0;
                }
            }
        }
      }
  
    return res.status(200).json(leagues);

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: 'Failed to fetch leagues and player stats.' });
  }
}
