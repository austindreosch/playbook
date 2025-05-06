'use client';

import RankingsPlayerRow from '@/components/RankingsPage/RankingsPlayerRow';
import { calculatePlayerZScoreSums, calculateZScoresWithComparisonPool } from '@/lib/calculations/zScoreUtil';
import { SPORT_CONFIGS } from '@/lib/config'; // Import sport configs
import { getNestedValue, getStatPath } from '@/lib/utils';
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings from '@/stores/useUserRankings';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeList as List } from 'react-window';

const PLAYERS_PER_PAGE = 500;
const DEFAULT_ROW_HEIGHT = 40;
const EXPANDED_ROW_HEIGHT = 220; // Height when row is expanded

const RankingsPlayerListContainer = React.forwardRef(({
    sport,
    sortConfig,
    enabledCategoryAbbrevs,
    collapseAllTrigger,
    activeRanking,
    playerIdentities,
    seasonalStatsData
}, ref) => {
    // Initialize state with players
    const [activeId, setActiveId] = useState(null);
    const [rankedPlayers, setRankedPlayers] = useState([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 600 });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const listRef = useRef(null);

    const {
        standardEcrRankings,
        redraftEcrRankings,
        isEcrLoading,
        updateAllPlayerRanks,
        saveChanges,
        isDraftModeActive,
        setPlayerAvailability,
        showDraftedPlayers,
        selectAndTouchRanking
    } = useUserRankings();

    // <<< Get relevant state from MasterDataset store >>>
    const { dataset, loading: masterLoading } = useMasterDataset();
    const masterNodes = dataset[sport?.toLowerCase()]?.players; // Get players for the current sport
    const isMasterLoading = masterLoading[sport?.toLowerCase()]; // Get loading status for the current sport

    // Set up window size measurement
    useEffect(() => {
        const handleResize = () => {
            // Get viewport height
            const viewportHeight = window.innerHeight;

            // Get the top navigation bar height
            const navbarHeight = document.querySelector('nav')?.offsetHeight || 80; // Estimate from your screenshot

            // Get the header section with "Customized Rankings" and buttons
            const pageHeaderHeight = document.querySelector('h1')?.closest('div')?.offsetHeight || 60;

            // Get the column headers row height
            const columnHeadersHeight = document.querySelector('.player-list-header')?.offsetHeight || 50;

            // Add some bottom margin for aesthetics
            const bottomMargin = 65;

            // Calculate total space taken by fixed elements
            const fixedElementsHeight = navbarHeight + pageHeaderHeight + columnHeadersHeight + bottomMargin;

            // Calculate the available height for the list
            const availableHeight = viewportHeight - fixedElementsHeight;

            setWindowSize({
                width: window.innerWidth,
                height: availableHeight
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Add useEffect to handle collapsing all rows
    useEffect(() => {
        if (collapseAllTrigger > 0) { // Only trigger on subsequent changes
            setExpandedRows(new Set());
            if (listRef.current) {
                listRef.current.resetAfterIndex(0);
            }
        }
    }, [collapseAllTrigger]); // Depend on the trigger prop

    // --- Log playerIdentities prop when it changes ---
    useEffect(() => {
        console.log('[RankingsPlayerListContainer] Received playerIdentities prop:', playerIdentities);
    }, [playerIdentities]);
    // --- End log ---

    // --- Create Player Identity Map (Depends on prop) ---
    const playerIdentityMap = useMemo(() => {
        const map = new Map();
        if (!Array.isArray(playerIdentities)) {
             console.warn('[playerIdentityMap Memo] Received playerIdentities prop is NOT an array:', playerIdentities);
             return map; 
        }
        playerIdentities.forEach((identity, index) => { 
            if (identity?.playbookId) {
                const key = String(identity.playbookId);
                map.set(key, identity);
            } 
        });
        // --- Log the created map ---
        console.log('[RankingsPlayerListContainer] Created playerIdentityMap:', map);
        // --- End log ---
        return map;
    }, [playerIdentities]);

    // --- Create Seasonal Stats Map (Depends on prop) ---
    const seasonalStatsMap = useMemo(() => {
        const map = new Map();
        if (seasonalStatsData && typeof seasonalStatsData === 'object' && Object.keys(seasonalStatsData).length > 0) {
             Object.entries(seasonalStatsData).forEach(([playerIdKey, playerData]) => { 
                 if (playerIdKey && playerData?.stats) { 
                     map.set(String(playerIdKey), playerData.stats); 
                 }
             });
        } else {
            // console.warn(`[seasonalStatsMap Memo] Received seasonalStatsData prop is not a valid object for sport: ${sport}`, seasonalStatsData); // Optional: Keep if needed
        }
        // console.log(`[seasonalStatsMap Memo] Built stats map with ${map.size} entries from prop.`); // Optional: Keep if needed
        return map;
    }, [seasonalStatsData]); // <<< Dependency is now the prop (and sport if needed)

    // --- ECR Rank Maps ---
    const standardEcrMap = useMemo(() => {
        const map = new Map();
        (standardEcrRankings || []).forEach(player => {
            if (player?.playbookId) {
                // Store the rank associated with the playbookId
                map.set(String(player.playbookId), player.rank);
            }
        });
        // --- Log created ECR map ---
        console.log('[RankingsPlayerListContainer] Created standardEcrMap:', map);
        // --- End log ---
        return map;
    }, [standardEcrRankings]);

    // --- Create redraftEcrMap --- (Moved slightly earlier if needed for dependency)
    const redraftEcrMap = useMemo(() => {
        const map = new Map();
        (redraftEcrRankings || []).forEach(player => {
            if (player?.playbookId) {
                map.set(String(player.playbookId), player.rank);
            }
        });
        // console.log('[RankingsPlayerListContainer] Created redraftEcrMap:', map);
        return map;
    }, [redraftEcrRankings]); // Depends only on rankings

    // --- STEP 1: Process and Combine Data, Sort ONLY by User Rank ---
    useEffect(() => {
        // Clear players immediately if activeRanking is null (e.g., during switch)
        if (!activeRanking || !activeRanking.rankings) {
            console.log("[RankedPlayers Effect] activeRanking is null or has no rankings, clearing rankedPlayers.");
            setRankedPlayers([]);
            return;
        }

        // --- Add checks for map readiness --- 
        // Ensure maps used in the mapping logic are populated before proceeding.
        // This helps prevent errors during the transition between rankings/sports.
        const mapsArePopulated = playerIdentityMap.size > 0 &&
                               // seasonalStatsMap.size > 0 && // Check if seasonalStatsMap is actually used/needed below
                               seasonalStatsData && Object.keys(seasonalStatsData).length > 0 && // Check prop directly
                               standardEcrMap.size > 0 &&
                               redraftEcrMap.size > 0;

        if (!mapsArePopulated) {
            console.log("[RankedPlayers Effect] Waiting for dependent maps to populate...", {
                 identityMapSize: playerIdentityMap.size,
                 hasSeasonalStats: !!seasonalStatsData && Object.keys(seasonalStatsData).length > 0,
                 standardEcrMapSize: standardEcrMap.size,
                 redraftEcrMapSize: redraftEcrMap.size
            });
            // Optionally clear rankedPlayers here too, or just wait
            // setRankedPlayers([]); 
            return; // Exit effect until maps are ready
        }
        // --- End map readiness checks --- 

        console.log("[RankedPlayers Effect] activeRanking and maps seem ready, processing players...");
        const rankingEntries = activeRanking.rankings || [];

        const combinedPlayers = rankingEntries.map((rankingEntry, index) => {
            const rankingPlaybookId = rankingEntry.playbookId ? String(rankingEntry.playbookId) : null;
            const basePlayerIdentity = rankingPlaybookId ? playerIdentityMap.get(rankingPlaybookId) : null;
            const msfIdForStatsLookup = basePlayerIdentity?.mySportsFeedsId;
            const fullPlayerDataFromStatsSource = msfIdForStatsLookup != null ? seasonalStatsData?.[String(msfIdForStatsLookup)] : null;
            const playerStatsObject = fullPlayerDataFromStatsSource?.stats || null; 
            const standardEcrRankLookup = rankingPlaybookId ? standardEcrMap.get(rankingPlaybookId) : undefined;
            const redraftEcrRankLookup = rankingPlaybookId ? redraftEcrMap.get(rankingPlaybookId) : undefined;
            const standardEcrRank = standardEcrRankLookup ?? null;
            const redraftEcrRank = redraftEcrRankLookup ?? null;

            const playerInfo = {
                ...basePlayerIdentity,
                playbookId: rankingPlaybookId,
                firstName: basePlayerIdentity?.primaryName?.split(' ')[0] || rankingEntry.firstName || 'Unknown',
                lastName: basePlayerIdentity?.primaryName?.split(' ').slice(1).join(' ') || rankingEntry.lastName || 'Player',
                primaryPosition: basePlayerIdentity?.position || rankingEntry.position || 'N/A',
                teamAbbreviation: basePlayerIdentity?.teamAbbreviation || rankingEntry.teamAbbreviation || 'FA',
                officialImageSrc: fullPlayerDataFromStatsSource?.info?.officialImageSrc || null,
                age: basePlayerIdentity?.age ?? null,
                standardEcrRank: standardEcrRank,
                redraftEcrRank: redraftEcrRank,
                isAvailable: rankingEntry.isAvailable ?? true,
                notes: rankingEntry.notes || '',
                mySportsFeedsId: msfIdForStatsLookup 
            };
            playerInfo.fullName = `${playerInfo.firstName} ${playerInfo.lastName}`.trim();
            const uniqueDndId = rankingPlaybookId;

            return {
                id: uniqueDndId,
                userRank: rankingEntry.userRank,
                info: playerInfo,
                stats: playerStatsObject || {},
                draftModeAvailable: rankingEntry.draftModeAvailable ?? true,
            };
        });

        const sortedByRankPlayers = combinedPlayers.sort((a, b) => a.userRank - b.userRank);
        setRankedPlayers(sortedByRankPlayers);
        console.log("[RankedPlayers Effect] Finished setting rankedPlayers.");

    }, [activeRanking, playerIdentityMap, seasonalStatsData, standardEcrMap, redraftEcrMap, playerIdentities]); // Dependencies remain the same

    // --- Memo hook to determine the comparison pool ---
    const comparisonPoolPlayers = useMemo(() => {
        console.log("[ComparisonPool Memo] Recalculating comparison pool...");

        // <<< Check BOTH loading states >>>
        const sportKey = sport?.toLowerCase();
        const nodes = masterNodes;
        const isLoading = isMasterLoading || isEcrLoading;
        const currentRankingFormat = activeRanking?.format?.toLowerCase(); // Declare only once here

        if (isLoading || !sportKey || !currentRankingFormat || !nodes || Object.keys(nodes).length === 0 || redraftEcrMap.size === 0) {
            console.log("[ComparisonPool Memo] Missing dependencies, data still loading, or ECR map empty.", {
                sport: sportKey,
                format: currentRankingFormat,
                isMasterLoading,
                isEcrLoading,
                hasMasterNodes: nodes && Object.keys(nodes).length > 0,
                ecrMapSize: redraftEcrMap?.size
            });
            return [];
        }

        // <<< Log sample masterNode structure >>>
        const sampleNodeKey = Object.keys(nodes)[0];
        const sampleNode = sampleNodeKey ? nodes[sampleNodeKey] : null;
        if (sampleNode) {
            console.log("[ComparisonPool Memo] Sample masterNode:");
            console.dir ? console.dir(sampleNode) : console.log(sampleNode);
        }

        const sportConfig = SPORT_CONFIGS[sportKey];
        // const rankingFormat = activeRanking.format.toLowerCase(); // <-- REMOVE Redundant declaration

        // <<< Determine the correct rule key for comparison pools >>>
        let ruleKey = currentRankingFormat; // Use the variable declared above
        if (sportKey === 'nba' && (currentRankingFormat === 'dynasty' || currentRankingFormat === 'redraft')) {
            ruleKey = 'categories';
            console.log(`[ComparisonPool Memo] Mapping NBA format '${currentRankingFormat}' to use rule key 'categories'.`);
        }
        const comparisonRules = sportConfig?.comparisonPools?.[ruleKey];

        if (!comparisonRules) {
            console.warn(`[ComparisonPool Memo] No comparison rules found for sport: ${sportKey}, format: ${currentRankingFormat} (resolved to rule key: ${ruleKey})`);
            return [];
        }
        console.log("[ComparisonPool Memo] Using comparison rules for key:", ruleKey, comparisonRules );

        // 1. Get relevant players from master dataset AND MERGE ECR
        const sortByField = comparisonRules.sortBy || comparisonRules.groups?.[Object.keys(comparisonRules.groups)[0]]?.sortBy;
        if (!sortByField) {
            console.warn("[ComparisonPool Memo] No sortBy key found in comparison rules.");
        }
        console.log(`[ComparisonPool Memo] Determined sortBy field: ${sortByField}`);

        // <<< Log the ECR Map Size >>>
        console.log(`[ComparisonPool Memo] redraftEcrMap size: ${redraftEcrMap?.size ?? 0}`);
        if (redraftEcrMap?.size > 0) {
             // Log the first few entries to see keys/values
             console.log("[ComparisonPool Memo] Sample redraftEcrMap entries:", Array.from(redraftEcrMap.entries()).slice(0, 5));
        }

        const allRelevantPlayers = Object.values(nodes).map((node, index) => {
            const playerPlaybookId = node?.info?.playbookId;
            const keyExists = playerPlaybookId ? redraftEcrMap.has(playerPlaybookId) : false;
            const rankFromMap = keyExists ? redraftEcrMap.get(playerPlaybookId) : null;

              // Construct the final info object for the pool player
            const finalInfo = {
                ...node?.info, // Spread original info (contains correct playbookId)
                redraftEcrRank: rankFromMap ?? null, // Add/overwrite with looked-up rank
                // Ensure essential fields like position/name exist even if node.info was minimal
                primaryPosition: node?.info?.primaryPosition ?? null,
                primaryName: node?.info?.primaryName ?? 'Unknown Player',
            };

            // Return the structure needed for filtering and sorting
            return {
                id: playerPlaybookId, // Use playbookId as the stable DND/key ID
                info: finalInfo,
                stats: node?.stats ?? {},
            };
        })
        .filter(p => {
            const hasPosition = !!p.info?.primaryPosition;
            // Get the actual rank value for logging
            const rankValue = sortByField ? getNestedValue(p.info, sortByField) : undefined;
            // Strict check if it's a number
            const hasSortValue = typeof rankValue === 'number'; 

            if (!hasPosition || !hasSortValue) {
                // Construct a more informative reason string
                let reason = [];
                if (!hasPosition) reason.push("Missing Position");
                if (!hasSortValue) reason.push(`Invalid Rank (Value: ${rankValue}, Type: ${typeof rankValue})`);
                

            }
            return hasPosition && hasSortValue;
        });

         // <<< Log count after mapping/filtering >>>
         console.log(`[ComparisonPool Memo] Mapped ${allRelevantPlayers.length} relevant players from masterNodes after filtering.`);
         if (allRelevantPlayers.length > 0) {
            console.log("[ComparisonPool Memo] Sample relevant player:");
            console.dir ? console.dir(allRelevantPlayers[0]) : console.log(allRelevantPlayers[0]);
         }
         if (allRelevantPlayers.length === 0) {
             console.warn("[ComparisonPool Memo] No relevant players found after filtering masterNodes. Check filter criteria and masterNodes content.");
             return []; // Stop if no players pass initial filter
         }

        // --- Sorting function ---
        // Sort helper (handles null/undefined ranks -> push to bottom)
        const sortPlayers = (a, b, sortField) => {
            // Only sort if sortField is defined
            if (!sortField) return 0;
            const rankA = getNestedValue(a.info, sortField) ?? Infinity;
            const rankB = getNestedValue(b.info, sortField) ?? Infinity;
            // Add secondary sort by ID for stability if ranks are equal
            if (rankA === rankB) {
                return (a.id ?? '').localeCompare(b.id ?? '');
            }
            return rankA - rankB;
        };

        let finalComparisonPool = [];

        // 2. Select pool based on rules type
        if (comparisonRules.type === 'overall') {
            finalComparisonPool = [...allRelevantPlayers]
                .sort((a, b) => sortPlayers(a, b, sortByField)) // Pass sort field
                .slice(0, comparisonRules.topN);
        } else if (comparisonRules.type === 'positional' || comparisonRules.type === 'split') {
            const groupedPlayers = {};
             allRelevantPlayers.forEach(player => {
                // Ensure positionGrouper exists and is a function
                 const groupKey = typeof comparisonRules.positionGrouper === 'function'
                                    ? comparisonRules.positionGrouper(player.info?.primaryPosition)
                                    : null;

                if (groupKey && comparisonRules.groups && comparisonRules.groups[groupKey]) { // Check rules.groups exists
                    if (!groupedPlayers[groupKey]) {
                        groupedPlayers[groupKey] = [];
                    }
                    groupedPlayers[groupKey].push(player);
                }
                 // else { console.log(`Player ${player.info.fullName} (Pos: ${player.info.primaryPosition}) mapped to group ${groupKey} - not in rules.groups`); }
            });
             console.log("[ComparisonPool Memo] Players grouped by position/split:", Object.keys(groupedPlayers).map(k => `${k}: ${groupedPlayers[k].length}`));


            Object.keys(groupedPlayers).forEach(groupKey => {
                 const groupRules = comparisonRules.groups[groupKey];
                 const groupSortBy = groupRules.sortBy || sortByField; // Use group specific sort if available
                 const sortedGroup = groupedPlayers[groupKey]
                     .sort((a, b) => sortPlayers(a, b, groupSortBy)) // Pass correct sort field
                     .slice(0, groupRules.topN);
                 finalComparisonPool = finalComparisonPool.concat(sortedGroup);
                 console.log(`[ComparisonPool Memo] Added ${sortedGroup.length} players from group ${groupKey} (Top ${groupRules.topN}, sorted by ${groupSortBy})`);
            });
        } else {
            console.warn(`[ComparisonPool Memo] Unknown comparison rule type: ${comparisonRules.type}`);
        }

         // <<< Log final pool size >>>
         console.log(`[ComparisonPool Memo] FINAL calculated pool size: ${finalComparisonPool.length}`);
         if (finalComparisonPool.length > 0) {
            console.log("[ComparisonPool Memo] Sample final pool player:");
            console.dir ? console.dir(finalComparisonPool[0]) : console.log(finalComparisonPool[0]);
         } else {
            console.warn("[ComparisonPool Memo] FINAL COMPARISON POOL IS EMPTY.");
         }
        return finalComparisonPool;

    }, [sport, activeRanking?.format, masterNodes, isMasterLoading, isEcrLoading, redraftEcrMap]);

    // === RESTRUCTURED useMemo for playersToDisplay ===
    const playersToDisplay = useMemo(() => {
        // console.log("[PlayersToDisplay Memo] Starting calculation...");
        // Start with the already processed rankedPlayers from state
        let processedPlayers = [...rankedPlayers]; 

        // Early exit if essential data is missing
        if (!activeRanking || !activeRanking.categories || !comparisonPoolPlayers || comparisonPoolPlayers.length === 0 || processedPlayers.length === 0) {
            // console.log("[PlayersToDisplay Memo] Early exit: Missing activeRanking, categories, comparisonPool, or rankedPlayers.");
            // Return rankedPlayers as is if we can't calculate Z-scores
            return processedPlayers;
        }

        // --- Prepare for Z-Score Calculation ---
        const sportKey = sport?.toLowerCase();
        const currentFormat = activeRanking.format?.toLowerCase();
        const scoringType = activeRanking.scoring?.toLowerCase(); // Added scoringType

        // Determine effective format for rules lookup
        const effectiveFormat = sportKey === 'nba' && (currentFormat === 'dynasty' || currentFormat === 'redraft') ? 'categories' : currentFormat;
        
        // Get comparison rules - REMOVE extra [scoringType] lookup
        const comparisonRules = SPORT_CONFIGS[sportKey]?.comparisonPools?.[effectiveFormat]; // Remove ?.[scoringType]
        
        // Prepare category details and path mapping (using Object.values)
        const enabledCategoriesDetailsObject = {};
        const statPathMapping = {};
        if (activeRanking.categories && typeof activeRanking.categories === 'object') { // Check it's an object
            // --- Change back to Object.entries and destructure [key, catDetails] ---
            Object.entries(activeRanking.categories).forEach(([key, catDetails]) => { 
                // --- Remove internal log ---
                // console.log("[PlayersToDisplay Memo] Inspecting category item:", catDetails);
                
                // --- Use key and catDetails in the condition ---
                if (key && catDetails && typeof catDetails === 'object' && catDetails.enabled) { 
                    // Use the destructured key and catDetails object
                    enabledCategoriesDetailsObject[key] = { ...catDetails, key: key }; // Also add the key to the details object itself
                    // Assuming getStatPath exists and works correctly - NOTE: We already fixed this error, should be fine
                    statPathMapping[key] = getStatPath(key, sportKey, effectiveFormat); 
                }
            });
        } else {
            console.warn("[PlayersToDisplay Memo] activeRanking.categories is not a valid object:", activeRanking.categories);
        }

        // +++ Log the created statPathMapping +++
        console.log("[PlayersToDisplay Memo] Created Stat Path Mapping:", statPathMapping);
        // +++ End Log +++

        // Check if we have rules and a comparison pool to proceed
        if (!comparisonRules || Object.keys(enabledCategoriesDetailsObject).length === 0) {
            console.warn("[PlayersToDisplay Memo] Cannot calculate Z-Scores: Missing comparison rules or no enabled categories.", { comparisonRules, enabledCategoriesDetailsObject });
            return processedPlayers; // Return unprocessed players
        }
        
        // console.log("[PlayersToDisplay Memo] Data prepared for Z-score calculation:", { comparisonRules, enabledCategoriesDetailsObject, statPathMapping });
        // console.log(`[PlayersToDisplay Memo] Scoring ${processedPlayers.length} players against ${comparisonPoolPlayers.length} comparison players.`);

        // --- Calculate Z-Scores using the comparison pool ---
        try {
            // Pass the processed players (which have combined info/stats/id)
            const playersWithZScores = calculateZScoresWithComparisonPool(
                processedPlayers,          // Players from active ranking (already processed)
                comparisonPoolPlayers,     // The calculated comparison pool
                enabledCategoriesDetailsObject,
                statPathMapping,
                comparisonRules
            );
            processedPlayers = playersWithZScores; // Update the list with Z-score data
            
            // Log sample result after calculation
            if (processedPlayers.length > 0) {
                console.log("[PlayersToDisplay Memo] Sample Player AFTER Z-Score Calc:", processedPlayers[0]); 
            }

        } catch (error) {
            console.error("[PlayersToDisplay Memo] Error calculating Z-Scores with comparison pool:", error);
            // Optionally add fallback state here if calculation fails
        }
        
        // --- Final Sorting & Filtering --- 
        let sortedPlayers = [...processedPlayers]; // Start with potentially Z-score enriched list

        // 1. Apply Display Sorting (Using state: { key: string, direction: 'asc'|'desc' })
        if (sortConfig.key) { // <<< CHANGE: Use sortConfig.key
            // console.log(`[PlayersToDisplay Memo] Applying sort: ${sortConfig.key} ${sortConfig.direction}`);
            sortedPlayers.sort((a, b) => {
                // Use getNestedValue, provide fallback for undefined/null
                // Determine path based on key
                let path = ''; // Initialize path
                const key = sortConfig.key;

                if (key === 'zScoreSum') {
                    path = 'zScoreTotals.overallZScoreSum';
                } else if (key === 'rank') { // <<< ADD: Handle rank sorting
                    path = 'userRank'; 
                } else if (key && key.startsWith('info.')) { // <<< ADD: Handle generic info fields
                    path = key; // Assumes key like 'info.fullName' is passed correctly
                } else if (key) { // <<< MODIFY: Assume other keys are stat abbreviations
                    path = `stats.${key}`; // Construct path like stats.PTS, stats.REB
                } else {
                     console.warn(`[Sort Logic] Invalid sort key: ${key}`);
                     return 0; // Don't sort if path is invalid
                }
                
                let valueA = getNestedValue(a, path) ?? (sortConfig.direction === 'asc' ? Infinity : -Infinity);
                let valueB = getNestedValue(b, path) ?? (sortConfig.direction === 'asc' ? Infinity : -Infinity);

                // Log values being compared for Z-Score column using the correct KEY
                if (key === 'zScoreSum') { // <<< CHANGE: Check for 'zScoreSum'
                    // console.log(`[Sort Detail] Comparing Z-Scores: A=${valueA}, B=${valueB}`); // Keep commented for now
                }

                // Type handling
                if (typeof valueA === 'string') valueA = valueA.toLowerCase();
                if (typeof valueB === 'string') valueB = valueB.toLowerCase();
                // Ensure NaN numbers are treated consistently
                if (typeof valueA === 'number' && isNaN(valueA)) valueA = (sortConfig.direction === 'asc' ? Infinity : -Infinity);
                if (typeof valueB === 'number' && isNaN(valueB)) valueB = (sortConfig.direction === 'asc' ? Infinity : -Infinity);

                // Comparison
                if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
                // Add secondary sort by ID for stability if values are equal
                return (a.id ?? '').localeCompare(b.id ?? ''); 
            });
        } else {
            // Default sort by userRank if no column sort is active
            sortedPlayers.sort((a, b) => (a.userRank || Infinity) - (b.userRank || Infinity));
        }

        // 2. Apply Draft Mode Filtering
        if (isDraftModeActive && !showDraftedPlayers) {
            sortedPlayers = sortedPlayers.filter(p => p.draftModeAvailable !== false); // Keep if true or undefined
        }

        // console.log(`[PlayersToDisplay Memo] Final playersToDisplay count: ${sortedPlayers.length}`);
        return sortedPlayers;

    // Dependencies: Include everything read inside the memo
    }, [rankedPlayers, activeRanking, sport, comparisonPoolPlayers, sortConfig, isDraftModeActive, showDraftedPlayers]); 

    // --- Render ---
    // ... (rest of the component) ...
    // Set up sensors for mouse, touch, and keyboard interactions
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 } // Keep activation constraint
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handler for when dragging starts
    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
        document.body.style.cursor = 'grabbing'; // Optional: set cursor
    }, []);

    // Handler for when dragging ends
    const handleDragEnd = useCallback((event) => {
        document.body.style.cursor = ''; // Reset cursor
        const { active, over } = event;
        setActiveId(null); // Reset activeId after drop

        // --- CRITICAL: Prevent re-ranking if sorted by a stat column ---
        if (sortConfig?.key !== null) {
            console.log("Drag End ignored: List is sorted by a column.");
            return;
        }

        if (over && active.id !== over.id) {
            // Perform reordering logic ONLY on the 'rankedPlayers' state
            setRankedPlayers((currentRankedPlayers) => {
                 // Find indices in the *current* rankedPlayers state
                const oldIndex = currentRankedPlayers.findIndex((p) => p.id === active.id);
                const newIndex = currentRankedPlayers.findIndex((p) => p.id === over.id);

                if (oldIndex === -1 || newIndex === -1) {
                    console.error("DND Error: Could not find dragged items in rankedPlayers.", { activeId: active.id, overId: over.id });
                    return currentRankedPlayers; // Return unchanged state on error
                }

                // Create the new array order using arrayMove
                const newPlayersArray = arrayMove(currentRankedPlayers, oldIndex, newIndex);

                // Update ranks based on the new order
                const playersWithNewRanks = newPlayersArray.map((player, index) => ({
                    ...player,
                    userRank: index + 1,
                }));

                // Prepare JUST the IDs in the new order for the Zustand store update
                const newOrderIds = playersWithNewRanks.map(p => p.id);

                // Trigger rank update in Zustand store
                if (activeRanking?._id && newOrderIds.length > 0) {
                    // <<< CHANGE: Defer the Zustand update to avoid state update during render >>>
                    setTimeout(() => {
                        updateAllPlayerRanks(activeRanking._id, newOrderIds);
                        // Optionally trigger saveChanges immediately or let it be debounced/handled elsewhere
                        // saveChanges(); // If you uncomment this, it should probably also be inside the timeout
                    }, 0);
                } else {
                    console.error("Missing activeRanking._id or no valid rank updates for DND.");
                }

                // Return the newly ordered and rank-updated array to update the state
                return playersWithNewRanks;
            });
        }
    }, [activeRanking?._id, updateAllPlayerRanks, sortConfig?.key]); // Add sortConfig.key dependency

    const handleDragCancel = useCallback(() => {
        document.body.style.cursor = ''; // Reset cursor
        setActiveId(null);
    }, []);

    // --- Toggle Row Expansion ---
    const toggleRowExpansion = useCallback((playerId) => { // playerId here is the stable 'id' used in DND/SortableContext
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playerId)) {
                newSet.delete(playerId);
            } else {
                newSet.add(playerId);
            }
            return newSet;
        });
        // Reset react-window cache after expansion change
        listRef.current?.resetAfterIndex(0);
    }, []); // No dependencies needed if using functional update

    // --- Row Height Calculation for react-window ---
     // Depends on paginatedPlayers and expandedRows state
    const getRowHeight = useCallback(index => {
        const player = playersToDisplay[index]; // Use the MEMOIZED list
        // Use the stable 'id' for checking expansion status
        return player && expandedRows.has(player.id) ? EXPANDED_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;
    }, [playersToDisplay, expandedRows]); // Add dependencies


    // --- Render Function (for react-window List) --- //
    // Restore the original Row definition
    const Row = useCallback(({ index, style }) => {
        const player = playersToDisplay[index]; // Use the MEMOIZED list

        if (!player) return null;

        // Determine if rank sorting is active (for drag handle visibility etc.)
        const isRankSorted = sortConfig?.key === null;

        // <<< Define the actual toggle handler function >>>
        const handleToggleDraftStatus = (newAvailability) => {
            const playerId = player.info?.mySportsFeedsId ?? player.id; // Prefer MSF ID, fallback to playbookId
            if (playerId) {
                setPlayerAvailability(playerId, newAvailability);
            } else {
                console.error("Cannot toggle draft status: Missing player ID", player.info);
            }
        };

        return (
            <div style={style}>
                <RankingsPlayerRow
                    // Key should ideally be the stable id used elsewhere
                    key={player.id}
                    player={player} // Pass the combined player object from paginatedPlayers
                    rank={player.userRank} // <<< CHANGE: Pass userRank as the rank prop
                    activeRanking={activeRanking} // Pass necessary context if needed by row
                    sport={sport}
                    // Pass sort config if needed by row for styling (e.g., highlighting sorted column)
                    sortConfig={sortConfig}
                    categories={enabledCategoryAbbrevs} // <<< RENAME this prop
                    // Pass ECR ranks
                    standardEcrRank={player.info.standardEcrRank}
                    redraftEcrRank={player.info.redraftEcrRank}
                    // Check expansion using the stable 'id'
                    isExpanded={expandedRows.has(player.id)}
                    // Pass the stable 'id' to the toggle handler
                    onToggleExpand={() => toggleRowExpansion(player.id)}
                     // Pass handler - Ensure setPlayerAvailability expects playbookId or rankingId based on its implementation
                    isDraftMode={isDraftModeActive} // <<< CHANGE prop name to match RankingsPlayerRow
                    onToggleDraftStatus={handleToggleDraftStatus} // <<< Pass the REAL handler
                     // Pass sorting status to the row if it needs to adjust UI (e.g., hide drag handle)
                    isRankSorted={isRankSorted}
                    // Pass other necessary derived props if needed
                />
            </div>
        );
    // Update dependencies for the useCallback
    }, [
        playersToDisplay, // Now depends on the memoized value
        activeRanking,
        sport,
        sortConfig,
        enabledCategoryAbbrevs, // Keep this in dependency array
        expandedRows,
        toggleRowExpansion,
        setPlayerAvailability, // <<< Add setPlayerAvailability dependency
        isDraftModeActive
    ]);

    // +++ Log playersToDisplay before passing to List +++
    console.log("[Container Render] playersToDisplay for List:", playersToDisplay);
    // Find duplicates for debugging
    const ids = playersToDisplay.map(p => p.id).filter(id => id); // Get non-null IDs
    const duplicateIds = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicateIds.length > 0) {
        console.warn("[Container Render] Duplicate IDs found in playersToDisplay:", duplicateIds);
    }
    // +++ End Log +++

    return (
        <div>
            {/* --- NEW: Pass sortConfig and handleSortChange to Header --- */}
            {/* Note: Assuming RankingsPlayerListHeader is rendered *above* this component */}
            {/* If it's rendered elsewhere, you'll need a different way to pass props (e.g., context) */}
            {/* For now, assuming parent component renders both and passes props */}

            {/* --- RE-ENABLE DndContext and wrappers --- */}
            
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
                disabled={sortConfig?.key !== null} // Disable DND if sorting by column
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={playersToDisplay.map(p => p.id)} // Use the stable player IDs
                    strategy={verticalListSortingStrategy}
                    disabled={sortConfig?.key !== null} // Disable sorting context too
                >
                    {(isMasterLoading || isEcrLoading) ? (
                        <div className="text-center p-8 text-gray-500">Loading player data...</div>
                    ) : playersToDisplay.length > 0 ? (
                         <List
                            ref={listRef}
                            height={windowSize.height}
                            itemCount={playersToDisplay.length}
                            itemSize={getRowHeight}
                            width="100%"
                            estimatedItemSize={DEFAULT_ROW_HEIGHT}
                            className="hide-scrollbar"
                            // Modify itemKey for robustness and logging
                            itemKey={index => {
                                const player = playersToDisplay[index];
                                const key = player?.id ?? `missing-id-${index}`; // Fallback key
                                if (!player?.id) {
                                    // Log only once per unique missing ID index to reduce noise
                                    if (!window[`missing_id_logged_${index}`]) {
                                        console.warn(`[List itemKey] Player at index ${index} missing ID:`, player);
                                        window[`missing_id_logged_${index}`] = true; // Mark as logged
                                    }
                                }
                                return key;
                            }}
                        >
                            {Row} 
                        </List>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            {isEcrLoading ? "Loading rankings..." : "No players found or ranking list is empty."}
                        </div>
                    )}
                </SortableContext>

                {typeof document !== 'undefined' && ReactDOM.createPortal(
                     <DragOverlay dropAnimation={null} adjustScale={false}>
                         {activeId ? (() => {
                             const activePlayer = playersToDisplay.find(p => p.id === activeId);
                             if (!activePlayer) return null;
                             // Ensure the row used in overlay gets necessary props
                             return (
                                 <RankingsPlayerRow
                                     player={activePlayer}
                                     rank={activePlayer.userRank} // Pass rank
                                     isDraggingOverlay={true}
                                     activeRanking={activeRanking}
                                     sport={sport}
                                     categories={enabledCategoryAbbrevs} // Pass categories
                                     standardEcrRank={activePlayer.info.standardEcrRank}
                                     redraftEcrRank={activePlayer.info.redraftEcrRank}
                                     isExpanded={false} // Overlay is never expanded
                                     // No need for toggle/availability handlers in overlay
                                     isDraftMode={isDraftModeActive}
                                     isRankSorted={true} // Drag handle is always visible in overlay
                                 />
                             );
                         })() : null}
                     </DragOverlay>,
                     document.body
                 )}
            </DndContext>
            

            <style jsx global>{`
                .hide-scrollbar {
                    scrollbar-width: none;  /* Firefox */
                    -ms-overflow-style: none;  /* IE and Edge */
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;  /* Chrome, Safari, Opera */
                }
            `}</style>
        </div>
    );
});

RankingsPlayerListContainer.displayName = 'RankingsPlayerListContainer'; // Add display name for dev tools

export default RankingsPlayerListContainer;

