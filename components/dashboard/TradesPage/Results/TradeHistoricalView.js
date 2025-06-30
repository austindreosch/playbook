'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { mockTrades } from '../dummyDataTradesPage';

export default function TradeHistoricalView() {
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
    return <div className="p-4 text-center text-xs">No data available</div>;
  }

  // Generate mock historical data points
  const generateHistoricalData = () => {
    const points = [];
    const baseValue = 50;
    const currentWinProb = (trade.winProbability || 0.5) * 100;
    
    // Generate 12 historical points with some variation
    for (let i = 0; i < 12; i++) {
      const variation = (Math.random() - 0.5) * 20; // ±10% variation
      const trend = (currentWinProb - baseValue) * (i / 11); // Trend towards current value
      const value = Math.max(10, Math.min(90, baseValue + trend + variation));
      points.push({
        month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
        value: Math.round(value)
      });
    }
    
    return points;
  };

  const historicalData = generateHistoricalData();
  const currentValue = Math.round((trade.winProbability || 0.5) * 100);

  // Create SVG path for the line chart
  const createPath = (data) => {
    const width = 200;
    const height = 80;
    const padding = 10;
    
    const xStep = (width - 2 * padding) / (data.length - 1);
    const yScale = (height - 2 * padding) / 80; // Scale for 0-100 range
    
    let path = '';
    data.forEach((point, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (point.value - 10) * yScale; // Offset by 10 for better visualization
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  const pathData = createPath(historicalData);
  const isPositiveTrend = currentValue >= historicalData[0].value;

  return (
    <div className="w-full h-full bg-white border border-pb_lightgray rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-pb_textgray uppercase tracking-wider">Historical View</h3>
        <div className="text-right">
          <div className="text-lg font-bold text-pb_darkgray">{currentValue}%</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative w-full h-24 mb-2">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 200 80" 
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="200" height="80" fill="url(#grid)" />
          
          {/* Chart line */}
          <path
            d={pathData}
            fill="none"
            stroke={isPositiveTrend ? "#22c55e" : "#ef4444"}
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {historicalData.map((point, index) => {
            const width = 200;
            const height = 80;
            const padding = 10;
            const xStep = (width - 2 * padding) / (historicalData.length - 1);
            const yScale = (height - 2 * padding) / 80;
            const x = padding + index * xStep;
            const y = height - padding - (point.value - 10) * yScale;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={isPositiveTrend ? "#22c55e" : "#ef4444"}
                className="drop-shadow-sm"
              />
            );
          })}
          
          {/* Current value indicator */}
          <circle
            cx={190}
            cy={80 - 10 - (currentValue - 10) * ((80 - 2 * 10) / 80)}
            r="3"
            fill={isPositiveTrend ? "#16a34a" : "#dc2626"}
            stroke="white"
            strokeWidth="1"
            className="drop-shadow-md"
          />
        </svg>
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-xs text-pb_textgray">
        <span>1Y</span>
        <span>6M</span>
        <span>1M</span>
      </div>

      {/* Trend indicator */}
      <div className="mt-2 text-center">
        <span className={`text-xs font-medium ${isPositiveTrend ? 'text-pb_green' : 'text-pb_red'}`}>
          {isPositiveTrend ? '↗' : '↘'} {Math.abs(currentValue - historicalData[0].value)}% vs 1Y ago
        </span>
      </div>
    </div>
  );
} 