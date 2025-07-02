'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
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

  // Historical data
  const data = [
    { period: '1Y', value: -600, profit: -600 },
    { period: '6M', value: -350, profit: -350 },
    { period: '1M', value: 800, profit: 800 },
    { period: '◆', value: 1000, profit: 1000 }
  ];

  const chartConfig = {
    profit: {
      label: "Profit/Loss",
      color: "hsl(var(--chart-1))",
    },
  };

  const yearlyAverage = 317;

  // Gradient breakpoint for zero threshold
  const domainMin = -700;
  const domainMax = 1100;
  const threshold = 0;
  const offsetPct = ((domainMax - threshold) / (domainMax - domainMin)) * 100;

  return (
    <div className="w-full h-full bg-white border border-pb_lightgray rounded-lg p-2 px-3">
      <div className="text-2xs text-pb_textlightergray pl-0.5">Historical View</div>
      
             <ChartContainer config={chartConfig} className="h-[calc(100%-10px)] w-full">
         <LineChart data={data} margin={{ top: 0, right: 5, bottom: 0, left: 5 }}>
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={[-700, 1100]}
            hide={true}
          />
          
          {/* Yearly average line */}
          <ReferenceLine 
            y={yearlyAverage} 
            stroke="#efefef" 
            strokeDasharray="4 3" 
            strokeWidth={2}
            label={{ value: `+${yearlyAverage}`, position: "insideTopLeft", fontSize: 11, fill: "#9c9c9c", offset: -4, textAnchor: "start" }}
          />
          
          <ChartTooltip content={<ChartTooltipContent />} />
          
          <Line
            type="linear"
            dataKey="profit"
            stroke="url(#colorGradient)"
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload, index } = props;
              return (
                <rect key={index}
                  x={cx - 5}
                  y={cy - 5}
                  width={10}
                  height={10}
                  rx={3}
                  fill={payload.value >= 0 ? '#59cd90' : '#ee6352'}
                  stroke="white"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={false}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#59cd90" />
              <stop offset={`${offsetPct}%`} stopColor="#59cd90" />
              <stop offset={`${offsetPct}%`} stopColor="#ee6352" />
              <stop offset="100%" stopColor="#ee6352" />
            </linearGradient>
          </defs>
        </LineChart>
      </ChartContainer>
    </div>
  );
} 