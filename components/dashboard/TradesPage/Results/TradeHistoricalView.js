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
        <div className="w-full bg-white border border-stroke-soft-200 rounded-lg px-2 pt-1 relative max-h-full overflow-hidden">
      {/* <div className="text-3xs text-text-soft-300 pl-0.5 leading-none">Historical View</div> */}
       <div className="absolute top-1.5 left-2.5 text-3xs text-text-soft-300 leading-none z-10">Historical View</div>

        <ChartContainer config={chartConfig} className="h-[calc(100%)] w-full max-h-full">
         <LineChart data={data} margin={{ top: 8, right: 10, bottom: -2, left: 10 }}>
          <XAxis 
            dataKey="period" 
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <text x={x} y={y} dy={10} textAnchor="middle" fill="#afafaf" fontSize="8">
                  {payload.value}
                </text>
              );
            }}
            tickLine={false}
            axisLine={false}
            style={{ fill: "#afafaf" }}
          />
          <YAxis 
            tick={{ fontSize: 9 }}
            
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
            label={{ value: `+${yearlyAverage}`, position: "insideTopLeft", fontSize: 9, fill: "#afafaf", offset: -3, textAnchor: "start", }}
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