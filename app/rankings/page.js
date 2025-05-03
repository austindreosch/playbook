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

// import Footer from '@/components/Layout/Footer';
// import Header from '@/components/Layout/Header';
import AddRankingListButton from '@/components/RankingsPage/AddRankingListButton';
import DraftModeButton from '@/components/RankingsPage/DraftModeButton';
import RankingsPlayerListContainer from '@/components/RankingsPage/RankingsPlayerListContainer';
import RankingsPlayerListHeader from '@/components/RankingsPage/RankingsPlayerListHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import { Skeleton } from '@/components/ui/skeleton';
import { SPORT_CONFIGS } from '@/lib/config'; // Import SPORT_CONFIGS
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  // == ALL HOOKS DECLARED FIRST ==

  // -- State Hooks --
  const [latestUserRankings, setLatestUserRankings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRankingId, setActiveRankingId] = useState(null);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [selectedSport, setSelectedSport] = useState('NBA');

  // -- Ref Hooks --
  const listContainerRef = useRef(null);

  // -- Auth Hook --
  const { user } = useUser();

  // -- Store Hooks --
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
    initAutoSave,
    isDraftModeActive,
    showDraftedPlayers,
    toggleDraftMode,
    toggleShowDraftedPlayers,
    resetDraftAvailability,
    setPlayerAvailability,
    selectAndTouchRanking
  } = useUserRankings();

  // -- Memo Hooks --
  const currentSportConfig = useMemo(() => {
    const sportKey = selectedSport?.toLowerCase();
    return sportKey ? SPORT_CONFIGS[sportKey] : null;
  }, [selectedSport]);

  const rankingDefinition = useMemo(() => activeRanking?.definition, [activeRanking]);

  // Derive enabled categories and mapping from config
  const { enabledCategoryAbbrevs, statPathMapping } = useMemo(() => {
    if (!currentSportConfig || !rankingDefinition?.categories) {
      // console.log(`[Category Calculation] Memo: Missing config or definition for ${selectedSport}`);
      return { enabledCategoryAbbrevs: [], statPathMapping: {} };
    }
    const mapping = currentSportConfig.statPathMapping || {};
    const enabledAbbrevs = Object.entries(rankingDefinition.categories)
      .filter(([_, catData]) => catData.enabled)
      .map(([abbrev, _]) => abbrev);

    const finalEnabledAbbrevs = enabledAbbrevs.filter(abbrev => {
      if (mapping[abbrev]) return true;
      console.warn(`[Category Calculation] Memo: Enabled abbreviation "${abbrev}" from ranking definition does not have a path defined in SPORT_CONFIGS[${selectedSport?.toLowerCase()}]?.statPathMapping. Excluding.`);
      return false;
    });
    // console.log(`[Category Calculation] Memo: Final enabled for ${selectedSport}:`, finalEnabledAbbrevs);
    // console.log(`[Category Calculation] Memo: Using mapping for ${selectedSport}:`, mapping);
    return {
      enabledCategoryAbbrevs: finalEnabledAbbrevs,
      statPathMapping: mapping
    };
  }, [currentSportConfig, rankingDefinition, selectedSport]);

  // Get the correct master data slice based on selected sport
  const currentSportMasterData = useMemo(() => {
    const sportKey = selectedSport?.toLowerCase();
    if (sportKey === 'nba') return nba;
    if (sportKey === 'mlb') return mlb;
    if (sportKey === 'nfl') return nfl;
    return {};
  }, [selectedSport, nba, mlb, nfl]);

  // Process players for the table
  const processedPlayers = useMemo(() => {
    if (!activeRanking?.players || !currentSportMasterData || _.isEmpty(currentSportMasterData.players) || !currentSportConfig?.infoPathMapping) {
      // Added check for infoPathMapping
      console.log('[ProcessedPlayers] Missing data or infoPathMapping');
      return [];
    }

    const infoMapping = currentSportConfig.infoPathMapping; // Get info mapping

    return activeRanking.players.map((player, index) => {
      const playerId = player.playerId; // Use the ID from the ranking itself
      // Find player data using the ID from the ranking list (assuming it matches player.id in master data)
      const playerData = currentSportMasterData.players.find(p => String(_.get(p, infoMapping.PlayerID)) === String(playerId));

      if (!playerData) {
        console.warn(`[RankingsPage] ProcessedPlayers: Player data not found in masterDataset slice for ID: ${playerId}`);
        // Return minimal placeholder data
        return {
            ...player,
            rank: index + 1,
            name: 'Player Not Found',
            position: 'N/A',
            team: 'N/A',
            age: 'N/A',
            stats: {},
            rawPlayerData: null
        };
      }

      // Calculate stats using statPathMapping
      const stats = {};
      if (statPathMapping && !_.isEmpty(statPathMapping)) {
        enabledCategoryAbbrevs.forEach(abbrev => {
          const path = statPathMapping[abbrev];
          if (path) {
            const statValue = _.get(playerData, path, null);
            stats[abbrev] = statValue !== null ? statValue : '--';
          }
        });
      }

      // Construct player name using infoPathMapping
      const firstName = _.get(playerData, infoMapping.FirstName, '');
      const lastName = _.get(playerData, infoMapping.LastName, '');

      // Return combined data using infoPathMapping for info fields
      return {
        ...player,
        rank: index + 1,
        name: `${firstName} ${lastName}`.trim(),
        position: _.get(playerData, infoMapping.Position, 'N/A'),
        team: _.get(playerData, infoMapping.TeamAbbreviation, 'N/A'),
        age: _.get(playerData, infoMapping.Age, 'N/A'),
        // You can add other mapped info fields here if needed by child components
        // e.g., officialImageSrc: _.get(playerData, infoMapping.OfficialImageSrc, null),
        stats: stats,
        rawPlayerData: playerData // Still useful to pass raw data for potential complex logic/tooltips
      };
    });
     // Add currentSportConfig to dependency array for infoPathMapping access
  }, [activeRanking?.players, currentSportMasterData, enabledCategoryAbbrevs, statPathMapping, currentSportConfig]);

  const draftedCount = useMemo(() => {
    if (!activeRanking?.players) return 0;
    return activeRanking.players.filter(p => !p.draftModeAvailable).length;
  }, [activeRanking?.players]);

  // -- Effect Hooks --
  useEffect(() => {
    const cleanup = initAutoSave();
    return () => cleanup();
  }, [initAutoSave]);

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
      setIsLoading(true);
      let fetchedRankingsList = null;
      let initialActiveData = null;
      try {
        const listResponse = await fetch('/api/user-rankings');
        if (!listResponse.ok) throw new Error('Failed to fetch user rankings list');
        fetchedRankingsList = await listResponse.json();

        if (fetchedRankingsList?.length > 0) {
          const mostRecent = [...fetchedRankingsList].sort((a, b) => new Date(b.details?.dateUpdated) - new Date(a.details?.dateUpdated))[0];
          if (mostRecent?._id) {
            try {
              const detailResponse = await fetch(`/api/user-rankings/${mostRecent._id}`);
              if (detailResponse.ok) initialActiveData = await detailResponse.json();
              else console.error(`Failed to fetch initial ranking details for ${mostRecent._id}`);
            } catch (detailError) {
              console.error(`Error fetching initial ranking details for ${mostRecent._id}:`, detailError);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user rankings list:', err);
        setError(err.message);
        setLatestUserRankings(null);
        setActiveRanking(null);
      } finally {
        setLatestUserRankings(fetchedRankingsList || []);
        if (initialActiveData) {
          const sport = initialActiveData.sport;
          const sportKey = sport.toLowerCase();
          const existingData = currentSportMasterData;

          if (!existingData?.players?.length) {
             // Trigger fetch *only if needed*
             if (sportKey === 'nba') fetchNbaData();
             else if (sportKey === 'mlb') fetchMlbData();
             else if (sportKey === 'nfl') fetchNflData();
             else console.warn("Unknown sport for initial fetch:", sport);
          }
          setActiveRanking(initialActiveData);
          setSelectedSport(sport);
          setActiveRankingId(initialActiveData._id);
        } else {
          setActiveRanking(null);
          setActiveRankingId(null);
        }
         // Setting loading false is now handled by the dedicated loading effect
      }
    };
    fetchUserRankings();
  }, [setActiveRanking, fetchNbaData, fetchMlbData, fetchNflData, currentSportMasterData]); // Depend on currentSportMasterData

  useEffect(() => {
    // Consolidated loading logic
    const isMasterDataReady = !!currentSportMasterData?.players?.length;
    const isRankingsListReady = latestUserRankings !== null;
    const isActiveRankingReady = (latestUserRankings?.length === 0) || (latestUserRankings?.length > 0 && activeRanking !== null);

    // Set loading to false only when all necessary data is confirmed
    if (isRankingsListReady && isActiveRankingReady && isMasterDataReady) {
      setIsLoading(false);
    }
     // Consider if setIsLoading(true) is needed if dependencies change, e.g., selectedSport
  }, [latestUserRankings, activeRanking, currentSportMasterData]); // Depends on derived master data

  // -- Callback Hooks --
  const handleCollapseAll = useCallback(() => {
    setCollapseAllTrigger(prev => prev + 1);
  }, []);

  const handleRankingSelect = useCallback(async (rankingId) => {
    if (!rankingId) return;
    setActiveRankingId(rankingId);
    const newActiveRanking = await selectAndTouchRanking(rankingId);
    if (newActiveRanking) {
      setSelectedSport(newActiveRanking.sport); // Set sport based on selection
    }
    setCollapseAllTrigger(prev => prev + 1);
  }, [selectAndTouchRanking, setSelectedSport]); // Added setSelectedSport dependency

  const handleSortChange = useCallback((newKey_abbreviation) => {
    let sortKeyToSet = null;
    if (newKey_abbreviation === 'zScoreSum') {
      sortKeyToSet = 'zScoreSum';
    } else {
      let fullPath = statPathMapping[newKey_abbreviation]; // Use derived mapping
      if (!fullPath) {
        console.warn(`[Sort Warning] No path found for abbreviation: ${newKey_abbreviation}.`);
        return;
      }
      sortKeyToSet = fullPath;
    }
    setSortConfig(currentConfig => {
      if (currentConfig.key === sortKeyToSet) {
        return { ...currentConfig, direction: currentConfig.direction === 'desc' ? 'asc' : 'desc' };
      } else {
        return { key: sortKeyToSet, direction: 'desc' };
      }
    });
  }, [statPathMapping]); // Depends on derived mapping

  // == RENDER LOGIC ==

  // Loading check AFTER hooks
  if (isLoading || masterDatasetLoading || rankingsLoading) {
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
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => ( // Simulate a few saved ranking items
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error check AFTER hooks
  if (error || masterDatasetError || rankingsError) {
      return (
          <div className="container mx-auto p-4 text-red-500">
              Error: {error || masterDatasetError?.message || rankingsError?.message}
          </div>
      );
  }

  // Main Render AFTER hooks and checks
  return (
    <div className="container mx-auto p-4">
       {/* <Header /> */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide">Rankings</h1>
        <div className="flex items-center gap-2">
          {activeRanking && (
            <DraftModeButton
              isDraftMode={isDraftModeActive}
              onDraftModeChange={toggleDraftMode}
              showDrafted={showDraftedPlayers}
              onShowDraftedChange={toggleShowDraftedPlayers}
              onResetDraft={resetDraftAvailability}
              draftedCount={draftedCount}
              activeRanking={activeRanking}
            />
          )}
          {/* Pass currentSportMasterData for context */}
          <AddRankingListButton dataset={currentSportMasterData} />
        </div>
      </div>

      {latestUserRankings.length === 0 ? (
         // ... Keep your existing Get Started UI ...
         <div className="text-center py-12 px-4 bg-white border-t border-gray-100">
           <div className="max-w-md mx-auto">
             <h2 className="text-2xl font-bold text-pb_blue mb-4">Welcome to the Rankings Hub!</h2>
             <p className="text-gray-600 mb-6">Build your own fantasy sports rankings. Start from expert opinions then tailor them to your own values and strategy.</p>
 
             <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
               <h3 className="font-semibold text-gray-800 mb-3">Getting Started:</h3>
               <ol className="text-left text-gray-600 space-y-2 mb-4">
                 <li className="flex items-start">
                   <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0 font-bold">1</span>
                   <span>Click the &quot;Create New Rankings&quot; button above.</span>
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
 
             <AddRankingListButton dataset={currentSportMasterData} />
           </div>
         </div>
      ) : (
        <div className="flex gap-6 relative">
          <div className="flex-1 space-y-2 overflow-x-auto" style={{ maxWidth: 'calc(100% - 288px)' }}>
            <RankingsPlayerListHeader
              sport={selectedSport}
              activeRanking={activeRanking}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              enabledCategoryAbbrevs={enabledCategoryAbbrevs}
              onCollapseAll={handleCollapseAll}
            />
            <RankingsPlayerListContainer
              ref={listContainerRef}
              sport={selectedSport}
              players={processedPlayers}
              activeRanking={activeRanking}
              sortConfig={sortConfig}
              enabledCategoryAbbrevs={enabledCategoryAbbrevs}
              statPathMapping={statPathMapping}
              collapseAllTrigger={collapseAllTrigger}
            />
          </div>
          <div className="w-72 sticky top-4">
            <RankingsSidePanel
              userRankings={latestUserRankings}
              activeRankingId={activeRankingId}
              onSelectRanking={handleRankingSelect}
            />
          </div>
        </div>
      )}
       {/* <Footer /> */}
    </div>
  );
}
