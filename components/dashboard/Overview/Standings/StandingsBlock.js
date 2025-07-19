import { Layers } from 'lucide-react';

export default function StandingsBlock() {
  return (
    <div className="w-full h-full rounded-lg border border-gray-200 shadow-sm p-3 bg-white flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <Layers className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">Standings</h3>
        <span className="text-sm text-gray-500 ml-auto">4th</span>
      </div>
      
      {/* Record */}
      <div className="flex items-center gap-1 mb-2 flex-shrink-0">
        <span className="text-base font-bold text-gray-800">42</span>
        <span className="text-gray-400 text-sm">-</span>
        <span className="text-base font-bold text-gray-800">19</span>
        <span className="text-gray-400 text-sm">-</span>
        <span className="text-base font-bold text-gray-800">2</span>
      </div>
      
      {/* Stats Row */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="text-center flex-1">
          <div className="text-xs text-gray-500 mb-1">Matchups</div>
          <div className="flex items-center justify-center gap-0.5">
            <span className="text-xs font-semibold text-gray-800">5</span>
            <span className="text-xs text-gray-400">-</span>
            <span className="text-xs font-semibold text-gray-800">2</span>
            <span className="text-xs text-gray-400">-</span>
            <span className="text-xs font-semibold text-gray-800">0</span>
          </div>
        </div>
        
        <div className="text-center flex-1">
          <div className="text-xs text-gray-500 mb-1">Streak</div>
          <div className="text-sm font-bold text-green-600">3W</div>
        </div>
        
        <div className="text-center flex-1">
          <div className="text-xs text-gray-500 mb-1">Playoff</div>
          <div className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-semibold">
            61%
          </div>
        </div>
      </div>
      
      {/* Strength of Schedule */}
      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-gray-600">
                <path fill="currentColor" d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5A5.5 5.5 0 1113.5 8 5.5 5.5 0 018 13.5zm2.5-8.5L8 7.5 5.5 5 4 6.5 8 10.5l6-6L12.5 3z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700">Strength of Schedule</span>
          </div>
          <span className="text-xs text-gray-500">7th</span>
        </div>
        
        {/* Schedule Difficulty Bars */}
        <div className="grid grid-cols-5 gap-1">
          <div className="aspect-square bg-green-400 rounded-sm"></div>
          <div className="aspect-square bg-red-400 rounded-sm"></div>
          <div className="aspect-square bg-green-400 rounded-sm"></div>
          <div className="aspect-square bg-red-400 rounded-sm"></div>
          <div className="aspect-square bg-green-400 rounded-sm"></div>
          <div className="aspect-square bg-red-400 rounded-sm"></div>
          <div className="aspect-square bg-red-400 rounded-sm"></div>
          <div className="aspect-square bg-green-400 rounded-sm"></div>
          <div className="aspect-square bg-green-400 rounded-sm"></div>
          <div className="aspect-square bg-red-400 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}