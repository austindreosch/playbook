'use client';

import PlayerListContainer from '@/components/PlayerList/PlayerListContainer';
import AddRankingListButton from '@/components/RankingsPage/AddRankingListButton';
import PlayerListRankingHeader from '@/components/RankingsPage/PlayerListRankingHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import { availableCategories } from '@/utilities/dummyData/AvailableCategoriesDummyData';
import { useEffect, useState } from 'react';

export default function RankingsPage() {
  const [latestRankings, setLatestRankings] = useState(null);
  const [userRankings, setUserRankings] = useState([]);
  const [activeRankingId, setActiveRankingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleRankingSelect = (rankingId) => {
    setActiveRankingId(rankingId);
    // TODO: Load the selected ranking's data
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
    </div>
  );
}
