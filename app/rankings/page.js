'use client';

import PlayerListContainer from '@/components/PlayerList/PlayerListContainer';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import { PlayerListDummyData } from '@/utilities/dummyData/PlayerListDummyData';

export default function RankingsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customized Rankings</h1>

      <div className="flex gap-6">
        {/* Main content area */}
        <div className="flex-1">
          <PlayerListContainer
            dataset={PlayerListDummyData}
            sport="NBA"
          />
        </div>

        {/* Side panel - fixed width */}
        <div className="w-72">
          <RankingsSidePanel />
        </div>
      </div>
    </div>
  );
}
