// 'use client';

// import * as Avatar from '@/components/alignui/avatar';
// import * as Badge from '@/components/alignui/badge';
// import * as Divider from '@/components/alignui/divider';
// import EmptyIcon from '@/components/icons/EmptyIcon';
// import { Bandage, Goal, ShieldHalf, TimerReset, Users, Watch } from 'lucide-react';

// export default function PlayerInfoSection({ playerData }) {
//   return (
//     <div className="flex gap-3 flex-shrink-0">
//       {/* Player Info */}
//       <div className="flex-1">
//         <div className="flex items-baseline gap-2">
//           <div className="flex items-center gap-1">
//             <span className="text-subheading-sm text-text-sub-600">{playerData.positionRank}</span>
//             <Badge.Root
//               variant="filled"
//               color="purple"
//               size="small"
//               square
//               className="text-subheading-xs font-medium"
//             >
//               {playerData.position}
//             </Badge.Root>
//           </div>
//                      <h4 className="text-label-sm font-medium text-primary-base leading-none">{playerData.name}</h4>
//         </div>
        
//         <Divider.Root variant="line" className="my-1.5" />
        
//         {/* Stats Grid - 2 rows x 3 columns */}
//         <div className="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-2">
//           {/* Top row */}
//           <div className="flex items-center gap-2">
//             <Watch className="icon-sm text-text-mid-500 flex-shrink-0" />
//             <div className="text-subheading-sm font-medium text-text-sub-600 min-w-0">
//               {playerData.mpg || <EmptyIcon className="icon-sm text-text-soft-400" />}
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <ShieldHalf className="icon-sm text-text-mid-500 flex-shrink-0" />
//             <div className="text-subheading-sm font-medium text-text-sub-600 min-w-0">
//               {playerData.team || <EmptyIcon className="icon-sm text-text-soft-400" />}
//             </div>
//           </div>
            
//           <div className="flex items-center gap-2">
//             <TimerReset className="icon-sm text-text-mid-500 flex-shrink-0" />
//             <div className="text-subheading-sm font-medium text-text-sub-600 min-w-0">
//               {playerData.age || <EmptyIcon className="icon-sm text-text-soft-400" />}
//             </div>
//           </div>
            
//           {/* Bottom row */}
//           <div className="flex items-center gap-2">
//             <Users className="icon-sm text-text-mid-500 flex-shrink-0" />
//             <div className="text-subheading-sm font-medium text-text-sub-600 min-w-0">
//               {playerData.rosterPercentage || <EmptyIcon className="icon-sm text-text-soft-400" />}
//             </div>
//           </div>
            
//           <div className="flex items-center gap-2">
//             <Goal className="icon-sm text-text-mid-500 flex-shrink-0" />
//             <div className="text-subheading-sm text-text-sub-600 min-w-0">
//               {playerData.playoffScheduleGrade || <EmptyIcon className="icon-sm text-text-soft-400" />}
//             </div>
//           </div>
            
//           <div className="flex items-center gap-2">
//             <Bandage className="icon-sm text-text-mid-500 flex-shrink-0" />
//             <div className="text-subheading-sm font-medium text-text-sub-600 min-w-0">
//               <Badge.Root
//                 variant="filled"
//                 color="green"
//                 size="small"
//                 className="min-w-5 h-3 text-subheading-xs font-medium"
//               >
//                 H
//               </Badge.Root>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Player Avatar */}
//       <div className="flex-shrink-0">
//         <Avatar.Root size="64">
//           <Avatar.Image src={playerData.image} alt={playerData.name} />
//         </Avatar.Root>
//       </div>
//     </div>
//   );
// }