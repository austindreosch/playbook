'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { ChartCandlestick, TimerReset, Trophy } from 'lucide-react';
import React from 'react';
import { mockTrades } from '../dummyDataTradesPage';

// Sport-specific trade impact data
const getTradeImpactData = (sport, isWinningTrade) => {
  const impactData = {
    nba: {
      specialCategories: [
        {
          key: 'tradeValue',
          icon: <ChartCandlestick className="w-5 h-5" />,
          label: 'Trade Value',
          change: isWinningTrade ? +3 : -2,
          newRank: isWinningTrade ? 2 : 5,
          rankSuffix: isWinningTrade ? 'nd' : 'th',
          isImprovement: isWinningTrade
        },
        {
          key: 'age',
          icon: <TimerReset className="w-5 h-5" />,
          label: 'AGE',
          change: isWinningTrade ? -1.2 : +0.8,
          newRank: null,
          rankSuffix: null,
          isImprovement: isWinningTrade
        },
        {
          key: 'victoryPower',
          icon: <Trophy className="w-5 h-5" />,
          label: 'Victory Power',
          change: isWinningTrade ? -1 : -2,
          newRank: isWinningTrade ? 3 : 4,
          rankSuffix: isWinningTrade ? 'rd' : 'th',
          isImprovement: false
        }
      ],
      statCategories: [
        { abbreviation: 'FT%', label: 'Free Throw Percentage', improvement: true },
        { abbreviation: '3PM', label: '3-Pointers Made', improvement: true },
        { abbreviation: 'AST', label: 'Assists', improvement: true },
        { abbreviation: 'PTS', label: 'Points', improvement: true },
        { abbreviation: 'STL', label: 'Steals', improvement: true },
        { abbreviation: 'FG%', label: 'Field Goal Percentage', improvement: false },
        { abbreviation: 'REB', label: 'Rebounds', improvement: false },
        { abbreviation: 'BLK', label: 'Blocks', improvement: false },
        { abbreviation: 'TO', label: 'Turnovers', improvement: false }
      ]
    },
    nfl: {
      specialCategories: [
        {
          key: 'tradeValue',
          icon: <ChartCandlestick className="w-5 h-5" />,
          label: 'Trade Value',
          change: isWinningTrade ? +2 : -3,
          newRank: isWinningTrade ? 3 : 6,
          rankSuffix: isWinningTrade ? 'rd' : 'th',
          isImprovement: isWinningTrade
        },
        {
          key: 'age',
          icon: <TimerReset className="w-5 h-5" />,
          label: 'AGE',
          change: isWinningTrade ? -0.9 : +1.1,
          newRank: null,
          rankSuffix: null,
          isImprovement: isWinningTrade
        },
        {
          key: 'victoryPower',
          icon: <Trophy className="w-5 h-5" />,
          label: 'Victory Power',
          change: isWinningTrade ? +1 : -2,
          newRank: isWinningTrade ? 2 : 5,
          rankSuffix: isWinningTrade ? 'nd' : 'th',
          isImprovement: isWinningTrade
        }
      ],
      statCategories: [
        { abbreviation: 'PASS', label: 'Passing Yards', improvement: true },
        { abbreviation: 'RUSH', label: 'Rushing Yards', improvement: true },
        { abbreviation: 'REC', label: 'Receiving Yards', improvement: true },
        { abbreviation: 'TD', label: 'Touchdowns', improvement: true },
        { abbreviation: 'INT', label: 'Interceptions', improvement: false },
        { abbreviation: 'FUM', label: 'Fumbles', improvement: false },
        { abbreviation: 'SACK', label: 'Sacks Allowed', improvement: false }
      ]
    },
    mlb: {
      specialCategories: [
        {
          key: 'tradeValue',
          icon: <ChartCandlestick className="w-5 h-5" />,
          label: 'Trade Value',
          change: isWinningTrade ? +4 : -1,
          newRank: isWinningTrade ? 1 : 4,
          rankSuffix: isWinningTrade ? 'st' : 'th',
          isImprovement: isWinningTrade
        },
        {
          key: 'age',
          icon: <TimerReset className="w-5 h-5" />,
          label: 'AGE',
          change: isWinningTrade ? -1.5 : +0.7,
          newRank: null,
          rankSuffix: null,
          isImprovement: isWinningTrade
        },
        {
          key: 'victoryPower',
          icon: <Trophy className="w-5 h-5" />,
          label: 'Victory Power',
          change: isWinningTrade ? -1 : -3,
          newRank: isWinningTrade ? 4 : 6,
          rankSuffix: isWinningTrade ? 'th' : 'th',
          isImprovement: false
        }
      ],
      statCategories: [
        { abbreviation: 'AVG', label: 'Batting Average', improvement: true },
        { abbreviation: 'HR', label: 'Home Runs', improvement: true },
        { abbreviation: 'RBI', label: 'Runs Batted In', improvement: true },
        { abbreviation: 'SB', label: 'Stolen Bases', improvement: true },
        { abbreviation: 'OPS', label: 'On-base Plus Slugging', improvement: true },
        { abbreviation: 'ERA', label: 'Earned Run Average', improvement: false },
        { abbreviation: 'WHIP', label: 'Walks + Hits per Inning', improvement: false },
        { abbreviation: 'K/9', label: 'Strikeouts per 9 Innings', improvement: false }
      ]
    }
  };

  return impactData[sport] || impactData.nba;
};

export default function TradeImpactBar() {
  const { leagues, currentLeagueId } = useDashboardContext();

  if (!currentLeagueId || !leagues || leagues.length === 0) {
    return null;
  }

  const currentLeague = leagues.find(
    (league) => league.leagueDetails.leagueName === currentLeagueId
  );

  if (!currentLeague) {
    return null;
  }

  const selectedSport = currentLeague.leagueDetails.sport.toLowerCase();
  const trade = mockTrades[selectedSport];

  if (!trade) {
    return <div className="p-4 text-center">No trade data available for {selectedSport.toUpperCase()}.</div>;
  }

  const winProbability = trade.winProbability || 0.5;
  const isWinningTrade = winProbability > 0.5;
  
  const tradeAnalysis = getTradeImpactData(selectedSport, isWinningTrade);

  return (
    <div className="w-full">
      {/* Category Comparison Bar */}
      <div className="flex items-center h-9 w-full gap-[1px] rounded-md overflow-hidden">
        {/* Special categories */}
        {tradeAnalysis.specialCategories.map(cat => {
          const needsWhiteBox = (cat.newRank !== null && cat.newRank !== undefined);
          
          return (
            <div
              key={cat.key}
              className={`flex h-full items-center px-3 py-0.5 text-sm font-semibold flex-shrink-0
                ${cat.isImprovement === false ? 'bg-pb_red-400 text-pb_reddisabled' : 'bg-pb_green-400 text-pb_greendisabled'}`}
            >
              {cat.icon}
              {cat.change !== 0 && (
                  <span className={`font-semibold ${cat.key === 'age' ? "pl-3 pr-[3px]" : "px-2.5 pr-3"}`}>
                    {cat.change > 0 ? `+${cat.change}` : cat.change}
                  </span>
                )}
              {cat.newRank && needsWhiteBox && (
                <span className=" bg-white text-gray-700 w-10 text-center py-0.5 rounded text-sm font-semibold border">
                  {cat.newRank}{cat.rankSuffix}
                </span>
              )}
              {cat.newRank && !needsWhiteBox && (
                <span className="font-semibold">{cat.newRank}{cat.rankSuffix}</span>
              )}
              {/* Always show label if nothing else */}
              {cat.change === 0 && !cat.newRank && needsWhiteBox && (
                <span className="bg-white text-gray-700 px-1.5 py-0.5 rounded text-sm font-semibold border">
                  {cat.abbreviation || cat.label}
                </span>
              )}
              {cat.change === 0 && !cat.newRank && !needsWhiteBox && (
                <span className="font-semibold">{cat.abbreviation || cat.label}</span>
              )}
            </div>
          );
        })}
        {/* Stat categories */}
        {tradeAnalysis.statCategories.map(stat => (
          <div
            key={stat.abbreviation}
            className={`flex h-full items-center px-2 py-0.5 text-xs font-semibold flex-1 min-w-0 justify-center
              ${stat.improvement ? 'bg-pb_green-400 text-pb_greendisabled' : 'bg-pb_red-400 text-pb_reddisabled'}`}
            title={stat.label}
          >
            {stat.abbreviation}
          </div>
        ))}
      </div>
    </div>
  );
} 