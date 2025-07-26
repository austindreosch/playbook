import { Button } from '@/components/alignui/button';
import { AlertTriangle, FileText, FileUp, Heart, Maximize2, Plus, SlidersHorizontal, Snowflake, Target, TrendingDown, TrendingUp, Wrench } from 'lucide-react';
import Link from 'next/link';

/**
 * Dashboard block prompting the user to import a league so we can display
 * roster-level insights. Sits inside the left sidebar of the overview screen.
 */
export default function RosterViewImportLeague() {





  const players = [
    { rank: 1, name: 'Victor Wembanyama', position: 'C', value: 10.30, icon: Plus },
    { rank: 2, name: 'Shai Gilgeous-Alexander', position: 'PG', value: 8.04 },
    { rank: 3, name: 'Nikola Jokic', position: 'C', value: 10.47, icon: TrendingUp, iconColor: 'text-green-500' },
    { rank: 4, name: 'Luka Doncic', position: 'SG', value: 5.14 },
    { rank: 5, name: 'Jayson Tatum', position: 'PF', value: 4.60, icon: AlertTriangle, iconColor: 'text-red-500' },
    { rank: 6, name: 'Cade Cunningham', position: 'PG', value: 2.80 },
    { rank: 7, name: 'LaMelo Ball', position: 'PG', value: 2.24, icon: Heart, iconColor: 'text-gray-700' },
    { rank: 8, name: 'Tyrese Haliburton', position: 'PG', value: 5.69, icon: FileText },
    { rank: 9, name: 'Anthony Edwards', position: 'SG', value: 3.70, icon: Snowflake, iconColor: 'text-blue-400' },
    { rank: 10, name: 'Chet Holmgren', position: 'C', value: 1.72 },
    { rank: 11, name: 'Jalen Williams', position: 'SG', value: 2.95 },
    { rank: 12, name: 'Giannis Antetokounmpo', position: 'SF', value: 3.97, icon: TrendingDown, iconColor: 'text-red-500' },
    { rank: 13, name: 'Trae Young', position: 'PG', value: 1.78 },
    { rank: 14, name: 'Scottie Barnes', position: 'SF', value: 1.67, icon: FileText },
    { rank: 15, name: 'Tyrese Maxey', position: 'PG', value: 4.79 },
    { rank: 16, name: 'Evan Mobley', position: 'C', value: 2.98 },
    { rank: 17, name: 'Amen Thompson', position: 'PG', value: 1.54 },
    { rank: 18, name: 'Karl-Anthony Towns', position: 'C', value: 4.53 },
    { rank: 19, name: 'Alperen Sengun', position: 'C', value: 0.42, icon: Wrench }
  ];

  // Placeholder avatars - in production these would be actual player images
  const getAvatar = (rank) => {
    return '👤';
  };





  return (
    <div className="w-full h-full bg-pb_backgroundgray flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 text-white px-3 py-2 flex items-center justify-between rounded-lg flex-shrink-0">
        <Target className="w-4 h-4" strokeWidth={2} />
        <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
        <Maximize2 className="w-4 h-4" strokeWidth={2} />
      </div>

      {/* Player List */}
      <div className="p-1.5 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-pb_lightgray hover:scrollbar-thumb-pb_midgray scrollbar-track-transparent">
        {players.map((player) => {
          const Icon = player.icon;
          
          return (
            <div key={player.rank} className="bg-white rounded-lg shadow-sm border border-gray-200 px-2 py-2 flex items-center hover:shadow-md transition-shadow min-h-0">
              {/* Rank */}
              <div className="w-6 text-sm font-medium text-gray-700 flex-shrink-0">
                {player.rank}
              </div>

              {/* Avatar */}
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs mx-2 flex-shrink-0">
                {getAvatar(player.rank)}
              </div>

              {/* Name and Position */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-gray-800 font-medium text-sm truncate">{player.name}</span>
                  <span className="text-gray-400 text-xs uppercase flex-shrink-0">{player.position}</span>
                </div>
              </div>

              {/* Icon */}
              <div className="w-5 flex justify-center flex-shrink-0">
                {Icon && (
                  <Icon className={`w-4 h-4 ${player.iconColor || 'text-gray-600'}`} strokeWidth={2} />
                )}
              </div>

              {/* Value */}
              <div className="w-12 text-right text-gray-600 font-medium text-xs flex-shrink-0">
                {player.value.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>



    </div>
  );
}


