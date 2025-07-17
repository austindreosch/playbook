'use client';

import { SPORT_CONFIGS } from '@/lib/config';

export default function ImpactDistributionBlock({ 
  stats, 
  colorConfig = null,
  sportKey = null,
  statDisplayConfig = null
}) {
  // Get z-score color range from SPORT_CONFIGS for a specific stat
  const getStatColorRange = (statName) => {
    if (sportKey && SPORT_CONFIGS[sportKey?.toLowerCase()]?.categories?.[statName]) {
      const categoryConfig = SPORT_CONFIGS[sportKey.toLowerCase()].categories[statName];
      return {
        min: categoryConfig.zscoreColorMin ?? -2.0,
        max: categoryConfig.zscoreColorMax ?? 2.0
      };
    }
    // Default range if no sport-specific config
    return { min: -2.0, max: 2.0 };
  };

  // TODO: Add stat display name formatting for different sports
  const getStatDisplayName = (statName) => {
    // First try SPORT_CONFIGS for official category labels
    if (sportKey && SPORT_CONFIGS[sportKey?.toLowerCase()]?.categories?.[statName]) {
      const categoryConfig = SPORT_CONFIGS[sportKey.toLowerCase()].categories[statName];
      // Use label if available, otherwise fall back to the stat name
      if (categoryConfig.label && categoryConfig.label.length <= 8) {
        return categoryConfig.label;
      }
      // For longer labels, use the stat key itself (already abbreviated)
      return statName;
    }
    
    // Use provided config or fallback to stat name
    if (statDisplayConfig && statDisplayConfig[statName]) {
      return statDisplayConfig[statName].displayName || 
             statDisplayConfig[statName].abbreviation || 
             statName;
    }
    
    // Smart abbreviation for common long stat names
    const abbreviations = {
      'Fantasy Points Per Game': 'PPG',
      'Opportunities Per Game': 'OPG', 
      'Opportunity Efficiency': 'OPE',
      'Yards Per Snap': 'YPS',
      'Field Goal Percentage': 'FG%',
      'Free Throw Percentage': 'FT%',
      'True Shooting Percentage': 'TS%',
      'Assist to Turnover Ratio': 'ATO',
      'Earned Run Average': 'ERA',
      'Walks + Hits per IP': 'WHIP',
      'Saves + Holds': 'SVH',
      'Strikeout/Walk Ratio': 'K/BB'
    };
    
    return abbreviations[statName] || statName;
  };

  const getImpactColor = (zScore, statName = null) => {
    // Get color range for this specific stat (or use defaults)
    const colorRange = statName ? getStatColorRange(statName) : { min: -2.0, max: 2.0 };
    
    // All available Tailwind color shades (from lightest to darkest)
    const greenShades = [
      'bg-pb_green-50', 'bg-pb_green-100', 'bg-pb_green-200', 'bg-pb_green-300', 
      'bg-pb_green-400', 'bg-pb_green-500', 'bg-pb_green-600', 'bg-pb_green-700', 'bg-pb_green-800', 'bg-pb_green-900'
    ];
    
    const redShades = [
      'bg-pb_red-50', 'bg-pb_red-100', 'bg-pb_red-200', 'bg-pb_red-300', 
      'bg-pb_red-400', 'bg-pb_red-500', 'bg-pb_red-600', 'bg-pb_red-700', 'bg-pb_red-800', 'bg-pb_red-900'
    ];
    
    // Determine if positive or negative
    if (zScore >= 0) {
      // Positive z-score -> green colors
      if (zScore >= colorRange.max) {
        // At or above max -> darkest green (900)
        return `${greenShades[9]} text-pb_darkgray/80`;
      } else if (zScore <= 0.05) {
        // Very close to zero -> lightest green (50)
        return `${greenShades[0]} text-pb_darkgray/80`;
      } else {
        // Map z-score from 0.05 to colorRange.max across green shades 0-9
        const ratio = Math.min(zScore / colorRange.max, 1);
        const shadeIndex = Math.floor(ratio * 9);
        const textColor = shadeIndex >= 7 ? 'text-pb_darkgray/80' : 'text-pb_darkgray/80';
        return `${greenShades[shadeIndex]} ${textColor}`;
      }
    } else {
      // Negative z-score -> red colors
      if (zScore <= colorRange.min) {
        // At or below min -> darkest red (900)
        return `${redShades[9]} text-pb_darkgray/80`;
      } else if (zScore >= -0.05) {
        // Very close to zero -> lightest red (50)
        return `${redShades[0]} text-pb_darkgray/80`;
      } else {
        // Map z-score from -0.05 to colorRange.min across red shades 0-9
        const ratio = Math.min(Math.abs(zScore) / Math.abs(colorRange.min), 1);
        const shadeIndex = Math.floor(ratio * 9);
        const textColor = shadeIndex >= 7 ? 'text-pb_darkgray/80' : 'text-pb_darkgray/80';
        return `${redShades[shadeIndex]} ${textColor}`;
      }
    }
  };

  /**
   * Return bar widths (sum = 100 %) that are proportional to |zScore|.
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

  const { row1, row2 } = distributeStatsAcrossRows(stats);

  return (
    <div className="border border-pb_lightgray rounded-md overflow-hidden">
      {/* First Row */}
      <div className="flex">
        {row1.map((item, index) => {
          const displayName = getStatDisplayName(item.stat.name);
          const colorClass = getImpactColor(item.stat.zScore, item.stat.name);
          return (
            <div 
              key={index}
              className={`text-center h-7 px-1 text-2xs font-bold transition-all flex justify-center items-center duration-300 ${colorClass}`}
              style={{ width: `${item.width}%` }}
              title={`${item.stat.name} (z-score: ${item.stat.zScore.toFixed(2)})`}
            >
              <div className="">{displayName}</div>
            </div>
          );
        })}
      </div>
      {/* Second Row */}
      <div className="flex">
        {row2.map((item, index) => {
          const displayName = getStatDisplayName(item.stat.name);
          const colorClass = getImpactColor(item.stat.zScore, item.stat.name);
          return (
            <div 
              key={index}
              className={`text-center h-7 px-1 text-2xs font-bold transition-all flex justify-center items-center duration-300 ${colorClass}`}
              style={{ width: `${item.width}%` }}
              title={`${item.stat.name} (z-score: ${item.stat.zScore.toFixed(2)})`}
            >
              <div className="">{displayName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 