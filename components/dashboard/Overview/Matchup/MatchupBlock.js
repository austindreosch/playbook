import { Calendar, Check, ChevronLeft, ChevronRight, Crown, DollarSign, FileText, Medal, Shield, ShieldAlert, Swords, Users, Wrench } from 'lucide-react';


export default function MatchupBlock() {


  // Player lineup data
  const lineup = [
    { name: 'A. Sengun', isPlaying: false, isInjured: true },
    { name: 'C. Capela', isPlaying: true, isInjured: false },
    { name: 'A. Caruso', isPlaying: true, isInjured: false },
    { name: 'S. Barnes', isPlaying: false, isInjured: true }
  ];

  // Missing players data
  const missingPlayersTeam = [
    { name: 'J. Tatum', isOut: true },
    { name: 'C. Holmgren', isOut: true },
    { name: 'A. Sengun', isInjured: true },
    { name: 'S. Barnes', isInjured: true }
  ];

  const missingPlayersOpponent = [
    { name: 'S. Gilgeous-Alexa...', isOut: true },
    { name: 'P. George', isOut: true },
    { name: 'T. Murphy III', isOut: true }
  ];








  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Swords className="w-icon h-icon text-pb_darkgray" />
          <h3 className="text-sm font-semibold text-pb_darkgray">Matchup</h3>
        </div>
        
        {/* Week selector */}
        <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1">
          <ChevronLeft className="w-4 h-4 text-gray-400" strokeWidth={2} />
          <span className="text-xs font-medium text-gray-600">Week 7</span>
          <span className="text-xs text-gray-400 hidden sm:inline">(12/4 - 12/10)</span>
          <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-pb_lightgray hover:scrollbar-thumb-pb_midgray scrollbar-track-transparent">
        {/* Projected Win section */}
        <div className="mb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Projected Win</span>
              <Crown className="w-4 h-4 text-gray-500" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 truncate">v.s. Opponent Team</span>
              <FileText className="w-4 h-4 text-gray-500" strokeWidth={2} />
            </div>
          </div>
          
          {/* Win probability bar */}
          <div className="flex h-6 rounded-lg overflow-hidden">
            <div className="bg-emerald-400 flex items-center justify-center text-white font-semibold text-sm" style={{ width: '57%' }}>
              5.7
            </div>
            <div className="bg-red-400 flex items-center justify-center text-white font-semibold flex-1 text-sm">
              4.3
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mb-3 flex-shrink-0">
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1.5 flex-1 min-w-0">
            <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" strokeWidth={2} />
            <span className="text-xs text-gray-600">Games</span>
            <span className="text-xs font-semibold text-gray-800">8</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1.5 flex-1 min-w-0">
            <Users className="w-3 h-3 text-gray-500 flex-shrink-0" strokeWidth={2} />
            <span className="text-xs text-gray-600">Cap</span>
            <span className="text-xs font-semibold text-gray-800">5</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1.5 flex-1 min-w-0">
            <Medal className="w-3 h-3 text-gray-500 flex-shrink-0" strokeWidth={2} />
            <span className="text-xs text-gray-600">Rank</span>
            <span className="text-xs font-semibold text-gray-800">4th</span>
          </div>
        </div>

        {/* Lineup and Battleground Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
          {/* Player Lineup */}
          <div>
            <div className="space-y-1">
              {lineup.map((player, index) => (
                <div key={index} className="flex items-center gap-1">
                  {player.isInjured ? (
                    <Wrench className="w-3 h-3 text-gray-500 flex-shrink-0" strokeWidth={2} />
                  ) : (
                    <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" strokeWidth={2} />
                  )}
                  <span className="text-xs text-gray-700 truncate">{player.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Battleground Stats */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <ShieldAlert className="w-3 h-3 text-gray-600 flex-shrink-0" strokeWidth={2} />
              <h4 className="text-xs font-semibold text-gray-700">Battleground</h4>
            </div>
            
            <div className="flex gap-1 mb-1">
              <div className="bg-emerald-400 text-white text-xs font-medium px-2 py-0.5 rounded flex-1 text-center">REB</div>
              <div className="bg-red-300 text-white text-xs font-medium px-2 py-0.5 rounded flex-1 text-center">STL</div>
              <div className="bg-emerald-400 text-white text-xs font-medium px-2 py-0.5 rounded flex-1 text-center">TO</div>
            </div>
            
            <div className="flex gap-1">
              <span className="text-xs text-gray-600 flex-1 text-center">+3</span>
              <span className="text-xs text-gray-600 flex-1 text-center">-1</span>
              <span className="text-xs text-gray-600 flex-1 text-center">+2</span>
            </div>
          </div>
        </div>

        {/* Missing Players section */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-semibold text-gray-700">Missing Players</h4>
              <FileText className="w-3 h-3 text-gray-600" strokeWidth={2} />
            </div>
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800">
              <Wrench className="w-3 h-3" strokeWidth={2} />
              <span className="hidden sm:inline">Fix Lineup</span>
            </button>
          </div>

          {/* Progress bars */}
          <div className="flex gap-1 mb-2">
            <div className="h-1 bg-emerald-400 rounded-full" style={{ width: '45%' }}></div>
            <div className="h-1 bg-red-400 rounded-full flex-1"></div>
          </div>

          {/* Missing players lists */}
          <div className="grid grid-cols-2 gap-2">
            {/* Team missing players */}
            <div className="space-y-1">
              {missingPlayersTeam.map((player, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded border border-gray-400 flex items-center justify-center flex-shrink-0">
                    {player.isOut && <ShieldAlert className="w-2 h-2 text-gray-600" strokeWidth={2} />}
                    {player.isInjured && <Wrench className="w-2 h-2 text-gray-600" strokeWidth={2} />}
                  </div>
                  <span className="text-xs text-gray-700 truncate">{player.name}</span>
                </div>
              ))}
            </div>

            {/* Opponent missing players */}
            <div className="space-y-1">
              {missingPlayersOpponent.map((player, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded border border-gray-400 flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-2 h-2 text-gray-600" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-gray-700 truncate">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}