import { Clock, Dna, Shield, TrendingUp, Trophy, Zap } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

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

  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-300 shadow-sm p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Dna className="w-5 h-5 text-gray-600" strokeWidth={2} />
        <h3 className="text-base font-semibold text-gray-700">Team Archetype</h3>
      </div>

      <div className="flex-1 flex items-center gap-8">
        {/* Metrics List */}
        <div className="flex-1 space-y-2">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-500" strokeWidth={2} />
                <span className="text-sm text-gray-600 flex-1">{metric.label}</span>
                <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded">
                  {metric.rank}
                </span>
              </div>
            );
          })}
        </div>

        {/* Radar Chart Container */}
        <div className="relative" style={{ width: '180px', height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid 
                gridType="polygon" 
                radialLines={false}
                stroke="#e5e7eb"
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
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
          
          {/* Icon labels positioned absolutely */}
          {/* Top - Value */}
          <div className="absolute" style={{ top: '0px', left: '50%', transform: 'translateX(-50%)' }}>
            <TrendingUp className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
          {/* Top Right - Power */}
          <div className="absolute" style={{ top: '35px', right: '10px' }}>
            <Zap className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
          {/* Bottom Right - Victory */}
          <div className="absolute" style={{ bottom: '35px', right: '10px' }}>
            <Trophy className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
          {/* Bottom Left - Age */}
          <div className="absolute" style={{ bottom: '35px', left: '10px' }}>
            <Clock className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
          {/* Top Left - Futures */}
          <div className="absolute" style={{ top: '35px', left: '10px' }}>
            <Shield className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}