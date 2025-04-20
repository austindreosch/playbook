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
import DraftModeButton from '@/components/RankingsPage/DraftModeButton';
import RankingsPlayerListContainer from '@/components/RankingsPage/RankingsPlayerListContainer';
import RankingsPlayerListHeader from '@/components/RankingsPage/RankingsPlayerListHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import { Skeleton } from '@/components/ui/skeleton';
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
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
  const { user } = useUser();

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
      setIsLoading(true); // Ensure loading starts true
      let fetchedRankingsList = null;
      let initialActiveData = null;

      try {
        // 1. Fetch the list of rankings
        const listResponse = await fetch('/api/user-rankings');
        if (!listResponse.ok) {
          throw new Error('Failed to fetch user rankings list');
        }
        fetchedRankingsList = await listResponse.json();
        console.log('Fetched User Rankings List:', fetchedRankingsList);

        // 2. Determine the most recent ranking ID
        if (fetchedRankingsList?.length > 0) {
          const mostRecent = [...fetchedRankingsList].sort((a, b) =>
            new Date(b.details?.dateUpdated) - new Date(a.details?.dateUpdated)
          )[0];

          // 3. Fetch the full data for the most recent ranking
          if (mostRecent?._id) {
            try {
              console.log(`Fetching initial active ranking: ${mostRecent._id}`);
              const detailResponse = await fetch(`/api/user-rankings/${mostRecent._id}`);
              if (detailResponse.ok) {
                initialActiveData = await detailResponse.json();
                console.log('Fetched Initial Active Ranking Data:', initialActiveData);
              } else {
                console.error(`Failed to fetch initial ranking details for ${mostRecent._id}, status: ${detailResponse.status}`);
                // Proceed without initial active data, list will still load
              }
            } catch (detailError) {
              console.error(`Error fetching initial ranking details for ${mostRecent._id}:`, detailError);
              // Proceed without initial active data
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user rankings list:', err);
        setError(err.message);
        // Ensure list state is cleared on error
        setLatestUserRankings(null);
        setActiveRanking(null); // Clear active ranking on error
      } finally {
        // 4. Update state AFTER all fetching (or errors) are done
        setLatestUserRankings(fetchedRankingsList || []); // Set the list (or empty array)

        if (initialActiveData) {
          const sport = initialActiveData.sport; // Get the sport

          // 5. Trigger the master data fetch for the determined sport
          // Check if data already exists before fetching
          const sportKey = sport.toLowerCase();
          let existingData = null;
          if (sportKey === 'nba') existingData = nba;
          else if (sportKey === 'mlb') existingData = mlb;
          else if (sportKey === 'nfl') existingData = nfl;

          if (!existingData?.players?.length) {
            console.log(`Triggering master fetch for initial sport: ${sport}`);
            if (sport === 'NBA') {
              fetchNbaData();
            } else if (sport === 'MLB') {
              fetchMlbData();
            } else if (sport === 'NFL') {
              fetchNflData();
            } else {
              console.warn("Unknown sport for initial fetch:", sport);
            }
          } else {
            console.log(`Master data for initial sport ${sport} already present.`);
          }

          // 6. Set the active ranking and sport states
          setActiveRanking(initialActiveData);          // Update store
          setSelectedSport(sport);                     // Update local sport state
          setActiveRankingId(initialActiveData._id);   // Update local ID state
        } else {
          // If no initial active data could be fetched (empty list, error, etc.)
          setActiveRanking(null); // Ensure store is cleared
          setActiveRankingId(null);
        }
      }
    };

    fetchUserRankings();
    // Dependencies: Added fetch functions and master data states
  }, [setActiveRanking, fetchNbaData, fetchMlbData, fetchNflData, nba, mlb, nfl]);

  // --- NEW useEffect to determine final loading state --- 
  useEffect(() => {
    // Determine if the master dataset for the *currently selected* sport is loaded
    let isMasterDataReady = false;
    const sportKey = selectedSport?.toLowerCase();
    if (sportKey === 'nba') isMasterDataReady = !!nba?.players?.length;
    else if (sportKey === 'mlb') isMasterDataReady = !!mlb?.players?.length;
    else if (sportKey === 'nfl') isMasterDataReady = !!nfl?.players?.length;
    // If sport is not set or unknown, treat master data as not ready (or adjust logic as needed)

    // Check if we have the rankings list
    const isRankingsListReady = latestUserRankings !== null;

    // Check if activeRanking is ready (only required if list is not empty)
    const isActiveRankingReady = (latestUserRankings?.length === 0) || (latestUserRankings?.length > 0 && activeRanking !== null);

    // Set loading to false only when all necessary data is confirmed
    if (isRankingsListReady && isActiveRankingReady && isMasterDataReady) {
      setIsLoading(false);
    }
    // Optional: You could explicitly set isLoading back to true here if dependencies change 
    // in a way that requires reloading, but be cautious of loops.
    // else {
    //   setIsLoading(true); 
    // }

  }, [latestUserRankings, activeRanking, selectedSport, nba, mlb, nfl]); // Watch all relevant data points

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

  // --- Loading Skeleton UI --- 
  if (isLoading || masterDatasetLoading || rankingsLoading) {
    // Return the existing Skeleton UI
    return (
      <div className="container mx-auto p-4">
        {/* Skeleton Header */}
        <div className="flex justify-between items-center mb-8 pt-2">
          <Skeleton className="h-4 w-48" /> {/* Skeleton for "RANKINGS" title */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            {/* <Skeleton className="h-8 w-28" /> 
            <Skeleton className="h-8 w-32" />  */}
          </div>
        </div>

        <div className="flex gap-6 relative pt-1">
          {/* Skeleton Left Column (Player List Area) */}
          <div className="flex-1 space-y-2 overflow-hidden" style={{ maxWidth: 'calc(100% - 288px)' }}>
            {/* Skeleton Table Header */}
            <Skeleton className="h-10 w-full rounded-sm mb-2" />
            {/* Skeleton Table Rows - More detailed */}
            <div className="space-y-1">
              {[...Array(16)].map((_, i) => ( // Simulate multiple rows
                // Row container: flex, keep minimal styles
                <div key={i} className="flex w-full h-[40px] mb-1 bg-white py-1">
                  {/* Left Section (40%) */}
                  <div className="flex items-center w-[40%] px-2 space-x-3 flex-shrink-0">
                    {/* Player Rank Skeleton*/}
                    {/* <Skeleton className="pl-8 h-7 w-10 rounded-md flex-shrink-0" /> */}
                    {/* Player Image Skeleton*/}
                    <Skeleton className="h-7 w-7 rounded-md flex-shrink-0" />
                    {/* Player Name Skeleton*/}
                    <Skeleton className="h-4 rounded-sm w-48" />
                  </div>
                  {/* Right Section (60%) */}
                  <div className="flex w-[60%] h-full gap-2 flex-grow rounded-r-md">
                    {/* Stat Skeletons (Mimic multiple columns using flex-1) */}
                    {[...Array(9)].map((_, j) => (
                      <Skeleton key={j} className="h-full flex-1 rounded-sm" />
                    ))}
                  </div>
                </div> // End Row div
              ))}
            </div>

            {/* <AddRankingListButton dataset={datasetForSelectedSp-sm} /> */}
          </div> {/* End flex-1 */}

          {/* Skeleton Right Column (Side Panel) */}
          <div className="w-72 space-y-2"> {/* Width matches RankingsSidePanel */}
            {/* <Skeleton className="h-10 w-full" />  */}
            <div className="space-y-1">
              {[...Array(2)].map((_, i) => ( // Simulate a few saved ranking items
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-bold">Welcome {user?.name?.split(' ')[0]}!</h1> */}
        <h1 className="text-2xl font-bold tracking-wide">Rankings</h1>
        {/* Button container for future expansion */}
        <div className="flex items-center gap-2">

          {/* TODO: DRAFT MODE BUTTON */}
          <DraftModeButton />
          <AddRankingListButton dataset={datasetForSelectedSport} />
        </div>
      </div>

      {(error || masterDatasetError || rankingsError) && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-md">
          {error || masterDatasetError || rankingsError}
        </div>
      )}

      {latestUserRankings.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white border-t border-gray-100">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-pb_blue mb-4">Welcome to the Rankings Hub!</h2>
            <p className="text-gray-600 mb-6">Build your own fantasy sports rankings. Start from expert opinions then tailor them to your own values and strategy.</p>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Getting Started:</h3>
              <ol className="text-left text-gray-600 space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0 font-bold">1</span>
                  <span>Click the "Create New Rankings" button above.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0 font-bold">2</span>
                  <span>Choose your desired Sport, Format, and Scoring settings.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0 font-bold">3</span>
                  <span>Generate your customized rankings sheet to start tailoring.</span>
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
