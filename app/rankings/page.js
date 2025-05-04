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
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
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
    dataset,
    loading: masterLoading,
    error: masterError,
    fetchNbaData, fetchMlbData, fetchNflData,
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

  // Derive enabled categories and mapping from config - CORRECTED
  const { enabledCategoryAbbrevs, statPathMapping } = useMemo(() => {
    // *** Directly check activeRanking.categories ***
    if (!currentSportConfig || !activeRanking?.categories) {
      console.log('[Category Calculation] Memo: Bailing out. Missing config or activeRanking.categories.', { 
          hasConfig: !!currentSportConfig, 
          hasActiveRanking: !!activeRanking,
          hasCategories: !!activeRanking?.categories 
      });
      return { enabledCategoryAbbrevs: [], statPathMapping: {} };
    }

    console.log('[Category Calculation] Memo: Using activeRanking.categories:', JSON.stringify(activeRanking.categories));

    const mapping = currentSportConfig.statPathMapping || {};
    
    // *** Iterate directly over activeRanking.categories ***
    const enabledAbbrevs = Object.entries(activeRanking.categories)
      .filter(([_, catData]) => catData.enabled) // Filter by enabled flag
      .map(([abbrev, _]) => abbrev); // Get the abbreviation (key)

    // Filter based on mapping (unchanged)
    const finalEnabledAbbrevs = enabledAbbrevs.filter(abbrev => {
      // Ensure the abbreviation exists in the sport's mapping
      if (mapping[abbrev]) return true;
      // Optionally warn if an enabled category isn't in the map
      // console.warn(`[Category Calculation] Memo: Enabled abbreviation "${abbrev}" from ranking definition does not have a path defined in SPORT_CONFIGS[${selectedSport?.toLowerCase()}]?.statPathMapping. Excluding.`);
      return false;
    });
    
    console.log(`[Category Calculation] Memo: Calculated enabled for ${selectedSport}:`, JSON.stringify(finalEnabledAbbrevs));
    
    return {
      enabledCategoryAbbrevs: finalEnabledAbbrevs,
      statPathMapping: mapping
    };
     // *** Depend directly on activeRanking.categories and config/sport ***
  }, [currentSportConfig, activeRanking?.categories, selectedSport]);

  // Get the correct master data slice based on selected sport
  const currentSportMasterData = useMemo(() => {
    const sportKey = selectedSport?.toLowerCase();
    return sportKey ? dataset[sportKey] : null;
  }, [selectedSport, dataset]);

  // Memoize the loading/error status for the selected sport
  const selectedSportLoading = useMemo(() => {
      const sportKey = selectedSport?.toLowerCase();
      // Loading if the sport key is invalid OR the specific loading flags are true
      return !sportKey || !!(masterLoading[sportKey] || masterLoading[`identities_${sportKey}`]);
  }, [selectedSport, masterLoading]);

  const selectedSportError = useMemo(() => {
      const sportKey = selectedSport?.toLowerCase();
      // Return error if sport key is valid AND there is a specific error
      return sportKey ? (masterError[sportKey] || masterError[`identities_${sportKey}`]) : null;
  }, [selectedSport, masterError]);

  // Process players for the table
  const processedPlayers = useMemo(() => {
    const sportKey = selectedSport?.toLowerCase(); // Get sport key

    // Stricter check: Need activeRanking with a non-empty players array, AND master data players
    if (!activeRanking?.players || activeRanking.players.length === 0 || !currentSportMasterData || _.isEmpty(currentSportMasterData.players)) {
       // console.log('[ProcessedPlayers] Missing activeRanking.players array or master data players object for', selectedSport);
      return [];
    }

    const masterPlayersData = currentSportMasterData.players;

    return activeRanking.players.map((rankingEntry, index) => {
      const playerId = rankingEntry.playerId;
      const playerData = masterPlayersData[playerId];

      if (!playerData) {
        console.warn(`[RankingsPage] ProcessedPlayers: Player data not found in masterDataset for ID: ${playerId}`);
        // Return minimal placeholder using rankingEntry data
        return {
            ...rankingEntry,
            rank: index + 1,
            name: rankingEntry.name || 'Player Not Found',
            position: rankingEntry.position || 'N/A',
            team: 'N/A',
            age: 'N/A',
            stats: {}, // Keep single stats empty for placeholder
            hittingStats: {}, // Add empty objects for consistency
            pitchingStats: {}, // Add empty objects for consistency
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
        stats: playerData.stats || {}, // Pass the stats object directly from store data
        isPlaceholder: false,
        rawPlayerData: null
      };
    });
     // Dependencies: User's ranking player list, the specific players map for the current sport, and selected sport
  }, [activeRanking?.players, currentSportMasterData, selectedSport]); // Add selectedSport dependency

  const draftedCount = useMemo(() => {
    if (!activeRanking?.players) return 0;
    return activeRanking.players.filter(p => !p.draftModeAvailable).length;
  }, [activeRanking?.players]);

  // -- Effect Hooks --
  useEffect(() => {
    const cleanup = initAutoSave();
    return () => cleanup();
  }, [initAutoSave]);

  // --- Refactored: Effect 1: Fetch initial user rankings list and set initial active ranking --- 
  useEffect(() => {
    const fetchInitialRankings = async () => {
      // Only run if user exists and rankings haven't been loaded yet
      if (!user || latestUserRankings !== null) return;
      
      // console.log('[Effect 1] Fetching initial rankings list...'); // Removed log
      setIsPageLoading(true);
      setPageError(null);
      let fetchedRankingsList = null;
      let initialActiveData = null;
      let initialSport = 'NBA'; // Default sport
      let initialId = null;

      try {
        const listResponse = await fetch('/api/user-rankings');
        if (!listResponse.ok) throw new Error('Failed to fetch user rankings list');
        fetchedRankingsList = await listResponse.json();
        // console.log(`[Effect 1] Fetched ${fetchedRankingsList?.length || 0} rankings.`); // Removed log

        if (fetchedRankingsList?.length > 0) {
          // Find most recently updated ranking
          const mostRecent = [...fetchedRankingsList].sort((a, b) => 
             new Date(b.details?.dateUpdated || 0) - new Date(a.details?.dateUpdated || 0)
          )[0];
          
          if (mostRecent?._id) {
             initialId = mostRecent._id;
             // console.log(`[Effect 1] Most recent ranking ID: ${initialId}. Fetching details...`); // Removed log
            try {
              const detailResponse = await fetch(`/api/user-rankings/${initialId}`);
              if (detailResponse.ok) {
                 initialActiveData = await detailResponse.json();
                 initialSport = initialActiveData?.sport || 'NBA'; // Get sport from fetched data
                 // console.log(`[Effect 1] Successfully fetched details for ${initialId}, sport: ${initialSport}`); // Removed log
              } else {
                 console.error(`[Effect 1] Failed to fetch initial ranking details for ${initialId}. Status: ${detailResponse.status}`);
                 // Don't set initialActiveData if fetch failed
              }
            } catch (detailError) {
              console.error(`[Effect 1] Error fetching initial ranking details for ${initialId}:`, detailError);
              // Don't set initialActiveData on error
            }
          }
        }
      } catch (err) {
        console.error('[Effect 1] Error fetching user rankings list:', err);
        setPageError(err.message);
        // Still set empty list to prevent re-fetching list indefinitely
        fetchedRankingsList = []; 
      } finally {
        // Set the list of rankings regardless of detail fetch success
        setLatestUserRankings(fetchedRankingsList || []); 
        
        // Set active ranking and sport based on successful detail fetch
        if (initialActiveData && initialId) {
            setActiveRanking(initialActiveData);
            setSelectedSport(initialSport); 
            setActiveRankingId(initialId);
        } else {
            // No initial ranking to show (either no rankings exist or detail fetch failed)
            setActiveRanking(null);
            setActiveRankingId(null);
            setSelectedSport('NBA'); // Default to NBA if nothing else selected
            // No need to setIsLoading(false) here, let the data loading effect handle it
        }
        // Initial list/detail load attempt is done, subsequent loading depends on master data
      }
    };

    fetchInitialRankings();
     // This effect should run once on mount or when user changes
  }, [user, setActiveRanking]); // Removed fetch functions and currentSportMasterData

  // --- Refactored: Effect 2: Fetch master data based on selectedSport --- 
  useEffect(() => {
      const sportKey = selectedSport?.toLowerCase();
      if (!sportKey || !SPORT_CONFIGS[sportKey]) return; // Invalid sport

      // Check if data for the selected sport is already loaded
      const masterDataState = useMasterDataset.getState();
      const currentData = masterDataState.dataset[sportKey];
      const needsFetch = !currentData || _.isEmpty(currentData.players); // Check if players object is empty
      
      // console.log(`[Effect 2] Checking master data for ${selectedSport}. Needs fetch: ${needsFetch}`); // Removed log
      
      if (needsFetch) {
          setIsPageLoading(true); // Set loading true when starting fetch for this sport
          // console.log(`[Effect 2] Triggering fetch for ${selectedSport}...`); // Removed log
          // Dynamically call the correct fetch function
          if (sportKey === 'nba') {
              fetchNbaData();
          } else if (sportKey === 'mlb') {
              fetchMlbData();
          } else if (sportKey === 'nfl') {
              fetchNflData();
          } else {
              console.error(`[Effect 2] Unknown sport selected: ${selectedSport}`);
              setIsPageLoading(false); // Stop loading if sport is unknown
          }
      } else {
          // Data already exists, ensure loading state is potentially false
          // The consolidated loading effect will handle the final isLoading=false
          // console.log(`[Effect 2] Master data for ${selectedSport} already loaded.`);
      }
       // This effect runs when selectedSport changes
  }, [selectedSport, fetchNbaData, fetchMlbData, fetchNflData]); // Keep fetch functions as stable dependencies


  // --- Refactored: Effect 3: Consolidated Loading State --- 
  useEffect(() => {
    const sportKey = selectedSport?.toLowerCase(); // Get sport key for direct loading check

    // Determine overall error
    const overallError = selectedSportError || rankingsError?.message || null;
    setPageError(currentError => overallError !== currentError ? overallError : currentError);

    // --- Simplified Loading Logic ---
    const initialRankingsLoaded = latestUserRankings !== null;
    const activeRankingLoaded = !!activeRanking;
    const rankingsExist = latestUserRankings?.length > 0;

    const newLoadingState = 
        !!overallError ||                 // Error exists
        rankingsLoading ||                // Rankings store is loading
        selectedSportLoading ||           // Master data/identities for selected sport are loading
        !initialRankingsLoaded ||         // Initial list fetch incomplete
        (rankingsExist && !activeRankingLoaded); // List exists, but selected ranking not loaded yet
        
    setIsPageLoading(currentLoading => newLoadingState !== currentLoading ? newLoadingState : currentLoading);

    // --- Logging --- 
    console.log('[Effect 3 Check]', {
        sport: selectedSport,
        selectedSportLoading, // Loading stats OR identities for this sport
        rankingsLoading,      // Loading ranking list or details
        initialRankingsLoaded,
        activeRankingLoaded,
        rankingsExist,
        selectedSportError: !!selectedSportError,
        rankingsError: !!rankingsError,
        overallError: !!overallError,
        calculatedLoadingState: newLoadingState,
    });
    // --- END Logging ---

  }, [
      // Dependencies: Flags and data presence that determine loading state
      selectedSportLoading, 
      selectedSportError,   
      rankingsLoading, 
      rankingsError, 
      latestUserRankings, // Presence indicates initial list load
      activeRanking,      // Presence indicates selected detail load
      selectedSport       // Ensure re-run when sport changes
    ]);

  // *** NEW EFFECT: Log activeRanking.categories when activeRanking changes ***
  useEffect(() => {
    if (activeRanking) {
      console.log('[RankingsPage Effect Log] activeRanking updated. Categories object:', JSON.stringify(activeRanking.categories));
    } else {
      console.log('[RankingsPage Effect Log] activeRanking is null or undefined.');
    }
  }, [activeRanking]); // Run whenever the activeRanking object reference changes

  // -- Callback Hooks --
  const handleCollapseAll = useCallback(() => {
    setCollapseAllTrigger(prev => prev + 1);
  }, []);

  // Refactored: Select ranking, set sport, trigger data fetch via state change
  const handleRankingSelect = useCallback(async (rankingId) => {
    if (!rankingId || rankingId === activeRankingId) return; // Don't re-select same ranking

    // console.log(`[handleRankingSelect] Selecting ranking ${rankingId}`); // Removed log
    setIsPageLoading(true); // Set loading true when changing ranking
    setActiveRankingId(rankingId);
    // Clear previous active ranking data immediately for smoother transition
    setActiveRanking(null); 

    const newActiveRanking = await selectAndTouchRanking(rankingId);
    if (newActiveRanking) {
         // console.log(`[handleRankingSelect] New active ranking fetched, sport: ${newActiveRanking.sport}`); // Removed log
      setSelectedSport(newActiveRanking.sport); // Set sport - this will trigger Effect 2 if data needed
      setActiveRanking(newActiveRanking); // Set the full ranking object now
    } else {
        console.error(`[handleRankingSelect] Failed to fetch details for ranking ${rankingId}`);
        setPageError('Failed to load selected ranking details.');
        // Reset selection if fetch failed?
        // setActiveRankingId(null);
        // setSelectedSport('NBA'); // Revert to default?
        setIsPageLoading(false); // Stop loading on error
    }
     // Collapse is independent of selection success
    setCollapseAllTrigger(prev => prev + 1); 
  }, [activeRankingId, selectAndTouchRanking, setActiveRanking]); // Removed setSelectedSport dependency (handled by state change)

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

  // Loading check AFTER hooks - RELY ONLY ON isPageLoading
  if (isPageLoading) {
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

  // Error check AFTER hooks - Also simplify to rely on pageError first
  if (pageError) { // Use the derived pageError state
      return (
          <div className="container mx-auto p-4 text-red-500">
              Error: {pageError} 
          </div>
      );
  }

  // --- ADD LOG BEFORE FINAL RETURN ---
  // console.log('[Render Check]', {
  //     isPageLoading,
  //     pageError,
  //     selectedSport,
  //     activeRankingId: activeRanking?._id,
  //     latestUserRankingsLength: latestUserRankings?.length,
  //     processedPlayersLength: processedPlayers?.length
  // });
  // --- END LOG ---

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
              collapseAllTrigger={collapseAllTrigger}
              enabledCategoryAbbrevs={enabledCategoryAbbrevs}
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
