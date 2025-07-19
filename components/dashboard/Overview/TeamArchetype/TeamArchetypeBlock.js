import { ChartContainer } from '@/components/ui/chart';
import { BicepsFlexed, ChartCandlestick, Clock, Dna, Shield, ShieldUser, TimerReset, TrendingUp, Trophy, Zap } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';


export default function TeamArchetypeBlock() {


  // Map rankings to radar values (invert so 1st = 10, 10th = 1)
  const rankings = {
    Value: 5,
    Power: 4,
    Victory: 2,
    Age: 9,
    Futures: 7
  };

  // Convert to radar data (higher value = better ranking)
  const radarData = [
    { metric: 'Value', value: 11 - rankings.Value },
    { metric: 'Power', value: 11 - rankings.Power },
    { metric: 'Victory', value: 11 - rankings.Victory },
    { metric: 'Age', value: 11 - rankings.Age },
    { metric: 'Futures', value: 11 - rankings.Futures }
  ];

  const metrics = [
    { icon: ChartCandlestick, label: 'Value', rank: '5th' },
    { icon: BicepsFlexed, label: 'Power', rank: '4th' },
    { icon: Trophy, label: 'Victory', rank: '2nd' },
    { icon: TimerReset, label: 'Age', rank: '9th' },
    { icon: ShieldUser, label: 'Futures', rank: '7th' }
  ];

  const chartConfig = {
    value: {
      label: "Performance",
      color: "hsl(var(--chart-1))",
    },
  };

  // Custom tick component that renders icons
  const CustomTick = ({ payload, x, y, textAnchor, ...props }) => {
    const iconMap = {
      'Value': ChartCandlestick,
      'Power': BicepsFlexed,
      'Victory': Trophy,
      'Age': TimerReset,
      'Futures': ShieldUser
    };
    
    const Icon = iconMap[payload.value];
    if (!Icon) return null;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x="-8" y="-8" width="16" height="16">
          <Icon className="w-icon-sm h-icon-sm text-pb_textgray" strokeWidth={2} />
        </foreignObject>
      </g>
    );
  };

    return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-300 shadow-sm p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <Dna className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Team Archetype</h3>
      </div>

      <div className="flex items-center flex-1 min-h-0">
        {/* Metrics List */}
        <div className="space-y-1 flex flex-col justify-center pl-1 flex-shrink-0">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1">
                  <Icon className="w-3 h-3 text-pb_darkgray flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs text-pb_darkgray">{metric.label}</span>
                </div>
                <span className="font-semibold w-7 h-4 flex items-center justify-center text-pb_darkgray bg-white rounded text-xs border border-pb_lightgray ml-4">
                  {metric.rank}
                </span>
              </div>
            );
          })}
        </div>

        {/* Radar Chart Container */}
        <div className="flex-1 h-full min-w-0 overflow-hidden flex items-center justify-center">
           <ChartContainer config={chartConfig} className="h-full w-full max-w-full">
             <RadarChart 
               data={radarData} 
               margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
               width="100%"
               height="100%"
             >
               <PolarGrid 
                 gridType="polygon" 
                 radialLines={false}
                 stroke="#e5e7eb"
                 strokeWidth={1}
               />
               <PolarAngleAxis 
                 dataKey="metric" 
                 tick={CustomTick}
                 tickSize={12}
               />
               <PolarRadiusAxis 
                 domain={[0, 10]} 
                 tick={false}
                 axisLine={false}
               />
               <Radar
                 dataKey="value"
                 stroke="#3b82f6"
                 strokeWidth={2}
                 fill="#93c5fd"
                 fillOpacity={0.5}
               />
             </RadarChart>
           </ChartContainer>
        </div>
      </div>
    </div>
  );
}