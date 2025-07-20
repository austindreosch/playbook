// lib/utils/sportConfig.js
// Centralized sport configuration for dynamic roster page components

export const SPORT_CONFIG = {
  nba: {
    displayName: 'Basketball',
    defaultCategories: ['FG%', 'FT%', '3PM', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO'],
    primaryStats: [
      { key: 'PTS', label: 'PPG', format: 'decimal' },
      { key: 'REB', label: 'RPG', format: 'decimal' },
      { key: 'AST', label: 'APG', format: 'decimal' },
      { key: 'MIN', label: 'MPG', format: 'decimal' }
    ],
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    formatTypes: ['Categories', 'Points', 'Roto'],
    traits: [
      'star', 'hot_streak', 'usage_spike', 'balanced', 'elite_assists', 
      'elite_scoring', 'elite_defense', 'cold_streak', 'injury_prone', 
      'inconsistent', 'low_usage'
    ],
    colorThresholds: {
      'FG%': { excellent: [0.650, 0.600, 0.550, 0.520, 0.500], poor: [0.470, 0.450, 0.430, 0.400, 0.350] },
      'FT%': { excellent: [0.900, 0.850, 0.800, 0.750, 0.700], poor: [0.650, 0.600, 0.550, 0.500, 0.450] },
      '3PM': { excellent: [4.0, 3.5, 3.0, 2.5, 2.0], poor: [1.5, 1.0, 0.8, 0.5, 0.3] },
      'PTS': { excellent: [30, 25, 22, 18, 15], poor: [12, 10, 8, 6, 4] },
      'REB': { excellent: [12, 10, 8.5, 7, 6], poor: [5, 4, 3.5, 3, 2.5] },
      'AST': { excellent: [10, 8, 6.5, 5.5, 4.5], poor: [3.5, 3, 2.5, 2, 1.5] },
      'STL': { excellent: [2.5, 2.0, 1.7, 1.4, 1.2], poor: [1.0, 0.8, 0.6, 0.5, 0.3] },
      'BLK': { excellent: [3.0, 2.5, 2.0, 1.5, 1.2], poor: [1.0, 0.8, 0.6, 0.4, 0.2] },
      'TO': { excellent: [1.5, 2.0, 2.5, 3.0, 3.5], poor: [4.0, 4.5, 5.0, 5.5, 6.0] } // Lower is better for turnovers
    }
  },
  
  nfl: {
    displayName: 'Football',
    defaultCategories: ['PASS_YDS', 'PASS_TD', 'RUSH_YDS', 'RUSH_TD', 'REC', 'REC_YDS', 'REC_TD', 'INT', 'FUM'],
    primaryStats: [
      { key: 'PASS_YDS', label: 'Pass Yds', format: 'integer' },
      { key: 'PASS_TD', label: 'Pass TD', format: 'integer' },
      { key: 'RUSH_YDS', label: 'Rush Yds', format: 'integer' },
      { key: 'REC_YDS', label: 'Rec Yds', format: 'integer' }
    ],
    positions: ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'],
    formatTypes: ['Standard', 'PPR', 'Half PPR', 'SuperFlex'],
    traits: [
      'elite_arm', 'red_zone_target', 'workhorse', 'explosive', 'reliable', 
      'goal_line_back', 'injury_prone', 'inconsistent', 'fumble_prone', 
      'limited_touches', 'rookie', 'veteran', 'handcuff', 'committee_back'
    ],
    colorThresholds: {
      'PASS_YDS': { excellent: [4500, 4000, 3500, 3000, 2500], poor: [2000, 1500, 1000, 500, 200] },
      'PASS_TD': { excellent: [35, 30, 25, 20, 15], poor: [12, 10, 8, 5, 3] },
      'RUSH_YDS': { excellent: [1500, 1200, 1000, 800, 600], poor: [400, 300, 200, 100, 50] },
      'RUSH_TD': { excellent: [15, 12, 10, 8, 6], poor: [4, 3, 2, 1, 0] },
      'REC': { excellent: [120, 100, 85, 70, 60], poor: [45, 35, 25, 15, 10] },
      'REC_YDS': { excellent: [1600, 1400, 1200, 1000, 800], poor: [600, 450, 300, 200, 100] },
      'REC_TD': { excellent: [15, 12, 10, 8, 6], poor: [4, 3, 2, 1, 0] },
      'INT': { excellent: [5, 7, 9, 12, 15], poor: [16, 18, 20, 22, 25] }, // Lower is better for interceptions
      'FUM': { excellent: [0, 1, 2, 3, 4], poor: [5, 6, 7, 8, 10] } // Lower is better for fumbles
    }
  },
  
  mlb: {
    displayName: 'Baseball',
    defaultCategories: ['R', 'HR', 'RBI', 'SB', 'AVG', 'W', 'SV', 'K', 'ERA', 'WHIP'],
    primaryStats: [
      { key: 'AVG', label: 'AVG', format: 'percentage' },
      { key: 'HR', label: 'HR', format: 'integer' },
      { key: 'RBI', label: 'RBI', format: 'integer' },
      { key: 'ERA', label: 'ERA', format: 'decimal' }
    ],
    positions: ['C', '1B', '2B', '3B', 'SS', 'OF', 'SP', 'RP'],
    formatTypes: ['Categories', 'Points', 'Roto'],
    traits: [
      'power_hitter', 'contact_hitter', 'base_stealer', 'ace', 'closer', 
      'consistent', 'injury_prone', 'streaky', 'declining', 'platoon_risk', 
      'rookie', 'veteran', 'prospect', 'role_player'
    ],
    colorThresholds: {
      'R': { excellent: [120, 100, 85, 70, 60], poor: [45, 35, 25, 15, 10] },
      'HR': { excellent: [45, 35, 28, 22, 18], poor: [12, 8, 5, 3, 1] },
      'RBI': { excellent: [120, 100, 85, 70, 60], poor: [45, 35, 25, 15, 10] },
      'SB': { excellent: [40, 30, 20, 15, 10], poor: [5, 3, 2, 1, 0] },
      'AVG': { excellent: [0.320, 0.300, 0.280, 0.260, 0.240], poor: [0.220, 0.200, 0.180, 0.160, 0.140] },
      'W': { excellent: [20, 17, 15, 12, 10], poor: [7, 5, 3, 2, 1] },
      'SV': { excellent: [40, 35, 30, 25, 20], poor: [15, 10, 5, 3, 1] },
      'K': { excellent: [250, 220, 200, 180, 160], poor: [120, 100, 80, 60, 40] },
      'ERA': { excellent: [2.50, 3.00, 3.50, 4.00, 4.50], poor: [5.00, 5.50, 6.00, 6.50, 7.00] }, // Lower is better for ERA
      'WHIP': { excellent: [1.00, 1.10, 1.20, 1.30, 1.40], poor: [1.50, 1.60, 1.70, 1.80, 2.00] } // Lower is better for WHIP
    }
  }
};

// Helper functions
export const getSportConfig = (sport) => {
  const sportKey = sport?.toLowerCase();
  return SPORT_CONFIG[sportKey] || SPORT_CONFIG.nba; // Default to NBA if sport not found
};

export const getSportCategories = (sport, leagueCategories = null) => {
  // Use league-specific categories if available, otherwise fall back to sport defaults
  if (leagueCategories && Array.isArray(leagueCategories) && leagueCategories.length > 0) {
    return leagueCategories;
  }
  return getSportConfig(sport).defaultCategories;
};

export const getSportPrimaryStats = (sport) => {
  return getSportConfig(sport).primaryStats;
};

export const getSportTraits = (sport) => {
  return getSportConfig(sport).traits;
};

// NEW: Trait metadata for icons, labels, and tooltips
import { Activity, Bandage, Building2, CircleHelp, ClipboardList, ClipboardMinus, Clock, Compass, Crown, Factory, Flag, Flame, Footprints, Goal, Hand, Package, PackageOpen, Scale, Shield, ShieldHalf, Snowflake, Sprout, Star, TrendingDown, TrendingUp, User, UserCheck, Users, UserX, XCircle, Zap } from 'lucide-react';

export const TRAIT_METADATA = {
  star: { icon: Star, label: 'Star Player', tooltip: 'A top-tier player with consistent elite performance.' },
  hot_streak: { icon: Flame, label: 'Hot Streak', tooltip: 'Currently performing above their season average.' },
  usage_spike: { icon: TrendingUp, label: 'Usage Spike', tooltip: 'Recent increase in playing time or role.' },
  balanced: { icon: Scale, label: 'Balanced Skillset', tooltip: 'Well-rounded contributions across multiple categories.' },
  elite_assists: { icon: Users, label: 'Elite Assists', tooltip: 'Exceptional assist numbers.' },
  elite_scoring: { icon: Activity, label: 'Elite Scorer', tooltip: 'High-volume scoring ability.' },
  elite_defense: { icon: Shield, label: 'Elite Defender', tooltip: 'Strong defensive contributions.' },
  
  cold_streak: { icon: Snowflake, label: 'Cold Streak', tooltip: 'Currently performing below their season average.' },
  injury_prone: { icon: Bandage, label: 'Injury Prone', tooltip: 'History of frequent or recurring injuries.' },
  inconsistent: { icon: Clock, label: 'Inconsistent', tooltip: 'Fluctuating performance from game to game.' },
  low_usage: { icon: XCircle, label: 'Low Usage', tooltip: 'Limited playing time or role.' },

  elite_arm: { icon: Flame, label: 'Elite Arm', tooltip: 'Exceptional passing ability.' },
  red_zone_target: { icon: Goal, label: 'Red Zone Target', tooltip: 'Frequent target in scoring opportunities.' },
  workhorse: { icon: Hand, label: 'Workhorse', tooltip: 'High volume of touches and responsibilities.' },
  explosive: { icon: Zap, label: 'Explosive', tooltip: 'Capable of big plays and breakaway scores.' },
  reliable: { icon: ClipboardList, label: 'Reliable', tooltip: 'Consistent and dependable performance.' },
  goal_line_back: { icon: Flag, label: 'Goal Line Back', tooltip: 'Specializes in short-yardage and scoring plays.' },
  fumble_prone: { icon: XCircle, label: 'Fumble Prone', tooltip: 'Prone to fumbling the ball.' },
  limited_touches: { icon: Package, label: 'Limited Touches', tooltip: 'Low volume of offensive opportunities.' },

  power_hitter: { icon: Flame, label: 'Power Hitter', tooltip: 'Known for hitting home runs and driving in runs.' },
  contact_hitter: { icon: Hand, label: 'Contact Hitter', tooltip: 'High batting average with ability to make consistent contact.' },
  base_stealer: { icon: Footprints, label: 'Base Stealer', tooltip: 'High stolen base numbers.' },
  ace: { icon: Crown, label: 'Ace Pitcher', tooltip: 'A top-tier starting pitcher.' },
  closer: { icon: ShieldHalf, label: 'Closer', tooltip: 'Specializes in closing out games and securing saves.' },
  streaky: { icon: Activity, label: 'Streaky', tooltip: 'Performance fluctuates in hot and cold stretches.' },
  declining: { icon: TrendingDown, label: 'Declining', tooltip: 'Showing a noticeable drop in performance.' },
  platoon_risk: { icon: Users, label: 'Platoon Risk', tooltip: 'May only play against specific opposing pitchers or matchups.' },

  rookie: { icon: Sprout, label: 'Rookie', tooltip: 'First year in the league.' },
  veteran: { icon: UserCheck, label: 'Veteran', tooltip: 'Experienced player.' },
  prospect: { icon: PackageOpen, label: 'Prospect', tooltip: 'Young player with high potential.' },
  role_player: { icon: Building2, label: 'Role Player', tooltip: 'Player with a specific, limited role on the team.' },
  handcuff: { icon: ClipboardMinus, label: 'Handcuff', tooltip: 'Backup player who would step into a major role if the starter is injured.' },
  committee_back: { icon: Users, label: 'Committee Back', tooltip: 'Part of a running back rotation.' },
};

export const getSportColorThresholds = (sport) => {
  return getSportConfig(sport).colorThresholds;
};

export const formatStatValue = (value, format) => {
  if (value == null || value === '') return '--';
  
  switch (format) {
    case 'percentage':
      return (parseFloat(value) * 100).toFixed(1) + '%';
    case 'decimal':
      return parseFloat(value).toFixed(1);
    case 'integer':
      return parseInt(value).toString();
    default:
      return value.toString();
  }
};

export const getColorForStat = (sport, statKey, value, zScore = null) => {
  // Use Z-Score if available for more accurate coloring
  if (zScore !== null && zScore !== undefined) {
    if (zScore >= 1.5) return 'text-green-600';
    if (zScore >= 0.5) return 'text-green-500';
    if (zScore >= -0.5) return 'text-gray-700';
    if (zScore >= -1.5) return 'text-red-500';
    return 'text-red-600';
  }
  
  // Fallback to threshold-based coloring
  const thresholds = getSportColorThresholds(sport)[statKey];
  if (!thresholds || value == null) return 'text-gray-700';
  
  const numValue = parseFloat(value);
  const { excellent, poor } = thresholds;
  
  // Handle reverse stats (lower is better like TO, INT, ERA)
  const isReverseStat = ['TO', 'INT', 'FUM', 'ERA', 'WHIP'].includes(statKey);
  
  if (isReverseStat) {
    if (numValue <= excellent[0]) return 'text-green-600';
    if (numValue <= excellent[1]) return 'text-green-500';
    if (numValue <= excellent[2]) return 'text-gray-700';
    if (numValue <= poor[0]) return 'text-red-500';
    return 'text-red-600';
  } else {
    if (numValue >= excellent[0]) return 'text-green-600';
    if (numValue >= excellent[1]) return 'text-green-500';
    if (numValue >= excellent[2]) return 'text-gray-700';
    if (numValue >= poor[2]) return 'text-red-500';
    return 'text-red-600';
  }
};

export const getLeagueFormatDisplay = (leagueDetails) => {
  if (!leagueDetails) return 'League';
  
  const { sport, format, type, scoringType } = leagueDetails;
  const sportConfig = getSportConfig(sport);
  
  const parts = [];
  
  // Add league type (Dynasty/Redraft)
  if (type) parts.push(type);
  
  // Add head-to-head or roto
  if (format) parts.push(format);
  
  // Add scoring type (Categories/Points for NBA/MLB, Standard/PPR for NFL)
  if (scoringType) parts.push(scoringType);
  
  return parts.join(' • ') || `${sportConfig.displayName} League`;
};