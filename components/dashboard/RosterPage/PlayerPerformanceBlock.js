'use client';

import { SigmaSquare, TrendingUp } from 'lucide-react';

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
    // TODO: Impact categories should be sport-specific (NBA/NFL/MLB)
    impactDistribution: {
      positive: ["AST", "PTS", "FG%", "3PM", "FT%"], // Strong positive impact
      neutral: ["REB", "STL"], // Moderate impact  
      negative: ["BLK", "TO"] // Negative impact
    },
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

  const getImpactColor = (statType) => {
    const { positive, neutral, negative } = performanceData.impactDistribution;
    
    if (positive.includes(statType)) {
      return "bg-pb_green text-white";
    } else if (negative.includes(statType)) {
      return "bg-pb_red text-white"; 
    } else if (neutral.includes(statType)) {
      return "bg-pb_lightergray text-pb_textgray";
    }
    return "bg-pb_lightergray text-pb_textgray";
  };

  // TODO: Column headers should be sport-specific
  const gameStatsColumns = ["DAY", "OPP", "MIN", "FGA", "FGM", "FTA", "FTM", "3PM", "PTS", "REB", "AST", "STL", "BLK", "TO", "PF"];
  
  const impactStats = ["AST", "PTS", "FG%", "3PM", "FT%", "REB", "STL", "BLK", "TO"];

  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <SigmaSquare className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Performance</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 flex-shrink-0">
        {/* Performance Metrics */}
        <div className="space-y-1">
          {performanceData.metrics.map((metric, index) => (
            <div key={index} className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <SigmaSquare className="w-icon-xs h-icon-xs text-pb_textgray self-center" />
                <span className={`text-2xs font-medium ${index === 0 ? 'text-pb_darkgray' : 'text-pb_textlightgray'}`}>
                  {metric.type}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-sm font-semibold font-mono ${index === 0 ? 'text-pb_darkgray' : 'text-pb_textlightgray'}`}>
                  {metric.value}
                </span>
                <div className="flex gap-2">
                  {metric.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-baseline gap-1">
                      <TrendingUp className="w-icon-xs h-icon-xs text-pb_green self-center" />
                      <span className="text-2xs font-medium font-mono text-pb_green">{change.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {performanceData.metrics[0].changes.length > 0 && (
            <div className="mt-1 text-right flex justify-end gap-4 text-2xs text-pb_textgray">
              {performanceData.metrics[0].changes.map((change, index) => (
                <div key={index}>
                  {change.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Impact Distribution */}
        <div>
          <h4 className="text-xs font-semibold text-pb_darkgray mb-1">Impact Distribution</h4>
          <div className="grid grid-cols-5 gap-1">
            {impactStats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center py-1 px-1 text-2xs font-medium rounded ${getImpactColor(stat)}`}
              >
                {stat}
              </div>
            ))}
          </div>
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