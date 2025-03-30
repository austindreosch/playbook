'use client';

import PlayerListContainer from '@/components/PlayerRow/PlayerListContainer';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';

// Example dummy data
const dummyPlayers = [
  {
    id: 1,
    name: 'Donovan Mitchell',
    position: 'SG',
    team: 'CLE',
    stats: {
      // You can add actual stats here when needed
    }
  },
  {
    id: 2,
    name: 'Victor Wembanyama',
    position: 'C',
    team: 'SAS',
    stats: {
      // You can add actual stats here when needed
    }
  },
  {
    id: 3,
    name: 'LeBron James',
    position: 'SF',
    team: 'LAL',
    stats: {
      // You can add actual stats here when needed
    }
  },
  {
    id: 4,
    name: 'Luka Dončić',
    position: 'PG',
    team: 'DAL',
    stats: {
      // You can add actual stats here when needed
    }
  },
  {
    id: 5,
    name: 'Joel Embiid',
    position: 'C',
    team: 'PHI',
    stats: {
      // You can add actual stats here when needed
    }
  }
];

export default function RankingsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customized Rankings</h1>

      <div className="flex gap-6">
        {/* Main content area */}
        <div className="flex-1">
          <PlayerListContainer
            dataset={dummyPlayers}
            sport="NBA"
          />
        </div>

        {/* Side panel - fixed width */}
        <div className="w-80">
          <RankingsSidePanel />
        </div>
      </div>
    </div>
  );
}
