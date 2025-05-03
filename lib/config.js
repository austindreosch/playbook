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

// Categories enabled: true here means it will be in the default view, default choice for rankings etc.
export const SPORT_CONFIGS = {
    nba: { 
        label: 'NBA',
        positions: ['All', 'PG', 'SG', 'SF', 'PF', 'C', 'G', 'F'],
        categories: { 
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
            '3P%': { label: '3-Point Percentage', enabled: false },
            'DRB': { label: 'Defensive Rebounds Per Game', enabled: false },
            'ORB': { label: 'Offensive Rebounds Per Game', enabled: false },
            'TS%': { label: 'True Shooting Percentage', enabled: false },
            'ATO': { label: 'Assist to Turnover Ratio', enabled: false },
            'FGM': { label: 'Field Goals Made Per Game', enabled: false },
            'FTM': { label: 'Free Throws Made Per Game', enabled: false },
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
        }
    },
    mlb: {
        label: 'MLB',
        positions: ['All', 'SP', 'RP', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT','INF', 'CI', 'MI'],
        categories: {
            // ---------------------
            //        Hitting
            // ---------------------
            // Standard 5x5 
            'R': { label: 'Runs', enabled: true, group: 'hitting' },
            'HR': { label: 'Home Runs', enabled: true, group: 'hitting' },
            'RBI': { label: 'Runs Batted In', enabled: true, group: 'hitting' },
            'SB': { label: 'Stolen Bases', enabled: true, group: 'hitting' },
            'AVG': { label: 'Batting Average', enabled: true, group: 'hitting' },
            // Alternative Hitting
            'H': { label: 'Hits', enabled: false, group: 'hitting' },
            '2B': { label: 'Doubles', enabled: false, group: 'hitting' },
            '3B': { label: 'Triples', enabled: false, group: 'hitting' },
            'OBP': { label: 'On-Base Percentage', enabled: false, group: 'hitting' },
            'SLG': { label: 'Slugging Percentage', enabled: false, group: 'hitting' },
            'OPS': { label: 'On-Base + Slugging', enabled: false, group: 'hitting' },
            'TB': { label: 'Total Bases', enabled: false, group: 'hitting' },

            // ---------------------
            //       Pitching
            // ---------------------
            // Standard 5x5
            'W': { label: 'Wins', enabled: true, group: 'pitching' },
            'K': { label: 'Strikeouts', enabled: true, group: 'pitching' },
            'SV': { label: 'Saves', enabled: true, group: 'pitching' },
            'ERA': { label: 'Earned Run Average', enabled: true, group: 'pitching', lowerIsBetter: true },
            'WHIP': { label: 'Walks + Hits per IP', enabled: true, group: 'pitching', lowerIsBetter: true },
            // Alternative Pitching
            'QS': { label: 'Quality Starts', enabled: false, group: 'pitching' },
            'SVH': { label: 'Saves + Holds', enabled: false, group: 'pitching' },
            'HLD': { label: 'Holds', enabled: false, group: 'pitching' },
            'K/BB': { label: 'Strikeout/Walk Ratio', enabled: false, group: 'pitching' },
            'K/9': { label: 'Strikeouts per 9 IP', enabled: false, group: 'pitching' },
            'IP': { label: 'Innings Pitched', enabled: false, group: 'pitching' },

        },
        statPathMapping: { 
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
            "WHP": "stats.pitching.walksAndHitsPerInningPitched",
            // Alternative Pitching
            "QS": "stats.pitching.qualityStarts",
            "SVH": "", // Find in derivedStatDefinitions
            "HLD": "stats.pitching.holds",
            "K/BB": "stats.pitching.strikeoutsToWalksRatio",
            "K/9": "stats.pitching.strikeoutsPer9Innings",
            "IP": "stats.pitching.inningsPitched",

            // Universal / Informational
            "GP": "stats.gamesPlayed",

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
        statPathMapping: { // Updated NFL mapping to RAW paths
            // These map to fields in the raw data structure
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
        }
    }
};
