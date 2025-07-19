import { AlertTriangle, Clock, Heart, Shield, Trophy, Users } from 'lucide-react';

export default function TeamProfileBlock() {
  // Position data - exact colors from design
  const positions = [
    { label: 'PG', value: '4nd', color: 'bg-sky-400' },
    { label: 'SG', value: '5th', color: 'bg-lime-400' },
    { label: 'SF', value: '9th', color: 'bg-orange-300' },
    { label: 'PF', value: '4th', color: 'bg-red-400' },
    { label: 'C', value: '1st', color: 'bg-violet-400' }
  ];

  // Stats data - exact colors from design
  const statsRow1 = [
    { label: 'FG%', color: 'bg-emerald-400' },
    { label: 'FT%', color: 'bg-red-300' },
    { label: '3PM', color: 'bg-red-300' },
    { label: 'PTS', color: 'bg-emerald-400' },
    { label: 'REB', color: 'bg-teal-500' }
  ];

  const statsRow2 = [
    { label: 'AST', color: 'bg-red-300' },
    { label: 'STL', color: 'bg-emerald-400' },
    { label: 'BLK', color: 'bg-teal-500' },
    { label: 'TO', color: 'bg-emerald-400' },
    { label: '', color: 'bg-gray-200' }
  ];

  // Bottom tags with Lucide icons
  const tags = [
    { icon: Shield, label: 'Heavy Punt' },
    { icon: Trophy, label: 'Contending' },
    { icon: Clock, label: 'Aging' },
    { icon: AlertTriangle, label: 'Poor Playoff Schedule' },
    { icon: Heart, label: 'Injured Team' }
  ];

  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-300 shadow-sm p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <Users className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Team Profile</h3>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-pb_lightgray hover:scrollbar-thumb-pb_midgray scrollbar-track-transparent">
        {/* Position Stats - Single row with values below */}
        <div className="flex gap-1 mb-2 flex-shrink-0">
          {positions.map((pos, index) => (
            <div key={index} className="flex-1 min-w-0">
              <div className={`${pos.color} text-white text-xs font-semibold py-1 rounded-t text-center`}>
                {pos.label}
              </div>
              <div className="bg-gray-100 text-gray-500 text-xs py-0.5 text-center">
                {pos.value}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid - Two rows */}
        <div className="space-y-1 mb-2 flex-shrink-0">
          <div className="flex gap-1">
            {statsRow1.map((stat, index) => (
              <div key={index} className={`flex-1 ${stat.color} text-white text-xs font-semibold py-1 rounded text-center min-w-0`}>
                {stat.label}
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {statsRow2.map((stat, index) => (
              <div key={index} className={`flex-1 ${stat.color} ${stat.label ? 'text-white' : ''} text-xs font-semibold py-1 rounded text-center min-w-0`}>
                {stat.label}
              </div>
            ))}
          </div>
        </div>

        {/* Tags - Two rows */}
        <div className="space-y-1.5 flex-shrink-0">
          <div className="flex gap-1 flex-wrap">
            {tags.slice(0, 3).map((tag, index) => {
              const Icon = tag.icon;
              return (
                <div key={index} className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-full bg-white flex-1 min-w-0">
                  <Icon className="w-3 h-3 text-gray-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs text-gray-600 truncate">{tag.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-1 flex-wrap">
            {tags.slice(3).map((tag, index) => {
              const Icon = tag.icon;
              return (
                <div key={index + 3} className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-full bg-white flex-1 min-w-0">
                  <Icon className="w-3 h-3 text-gray-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs text-gray-600 truncate">{tag.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}