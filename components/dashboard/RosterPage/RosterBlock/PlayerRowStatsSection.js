'use client';

import { memo } from 'react';
import EmptyStatIndicator from '../../../common/EmptyStatIndicator';
import { ROSTER_COLUMN_CLASSES } from './rosterColumnConfig';









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






const PlayerRowStatsSection = memo(({ categories, playerStats, player, rowIndex }) => {
  // Debug logging
  console.log('PlayerRowStatsSection received:', { 
    categories, 
    playerStats, 
    player: player,
    playerName: player?.name,
    playerSport: player?.sport 
  });
  
  // Calculate Z-Score sum from blueprint
  const zScoreSum = playerStats?.zScoreSum || 0;





















  // ╔════════════════════════════════════════════════════════════════╗
  // ║                    📊 DATA BLUEPRINT 📊                       ║
  // ║              DO NOT TOUCH STRUCTURE - ONLY VALUES              ║
  // ║                                                                ║
  // ║ This section defines the data structure for this individual    ║
  // ║ component. It normalizes external data into a consistent       ║
  // ║ internal format, keeping the component stable despite          ║
  // ║ upstream changes.                                              ║
  // ╚════════════════════════════════════════════════════════════════╝
  const blueprint = {
    id: player?.id || player?.playerId || '',
    name: player?.name || '',
    position: player?.position || '',
    team: player?.team || '',
    sport: player?.sport || '',
    playbookScore: player?.playbookScore || playerStats?.playbookScore || null,
    stats: {
      nba: {
        'FG%': { value: playerStats?.['FG%'], zScore: playerStats?.zScores?.['FG%'] || null },
        'FT%': { value: playerStats?.['FT%'], zScore: playerStats?.zScores?.['FT%'] || null },
        '3PM': { value: playerStats?.['3PM'], zScore: playerStats?.zScores?.['3PM'] || null },
        'PTS': { value: playerStats?.['PTS'], zScore: playerStats?.zScores?.['PTS'] || null },
        'REB': { value: playerStats?.['REB'], zScore: playerStats?.zScores?.['REB'] || null },
        'AST': { value: playerStats?.['AST'], zScore: playerStats?.zScores?.['AST'] || null },
        'STL': { value: playerStats?.['STL'], zScore: playerStats?.zScores?.['STL'] || null },
        'BLK': { value: playerStats?.['BLK'], zScore: playerStats?.zScores?.['BLK'] || null },
        'TO': { value: playerStats?.['TO'], zScore: playerStats?.zScores?.['TO'] || null },
        'ORB': { value: playerStats?.['ORB'], zScore: playerStats?.zScores?.['ORB'] || null },
        'DRB': { value: playerStats?.['DRB'], zScore: playerStats?.zScores?.['DRB'] || null },
        'TS%': { value: playerStats?.['TS%'], zScore: playerStats?.zScores?.['TS%'] || null },
        'ATO': { value: playerStats?.['ATO'], zScore: playerStats?.zScores?.['ATO'] || null },
        '3P%': { value: playerStats?.['3P%'], zScore: playerStats?.zScores?.['3P%'] || null },
        'FGM': { value: playerStats?.['FGM'], zScore: playerStats?.zScores?.['FGM'] || null },
        'FTM': { value: playerStats?.['FTM'], zScore: playerStats?.zScores?.['FTM'] || null },
        'PPG': { value: playerStats?.['PPG'], zScore: playerStats?.zScores?.['PPG'] || null },
      },

      mlb: {
        hitting: {
          'R': { value: playerStats?.['R'], zScore: playerStats?.zScores?.['R'] || null },
          'HR': { value: playerStats?.['HR'], zScore: playerStats?.zScores?.['HR'] || null },
          'RBI': { value: playerStats?.['RBI'], zScore: playerStats?.zScores?.['RBI'] || null },
          'SB': { value: playerStats?.['SB'], zScore: playerStats?.zScores?.['SB'] || null },
          'AVG': { value: playerStats?.['AVG'], zScore: playerStats?.zScores?.['AVG'] || null },
          'H': { value: playerStats?.['H'], zScore: playerStats?.zScores?.['H'] || null },
          'OBP': { value: playerStats?.['OBP'], zScore: playerStats?.zScores?.['OBP'] || null },
          'SLG': { value: playerStats?.['SLG'], zScore: playerStats?.zScores?.['SLG'] || null },
          'OPS': { value: playerStats?.['OPS'], zScore: playerStats?.zScores?.['OPS'] || null },
          '2B': { value: playerStats?.['2B'], zScore: playerStats?.zScores?.['2B'] || null },
          '3B': { value: playerStats?.['3B'], zScore: playerStats?.zScores?.['3B'] || null },
          'TB': { value: playerStats?.['TB'], zScore: playerStats?.zScores?.['TB'] || null },
        },
        pitching: {
          'W': { value: playerStats?.['W'], zScore: playerStats?.zScores?.['W'] || null },
          'K': { value: playerStats?.['K'], zScore: playerStats?.zScores?.['K'] || null },
          'SV': { value: playerStats?.['SV'], zScore: playerStats?.zScores?.['SV'] || null },
          'ERA': { value: playerStats?.['ERA'], zScore: playerStats?.zScores?.['ERA'] || null },
          'WHIP': { value: playerStats?.['WHIP'], zScore: playerStats?.zScores?.['WHIP'] || null },
          'QS': { value: playerStats?.['QS'], zScore: playerStats?.zScores?.['QS'] || null },
          'SVH': { value: playerStats?.['SVH'], zScore: playerStats?.zScores?.['SVH'] || null },
          'HLD': { value: playerStats?.['HLD'], zScore: playerStats?.zScores?.['HLD'] || null },
          'K_BB': { value: playerStats?.['K_BB'], zScore: playerStats?.zScores?.['K_BB'] || null },
          'K_9': { value: playerStats?.['K_9'], zScore: playerStats?.zScores?.['K_9'] || null },
          'IP': { value: playerStats?.['IP'], zScore: playerStats?.zScores?.['IP'] || null },
        }
      },

      nfl: {
        'PPG': { value: playerStats?.['PPG'], zScore: playerStats?.zScores?.['PPG'] || null },
        'OPG': { value: playerStats?.['OPG'], zScore: playerStats?.zScores?.['OPG'] || null },
        'OPE': { value: playerStats?.['OPE'], zScore: playerStats?.zScores?.['OPE'] || null },
        'YPS': { value: playerStats?.['YPS'], zScore: playerStats?.zScores?.['YPS'] || null },
        'YD%': { value: playerStats?.['YD%'], zScore: playerStats?.zScores?.['YD%'] || null },
        'PR%': { value: playerStats?.['PR%'], zScore: playerStats?.zScores?.['PR%'] || null },
        'TD%': { value: playerStats?.['TD%'], zScore: playerStats?.zScores?.['TD%'] || null },
        'BP%': { value: playerStats?.['BP%'], zScore: playerStats?.zScores?.['BP%'] || null },
      },
    },
  };
  // ══════════════════════════════════════════════════════════════
  //      🚫 DO NOT MODIFY THIS BLUEPRINT STRUCTURE 🚫
  // ══════════════════════════════════════════════════════════════


  return (
    <div className={ROSTER_COLUMN_CLASSES.statsContainer}>
      {/* Z-Score Sum main value column */}
      <div
        key="zScoreSum_main"
        className={`${ROSTER_COLUMN_CLASSES.zScoreColumn} select-none`}
        title={`Z-Score Sum: ${typeof zScoreSum === 'number' ? zScoreSum.toFixed(2) : '-'}`}
      >
        <span className="text-button font-mono tracking-tight text-pb_textgray tabular-nums text-right min-w-12">
          {typeof zScoreSum === 'number' ? zScoreSum.toFixed(2) : '-'}
        </span>
      </div>

      {categories.map((categoryAbbrev, index) => {
        // Get stat value and z-score from blueprint structure - sport agnostic
        let statValue = null;
        let zScore = null;
        const sport = player?.sport?.toLowerCase();
        
        if (sport && blueprint.stats[sport]) {
          if (sport === 'mlb') {
            // For MLB, check both hitting and pitching categories
            if (blueprint.stats.mlb.hitting[categoryAbbrev]) {
              statValue = blueprint.stats.mlb.hitting[categoryAbbrev].value;
              zScore = blueprint.stats.mlb.hitting[categoryAbbrev].zScore;
            } else if (blueprint.stats.mlb.pitching[categoryAbbrev]) {
              statValue = blueprint.stats.mlb.pitching[categoryAbbrev].value;
              zScore = blueprint.stats.mlb.pitching[categoryAbbrev].zScore;
            }
          } else if (blueprint.stats[sport][categoryAbbrev]) {
            // For NBA and NFL, direct access
            statValue = blueprint.stats[sport][categoryAbbrev].value;
            zScore = blueprint.stats[sport][categoryAbbrev].zScore;
          }
        }
        
        let formattedValue = formatStatValue(statValue, categoryAbbrev);
        let colors = getStatColors(statValue, categoryAbbrev);
        
        // Enhanced tooltip - show stat value and overall z-score sum on every cell
        let title = `${categoryAbbrev}: ${formattedValue || '-'}`;
        if (typeof zScoreSum === 'number') {
          title += ` | Player Z-Score Sum: ${zScoreSum.toFixed(2)}`;
        }

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
            className={`${ROSTER_COLUMN_CLASSES.statColumn} ${cellBgClass} select-none`}
            title={title}
          >
            {formattedValue !== '' ? (
              <span className={`text-nums font-medium text-pb_mddarkgray`}>
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

PlayerRowStatsSection.displayName = 'PlayerRowStatsSection';

export default PlayerRowStatsSection; 