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





    return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-300 shadow-sm p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <Dna className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Team Archetype</h3>
      </div>

      <div className="flex items-center min-h-0">
        {/* Metrics List */}
        <div className=" space-y-1 flex flex-col justify-center">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-icon-sm h-icon-sm text-pb_darkgray flex-shrink-0" strokeWidth={2} />
                  <span className="text-button text-pb_darkgray">{metric.label}</span>
                </div>
                <span className="font-semibold w-9 h-5.5 flex items-center justify-center text-pb_darkgray bg-white rounded text-button border border-pb_lightgray ml-6">
                  {metric.rank}
                </span>
              </div>
            );
          })}
        </div>

        {/* Radar Chart Container */}
        <div className="relative w-full" >
           <ChartContainer config={chartConfig} className="h-full w-full">
             <RadarChart 
               data={radarData} 
               margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
             >
               <PolarGrid 
                 gridType="polygon" 
                 radialLines={false}
                 stroke="#e5e7eb"
                 strokeWidth={1}
               />
               <PolarAngleAxis 
                 dataKey="metric" 
                 tick={false}
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
          
          {/* Icon labels positioned absolutely */}
          {/* Top - Value */}
          <div className="absolute top-[5px] left-1/2 -translate-x-1/2">
            <TrendingUp className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
          {/* Top Right - Power */}
          <div className="absolute top-[35px] right-[15px]">
            <Zap className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
          {/* Bottom Right - Victory */}
          <div className="absolute bottom-[35px] right-[15px]">
            <Trophy className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
          {/* Bottom Left - Age */}
          <div className="absolute bottom-[35px] left-[15px]">
            <Clock className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
                    {/* Top Left - Futures */}
          <div className="absolute top-[35px] left-[15px]">
            <Shield className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
        </div>


      </div>


      {/* Bottom Container */}
      <div className="flex flex-col gap-2 h-1/5">

      </div>



    </div>
  );
}