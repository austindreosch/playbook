'use client';

import AddRankingListButton from '@/components/RankingsPage/AddRankingListButton';
import RankingsPlayerListContainer from '@/components/RankingsPage/RankingsPlayerListContainer';
import RankingsPlayerListHeader from '@/components/RankingsPage/RankingsPlayerListHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings from '@/stores/useUserRankings';
import { useEffect, useState } from 'react';

export default function RankingsPage() {
  const [latestUserRankings, setLatestUserRankings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRankingId, setActiveRankingId] = useState(null);

  const {
    nba, mlb, nfl,
    fetchNbaData, fetchMlbData, fetchNflData,
    isLoading: masterDatasetLoading,
    error: masterDatasetError
  } = useMasterDataset();

  const {
    activeRanking,
    setActiveRanking,
    isLoading: rankingsLoading,
    error: rankingsError,
    initAutoSave
  } = useUserRankings()

  const [selectedSport, setSelectedSport] = useState('NBA');

  // Initialize auto-save
  useEffect(() => {
    const cleanup = initAutoSave();
    return () => cleanup();
  }, [initAutoSave]);

  // Fetch master dataset based on selected sport
  useEffect(() => {
    const fetchSportData = async () => {
      try {
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
          default:
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${selectedSport} data:`, err);
      }
    };

    fetchSportData();
  }, [selectedSport, fetchNbaData, fetchMlbData, fetchNflData]);

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

  useEffect(() => {
    const fetchUserRankings = async () => {
      try {
        const response = await fetch('/api/user-rankings');
        if (!response.ok) {
          throw new Error('Failed to fetch user rankings');
        }
        const data = await response.json();
        console.log('Fetched User Rankings:', data);
        setLatestUserRankings(data);

        // Auto-select most recent ranking if none is selected
        if (data?.length > 0 && !activeRankingId) {
          const mostRecent = [...data].sort((a, b) =>
            new Date(b.details?.dateUpdated) - new Date(a.details?.dateUpdated)
          )[0];
          if (mostRecent) {
            handleRankingSelect(mostRecent._id);
          }
        }
      } catch (err) {
        console.error('Error fetching user rankings:', err);
        setError(err.message);
        setLatestUserRankings(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRankings();
  }, []); // Only run on mount

  const handleRankingSelect = async (rankingId) => {
    if (!rankingId) return;

    try {
      setActiveRankingId(rankingId);
      const response = await fetch(`/api/user-rankings/${rankingId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ranking');
      }
      const rankingData = await response.json();
      console.log('Active Ranking Data:', rankingData);
      setActiveRanking(rankingData);
    } catch (error) {
      console.error('Error loading ranking:', error);
      setError(error.message);
    }
  };

  // Get the appropriate dataset based on selected sport
  const getDatasetForSelectedSport = () => {
    switch (selectedSport) {
      case 'NBA':
        return { nba: nba };
      case 'MLB':
        return { mlb: mlb };
      case 'NFL':
        return { nfl: nfl };
      default:
        return { players: [] };
    }
  };

  const datasetForSelectedSport = getDatasetForSelectedSport();


  // useEffect(() => {
  //   console.log('Current Sport Data:', datasetForSelectedSport);
  // }, [datasetForSelectedSport]);


  if (isLoading || masterDatasetLoading || rankingsLoading) {
    return <div className="container mx-auto p-4">Loading rankings...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customized Rankings</h1>
        <AddRankingListButton dataset={datasetForSelectedSport} />
      </div>

      {(error || masterDatasetError || rankingsError) && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-md">
          {error || masterDatasetError || rankingsError}
        </div>
      )}

      {!latestUserRankings ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No rankings available yet.</p>
          <p className="text-sm text-gray-500">Create your first rankings list to get started.</p>
        </div>
      ) : (
        <div className="flex gap-6 relative">
          <div className="flex-1 space-y-2 overflow-x-auto" style={{ maxWidth: 'calc(100% - 288px)' }}>
            <RankingsPlayerListHeader
              sport={selectedSport}
              userRankings={latestUserRankings}
              activeRanking={activeRanking}
            />

            <RankingsPlayerListContainer
              sport={selectedSport}
              userRankings={latestUserRankings}
              dataset={datasetForSelectedSport}
              activeRanking={activeRanking}
            />
          </div>

          <div className="w-72 sticky top-4">
            <RankingsSidePanel
              userRankings={latestUserRankings}
              activeRanking={activeRanking}
              onSelectRanking={handleRankingSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
