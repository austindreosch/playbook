'use client';

import * as React from 'react';

import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import * as Select from '@/components/alignui/select';
import { cnExt } from '@/utils/cn';
import { ClipboardMinus, Compass, Sprout, Heart, Users, Shield, Globe, Info, ScanSearch } from 'lucide-react';
import { Calendar, Clock, SigmaSquare, Swords, Timer, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import * as Button from '@/components/alignui/button';
import * as Popover from '@/components/alignui/ui/popover';


// import ImpactDistributionBlock from '../../common/ImpactDistributionBlock';
import { formatStatValue, getSportConfig, getSportPrimaryStats, getSportTraits } from '@/lib/utils/sportConfig';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { useMemo } from 'react';


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





// -------------------
// ----JSX 
// -------------------

function PlayerPerformanceWidget({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {


  // const [chartMaxWidth, setChartMaxWidth] = React.useState(250);
  // const [isClient, setIsClient] = React.useState(false);
  
  // const { getCurrentLeague, getSelectedPlayer } = useDashboardContext();
  // const currentLeague = getCurrentLeague();
  // const selectedPlayer = getSelectedPlayer();
  
  // // Get sport configuration
  // const sportConfig = useMemo(() => {
  //   const sport = currentLeague?.leagueDetails?.sport || 'nba';
  //   return getSportConfig(sport);
  // }, [currentLeague?.leagueDetails?.sport]);
  
  // const primaryStats = getSportPrimaryStats(currentLeague?.leagueDetails?.sport || 'nba');
  // const sportTraits = getSportTraits(currentLeague?.leagueDetails?.sport || 'nba');
  
  // // TODO: This data should come from selected player and be sport-agnostic
  // // For now, using dummy data but structured to be easily replaceable
  // const playerData = useMemo(() => {
  //   // If we have a selected player, use their data, otherwise use dummy data
  //   const dummyPlayer = {
  //     name: "Nikola Jokic",
  //     positionRank: "#2",
  //     positionColor: "#ababef", // TODO: Map position colors by sport
  //     position: "C", // TODO: This should be position abbreviation 
  //     image: "/avatar-default.png", // TODO: Use actual player headshots
  //   // Grid stats
  //   mpg: "31.3",
  //   team: "DEN", 
  //   age: "29",
  //   rosterPercentage: "84%",
  //   playoffScheduleGrade: "A-",
  //   stats: {
  //     // Use sport-specific primary stats from config
  //     primary: [
  //       ...primaryStats.slice(0, 3).map(stat => ({
  //         value: "27.6", // TODO: Replace with actual player stat value
  //         label: stat.label
  //       })),
  //       { value: "DEN", label: "Team" }
  //     ],
  //     secondary: [
  //       { value: "99%", label: "Health" },
  //       { value: "A+", label: "Grade" },
  //       { value: "H", label: "Trend", isPositive: true }
  //     ]
  //   },
  //   tags: {
  //     // Use sport-specific traits from config
  //     traitIds: [
  //       ...sportTraits
  //     ]
  //   },
  //   valueComparisons: [
  //     {
  //       type: "Playbook",
  //       value: 981,
  //       rank: 3,
  //       change: "+6%",
  //       changeType: "positive",
  //       subtitle: "Playbook Differential"
  //     },
  //     {
  //       type: "Standard", 
  //       value: 957,
  //       rank: 4,
  //       change: "2%",
  //       changeType: "negative",
  //       subtitle: "Value Over Last 30"
  //     },
  //     {
  //       type: "Redraft",
  //       value: 999,
  //       rank: 1,
  //       change: null,
  //       changeType: null,
  //       subtitle: null
  //     }
  //   ],
  //   historicalData: {
  //     currentView: "Stats", // "Stats" or "Value"
  //     dataPoints: [
  //       { period: 1, value: 120 },
  //       { period: 2, value: 95 },
  //       { period: 3, value: 145 },
  //       { period: 4, value: 130 },
  //       { period: 5, value: 110 },
  //       { period: 6, value: 125 }
  //     ],
  //     yAxisMin: 60,
  //     yAxisMax: 160
  //   }
  // };
    
  //   // TODO: Replace dummy data with actual selected player data when available
  //   return selectedPlayer || dummyPlayer;
  // }, [selectedPlayer, primaryStats, sportTraits]);
  
  // // Individual state for each preference type
  // const [favorPreference, setFavorPreference] = React.useState("Prefer");
  // const [prospectPreference, setProspectPreference] = React.useState("Faith");
  // const [injuriesPreference, setInjuriesPreference] = React.useState("Ironman");
  // const [globalFavorPreference, setGlobalFavorPreference] = React.useState("Prefer");

  // // Combined state for backward compatibility with the component
  // const metricSelections = {
  //   0: favorPreference,
  //   1: prospectPreference,
  //   2: injuriesPreference,
  //   3: globalFavorPreference
  // };
  
  // const scoreData = {
  //   totalScore: 981,
  //   maxScore: 999,
  //   powerRatio: 0.6, // 60% Power
  //   dynastyRatio: 0.4, // 40% Dynasty Value
  //   segments: [
  //     { category: "primary", value: 45, fill: "#4A90E2" },
  //     { category: "secondary", value: 55, fill: "#F5A623" },
  //   ],
  //   metrics: [
  //     { 
  //       icon: Heart, 
  //       label: "Favor", 
  //       options: ["Prefer", "", "Dislike"] 
  //     },
  //     { 
  //       icon: Users, 
  //       label: "Prospect", 
  //       options: ["Faith", "", "Doubt"] 
  //     },
  //     { 
  //       icon: Shield, 
  //       label: "Injuries", 
  //       options: ["Prone", "", "Ironman"] 
  //     },
  //     { 
  //       icon: Globe, 
  //       label: "Global Favor", 
  //       options: ["Prefer", "", "Dislike"] 
  //     }
  //   ]
  // };

  // const handleMetricChange = (metricIndex: number, value: string) => {
  //   switch (metricIndex) {
  //     case 0: // Favor
  //       setFavorPreference(value);
  //       break;
  //     case 1: // Prospect
  //       setProspectPreference(value);
  //       break;
  //     case 2: // Injuries
  //       setInjuriesPreference(value);
  //       break;
  //     case 3: // Global Favor
  //       setGlobalFavorPreference(value);
  //       break;
  //     default:
  //       console.warn(`Unknown metric index: ${metricIndex}`);
  //   }
  // };

  // // Calculate dynamic chart data
  // const chartData = calculateChartData(
  //   scoreData.totalScore,
  //   scoreData.maxScore,
  //   scoreData.powerRatio,
  //   scoreData.dynastyRatio
  // );

  // // Load preferences from localStorage on mount
  // React.useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedFavor = localStorage.getItem('userPreference_favor');
  //     const savedProspect = localStorage.getItem('userPreference_prospect');
  //     const savedInjuries = localStorage.getItem('userPreference_injuries');
  //     const savedGlobalFavor = localStorage.getItem('userPreference_globalFavor');

  //     if (savedFavor) setFavorPreference(savedFavor);
  //     if (savedProspect) setProspectPreference(savedProspect);
  //     if (savedInjuries) setInjuriesPreference(savedInjuries);
  //     if (savedGlobalFavor) setGlobalFavorPreference(savedGlobalFavor);
  //   }
  // }, []);

  // // Save preferences to localStorage when they change
  // React.useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('userPreference_favor', favorPreference);
  //   }
  // }, [favorPreference]);

  // React.useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('userPreference_prospect', prospectPreference);
  //   }
  // }, [prospectPreference]);

  // React.useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('userPreference_injuries', injuriesPreference);
  //   }
  // }, [injuriesPreference]);

  // React.useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('userPreference_globalFavor', globalFavorPreference);
  //   }
  // }, [globalFavorPreference]);

  // React.useEffect(() => {
  //   setIsClient(true);
    
  //   const updateChartSize = () => {
  //     const viewportHeight = window.innerHeight;
  //     if (viewportHeight <= 620) {
  //       setChartMaxWidth(180);
  //     } else if (viewportHeight >= 900) {
  //       setChartMaxWidth(250);
  //     } else {
  //       // Linear interpolation between 180 and 250 for heights between 620 and 900
  //       const ratio = (viewportHeight - 620) / (900 - 620);
  //       setChartMaxWidth(Math.round(180 + (250 - 180) * ratio));
  //     }
  //   };

  //   updateChartSize();
  //   window.addEventListener('resize', updateChartSize);
  //   return () => window.removeEventListener('resize', updateChartSize);
  // }, []);



  // ==========================================
  // ==================== JSX =================
  // ==========================================






  return (
    <WidgetBox.Root fixedHeight className="h-full" {...rest}>
      <WidgetBox.Header noMargin fixedHeight>
        <WidgetBox.HeaderIcon as={SigmaSquare} className="" />
        Player Performance

        <div className="ml-auto">
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button.Root
                variant="neutral"
                mode="ghost"
                size="small"
                className="p-1 h-auto"
              >
                <Info className="hw-icon-sm text-text-soft-400 hover:text-text-soft-600" />
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content
              side="top"
              align="end"
              className="max-w-xs p-4"
            >
              <p className="text-center text-sm">
                Playbook Score evaluates your roster&apos;s strength across power and dynasty value metrics, 
                helping you understand your team&apos;s competitive position and long-term potential.
              </p>
            </Popover.Content>
          </Popover.Root>
        </div>

      </WidgetBox.Header>
      <WidgetBox.Content>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2 flex-shrink-0">

        {/* Performance Metrics */}
        <div className="flex flex-row gap-2 w-full mt-2">
          {/* Z-Score */}
          <div className=" w-full">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Compass className="hw-icon-xs mdh:hw-icon-sm text-pb_darkgray" />
                <span className="text-xs font-medium text-pb_darkgray">Playbook</span>
              </div>
              <span className="text-sm font-medium font-mono text-pb_darkgray">13.87</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardMinus className="hw-icon-xs mdh:hw-icon-sm text-pb_textlightestgray" />
                <span className="text-text-label-sm font-medium text-pb_textlightestgray">Standard</span>
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

      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}

// Default export
export default PlayerPerformanceWidget;

export function PlayerPerformanceWidgetEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Compass} className="" />
        Player Performance
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <div className='size-[108px] bg-bg-weak-50 rounded-lg flex items-center justify-center text-text-sub-600'>Empty</div>
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No Playbook Score data yet.
            <br />
            Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
