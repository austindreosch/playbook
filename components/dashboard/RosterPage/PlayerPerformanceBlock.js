'use client';

import { Separator } from '@/components/ui/separator';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Calendar, ClipboardMinus, Clock, Compass, SigmaSquare, Swords, Timer, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import ImpactDistributionBlock from '../../common/ImpactDistributionBlock';

export default function PlayerPerformanceBlock() {
  // Get current league context for sport-specific configurations
  const { getCurrentLeague } = useDashboardContext();
  const currentLeague = getCurrentLeague();
  const currentSport = currentLeague?.leagueDetails?.sport?.toLowerCase() || 'nba';
  
  // State for hover effects on shooting columns
  const [hoveredShootingPair, setHoveredShootingPair] = useState(null); // 'fg' or 'ft'
  
  // Define sport-specific context columns and stat columns
  const getContextColumns = (sport) => {
    switch (sport) {
      case 'nba':
        return [
          { key: "Date", icon: <Calendar className="w-icon-xs h-icon-xs" />, label: "Date" },
          { key: "Opp", icon: <Swords className="w-icon-xs h-icon-xs" />, label: "Opponent" },
          { key: "MIN", icon: <Timer className="w-icon-xs h-icon-xs" />, label: "Minutes" },
          "PF"
        ];
      case 'nfl':
        return [
          { key: "Date", icon: <Calendar className="w-icon-xs h-icon-xs" />, label: "Date" },
          { key: "Opp", icon: <Swords className="w-icon-xs h-icon-xs" />, label: "Opponent" },
          { key: "SNAP", icon: <Timer className="w-icon-xs h-icon-xs" />, label: "Snaps" },
          "PEN"
        ]; // TODO: Confirm NFL context columns
      case 'mlb':
        return [
          { key: "Date", icon: <Calendar className="w-icon-xs h-icon-xs" />, label: "Date" },
          { key: "Opp", icon: <Swords className="w-icon-xs h-icon-xs" />, label: "Opponent" },
          { key: "INN", icon: <Timer className="w-icon-xs h-icon-xs" />, label: "Innings" },
          "ERA"
        ]; // TODO: Confirm MLB context columns
      default:
        return [
          { key: "Date", icon: <Calendar className="w-icon-xs h-icon-xs" />, label: "Date" },
          { key: "Opp", icon: <Swords className="w-icon-xs h-icon-xs" />, label: "Opponent" },
          { key: "MIN", icon: <Timer className="w-icon-xs h-icon-xs" />, label: "Minutes" },
          "PF"
        ]; // Default to NBA
    }
  };

  // Get league categories or predefined stats based on league format
  const getLeagueStatsColumns = (sport, leagueFormat, leagueCategories = null) => {
    // Get context columns (always included)
    const contextCols = getContextColumns(sport);
    
    if (leagueFormat === 'categories' && leagueCategories && leagueCategories.length > 0) {
      // Category league: use actual league categories
      return [...contextCols, ...leagueCategories];
    } else {
      // Points league: use predefined stats based on sport
      const pointsStats = getPointsLeagueStats(sport);
      return [...contextCols, ...pointsStats];
    }
  };

  // Define predefined stats for points leagues by sport
  const getPointsLeagueStats = (sport) => {
    switch (sport) {
      case 'nba':
        return ["FGA", "FGM", "FTA", "FTM", "3PM", "PTS", "REB", "AST", "STL", "BLK", "TO"];
      case 'nfl':
        // TODO: Define NFL-specific points stats
        return ["PASS_ATT", "PASS_COMP", "PASS_YDS", "PASS_TD", "RUSH_ATT", "RUSH_YDS", "RUSH_TD", "REC", "REC_YDS", "REC_TD"];
      case 'mlb':
        // TODO: Define MLB-specific points stats  
        return ["AB", "H", "R", "RBI", "HR", "BB", "SO", "AVG"];
      default:
        return ["FGA", "FGM", "FTA", "FTM", "3PM", "PTS", "REB", "AST", "STL", "BLK", "TO"];
    }
  };

  // Get league format and categories for dynamic stats display
  const leagueFormat = currentLeague?.leagueDetails?.scoring?.toLowerCase() || 'points'; // 'categories' or 'points'
  const leagueCategories = currentLeague?.leagueSettings?.categories || null; // Actual league categories
  
  const contextColumns = getContextColumns(currentSport);
  const gameStatsColumns = getLeagueStatsColumns(currentSport, leagueFormat, leagueCategories);

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
          "FGA": 7, "FGM": 10, "FTA": 3, "FTM": 5, "3PM": 3,
          "PTS": 18, "REB": 7, "AST": 7, "STL": 2, "BLK": 1, "TO": 2, "PF": 2
        }
      },
      {
        date: "12/3",
        opponent: "DAL",
        minutes: "40:55", 
        stats: {
          "FGA": 11, "FGM": 19, "FTA": 4, "FTM": 7, "3PM": 1,
          "PTS": 26, "REB": 16, "AST": 13, "STL": 2, "BLK": 0, "TO": 5, "PF": 5
        }
      },
      {
        date: "12/3",
        opponent: "GSW",
        minutes: "34:47",
        stats: {
          "FGA": 7, "FGM": 10, "FTA": 3, "FTM": 5, "3PM": 3,
          "PTS": 18, "REB": 7, "AST": 7, "STL": 2, "BLK": 1, "TO": 2, "PF": 2
        }
      },
      {
        date: "12/3", 
        opponent: "DAL",
        minutes: "40:55",
        stats: {
          "FGA": 11, "FGM": 19, "FTA": 4, "FTM": 7, "3PM": 1,
          "PTS": 26, "REB": 16, "AST": 13, "STL": 2, "BLK": 0, "TO": 5, "PF": 5
        }
      },
      {
        date: "12/3",
        opponent: "GSW", 
        minutes: "34:47",
        stats: {
          "FGA": 7, "FGM": 10, "FTA": 3, "FTM": 5, "3PM": 3,
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

  // gameStatsColumns is now defined dynamically above based on sport

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
        <div className="flex-1 overflow-auto">
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
                  let isFirstOfMergedPair = false;
                  let isSecondOfMergedPair = false;
                  let mergedLabel = '';
                  
                  if (hoveredShootingPair === 'fg' && columnKey === 'FGA') {
                    isFirstOfMergedPair = true;
                    mergedLabel = 'FG%';
                  } else if (hoveredShootingPair === 'fg' && columnKey === 'FGM') {
                    isSecondOfMergedPair = true;
                  } else if (hoveredShootingPair === 'ft' && columnKey === 'FTA') {
                    isFirstOfMergedPair = true;
                    mergedLabel = 'FT%';
                  } else if (hoveredShootingPair === 'ft' && columnKey === 'FTM') {
                    isSecondOfMergedPair = true;
                  }
                  
                  let headerClass = isContextColumn 
                    ? "py-1 px-1 font-normal text-pb_textlightergray w-8 relative"
                    : "py-1 px-1 font-medium text-pb_darkgray w-8 relative";
                  
                  // Add background for merged headers
                  if (isFirstOfMergedPair || isSecondOfMergedPair) {
                    headerClass += "";
                  }
                  
                  return (
                    <th key={index} className={headerClass}>
                      {isFirstOfMergedPair && (
                        <>
                          <div className="absolute left-0 z-10 pointer-events-none"
                               style={{
                                 width: 'calc(200% + 2px)',
                                 height: '1px',
                                 backgroundColor: 'rgb(209, 213, 219)',
                                 top: '50%',
                                 marginTop: '-0.5px'
                               }}></div>
                          <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-20 pointer-events-none"
                               style={{width: 'calc(200% + 2px)', left: '0'}}>
                            <span className="bg-white px-1 font-medium text-pb_darkgray ">
                              {mergedLabel}
                            </span>
                          </div>
                        </>
                      )}
                      {!isFirstOfMergedPair && !isSecondOfMergedPair && (
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
                    if (hoveredShootingPair === 'fg' && columnKey === 'FGM') return null;
                    if (hoveredShootingPair === 'ft' && columnKey === 'FTM') return null;
                    
                    // Get the value for this column
                    let cellValue = '';
                    let colSpan = 1;
                    
                    switch (columnKey) {
                      case 'Date':
                        cellValue = game.date;
                        break;
                      case 'Opp':
                        cellValue = game.opponent;
                        break;
                      case 'MIN':
                        cellValue = game.minutes;
                        break;
                      case 'SNAP':
                      case 'INN':
                        cellValue = game.minutes;
                        break;
                      default:
                        // For stat columns, get from game.stats
                        cellValue = game.stats[columnKey] || '';
                        
                        // Handle merged percentage display
                        if (hoveredShootingPair === 'fg' && columnKey === 'FGA') {
                          const fga = game.stats['FGA'] || 0;
                          const fgm = game.stats['FGM'] || 0;
                          const fgPct = fga > 0 ? ((fgm / fga) * 100).toFixed(1) : '0.0';
                          cellValue = `${fgPct}%`;
                          colSpan = 2;
                        } else if (hoveredShootingPair === 'ft' && columnKey === 'FTA') {
                          const fta = game.stats['FTA'] || 0;
                          const ftm = game.stats['FTM'] || 0;
                          const ftPct = fta > 0 ? ((ftm / fta) * 100).toFixed(1) : '0.0';
                          cellValue = `${ftPct}%`;
                          colSpan = 2;
                        }
                        break;
                    }
                    
                    // Add special styling for merged percentage cells
                    const isMergedPercentage = (hoveredShootingPair === 'fg' && columnKey === 'FGA') || 
                                              (hoveredShootingPair === 'ft' && columnKey === 'FTA');
                    
                    let cellClass = isContextColumn 
                      ? "py-0.5 px-1 text-pb_textlightergray text-center w-8"
                      : "py-0.5 px-1 font-mono text-pb_textgray font-medium text-center w-8";
                    
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
                          if (columnKey === 'FGA' || columnKey === 'FGM') {
                            setHoveredShootingPair('fg');
                          } else if (columnKey === 'FTA' || columnKey === 'FTM') {
                            setHoveredShootingPair('ft');
                          }
                        }}
                        onMouseLeave={() => {
                          if (columnKey === 'FGA' || columnKey === 'FGM' || columnKey === 'FTA' || columnKey === 'FTM') {
                            setHoveredShootingPair(null);
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