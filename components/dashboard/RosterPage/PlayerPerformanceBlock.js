'use client';

import { ClipboardMinus, Compass, SigmaSquare, TrendingUp } from 'lucide-react';
import ImpactDistributionBlock from '../../common/ImpactDistributionBlock';

export default function PlayerPerformanceBlock() {
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

  // TODO: Column headers should be sport-specific
  const gameStatsColumns = ["DAY", "OPP", "MIN", "FGA", "FGM", "FTA", "FTM", "3PM", "PTS", "REB", "AST", "STL", "BLK", "TO", "PF"];

  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <SigmaSquare className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Performance</h3>
      </div>
      
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4 flex-shrink-0">

        {/* Performance Metrics */}
        <div className="flex flex-row gap-1 w-full">
          <div className="border border-pb_lightgray w-full p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Compass className="w-icon-xs h-icon-xs text-pb_darkgray" />
                <span className="text-xs font-medium text-pb_darkgray">Playbook</span>
              </div>
              <span className="text-sm font-bold text-pb_darkgray">94</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardMinus className="w-icon-xs h-icon-xs text-pb_textgray" />
                <span className="text-xs font-medium text-pb_textgray">Standard</span>
              </div>
              <span className="text-sm font-bold text-pb_textgray">99</span>
            </div>
          </div>
          <div className='border border-pb_lightgray w-full'>
            yo2
          </div>
        
        </div>

        {/* Impact Distribution */}
        <div>
          <h4 className="text-xs font-semibold text-pb_darkgray mb-1">Impact Distribution</h4>
          <ImpactDistributionBlock stats={impactStatsWithScores} />
        </div>
      </div>

      {/* Recent Games Table */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <h4 className="text-xs font-semibold text-pb_darkgray mb-1 flex-shrink-0">Recent Games</h4>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-2xs">
            <thead className="sticky top-0 bg-white">
              <tr className="text-pb_textgray">
                {gameStatsColumns.map((column, index) => (
                  <th key={index} className="text-left py-1 px-1 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {performanceData.recentGames.map((game, gameIndex) => (
                <tr key={gameIndex} className="border-t border-pb_lightergray">
                  <td className="py-0.5 px-1 text-pb_textgray">{game.date}</td>
                  <td className="py-0.5 px-1 text-pb_textgray">{game.opponent}</td>
                  <td className="py-0.5 px-1 font-mono text-pb_textgray">{game.minutes}</td>
                  {Object.entries(game.stats).map(([statKey, statValue], statIndex) => (
                    <td key={statIndex} className="py-0.5 px-1 font-mono text-pb_darkgray font-medium">
                      {statValue}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}