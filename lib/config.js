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

// --- Add Sport Configurations Here ---
export const SPORT_CONFIGS = {
    nba: { // Use lowercase keys for consistency
        label: 'NBA',
        positions: ['All', 'PG', 'SG', 'SF', 'PF', 'C', 'G', 'F'],
        categories: { 
            // enabled: true here means it will be in the default view
            // Standard
            'PTS': { label: 'Points Per Game', enabled: true },
            'REB': { label: 'Rebounds Per Game', enabled: true },
            'AST': { label: 'Assists Per Game', enabled: true },
            'STL': { label: 'Steals Per Game', enabled: true },
            'BLK': { label: 'Blocks Per Game', enabled: true },
            'FG%': { label: 'Field Goal Percentage', enabled: true },
            'FT%': { label: 'Free Throw Percentage', enabled: true },
            '3PM': { label: '3-Pointers Made Per Game', enabled: true },
            'TO': { label: 'Turnovers', enabled: true, lowerIsBetter: true },
            // Alternative
            'TS%': { label: 'True Shooting Percentage', enabled: false },
            '3P%': { label: '3-Point Percentage', enabled: false },
            'ATO': { label: 'Assist to Turnover Ratio', enabled: false },
            'DRB': { label: 'Defensive Rebounds Per Game', enabled: false },
            'ORB': { label: 'Offensive Rebounds Per Game', enabled: false },
            'FGM': { label: 'Field Goals Made Per Game', enabled: false },
            'FTM': { label: 'Free Throws Made Per Game', enabled: false },
            // 'DD': { label: 'Double-Doubles', enabled: false }, // TODO: Add this
            // 'TD': { label: 'Triple-Doubles', enabled: false }, // TODO: Add this
        },
        statPathMapping: { // CORRECTED NBA mapping based on user code
            // Standard
            'FG%': 'stats.fieldGoals.fgPct',   
            'FT%': 'stats.freeThrows.ftPct',       
            '3PM': 'stats.fieldGoals.fg3PtMadePerGame',
            'PTS': 'stats.offense.ptsPerGame',
            'REB': 'stats.rebounds.rebPerGame',
            'AST': 'stats.offense.astPerGame',
            'STL': 'stats.defense.stlPerGame',
            'BLK': 'stats.defense.blkPerGame',
            'TO': 'stats.defense.tovPerGame',
            // Altnerative
            'TS%': '',
            '3P%': 'stats.fieldGoals.fg3PtPct',
            'ATO': '',
            'DRB': 'stats.rebounds.defRebPerGame',
            'ORB': 'stats.rebounds.offRebPerGame',

            // Informational
            'FGM': 'stats.fieldGoals.fgMadePerGame',
            'FGA': 'stats.fieldGoals.fgAttPerGame',
            'FTM': 'stats.freeThrows.ftMadePerGame',
            'FTA': 'stats.freeThrows.ftAttPerGame',
            'MPG': 'stats.miscellaneous.minSecondsPerGame', // NOTE: Value is in seconds, needs conversion / 60
            'GP': 'stats.gamesPlayed',

            // TODO: Add paths for other NBA categories if needed (e.g., TS%, 3P%, ATO, DRB, ORB)
        },
        // ADDED: Mapping for player info fields
        infoPathMapping: {
            PlayerID: 'player.id', // Assumes player ID is here
            FirstName: 'player.firstName',
            LastName: 'player.lastName',
            Position: 'player.primaryPosition',
            TeamAbbreviation: 'player.currentTeam.abbreviation',
            TeamID: 'player.currentTeam.id', // Added team ID
            Age: 'player.age',
            OfficialImageSrc: 'player.officialImageSrc', // Added image source
            // Add other relevant info paths like height, weight, jerseyNumber etc.
            Height: 'player.height',
            Weight: 'player.weight',
            JerseyNumber: 'player.jerseyNumber'
        }
    },
    mlb: {
        label: 'MLB',
        positions: ['All', 'SP', 'RP', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT','INF'],
        categories: {
            // enabled: true here means it will be in the default view
            // Standard 5x5 Hitting
            'R': { label: 'Runs', enabled: true, group: 'hitting' },
            'HR': { label: 'Home Runs', enabled: true, group: 'hitting' },
            'RBI': { label: 'Runs Batted In', enabled: true, group: 'hitting' },
            'SB': { label: 'Stolen Bases', enabled: true, group: 'hitting' },
            'AVG': { label: 'Batting Average', enabled: true, group: 'hitting' },
            // Standard 5x5 Pitching
            'W': { label: 'Wins', enabled: true, group: 'pitching' },
            'K': { label: 'Strikeouts', enabled: true, group: 'pitching' },
            'SV': { label: 'Saves', enabled: true, group: 'pitching' },
            'ERA': { label: 'Earned Run Average', enabled: true, group: 'pitching', lowerIsBetter: true },
            'WHP': { label: 'Walks + Hits per IP', enabled: true, group: 'pitching', lowerIsBetter: true },
            // Other Hitting
            'H': { label: 'Hits', enabled: false, group: 'hitting' },
            '2B': { label: 'Doubles', enabled: false, group: 'hitting' },
            '3B': { label: 'Triples', enabled: false, group: 'hitting' },
            'OBP': { label: 'On-Base Percentage', enabled: false, group: 'hitting' },
            'SLG': { label: 'Slugging Percentage', enabled: false, group: 'hitting' },
            'OPS': { label: 'On-Base + Slugging', enabled: false, group: 'hitting' },
            // 'TB': { label: 'Total Bases', enabled: false, group: 'hitting' },
            // Other Pitching
            'SVH': { label: 'Saves + Holds', enabled: false, group: 'pitching' },
            'KBB': { label: 'Strikeout/Walk Ratio', enabled: false, group: 'pitching' },
            'K9': { label: 'Strikeouts per 9 IP', enabled: false, group: 'pitching' },
            'BB9': { label: 'Walks per 9 IP', enabled: false, group: 'pitching', lowerIsBetter: true },
            // 'QS': { label: 'Quality Starts', enabled: false, group: 'pitching' }, // TODO: Add this
            // 'HLD': { label: 'Holds', enabled: false, group: 'pitching' },
            // 'L': { label: 'Losses', enabled: false, group: 'pitching', lowerIsBetter: true },
            // 'IP': { label: 'Innings Pitched', enabled: false, group: 'pitching' },
        },
        statPathMapping: { // Updated MLB mapping to raw paths
            // Batting
            "R": "stats.batting.runs",
            "HR": "stats.batting.homeruns",
            "RBI": "stats.batting.runsBattedIn",
            "SB": "stats.batting.stolenBases",
            "AVG": "stats.batting.battingAvg",
            "H": "stats.batting.hits",
            "2B": "stats.batting.doubles",
            "3B": "stats.batting.triples",
            "OBP": "stats.batting.onBasePct",
            "SLG": "stats.batting.sluggingPct",
            "OPS": "stats.batting.onBasePlusSlugging",
            "GP_Bat": "stats.batting.gamesPlayed", // Example: Games Played Batting

            // Pitching
            "W": "stats.pitching.wins",
            "L": "stats.pitching.losses", // Added Loss mapping
            "K": "stats.pitching.pitcherStrikeouts",
            "SV": "stats.pitching.saves",
            "ERA": "stats.pitching.earnedRunAvg",
            "WHP": "stats.pitching.walksAndHitsPerInningPitched",
            "BB": "stats.pitching.pitcherWalks", // Walks for K/BB, BB/9
            "IP": "stats.pitching.inningsPitched", // Innings for K/9, BB/9
            "GP_Pitch": "stats.pitching.gamesPlayed", // Example: Games Played Pitching
             // TODO: Add path for 'HLD' (Holds) if available for SVH calculation
            // "HLD": "stats.pitching.holds", // Placeholder
        },
        // ADDED: Mapping for player info fields (assuming similar structure)
        infoPathMapping: {
            PlayerID: 'player.id', // Placeholder - Verify path
            FirstName: 'player.firstName', // Placeholder - Verify path
            LastName: 'player.lastName', // Placeholder - Verify path
            Position: 'player.primaryPosition', // Placeholder - Verify path
            TeamAbbreviation: 'player.currentTeam.abbreviation', // Placeholder - Verify path
            TeamID: 'player.currentTeam.id', // Placeholder - Verify path
            Age: 'player.age', // Placeholder - Verify path
            OfficialImageSrc: 'player.officialImageSrc' // Placeholder - Verify path
        }
    },
    nfl: {
        label: 'NFL',
        positions: ['All', 'QB', 'RB', 'WR', 'TE'],
        // NFL typically uses Points scoring, so categories might be less about selection
        // and more about displaying calculated values or settings.
        // We can keep the previous structure if needed for display/reference.
        categories: {
            // Example display stats - not typically selectable league categories
           'PPG': { 
                label: 'Fantasy Points Per Game', 
                enabled: true, 
                
                description: 'Standard calculation player averages per game based on standard scoring formulas for your league format.' 
            },
           'PPS': { 
                label: 'Fantasy Points Per Snap', 
                enabled: true, 
                
                description: 'Reveals how productive a player is relative to playing time — highlights efficiency over volume.' 
            },
            'OPG': { 
                label: 'Opportunities Per Game', 
                enabled: true, 
             
                description: 'Shows how often a player is involved in the offense, whichdrives upside and floor.' 
            },
            'OPE': { 
                label: 'Opportunity Efficiency', 
                enabled: true, 
                
                description: 'Measures how well a player converts their opportunities into points.' 
            },
            'YD%': { 
                label: 'Yard Share %', 
                enabled: true, 
                
                description: "Measures a player's share of their team's total yardage." 
            },
            'PR%': { 
                label: 'Production Share %', 
                enabled: true, 
                
                description: "Captures a player's share of their team's successful downs." 
            },
            'TD%': { 
                label: 'Touchdown Rate', 
                enabled: true, 
                
                description: "Highlights a player's ability (or reliance) on scoring touchdowns for their fantasy points." 
            },
            'BP%': { 
                label: 'Big Play Rate', 
                enabled: true, 
                
                description: "Measures explosive play ability (20+ yard gains) relative to their opportunities." 
            },
            'TO%': { 
                label: 'Turnover Rate', 
                enabled: true, 
                
                lowerIsBetter: true, 
                description: "Tracks turnover risk for evaluating consistency and trust." 
            },
            // ... (add others as needed for display purposes)
        },
        // Add relevant settings for Points leagues
        defaultPpr: '1ppr', // Example default
        defaultFlex: 'superflex', // Example default
        statPathMapping: { // Updated NFL mapping to RAW paths
            // These map to fields in the raw data structure
            // Passing
            'PassYds': 'stats.passing.passYards',
            'PassTD': 'stats.passing.passTD',
            'Int': 'stats.passing.passInt',
            'PassAtt': 'stats.passing.passAttempts', // Example
            'PassComp': 'stats.passing.passCompletions', // Example
            // Rushing
            'RushYds': 'stats.rushing.rushYards',
            'RushTD': 'stats.rushing.rushTD',
            'RushAtt': 'stats.rushing.rushAttempts', // Example
            // Receiving
            'Rec': 'stats.receiving.receptions',
            'RecYds': 'stats.receiving.recYards',
            'RecTD': 'stats.receiving.recTD',
            'Targets': 'stats.receiving.targets', // Example
            // Fumbles
            'FumLost': 'stats.fumbles.fumLost',
            'FumTotal': 'stats.fumbles.fumbles', // Example
            // General
            'GP': 'stats.gamesPlayed', // Example
            // TODO: Add other relevant raw paths as needed (e.g., return stats, defensive stats?)
        },
        // ADDED: Mapping for player info fields (assuming similar structure)
        infoPathMapping: {
            PlayerID: 'player.id', // Placeholder - Verify path
            FirstName: 'player.firstName', // Placeholder - Verify path
            LastName: 'player.lastName', // Placeholder - Verify path
            Position: 'player.primaryPosition', // Placeholder - Verify path
            TeamAbbreviation: 'player.currentTeam.abbreviation', // Placeholder - Verify path
            TeamID: 'player.currentTeam.id', // Placeholder - Verify path
            Age: 'player.age', // Placeholder - Verify path
            OfficialImageSrc: 'player.officialImageSrc' // Placeholder - Verify path
        }
    }
};

// DATABASE_CONFIG omitted based on feedback.
// Other configs like FUSE_CONFIG can be added later. 