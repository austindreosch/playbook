// Commissioner Dummy Data - Sport-agnostic structure for league recruitment
// TODO: Replace with Google Sheets integration for real data management

// Dummy leagues data that would come from Google Sheets
const DUMMY_COMMISSIONER_LEAGUES = {
  'nfl-dynasty-2024-001': {
    leagueId: 'nfl-dynasty-2024-001',
    leagueName: 'Elite Dynasty League',
    sport: 'NFL', // TODO: Add sport-specific constants mapping
    format: 'Dynasty',
    scoring: 'Points', // TODO: Add scoring format mappings per sport
    totalTeams: 12,
    availableSpots: 2,
    description: 'A highly competitive dynasty league for serious fantasy football managers. We\'re looking for active, dedicated players who will be in it for the long haul.',
    commissioner: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      playbook_user_id: 'user_123456'
    },
    settings: {
      draftDate: 'August 15, 2024',
      entryFee: '$75',
      payoutStructure: '60/30/10 (1st/2nd/3rd)',
      waiverSystem: 'FAAB ($100 budget)',
      tradeDeadline: 'Week 12',
      // TODO: Add sport-specific settings
      roster: {
        // TODO: Define position mappings per sport
        starters: 'QB, RB, RB, WR, WR, TE, FLEX, K, DEF',
        bench: 15,
        ir: 3,
        taxi: 4
      }
    },
    rules: 'Standard dynasty rules with some house modifications. Full rulebook available upon request. We use GroupMe for communication and expect active participation in league discussions.',
    status: 'recruiting', // recruiting, full, draft_complete, in_season
    created_date: '2024-01-15',
    recruitment_deadline: '2024-08-01'
  },
  
  'nba-dynasty-2024-002': {
    leagueId: 'nba-dynasty-2024-002',
    leagueName: 'Elite NBA Dynasty League',
    sport: 'NBA',
    format: 'Dynasty',
    scoring: 'Categories',
    totalTeams: 12,
    availableSpots: 2,
    description: 'True dynasty format NBA league with minor league slots and competitive 9-category H2H scoring. Looking for dedicated long-term managers.',
    commissioner: {
      name: 'Austin (League Commissioner)',
      email: 'austin@playbookfantasy.com',
      playbook_user_id: 'user_789012'
    },
    settings: {
      draftDate: 'After July 1st Free Agency',
      entryFee: '$75',
      payoutStructure: '1st: $550, 2nd: $275, 3rd: $75',
      waiverSystem: 'Rolling waivers (2-day waiver period)',
      tradeDeadline: 'None (Dynasty format)',
      gamesCap: '40 games per week (hard cap)',
      categories: [
        'FG%', 'FT%', '3PM', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO'
      ],
      roster: {
        starters: 'PG, SG, SF, PF, C, G, F, UTIL (3)',
        bench: 3,
        ir: 3,
        minorLeague: 5,
        totalRoster: 21,
        dailyActiveLimit: 10
      },
      playoffs: {
        teams: 6,
        format: 'Top 6 teams make playoffs',
        rounds: 'Week 1&2: First two rounds, Week 3: Two-week championship'
      }
    },
    availableTeams: [
      {
        teamId: 'team-007',
        teamName: 'Available Team #1',
        currentRoster: [
          { name: 'Luka Dončić', position: 'PG/SG', team: 'DAL' },
          { name: 'Paolo Banchero', position: 'PF', team: 'ORL' },
          { name: 'Franz Wagner', position: 'SF/SG', team: 'ORL' },
          { name: 'Jalen Green', position: 'SG', team: 'HOU' },
          { name: 'Alperen Şengün', position: 'C', team: 'HOU' },
          { name: 'Ausar Thompson', position: 'SG/SF', team: 'DET' },
          { name: 'Marcus Sasser', position: 'PG', team: 'DET' },
          { name: 'GG Jackson', position: 'PF', team: 'MEM' },
          { name: 'Jabari Smith Jr.', position: 'PF', team: 'HOU' },
          { name: 'Jalen Suggs', position: 'PG/SG', team: 'ORL' },
          { name: 'Isaiah Jackson', position: 'C', team: 'IND' },
          { name: 'Jalen Williams', position: 'SG/SF', team: 'OKC' },
          { name: 'Walker Kessler', position: 'C', team: 'UTA' },
        ],
        minorLeague: [
          { name: 'Keyonte George', position: 'PG', team: 'UTA' },
          { name: 'Cason Wallace', position: 'PG/SG', team: 'OKC' },
          { name: 'Jett Howard', position: 'SG/SF', team: 'ORL' },
        ],
        teamStrengths: ['Young core', 'High upside prospects', 'Strong guard depth'],
        teamWeaknesses: ['Needs veteran leadership', 'Thin at center', 'Developing team']
      },
      {
        teamId: 'team-011',
        teamName: 'Available Team #2',
        currentRoster: [
          { name: 'Anthony Edwards', position: 'SG', team: 'MIN' },
          { name: 'Scottie Barnes', position: 'PF/SF', team: 'TOR' },
          { name: 'Cade Cunningham', position: 'PG', team: 'DET' },
          { name: 'Jaden McDaniels', position: 'SF/PF', team: 'MIN' },
          { name: 'Isaiah Stewart', position: 'PF/C', team: 'DET' },
          { name: 'Gradey Dick', position: 'SG/SF', team: 'TOR' },
          { name: 'Dereck Lively II', position: 'C', team: 'DAL' },
          { name: 'Cam Whitmore', position: 'SG/SF', team: 'HOU' },
          { name: 'Jalen Duren', position: 'C', team: 'DET' },
          { name: 'Bennedict Mathurin', position: 'SG', team: 'IND' },
          { name: 'Keegan Murray', position: 'SF/PF', team: 'SAC' },
          { name: 'Jeremy Sochan', position: 'PF', team: 'SAS' },
          { name: 'Ousmane Dieng', position: 'PG/SF', team: 'OKC' },
        ],
        minorLeague: [
          { name: 'Bilal Coulibaly', position: 'SF/SG', team: 'WAS' },
          { name: 'Amen Thompson', position: 'PG/SG', team: 'HOU' },
          { name: 'Taylor Hendricks', position: 'PF', team: 'UTA' },
        ],
        teamStrengths: ['Elite young talent', 'Versatile players', 'High ceiling'],
        teamWeaknesses: ['Needs more depth', 'Young and inconsistent', 'Limited playoff experience']
      }
    ],
    fullRulebook: `The League Rules - NBA Dynasty League

League Format: Dynasty
The league will be true dynasty format. Players will never decay based on team tenure or be force dropped from a roster. Following the start-up draft, all subsequent yearly drafts will be rookie-only drafts.

Roster Structure:
12 Teams | PG, SG, SF, PF, C, G, F, UTIL (3), BENCH (3), IR (3)
Each team will have a roster of up to 21 players, three being Injury Reserve slots only available to sufficiently injured players. We will also have five Minor League slots for younger players to be stashed.

Minor League Eligibility:
To be eligible for Minor League you must have played less than 175 games, and once a player has been taken from your Minor League slot and placed into your active roster or if you have previously used them in your active roster, they are no longer eligible to be placed into your own Minor League.

Scoring System:
Head to Head - Each Category (Weekly)
FG%, FT%, 3PM, PTS, REB, AST, STL, BLK, TO
40 games played hard cap for each scoring period. You will maintain all stats from games played on the day you reach the cap, regardless if it exceeds the cap slightly.

League Fees & Prizes:
$75 buy-in fee collected prior to start-up draft
Prize Pool: $900 total
1st place: $550 | 2nd place: $275 | 3rd place: $75

Important: Buy-in fees for subsequent seasons must be paid by December 1st deadline or forfeit league position.

Owner Conduct Rules:
• No collusion or manipulation
• No sandbagging - always set coherent lineups
• No roster self-destructing
• Maintain competitive integrity at all times

Trading Rules:
• Commissioner veto only (hands-off approach)
• Trades reversed only in extreme situations
• 5-10 minute forgiveness period for accidental trades
• All other trades upheld

Draft Information:
• Start-up: Snake draft after July 1st free agency
• Future drafts: Linear format (rookie-only)
• Draft lottery for bottom 3 teams
• Waiver system: 2-day waiver period, then free agents

Playoffs:
• Top 6 teams qualify
• Rounds 1&2: One week each (seeds 1&2 get byes)
• Championship: Two weeks
• 3rd place decided by second round losers' results`,
    status: 'recruiting',
    created_date: '2024-01-15',
    recruitment_deadline: '2025-06-01'
  },

  'mlb-points-2024-003': {
    leagueId: 'mlb-points-2024-003',
    leagueName: 'Diamond Dynasty',
    sport: 'MLB', // TODO: Add MLB-specific constants
    format: 'Dynasty',
    scoring: 'Points', // TODO: Add MLB points scoring mapping
    totalTeams: 14,
    availableSpots: 3,
    description: 'Deep dynasty baseball league with minor league rosters. Perfect for serious baseball fans who love prospect development.',
    commissioner: {
      name: 'Mike Rodriguez',
      email: 'mike.rod@email.com',
      playbook_user_id: 'user_345678'
    },
    settings: {
      draftDate: 'March 1, 2024',
      entryFee: '$100',
      payoutStructure: '50/25/15/10 (1st/2nd/3rd/4th)',
      waiverSystem: 'FAAB ($250 budget)',
      tradeDeadline: 'August 31st',
      // TODO: Add MLB-specific settings
      roster: {
        // TODO: MLB position mappings
        starters: 'C, 1B, 2B, 3B, SS, OF, OF, OF, OF, UTIL, SP, SP, SP, SP, RP, RP',
        bench: 10,
        minors: 15,
        ir: 5
      }
    },
    rules: 'Dynasty format with full minor league rosters. Annual rookie draft after MLB draft. Detailed constitution available.',
    status: 'recruiting',
    created_date: '2024-01-01',
    recruitment_deadline: '2024-02-15'
  }
};

// TODO: Google Sheets Integration Structure
// This is where we would integrate with Google Sheets API
// Structure for future implementation:
/*
const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: 'your-spreadsheet-id',
  ranges: {
    leagues: 'Leagues!A:Z',
    commissioners: 'Commissioners!A:Z',
    settings: 'Settings!A:Z'
  },
  // TODO: Add sport-specific sheet mappings
  sportSheets: {
    nfl: 'NFL_Leagues!A:Z',
    nba: 'NBA_Leagues!A:Z', 
    mlb: 'MLB_Leagues!A:Z'
  }
};
*/

/**
 * Get league data by ID - currently from dummy data
 * TODO: Replace with Google Sheets API call
 * @param {string} leagueID 
 * @returns {Object|null} League data or null if not found
 */
export async function getCommissionerLeagueData(leagueID) {
  // TODO: Replace with actual Google Sheets API call
  // const sheetData = await fetchFromGoogleSheets(leagueID);
  
  return DUMMY_COMMISSIONER_LEAGUES[leagueID] || null;
}

/**
 * Get all available leagues for recruitment
 * TODO: Add filtering by sport, format, etc.
 * @returns {Array} Array of available leagues
 */
export async function getAvailableLeagues() {
  // TODO: Replace with Google Sheets API call
  return Object.values(DUMMY_COMMISSIONER_LEAGUES)
    .filter(league => league.status === 'recruiting' && league.availableSpots > 0);
}

/**
 * TODO: Google Sheets API integration functions
 * These would replace the dummy data functions above
 */

/*
async function fetchFromGoogleSheets(leagueID) {
  // TODO: Implement Google Sheets API integration
  // 1. Authenticate with Google Sheets API
  // 2. Fetch league data from spreadsheet
  // 3. Parse and format data
  // 4. Return structured league object
}

async function updateGoogleSheets(leagueID, updates) {
  // TODO: Implement Google Sheets update functionality
  // For updating available spots, adding new recruits, etc.
}
*/

// TODO: Sport-specific data structures and mappings
export const SPORT_SPECIFIC_MAPPINGS = {
  // TODO: Define position mappings per sport
  positions: {
    nfl: ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'],
    nba: ['PG', 'SG', 'SF', 'PF', 'C'],
    mlb: ['C', '1B', '2B', '3B', 'SS', 'OF', 'SP', 'RP']
  },
  
  // TODO: Define scoring categories per sport
  scoringCategories: {
    nfl: {
      points: ['PassYds', 'PassTDs', 'RushYds', 'RushTDs', 'RecYds', 'RecTDs', 'FGM', 'XPM'],
      // categories format not common in NFL
    },
    nba: {
      categories: ['FG%', 'FT%', '3PTM', 'REB', 'AST', 'STL', 'BLK', 'TO', 'PTS'],
      points: ['PTS', 'REB', 'AST', 'STL', 'BLK', '3PTM']
    },
    mlb: {
      categories: ['AVG', 'R', 'HR', 'RBI', 'SB', 'W', 'SV', 'K', 'ERA', 'WHIP'],
      points: ['Singles', 'Doubles', 'Triples', 'HR', 'RBI', 'R', 'SB', 'W', 'SV', 'K']
    }
  }
};

export default DUMMY_COMMISSIONER_LEAGUES; 