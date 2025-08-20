// 'use client';

// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import React, { memo, useEffect, useRef } from 'react';

// // Helper function to get nested values safely (Might still be needed by StatsSection)
// const getNestedValue = (obj, path, defaultValue = null) => {
//     if (!obj || typeof path !== 'string') return defaultValue;
//     if (path.indexOf('.') === -1) {
//         return obj.hasOwnProperty(path) ? obj[path] : defaultValue;
//     }
//     const keys = path.split('.');
//     let value = obj;
//     for (const key of keys) {
//         if (value && typeof value === 'object' && key in value) {
//             value = value[key];
//         } else {
//             return defaultValue;
//         }
//     }
//     return value;
// };

// // StatsSection component remains, but will receive null/empty data
// const StatsSection = memo(({ categories, stats }) => {
//     return (
//         <div className="flex w-[60%] h-full gap-[3px]">
//             {categories.map((statPathOrKey) => {
//                 const statData = getNestedValue(stats, statPathOrKey);
//                 let displayValue = '-'; // Default placeholder for null rows
//                 // No complex logic needed here for null rows, always show placeholder
//                 const title = `${statPathOrKey}: -`; // Basic title
//                 const bgColor = undefined; // No background color

//                 return (
//                     <div
//                         key={statPathOrKey}
//                         className="flex-1 text-center h-full flex items-center justify-center select-none"
//                         title={title}
//                         style={{ backgroundColor: bgColor }}
//                     >
//                         <span className="text-sm text-bg-surface-800">
//                             {displayValue}
//                         </span>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// });
// StatsSection.displayName = 'StatsSection';


// // --- RankingsPlayerRowNull Component ---
// // Simplified version for players with playerId: null
// const RankingsPlayerRowNull = memo(({ playerRanking, categories }) => {
//     // Props expected: playerRanking = { rank, playerId: null, originalName, rankingId (which is null) }, categories
//     // Use a stable ID for DND - combining rank and originalName for null players
//     const uniqueId = `${playerRanking.rank}-${playerRanking.originalName}`;
//     const rowRef = useRef(null);

//     // --- Add DND Kit Sortable Hook --- 
//     const {
//         attributes,
//         listeners,
//         setNodeRef,
//         transform,
//         transition,
//         isDragging
//     } = useSortable({
//         id: uniqueId, // Use the stable unique ID
//         animateLayoutChanges: () => false,
//     });

//     // --- Apply DND Kit Styles --- 
//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//         opacity: isDragging ? 0.5 : 1,
//         willChange: 'transform',
//         contain: 'content',
//     };

//     // Use intersection observer (optional, kept for consistency)
//     useEffect(() => {
//         if (!rowRef.current) return;
//         const observer = new IntersectionObserver(
//             (entries) => { },
//             { threshold: 0.1 }
//         );
//         observer.observe(rowRef.current);
//         return () => {
//             if (rowRef.current) {
//                 observer.unobserve(rowRef.current);
//             }
//         };
//     }, []);

//     const playerName = playerRanking.originalName || 'Unknown Player'; // Use originalName
//     // const playerPosition = 'N/A'; // No longer needed? Or keep as is?

//     return (
//         <div
//             ref={(node) => { // Combine refs
//                 setNodeRef(node);
//                 rowRef.current = node;
//             }}
//             style={style}
//             className={`player-row border rounded-md overflow-hidden mb-1 shadow-sm bg-gray-50 ${isDragging ? 'z-10' : ''}`} // Slightly different background maybe?
//         >
//             <div
//                 className="flex h-9 items-center" // Removed hover effect and onClick
//             >
//                 {/* Left section with fixed widths */}
//                 <div className="flex items-center w-[40%]">
//                     {/* --- Apply Drag Handle --- */}
//                     <div
//                         className="px-1 cursor-grab text-gray-400 active:cursor-grabbing"
//                         {...attributes}
//                         {...listeners}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
//                             <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
//                         </svg>
//                     </div>

//                     {/* Rank number */}
//                     <div className="w-10 h-7 text-center select-none rounded-sm border flex items-center justify-center font-bold">{playerRanking.rank}</div>

//                     {/* Default Player Image */}
//                     <div className="w-12 text-center select-none flex items-center justify-center">
//                         <img
//                             src="/avatar-default.png" // Always default avatar
//                             alt="Default Avatar"
//                             className="w-7 h-7 object-cover bg-stroke-soft-100 border border-stroke-soft-200 rounded-sm"
//                             width="28"
//                             height="28"
//                         />
//                     </div>

//                     {/* Player name and position */}
//                     <div className="flex items-center gap-2 select-none">
//                         <div className="font-bold">{playerName}</div>
//                         <div className="text-gray-500 text-xs italic">(No Data)</div> {/* Indicate missing data */}
//                     </div>
//                 </div>

//                 {/* Stats section - showing placeholders */}
//                 <StatsSection categories={categories} stats={null} /> {/* Pass null for stats */}
//             </div>

//             {/* No expanded content section */}
//         </div>
//     );
// });

// RankingsPlayerRowNull.displayName = 'RankingsPlayerRowNull';

// export default RankingsPlayerRowNull; 