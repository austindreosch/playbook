'use client';

import RankingsPlayerRow from '@/components/RankingsPage/RankingsPlayerRow';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useProcessedPlayers } from '@/hooks/useProcessedPlayers';
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings from '@/stores/useUserRankings';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeList as List } from 'react-window';
import RankingsPlayerListSkeleton from './RankingsPlayerListSkeleton';

const DEFAULT_ROW_HEIGHT = 40;
const EXPANDED_ROW_HEIGHT = 220;
const MOBILE_ROW_HEIGHT = 50;
const MOBILE_EXPANDED_ROW_HEIGHT = 160
;

const RankingsPlayerListContainer = React.forwardRef(({
    sport,
    sortConfig,
    enabledCategoryAbbrevs,
    collapseAllTrigger,
    activeRanking,
    playerIdentities,
    seasonalStatsData
}, ref) => {
    const [activeId, setActiveId] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 600 });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const listRef = useRef(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const {
        standardEcrRankings,
        redraftEcrRankings,
        isEcrLoading,
        updateAllPlayerRanks,
        isDraftModeActive,
        setPlayerAvailability,
        showDraftedPlayers,
    } = useUserRankings();

    const { dataset, loading: masterLoading } = useMasterDataset();
    const masterNodes = dataset[sport?.toLowerCase()]?.players;
    const isMasterLoadingSportSpecific = masterLoading[sport?.toLowerCase()];

    useEffect(() => {
        const handleResize = () => {
            const viewportHeight = window.innerHeight;
            const navbarHeight = document.querySelector('nav')?.offsetHeight || 70;
            const pageHeaderHeight = document.querySelector('h1')?.closest('div')?.offsetHeight || 60;
            const columnHeadersHeight = document.querySelector('.player-list-header')?.offsetHeight || 50;
            const bottomMargin = 65;
            const fixedElementsHeight = navbarHeight + pageHeaderHeight + columnHeadersHeight + bottomMargin;
            const availableHeight = viewportHeight - fixedElementsHeight;
            setWindowSize({ width: window.innerWidth, height: availableHeight });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (collapseAllTrigger > 0) {
            setExpandedRows(new Set());
            listRef.current?.resetAfterIndex(0);
        }
    }, [collapseAllTrigger]);

    useEffect(() => {
        listRef.current?.resetAfterIndex(0);
    }, [isMobile]);

    const playersToDisplay = useProcessedPlayers({
        activeRanking,
        playerIdentities,
        seasonalStatsData,
        standardEcrRankings,
        redraftEcrRankings,
        sport,
        sortConfig,
        isDraftModeActive,
        showDraftedPlayers,
        masterNodes,
        isMasterLoading: isMasterLoadingSportSpecific,
        isEcrLoading
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
        document.body.style.cursor = 'grabbing';
    }, []);

    const handleDragEnd = useCallback((event) => {
        document.body.style.cursor = '';
        const { active, over } = event;
        setActiveId(null);

        if (sortConfig?.key !== null) {
            return;
        }

        if (over && active.id !== over.id) {
            const oldIndex = playersToDisplay.findIndex((p) => p.id === active.id);
            const newIndex = playersToDisplay.findIndex((p) => p.id === over.id);

            if (oldIndex === -1 || newIndex === -1) {
                console.error("DND Error: Could not find dragged items in playersToDisplay.", { activeId: active.id, overId: over.id, playersToDisplayCount: playersToDisplay.length });
                return;
            }

            const newOrderedPlayerIds = arrayMove(playersToDisplay.map(p => p.id), oldIndex, newIndex);

            // Collapse all rows immediately after a successful re-order operation
            setExpandedRows(new Set());
            if (listRef.current) {
                listRef.current.resetAfterIndex(0);
            }

            if (activeRanking?._id && newOrderedPlayerIds.length > 0) {
                setTimeout(() => {
                    updateAllPlayerRanks(activeRanking._id, newOrderedPlayerIds);
                }, 0);
            } else {
                console.error("Missing activeRanking._id or no valid player IDs for DND update.");
            }
        }
    }, [activeRanking?._id, updateAllPlayerRanks, playersToDisplay]);

    const handleDragCancel = useCallback(() => {
        document.body.style.cursor = '';
        setActiveId(null);
    }, []);

    const toggleRowExpansion = useCallback((playerId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playerId)) newSet.delete(playerId);
            else newSet.add(playerId);
            return newSet;
        });
        listRef.current?.resetAfterIndex(0);
    }, []);

    const getRowHeight = useCallback(index => {
        const player = playersToDisplay[index];
        if (!player) return isMobile ? MOBILE_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;

        const isExpanded = expandedRows.has(player.id);

        if (isMobile) {
            return isExpanded ? MOBILE_EXPANDED_ROW_HEIGHT : MOBILE_ROW_HEIGHT;
        }
        // Desktop
        return isExpanded ? EXPANDED_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;
    }, [playersToDisplay, expandedRows, isMobile]);

    const Row = useCallback(({ index, style }) => {
        const player = playersToDisplay[index];
        if (!player) return null;

        const isRankSorted = sortConfig?.key === null;

        const handleToggleDraftStatus = (newAvailability) => {
            if (player.id && activeRanking?._id) {
                setPlayerAvailability(player.id, newAvailability);
            } else {
                console.error("Cannot toggle draft status: Missing player.id or activeRanking?._id", { 
                    playerId: player.id, 
                    activeRankingId: activeRanking?._id 
                });
            }
        };

        return (
            <div style={style} className="w-full">
                <RankingsPlayerRow
                    key={player.id}
                    player={player}
                    rank={player.userRank}
                    activeRanking={activeRanking}
                    sport={sport}
                    categories={enabledCategoryAbbrevs}
                    standardEcrRank={player.info.standardEcrRank}
                    redraftEcrRank={player.info.redraftEcrRank}
                    isExpanded={expandedRows.has(player.id)}
                    onToggleExpand={() => toggleRowExpansion(player.id)}
                    isDraftMode={isDraftModeActive}
                    onToggleDraftStatus={handleToggleDraftStatus}
                    isRankSorted={isRankSorted}
                    rowIndex={index}
                />
            </div>
        );
    }, [
        playersToDisplay,
        activeRanking,
        sport,
        sortConfig,
        enabledCategoryAbbrevs,
        expandedRows,
        toggleRowExpansion, 
        setPlayerAvailability,
        isDraftModeActive
    ]);

    const isLoadingList = !activeRanking || isMasterLoadingSportSpecific || isEcrLoading;

    return (
        <div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
                disabled={sortConfig?.key !== null || isLoadingList || isDraftModeActive}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={playersToDisplay.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={sortConfig?.key !== null || isLoadingList || isDraftModeActive}
                >
                    {isLoadingList ? (
                        <RankingsPlayerListSkeleton />
                    ) : playersToDisplay.length > 0 ? (
                         <List
                            ref={listRef}
                            height={windowSize.height}
                            itemCount={playersToDisplay.length}
                            itemSize={getRowHeight}
                            width="100%"
                            estimatedItemSize={DEFAULT_ROW_HEIGHT}
                            className="hide-scrollbar"
                            itemKey={index => {
                                const player = playersToDisplay[index];
                                const key = player?.id ?? `missing-id-${index}`;
                                return key;
                            }}
                        >
                            {Row}
                        </List>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            {isEcrLoading ? "Loading rankings..." : activeRanking?.rankings?.length === 0 ? "This ranking list is empty." : "No players found for the current criteria."}
                        </div>
                    )}
                </SortableContext>

                {typeof document !== 'undefined' && ReactDOM.createPortal(
                     <DragOverlay dropAnimation={null} adjustScale={false}>
                         {activeId ? (() => {
                             const activePlayer = playersToDisplay.find(p => p.id === activeId);
                             if (!activePlayer) return null;
                             return (
                                 <RankingsPlayerRow
                                     player={activePlayer}
                                     rank={activePlayer.userRank}
                                     isDraggingOverlay={true}
                                     activeRanking={activeRanking}
                                     sport={sport}
                                     categories={enabledCategoryAbbrevs}
                                     standardEcrRank={activePlayer.info.standardEcrRank}
                                     redraftEcrRank={activePlayer.info.redraftEcrRank}
                                     isExpanded={false}
                                     isDraftMode={isDraftModeActive}
                                     isRankSorted={true}
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

RankingsPlayerListContainer.displayName = 'RankingsPlayerListContainer';

export default RankingsPlayerListContainer;

