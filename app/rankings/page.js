'use client';

/*
This is the main Rankings page component that allows users to create and manage custom player rankings.
It handles:
- Fetching and displaying user's saved ranking lists
- Loading master player datasets for NBA/MLB/NFL 
- Auto-saving functionality when changes are made
- Switching between different sports
- Selecting and displaying ranking lists

Key interactions:
- Uses useMasterDataset store to fetch player data for each sport
- Uses useUserRankings store to manage ranking state and auto-save
- Communicates with /api/user-rankings endpoints to fetch/save rankings
- Renders child components:
  - AddRankingListButton - Creates new ranking lists
  - RankingsPlayerListHeader - Shows header info (categories, weights, etc.) for current ranking
  - RankingsPlayerListContainer - Displays and manages ranked players
  - RankingsSidePanel - Shows list of saved rankings
*/

import AddRankingListButton from '@/components/RankingsPage/AddRankingListButton';
import RankingsPlayerListContainer from '@/components/RankingsPage/RankingsPlayerListContainer';
import RankingsPlayerListHeader from '@/components/RankingsPage/RankingsPlayerListHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings from '@/stores/useUserRankings';
import { useCallback, useEffect, useRef, useState } from 'react';

// --- NEW: Add NFL Mapping (or import from shared location) ---
const NFL_STAT_ABBREVIATION_TO_PATH_MAP = {
  // --- Advanced / Other --- 
  'PPG': 'advanced.fantasyPointsPerGame',
  'PPS': 'advanced.fantasyPointsPerSnap',
  'OPG': 'advanced.opportunitiesPerGame',
  'OPE': 'advanced.opportunityEfficiency',
  'YD%': 'advanced.yardShare',
  'PR%': 'advanced.productionShare',
  'TD%': 'advanced.touchdownRate',
  'BP%': 'advanced.bigPlayRate',
  'TO%': 'advanced.turnoverRate',
  // Add other categories from your map if needed...
};

export default function RankingsPage() {
  const [latestUserRankings, setLatestUserRankings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRankingId, setActiveRankingId] = useState(null);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [statPathMapping, setStatPathMapping] = useState({});
  const [chosenCategoryPaths, setChosenCategoryPaths] = useState([]);
  const [enabledCategoryAbbrevs, setEnabledCategoryAbbrevs] = useState([]);
  const listContainerRef = useRef(null);

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
  // useEffect(() => {
  //   const fetchSportData = async () => {
  //     try {
  //       switch (selectedSport) {
  //         case 'NBA':
  //           await fetchNbaData();
  //           break;
  //         case 'MLB':
  //           await fetchMlbData();
  //           break;
  //         case 'NFL':
  //           await fetchNflData();
  //           break;
  //         default:
  //           break;
  //       }
  //     } catch (err) {
  //       console.error(`Error fetching ${selectedSport} data:`, err);
  //     }
  //   };

  //   fetchSportData();
  // }, [selectedSport, fetchNbaData, fetchMlbData, fetchNflData]);

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

  // --- MOVED & UPDATED: useEffect for Category Mapping --- 
  useEffect(() => {
    const currentSportLower = selectedSport.toLowerCase();

    // --- NEW: Determine which dataset source to use INSIDE the effect ---
    let sourceDataset;
    if (currentSportLower === 'nba') sourceDataset = nba;
    else if (currentSportLower === 'mlb') sourceDataset = mlb;
    else if (currentSportLower === 'nfl') sourceDataset = nfl;
    else sourceDataset = null;

    // Ensure necessary data exists before proceeding
    // Check activeRanking, categories, AND that the source dataset for the sport is loaded
    if (!activeRanking?.categories || !sourceDataset?.players?.length) {
      setStatPathMapping({});
      setChosenCategoryPaths([]);
      setEnabledCategoryAbbrevs([]);
      // Reset sort if categories/data disappear
      setSortConfig({ key: null, direction: 'desc' });
      return;
    }

    // 1. Determine the mapping strategy
    let currentMapping = {};
    let currentEnabledAbbrevs = [];

    if (currentSportLower === 'nfl') {
      // Strategy for NFL: Use the predefined manual map
      currentMapping = NFL_STAT_ABBREVIATION_TO_PATH_MAP;
      console.log('[NFL Mapping] Using manual stat paths:', currentMapping);
    } else {
      // Strategy for NBA/Other: Generate from abbreviations in the first player's stats
      const firstPlayerStats = sourceDataset.players[0]?.stats;
      if (firstPlayerStats) {
        Object.entries(firstPlayerStats).forEach(([key, stat]) => {
          // Check if stat is an object with 'abbreviation' property
          if (stat && typeof stat === 'object' && stat.abbreviation) {
            currentMapping[stat.abbreviation] = key; // Map abbrev -> key (e.g., 'PTS' -> 'pointsPerGame')
          }
          // TODO: Add handling for potential raw values if structure varies?
        });
        console.log(`[${selectedSport} Mapping] Generated paths from abbreviations:`, currentMapping);
      } else {
        console.warn(`[${selectedSport} Mapping] Could not generate paths: No stats found for the first player.`);
      }
    }

    setStatPathMapping(currentMapping); // Store the calculated map

    // 2. Get all enabled abbreviations from the active ranking definition
    const enabledAbbrevsFromRanking = Object.entries(activeRanking.categories)
      .filter(([_, value]) => value.enabled)
      .map(([abbrev]) => abbrev);

    // --- NEW: Filter these based on what actually exists in the current sport's mapping --- 
    const finalEnabledAbbrevs = enabledAbbrevsFromRanking.filter(abbrev => {
      const pathExists = currentMapping.hasOwnProperty(abbrev);
      if (!pathExists) {
        console.warn(`[Category Calculation] Enabled abbreviation "${abbrev}" from ranking definition does not exist in generated map for ${selectedSport}. Excluding.`);
      }
      return pathExists;
    });

    // 3. Calculate chosenCategoryPaths using only the filtered, valid abbreviations
    const enabledPaths = finalEnabledAbbrevs.map(abbrev => currentMapping[abbrev]);

    setChosenCategoryPaths(enabledPaths); // State now holds actual paths/keys for valid stats
    setEnabledCategoryAbbrevs(finalEnabledAbbrevs); // State holds valid abbrevs for header

    // Reset sort if categories change (check based on valid paths)
    setSortConfig(currentConfig => {
      if (currentConfig.key !== null && !enabledPaths.includes(currentConfig.key)) {
        console.log(`[Sort Reset] Current sort key ${currentConfig.key} no longer enabled. Resetting.`);
        return { key: null, direction: 'desc' };
      }
      return currentConfig; // Keep current sort otherwise
    });

  }, [activeRanking?.categories, selectedSport, nba, mlb, nfl]); // Depend on source data

  // Add handler function to trigger collapse
  const handleCollapseAll = () => {
    setCollapseAllTrigger(prev => prev + 1);
  };

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
      setSelectedSport(rankingData.sport);
      setCollapseAllTrigger(prev => prev + 1);
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

  const handleSortChange = useCallback((newKey_abbreviation) => {
    // --- UPDATED: Use statPathMapping state --- 
    let fullPath = statPathMapping[newKey_abbreviation];

    if (!fullPath) {
      console.warn(`[Sort Warning] No path found in statPathMapping for abbreviation: ${newKey_abbreviation}. Sorting might not work.`);
      fullPath = newKey_abbreviation; // Fallback, but likely won't sort correctly
    }

    console.log(`[Sort] Header clicked: ${newKey_abbreviation}, Translated path: ${fullPath}`);

    setSortConfig(currentConfig => {
      if (currentConfig.key === fullPath) {
        return { key: null, direction: 'desc' };
      } else {
        return { key: fullPath, direction: 'desc' };
      }
    });
    listContainerRef.current?.resetListCache();
  }, [statPathMapping]); // Depend on the generated mapping

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

      {latestUserRankings.length === 0 ? (
        <div className="text-center py-12 px-4 bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-sm border border-gray-100">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-pb_blue mb-4">Welcome to the Rankings Hub</h2>
            <p className="text-gray-600 mb-6">Create personalized rankings for NBA, NFL, and MLB to track your favorite players and make better fantasy decisions.</p>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Getting Started:</h3>
              <ol className="text-left text-gray-600 space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0">1</span>
                  <span>Click the "Create Rankings List" button above</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0">2</span>
                  <span>Select your sport, format and scoring preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0">3</span>
                  <span>Customize your rankings to match your strategy</span>
                </li>
              </ol>
            </div>

            <AddRankingListButton dataset={datasetForSelectedSport} />
          </div>
        </div>
      ) : (
        <div className="flex gap-6 relative">
          <div className="flex-1 space-y-2 overflow-x-auto" style={{ maxWidth: 'calc(100% - 288px)' }}>
            <RankingsPlayerListHeader
              sport={selectedSport}
              userRankings={latestUserRankings}
              activeRanking={activeRanking}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              enabledCategoryAbbrevs={enabledCategoryAbbrevs}
              statPathMapping={statPathMapping}
              onCollapseAll={handleCollapseAll}
            />

            <RankingsPlayerListContainer
              ref={listContainerRef}
              sport={selectedSport}
              dataset={datasetForSelectedSport}
              activeRanking={activeRanking}
              sortConfig={sortConfig}
              chosenCategoryPaths={chosenCategoryPaths}
              collapseAllTrigger={collapseAllTrigger}
            />
          </div>

          <div className="w-72 sticky top-4">
            <RankingsSidePanel
              onSelectRanking={handleRankingSelect}
              collapseAllTrigger={collapseAllTrigger}
            />
          </div>
        </div>
      )}
    </div>
  );
}
