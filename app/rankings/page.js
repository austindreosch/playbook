'use client';

import PlayerListContainer from '@/components/PlayerList/PlayerListContainer';
import PlayerListRankingHeader from '@/components/RankingsPage/PlayerListRankingHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';

import AddRankingListButton from '@/components/RankingsPage/AddRankingListButton';
import { availableCategories } from '@/utilities/dummyData/AvailableCategoriesDummyData';
import { PlayerListDummyData } from '@/utilities/dummyData/PlayerListDummyData';
import { dummyUserRankings } from '@/utilities/dummyData/dummyUserRankings';
import { useState } from 'react';
export default function RankingsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customized Rankings</h1>
        <AddRankingListButton />
      </div>

      <div className="flex gap-6">
        {/* Main content area */}
        <div className="flex-1 space-y-2">
          <PlayerListRankingHeader
            // categories={dummyCategories}
            sport="NBA"
            dataset={PlayerListDummyData}
            userRankings={dummyUserRankings}
            availableCategories={availableCategories}
          />

          <PlayerListContainer
            dataset={PlayerListDummyData}
            sport="NBA"
            // categories={dummyCategories}
            userRankings={dummyUserRankings}
          />
        </div>

        {/* Side panel - fixed width */}
        <div className="w-72">
          <RankingsSidePanel
            userRankings={dummyUserRankings}
          />
        </div>
      </div>
    </div>
  );
}
