/**
 * League Import Conditional Prompt Engine
 * Dynamically shows prompts based on sport, league type, scoring, and matchup selections
 */

// Type definitions for league import form
export const SPORTS = ["NBA", "MLB", "NFL"];
export const LEAGUE_TYPES = ["Redraft", "Dynasty", "Keeper"];
export const SCORING_TYPES = ["Points", "Categories"];
export const MATCHUP_TYPES = ["H2H", "Roto", "Total Points"];
export const DRAFT_TYPES = ["Snake", "Auction"];
export const TEAM_DIRECTIONS = ["Rebuilding", "Flexible", "Contending"];

// Available categories by sport
export const SPORT_CATEGORIES = {
  NBA: ["PTS", "REB", "AST", "STL", "BLK", "3PM", "FG%", "FT%", "TO"],
  MLB: ["R", "HR", "RBI", "SB", "AVG", "W", "K", "ERA", "WHIP", "SV"],
  NFL: ["Pass YDs", "Pass TDs", "Rush YDs", "Rush TDs", "Rec", "Rec YDs", "Rec TDs", "INT", "Fumbles"]
};

// Prompt registry - defines all possible prompts and their UI controls
export const promptRegistry = {
  decay: { 
    label: "Decay?", 
    help: "Does keeper cost/asset value decay or inflate each season?", 
    control: "toggle", 
    order: 10 
  },
  contracts: { 
    label: "Contracts?", 
    help: "Track contract years/values for players.", 
    control: "toggle", 
    order: 20 
  },
  playoffSchedule: { 
    label: "Playoff Schedule", 
    help: "H2H only. Set start/end weeks and number of teams.", 
    control: "object", 
    order: 30 
  },
  gamesLimit: { 
    label: "Games Limit?", 
    help: "Weekly/seasonal caps (NBA/MLB).", 
    control: "number", 
    order: 40 
  },
  teamDirection: { 
    label: "Team Direction", 
    help: "Tag your team's current approach.", 
    control: "select", 
    order: 50 
  },
  categories: { 
    label: "League Categories", 
    help: "Select the categories your league uses.", 
    control: "multiselect", 
    order: 60 
  },
  mostCategories: { 
    label: "Most Categories", 
    help: "Optimize UI for 'win most cats' framing.", 
    control: "toggle", 
    order: 70 
  },
  puntCategories: { 
    label: "Punt Categories?", 
    help: "Mark cats you intentionally ignore.", 
    control: "multiselect", 
    order: 80 
  }
};

// Validation rules for scoring/matchup combinations
export const validationRules = {
  validateScoringMatchup: (scoring, matchup) => {
    if (scoring === "Points" && matchup === "Roto") {
      return { isValid: false, error: "Roto is only valid with Categories scoring." };
    }
    if (scoring === "Categories" && matchup === "Total Points") {
      return { isValid: false, error: "Total Points only works with Points scoring." };
    }
    return { isValid: true, error: null };
  },

  getValidMatchupTypes: (scoring) => {
    if (scoring === "Points") return ["H2H", "Total Points"];
    if (scoring === "Categories") return ["H2H", "Roto"];
    return MATCHUP_TYPES;
  }
};

// Helper function to check if value matches condition (supports arrays)
const inSet = (val, set) => {
  if (!set) return true;
  return Array.isArray(set) ? set.includes(val) : val === set;
};

// Rules engine - defines when to show each prompt
export const promptRules = [
  // Categories scoring ⇒ category prompts
  { 
    if: { scoring: "Categories" }, 
    show: ["categories", "mostCategories", "puntCategories"] 
  },

  // Roto (season-long category ranking) ⇒ categories + season-long caps
  { 
    if: { matchup: "Roto" }, 
    show: ["categories", "mostCategories", "puntCategories", "gamesLimit"] 
  },

  // H2H ⇒ playoff schedule (Points or Categories)
  { 
    if: { matchup: "H2H" }, 
    show: ["playoffSchedule"] 
  },

  // NBA/MLB non–Total Points formats commonly use game limits
  { 
    if: { sport: ["NBA", "MLB"], matchup: ["H2H", "Roto"] }, 
    show: ["gamesLimit"] 
  },

  // Dynasty or Keeper leagues often track decay/contract + team direction
  { 
    if: { leagueType: ["Dynasty", "Keeper"] }, 
    show: ["decay", "contracts", "teamDirection"] 
  },

  // MLB Dynasty tends to use decay/contracts explicitly
  { 
    if: { sport: "MLB", leagueType: "Dynasty" }, 
    show: ["decay", "contracts"] 
  },

  // NFL Keeper + Points frequently uses contracts/keeper inflation & team direction
  { 
    if: { sport: "NFL", leagueType: "Keeper" }, 
    show: ["decay", "contracts", "teamDirection"] 
  }
];

/**
 * Main engine function - computes which prompts to show based on selections
 */
export function getActivePrompts(selections) {
  const { sport, leagueType, scoring, matchup } = selections;
  const shown = new Set();

  for (const rule of promptRules) {
    if (
      inSet(sport, rule.if.sport) &&
      inSet(leagueType, rule.if.leagueType) &&
      inSet(scoring, rule.if.scoring) &&
      inSet(matchup, rule.if.matchup)
    ) {
      rule.show.forEach(prompt => shown.add(prompt));
    }
  }

  // Return prompts sorted by display order
  return [...shown].sort((a, b) => promptRegistry[a].order - promptRegistry[b].order);
}

/**
 * Get default values for prompt controls
 */
export function getDefaultPromptValues(sport) {
  return {
    decay: false,
    contracts: false,
    playoffSchedule: { startWeek: 14, endWeek: 16, teams: 6 },
    gamesLimit: sport === "NBA" ? 82 : sport === "MLB" ? 162 : null,
    teamDirection: "Flexible",
    categories: SPORT_CATEGORIES[sport] || [],
    mostCategories: true,
    puntCategories: []
  };
}

/**
 * Validate complete league form data
 */
export function validateLeagueForm(formData) {
  const errors = {};

  // Required fields
  if (!formData.platform) errors.platform = "Platform is required";
  if (!formData.leagueId) errors.leagueId = "League ID is required";
  if (!formData.sport) errors.sport = "Sport is required";
  if (!formData.leagueType) errors.leagueType = "League type is required";
  if (!formData.scoring) errors.scoring = "Scoring type is required";
  if (!formData.matchup) errors.matchup = "Matchup type is required";
  if (!formData.draftType) errors.draftType = "Draft type is required";

  // Scoring/matchup validation
  if (formData.scoring && formData.matchup) {
    const validation = validationRules.validateScoringMatchup(formData.scoring, formData.matchup);
    if (!validation.isValid) {
      errors.matchup = validation.error;
    }
  }

  // Prompt-specific validations
  if (formData.settings?.playoffSchedule) {
    const { startWeek, endWeek, teams } = formData.settings.playoffSchedule;
    if (startWeek >= endWeek) {
      errors.playoffSchedule = "Start week must be before end week";
    }
    if (teams < 2) {
      errors.playoffSchedule = "At least 2 teams required for playoffs";
    }
  }

  if (formData.settings?.gamesLimit && formData.settings.gamesLimit < 1) {
    errors.gamesLimit = "Games limit must be positive";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}