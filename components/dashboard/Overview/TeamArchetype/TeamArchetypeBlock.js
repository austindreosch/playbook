import { ChartContainer } from '@/components/ui/chart';
import { Clock, Dna, Shield, TrendingUp, Trophy, Zap } from 'lucide-react';
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
    { icon: TrendingUp, label: 'Value', rank: '5th' },
    { icon: Zap, label: 'Power', rank: '4th' },
    { icon: Trophy, label: 'Victory', rank: '2nd' },
    { icon: Clock, label: 'Age', rank: '9th' },
    { icon: Shield, label: 'Futures', rank: '7th' }
  ];

  const chartConfig = {
    value: {
      label: "Performance",
      color: "hsl(var(--chart-1))",
    },
  };





    return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-300 shadow-sm p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <Dna className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Team Archetype</h3>
      </div>

      <div className="flex flex-col gap-3 flex-1 min-h-0">
        {/* Radar Chart Container */}
        <div className="relative w-full flex-1 min-h-0 overflow-hidden">
           <ChartContainer config={chartConfig} className="h-full w-full">
             <RadarChart 
               data={radarData} 
               margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
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
          <div className="absolute top-[6%] left-1/2 -translate-x-1/2">
            <TrendingUp className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
          </div>
          {/* Top Right - Power */}
          <div className="absolute top-[18%] right-[18%]">
            <Zap className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
          </div>
          {/* Bottom Right - Victory */}
          <div className="absolute bottom-[18%] right-[18%]">
            <Trophy className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
          </div>
          {/* Bottom Left - Age */}
          <div className="absolute bottom-[18%] left-[18%]">
            <Clock className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
          </div>
          {/* Top Left - Futures */}
          <div className="absolute top-[18%] left-[18%]">
            <Shield className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
          </div>
        </div>

        {/* Metrics List */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 flex-shrink-0">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="flex items-center gap-1.5 text-xs">
                <Icon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" strokeWidth={2} />
                <span className="text-gray-600 flex-1 truncate">{metric.label}</span>
                <span className="font-medium text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded text-2xs">
                  {metric.rank}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}