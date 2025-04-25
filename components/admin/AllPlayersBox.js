'use client';

import useMasterDataset from '@/stores/useMasterDataset';
import { useEffect, useState } from 'react';

export default function AllPlayersBox() {
  const { nba, nfl, mlb, fetchNbaData, fetchNflData, fetchMlbData } = useMasterDataset();

  useEffect(() => {
    if (!nba.players.length) {
      fetchNbaData();
    }
    if (!nfl?.players?.length) {
      fetchNflData();
    }
    if (!mlb?.players?.length) {
      fetchMlbData();
    }
  }, [fetchNbaData, fetchNflData, fetchMlbData, nba.players.length, nfl?.players?.length, mlb?.players?.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border rounded-lg p-4 w-full h-96 overflow-y-auto bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">NBA Players in DB</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          {nba.players.map((p, i) => (
            <li key={p.info.playerId || p.info.id}>
              {p.info.firstName} {p.info.lastName} <span className="text-gray-400">({p.info.team}, {p.info.position})</span> - ID: {p.info.playerId || p.info.id}
            </li>
          ))}
        </ul>
      </div>

      <div className="border rounded-lg p-4 w-full h-96 overflow-y-auto bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">NFL Players in DB</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          {nfl?.players?.map((p, i) => (
            <li key={p.info.id}>
              {p.info.firstName} {p.info.lastName} <span className="text-gray-400">({p.info.team}, {p.info.position})</span> - ID: {p.info.id}
            </li>
          )) || <li>Loading NFL players...</li>}
        </ul>
      </div>

      <div className="border rounded-lg p-4 w-full h-96 overflow-y-auto bg-white shadow">
        <h2 className="text-lg font-semibold mb-3">MLB Players in DB</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          {mlb?.players?.map((p, i) => (
            <li key={p.info.id}>
              {p.info.firstName} {p.info.lastName} 
            </li>
          )) || <li>Loading MLB players...</li>}
        </ul>
      </div>
    </div>
  );
}
