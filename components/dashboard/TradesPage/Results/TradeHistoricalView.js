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

  // Generate mock historical data points - only 4 points
  const generateHistoricalData = () => {
    const currentWinProb = (trade.winProbability || 0.5) * 100;
    
    // 4 data points with more varied progression
    const points = [
      { label: '1Y', value: Math.round(currentWinProb - 30) }, // Start much lower
      { label: '6M', value: Math.round(currentWinProb - 5) },  // Big jump up
      { label: '1M', value: Math.round(currentWinProb - 15) }, // Dip down
      { label: '►', value: Math.round(currentWinProb) }        // Recovery to current
    ];
    
    // Ensure values stay within reasonable bounds
    return points.map(point => ({
      ...point,
      value: Math.max(20, Math.min(80, point.value))
    }));
  };

  const historicalData = generateHistoricalData();
  const currentValue = Math.round((trade.winProbability || 0.5) * 100);
  
  // Calculate average trade value for center line
  const averageValue = Math.round(historicalData.reduce((sum, point) => sum + point.value, 0) / historicalData.length);

  // Create SVG path for the line chart
  const createPath = (data) => {
    const width = 320;
    const height = 120;
    const padding = 20;
    
    const xStep = (width - 2 * padding) / (data.length - 1);
    const yScale = (height - 2 * padding) / 60; // Scale for better range
    
    let path = '';
    data.forEach((point, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (point.value - 20) * yScale; // Better scaling
      
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
    <div className="w-full h-full bg-white border border-pb_lightgray rounded-lg p-3 pl-1.5">

             {/* Time labels */}
       <div className="relative text-xs text-pb_textgray">
         {historicalData.map((point, index) => {
           const width = 320;
           const padding = 20;
           const xStep = (width - 2 * padding) / (historicalData.length - 1);
           const leftPercent = ((padding + index * xStep) / width) * 100;
           
           return (
             <span 
               key={index}
               className="absolute transform -translate-x-1/2"
               style={{ left: `${leftPercent}%` }}
             >
               {point.label}
             </span>
           );
         })}
       </div>

      {/* Chart Container */}
      <div className="relative w-full h-28 mb-2">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 320 120" 
          className="overflow-visible"
        >
          {/* Average line (center line) */}
          <line
            x1="20"
            y1={120 - 20 - (averageValue - 20) * ((120 - 2 * 20) / 60)}
            x2="280"
            y2={120 - 20 - (averageValue - 20) * ((120 - 2 * 20) / 60)}
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          
          {/* Average value label */}
          <text
            x="305"
            y={120 - 20 - (averageValue - 20) * ((120 - 2 * 20) / 60) + 4}
            fontSize="14"
            fill="#6b7280"
            fontWeight="bold"
            className="text-sm"
          >
            +{averageValue}
          </text>
          
          {/* Chart line */}
          <path
            d={pathData}
            fill="none"
            stroke={isPositiveTrend ? "#59cd90" : "#ee6352"}
            strokeWidth="3"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {historicalData.map((point, index) => {
            const width = 320;
            const height = 120;
            const padding = 20;
            const xStep = (width - 2 * padding) / (historicalData.length - 1);
            const yScale = (height - 2 * padding) / 60;
            const x = padding + index * xStep;
            const y = height - padding - (point.value - 20) * yScale;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={index === historicalData.length - 1 ? "6" : "5"}
                fill={isPositiveTrend ? "#59cd90" : "#ee6352"}
                stroke="white"
                strokeWidth="1"
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
} 