'use client';

import PlayerListContainer from '@/components/PlayerList/PlayerListContainer';
import AddRankingListButton from '@/components/RankingsPage/AddRankingListButton';
import PlayerListRankingHeader from '@/components/RankingsPage/PlayerListRankingHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings from '@/stores/useUserRankings';
import { availableCategories } from '@/utilities/dummyData/AvailableCategoriesDummyData';
import { useEffect, useState } from 'react';

export default function RankingsPage() {
  const [latestUserRankings, setLatestUserRankings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    nba, mlb, nfl,
    fetchNbaData, fetchMlbData, fetchNflData,
    isLoading: masterDatasetLoading,
    error: masterDatasetError
  } = useMasterDataset();
  const { rankings, activeRanking, isLoading: rankingsLoading, error: rankingsError, initAutoSave } = useUserRankings();
  const [selectedSport, setSelectedSport] = useState('NBA');

  // Initialize auto-save
  useEffect(() => {
    const cleanup = initAutoSave();
    return () => cleanup(); // Clean up interval on component unmount
  }, [initAutoSave]);

  // Fetch expert rankings
  useEffect(() => {
    const fetchLatestRankings = async () => {
      try {
        const response = await fetch('/api/fetch/NBA/GetNBADynastyRankings');
        if (!response.ok) {
          setLatestUserRankings(null);
          return;
        }
        const data = await response.json();
        setLatestUserRankings(data.rankings);
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setLatestUserRankings(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestRankings();
  }, []);

  // Fetch master dataset based on selected sport
  useEffect(() => {
    const fetchSportData = async () => {
      switch (selectedSport) {
        case 'NBA':
          await fetchNbaData();
          break;
        case 'MLB':
          await fetchMlbData();
          break;
        case 'NFL':
          await fetchNflData();
          break;
      }
    };

    fetchSportData();
  }, [selectedSport]);

  // Handle saving when user tries to leave the page
  useEffect(() => {
    const { hasUnsavedChanges, saveChanges } = useUserRankings.getState();

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        saveChanges();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleRankingSelect = async (rankingId) => {
    setActiveRankingId(rankingId);

    try {
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

  // Get the appropriate dataset based on selected sport
  const getSportData = () => {
    switch (selectedSport) {
      case 'NBA':
        return nba;
      case 'MLB':
        return mlb;
      case 'NFL':
        return nfl;
      default:
        return { players: [] };
    }
  };

  const currentSportData = getSportData();
  const filteredData = currentSportData.players;

  if (isLoading || masterDatasetLoading) {
    return <div className="container mx-auto p-4">Loading rankings...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customized Rankings</h1>
        <AddRankingListButton masterDataset={currentSportData} />
      </div>

      {(error || masterDatasetError) && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-md">
          {error || masterDatasetError}
        </div>
      )}

      {!latestUserRankings ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No rankings available yet.</p>
          <p className="text-sm text-gray-500">Create your first rankings list to get started.</p>
        </div>
      ) : (
        <div className="flex gap-6 relative">
          {/* Main content area with max-width to prevent pushing side panel */}
          <div className="flex-1 space-y-2 overflow-x-auto" style={{ maxWidth: 'calc(100% - 288px)' }}>
            <PlayerListRankingHeader
              sport={selectedSport}
              rankings={latestUserRankings}
              activeRanking={activeRanking}
              masterDataset={currentSportData}
            />

            <PlayerListContainer
              sport={selectedSport}
              userRankings={latestUserRankings}
              dataset={filteredData}
              masterDataset={currentSportData}
            />
          </div>

          {/* Side panel - fixed position */}
          <div className="w-72 sticky top-4">
            <RankingsSidePanel
              userRankings={latestUserRankings}
              activeRanking={activeRanking}
              onSelectRanking={handleRankingSelect}
            // masterDataset={currentSportData}
            />
          </div>
        </div>
      )}

    </div>
  );
}
