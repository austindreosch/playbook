'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useState } from 'react';

function UpdateNBADynastyCatsRankingsButton() {
  const { user } = useUser();
  const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;
  const isAdmin = user && (user.sub === adminSub || user.isAdmin);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const areRankingsIdentical = (listA, listB) => {
    if (!listA || !listB) return false;

    // First, check if the lengths are different - this is a quick initial check
    if (listA.length !== listB.length) {
      console.log('❌ Lists have different lengths:', { listALength: listA.length, listBLength: listB.length });
      return false;
    }

    console.log('🔍 Comparing rankings:');
    console.log('List A length:', listA.length);
    console.log('List B length:', listB.length);

    // Create maps for quick lookup by playerId for both lists
    const mapA = new Map(listA.map(player => [player.playerId, player]));
    const mapB = new Map(listB.map(player => [player.playerId, player]));

    // Check if the player sets are identical (same playerIds in both lists)
    const playerIdsA = new Set(mapA.keys());
    const playerIdsB = new Set(mapB.keys());

    // Check if every key in A exists in B
    for (const playerId of playerIdsA) {
      if (!mapB.has(playerId)) {
        console.log(`❌ Player ${playerId} exists in previous rankings but not in new rankings`);
        return false;
      }
    }

    // Check if every key in B exists in A
    for (const playerId of playerIdsB) {
      if (!mapA.has(playerId)) {
        console.log(`❌ Player ${playerId} exists in new rankings but not in previous rankings`);
        return false;
      }
    }

    // If we get here, both lists have the same player IDs
    // Now compare ranks and names for each player
    let mismatchCount = 0;
    const mismatches = [];

    for (const [playerId, playerB] of mapB.entries()) {
      const playerA = mapA.get(playerId);

      // Check if the names and ranks match
      const nameMatches = playerA.name === playerB.name;
      const rankMatches = playerA.rank === playerB.rank;

      if (!nameMatches || !rankMatches) {
        mismatchCount++;
        mismatches.push({
          playerId,
          previous: { name: playerA.name, rank: playerA.rank },
          new: { name: playerB.name, rank: playerB.rank },
          nameChanged: !nameMatches,
          rankChanged: !rankMatches
        });
      }
    }

    // Log detailed information about the comparison
    if (mismatchCount > 0) {
      console.log(`❌ Found ${mismatchCount} player differences:`);
      mismatches.forEach(mismatch => {
        console.log(`- Player ${mismatch.playerId}:`, mismatch);
      });
      return false;
    }

    console.log('✅ Rankings are identical - no changes detected');
    return true;
  };

  // Add this function before handleUpdateClick
  const sanitizeRankings = (rankings) => {
    // Filter out any null or undefined entries
    return rankings
      .filter(player => player && player.playerId && player.name && typeof player.rank === 'number')
      .map(player => ({
        playerId: player.playerId,
        name: player.name,
        rank: player.rank
      }));
  };



  const handleUpdateClick = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      // First, get the latest version to compare
      const latestVersionResponse = await fetch('/api/rankings/latest?sport=NBA&format=Dynasty');
      const latestVersionData = await latestVersionResponse.json();
      console.log('📥 Latest version data:', latestVersionData);

      // Then fetch the new rankings data from CSV
      const fetchResponse = await fetch('/api/fetch/NBA/NBADynastyRankingsStore', {
        method: 'POST',
      });
      const fetchData = await fetchResponse.json();
      console.log('📥 Fetch response:', fetchData);

      if (!fetchResponse.ok) {
        throw new Error(fetchData.error || 'Failed to fetch rankings');
      }

      // Get the stored rankings from the rankings collection
      const rankingsResponse = await fetch('/api/fetch/NBA/GetNBADynastyRankings');
      const rankingsData = await rankingsResponse.json();
      console.log('📥 Rankings data:', rankingsData);

      if (!rankingsResponse.ok) {
        throw new Error(rankingsData.error || 'Failed to fetch stored rankings');
      }

      // Validate that we have rankings data
      if (!rankingsData.rankings || rankingsData.rankings.length === 0) {
        throw new Error('No rankings data available to create new version');
      }

      // Inside handleUpdateClick, replace the comparison code with this
      if (latestVersionResponse.status === 404) {
        console.log('📝 No existing rankings found, proceeding with new version');
      } else if (!latestVersionResponse.ok) {
        throw new Error(latestVersionData.error || 'Failed to fetch latest rankings');
      } else {
        // Make sure we have valid data to compare
        if (!latestVersionData.rankings || !latestVersionData.rankings.length) {
          console.log('📝 Previous version has no rankings, proceeding with new version');
        } else if (!rankingsData.rankings || !rankingsData.rankings.length) {
          throw new Error('No new rankings data available to create new version');
        } else {
          // Clean both datasets before comparison
          const sanitizedLatestRankings = sanitizeRankings(latestVersionData.rankings);
          const sanitizedNewRankings = sanitizeRankings(rankingsData.rankings);

          console.log('📊 Sanitized rankings count - Latest:', sanitizedLatestRankings.length, 'New:', sanitizedNewRankings.length);

          // Compare the sanitized rankings
          const areIdentical = areRankingsIdentical(sanitizedLatestRankings, sanitizedNewRankings);
          console.log('🔍 Rankings comparison:', areIdentical ? 'Identical' : 'Different');

          if (areIdentical) {
            console.log('⏭️ No changes detected in rankings, skipping update');
            setError('No changes detected in rankings. Skipping update.');
            setIsUpdating(false);
            return;
          } else {
            console.log('🆕 Changes detected, proceeding with update');
            // You might want to log specific differences here for debugging
          }
        }
      }

      // Create new version with sanitized rankings data
      const sanitizedRankings = sanitizeRankings(rankingsData.rankings);

      const requestBody = {
        name: "NBA Dynasty Categories Rankings",
        sport: "NBA",
        format: "Dynasty",
        scoring: "Categories",
        version: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        rankings: sanitizedRankings,
        isLatest: true,
        publishedAt: new Date().toISOString(),
        details: {
          createdBy: user.sub,
          source: 'CSV Import',
          notes: 'Automatically imported from CSV',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      const versionResponse = await fetch('/api/rankings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const versionData = await versionResponse.json();
      console.log('📥 Version response:', versionData);

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
            Update NBA Dynasty Categories Rankings
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

export default UpdateNBADynastyCatsRankingsButton;
