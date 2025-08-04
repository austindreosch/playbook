'use client';

import * as React from 'react';
import { useState } from 'react';

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

import ImpactDistributionBlock from '../../../common/ImpactDistributionBlock';
import FillArrowUp from '@/components/icons/FillArrowUp';
import FillArrowDown from '@/components/icons/FillArrowDown';
import { formatStatValue, getSportConfig, getSportPrimaryStats, getSportTraits } from '@/lib/utils/sportConfig';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { useMemo } from 'react';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface PlayerPerformanceBlueprint {
  metrics: Array<{                    // SOURCE: useDashboardContext().getSelectedPlayer().performanceMetrics
    type: "Playbook" | "Standard";
    value: number;
  }>;

  recentGames: Array<{               // SOURCE: useDashboardContext().getSelectedPlayer().recentGames + sport-specific processing
    date: string;
    opponent: string;
    minutes: string;
    stats: Record<string, number>;
  }>;

  impactStats: Array<{               // SOURCE: calculateZScores(selectedPlayer.stats) [internal calculation]
    name: string;
    zScore: number;
  }>;

  sportConfig: {                     // SOURCE: getSportConfig(currentLeague.sport)
    contextColumns: Array<any>;
    pointsStats: string[];
    percentagePairs: Array<{
      made: string;
      attempt: string;
      display: string;
    }>;
    normalization: {
      baseStatKey: string;
      targetValue: number;
      targetLabel: string;
      excludeStats: string[];
      parseTime: boolean;
    };
  };

  gameStatsColumns: Array<any>;      // SOURCE: getGameStatsColumns(sport, leagueFormat, leagueCategories)
}

interface PlayerPerformanceWidgetProps extends React.ComponentPropsWithoutRef<typeof WidgetBox.Root> {
  blueprint?: PlayerPerformanceBlueprint;
}

// ============================================================
// ===================== DATA COLLECTION ======================
// ============================================================

const generatePlayerPerformanceData = (): PlayerPerformanceBlueprint => {
  // Sport-specific configuration (dummy data for development)
  const sportConfig = {
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
      baseStatKey: "MIN",
      targetValue: 36,
      targetLabel: "36",
      excludeStats: ["Date", "Opp", "MIN", "PF", "FG%", "FT%"],
      parseTime: true
    }
  };
  
  return {
    metrics: [
      {
        type: "Playbook",
        value: 13.87,
      },
      {
        type: "Standard", 
        value: 13.46,
      }
    ],
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
    ],
    impactStats: [
      { name: "AST", zScore: 2.3 },
      { name: "PTS", zScore: 1.8 },
      { name: "FG%", zScore: 1.2 },
      { name: "3PM", zScore: 0.9 },
      { name: "FT%", zScore: 0.7 },
      { name: "REB", zScore: 0.5 },
      { name: "STL", zScore: 0.3 },
      { name: "BLK", zScore: -0.2 },
      { name: "TO", zScore: -1.1 }
    ],
    sportConfig,
    gameStatsColumns: [...sportConfig.contextColumns, ...sportConfig.pointsStats]
  };
};

// Helper functions for data processing
const findPercentagePair = (columnKey, sportConfig) => {
  return sportConfig.percentagePairs.find(pair => 
    pair.made === columnKey || pair.attempt === columnKey
  );
};

const calculatePercentage = (made, attempt) => {
  return attempt > 0 ? ((made / attempt) * 100).toFixed(1) : '0.0';
};

const parseTimeToMinutes = (timeString) => {
  if (typeof timeString !== 'string' || !timeString.includes(':')) {
    return parseFloat(timeString) || 0;
  }
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes + (seconds / 60);
};

const normalizeStatValue = (statValue, baseValue, targetValue, config) => {
  if (baseValue === 0) return 0;
  
  const parsedBaseValue = config.parseTime ? parseTimeToMinutes(baseValue) : parseFloat(baseValue);
  
  if (parsedBaseValue === 0) return 0;
  
  const normalizedValue = (parseFloat(statValue) * targetValue) / parsedBaseValue;
  return normalizedValue % 1 === 0 ? normalizedValue.toString() : normalizedValue.toFixed(1);
};

const shouldNormalizeStat = (columnKey, config) => {
  return !config.excludeStats.includes(columnKey);
};

const getCellValue = (columnKey, game, contextColumns, showPercentages, hoveredNormalizedColumn, sportConfig) => {
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
      let baseValue = game.stats[columnKey] !== undefined ? game.stats[columnKey] : '';
      
      if (showPercentages) {
        const pair = sportConfig.percentagePairs.find(p => p.attempt === columnKey);
        if (pair) {
          const made = game.stats[pair.made] || 0;
          const attempt = game.stats[pair.attempt] || 0;
          return `${calculatePercentage(made, attempt)}%`;
        }
      }
      
      if (hoveredNormalizedColumn === columnKey && shouldNormalizeStat(columnKey, sportConfig.normalization)) {
        const baseStatValue = game.minutes;
        if (baseStatValue && baseValue !== '') {
          return normalizeStatValue(
            baseValue, 
            baseStatValue, 
            sportConfig.normalization.targetValue, 
            sportConfig.normalization
          );
        }
      }
      
      return baseValue;
  }
};





// ============================================================
// =================== COMPONENT DEFINITION ==================
// ============================================================

function PlayerPerformanceWidget({
  blueprint: providedBlueprint,
  ...rest
}: PlayerPerformanceWidgetProps) {
  // Use provided blueprint OR generate dummy data (never access external sources directly)
  const blueprint = providedBlueprint || generatePlayerPerformanceData();
  
  // State for hover effects on percentage columns and normalization
  const [showPercentages, setShowPercentages] = useState(false);
  const [hoveredNormalizedColumn, setHoveredNormalizedColumn] = useState(null);


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
                Player Performance shows key metrics, recent game statistics, and impact distribution 
                to help you evaluate your player&apos;s current form and contributions.
              </p>
            </Popover.Content>
          </Popover.Root>
        </div>

      </WidgetBox.Header>
      <WidgetBox.Content>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2 flex-shrink-0 justify-between">
        {/* Performance Metrics */}
        <div className="flex flex-row w-full">
          {/* Z-Score */}
          <div className="border-l border-gray-150 pl-3 w-full space-y-3.5 pt-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Compass className="hw-icon-xs text-black" />
                <span className="text-label-md font-medium text-black">Playbook</span>
              </div>
              <span className="text-paragraph-lg text-center font-medium text-black">{blueprint.metrics[0]?.value || 0}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <ClipboardMinus className="hw-icon-xs text-gray-200" />
                <span className="text-label-md font-medium text-gray-200">Standard</span>
              </div>
              <span className="text-paragraph-lg text-center font-medium text-gray-200">{blueprint.metrics[1]?.value || 0}</span>
            </div>
          </div>
        </div>

        {/* Impact Distribution */}
        <div className='relative mt-2'>
          <h4 className="absolute -top-5 left-[1px] text-label-md font-medium text-black">Impact Distribution</h4>
          <ImpactDistributionBlock stats={blueprint.impactStats} />
        </div>
      </div>

      {/* Recent Games Table */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h4 className="text-label-lg font-semibold text-black mb-1 flex-shrink-0">Recent Games</h4>
          <div className="flex-1 rounded-t-md overflow-hidden" >
          <table className="w-full text-label-md table-fixed">
            <thead className="sticky top-0">
              <tr className="">
                {blueprint.gameStatsColumns.map((column, index) => {
                  // Handle both icon objects and string columns
                  const columnKey = typeof column === 'object' ? column.key : column;
                  const isContextColumn = blueprint.sportConfig.contextColumns.some(col => 
                    typeof col === 'object' ? col.key === columnKey : col === columnKey
                  );
                  
                  // Determine display text and merged state
                  let displayText = typeof column === 'object' ? column.icon : column;
                  let shouldShowPercentageHeader = false;
                  let percentageLabel = '';
                  
                  if (showPercentages) {
                    // Check if this column should show percentage header (FGA, FTA)
                    const pair = blueprint.sportConfig.percentagePairs.find(pair => pair.attempt === columnKey);
                    if (pair) {
                      shouldShowPercentageHeader = true;
                      percentageLabel = pair.display;
                    }
                    
                    // Hide text for made columns (FGM, FTM)
                    const isMadeColumn = blueprint.sportConfig.percentagePairs.some(pair => pair.made === columnKey);
                    if (isMadeColumn) {
                      displayText = '';
                    }
                  }
                  
                  const headerClass = cnExt(
                    'py-1 px-1 w-8 relative bg-gray-25 ',
                    isContextColumn ? 'font-normal text-gray-400' : 'font-bold text-gray-400'
                  );
                  
                  
                  return (
                    <th key={index} className={headerClass}>
                      {/* Floating Per 36m label above header */}
                      {hoveredNormalizedColumn === columnKey && shouldNormalizeStat(columnKey, blueprint.sportConfig.normalization) && !showPercentages && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-50 pointer-events-none" 
                        style={{top: '-20px'}}>
                          <div className="bg-gray-100 text-black ring-1 ring-gray-150 shadow-sm text-paragraph-sm px-1 py-[1px] rounded text-center leading-none min-w-max">
                             Per {blueprint.sportConfig.normalization.targetLabel}<br/>Min
                          </div>
                        </div>
                      )}
                      {shouldShowPercentageHeader && (
                        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-20 pointer-events-none" 
                             style={{width: 'calc(200% + 2px)', left: '0'}}>
                          <span className="px-1 font-medium text-black">
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
                {blueprint.recentGames.map((game, gameIndex) => (
                 <tr key={gameIndex} className={`border-b border-gray-25`}>

                  {blueprint.gameStatsColumns.map((column, columnIndex) => {
                    // Handle both icon objects and string columns
                    const columnKey = typeof column === 'object' ? column.key : column;
                    const isContextColumn = blueprint.sportConfig.contextColumns.some(col => 
                      typeof col === 'object' ? col.key === columnKey : col === columnKey
                    );
                    
                    // Check if this cell should be hidden due to merging
                    const pair = findPercentagePair(columnKey, blueprint.sportConfig);
                    if (showPercentages && pair && columnKey === pair.made) {
                      return null;
                    }
                    
                    // Get the value for this column
                    let cellValue = getCellValue(columnKey, game, blueprint.sportConfig.contextColumns, showPercentages, hoveredNormalizedColumn, blueprint.sportConfig);
                    let colSpan = 1;
                    
                    // Handle merged percentage display
                    if (showPercentages && pair && columnKey === pair.attempt) {
                      colSpan = 2;
                    }
                    
                    // Add special styling for merged percentage cells
                    const isMergedPercentage = showPercentages && pair && columnKey === pair.attempt;
                    
                    let cellClass = isContextColumn 
                      ? "py-1 px-1 text-paragraph-sm text-gray-300 font-medium text-center w-8"
                      : "py-1 px-1 text-paragraph-sm text-gray-300 font-medium text-center w-8";
                    
                    // Add light gray text when hovering over shooting columns
                    if (showPercentages && pair) {
                      cellClass = cellClass.replace("text-black", "text-pb_textlightestgray");
                    }
                    
                    // Add light gray text when hovering over this specific normalizable stat column
                    if (hoveredNormalizedColumn === columnKey && shouldNormalizeStat(columnKey, blueprint.sportConfig.normalization)) {
                      cellClass = cellClass.replace("text-black", "text-gray-300 tracking-tighter");
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
                          const hoveredPair = findPercentagePair(columnKey, blueprint.sportConfig);
                          if (hoveredPair) {
                            setShowPercentages(true);
                          }
                          
                          // Check if this is a normalizable stat column
                          if (shouldNormalizeStat(columnKey, blueprint.sportConfig.normalization)) {
                            setHoveredNormalizedColumn(columnKey);
                          }
                        }}
                        onMouseLeave={() => {
                          const hoveredPair = findPercentagePair(columnKey, blueprint.sportConfig);
                          if (hoveredPair) {
                            setShowPercentages(false);
                          }
                          
                          // Clear normalized column hover
                          if (shouldNormalizeStat(columnKey, blueprint.sportConfig.normalization)) {
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
