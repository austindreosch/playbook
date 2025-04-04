'use client';

import { useEffect, useState } from 'react';

export default function AllPlayersBox() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      const res = await fetch('/api/fetch/NBA/GetAllPlayers');
      const json = await res.json();
      setPlayers(json.players || []);
    }

    fetchPlayers();
  }, []);






  return (
    <div className="border rounded-lg p-4 w-full max-w-md h-96 overflow-y-auto bg-white shadow">
      <h2 className="text-lg font-semibold mb-3">Players in DB </h2>
      <ul className="space-y-1 text-sm text-gray-700">
        {players.map((p, i) => (
          <li key={i}>
            {p.info.fullName} <span className="text-gray-400">({p.info.team}, {p.info.pos})</span> - ID: {p.info.id}
          </li>
        ))}
      </ul>
    </div>
  );
}
