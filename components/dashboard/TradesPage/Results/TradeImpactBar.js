'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import useTradeContext from '@/stores/dashboard/useTradeContext';
import { BicepsFlexed, ChartCandlestick, Dumbbell, TimerReset, Trophy, Users } from 'lucide-react';
import React, { useEffect } from 'react';
import { mockTrades } from '../dummyDataTradesPage';

// Mock current averages and impact calculations
const getMockStatImpact = (sport) => {
  const mockData = {
    nba: {
      currentAverages: {
        'FT%': 0.785,
        '3PM': 2.1,
        'AST': 4.5,
        'PTS': 18.2,
        'STL': 1.1,
        'FG%': 0.462,
        'REB': 6.8,
        'BLK': 0.8,
        'TO': 2.3
      },
      incomingDeltas: {
        'FT%': 0.015,   // +1.5% improvement (small impact ~1.9%)
        '3PM': 0.8,     // +0.8 threes per game (huge impact ~38%)
        'AST': 2.5,     // +2.5 assists per game (massive impact ~55%)
        'PTS': 3.5,     // +3.5 points per game (moderate impact ~19%)
        'STL': 0.35,    // +0.35 steals per game (big impact ~32%)
        'FG%': -0.008,  // -0.8% decline (small impact ~1.7%)
        'REB': -2.8,    // -2.8 rebounds per game (huge impact ~41%)
        'BLK': -0.15,   // -0.15 blocks per game (moderate impact ~19%)
        'TO': 0.7       // +0.7 turnovers (big impact ~30%)
      }
    },
    nfl: {
      currentAverages: {
        'PASS': 3800,
        'RUSH': 1200,
        'REC': 900,
        'TD': 28,
        'INT': 12,
        'FUM': 3,
        'SACK': 35
      },
      incomingDeltas: {
        'PASS': 400,
        'RUSH': 200,
        'REC': 150,
        'TD': 5,
        'INT': -3,
        'FUM': -1,
        'SACK': -5
      }
    },
    mlb: {
      currentAverages: {
        'AVG': 0.265,
        'HR': 22,
        'RBI': 75,
        'SB': 12,
        'OPS': 0.780,
        'ERA': 3.85,
        'WHIP': 1.25,
        'K/9': 8.5
      },
      incomingDeltas: {
        'AVG': 0.015,
        'HR': 5,
        'RBI': 12,
        'SB': 3,
        'OPS': 0.045,
        'ERA': -0.35,
        'WHIP': -0.08,
        'K/9': -0.7
      }
    }
  };
  
  return mockData[sport] || mockData.nba;
};

// Calculate width based on impact percentage
const calculateSegmentWidth = (impactPercentage, isSpecialCategory = false) => {
  const minWidth = isSpecialCategory ? 9 : 5.5;
  const maxWidth = 18; // Cap at 18% to allow more variation
  
  // Scale impact percentage to width (higher impact = wider segment)
  // Using a more aggressive scale factor to show clear differences
  const scaledWidth = 5.5 + (Math.abs(impactPercentage) * 0.25); // Base + scaled impact
  
  // Apply min/max constraints
  return Math.max(minWidth, Math.min(maxWidth, scaledWidth));
};

// Sport-specific trade impact data
const getTradeImpactData = (sport, isWinningTrade) => {
  const mockImpact = getMockStatImpact(sport);
  
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
          isImprovement: isWinningTrade,
          impactPercentage: isWinningTrade ? 8.5 : -6.2, // Mock impact
          width: calculateSegmentWidth(isWinningTrade ? 8.5 : 6.2, true)
        },
        {
          key: 'age',
          icon: <TimerReset className="w-5 h-5" />,
          label: 'AGE',
          change: isWinningTrade ? -2 : +1,
          newRank: isWinningTrade ? 6 : 8,
          rankSuffix: isWinningTrade ? 'th' : 'th',
          isImprovement: isWinningTrade,
          impactPercentage: isWinningTrade ? 7.8 : -5.2, // Mock impact
          width: calculateSegmentWidth(isWinningTrade ? 7.8 : 5.2, true)
        },
        {
          key: 'power',
          icon: <BicepsFlexed className="w-5 h-5" />,
          label: 'Power',
          change: isWinningTrade ? -1 : -2,
          newRank: isWinningTrade ? 3 : 4,
          rankSuffix: isWinningTrade ? 'rd' : 'th',
          isImprovement: false,
          impactPercentage: -6.5, // Always negative for Victory Power
          width: calculateSegmentWidth(6.5, true)
        },
        {
          key: 'depth',
          icon: <Users className="w-5 h-5" />,
          label: 'Depth',
          change: isWinningTrade ? +2 : -1,
          newRank: isWinningTrade ? 4 : 7,
          rankSuffix: isWinningTrade ? 'th' : 'th',
          isImprovement: isWinningTrade,
          impactPercentage: isWinningTrade ? 5.8 : -4.2,
          width: calculateSegmentWidth(isWinningTrade ? 5.8 : 4.2, true)
        }
      ],
      statCategories: [
        { 
          abbreviation: 'FT%', 
          label: 'Free Throw Percentage', 
          improvement: true,
          currentAvg: mockImpact.currentAverages['FT%'],
          delta: mockImpact.incomingDeltas['FT%'],
          impactPercentage: (mockImpact.incomingDeltas['FT%'] / mockImpact.currentAverages['FT%']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['FT%'] / mockImpact.currentAverages['FT%']) * 100)
        },
        { 
          abbreviation: '3PM', 
          label: '3-Pointers Made', 
          improvement: true,
          currentAvg: mockImpact.currentAverages['3PM'],
          delta: mockImpact.incomingDeltas['3PM'],
          impactPercentage: (mockImpact.incomingDeltas['3PM'] / mockImpact.currentAverages['3PM']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['3PM'] / mockImpact.currentAverages['3PM']) * 100)
        },
        { 
          abbreviation: 'AST', 
          label: 'Assists', 
          improvement: true,
          currentAvg: mockImpact.currentAverages['AST'],
          delta: mockImpact.incomingDeltas['AST'],
          impactPercentage: (mockImpact.incomingDeltas['AST'] / mockImpact.currentAverages['AST']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['AST'] / mockImpact.currentAverages['AST']) * 100)
        },
        { 
          abbreviation: 'PTS', 
          label: 'Points', 
          improvement: true,
          currentAvg: mockImpact.currentAverages['PTS'],
          delta: mockImpact.incomingDeltas['PTS'],
          impactPercentage: (mockImpact.incomingDeltas['PTS'] / mockImpact.currentAverages['PTS']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['PTS'] / mockImpact.currentAverages['PTS']) * 100)
        },
        { 
          abbreviation: 'STL', 
          label: 'Steals', 
          improvement: true,
          currentAvg: mockImpact.currentAverages['STL'],
          delta: mockImpact.incomingDeltas['STL'],
          impactPercentage: (mockImpact.incomingDeltas['STL'] / mockImpact.currentAverages['STL']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['STL'] / mockImpact.currentAverages['STL']) * 100)
        },
        { 
          abbreviation: 'FG%', 
          label: 'Field Goal Percentage', 
          improvement: false,
          currentAvg: mockImpact.currentAverages['FG%'],
          delta: mockImpact.incomingDeltas['FG%'],
          impactPercentage: (mockImpact.incomingDeltas['FG%'] / mockImpact.currentAverages['FG%']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['FG%'] / mockImpact.currentAverages['FG%']) * 100)
        },
        { 
          abbreviation: 'REB', 
          label: 'Rebounds', 
          improvement: false,
          currentAvg: mockImpact.currentAverages['REB'],
          delta: mockImpact.incomingDeltas['REB'],
          impactPercentage: (mockImpact.incomingDeltas['REB'] / mockImpact.currentAverages['REB']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['REB'] / mockImpact.currentAverages['REB']) * 100)
        },
        { 
          abbreviation: 'BLK', 
          label: 'Blocks', 
          improvement: false,
          currentAvg: mockImpact.currentAverages['BLK'],
          delta: mockImpact.incomingDeltas['BLK'],
          impactPercentage: (mockImpact.incomingDeltas['BLK'] / mockImpact.currentAverages['BLK']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['BLK'] / mockImpact.currentAverages['BLK']) * 100)
        },
        { 
          abbreviation: 'TO', 
          label: 'Turnovers', 
          improvement: false,
          currentAvg: mockImpact.currentAverages['TO'],
          delta: mockImpact.incomingDeltas['TO'],
          impactPercentage: (mockImpact.incomingDeltas['TO'] / mockImpact.currentAverages['TO']) * 100,
          width: calculateSegmentWidth((mockImpact.incomingDeltas['TO'] / mockImpact.currentAverages['TO']) * 100)
        }
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
          change: isWinningTrade ? -1 : +2,
          newRank: isWinningTrade ? 5 : 7,
          rankSuffix: isWinningTrade ? 'th' : 'th',
          isImprovement: isWinningTrade
        },
        {
          key: 'power',
          icon: <BicepsFlexed className="w-5 h-5" />,
          label: 'Power',
          change: isWinningTrade ? +1 : -2,
          newRank: isWinningTrade ? 2 : 5,
          rankSuffix: isWinningTrade ? 'nd' : 'th',
          isImprovement: false
        },
        {
          key: 'depth',
          icon: <Users className="w-5 h-5" />,
          label: 'Depth',
          change: isWinningTrade ? +1 : -2,
          newRank: isWinningTrade ? 5 : 8,
          rankSuffix: isWinningTrade ? 'th' : 'th',
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
          change: isWinningTrade ? -1 : +3,
          newRank: isWinningTrade ? 4 : 9,
          rankSuffix: isWinningTrade ? 'th' : 'th',
          isImprovement: isWinningTrade
        },
        {
          key: 'power',
          icon: <BicepsFlexed className="w-5 h-5" />,
          label: 'Power',
          change: isWinningTrade ? -1 : -3,
          newRank: isWinningTrade ? 4 : 6,
          rankSuffix: isWinningTrade ? 'th' : 'th',
          isImprovement: false
        },
        {
          key: 'depth',
          icon: <Users className="w-5 h-5" />,
          label: 'Depth',
          change: isWinningTrade ? +3 : 0,
          newRank: isWinningTrade ? 3 : 6,
          rankSuffix: isWinningTrade ? 'rd' : 'th',
          isImprovement: isWinningTrade
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
  const { 
    setTradeImpact, 
    setCurrentTrade,
    setWinProbability,
    getSortedStatCategories,
    getSortedSpecialCategories 
  } = useTradeContext();

  const currentLeague = leagues?.find(
    (league) => league.leagueDetails.leagueName === currentLeagueId
  );
  
  const selectedSport = currentLeague?.leagueDetails.sport.toLowerCase() || 'nba';
  const trade = mockTrades[selectedSport];

  useEffect(() => {
    if (!trade || !currentLeagueId) return;

    const winProbability = trade.winProbability || 0.5;
    const isWinningTrade = winProbability > 0.5;
    const tradeAnalysis = getTradeImpactData(selectedSport, isWinningTrade);

    // Update the store with trade data
    setCurrentTrade(trade);
    setWinProbability(winProbability);
    setTradeImpact({
      specialCategories: tradeAnalysis.specialCategories,
      statCategories: tradeAnalysis.statCategories,
      winProbability: winProbability,
      isWinningTrade: isWinningTrade
    });
  }, [trade, selectedSport, currentLeagueId, setCurrentTrade, setWinProbability, setTradeImpact]);

  if (!currentLeagueId || !leagues || leagues.length === 0 || !currentLeague || !trade) {
    return null;
  }

  const sortedStatCategories = getSortedStatCategories();
  const sortedSpecialCategories = getSortedSpecialCategories();

  return (
    <div className="w-full">
      {/* Category Comparison Bar */}
      <div className="flex items-center h-7 w-full gap-1">
        {/* Stat categories - 80% width */}
        <div className="flex items-center w-full h-full gap-[1px] rounded-md overflow-hidden">
          {sortedStatCategories.map(stat => (
            <div
              key={stat.abbreviation}
              className={`flex h-full items-center px-2.5 text-xs font-semibold min-w-0 justify-center
                ${stat.improvement ? 'bg-pb_green-400 text-pb_greendisabled' : 'bg-pb_red-400 text-pb_reddisabled'}`}
              style={{ width: `${stat.width}%` }}
              title={stat.label}
            >
              {stat.abbreviation}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
} 