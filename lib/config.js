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
            'PPG': { label: 'Fantasy Points Per Game', enabled: true, ptsEnabled: true, showInPointsView: true }, 
            // Standard
            'FG%': { label: 'Field Goal Percentage', enabled: true, ptsEnabled: false, showInPointsView: false },
            'FT%': { label: 'Free Throw Percentage', enabled: true, ptsEnabled: false, showInPointsView: false },
            '3PM': { label: '3-Pointers Made Per Game', enabled: true, ptsEnabled: false, showInPointsView: false },
            'PTS': { label: 'Points Per Game', enabled: true, ptsEnabled: true, showInPointsView: true },
            'REB': { label: 'Rebounds Per Game', enabled: true, ptsEnabled: true, showInPointsView: true },
            'AST': { label: 'Assists Per Game', enabled: true, ptsEnabled: true, showInPointsView: true },
            'STL': { label: 'Steals Per Game', enabled: true, ptsEnabled: true, showInPointsView: true },
            'BLK': { label: 'Blocks Per Game', enabled: true, ptsEnabled: true, showInPointsView: true },
            'TO': { label: 'Turnovers', enabled: true, lowerIsBetter: true, ptsEnabled: true, showInPointsView: true },
            // Alternative
            '3P%': { label: '3-Point Percentage', enabled: false, ptsEnabled: false, showInPointsView: false },
            'DRB': { label: 'Defensive Rebounds Per Game', enabled: false, ptsEnabled: false, showInPointsView: false },
            'ORB': { label: 'Offensive Rebounds Per Game', enabled: false, ptsEnabled: false, showInPointsView: false },
            'TS%': { label: 'True Shooting Percentage', enabled: false, ptsEnabled: false, showInPointsView: false },
            'ATO': { label: 'Assist to Turnover Ratio', enabled: false, ptsEnabled: false, showInPointsView: false },
            'FGM': { label: 'Field Goals Made Per Game', enabled: false, ptsEnabled: false, showInPointsView: false },
            'FTM': { label: 'Free Throws Made Per Game', enabled: false, ptsEnabled: false, showInPointsView: false },
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
            'REB_TOT': 'stats.rebounds.rebTotal',
            'AST_TOT': 'stats.offense.astTotal',
            'STL_TOT': 'stats.defense.stlTotal',
            'BLK_TOT': 'stats.defense.blkTotal',
            'TO_TOT': 'stats.defense.tovTotal',
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
            'PPG': { label: 'Fantasy Points Per Game', enabled: false, ptsEnabled: true, showInPointsView: true }, 
            // ---------------------
            //        Hitting
            // ---------------------
            // Standard 5x5 
            'R': { label: 'Runs', enabled: true, group: 'hitting', ptsEnabled: false, showInPointsView: false },
            'HR': { label: 'Home Runs', enabled: true, group: 'hitting', ptsEnabled: false, showInPointsView: false },
            'RBI': { label: 'Runs Batted In', enabled: true, group: 'hitting', ptsEnabled: true, showInPointsView: true },
            'SB': { label: 'Stolen Bases', enabled: true, group: 'hitting', ptsEnabled: true, showInPointsView: true },
            'AVG': { label: 'Batting Average', enabled: true, group: 'hitting', ptsEnabled: false, showInPointsView: false },
            // Alternative Hitting
            'H': { label: 'Hits', enabled: false, group: 'hitting', ptsEnabled: false, showInPointsView: false },
            '2B': { label: 'Doubles', enabled: false, group: 'hitting', ptsEnabled: false, showInPointsView: false },
            '3B': { label: 'Triples', enabled: false, group: 'hitting', ptsEnabled: false, showInPointsView: false },
            'OBP': { label: 'On-Base Percentage', enabled: false, group: 'hitting', ptsEnabled: false, showInPointsView: false },
            'SLG': { label: 'Slugging Percentage', enabled: false, group: 'hitting', ptsEnabled: false, showInPointsView: false },
            'OPS': { label: 'On-Base + Slugging', enabled: false, group: 'hitting', ptsEnabled: true, showInPointsView: true },
            'TB': { label: 'Total Bases', enabled: false, group: 'hitting', ptsEnabled: true, showInPointsView: true },
            // ---------------------
            //       Pitching
            // ---------------------
            // Standard 5x5
            'W': { label: 'Wins', enabled: true, group: 'pitching', ptsEnabled: false, showInPointsView: false },
            'K': { label: 'Strikeouts', enabled: true, group: 'pitching', ptsEnabled: true, showInPointsView: true },
            'SV': { label: 'Saves', enabled: true, group: 'pitching', ptsEnabled: false, showInPointsView: false },
            'ERA': { label: 'Earned Run Average', enabled: true, group: 'pitching', lowerIsBetter: true, ptsEnabled: true, showInPointsView: true },
            'WHIP': { label: 'Walks + Hits per IP', enabled: true, group: 'pitching', lowerIsBetter: true, ptsEnabled: true, showInPointsView: true },
            // Alternative Pitching
            'QS': { label: 'Quality Starts', enabled: false, group: 'pitching', ptsEnabled: false, showInPointsView: false },
            'SVH': { label: 'Saves + Holds', enabled: false, group: 'pitching', ptsEnabled: true, showInPointsView: true },
            'HLD': { label: 'Holds', enabled: false, group: 'pitching', ptsEnabled: false, showInPointsView: false },
            'K/BB': { label: 'Strikeout/Walk Ratio', enabled: false, group: 'pitching', ptsEnabled: false, showInPointsView: false },
            'K/9': { label: 'Strikeouts per 9 IP', enabled: false, group: 'pitching', ptsEnabled: false, showInPointsView: false },
            'IP': { label: 'Innings Pitched', enabled: false, group: 'pitching', ptsEnabled: false, showInPointsView: false },

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
                description: 'Fantasy Points Per Game (Standard/0 PPR) Sleeper Default Scoring',
                ptsEnabled: true, showInPointsView: true,
            },
            'PPG0.5ppr': {
                label: 'PPG (0.5 PPR)',
                enabled: true,
                description: 'Fantasy Points Per Game (Half PPR) Sleeper Default Scoring',
                ptsEnabled: true, showInPointsView: true
            },
            'PPG1ppr': {
                label: 'PPG (1 PPR)',
                enabled: true, // Default 1 PPR to enabled
                description: 'Fantasy Points Per Game (Full PPR) Sleeper Default Scoring',
                ptsEnabled: true, showInPointsView: true
            },
            'OPG': { 
                label: 'Opportunities Per Game', 
                enabled: true, 
                description: 'Shows how often a player is involved in the offense, whichdrives upside and floor.',
                ptsEnabled: true, showInPointsView: true
            },
            'OPE': { 
                label: 'Opportunity Efficiency', 
                enabled: true, 
                description: 'Measures how well a player converts their opportunities into points.',
                ptsEnabled: true, showInPointsView: true
            },
            'YD%': { 
                label: 'Yard Share %', 
                enabled: true, 
                description: "Measures a player\'s share of their team\'s total yardage.",
                ptsEnabled: true, showInPointsView: true
            },
            'PR%': { 
                label: 'Production Share %', 
                enabled: true, 
                description: "Captures a player\'s share of their team\'s successful downs.",
                ptsEnabled: true, showInPointsView: true
            },
            'TD%': { 
                label: 'Touchdown Rate', 
                enabled: true, 
                description: "Highlights a player\'s ability (or reliance) on scoring touchdowns for their fantasy points.",
                ptsEnabled: true, showInPointsView: true
            },
            'BP%': { 
                label: 'Big Play Rate', 
                enabled: true, 
                description: "Measures explosive play ability (20+ yard gains) relative to their opportunities.",
                ptsEnabled: true, showInPointsView: true
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
            teamId: 'player.currentTeam.id',
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
                needsContext: ['teamTotals'] // Indicate external data needed
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
