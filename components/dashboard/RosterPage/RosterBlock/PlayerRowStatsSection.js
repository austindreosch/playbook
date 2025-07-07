'use client';

import { memo } from 'react';
import EmptyStatIndicator from '../../../common/EmptyStatIndicator';









// Color coding function with ALL 10 green and 10 red shades
const getStatColors = (value, category) => {
  if (value === null || value === undefined) return { bgColor: 'bg-gray-50', textColor: 'text-pb_darkgray/80' };
  
  // Basketball stat thresholds for color coding with 10 levels each
  const thresholds = {
    'FG%': { 
      excellent: [0.650, 0.600, 0.550, 0.520, 0.500], // 5 green levels (darkest to lightest)
      poor: [0.470, 0.450, 0.430, 0.400, 0.350] // 5 red levels (lightest to darkest)
    },
    'FT%': { 
      excellent: [0.900, 0.875, 0.850, 0.825, 0.800], // 5 green levels
      poor: [0.750, 0.700, 0.650, 0.600, 0.500] // 5 red levels
    },
    '3PM': { 
      excellent: [4.0, 3.5, 3.0, 2.8, 2.5], // 5 green levels
      poor: [2.0, 1.7, 1.5, 1.2, 0.8] // 5 red levels
    },
    'PTS': { 
      excellent: [30, 27, 25, 23, 20], // 5 green levels
      poor: [15, 12, 10, 8, 5] // 5 red levels
    },
    'REB': { 
      excellent: [15, 12, 10, 9, 8], // 5 green levels
      poor: [6, 5, 4, 3, 2] // 5 red levels
    },
    'AST': { 
      excellent: [11, 9, 8, 7, 6], // 5 green levels
      poor: [4, 3.5, 3, 2.5, 1.5] // 5 red levels
    },
    'STL': { 
      excellent: [2.5, 2.2, 2.0, 1.8, 1.5], // 5 green levels
      poor: [1.0, 0.8, 0.6, 0.4, 0.2] // 5 red levels
    },
    'BLK': { 
      excellent: [3.5, 3.0, 2.5, 2.2, 2.0], // 5 green levels
      poor: [1.0, 0.8, 0.6, 0.4, 0.2] // 5 red levels
    },
    'TO': { 
      excellent: [1.2, 1.5, 1.8, 2.0, 2.2], // 5 green levels (lower is better)
      poor: [2.8, 3.2, 3.6, 4.0, 5.0], // 5 red levels
      inverse: true
    }
  };

  const threshold = thresholds[category];
  if (!threshold) return { bgColor: 'bg-gray-50', textColor: 'text-pb_darkgray/80' };

  let bgColor;
  const textColor = 'text-pb_darkgray/90';
  
  const greenShades = [
    'bg-pb_green-800', 'bg-pb_green-700', 'bg-pb_green-600', 'bg-pb_green-500', 'bg-pb_green-400',
    'bg-pb_green-300', 'bg-pb_green-200', 'bg-pb_green-100', 'bg-pb_green-50', 'bg-gray-100'
  ];
  
  const redShades = [
    'bg-gray-100', 'bg-pb_red-50', 'bg-pb_red-100', 'bg-pb_red-200', 'bg-pb_red-300',
    'bg-pb_red-400', 'bg-pb_red-500', 'bg-pb_red-600', 'bg-pb_red-700', 'bg-pb_red-800'
  ];
  
  if (threshold.inverse) {
    // Lower is better for turnovers
    if (value <= threshold.excellent[0]) bgColor = greenShades[0]; // Darkest green
    else if (value <= threshold.excellent[1]) bgColor = greenShades[1];
    else if (value <= threshold.excellent[2]) bgColor = greenShades[2];
    else if (value <= threshold.excellent[3]) bgColor = greenShades[3];
    else if (value <= threshold.excellent[4]) bgColor = greenShades[4];
    else if (value <= (threshold.excellent[4] + threshold.poor[0]) / 2) bgColor = greenShades[5];
    else if (value <= (threshold.excellent[4] + threshold.poor[0]) / 1.5) bgColor = greenShades[6];
    else if (value <= (threshold.excellent[4] + threshold.poor[0]) / 1.2) bgColor = greenShades[7];
    else if (value <= threshold.poor[0]) bgColor = greenShades[8];
    else if (value <= threshold.poor[1]) bgColor = redShades[1];
    else if (value <= threshold.poor[2]) bgColor = redShades[2];
    else if (value <= threshold.poor[3]) bgColor = redShades[3];
    else if (value <= threshold.poor[4]) bgColor = redShades[4];
    else if (value <= threshold.poor[4] * 1.2) bgColor = redShades[5];
    else if (value <= threshold.poor[4] * 1.4) bgColor = redShades[6];
    else if (value <= threshold.poor[4] * 1.6) bgColor = redShades[7];
    else if (value <= threshold.poor[4] * 1.8) bgColor = redShades[8];
    else bgColor = redShades[9]; // Darkest red
  } else {
    // Higher is better for most stats
    if (value >= threshold.excellent[0]) bgColor = greenShades[0]; // Darkest green
    else if (value >= threshold.excellent[1]) bgColor = greenShades[1];
    else if (value >= threshold.excellent[2]) bgColor = greenShades[2];
    else if (value >= threshold.excellent[3]) bgColor = greenShades[3];
    else if (value >= threshold.excellent[4]) bgColor = greenShades[4];
    else if (value >= (threshold.excellent[4] + threshold.poor[0]) / 1.2) bgColor = greenShades[5];
    else if (value >= (threshold.excellent[4] + threshold.poor[0]) / 1.5) bgColor = greenShades[6];
    else if (value >= (threshold.excellent[4] + threshold.poor[0]) / 2) bgColor = greenShades[7];
    else if (value >= threshold.poor[0]) bgColor = greenShades[8];
    else if (value >= threshold.poor[1]) bgColor = redShades[1];
    else if (value >= threshold.poor[2]) bgColor = redShades[2];
    else if (value >= threshold.poor[3]) bgColor = redShades[3];
    else if (value >= threshold.poor[4]) bgColor = redShades[4];
    else if (value >= threshold.poor[4] * 0.8) bgColor = redShades[5];
    else if (value >= threshold.poor[4] * 0.6) bgColor = redShades[6];
    else if (value >= threshold.poor[4] * 0.4) bgColor = redShades[7];
    else if (value >= threshold.poor[4] * 0.2) bgColor = redShades[8];
    else bgColor = redShades[9]; // Darkest red
  }

  return { bgColor, textColor };
};

// Format values exactly like RankingsPlayerRow
const formatStatValue = (value, category) => {
  if (value === null || value === undefined) return '';
  
  if (typeof value === 'number') {
    let decimals = 1;
    let trimTrailingZeros = true;
    let showLeadingZero = true;

    // Special formatting for percentages
    if (category === 'FG%' || category === 'FT%') {
      decimals = 3;
      showLeadingZero = false;
    }

    let formattedValue;
    if (trimTrailingZeros) {
      formattedValue = parseFloat(value.toFixed(decimals)).toString();
    } else {
      formattedValue = value.toFixed(decimals);
    }

    if (!showLeadingZero) {
      if (formattedValue.startsWith("0.")) {
        formattedValue = formattedValue.substring(1);
      } else if (formattedValue.startsWith("-0.")) {
        formattedValue = "-" + formattedValue.substring(2);
      }
    }

    return formattedValue;
  }
  
  return String(value);
};





// ╔════════════════════════════════════════════════════════════════╗
// ║                    📊 DATA BLUEPRINT 📊                       ║
// ║              DO NOT TOUCH STRUCTURE - ONLY VALUES             ║
// ║                                                                ║
// ║ This section defines the data structure for this individual    ║
// ║ component. It normalizes external data into a consistent       ║
// ║ internal format, keeping the component stable despite          ║
// ║ upstream changes.                                              ║
// ╚════════════════════════════════════════════════════════════════╝

export const blueprint = {
  id: '',
  name: '',
  position: '',
  team: '',
  sport: '',

  stats: {
    nba: {
      'FG%': { value: null, zScore: null },
      'PPG': { value: null, zScore: null },
      'FT%': { value: null, zScore: null },
      '3PM': { value: null, zScore: null },
      'PTS': { value: null, zScore: null },
      'REB': { value: null, zScore: null },
      'AST': { value: null, zScore: null },
      'STL': { value: null, zScore: null },
      'BLK': { value: null, zScore: null },
      'TO': { value: null, zScore: null },
      'ORB': { value: null, zScore: null },
      'DRB': { value: null, zScore: null },
      'TS%': { value: null, zScore: null },
      'ATO': { value: null, zScore: null },
      '3P%': { value: null, zScore: null },
      'FGM': { value: null, zScore: null },
      'FTM': { value: null, zScore: null },
    },

    mlb: {
      hitting: {
        'R': { value: null, zScore: null },
        'HR': { value: null, zScore: null },
        'RBI': { value: null, zScore: null },
        'SB': { value: null, zScore: null },
        'AVG': { value: null, zScore: null },
        'H': { value: null, zScore: null },
        'OBP': { value: null, zScore: null },
        'SLG': { value: null, zScore: null },
        'OPS': { value: null, zScore: null },
        '2B': { value: null, zScore: null },
        '3B': { value: null, zScore: null },
        'TB': { value: null, zScore: null },
      },
      pitching: {
        'W': { value: null, zScore: null },
        'K': { value: null, zScore: null },
        'SV': { value: null, zScore: null },
        'ERA': { value: null, zScore: null },
        'WHIP': { value: null, zScore: null },
        'QS': { value: null, zScore: null },
        'SVH': { value: null, zScore: null },
        'HLD': { value: null, zScore: null },
        'K_BB': { value: null, zScore: null },
        'K_9': { value: null, zScore: null },
        'IP': { value: null, zScore: null },
      }
    },

    nfl: {
      'PPG': { value: null, zScore: null },
      'OPG': { value: null, zScore: null },
      'OPE': { value: null, zScore: null },
      'YPS': { value: null, zScore: null },
      'YD%': { value: null, zScore: null },
      'PR%': { value: null, zScore: null },
      'TD%': { value: null, zScore: null },
      'BP%': { value: null, zScore: null },
    },
  },
};

// ════════════════════════════════════════════════════════
//      🚫 DO NOT MODIFY THIS BLUEPRINT 🚫
// ════════════════════════════════════════════════════════

const RosterStatsSection = memo(({ categories, playerStats, player, rowIndex }) => {
  // Calculate Z-Score sum (placeholder for now)
  const zScoreSum = playerStats?.zScoreSum || 0;

  return (
    <div className="flex w-full h-full gap-0.5">
      {/* Z-Score Sum main value column */}
      <div
        key="zScoreSum_main"
        className="flex-1 text-center h-full flex items-center justify-center select-none bg-gray-50"
        title={`Z-Score Sum: ${typeof zScoreSum === 'number' ? zScoreSum.toFixed(2) : '-'}`}
      >
        <span className="text-button text-pb_darkgray font-medium">
          {typeof zScoreSum === 'number' ? zScoreSum.toFixed(2) : '-'}
        </span>
      </div>

      {categories.map((categoryAbbrev, index) => {
        const statValue = playerStats?.[categoryAbbrev];
        let formattedValue = formatStatValue(statValue, categoryAbbrev);
        let colors = getStatColors(statValue, categoryAbbrev);
        
        const title = `${categoryAbbrev}: ${formattedValue || '-'}`;

        // Cell background color logic - use light gray for empty cells
        let cellBgClass;
        if (formattedValue === '') {
          cellBgClass = rowIndex % 2 !== 0 ? 'bg-gray-50' : 'bg-white';
        } else {
          cellBgClass = colors.bgColor;
        }

        return (
          <div
            key={categoryAbbrev}
            className={`flex-1 text-center h-full flex items-center justify-center select-none ${cellBgClass}`}
            title={title}
          >
            {formattedValue !== '' ? (
              <span className={`text-button font-medium ${colors.textColor}`}>
                {formattedValue}
              </span>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <EmptyStatIndicator />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

RosterStatsSection.displayName = 'RosterStatsSection';

export default RosterStatsSection; 