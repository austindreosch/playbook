'use client';

import { Separator } from '@/components/ui/separator';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Calendar, ClipboardMinus, Clock, Compass, SigmaSquare, Swords, Timer, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import ImpactDistributionBlock from '../../common/ImpactDistributionBlock';

// Sport-specific configuration
const SPORT_CONFIG = {
  nba: {
    contextColumns: [
      { key: "Date", icon: <Calendar className="w-icon-xs h-icon-xs" />, label: "Date" },
      { key: "Opp", icon: <Swords className="w-icon-xs h-icon-xs" />, label: "Opponent" },
      { key: "MIN", icon: <Timer className="w-icon-xs h-icon-xs" />, label: "Minutes" },
      "PF"
    ],
    pointsStats: ["FGA", "FGM", "FTA", "FTM", "3PM", "PTS", "REB", "AST", "STL", "BLK", "TO"],
    percentagePairs: [
      { made: "FGM", attempt: "FGA", display: "FG%" },
      { made: "FTM", attempt: "FTA", display: "FT%" }
    ],
    normalization: {
      baseStatKey: "MIN", // Minutes played
      targetValue: 36, // Per 36 minutes
      targetLabel: "36", // Display as "Per 36"
      excludeStats: ["Date", "Opp", "MIN", "PF", "FG%", "FT%"], // Don't normalize these
      parseTime: true // Convert "34:47" format to decimal minutes
    }
  },
  nfl: {
    contextColumns: [
      { key: "Date", icon: <Calendar className="w-icon-xs h-icon-xs" />, label: "Date" },
      { key: "Opp", icon: <Swords className="w-icon-xs h-icon-xs" />, label: "Opponent" },
      { key: "SNAP", icon: <Timer className="w-icon-xs h-icon-xs" />, label: "Snaps" },
      "PEN"
    ],
    pointsStats: ["PASS_ATT", "PASS_COMP", "PASS_YDS", "PASS_TD", "RUSH_ATT", "RUSH_YDS", "RUSH_TD", "REC", "REC_YDS", "REC_TD"],
    percentagePairs: [
      { made: "PASS_COMP", attempt: "PASS_ATT", display: "COMP%" }
    ],
    normalization: {
      baseStatKey: "SNAP", // Snaps played
      targetValue: 10, // Per 10 touches/snaps
      targetLabel: "10", // Display as "Per 10"
      excludeStats: ["Date", "Opp", "SNAP", "PEN", "COMP%"], // Don't normalize these
      parseTime: false // Raw numbers, no time parsing
    }
  },
  mlb: {
    contextColumns: [
      { key: "Date", icon: <Calendar className="w-icon-xs h-icon-xs" />, label: "Date" },
      { key: "Opp", icon: <Swords className="w-icon-xs h-icon-xs" />, label: "Opponent" },
      { key: "INN", icon: <Timer className="w-icon-xs h-icon-xs" />, label: "Innings" },
      "ERA"
    ],
    pointsStats: ["AB", "H", "R", "RBI", "HR", "BB", "SO", "AVG"],
    percentagePairs: [], // TODO: Add MLB percentage pairs if needed
    normalization: {
      baseStatKey: "AB", // At bats or plate appearances
      targetValue: 4, // Per 4 plate appearances
      targetLabel: "4PA", // Display as "Per 4PA"
      excludeStats: ["Date", "Opp", "INN", "ERA", "AVG"], // Don't normalize these
      parseTime: false // Raw numbers, no time parsing
    }
  }
};

// Helper functions
const getSportConfig = (sport) => {
  return SPORT_CONFIG[sport] || SPORT_CONFIG.nba; // Default to NBA
};

const getGameStatsColumns = (sport, leagueFormat, leagueCategories = null) => {
  const config = getSportConfig(sport);
  
  if (leagueFormat === 'categories' && leagueCategories && leagueCategories.length > 0) {
    return [...config.contextColumns, ...leagueCategories];
  } else {
    return [...config.contextColumns, ...config.pointsStats];
  }
};

const findPercentagePair = (columnKey, sport) => {
  const config = getSportConfig(sport);
  return config.percentagePairs.find(pair => 
    pair.made === columnKey || pair.attempt === columnKey
  );
};

const isPercentagePairHovered = (columnKey, hoveredPair, sport) => {
  if (!hoveredPair) return false;
  const config = getSportConfig(sport);
  const pair = config.percentagePairs.find(p => p.display === hoveredPair);
  return pair && (pair.made === columnKey || pair.attempt === columnKey);
};

const calculatePercentage = (made, attempt) => {
  return attempt > 0 ? ((made / attempt) * 100).toFixed(1) : '0.0';
};

// Normalization helper functions
const parseTimeToMinutes = (timeString) => {
  if (typeof timeString !== 'string' || !timeString.includes(':')) {
    return parseFloat(timeString) || 0;
  }
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes + (seconds / 60);
};

const normalizeStatValue = (statValue, baseValue, targetValue, config) => {
  if (baseValue === 0) return 0;
  
  // Parse base value if it's a time format
  const parsedBaseValue = config.parseTime ? parseTimeToMinutes(baseValue) : parseFloat(baseValue);
  
  if (parsedBaseValue === 0) return 0;
  
  const normalizedValue = (parseFloat(statValue) * targetValue) / parsedBaseValue;
  return normalizedValue % 1 === 0 ? normalizedValue.toString() : normalizedValue.toFixed(1);
};

const shouldNormalizeStat = (columnKey, config) => {
  return !config.excludeStats.includes(columnKey);
};

const getCellValue = (columnKey, game, contextColumns, showPercentages, hoveredNormalizedColumn, sport) => {
  const config = getSportConfig(sport);
  
  // Handle context columns
  switch (columnKey) {
    case 'Date':
      return game.date;
    case 'Opp':
      return game.opponent;
    case 'MIN':
    case 'SNAP':
    case 'INN':
      return game.minutes;
    default:
      // Handle stat columns - use !== undefined to include 0 values
      let baseValue = game.stats[columnKey] !== undefined ? game.stats[columnKey] : '';
      
      // Handle merged percentage display - show all percentages when hovering
      if (showPercentages) {
        const pair = config.percentagePairs.find(p => p.attempt === columnKey);
        if (pair) {
          const made = game.stats[pair.made] || 0;
          const attempt = game.stats[pair.attempt] || 0;
          return `${calculatePercentage(made, attempt)}%`;
        }
      }
      
      // Handle normalization if this specific column is being hovered
      if (hoveredNormalizedColumn === columnKey && shouldNormalizeStat(columnKey, config.normalization)) {
        const baseStatValue = game.minutes; // This maps to the base stat (MIN, SNAP, AB, etc.)
        if (baseStatValue && baseValue !== '') {
          return normalizeStatValue(
            baseValue, 
            baseStatValue, 
            config.normalization.targetValue, 
            config.normalization
          );
        }
      }
      
      return baseValue;
  }
};

export default function PlayerPerformanceBlock() {
  // Get current league context for sport-specific configurations
  const { getCurrentLeague } = useDashboardContext();
  const currentLeague = getCurrentLeague();
  const currentSport = currentLeague?.leagueDetails?.sport?.toLowerCase() || 'nba';
  
  // State for hover effects on percentage columns
  const [showPercentages, setShowPercentages] = useState(false);
  
  // State for individual column normalization hover
  const [hoveredNormalizedColumn, setHoveredNormalizedColumn] = useState(null);
  
  // Get sport configuration
  const sportConfig = getSportConfig(currentSport);
  
  // Get league format and categories for dynamic stats display
  const leagueFormat = currentLeague?.leagueDetails?.scoring?.toLowerCase() || 'points';
  const leagueCategories = currentLeague?.leagueSettings?.categories || null;
  
  const contextColumns = sportConfig.contextColumns;
  const gameStatsColumns = getGameStatsColumns(currentSport, leagueFormat, leagueCategories);

  // TODO: This data should come from selected player and be sport-agnostic
  const performanceData = {
    metrics: [
      {
        type: "Playbook",
        value: 94,
        changes: [
          { value: "21%", label: "vs. Offseason Projections", isPositive: true },
          { value: "32%", label: "Last 30 vs. Season", isPositive: true }
        ]
      },
      {
        type: "Standard", 
        value: 99,
        changes: []
      }
    ],
    // TODO: Recent games structure should adapt to sport (NBA/NFL/MLB have different stat structures)
    recentGames: [
      {
        date: "12/3",
        opponent: "GSW", 
        minutes: "34:47",
        stats: {
          "FGA": 10, "FGM": 7, "FTA": 5, "FTM": 3, "3PM": 3,
          "PTS": 18, "REB": 7, "AST": 7, "STL": 2, "BLK": 1, "TO": 2, "PF": 2
        }
      },
      {
        date: "12/3",
        opponent: "DAL",
        minutes: "40:55", 
        stats: {
          "FGA": 19, "FGM": 11, "FTA": 7, "FTM": 4, "3PM": 1,
          "PTS": 26, "REB": 16, "AST": 13, "STL": 2, "BLK": 0, "TO": 5, "PF": 5
        }
      },
      {
        date: "12/3",
        opponent: "GSW",
        minutes: "34:47",
        stats: {
          "FGA": 10, "FGM": 7, "FTA": 5, "FTM": 3, "3PM": 3,
          "PTS": 18, "REB": 7, "AST": 7, "STL": 2, "BLK": 1, "TO": 2, "PF": 2
        }
      },
      {
        date: "12/3", 
        opponent: "DAL",
        minutes: "40:55",
        stats: {
          "FGA": 19, "FGM": 11, "FTA": 7, "FTM": 4, "3PM": 1,
          "PTS": 26, "REB": 16, "AST": 13, "STL": 2, "BLK": 0, "TO": 5, "PF": 5
        }
      },
      {
        date: "12/3",
        opponent: "GSW", 
        minutes: "34:47",
        stats: {
          "FGA": 10, "FGM": 7, "FTA": 5, "FTM": 3, "3PM": 3,
          "PTS": 18, "REB": 7, "AST": 7, "STL": 2, "BLK": 1, "TO": 2, "PF": 2
        }
      }
    ]
  };

  // TODO: This should come from actual player z-score calculations based on sport-specific stats
  const impactStatsWithScores = [
    { name: "AST", zScore: 2.3 },
    { name: "PTS", zScore: 1.8 },
    { name: "FG%", zScore: 1.2 },
    { name: "3PM", zScore: 0.9 },
    { name: "FT%", zScore: 0.7 },
    { name: "REB", zScore: 0.5 },
    { name: "STL", zScore: 0.3 },
    { name: "BLK", zScore: -0.2 },
    { name: "TO", zScore: -1.1 }
  ];

  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 flex-shrink-0">
        <SigmaSquare className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Performance</h3>
      </div>
      
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2 flex-shrink-0">

        {/* Performance Metrics */}
        <div className="flex flex-row gap-2 w-full mt-3">
          {/* Z-Score */}
          <div className=" w-full">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Compass className="w-icon-sm h-icon-sm text-pb_darkgray" />
                <span className="text-xs font-medium text-pb_darkgray">Playbook</span>
              </div>
              <span className="text-sm font-medium font-mono text-pb_darkgray">13.87</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardMinus className="w-icon-sm h-icon-sm text-pb_textlightestgray" />
                <span className="text-xs font-medium text-pb_textlightestgray">Standard</span>
              </div>
              <span className="text-sm font-medium font-mono text-pb_textlightestgray">13.25</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-full" />

          {/* Recent Performance Context */}
          <div className=' w-full flex justify-center'>
            <div className='flex flex-col text-center w-1/2 gap-1.5'>
              <div className='text-xs text-pb_red font-medium'>
                ▼21%
              </div>
              <div className='text-3xs text-pb_textgray leading-tighter'>
                vs. Offseason Projections
              </div>
            </div>

            <div className='flex flex-col text-center w-1/2 gap-1.5'> 
              <div className='text-xs text-pb_green font-medium'>
                ▲32%
              </div>
              <div className='text-3xs text-pb_textgray leading-tighter'>
                Last 30 <br/> vs. Season
              </div>
            </div>

          </div>
        
        </div>

        {/* Impact Distribution */}
        <div className='relative mt-2'>
          <h4 className="absolute -top-5 left-[1px] text-xs font-medium text-pb_darkgray">Impact Distribution</h4>
          <ImpactDistributionBlock stats={impactStatsWithScores} />
        </div>
      </div>

      {/* Recent Games Table */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <h4 className="text-xs font-semibold text-pb_darkgray mb-1 flex-shrink-0">Recent Games</h4>
        <div className="flex-1 overflow-auto" style={{paddingTop: '25px', marginTop: '-25px'}}>
          <table className="w-full text-2xs table-fixed">
            <thead className="sticky top-0">
              <tr>
                {gameStatsColumns.map((column, index) => {
                  // Handle both icon objects and string columns
                  const columnKey = typeof column === 'object' ? column.key : column;
                  const isContextColumn = contextColumns.some(col => 
                    typeof col === 'object' ? col.key === columnKey : col === columnKey
                  );
                  
                  // Determine display text and merged state
                  let displayText = typeof column === 'object' ? column.icon : column;
                  let shouldShowPercentageHeader = false;
                  let percentageLabel = '';
                  
                  if (showPercentages) {
                    // Check if this column should show percentage header (FGA, FTA)
                    const pair = sportConfig.percentagePairs.find(pair => pair.attempt === columnKey);
                    if (pair) {
                      shouldShowPercentageHeader = true;
                      percentageLabel = pair.display;
                    }
                    
                    // Hide text for made columns (FGM, FTM)
                    const isMadeColumn = sportConfig.percentagePairs.some(pair => pair.made === columnKey);
                    if (isMadeColumn) {
                      displayText = '';
                    }
                  }
                  
                  let headerClass = isContextColumn 
                    ? "py-1 px-1 font-normal text-pb_textlightergray w-8 relative"
                    : "py-1 px-1 font-medium text-pb_darkgray w-8 relative";
                  
                  return (
                    <th key={index} className={headerClass}>
                      {/* Floating Per 36m label above header */}
                      {hoveredNormalizedColumn === columnKey && shouldNormalizeStat(columnKey, sportConfig.normalization) && !showPercentages && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-50 pointer-events-none" 
                        style={{top: '-20px'}}>
                          <div className="bg-pb_lightergray text-pb_textgray shadow-sm text-3xs px-1 py-[1px] rounded text-center leading-none min-w-max">
                             Per {sportConfig.normalization.targetLabel}<br/>Min
                          </div>
                        </div>
                      )}
                      {shouldShowPercentageHeader && (
                        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-20 pointer-events-none" 
                             style={{width: 'calc(200% + 2px)', left: '0'}}>
                          <span className="px-1 font-medium text-pb_darkgray">
                            {percentageLabel}
                          </span>
                        </div>
                      )}
                      {!shouldShowPercentageHeader && (
                        <div className="flex items-center justify-center">
                          {displayText}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {performanceData.recentGames.map((game, gameIndex) => (
                <tr key={gameIndex} className="border-t border-pb_lightergray">
                  {gameStatsColumns.map((column, columnIndex) => {
                    // Handle both icon objects and string columns
                    const columnKey = typeof column === 'object' ? column.key : column;
                    const isContextColumn = contextColumns.some(col => 
                      typeof col === 'object' ? col.key === columnKey : col === columnKey
                    );
                    
                    // Check if this cell should be hidden due to merging
                    const pair = findPercentagePair(columnKey, currentSport);
                    if (showPercentages && pair && columnKey === pair.made) {
                      return null;
                    }
                    
                    // Get the value for this column
                    let cellValue = getCellValue(columnKey, game, contextColumns, showPercentages, hoveredNormalizedColumn, currentSport);
                    let colSpan = 1;
                    
                    // Handle merged percentage display
                    if (showPercentages && pair && columnKey === pair.attempt) {
                      colSpan = 2;
                    }
                    
                    // Add special styling for merged percentage cells
                    const isMergedPercentage = showPercentages && pair && columnKey === pair.attempt;
                    
                    let cellClass = isContextColumn 
                      ? "py-0.5 px-1 text-pb_textlightergray text-center w-8"
                      : "py-0.5 px-1 font-mono text-pb_textgray font-medium text-center w-8";
                    
                    // Add light gray text when hovering over shooting columns
                    if (showPercentages && pair) {
                      cellClass = cellClass.replace("text-pb_textgray", "text-pb_textlightestgray");
                    }
                    
                    // Add light gray text when hovering over this specific normalizable stat column
                    if (hoveredNormalizedColumn === columnKey && shouldNormalizeStat(columnKey, sportConfig.normalization)) {
                      cellClass = cellClass.replace("text-pb_textgray", "text-pb_textlightestgray tracking-tighter");
                    }
                    
                    // Add relative positioning for merged percentage cells (no background)
                    if (isMergedPercentage) {
                      cellClass += " relative";
                    }
                    
                    return (
                      <td 
                        key={columnIndex} 
                        className={cellClass}
                        colSpan={colSpan}
                        onMouseEnter={() => {
                          const hoveredPair = findPercentagePair(columnKey, currentSport);
                          if (hoveredPair) {
                            setShowPercentages(true);
                          }
                          
                          // Check if this is a normalizable stat column
                          if (shouldNormalizeStat(columnKey, sportConfig.normalization)) {
                            setHoveredNormalizedColumn(columnKey);
                          }
                        }}
                        onMouseLeave={() => {
                          const hoveredPair = findPercentagePair(columnKey, currentSport);
                          if (hoveredPair) {
                            setShowPercentages(false);
                          }
                          
                          // Clear normalized column hover
                          if (shouldNormalizeStat(columnKey, sportConfig.normalization)) {
                            setHoveredNormalizedColumn(null);
                          }
                        }}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}