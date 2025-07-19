'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useEffect, useState } from 'react';

function DetailBlock() {
  const { user } = useUser();
  const [leagues, setLeagues] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  let userAuthId = user ? user.sub : null;

  useEffect(() => {
    if (userAuthId) {
      const fetchData = async () => {
        const response = await fetch(`/api/fetch/user?userAuthId=${userAuthId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });        
        if (response.ok) {
          const userLeagues = await response.json();
          setLeagues(userLeagues);
          // Automatically select the first team
          setSelectedTeamId(userLeagues[0]?.userTeamId || null);
        } else {
          console.error('Failed to fetch leagues');
        }
      };
      fetchData();
    }
  }, [userAuthId]);

  if (!user) {
    return (
      <div className="bg-white rounded-md shadow-md overflow-hidden m-2 mx-1 h-full ">
        <h1 className='m-4 flex justify-center font-bold'>Please login to view your leagues</h1>
      </div>
    );
  }

  // Render the component
  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden m-2 mx-1 h-full text-xs p-2 ">
      <h1 className='m-4 flex justify-center font-bold'>Fetch Testblock for {userAuthId}</h1>
      <div className="m-4">
        <label htmlFor="team-selector" className="block text-sm font-bold mb-2">Select a Team:</label>
        <select
          id="team-selector"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {leagues.map((league) => (
            <option key={league.userTeamId} value={league.userTeamId}>
              {league.leagueName}
            </option>
          ))}
        </select>
      </div>
      <div>
        {leagues
          .filter((league) => league.userTeamId === selectedTeamId)
          .map((league) => (
            <div key={league.uniqueLeagueId} className='mb-4'>
              <h2>---{league.leagueName}---</h2>
              {league.teams
                .filter((team) => team.teamId === league.userTeamId)
                .map((team) => (
                  <div key={team.teamId}>
                    <b>{team.teamName}</b>
                    <ul>
                      {team.players.map((player) => (
                        <li key={player.fantraxId}>
                          {player.name} - {player.position} - {player.team}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default DetailBlock;
