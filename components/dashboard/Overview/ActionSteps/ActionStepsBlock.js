import { Activity, ActivitySquare, Shuffle, UserPlus, Wrench, X } from 'lucide-react';

export default function ActionStepsBlock() {

  const actionItems = [
    {
      type: 'add',
      icon: UserPlus,
      title: 'Potential Add',
      description: 'A. Caruso (1.8 STL) was just dropped by Opponent Team and is available on your waiver wire.',
      buttonText: 'Go to Waivers',
      buttonIcon: Shuffle
    },
    {
      type: 'fix',
      icon: Wrench,
      title: 'Fix Lineup',
      description: 'Scottie Barnes is slated to play but is sitting on your bench.',
      buttonText: 'Go to Roster',
      buttonIcon: Shuffle
    },
    {
      type: 'fix',
      icon: Wrench,
      title: 'Fix Lineup',
      description: 'Alperen Sengun is slated to play but is sitting on your bench.',
      buttonText: 'Go to Roster',
      buttonIcon: Shuffle
    },
    {
      type: 'add',
      icon: UserPlus,
      title: 'Potential Add',
      description: 'A. Caruso (1.8 STL) was just dropped by Opponent Team and is available on your waiver wire.',
      buttonText: 'Go to Waivers',
      buttonIcon: Shuffle
    }
  ];


  return (
    <div className={`w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col overflow-hidden`}>
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <ActivitySquare className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Action Steps</h3>
      </div>

      {/* Action Items */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-pb_lightgray hover:scrollbar-thumb-pb_midgray scrollbar-track-transparent">
        {actionItems.map((item, index) => {
          const Icon = item.icon;
          const ButtonIcon = item.buttonIcon;
          
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-3 flex-shrink-0">
              {/* Action header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" strokeWidth={2} />
                  <h4 className="text-sm font-medium text-gray-700 truncate">{item.title}</h4>
                </div>
                <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-xs mb-2 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Action button */}
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors w-full text-xs">
                <ButtonIcon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                <span className="truncate">{item.buttonText}</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
} 











// export  function ActionStepsBlock() {
 

//   return (
//     <div className="w-full bg-white rounded-lg border border-gray-300 shadow-sm p-4">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
//           <Activity className="w-4 h-4 text-white" strokeWidth={3} />
//         </div>
//         <h3 className="text-xl font-semibold text-gray-800">Action Steps</h3>
//       </div>

//       {/* Action Items */}
//       <div className="space-y-4">
//         {actionItems.map((item, index) => {
//           const Icon = item.icon;
//           const ButtonIcon = item.buttonIcon;
          
//           return (
//             <div key={index} className="bg-gray-50 rounded-lg p-4">
//               {/* Action header */}
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <Icon className="w-5 h-5 text-gray-600" strokeWidth={2} />
//                   <h4 className="text-base font-medium text-gray-700">{item.title}</h4>
//                 </div>
//                 <button className="text-gray-400 hover:text-gray-600">
//                   <X className="w-5 h-5" strokeWidth={2} />
//                 </button>
//               </div>

//               {/* Description */}
//               <p className="text-gray-600 text-sm mb-3 leading-relaxed">
//                 {item.description}
//               </p>

//               {/* Action button */}
//               <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
//                 <ButtonIcon className="w-5 h-5" strokeWidth={2} />
//                 <span>{item.buttonText}</span>
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }