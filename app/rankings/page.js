'use client';

import PlayerListContainer from '@/components/PlayerList/PlayerListContainer';
import AddRankingListButton from '@/components/RankingsPage/AddRankingListButton';
import PlayerListRankingHeader from '@/components/RankingsPage/PlayerListRankingHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import MasterDataset from '@/stores/MasterDataset';
import { availableCategories } from '@/utilities/dummyData/AvailableCategoriesDummyData';
import { useEffect, useState } from 'react';

export default function RankingsPage() {
  const [latestRankings, setLatestRankings] = useState(null);
  const [userRankings, setUserRankings] = useState([]);
  const [activeRankingId, setActiveRankingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { nba, fetchNbaData, isLoading: masterDatasetLoading, error: masterDatasetError } = MasterDataset();

  // Fetch expert rankings
  useEffect(() => {
    const fetchLatestRankings = async () => {
      try {
        const response = await fetch('/api/fetch/NBA/GetNBADynastyRankings');
        if (!response.ok) {
          setLatestRankings(null);
          return;
        }
        const data = await response.json();
        setLatestRankings(data.rankings);
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setLatestRankings(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestRankings();
  }, []);

  // Fetch user rankings
  useEffect(() => {
    const fetchUserRankings = async () => {
      try {
        const response = await fetch('/api/user-rankings');
        if (response.status === 401) {
          // User is not logged in
          setError('Please log in to view your rankings');
          setUserRankings([]);
          return;
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch user rankings: ${response.status}`);
        }
        const data = await response.json();
        setUserRankings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user rankings:', err);
        setError('Failed to load your rankings. Please try again later.');
        setUserRankings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRankings();
  }, []);

  useEffect(() => {
    console.log('Fetching NBA data...');
    fetchNbaData();
  }, []);

  console.log('Current NBA state:', nba);

  const handleRankingSelect = async (rankingId) => {
    setActiveRankingId(rankingId);

    try {
      // Fetch the specific ranking data
      const response = await fetch(`/api/user-rankings/${rankingId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ranking');
      }
      const rankingData = await response.json();

      // Update the UI with this ranking's data
      // This depends on how you want to display it - could be:
      // - Updating the player list with this ranking
      // - Showing a comparison view
      // - Displaying historical changes

    } catch (error) {
      console.error('Error loading ranking:', error);
      // Handle error (maybe show an error message to user)
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading rankings...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customized Rankings</h1>
        <AddRankingListButton />
      </div>

      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {!latestRankings ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No rankings available yet.</p>
          <p className="text-sm text-gray-500">Create your first rankings list to get started.</p>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Main content area */}
          {/* <div className="flex-1 space-y-2">
            <PlayerListRankingHeader
              sport="NBA"
              dataset={latestRankings}
              availableCategories={availableCategories}
            />

            <PlayerListContainer
              dataset={latestRankings}
              sport="NBA"
            />
          </div> */}

          {/* Side panel - fixed width */}
          <div className="w-72">
            <RankingsSidePanel
              rankings={userRankings}
              activeRankingId={activeRankingId}
              onSelectRanking={handleRankingSelect}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        <h2>Debug View</h2>
        {masterDatasetLoading && <div>Loading...</div>}
        {masterDatasetError && <div className="text-red-500">Error: {masterDatasetError}</div>}
        <div className="mt-4">
          <h3>Regular Stats (First 3 players):</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(nba.players.slice(0, 3), null, 2)}
          </pre>

          <h3 className="mt-4">Projections (First 3 players):</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(nba.projections.slice(0, 3), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
