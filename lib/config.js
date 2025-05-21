// lib/config.js

// List of sports currently supported by the application
export const SUPPORTED_SPORTS = ['nfl', 'nba', 'mlb'];

// Key used in the 'players' collection to store data from the primary sports data feed provider
// (e.g., MySportsFeeds, or potentially another provider later)
export const CORE_DATA_SOURCE_KEY = 'mySportsFeeds';

// List of fantasy platform keys used in the 'players' collection schema
// (Used for syncing specific platform IDs/names in later steps)
export const FANTASY_PLATFORMS = [
    'espn',
    'yahoo',
    'sleeper',
    'fantrax'
    // Add other fantasy platform keys here as needed
];

// +++ Configuration for manual player sync blocks +++
// Used in lib/tasks/syncPlayers.js to prevent specific incorrect "fuse matches".
export const PLAYER_SYNC_MANUAL_BLOCKS = [
  {
    sportScope: 'nba', // The sport this rule applies to (lowercase)
    sourcePlayerIdentity: { // Identifying the incoming player from MySportsFeeds
      firstNameLower: 'nikola', // Must be lowercase
      lastNameLower: 'jovic',   // Must be lowercase
    },
    // The MySportsFeeds ID of the player document in your 'players' collection
    // that you want to PREVENT the sourcePlayer from being matched/merged with.
    preventMatchWithTargetMsfId: '9196', // This is Nikola Jokic's MySportsFeeds ID
    // Optional: A descriptive name for the target player, for clearer logging.
    targetPlayerNameForLog: 'Nikola Jokic'
  },
  // Example of another rule (can be commented out or removed if not needed):
  // {
  //   sportScope: 'nfl',
  //   sourcePlayerIdentity: {
  //     firstNameLower: 'justin',
  //     lastNameLower: 'jefferson',
  //   },
  //   preventMatchWithTargetMsfId: 'SOME_OTHER_PLAYERS_MSF_ID',
  //   targetPlayerNameForLog: 'Some Other Player Name'
  // }
];

// Helper function for position mapping (can be defined here or imported)
const mapNbaPositionToGroup = (position) => {
    if (!position) return null;
    const upperPos = position.toUpperCase();
    if (['PG', 'SG'].includes(upperPos)) return 'G';
    if (['SF', 'PF'].includes(upperPos)) return 'F';
    if (upperPos === 'C') return 'C';
    return null; // Or handle other cases as needed
};

// --- Add Sport Configurations Here ---

// Categories enabled: true here means it will be in the default view, default choice for rankings etc.
export const SPORT_CONFIGS = {
    nba: { 
        label: 'NBA',
        positions: ['All', 'PG', 'SG', 'SF', 'PF', 'C', 'G', 'F'],
        categories: { 
            // ADDED: NBA PPG Category for Points Leagues
            'PPG': { 
                label: 'Fantasy Points Per Game', 
                enabled: false, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Total fantasy points scored per game',
                zscoreColorMin: -3.0,  // Reaches full red at -3.0 z-score
                zscoreColorMax: 3.0,   // Reaches full green at 3.0 z-score
            }, 
            // Standard
            'FG%': { 
                label: 'Field Goal Percentage', 
                enabled: true, 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Percentage of field goals made',
                zscoreColorMin: -1.5,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 1.5,   // Reaches full green at 1.5 z-score
                isPercentage: true
            },
            'FT%': { 
                label: 'Free Throw Percentage', 
                enabled: true, 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Percentage of free throws made',
                zscoreColorMin: -2,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 1.3,   // Reaches full green at 1.5 z-score
                isPercentage: true
            },
            '3PM': { 
                label: '3-Pointers Made Per Game', 
                enabled: true, 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Average number of 3-pointers made per game',
                zscoreColorMin: -1.8,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 1.8    // Reaches full green at 1.5 z-score
            },
            'PTS': { 
                label: 'Points Per Game', 
                enabled: true, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Average points scored per game',
                zscoreColorMin: -2.2,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 2.2    // Reaches full green at 1.5 z-score
            },
            'REB': { 
                label: 'Rebounds Per Game', 
                enabled: true, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Average rebounds per game',
                zscoreColorMin: -1.4,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 1.8    // Reaches full green at 1.5 z-score
            },
            'AST': { 
                label: 'Assists Per Game', 
                enabled: true, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Average assists per game',
                zscoreColorMin: -1.4,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 2.2    // Reaches full green at 1.5 z-score
            },
            'STL': { 
                label: 'Steals Per Game', 
                enabled: true, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Average steals per game',
                zscoreColorMin: -1.3,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 2    // Reaches full green at 1.5 z-score
            },
            'BLK': { 
                label: 'Blocks Per Game', 
                enabled: true, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Average blocks per game',
                zscoreColorMin: -1.3,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 2    // Reaches full green at 1.5 z-score
            },
            'TO': { 
                label: 'Turnovers', 
                enabled: true, 
                lowerIsBetter: true, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Average turnovers per game',
                zscoreColorMin: -2,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 0.7   // Reaches full green at 1.5 z-score
            },
            // Alternative
            '3P%': { label: '3-Point Percentage', enabled: false, ptsEnabled: false, showInPointsView: false, tooltip: 'Percentage of 3-pointers made' },
            'DRB': { label: 'Defensive Rebounds Per Game', enabled: false, ptsEnabled: false, showInPointsView: false, tooltip: 'Average defensive rebounds per game' },
            'ORB': { label: 'Offensive Rebounds Per Game', enabled: false, ptsEnabled: false, showInPointsView: false, tooltip: 'Average offensive rebounds per game' },
            'TS%': { label: 'True Shooting Percentage', enabled: false, ptsEnabled: false, showInPointsView: false, tooltip: 'Measures shooting efficiency, accounting for 2-pointers, 3-pointers, and free throws' },
            'ATO': { label: 'Assist to Turnover Ratio', enabled: false, ptsEnabled: false, showInPointsView: false, tooltip: 'Ratio of assists to turnovers' },
            'FGM': { label: 'Field Goals Made Per Game', enabled: false, ptsEnabled: false, showInPointsView: false, tooltip: 'Average field goals made per game' },
            'FTM': { label: 'Free Throws Made Per Game', enabled: false, ptsEnabled: false, showInPointsView: false, tooltip: 'Average free throws made per game' },
            // 'DD': { label: 'Double-Doubles', enabled: false }, // TODO: Add this
            // 'TD': { label: 'Triple-Doubles', enabled: false }, // TODO: Add this
        },
        statPathMapping: {
            // Standard Categories
            'FG%': 'stats.fieldGoals.fgPct',   
            'FT%': 'stats.freeThrows.ftPct',       
            '3PM': 'stats.fieldGoals.fg3PtMadePerGame',
            'PTS': 'stats.offense.ptsPerGame',
            'REB': 'stats.rebounds.rebPerGame',
            'AST': 'stats.offense.astPerGame',
            'STL': 'stats.defense.stlPerGame',
            'BLK': 'stats.defense.blkPerGame',
            'TO': 'stats.defense.tovPerGame',
            // Alternative Categories
            '3P%': 'stats.fieldGoals.fg3PtPct',
            'DRB': 'stats.rebounds.defRebPerGame',
            'ORB': 'stats.rebounds.offRebPerGame',
            'TS%': '', // Find in derivedStatDefinitions
            'ATO': '', // Find in derivedStatDefinitions
            'DD': '', // Find in derivedStatDefinitions
            'TD': '', // Find in derivedStatDefinitions

            // Informational / For Calculations
            'GP': 'stats.gamesPlayed',
            'MPG': '', // Find in derivedStatDefinitions
            'FGM': 'stats.fieldGoals.fgMadePerGame', // Potential Category
            'FGA': 'stats.fieldGoals.fgAttPerGame', 
            'FTM': 'stats.freeThrows.ftMadePerGame', // Potential Category
            'FTA': 'stats.freeThrows.ftAttPerGame', 

            // ADDED: Path for total PTS needed for TS%
            'PTS_TOT': 'stats.offense.pts',
            // ADDED: Path for total FGA needed for TS%
            'FGA_TOT': 'stats.fieldGoals.fgAtt',
             // ADDED: Path for total FTA needed for TS%
            'FTA_TOT': 'stats.freeThrows.ftAtt',
            // ADDED: Path for total Minutes needed for MPG
            'MIN_TOT': 'stats.miscellaneous.minSeconds',

            // ADDED: Paths for NBA PPG Calculation (Totals)
            'REB_TOT': 'stats.rebounds.reb',
            'AST_TOT': 'stats.offense.ast',
            'STL_TOT': 'stats.defense.stl',
            'BLK_TOT': 'stats.defense.blk',
            'TO_TOT': 'stats.defense.tov',
            // ADDED: Path for NBA PPG derived stat
            'PPG': '', // Indicates derived
        },
        infoPathMapping: {
            playerId: 'player.id',
            firstName: 'player.firstName',
            lastName: 'player.lastName',
            fullName: '', // Find in derivedStatDefinitions
            primaryPosition: 'player.primaryPosition',
            teamAbbreviation: 'player.currentTeam.abbreviation',
            teamId: 'team.id',
            age: 'player.age',
            preciseAge: '', // Find in derivedStatDefinitions
            officialImageSrc: 'player.officialImageSrc',
            height: 'player.height',
            weight: 'player.weight',
            currentInjury: 'player.currentInjury',
            jerseyNumber: 'player.jerseyNumber',
            currentRosterStatus: 'player.currentRosterStatus',
            // ADDED: Path for birthDate needed for preciseAge
            birthDate: 'player.birthDate',
        },
        // REFACTORED: Derived Stat Definitions for NBA
        derivedStatDefinitions: {
            'TS%': {
                label: 'True Shooting Percentage',
                requiredStats: ['PTS_TOT', 'FGA_TOT', 'FTA_TOT'],
                calculationKey: 'calculateNbaTsPercentage' // Reference implementation
            },
            'ATO': {
                label: 'Assist/Turnover Ratio',
                requiredStats: ['AST', 'TO'],
                calculationKey: 'calculateNbaAtoRatio' // Reference implementation
            },
            'MPG': {
                 label: 'Minutes Per Game',
                 requiredStats: ['MIN_TOT', 'GP'],
                 calculationKey: 'calculateNbaMpg' // Reference implementation
            },
             'fullName': {
                label: 'Full Name',
                requiredInfo: ['firstName', 'lastName'], // Use infoPathMapping keys
                calculationKey: 'calculatePlayerFullName' // Reference implementation
            },
            'preciseAge': {
                label: 'Precise Age',
                requiredInfo: ['birthDate'],
                calculationKey: 'calculatePlayerPreciseAge' // Reference implementation
            },
            // ADDED: Derived stat definition for NBA PPG
            'PPG': {
                label: 'Fantasy Points Per Game',
                requiredStats: ['GP', 'PTS_TOT', 'REB_TOT', 'AST_TOT', 'STL_TOT', 'BLK_TOT', 'TO_TOT'],
                calculationKey: 'calculateNbaPpg',
                format: 'float1',
                category: 'Fantasy', // Optional: for grouping/display
                positive: true,
                higherIsBetter: true,
            }
            // TODO: Add DD, TD definitions if needed (e.g., requiredStats: [...], calculationKey: 'calculateNbaDoubleDoubles')
        },
        comparisonPools: {
            // Category leagues: Compare against Top 180 overall, sorted by Redraft ECR
            categories: {
                type: 'overall',
                topN: 180,
                sortBy: 'redraftEcrRank' // Specify sorting field
            },
            // Points leagues: Compare within position groups, sorted by Redraft ECR
            points: {
                type: 'positional',
                groups: {
                    'G': { topN: 60, sortBy: 'redraftEcrRank' }, // TODO: Confirm Top N for G/F/C in points? Using placeholder 60/60/30
                    'F': { topN: 60, sortBy: 'redraftEcrRank' },
                    'C': { topN: 30, sortBy: 'redraftEcrRank' }
                },
                // Function to map player's primaryPosition to a group key ('G', 'F', 'C')
                positionGrouper: mapNbaPositionToGroup
            }
        }
    },
    mlb: {
        label: 'MLB',
        positions: ['All', 'SP', 'RP', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT','INF', 'CI', 'MI'],
        categories: {
            // ADDED: MLB PPG Category for Points Leagues
            'PPG': { 
                label: 'Fantasy Points Per Game', 
                enabled: false, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Total fantasy points scored per game',
                zscoreColorMin: -2.0,  // Reaches full red at -3.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 3.0 z-score
            }, 
            // ---------------------
            //        Hitting
            // ---------------------
            // Standard 5x5 
            'R': { 
                label: 'Runs', 
                enabled: true, 
                group: 'hitting', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total runs scored',
                zscoreColorMin: -2.0,  // Reaches full red at -3.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 3.0 z-score
            },
            'HR': { 
                label: 'Home Runs', 
                enabled: true, 
                group: 'hitting', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total home runs hit',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'RBI': { 
                label: 'Runs Batted In', 
                enabled: true, 
                group: 'hitting', 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Total runs batted in',
                zscoreColorMin: -2.0,  // Reaches full red at -3.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 3.0 z-score
            },
            'SB': { 
                label: 'Stolen Bases', 
                enabled: true, 
                group: 'hitting', 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Total stolen bases',
                zscoreColorMin: -2.0,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.5 z-score
            },
            'AVG': { 
                label: 'Batting Average', 
                enabled: true, 
                group: 'hitting', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Hits divided by at-bats',
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
                isPercentage: true,
                statDisplay: {
                    decimals: 3,
                    trimTrailingZeros: false, // So .400 doesn't become .4
                    showLeadingZero: false   // So 0.432 becomes .432
                }
            },
            // Alternative Hitting
            'H': { 
                label: 'Hits', 
                enabled: false, 
                group: 'hitting', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total hits',
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
            },
            '2B': { 
                label: 'Doubles', 
                enabled: false, 
                group: 'hitting', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total doubles hit',
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
            },
            '3B': { 
                label: 'Triples', 
                enabled: false, 
                group: 'hitting', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total triples hit',
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
            },
            'OBP': { 
                label: 'On-Base Percentage', 
                enabled: false, 
                group: 'hitting', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Times on base divided by plate appearances',
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
                isPercentage: true,
                statDisplay: {
                    decimals: 3,
                    trimTrailingZeros: false, // So .400 doesn't become .4
                    showLeadingZero: false   // So 0.432 becomes .432
                }
            },
            'SLG': { 
                label: 'Slugging Percentage', 
                enabled: false, 
                group: 'hitting', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total bases divided by at-bats',
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
                isPercentage: true,
                statDisplay: {
                    decimals: 3,
                    trimTrailingZeros: false, // So .400 doesn't become .4
                    showLeadingZero: false   // So 0.432 becomes .432
                }
            },
            'OPS': { 
                label: 'On-Base + Slugging', 
                enabled: false, 
                group: 'hitting', 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'On-base percentage plus slugging percentage',
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
                isPercentage: true,
                statDisplay: {
                    decimals: 3,
                    trimTrailingZeros: false, // So .400 doesn't become .4
                    showLeadingZero: false   // So 0.432 becomes .432
                }
            },
            'TB': { 
                label: 'Total Bases', 
                enabled: false, 
                group: 'hitting', 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Total bases from hits',
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
            },
            // ---------------------
            //       Pitching
            // ---------------------
            // Standard 5x5
            'W': { 
                label: 'Wins', 
                enabled: true, 
                group: 'pitching', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total wins',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'K': { 
                label: 'Strikeouts', 
                enabled: true, 
                group: 'pitching', 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Total strikeouts',
                zscoreColorMin: -2.0,  // Reaches full red at -2.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 2.0 z-score
            },
            'SV': { 
                label: 'Saves', 
                enabled: true, 
                group: 'pitching', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total saves',
                zscoreColorMin: -2.0,  // Reaches full red at -1.5 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.5 z-score
            },
            'ERA': { 
                label: 'Earned Run Average', 
                enabled: true, 
                group: 'pitching', 
                lowerIsBetter: true, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Earned runs allowed per 9 innings',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'WHIP': { 
                label: 'Walks + Hits per IP', 
                enabled: true, 
                group: 'pitching', 
                lowerIsBetter: true, 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Walks and hits allowed per inning pitched',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            // Alternative Pitching
            'QS': { 
                label: 'Quality Starts', 
                enabled: false, 
                group: 'pitching', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Starts with 6+ IP and 3 or fewer earned runs',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'SVH': { 
                label: 'Saves + Holds', 
                enabled: false, 
                group: 'pitching', 
                ptsEnabled: true, 
                showInPointsView: true, 
                tooltip: 'Total saves plus holds',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'HLD': { 
                label: 'Holds', 
                enabled: false, 
                group: 'pitching', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total holds',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'K/BB': { 
                label: 'Strikeout/Walk Ratio', 
                enabled: false, 
                group: 'pitching', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Strikeouts divided by walks',
                zscoreColorMin: -2.0,  // Reaches full red at -0.5 z-score
                zscoreColorMax: 2.0    // Reaches full green at 0.5 z-score
            },
            'K/9': { 
                label: 'Strikeouts per 9 IP', 
                enabled: false, 
                group: 'pitching', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Strikeouts per 9 innings pitched',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'IP': { 
                label: 'Innings Pitched', 
                enabled: false, 
                group: 'pitching', 
                ptsEnabled: false, 
                showInPointsView: false, 
                tooltip: 'Total innings pitched',
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
        },
        statPathMapping: { 
            // ADDED: Path for MLB PPG derived stat
            'PPG': '', // Indicates derived
            // Standard 5x5 Hitting
            "R": "stats.batting.runs",
            "HR": "stats.batting.homeruns",
            "RBI": "stats.batting.runsBattedIn",
            "SB": "stats.batting.stolenBases",
            "AVG": "stats.batting.battingAvg",
            // Alternative Hitting
            "H": "stats.batting.hits",
            "2B": "stats.batting.secondBaseHits",
            "3B": "stats.batting.thirdBaseHits",
            "OBP": "stats.batting.batterOnBasePct",
            "SLG": "stats.batting.batterSluggingPct",
            "OPS": "stats.batting.batterOnBasePlusSluggingPct",
            "TB": "stats.batting.totalBases",

            // Standard 5x5 Pitching
            "W": "stats.pitching.wins",
            "K": "stats.pitching.pitcherStrikeouts",
            "SV": "stats.pitching.saves",
            "ERA": "stats.pitching.earnedRunAvg",
            "WHIP": "stats.pitching.walksAndHitsPerInningPitched",
            // Alternative Pitching
            "QS": "stats.pitching.qualityStarts",
            "SVH": "", // Find in derivedStatDefinitions
            "HLD": "stats.pitching.holds",
            "K/BB": "stats.pitching.strikeoutsToWalksRatio",
            "K/9": "stats.pitching.strikeoutsPer9Innings",
            "IP": "stats.pitching.inningsPitched",
            'L': 'stats.pitching.losses',
            'BB': 'stats.pitching.walksIssued',
            
            // Universal / Informational
            "GP": "stats.gamesPlayed",
            
            // ADDED/UPDATED Paths for MLB PPG Calculation
            'BB_BATTING': 'stats.batting.batterWalks',
            'K_BATTING': 'stats.batting.batterStrikeouts',
            'H_ALLOWED': 'stats.pitching.hitsAllowed',
            'ER_ALLOWED': 'stats.pitching.earnedRunsAllowed',
            // For PPG calculation, we'll use the general L and BB keys that map to pitcher losses and walks
            
        },
        infoPathMapping: {
            playerId: 'player.id',
            firstName: 'player.firstName',
            lastName: 'player.lastName',
            fullName: '', // Find in derivedStatDefinitions
            primaryPosition: 'player.primaryPosition',
            teamAbbreviation: 'player.currentTeam.abbreviation',
            teamId: 'player.currentTeam.id',
            age: 'player.age',
            preciseAge: '', // Find in derivedStatDefinitions
            officialImageSrc: 'player.officialImageSrc',
            height: 'player.height',
            weight: 'player.weight',
            currentInjury: 'player.currentInjury',
            jerseyNumber: 'player.jerseyNumber',
            currentRosterStatus: 'player.currentRosterStatus',
            // ADDED: Path for birthDate needed for preciseAge
            birthDate: 'player.birthDate',
        },
        // REFACTORED: Derived Stat Definitions for MLB
        derivedStatDefinitions: {
            'SVH': {
                label: 'Saves + Holds',
                requiredStats: ['SV', 'HLD'],
                calculationKey: 'calculateMlbSvh' // Reference implementation
            },
             'fullName': {
                label: 'Full Name',
                requiredInfo: ['firstName', 'lastName'],
                calculationKey: 'calculatePlayerFullName' // Reference implementation
            },
            'preciseAge': {
                label: 'Precise Age',
                requiredInfo: ['birthDate'],
                calculationKey: 'calculatePlayerPreciseAge' // Reference implementation
            },
            // ADDED: Derived stat definition for MLB PPG
            'PPG': {
                label: 'Fantasy Points Per Game',
                requiredStats: [
                    'GP',
                    // Hitting
                    'R', 'TB', 'RBI', 'BB_BATTING', 'K_BATTING', 'SB',
                    // Pitching - Using general keys 'K', 'L', 'BB' for pitcher stats
                    'IP', 'H_ALLOWED', 'ER_ALLOWED', 'HLD', 'BB', 'K', 'W', 'L', 'SV'
                ],
                calculationKey: 'calculateMlbPpg',
                format: 'float1',
                category: 'Fantasy', // Optional: for grouping/display
                positive: true,
                higherIsBetter: true,
            }
             // TODO: Could redefine AVG, OBP, SLG, OPS, ERA, WHIP here if calculation needed
        },
        comparisonPools: {
            // Both formats compare Hitters vs Hitters, Pitchers vs Pitchers
            // Sorted by Redraft ECR within those groups
            categories: {
                type: 'split', // Split into Hitter/Pitcher
                groups: {
                    'Hitter': { topN: 200, sortBy: 'redraftEcrRank' },
                    'Pitcher': { topN: 100, sortBy: 'redraftEcrRank' }
                },
                // Function to determine if player is Hitter or Pitcher
                positionGrouper: (position) => {
                    if (!position) return null;
                    // TODO: Define precise Hitter/Pitcher logic based on MLB positions
                    // Example: Assume anything starting with 'P' or 'SP'/'RP' is Pitcher
                    const upperPos = position.toUpperCase();
                    if (upperPos.startsWith('P') || ['SP', 'RP'].includes(upperPos)) return 'Pitcher';
                    // Assume others are Hitters (C, 1B, 2B, SS, 3B, OF, DH, UT)
                    return 'Hitter';
                }
            },
            points: { // Same rules for points
                 type: 'split',
                 groups: {
                     'Hitter': { topN: 200, sortBy: 'redraftEcrRank' },
                     'Pitcher': { topN: 100, sortBy: 'redraftEcrRank' }
                 },
                 positionGrouper: (position) => { /* Same grouper as category */
                    if (!position) return null;
                    const upperPos = position.toUpperCase();
                    if (upperPos.startsWith('P') || ['SP', 'RP'].includes(upperPos)) return 'Pitcher';
                    return 'Hitter';
                }
            }
        }
    },
    nfl: {
        label: 'NFL',
        positions: ['All', 'QB', 'RB', 'WR', 'TE'],
        defaultPpr: '1ppr', // Example default
        defaultFlex: 'superflex', // Example default
        // NFL typically uses Points scoring, so categories might be less about selection
        // and more about displaying calculated values or settings.
        // We can keep the previous structure if needed for display/reference.
        categories: {
            // Example display stats - not typically selectable league categories
                        // ADDED PPG Variant Categories
            'PPG0ppr': {
                label: 'PPG (0 PPR)', 
                enabled: false, // Default to false, users can enable if needed
                tooltip: 'Fantasy Points Per Game Sleeper Default Scoring',
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'PPG0.5ppr': {
                label: 'PPG (0.5 PPR)',
                enabled: true,
                tooltip: 'Fantasy Points Per Game Sleeper Default Scoring',
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'PPG1ppr': {
                label: 'PPG (1 PPR)',
                enabled: true,
                tooltip: 'Fantasy Points Per Game Sleeper Default Scoring',
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'OPG': { 
                label: 'Opportunities Per Game', 
                enabled: true, 
                tooltip: '(Pass Att + Rush Att + Targets) / Games Played. Higher values indicate more consistent volume and fantasy floor.',
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -1.0 z-score
                zscoreColorMax: 2.0    // Reaches full green at 1.0 z-score
            },
            'OPE': { 
                label: 'Opportunity Efficiency', 
                enabled: true, 
                tooltip: 'Fantasy Points / (Pass Att + Rush Att + Targets). Higher values indicate better efficiency with each opportunity.',
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0    // Reaches full green at 0.8 z-score
            },
            'YD%': { 
                label: 'Yard Share', 
                enabled: true, 
                tooltip: "Total Yards / Team Totals. Higher values indicate more central role in team's yardage production.",
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
                isPercentage: true
            },
            'PR%': { 
                label: 'Production Share', 
                enabled: true, 
                tooltip: "(Pass Comp + Rush Att + Receptions) / Team Totals. Higher share indicates more central role in offense by volume.",
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
                isPercentage: true
            },
            'TD%': { 
                label: 'Touchdown Rate', 
                enabled: true, 
                tooltip: "Total TDs / (Pass Att + Rush Att + Targets). Higher values could indicate a higher consistent floor or a reliance on TD scoring.",
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
                isPercentage: true
            },
            'BP%': { 
                label: 'Big Play Rate', 
                enabled: true, 
                tooltip: "20+ yard plays / (Pass Att + Rush Att + Targets). Higher values indicate tendency for explosive plays whether by their ability or their team's offensive tendencies.",
                ptsEnabled: true, 
                showInPointsView: true,
                zscoreColorMin: -2.0,  // Reaches full red at -0.8 z-score
                zscoreColorMax: 2.0,   // Reaches full green at 0.8 z-score
                isPercentage: true
            },
            // ... (add others as needed for display purposes)
        },
        // Add relevant settings for Points leagues
        statPathMapping: { // Updated NFL mapping to RAW paths

            'PPG0ppr': '', // Find in derivedStatDefinitions
            'PPS0.5ppr': '', // Find in derivedStatDefinitions
            'PPG1ppr': '', // Find in derivedStatDefinitions
            'OPG': '', // Find in derivedStatDefinitions
            'OPE': '', // Find in derivedStatDefinitions
            'YD%': '', // Find in derivedStatDefinitions
            'PR%': '', // Find in derivedStatDefinitions
            'TD%': '', // Find in derivedStatDefinitions
            'BP%': '', // Find in derivedStatDefinitions

            // For Calculations
            // Passing
            'passYds': 'stats.passing.passYards',
            'passTD': 'stats.passing.passTD',
            'interceptions': 'stats.passing.passInt',
            'passAtt': 'stats.passing.passAttempts', 
            'passComp': 'stats.passing.passCompletions',
            'pass20Plus': 'stats.passing.pass20Plus',
            'pass40Plus': 'stats.passing.pass40Plus',
            // Rushing
            'rushYds': 'stats.rushing.rushYards',
            'rushTD': 'stats.rushing.rushTD',
            'rushAtt': 'stats.rushing.rushAttempts',
            'rush20Plus': 'stats.rushing.rush20Plus',
            'rush40Plus': 'stats.rushing.rush40Plus',
            // Receiving
            'rec': 'stats.receiving.receptions',
            'recYds': 'stats.receiving.recYards',
            'recTD': 'stats.receiving.recTD',
            'targets': 'stats.receiving.targets', 
            'rec20Plus': 'stats.receiving.rec20Plus',
            'rec40Plus': 'stats.receiving.rec40Plus',
            // Fumbles
            'fumLost': 'stats.fumbles.fumLost',
            'fumTotal': 'stats.fumbles.fumbles', 
            // General
            'GP': 'stats.gamesPlayed',
            'offenseSnaps': 'stats.other.offenseSnaps',

            // ADDED: 2-Point Conversion Stats Paths
            'twoPtPassMade': 'stats.twoPointAttempts.twoPtPassMade',
            'twoPtRushMade': 'stats.twoPointAttempts.twoPtRushMade',
            'twoPtPassRec': 'stats.twoPointAttempts.twoPtPassRec',

        },
        
        infoPathMapping: {
            playerId: 'player.id',
            firstName: 'player.firstName',
            lastName: 'player.lastName',
            fullName: '', // Find in derivedStatDefinitions
            primaryPosition: 'player.primaryPosition',
            teamAbbreviation: 'player.currentTeam.abbreviation',
            teamId: 'team.id',
            age: 'player.age',
            preciseAge: '', // Find in derivedStatDefinitions
            officialImageSrc: 'player.officialImageSrc',
            height: 'player.height',
            weight: 'player.weight',
            currentInjury: 'player.currentInjury',
            jerseyNumber: 'player.jerseyNumber',
            currentRosterStatus: 'player.currentRosterStatus',
            birthDate: 'player.birthDate',
        },
        // REFACTORED: Derived Stat Definitions for NFL
        derivedStatDefinitions: {
            // --- Fantasy Points ---
            'PPG0ppr': {
                label: 'Fantasy Points Per Game (0 PPR)',
                requiredStats: ['GP', 'passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'recYds', 'recTD', 'fumLost', 'twoPtPassMade', 'twoPtRushMade', 'twoPtPassRec'],
                calculationKey: 'calculateNflPpg0ppr',
                format: 'float1',
                category: 'Fantasy',
                positive: true,
                higherIsBetter: true,
            },
            'PPG0.5ppr': {
                label: 'Fantasy Points Per Game (0.5 PPR)',
                 requiredStats: ['GP', 'passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'rec', 'recYds', 'recTD', 'fumLost', 'twoPtPassMade', 'twoPtRushMade', 'twoPtPassRec'],
                 calculationKey: 'calculateNflPpgHalfPpr',
                 format: 'float1',
                 category: 'Fantasy',
                 positive: true,
                 higherIsBetter: true,
            },
            'PPG1ppr': {
                label: 'Fantasy Points Per Game (1 PPR)',
                requiredStats: ['GP', 'passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'rec', 'recYds', 'recTD', 'fumLost', 'twoPtPassMade', 'twoPtRushMade', 'twoPtPassRec'],
                calculationKey: 'calculateNflPpgFullPpr',
                format: 'float1',
                category: 'Fantasy',
                positive: true,
                higherIsBetter: true,
            },
            // --- Opportunity & Efficiency ---
            'OPG': {
                 label: 'Opportunities Per Game',
                 requiredStats: ['GP', 'passAtt', 'rushAtt', 'targets'],
                 calculationKey: 'calculateNflOpg' // Reference implementation
            },
            'OPE': {
                 label: 'Opportunity Efficiency (FP/Opportunity)',
                 // Needs passAtt, rushAtt, targets, and all stats for PPG1 (assuming 1 PPR & incl. fumLost)
                 requiredStats: ['GP', 'passAtt', 'rushAtt', 'targets', 'passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'rec', 'recYds', 'recTD', 'fumLost', 'twoPtPassMade', 'twoPtRushMade', 'twoPtPassRec'],
                 calculationKey: 'calculateNflOpe',
                 format: 'float2',
                 category: 'Efficiency',
                 positive: true,
                 higherIsBetter: true,
            },
             // --- Rates & Shares ---
            'YD%': { // Ensure this is YD%
                label: 'Yard Share',
                requiredStats: ['passYds', 'rushYds', 'recYds'],
                // NOTE: Implementation needs team totals passed contextually
                calculationKey: 'calculateNflYardShare',
                needsContext: ['teamTotals'], // Indicate external data needed
                format: 'float1' // ADDED for consistency
            },
            'PR%': { // Ensure this is PR% (was PS%)
                label: 'Production Share ',
                requiredStats: ['passComp', 'rushAtt', 'rec'],
                // NOTE: Implementation needs team totals passed contextually
                calculationKey: 'calculateNflProductionShare',
                needsContext: ['teamTotals']
            },
            'TD%': {
                label: 'Touchdown Rate (per Opportunity)',
                requiredStats: ['passTD', 'rushTD', 'recTD', 'passAtt', 'rushAtt', 'targets'],
                calculationKey: 'calculateNflTdRate' // Reference implementation
            },
            'BP%': {
                label: 'Big Play Rate (per Opportunity)',
                // REMOVED 40+ plus stats, UPDATED denominator stats
                requiredStats: ['pass20Plus', 'rush20Plus', 'rec20Plus', 'passAtt', 'rushAtt', 'rec'],
                calculationKey: 'calculateNflBigPlayRate' // Reference implementation
            },
            // --- Info ---
            'fullName': {
                label: 'Full Name',
                requiredInfo: ['firstName', 'lastName'],
                calculationKey: 'calculatePlayerFullName' // Reference implementation
            },
            'preciseAge': {
                label: 'Precise Age',
                requiredInfo: ['birthDate'],
                calculationKey: 'calculatePlayerPreciseAge' // Reference implementation
            }
        },
        comparisonPools: {
            // NFL uses positional comparison based on Redraft ECR for Z-Score baselines,
            // effectively treating all rankings as 'points' for this calculation.
            points: { // Define rules under 'points' key
                type: 'positional',
                groups: {
                    'QB': { topN: 36, sortBy: 'redraftEcrRank' },
                    'RB': { topN: 60, sortBy: 'redraftEcrRank' },
                    'WR': { topN: 72, sortBy: 'redraftEcrRank' },
                    'TE': { topN: 24, sortBy: 'redraftEcrRank' }
                },
                positionGrouper: (position) => position?.toUpperCase() || null
            }
        }
    }
};

// Z-Score Color Configuration
export const ZSCORE_COLOR_CONFIG = {
    // Base colors (RGB arrays)
    colors: {
        positive: [89, 205, 144],    // #59cd90 - Green
        negative: [238, 99, 82],     // #ee6352 - Red
        neutral: [243, 244, 246],    // Tailwind gray-100
        fallback: [243, 244, 246],   // Same as neutral for consistency
    },
    
    // Z-score range for color saturation
    range: {
        min: -1.5,  // Minimum z-score for color saturation
        max: 1.5,   // Maximum z-score for color saturation
    },
    
    // Color interpolation settings
    interpolation: {
        minFactor: 0.08,  // Minimum color intensity (0-1)
        maxFactor: 1.0,   // Maximum color intensity (0-1)
    },
    
    // Text color settings
    text: {
        lightThreshold: 0.5,  // Luminance threshold for light/dark text
        lightColor: '#FFFFFF',
        darkColor: '#000000',
    }
};
