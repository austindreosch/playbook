'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Clock, Crown, TrendingUp, Trophy } from 'lucide-react';
import React from 'react';
import { mockTrades } from '../dummyDataTradesPage';

// Example schema (replace with real data when available)
const tradeAnalysis = {
  specialCategories: [
    {
      key: 'tradeValue',
      icon: <TrendingUp className="w-3 h-3 mr-1" />, // Lucide icon
      label: 'Trade Value',
      change: +3,
      newRank: 2,
      rankSuffix: 'nd',
      isImprovement: true
    },
    {
      key: 'age',
      icon: <Clock className="w-3 h-3 mr-1" />, // Lucide icon
      label: 'Age',
      change: 0,
      newRank: null,
      rankSuffix: null,
      isImprovement: null
    },
    {
      key: 'victoryPower',
      icon: <Trophy className="w-3 h-3 mr-1" />, // Lucide icon
      label: 'Victory Power',
      change: -2,
      newRank: 4,
      rankSuffix: 'th',
      isImprovement: false
    }
  ],
  statCategories: [
    { abbreviation: 'FG%', label: 'Field Goal Percentage', improvement: true },
    { abbreviation: '3PM', label: '3-Pointers Made', improvement: true },
    { abbreviation: 'AST', label: 'Assists', improvement: true },
    { abbreviation: 'PTS', label: 'Points', improvement: true },
    { abbreviation: 'STL', label: 'Steals', improvement: true },
    { abbreviation: 'REB', label: 'Rebounds', improvement: false },
    { abbreviation: 'BLK', label: 'Blocks', improvement: false },
    { abbreviation: 'TO', label: 'Turnovers', improvement: false }
  ]
};

export default function TradeOutcomeBlock() {
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

  // Sport-specific stats that are improving/declining
  const statChanges = {
    nba: {
      improving: ['FT%', '3PM', 'AST', 'PTS', 'STL'],
      declining: ['FG%', 'REB', 'BLK', 'TO']
    },
    nfl: {
      improving: ['PASS YDS', 'RUSH YDS', 'REC', 'TD'],
      declining: ['INT', 'FUM', 'SACKS']
    },
    mlb: {
      improving: ['AVG', 'HR', 'RBI', 'SB', 'OPS'],
      declining: ['ERA', 'WHIP', 'K/9']
    }
  };

  const stats = statChanges[selectedSport] || statChanges.nba;
  const winProbability = trade.winProbability || 0.5;
  const isWinningTrade = winProbability > 0.5;
  // Calculate mock values for demonstration


  return (
    <div className="w-full h-full">
      {/* Category Comparison Bar */}
      <div className="flex items-center h-8 gap-[1px] rounded-md">
        {/* Special categories */}
        {tradeAnalysis.specialCategories.map(cat => (
          <div
            key={cat.key}
            className={`flex h-full items-center px-2 py-0.5 text-xs font-medium
              ${cat.isImprovement === false ? 'bg-pb_red-400 text-pb_reddisabled' : 'bg-pb_green-400 text-pb_greendisabled'}`}
          >
            {cat.icon}
            {cat.change !== 0 && (
              <span>{cat.change > 0 ? `+${cat.change}` : cat.change}</span>
            )}
            {cat.newRank && (
              <span className="ml-1">{cat.newRank}{cat.rankSuffix}</span>
            )}
            {/* Always show label if nothing else */}
            {cat.change === 0 && !cat.newRank && (
              <span>{cat.abbreviation || cat.label}</span>
            )}
          </div>
        ))}
        {/* Stat categories */}
        {tradeAnalysis.statCategories.map(stat => (
          <div
            key={stat.abbreviation}
            className={`flex h-full items-center  px-2 py-0.5 text-xs font-medium
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