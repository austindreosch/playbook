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
import CreateAllRankingsButton from '@/components/admin/CreateAllRankingsButton.jsx';
import AddRankingListButton from '@/components/RankingsPage/AddRankingListButton';
import DraftModeButton from '@/components/RankingsPage/DraftModeButton';
import RankingsPlayerListContainer from '@/components/RankingsPage/RankingsPlayerListContainer';
import RankingsPlayerListHeader from '@/components/RankingsPage/RankingsPlayerListHeader';
import RankingsSidePanel from '@/components/RankingsPage/RankingsSidePanel';
import { Skeleton } from '@/components/ui/skeleton';
import { SPORT_CONFIGS } from '@/lib/config'; // Import SPORT_CONFIGS
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings, { useInitializeUserRankings } from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';


export default function RankingsPage() {
  // == ALL HOOKS DECLARED FIRST ==

  // Call the initialization hook HERE
  useInitializeUserRankings();

  // -- State Hooks --
  const [latestUserRankings, setLatestUserRankings] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [activeRankingId, setActiveRankingId] = useState(null);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [selectedSport, setSelectedSport] = useState('NBA');
  const initialLoadEffectRan = useRef(false);

  // -- Ref Hooks --
  const listContainerRef = useRef(null);
  const playerListRef = useRef(null);

  // -- Auth Hook --
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();

  // -- Store Hooks --
  const {
    activeRanking,
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
    if (!rankingId) { 
        return; 
    }

    setIsPageLoading(true);
    setActiveRankingId(rankingId);

    try {
        await selectAndTouchRanking(rankingId);
    } catch (err) {
        console.error(`[handleRankingSelect] Error during ranking selection for ${rankingId}:`, err);
        setPageError('Error selecting ranking.');
    } finally {
        setIsPageLoading(false); 
        setCollapseAllTrigger(prev => prev + 1); 
    }
  }, [selectAndTouchRanking]);

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

  const { enabledCategoryAbbrevs } = useMemo(() => {
    if (!currentSportConfig || !activeRanking?.categories) {
      return { enabledCategoryAbbrevs: [], statPathMapping: {} };
    }
    const mapping = currentSportConfig.statPathMapping || {};
    let enabledAbbrevs = Object.entries(activeRanking.categories)
      .filter(([_, catData]) => catData.enabled)
      .map(([abbrev, _]) => abbrev);

    const sportKey = selectedSport?.toLowerCase(); 
    const isNFL = sportKey === 'nfl';
    const isPointsScoring = activeRanking?.scoring?.toLowerCase() === 'points';
    const currentPprSetting = activeRanking?.pprSetting;

    if (isNFL && isPointsScoring && currentPprSetting) {
        enabledAbbrevs = enabledAbbrevs.filter(abbrev => {
            if (abbrev === 'PPG0ppr') return currentPprSetting === '0ppr';
            if (abbrev === 'PPG0.5ppr') return currentPprSetting === '0.5ppr';
            if (abbrev === 'PPG1ppr') return currentPprSetting === '1ppr';
            return true; 
        });
    }
    const finalEnabledAbbrevs = enabledAbbrevs.filter(abbrev => {
      if (mapping[abbrev] || mapping[abbrev] === '') return true;
      return false;
    });
    return {
      enabledCategoryAbbrevs: finalEnabledAbbrevs,
      statPathMapping: mapping
    };
  }, [currentSportConfig, activeRanking?.categories, selectedSport, activeRanking?.scoring, activeRanking?.pprSetting]);

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
    if (!activeRanking?.rankings || activeRanking.rankings.length === 0 || !currentSportMasterData || _.isEmpty(currentSportMasterData.players)) {
       return [];
    }
    const masterPlayersData = currentSportMasterData.players;
    return activeRanking.rankings.map((rankingEntry, index) => {
      const playerId = rankingEntry.playerId; 
      const playerData = masterPlayersData[playerId];
      if (!playerData) {
        return {
            ...rankingEntry,
            rank: rankingEntry.userRank || index + 1, 
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
        rank: rankingEntry.userRank || index + 1, 
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
  }, [activeRanking?.rankings, currentSportMasterData, selectedSport]);

  const draftedCount = useMemo(() => {
    if (!activeRanking?.rankings) return 0;
    return activeRanking.rankings.filter(p => !p.draftModeAvailable).length;
  }, [activeRanking?.rankings]);

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
            } catch (error) {
                console.error('Failed to fetch user rankings:', error);
                setPageError('Failed to load user rankings data.'); 
            }
        };
        fetchRankings();
    }
  }, [user, latestUserRankings]); 

  // Effect to set initial active ranking
  useEffect(() => {
    if (initialRankingsLoaded && userRankings && userRankings.length > 0 && !initialLoadEffectRan.current) {
        initialLoadEffectRan.current = true; 

        // Determine the ranking to load - Use the one from store (restored or set by fetchUserRankings)
        const rankingToLoad = activeRanking || userRankings[0]; 
        const idToLoad = rankingToLoad?._id;

        
        if (idToLoad) {
            // Set sport early if needed
            if (rankingToLoad.sport && rankingToLoad.sport !== selectedSport) {
                setSelectedSport(rankingToLoad.sport);
            }

            // ALWAYS call handleRankingSelect on initial load to ensure fresh, full data
            handleRankingSelect(idToLoad);
        } else {
             console.log('[InitialLoadEffect Ref ] No idToLoad determined.');
        }
    }
  }, [initialRankingsLoaded, userRankings, activeRanking, selectedSport, activeRankingId, handleRankingSelect, activeRankingLoading, setSelectedSport]);

  // Effect to sync local activeRankingId with store's activeRanking object
  useEffect(() => {
    if (activeRanking && activeRanking._id && activeRanking._id !== activeRankingId) {
      setActiveRankingId(activeRanking._id);
    }
  }, [activeRanking, activeRankingId]); 
  
  // Effect to derive selectedSport from activeRanking.sport
  useEffect(() => {
    if (activeRanking && activeRanking.sport && activeRanking.sport !== selectedSport) {
      setSelectedSport(activeRanking.sport);
    }
  }, [activeRanking, selectedSport]);

  // Effect to fetch master data (identities and stats) for the selected sport
  useEffect(() => {
    const sportKey = selectedSport?.toLowerCase();
    if (!sportKey || !SPORT_CONFIGS[sportKey]) return; // Exit if sport is invalid

    const state = useMasterDataset.getState(); // Get current store state directly

    // --- Fetch Player Identities --- 
    const identitiesLoading = state.loading[`identities_${sportKey}`];
    const identitiesExist = Array.isArray(state.dataset[sportKey]?.playerIdentities) && state.dataset[sportKey].playerIdentities.length > 0;
    if (!identitiesLoading && !identitiesExist) {
        fetchPlayerIdentities(sportKey);
    }

    // --- Fetch Seasonal Stats --- 
    const statsLoading = state.loading[sportKey];
    const statsExist = state.dataset[sportKey]?.players && Object.keys(state.dataset[sportKey].players).length > 0; 
    if (!statsLoading && !statsExist) {
        if (sportKey === 'nba') fetchNbaData();
        else if (sportKey === 'mlb') fetchMlbData();
        else if (sportKey === 'nfl') fetchNflData();
        else console.error(`[MasterDataFetchEffect Consolidated] Unknown sport: ${sportKey}`);
    }
  }, [selectedSport, fetchPlayerIdentities, fetchNbaData, fetchMlbData, fetchNflData]);

  useEffect(() => {
    const sportKey = selectedSport?.toLowerCase();

    const overallError = selectedSportError || activeRankingError?.message || null;
    setPageError(currentError => overallError !== currentError ? overallError : currentError);

    const activeRankingFullyLoaded = !!activeRanking && !!activeRanking.categories && !!activeRanking.rankings;
    const rankingsListExists = userRankings && userRankings.length > 0; 

    const newLoadingState = 
        !!overallError ||                 
        userRankingsLoading ||
        activeRankingLoading ||
        selectedSportLoading ||
        !initialRankingsLoaded || 
        (rankingsListExists && !activeRankingFullyLoaded); 
        
    setIsPageLoading(currentLoading => newLoadingState !== currentLoading ? newLoadingState : currentLoading);
  }, [
      selectedSportLoading, 
      selectedSportError,   
      userRankingsLoading, 
      activeRankingLoading,
      activeRankingError,
      userRankings, 
      initialRankingsLoaded, 
      activeRanking,      
      selectedSport       
    ]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-screen">
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    );
  }

  // Show sign-up card if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Playbook Rankings</h1>
              <p className="text-gray-600 mb-6">Create and manage your custom player rankings. Start from expert opinions and tailor them to your own values and strategy.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Getting Started:</h3>
                  <ol className="text-left text-gray-600 space-y-4">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0 font-bold">1</span>
                      <span>Sign up for a free account to access all features</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0 font-bold">2</span>
                      <span>Create your first ranking list for your preferred sport</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pb_blue text-white text-sm mr-3 flex-shrink-0 font-bold">3</span>
                      <span>Customize categories and weights to match your strategy</span>
                    </li>
                  </ol>
                </div>

                <div className="flex justify-center">
                  <Link href="/api/auth/login" className="inline-flex items-center gap-1.5 rounded-lg border border-pb_blue bg-pb_bluehover px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-pb_bluehover hover:bg-pb_bluehover focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300">
                    Sign Up Now
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center items-center">
                <img 
                  src="/images/modalimage.jpg" 
                  alt="Playbook Rankings Preview" 
                  className="rounded-lg shadow-lg border-4 border-white w-full max-h-72 object-contain bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // == RENDER LOGIC ==

  if (isPageLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8 pt-2">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="flex gap-6 relative pt-1">
          {/* Skeleton Left Column (Player List Area) */}
          <div className="flex-1 space-y-2 overflow-hidden" style={{ maxWidth: 'calc(100% - 288px)' }}>
            {/* Skeleton Table Header */}
            <Skeleton className="h-10 w-full rounded-sm mb-2 " />
            {/* Skeleton Table Rows - More detailed */}
            <div className="space-y-1">
              {[...Array(16)].map((_, i) => ( // Simulate multiple rows
                // Row container: flex, keep minimal styles
                <div key={i} className="flex w-full h-[40px] mb-1 bg-white py-1">
                  {/* Left Section (30%) - CHANGED */}
                  <div className="flex items-center w-[30%] px-2 space-x-3 flex-shrink-0"> 
                    {/* Player Rank Skeleton*/}
                    {/* <Skeleton className="pl-8 h-7 w-10 rounded-md flex-shrink-0" /> */}
                    {/* Player Image Skeleton*/}
                    <Skeleton className="h-7 w-7 rounded-md flex-shrink-0" />
                    {/* Player Name Skeleton*/}
                    <Skeleton className="h-4 rounded-sm w-48" />
                  </div>
                  {/* Right Section (70%) - CHANGED */}
                  <div className="flex w-[70%] h-full gap-2 flex-grow rounded-r-md"> 
                    {/* Stat Skeletons (Mimic multiple columns using flex-1) */}
                    {[...Array(9)].map((_, j) => (
                      <Skeleton key={j} className="h-full flex-1 rounded-sm" />
                    ))}
                  </div>
                </div> // End Row div
              ))}
            </div>
          </div> {/* End flex-1 */}

          {/* Skeleton Right Column (Side Panel) */}
          <div className="w-72 space-y-2"> {/* Width matches RankingsSidePanel */}
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
          {user && <CreateAllRankingsButton />}
          {user && activeRanking && (
            <div>
              <DraftModeButton
                isDraftMode={isDraftModeActive}
                onDraftModeChange={toggleDraftMode}
                showDrafted={showDraftedPlayers}
                onShowDraftedChange={toggleShowDraftedPlayers}
                onResetDraft={resetDraftAvailability}
                draftedCount={draftedCount}
                activeRanking={activeRanking}
              />
            </div>
          )}
          {user && (
            <AddRankingListButton dataset={currentSportMasterData} />
          )}
        </div>
      </div>

      {!latestUserRankings || latestUserRankings.length === 0 ? (
         // ... Get Started UI ...
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
            <div className="flex-grow overflow-hidden">
              {!activeRanking ? (
                <div className="flex justify-center items-center h-full">
                  <p>Select or create a ranking to get started.</p>
                </div>
              ) : isMasterDataLoading ? (
                 <div className="space-y-2 mt-4">
                    <p className="text-center text-gray-500">Loading core player data...</p>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                 </div>
              ) : !isMasterDataReady ? (
                 <div className="flex justify-center items-center h-full">
                   <p className="text-red-500">Error loading core player data for {selectedSport}. Check console.</p>
                 </div>
              ) : userRankingsLoading || activeRankingLoading || !activeRanking?.rankings ? (
                 <div className="space-y-2 mt-4">
                    <p className="text-center text-gray-500">Loading ranking details...</p> 
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                 </div>
              ) : activeRanking.rankings.length > 0 && 
                  (!currentSportMasterData || !currentSportMasterData.players || _.isEmpty(currentSportMasterData.players)) ? (
                <div className="space-y-2 mt-4">
                    <p className="text-center text-gray-500">Preparing player data for {selectedSport}...</p>
                    <Skeleton className="h-10 w-full opacity-50" />
                    <Skeleton className="h-8 w-full opacity-50" />
                    <Skeleton className="h-8 w-full opacity-50" />
                </div>
              ) : activeRanking.rankings && activeRanking.rankings.length === 0 && currentSportMasterData?.players && !_.isEmpty(currentSportMasterData.players) ? ( 
                <div className="flex justify-center items-center h-full p-4"> 
                  <p className="text-gray-600">No players found in this ranking list yet.</p>
                </div>
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
