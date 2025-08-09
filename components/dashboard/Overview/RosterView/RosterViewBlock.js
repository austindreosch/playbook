import { Button } from '@/components/alignui/button';
import { AlertTriangle, Compass, FileText, FileUp, Heart, Maximize2, Newspaper, Plus, ScrollText, Snowflake, SigmaSquare, TrendingDown, TrendingUp, Wrench } from 'lucide-react';
import Link from 'next/link';
import { PlayerRow } from './PlayerRow';

/**
 * Dashboard block prompting the user to import a league so we can display
 * roster-level insights. Sits inside the left sidebar of the overview screen.
 */
export default function RosterViewImportLeague() {





  const players = [
    { playbookScore: 987, name: 'Victor Wembanyama', position: 'C', value: 10.30, icon: Snowflake, iconType: 'cold' },
    { playbookScore: 965, name: 'Shai Gilgeous-Alexander', position: 'PG', value: 8.04 },
    { playbookScore: 950, name: 'Nikola Jokic', position: 'C', value: 10.47, icon: TrendingUp, iconType: 'success' },
    { playbookScore: 930, name: 'Luka Doncic', position: 'SG', value: 5.14 },
    { playbookScore: 910, name: 'Jayson Tatum', position: 'PF', value: 4.60, icon: AlertTriangle, iconType: 'danger' },
    { playbookScore: 890, name: 'Cade Cunningham', position: 'PG', value: 2.80 },
    { playbookScore: 870, name: 'LaMelo Ball', position: 'PG', value: 2.24, icon: AlertTriangle, iconType: 'warning' },
    { playbookScore: 860, name: 'Tyrese Haliburton', position: 'PG', value: 5.69, icon: ScrollText,},
    { playbookScore: 845, name: 'Anthony Edwards', position: 'SG', value: 3.70, icon: Snowflake, iconType: 'cold' },
    { playbookScore: 830, name: 'Chet Holmgren', position: 'C', value: 1.72 },
    { playbookScore: 820, name: 'Jalen Williams', position: 'SG', value: 2.95 },
    { playbookScore: 810, name: 'Giannis Antetokounmpo', position: 'SF', value: 3.97, icon: TrendingDown, iconType: 'danger' },
    { playbookScore: 800, name: 'Trae Young', position: 'PG', value: 1.78 },
    { playbookScore: 790, name: 'Scottie Barnes', position: 'SF', value: 1.67, icon: Wrench, iconType: 'warning' },
    { playbookScore: 780, name: 'Tyrese Maxey', position: 'PG', value: 4.79 },
    { playbookScore: 770, name: 'Evan Mobley', position: 'C', value: 2.98 },
    { playbookScore: 760, name: 'Amen Thompson', position: 'PG', value: 1.54 },
    { playbookScore: 750, name: 'Karl-Anthony Towns', position: 'C', value: 4.53 },
    { playbookScore: 740, name: 'Alperen Sengun', position: 'C', value: 0.42, icon: Wrench }
  ];






  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-black text-white px-3 py-2 flex items-center gap-2 rounded-t-lg flex-shrink-0">
        <div className="flex items-center justify-center w-8">
          <Compass className="hw-icon" />
        </div>

        <div className="shrink-0">
          <div className="w-6 h-6"></div>
        </div>

        <div className="flex-1" />

        <div className="shrink-0 pr-5">
          <Newspaper className="hw-icon" />
        </div>

        <div className="flex items-center justify-start min-w-[2.5rem] pl-1.5">
          <SigmaSquare className="hw-icon" />
        </div>
      </div>

      {/* Player List */}
      <div className="pt-1.5 space-y-1 flex-1 min-h-0 overflow-y-auto scrollbar-thin ring-1 ring-inset ring-stroke-soft-200 bg-gray-25 px-1.5 scrollbar-thumb-pb_lightgray hover:scrollbar-thumb-pb_midgray scrollbar-track-transparent">
        {players.map((player) => (
          <PlayerRow
            key={player.playbookScore}
            icon={player.icon}
            iconType={player.iconType}
            name={player.name}
            position={player.position}
            value={player.value}
            playbookScore={player.playbookScore}
            type="other"
          />
        ))}
      </div>



    </div>
  );
}


