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
            'PTS': { label: 'Points', enabled: true },
            'REB': { label: 'Rebounds', enabled: true },
            'AST': { label: 'Assists', enabled: true },
            'STL': { label: 'Steals', enabled: true },
            'BLK': { label: 'Blocks', enabled: true },
            'FG%': { label: 'Field Goal Percentage', enabled: true },
            'FT%': { label: 'Free Throw Percentage', enabled: true },
            '3PM': { label: '3-Pointers Made', enabled: true },
            'TO': { label: 'Turnovers', enabled: true, lowerIsBetter: true }, // Mark lower as better for weighting
            // Other potential categories (initially disabled)
            'FGM': { label: 'Field Goals Made', enabled: false },
            'FTM': { label: 'Free Throws Made', enabled: false },
            'TS%': { label: 'True Shooting Percentage', enabled: false },
            '3P%': { label: '3-Point Percentage', enabled: false },
            'ATO': { label: 'Assist to Turnover Ratio', enabled: false },
            'DRB': { label: 'Defensive Rebounds', enabled: false },
            'ORB': { label: 'Offensive Rebounds', enabled: false },
            // 'DD': { label: 'Double Doubles', enabled: false }, // TODO: Add this
            // 'TD': { label: 'Triple Doubles', enabled: false } // TODO: Add this
        }
    },
    mlb: {
        label: 'MLB',
        positions: ['All', 'SP', 'RP', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT','INF'],
        categories: {
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
            'WHIP': { label: 'Walks + Hits per IP', enabled: true, group: 'pitching', lowerIsBetter: true },
            // Other Hitting
            'H': { label: 'Hits', enabled: false, group: 'hitting' },
            '2B': { label: 'Doubles', enabled: false, group: 'hitting' },
            '3B': { label: 'Triples', enabled: false, group: 'hitting' },
            'OBP': { label: 'On-Base Percentage', enabled: false, group: 'hitting' },
            'SLG': { label: 'Slugging Percentage', enabled: false, group: 'hitting' },
            'OPS': { label: 'On-Base + Slugging', enabled: false, group: 'hitting' },
            // 'TB': { label: 'Total Bases', enabled: false, group: 'hitting' },
            // Other Pitching
            'SVHLD': { label: 'Saves + Holds', enabled: false, group: 'pitching' },
            'K/BB': { label: 'Strikeout/Walk Ratio', enabled: false, group: 'pitching' },
            'K/9': { label: 'Strikeouts per 9 IP', enabled: false, group: 'pitching' },
            'BB/9': { label: 'Walks per 9 IP', enabled: false, group: 'pitching', lowerIsBetter: true },
            // 'QS': { label: 'Quality Starts', enabled: false, group: 'pitching' }, // TODO: Add this
            // 'HLD': { label: 'Holds', enabled: false, group: 'pitching' },
            // 'L': { label: 'Losses', enabled: false, group: 'pitching', lowerIsBetter: true },
            // 'IP': { label: 'Innings Pitched', enabled: false, group: 'pitching' },
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
                
                description: 'Measures a player’s share of their team’s total yardage.' 
            },
            'PR%': { 
                label: 'Production Share %', 
                enabled: true, 
                
                description: 'Captures a player’s share of their team’s successful downs.' 
            },
            'TD%': { 
                label: 'Touchdown Rate', 
                enabled: true, 
                
                description: 'Highlights a player’s ability (or reliance) on scoring touchdowns for their fantasy points.' 
            },
            'BP%': { 
                label: 'Big Play Rate', 
                enabled: true, 
                
                description: 'Measures explosive play ability (20+ yard gains) relative to their opportunities.' 
            },
            'TO%': { 
                label: 'Turnover Rate', 
                enabled: true, 
                
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