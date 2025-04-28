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
            // Standard 9-Cat
            'PTS': { label: 'Points', enabled: true, multiplier: 1 },
            'REB': { label: 'Rebounds', enabled: true, multiplier: 1 },
            'AST': { label: 'Assists', enabled: true, multiplier: 1 },
            'STL': { label: 'Steals', enabled: true, multiplier: 1 },
            'BLK': { label: 'Blocks', enabled: true, multiplier: 1 },
            'FG%': { label: 'Field Goal Percentage', enabled: true, multiplier: 1 },
            'FT%': { label: 'Free Throw Percentage', enabled: true, multiplier: 1 },
            '3PM': { label: '3-Pointers Made', enabled: true, multiplier: 1 },
            'TO': { label: 'Turnovers', enabled: true, multiplier: 1, lowerIsBetter: true }, // Mark lower as better for weighting
            // Other potential categories (initially disabled)
            'FGM': { label: 'Field Goals Made', enabled: false, multiplier: 1 },
            'FTM': { label: 'Free Throws Made', enabled: false, multiplier: 1 },
            'TS%': { label: 'True Shooting Percentage', enabled: false, multiplier: 1 },
            '3P%': { label: '3-Point Percentage', enabled: false, multiplier: 1 },
            'A/TO': { label: 'Assist to Turnover Ratio', enabled: false, multiplier: 1 },
            'DREB': { label: 'Defensive Rebounds', enabled: false, multiplier: 1 },
            'OREB': { label: 'Offensive Rebounds', enabled: false, multiplier: 1 },
            // 'DD': { label: 'Double Doubles', enabled: false, multiplier: 1 }, // TODO: Add this
            // 'TD': { label: 'Triple Doubles', enabled: false, multiplier: 1 } // TODO: Add this
        }
    },
    mlb: {
        label: 'MLB',
        positions: ['All', 'SP', 'RP', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT','INF'],
        categories: {
            // Standard 5x5 Hitting
            'R': { label: 'Runs', enabled: true, multiplier: 1, group: 'hitting' },
            'HR': { label: 'Home Runs', enabled: true, multiplier: 1, group: 'hitting' },
            'RBI': { label: 'Runs Batted In', enabled: true, multiplier: 1, group: 'hitting' },
            'SB': { label: 'Stolen Bases', enabled: true, multiplier: 1, group: 'hitting' },
            'AVG': { label: 'Batting Average', enabled: true, multiplier: 1, group: 'hitting' },
            // Standard 5x5 Pitching
            'W': { label: 'Wins', enabled: true, multiplier: 1, group: 'pitching' },
            'K': { label: 'Strikeouts', enabled: true, multiplier: 1, group: 'pitching' },
            'SV': { label: 'Saves', enabled: true, multiplier: 1, group: 'pitching' },
            'ERA': { label: 'Earned Run Average', enabled: true, multiplier: 1, group: 'pitching', lowerIsBetter: true },
            'WHIP': { label: 'Walks + Hits per IP', enabled: true, multiplier: 1, group: 'pitching', lowerIsBetter: true },
            // Other Hitting
            'H': { label: 'Hits', enabled: false, multiplier: 1, group: 'hitting' },
            '2B': { label: 'Doubles', enabled: false, multiplier: 1, group: 'hitting' },
            '3B': { label: 'Triples', enabled: false, multiplier: 1, group: 'hitting' },
            'OBP': { label: 'On-Base Percentage', enabled: false, multiplier: 1, group: 'hitting' },
            'SLG': { label: 'Slugging Percentage', enabled: false, multiplier: 1, group: 'hitting' },
            'OPS': { label: 'On-Base + Slugging', enabled: false, multiplier: 1, group: 'hitting' },
            // 'TB': { label: 'Total Bases', enabled: false, multiplier: 1, group: 'hitting' },
            // Other Pitching
            'SVHLD': { label: 'Saves + Holds', enabled: false, multiplier: 1, group: 'pitching' },
            'K/BB': { label: 'Strikeout/Walk Ratio', enabled: false, multiplier: 1, group: 'pitching' },
            'K/9': { label: 'Strikeouts per 9 IP', enabled: false, multiplier: 1, group: 'pitching' },
            'BB/9': { label: 'Walks per 9 IP', enabled: false, multiplier: 1, group: 'pitching', lowerIsBetter: true },
            // 'QS': { label: 'Quality Starts', enabled: false, multiplier: 1, group: 'pitching' }, // TODO: Add this
            // 'HLD': { label: 'Holds', enabled: false, multiplier: 1, group: 'pitching' },
            // 'L': { label: 'Losses', enabled: false, multiplier: 1, group: 'pitching', lowerIsBetter: true },
            // 'IP': { label: 'Innings Pitched', enabled: false, multiplier: 1, group: 'pitching' },
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
                multiplier: 1, 
                description: 'Standard calculation player averages per game based on standard scoring formulas for your league format.' 
            },
           'PPS': { 
                label: 'Fantasy Points Per Snap', 
                enabled: true, 
                multiplier: 1, 
                description: 'Reveals how productive a player is relative to playing time — highlights efficiency over volume.' 
            },
            'OPG': { 
                label: 'Opportunities Per Game', 
                enabled: true, 
                multiplier: 1, 
                description: 'Shows how often a player is involved in the offense, whichdrives upside and floor.' 
            },
            'OPE': { 
                label: 'Opportunity Efficiency', 
                enabled: true, 
                multiplier: 1, 
                description: 'Measures how well a player converts their opportunities into points.' 
            },
            'YD%': { 
                label: 'Yard Share %', 
                enabled: true, 
                multiplier: 1, 
                description: 'Measures a player’s share of their team’s total yardage.' 
            },
            'PR%': { 
                label: 'Production Share %', 
                enabled: true, 
                multiplier: 1, 
                description: 'Captures a player’s share of their team’s successful downs.' 
            },
            'TD%': { 
                label: 'Touchdown Rate', 
                enabled: true, 
                multiplier: 1, 
                description: 'Highlights a player’s ability (or reliance) on scoring touchdowns for their fantasy points.' 
            },
            'BP%': { 
                label: 'Big Play Rate', 
                enabled: true, 
                multiplier: 1, 
                description: 'Measures explosive play ability (20+ yard gains) relative to their opportunities.' 
            },
            'TO%': { 
                label: 'Turnover Rate', 
                enabled: true, 
                multiplier: 1, 
                lowerIsBetter: true, 
                description: 'Tracks turnover risk for evaluating consistency and trust.' 
            }
            // ... (add others as needed for display purposes)
        },
        // Add relevant settings for Points leagues
        defaultPpr: '1ppr', // Example default
        defaultFlex: 'superflex', // Example default
    }
};

// DATABASE_CONFIG omitted based on feedback.
// Other configs like FUSE_CONFIG can be added later. 