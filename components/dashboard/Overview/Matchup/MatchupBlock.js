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
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Swords className="w-icon h-icon text-pb_darkgray" />
          <h3 className="text-sm font-semibold text-pb_darkgray">Matchup</h3>
        </div>
        
        {/* Week selector */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5">
          <ChevronLeft className="w-4 h-4 text-gray-400" strokeWidth={2} />
          <span className="text-sm font-medium text-gray-600">Week 7</span>
          <span className="text-sm text-gray-400">(12/4 - 12/10)</span>
          <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
        </div>
      </div>

      {/* Projected Win section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-600">Projected Win</span>
            <Crown className="w-5 h-5 text-gray-500" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500">v.s. Opponent Team</span>
            <FileText className="w-5 h-5 text-gray-500" strokeWidth={2} />
          </div>
        </div>
        
        {/* Win probability bar */}
        <div className="flex h-8 rounded-lg overflow-hidden">
          <div className="bg-emerald-400 flex items-center justify-center text-white font-semibold" style={{ width: '57%' }}>
            5.7
          </div>
          <div className="bg-red-400 flex items-center justify-center text-white font-semibold flex-1">
            4.3
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <Calendar className="w-4 h-4 text-gray-500" strokeWidth={2} />
          <span className="text-sm text-gray-600">Games Left</span>
          <span className="text-sm font-semibold text-gray-800">8</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <Users className="w-4 h-4 text-gray-500" strokeWidth={2} />
          <span className="text-sm text-gray-600">Cap</span>
          <span className="text-sm font-semibold text-gray-800">5</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <Medal className="w-4 h-4 text-gray-500" strokeWidth={2} />
          <span className="text-sm text-gray-600">Rank</span>
          <span className="text-sm font-semibold text-gray-800">4th</span>
        </div>
      </div>

      {/* Lineup and Battleground Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Player Lineup */}
        <div>
          <div className="space-y-2">
            {lineup.map((player, index) => (
              <div key={index} className="flex items-center gap-2">
                {player.isInjured ? (
                  <Wrench className="w-4 h-4 text-gray-500" strokeWidth={2} />
                ) : (
                  <Check className="w-4 h-4 text-emerald-500" strokeWidth={2} />
                )}
                <span className="text-sm text-gray-700">{player.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Battleground Stats */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-gray-600" strokeWidth={2} />
            <h4 className="text-base font-semibold text-gray-700">Battleground Stats</h4>
          </div>
          
          <div className="flex gap-2 mb-2">
            <div className="bg-emerald-400 text-white text-sm font-medium px-3 py-1 rounded">REB</div>
            <div className="bg-red-300 text-white text-sm font-medium px-3 py-1 rounded">STL</div>
            <div className="bg-emerald-400 text-white text-sm font-medium px-3 py-1 rounded">TO</div>
          </div>
          
          <div className="flex gap-6">
            <span className="text-sm text-gray-600">+3</span>
            <span className="text-sm text-gray-600">-1</span>
            <span className="text-sm text-gray-600">+2</span>
          </div>
        </div>
      </div>

      {/* Missing Players section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-gray-700">Missing Players</h4>
            <FileText className="w-5 h-5 text-gray-600" strokeWidth={2} />
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
            <Wrench className="w-4 h-4" strokeWidth={2} />
            <span>Fix Lineup</span>
          </button>
        </div>

        {/* Progress bars */}
        <div className="flex gap-2 mb-3">
          <div className="h-1.5 bg-emerald-400 rounded-full" style={{ width: '45%' }}></div>
          <div className="h-1.5 bg-red-400 rounded-full flex-1"></div>
        </div>

        {/* Missing players lists */}
        <div className="grid grid-cols-2 gap-4">
          {/* Team missing players */}
          <div className="space-y-1">
            {missingPlayersTeam.map((player, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded border border-gray-400 flex items-center justify-center">
                  {player.isOut && <ShieldAlert className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />}
                  {player.isInjured && <Wrench className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />}
                </div>
                <span className="text-sm text-gray-700">{player.name}</span>
              </div>
            ))}
          </div>

          {/* Opponent missing players */}
          <div className="space-y-1">
            {missingPlayersOpponent.map((player, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded border border-gray-400 flex items-center justify-center">
                  <ShieldAlert className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />
                </div>
                <span className="text-sm text-gray-700">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}