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

  const getImpactColor = (zScore) => {
    if (zScore >= 2.5) return "bg-pb_green-800 text-pb_darkgray/80";
    if (zScore >= 2.0) return "bg-pb_green-700 text-pb_darkgray/80";
    if (zScore >= 1.5) return "bg-pb_green-600 text-pb_darkgray/80";
    if (zScore >= 1.0) return "bg-pb_green-500 text-pb_darkgray/80";
    if (zScore >= 0.5) return "bg-pb_green-400 text-pb_darkgray/80";
    if (zScore >= 0.1) return "bg-pb_green-300 text-pb_darkgray/80";
    if (zScore >= 0) return "bg-pb_green-50 text-pb_darkgray/80";
    if (zScore >= -0.1) return "bg-pb_red-50 text-pb_darkgray/80";
    if (zScore >= -0.5) return "bg-pb_red-300 text-pb_darkgray/80";
    if (zScore >= -1.0) return "bg-pb_red-400 text-pb_darkgray/80";
    if (zScore >= -1.5) return "bg-pb_red-500 text-pb_darkgray/80";
    if (zScore >= -2.0) return "bg-pb_red-600 text-pb_darkgray/80";
    if (zScore >= -2.5) return "bg-pb_red-700 text-pb_darkgray/80";
    return "bg-pb_red-800 text-pb_darkgray/80";
  };

  /**
   * Return bar widths (sum = 100 %) that are proportional to |zScore|.
   * Negative and positive impacts of the same magnitude look equally large.
   */
  const calculateProportionalWidths = (statEntries, minWidthPercent = 3) => {
    const count          = statEntries.length;
    const baseTotal      = minWidthPercent * count;         // guaranteed %
    const remainingWidth = 100 - baseTotal;

    // magnitude‑only weighting
    const mags           = statEntries.map(s => Math.abs(s.zScore));
    const magSum         = mags.reduce((t, v) => t + v, 0);

    // if everything is exactly 0, just split evenly
    if (!magSum) return Array(count).fill(100 / count);

    const rawWidths = mags.map(mag =>
      minWidthPercent + (mag / magSum) * remainingWidth
    );

    // normalise to counter tiny FP drift
    const total = rawWidths.reduce((t, v) => t + v, 0);
    return rawWidths.map(w => (w / total) * 100);
  };





  // Distribute stats across two rows dynamically based on cumulative width
  const distributeStatsAcrossRows = (stats) => {
    // Calculate all widths first as if in one row
    const allWidths = calculateProportionalWidths(stats);
    
    const row1 = [];
    const row2 = [];
    let row1Width = 0;
    
    // Distribute stats to rows, trying to balance the widths
    stats.forEach((stat, index) => {
      const width = allWidths[index];
      
      // If adding to row1 would exceed ~50% or row1 already has good coverage, add to row2
      if (row1Width + width > 50 && row1.length > 0) {
        row2.push({ stat, width });
      } else {
        row1.push({ stat, width });
        row1Width += width;
      }
    });
    
    // Recalculate widths for each row to fill 100% of their respective row
    const row1Stats = row1.map(item => item.stat);
    const row2Stats = row2.map(item => item.stat);
    
    const row1FinalWidths = calculateProportionalWidths(row1Stats);
    const row2FinalWidths = calculateProportionalWidths(row2Stats);
    
    return {
      row1: row1Stats.map((stat, index) => ({ stat, width: row1FinalWidths[index] })),
      row2: row2Stats.map((stat, index) => ({ stat, width: row2FinalWidths[index] }))
    };
  };

  const { row1, row2 } = distributeStatsAcrossRows(impactStatsWithScores);

  // TODO: Column headers should be sport-specific
  const gameStatsColumns = ["DAY", "OPP", "MIN", "FGA", "FGM", "FTA", "FTM", "3PM", "PTS", "REB", "AST", "STL", "BLK", "TO", "PF"];

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
          <div className="border border-pb_lightgray rounded-md overflow-hidden">
            {/* First Row */}
            <div className="flex">
              {row1.map((item, index) => (
                <div 
                  key={index}
                  className={`text-center h-7 px-1 text-2xs font-bold transition-all flex justify-center items-center duration-300 ${getImpactColor(item.stat.zScore)}`}
                  style={{ width: `${item.width}%` }}
                  title={`${item.stat.name} (z-score: ${item.stat.zScore.toFixed(2)})`}
                >
                  <div className="">{item.stat.name}</div>
                </div>
              ))}
            </div>
            {/* Second Row */}
            <div className="flex">
              {row2.map((item, index) => (
                <div 
                  key={index}
                  className={`text-center h-7 px-1 text-2xs font-bold transition-all flex justify-center items-center duration-300 ${getImpactColor(item.stat.zScore)}`}
                  style={{ width: `${item.width}%` }}
                  title={`${item.stat.name} (z-score: ${item.stat.zScore.toFixed(2)})`}
                >
                  <div className="">{item.stat.name}</div>
                </div>
              ))}
            </div>
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