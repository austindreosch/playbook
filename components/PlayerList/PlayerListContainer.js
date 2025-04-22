// 'use client';

// import PlayerRow from '@/components/PlayerList/RankingsPlayerRow';
// import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { useCallback, useEffect, useMemo, useState } from 'react';

// const PLAYERS_PER_PAGE = 50;

// const PlayerListContainer = ({ sport, activeRanking, dataset }) => {


//     // Initialize state with players
//     const [players, setPlayers] = useState([]);
//     const [activeId, setActiveId] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [chosenCategories, setChosenCategories] = useState([]);
//     const [statMappings, setStatMappings] = useState({});
//     const [rankedPlayers, setRankedPlayers] = useState([]);

//     // Create mapping of abbreviations to stat keys when data is loaded
//     useEffect(() => {
//         if (dataset?.[sport.toLowerCase()]?.players?.length) {
//             // Get the first player's stats to analyze the structure
//             const firstPlayer = dataset[sport.toLowerCase()].players[0];
//             const mappings = {};

//             // Look through all stats of the first player to find matching abbreviations
//             Object.entries(firstPlayer.stats).forEach(([key, stat]) => {
//                 if (stat?.abbreviation) {
//                     mappings[stat.abbreviation] = key;
//                 }
//             });

//             setStatMappings(mappings);
//             setPlayers(dataset[sport.toLowerCase()].players);

//         }
//     }, [dataset, sport]);

//     // Create a function that:
//     // Takes an 'activeRanking' object as input
//     // Extracts the list of players along with their rankings
//     // Matches each player with their corresponding data in the player dataset
//     // Returns a combined object that includes both ranking information and player statistics
//     // The returned data will be used to populate a player row component in my UI.

//     const processRankingData = useCallback((activeRanking) => {
//         if (!activeRanking || !dataset?.[sport.toLowerCase()]?.players) {
//             return [];
//         }

//         // Get the player rankings from activeRanking
//         const rankingPlayers = activeRanking.rankings || [];

//         // Create a map of player IDs to their dataset info for efficient lookup
//         const playerDataMap = new Map();

//         // Try to map using both info.playerId and id fields
//         dataset[sport.toLowerCase()].players.forEach(player => {
//             if (player.info?.playerId) {
//                 playerDataMap.set(player.info.playerId, player);
//             }
//             if (player.id) {
//                 playerDataMap.set(player.id, player);
//             }
//         });

//         // Combine ranking data with player data
//         return rankingPlayers.map((rankingPlayer) => {
//             // Try to find player by ID using playerId from the ranking
//             let playerData = playerDataMap.get(rankingPlayer.playerId);

//             const combinedPlayer = {
//                 rankingId: rankingPlayer.playerId,
//                 rank: rankingPlayer.rank,
//                 name: rankingPlayer.name,
//                 position: rankingPlayer.position,
//                 info: playerData?.info || {},
//                 stats: playerData?.stats || {}
//             };


//             return combinedPlayer;
//         });
//     }, [dataset, sport]);

//     // Add this effect to process ranking data when activeRanking changes
//     useEffect(() => {
//         const processedPlayers = processRankingData(activeRanking);
//         setRankedPlayers(processedPlayers);
//     }, [activeRanking, processRankingData]);

//     // Update categories when activeRanking changes
//     useEffect(() => {
//         if (!activeRanking?.categories) {

//             return;
//         }

//         // Get enabled categories and map them to their corresponding stat keys
//         const enabledCategories = Object.entries(activeRanking.categories)
//             .filter(([_, value]) => value.enabled)
//             .map(([abbrev]) => statMappings[abbrev] || abbrev);

//         setChosenCategories(enabledCategories);
//     }, [activeRanking?.categories, statMappings]);

//     // Update stats and weights when activeRanking changes
//     useEffect(() => {
//         if (!activeRanking?.categories) return;

//         // Filter enabled categories and get their weights
//         const enabledCategories = Object.entries(activeRanking.categories)
//             .filter(([_, value]) => value.enabled)
//             .reduce((acc, [key, value]) => {
//                 acc[key] = value.multiplier || 1;
//                 return acc;
//             }, {});

//         setChosenCategories(Object.keys(enabledCategories));
//     }, [activeRanking?.categories]);

//     // Fetch data when component mounts or sport changes
//     useEffect(() => {
//         if (dataset?.[sport.toLowerCase()]?.players?.length) {
//             setPlayers(dataset[sport.toLowerCase()].players);
//         }
//     }, [dataset, sport]);

//     // Get paginated players - update to use rankedPlayers instead of players
//     const paginatedPlayers = useMemo(() => {
//         const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
//         return rankedPlayers.slice(startIndex, startIndex + PLAYERS_PER_PAGE);
//     }, [rankedPlayers, currentPage]);

//     // Set up sensors for mouse, touch, and keyboard interactions
//     const sensors = useSensors(
//         useSensor(PointerSensor),
//         useSensor(KeyboardSensor, {
//             coordinateGetter: sortableKeyboardCoordinates,
//         })
//     );

//     // Handler for when dragging starts
//     const handleDragStart = useCallback((event) => {
//         setActiveId(event.active.id);
//     }, []);

//     // Handler for when dragging ends
//     const handleDragEnd = useCallback((event) => {
//         const { active, over } = event;

//         if (active.id !== over.id) {
//             setRankedPlayers((items) => {
//                 const oldIndex = items.findIndex(item => item.rankingId === active.id);
//                 const newIndex = items.findIndex(item => item.rankingId === over.id);

//                 return arrayMove(items, oldIndex, newIndex);
//             });
//         }

//         setActiveId(null);
//     }, []);

//     const sportKey = sport.toLowerCase();


//     if (!dataset) {
//         return <div>Loading dataset...</div>;
//     }

//     if (!dataset[sportKey]) {
//         return <div>No data available for {sport}...</div>;
//     }

//     if (!dataset[sportKey].players?.length) {
//         return <div>No players found for {sport}...</div>;
//     }

//     return (
//         <div>
//             <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragStart={handleDragStart}
//                 onDragEnd={handleDragEnd}
//             >
//                 <SortableContext
//                     items={paginatedPlayers.map(player => player.rankingId)}
//                     strategy={verticalListSortingStrategy}
//                 >
//                     {paginatedPlayers.map((player) => (
//                         <PlayerRow
//                             key={player.rankingId}
//                             player={player}
//                             sport={sport}
//                             categories={chosenCategories}
//                             rank={player.rank}
//                         />
//                     ))}
//                 </SortableContext>

//                 <DragOverlay>
//                     {activeId ? (
//                         <PlayerRow
//                             player={paginatedPlayers.find(p => p.rankingId === activeId)}
//                             sport={sport}
//                             categories={chosenCategories}
//                             rank={paginatedPlayers.find(p => p.rankingId === activeId)?.rank}
//                         />
//                     ) : null}
//                 </DragOverlay>
//             </DndContext>
//         </div>
//     );
// };

// export default PlayerListContainer;