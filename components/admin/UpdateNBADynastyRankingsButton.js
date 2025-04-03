'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useState } from 'react';

function UpdateNBADynastyRankingsButton() {
  const { user } = useUser();
  const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;
  const isAdmin = user && user.sub === adminSub;
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const areRankingsIdentical = (listA, listB) => {
    if (listA.length !== listB.length) return false;

    return listA.every((playerA) => {
      const playerB = listB.find(p => p.playerId === playerA.playerId);
      return playerB && playerA.rank === playerB.rank;
    });
  };

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      // First, fetch the latest rankings data from CSV
      const fetchResponse = await fetch('/api/fetch/NBA/NBADynastyRankingsStore', {
        method: 'POST',
      });
      const fetchData = await fetchResponse.json();

      if (!fetchResponse.ok) {
        throw new Error(fetchData.error || 'Failed to fetch rankings');
      }

      // Get the latest version to compare
      const latestVersionResponse = await fetch('/api/rankings/latest?sport=NBA&format=Dynasty');
      const latestVersionData = await latestVersionResponse.json();

      // Check if the new rankings are different from the current version
      if (latestVersionData.version && areRankingsIdentical(latestVersionData.rankings, fetchData.rankings)) {
        setError('No changes detected in rankings. Skipping update.');
        return;
      }

      // Then, create a new version with the fetched data
      const versionResponse = await fetch('/api/rankings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sport: 'NBA',
          format: 'Dynasty',
          version: new Date().toISOString().split('T')[0].replace(/-/g, '.'), // e.g., "2024.03.21"
          rankings: fetchData.rankings || []
        }),
      });

      const versionData = await versionResponse.json();

      if (!versionResponse.ok) {
        throw new Error(versionData.error || 'Failed to create new version');
      }

      console.log('✅ Rankings updated successfully:', versionData);
    } catch (error) {
      console.error('❌ Update failed:', error.message);
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="inline-block flex items-center ml-0.5">
      <button
        onClick={handleUpdateClick}
        disabled={isUpdating}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary-500 bg-myblue px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300"
      >
        {isUpdating ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            Update Dynasty Rankings
          </>
        )}
      </button>
      {error && (
        <div className="ml-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default UpdateNBADynastyRankingsButton;
