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
import useUserRankings, { setFetchedRankings } from '@/stores/useUserRankings';
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
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [activeRankingId, setActiveRankingId] = useState(null);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [selectedSport, setSelectedSport] = useState('NBA');

  // -- Ref Hooks --
  const listContainerRef = useRef(null);
  const playerListRef = useRef(null);

  // -- Auth Hook --
  const { user } = useUser();

  // -- Store Hooks --
  const {
    activeRanking,
    setActiveRanking,
    rankings: userRankings,
    rankingsLoading: userRankingsLoading,
    initialRankingsLoaded,
    activeRankingError,
    activeRankingLoading,
    initAutoSave,
    isDraftModeActive,
    showDraftedPlayers,
    toggleDraftMode,
    toggleShowDraftedPlayers,
    resetDraftAvailability,
    selectAndTouchRanking
  } = useUserRankings();

  const {
    getPlayerIdentities,
    getSeasonalStats,
    loading: masterLoading,
    error: masterError,
    fetchPlayerIdentities,
    fetchNbaData,
    fetchMlbData,
    fetchNflData,
    dataset
  } = useMasterDataset();

  // -- Callback Hooks (Define BEFORE useEffects that use them) --
  const handleCollapseAll = useCallback(() => {
    setCollapseAllTrigger(prev => prev + 1);
  }, []);

  const handleRankingSelect = useCallback(async (rankingId) => {
    if (!rankingId || rankingId === activeRankingId) {
        // If already selected or no ID, potentially just ensure loading state is false if it was true
        if (rankingId === activeRankingId) setIsPageLoading(false);
        return;
    }

    setIsPageLoading(true);
    // Optimistically set activeRankingId for the side panel, but clear activeRanking object
    setActiveRankingId(rankingId); 
    setActiveRanking(null); // Clear out old activeRanking data while new one loads

    try {
        const newActiveRanking = await selectAndTouchRanking(rankingId);
        if (newActiveRanking) {
            setSelectedSport(newActiveRanking.sport); // Update sport based on the new ranking
            // setActiveRanking(newActiveRanking); // This is already done by selectAndTouchRanking if successful
        } else {
            console.error(`[handleRankingSelect] Failed to fetch or set details for ranking ${rankingId}`);
            setPageError('Failed to load selected ranking details.');
        }
    } catch (err) {
        console.error(`[handleRankingSelect] Error during ranking selection for ${rankingId}:`, err);
        setPageError('Error selecting ranking.');
    } finally {
        // setIsPageLoading(false); // activeRanking update from store should trigger isPageLoading recalculation
        setCollapseAllTrigger(prev => prev + 1); // Collapse rows on new ranking select
    }
  }, [activeRankingId, selectAndTouchRanking, setActiveRanking, setSelectedSport /*Removed setIsPageLoading direct call*/]);

  const handleSortChange = useCallback((newKey_abbreviation) => {
    let sortKeyToSet = null;
    if (newKey_abbreviation === 'zScoreSum') {
      sortKeyToSet = 'zScoreSum';
    } else {
      sortKeyToSet = newKey_abbreviation;
    }
    setSortConfig(currentConfig => {
      if (currentConfig.key === sortKeyToSet) {
        return { key: null, direction: 'desc' }; 
      } else {
        return { key: sortKeyToSet, direction: 'desc' };
      }
    });
  }, []);

  // -- Memo Hooks (Can be after callbacks they don't depend on) --
  const currentSportConfig = useMemo(() => {
    const sportKey = selectedSport?.toLowerCase();
    return sportKey ? SPORT_CONFIGS[sportKey] : null;
  }, [selectedSport]);

  const { enabledCategoryAbbrevs, statPathMapping } = useMemo(() => {
    if (!currentSportConfig || !activeRanking?.categories) {
      console.log('[Category Calculation] Memo: Bailing out. Missing config or activeRanking.categories.', { 
          hasConfig: !!currentSportConfig, 
          hasActiveRanking: !!activeRanking,
          hasCategories: !!activeRanking?.categories 
      });
      return { enabledCategoryAbbrevs: [], statPathMapping: {} };
    }

    // console.log('[Category Calculation] Memo: Using activeRanking.categories:', JSON.stringify(activeRanking.categories));

    const mapping = currentSportConfig.statPathMapping || {};
    
    const enabledAbbrevs = Object.entries(activeRanking.categories)
      .filter(([_, catData]) => catData.enabled)
      .map(([abbrev, _]) => abbrev);

    const finalEnabledAbbrevs = enabledAbbrevs.filter(abbrev => {
      if (mapping[abbrev]) return true;
      return false;
    });
    
    // console.log(`[Category Calculation] Memo: Calculated enabled for ${selectedSport}:`, JSON.stringify(finalEnabledAbbrevs));
    
    return {
      enabledCategoryAbbrevs: finalEnabledAbbrevs,
      statPathMapping: mapping
    };
  }, [currentSportConfig, activeRanking?.categories, selectedSport]);

  const currentSportMasterData = useMemo(() => {
    const sportKey = selectedSport?.toLowerCase();
    return sportKey && dataset ? dataset[sportKey] : null;
  }, [selectedSport, dataset]);

  const selectedSportLoading = useMemo(() => {
      const sportKey = selectedSport?.toLowerCase();
      return !sportKey || !!(masterLoading[sportKey] || masterLoading[`identities_${sportKey}`]);
  }, [selectedSport, masterLoading]);

  const selectedSportError = useMemo(() => {
      const sportKey = selectedSport?.toLowerCase();
      return sportKey ? (masterError[sportKey] || masterError[`identities_${sportKey}`]) : null;
  }, [selectedSport, masterError]);

  const processedPlayers = useMemo(() => {
    const sportKey = selectedSport?.toLowerCase();

    if (!activeRanking?.players || activeRanking.players.length === 0 || !currentSportMasterData || _.isEmpty(currentSportMasterData.players)) {
       return [];
    }

    const masterPlayersData = currentSportMasterData.players;

    return activeRanking.players.map((rankingEntry, index) => {
      const playerId = rankingEntry.playerId;
      const playerData = masterPlayersData[playerId];

      if (!playerData) {
        console.warn(`[RankingsPage] ProcessedPlayers: Player data not found in masterDataset for ID: ${playerId}`);
        return {
            ...rankingEntry,
            rank: index + 1,
            name: rankingEntry.name || 'Player Not Found',
            position: rankingEntry.position || 'N/A',
            team: 'N/A',
            age: 'N/A',
            stats: {},
            hittingStats: {},
            pitchingStats: {},
            isPlaceholder: true,
            rawPlayerData: null
        };
      }

      return {
        ...rankingEntry,
        rank: index + 1,
        name: playerData.info.fullName || `${playerData.info.firstName || ''} ${playerData.info.lastName || ''}`.trim(),
        position: playerData.info.primaryPosition || 'N/A',
        team: playerData.info.teamAbbreviation || 'N/A',
        age: playerData.info.age ?? 'N/A',
        officialImageSrc: playerData.info.officialImageSrc,
        stats: playerData.stats || {},
        isPlaceholder: false,
        rawPlayerData: null
      };
    });
  }, [activeRanking?.players, currentSportMasterData, selectedSport]);

  const draftedCount = useMemo(() => {
    if (!activeRanking?.players) return 0;
    return activeRanking.players.filter(p => !p.draftModeAvailable).length;
  }, [activeRanking?.players]);

  // === DERIVED STATE FROM STORE ===
  const playerIdentities = getPlayerIdentities(selectedSport);
  const seasonalStatsData = getSeasonalStats(selectedSport);
  const identitiesLoading = masterLoading[`identities_${selectedSport?.toLowerCase()}`] ?? false;
  const statsLoading = masterLoading[selectedSport?.toLowerCase()] ?? false;
  const isMasterDataLoading = identitiesLoading || statsLoading;
  const isMasterDataReady = !isMasterDataLoading && 
                            Array.isArray(playerIdentities) && playerIdentities.length > 0 && 
                            typeof seasonalStatsData === 'object' && seasonalStatsData !== null && Object.keys(seasonalStatsData).length > 0;

  // -- Effect Hooks --
  useEffect(() => {
    const cleanup = initAutoSave();
    return () => cleanup();
  }, [initAutoSave]);

  useEffect(() => {
    if (user && !latestUserRankings) { 
        const fetchRankings = async () => {
            try {
                const response = await fetch('/api/user-rankings');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLatestUserRankings(data); 
                setFetchedRankings(data);
            } catch (error) {
                console.error('Failed to fetch user rankings:', error);
                setPageError('Failed to load user rankings data.'); 
            }
        };
        fetchRankings();
    }
  }, [user, latestUserRankings]); 

  // +++ REVISED EFFECT TO SET INITIAL ACTIVE RANKING WITH DETAILED LOGGING +++
  useEffect(() => {
    console.log('[InitialSelectEffect Check]', {
        initialRankingsLoaded,
        activeRanking: !!activeRanking, // Log as boolean for clarity
        userRankingsLength: userRankings ? userRankings.length : 'undefined',
        activeRankingLoading,
        activeRankingId
    });

    if (initialRankingsLoaded && !activeRanking && userRankings && userRankings.length > 0) {
        const firstRankingId = userRankings[0]._id;
        console.log(`[InitialSelectEffect] Conditions met. First ranking ID: ${firstRankingId}`);
        
        // Simpler condition to avoid re-triggering if already trying to load this one or it's loaded
        if (!activeRankingLoading && activeRankingId !== firstRankingId) { 
            console.log(`[InitialSelectEffect] Not currently loading and ID doesn't match. Calling handleRankingSelect(${firstRankingId})`);
            handleRankingSelect(firstRankingId);
        } else {
            console.log('[InitialSelectEffect] Conditions met, but either loading or ID matches. Skipping handleRankingSelect call.', {
                activeRankingLoading,
                activeRankingId,
                firstRankingId
            });
        }
    } else {
        console.log('[InitialSelectEffect] Conditions NOT met for auto-selection.');
    }
  }, [initialRankingsLoaded, userRankings, activeRanking, handleRankingSelect, activeRankingLoading, activeRankingId]);

  useEffect(() => {
    const sportKey = selectedSport?.toLowerCase();
    if (!sportKey) return;

    const currentIdentities = getPlayerIdentities(sportKey);
    if (!masterLoading[`identities_${sportKey}`] && (!currentIdentities || currentIdentities.length === 0)) {
       fetchPlayerIdentities(sportKey);
    }

    const currentStats = getSeasonalStats(sportKey);
    if (!masterLoading[sportKey] && (!currentStats || Object.keys(currentStats).length === 0)) {
       if (sportKey === 'nba') fetchNbaData();
       else if (sportKey === 'mlb') fetchMlbData();
       else if (sportKey === 'nfl') fetchNflData();
    }

  }, [
      selectedSport,
      fetchPlayerIdentities,
      fetchNbaData,
      fetchMlbData,
      fetchNflData,
      getPlayerIdentities,
      getSeasonalStats,
      masterLoading
  ]);

  useEffect(() => {
      const sportKey = selectedSport?.toLowerCase();
      if (!sportKey || !SPORT_CONFIGS[sportKey]) return;

      const masterDataState = useMasterDataset.getState();
      const currentData = masterDataState.dataset[sportKey];
      const needsFetch = !currentData || _.isEmpty(currentData.players);
      
      if (needsFetch) {
          setIsPageLoading(true);
          if (sportKey === 'nba') {
              fetchNbaData();
          } else if (sportKey === 'mlb') {
              fetchMlbData();
          } else if (sportKey === 'nfl') {
              fetchNflData();
          } else {
              console.error(`[Effect 2] Unknown sport selected: ${selectedSport}`);
              setIsPageLoading(false);
          }
      }
  }, [selectedSport, fetchNbaData, fetchMlbData, fetchNflData]);

  useEffect(() => {
    const sportKey = selectedSport?.toLowerCase();

    const overallError = selectedSportError || activeRankingError?.message || null;
    setPageError(currentError => overallError !== currentError ? overallError : currentError);

    const initialRankingsLoaded = latestUserRankings !== null;
    const activeRankingLoaded = !!activeRanking;
    const rankingsExist = latestUserRankings?.length > 0;

    const newLoadingState = 
        !!overallError ||                 
        userRankingsLoading ||
        activeRankingLoading ||
        selectedSportLoading ||
        !initialRankingsLoaded ||         
        (rankingsExist && !activeRankingLoaded);
        
    setIsPageLoading(currentLoading => newLoadingState !== currentLoading ? newLoadingState : currentLoading);

  }, [
      selectedSportLoading, 
      selectedSportError,   
      userRankingsLoading, 
      activeRankingLoading,
      activeRankingError,
      latestUserRankings,
      activeRanking,      
      selectedSport       
    ]);

  useEffect(() => {
    if (activeRanking) {
      // console.log('[RankingsPage Effect Log] activeRanking updated. Categories object:', JSON.stringify(activeRanking.categories));
    } else {
      console.log('[RankingsPage Effect Log] activeRanking is null or undefined.');
    }
  }, [activeRanking]);

  // == RENDER LOGIC ==

  if (isPageLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8 pt-2">
          <Skeleton className="h-4 w-48" />
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

  // Error check AFTER hooks - Also simplify to rely on pageError first
  if (pageError) { // Use the derived pageError state
      return (
          <div className="container mx-auto p-4 text-red-500">
              Error: {pageError} 
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
            {/* Player List Section */}
            <div className="flex-grow overflow-hidden">
              {/* Check for Active Ranking FIRST */}
              {!activeRanking ? (
                <div className="flex justify-center items-center h-full">
                  <p>Select or create a ranking to get started.</p>
                </div>
              // THEN check if User Rankings are loading
              ) : userRankingsLoading || activeRankingLoading ? (
                 <div className="space-y-2 mt-4">
                    {/* Skeletons for user rankings loading */}
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                    {/* Add more as needed */}
                 </div>
              // THEN check if Master Data (identities/stats) is loading
              ) : isMasterDataLoading ? (
                 <div className="space-y-2 mt-4">
                    {/* Skeletons for master data loading */}
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    {/* Add more as needed */}
                 </div>
              // THEN check if Master Data FAILED to load (but wasn't loading)
              ) : !isMasterDataReady ? (
                 <div className="flex justify-center items-center h-full">
                   <p className="text-red-500">Error loading player data or no data available for {selectedSport}. Check console.</p>
                   {/* TODO: Maybe show specific error from masterError[`identities_${sportKey}`] or masterError[sportKey] */}
                 </div>
              // FINALLY: Render the list container if all data is ready
              ) : (
                <RankingsPlayerListContainer
                  ref={playerListRef}
                  sport={selectedSport}
                  activeRanking={activeRanking}
                  sortConfig={sortConfig}
                  collapseAllTrigger={collapseAllTrigger}
                  enabledCategoryAbbrevs={enabledCategoryAbbrevs}
                  playerIdentities={playerIdentities}
                  seasonalStatsData={seasonalStatsData}
                />
              )}
            </div>
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
