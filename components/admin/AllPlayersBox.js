'use client';

import useMasterDataset from '@/stores/useMasterDataset';
import { useEffect, useState } from 'react';

export default function AllPlayersBox() {
  const { nba, fetchNbaData } = useMasterDataset();

  useEffect(() => {
    if (!nba.players.length) {
      fetchNbaData();
    }
  }, [fetchNbaData]);

  return (
    <div className="border rounded-lg p-4 w-full max-w-md h-96 overflow-y-auto bg-white shadow">
      <h2 className="text-lg font-semibold mb-3">Players in DB </h2>
      <ul className="space-y-1 text-sm text-gray-700">
        {nba.players.map((p, i) => (
          <li key={p.info.playerId}>
            {p.info.firstName} {p.info.lastName} <span className="text-gray-400">({p.info.team}, {p.info.position})</span> - ID: {p.info.playerId}
          </li>
        ))}
      </ul>
    </div>
  );
}
