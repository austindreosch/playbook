'use client';

import { ChevronDown, GripVertical, Lock, Package, Target } from 'lucide-react';
import { useState } from 'react';


import { cn } from '@/lib/utils';
import { abbreviateName } from '@/utilities/stringUtils';

export default function TradePlayerRow({ player, isExpandable = true, isOpponent = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(player.status);

  const handleStatusClick = (clickedStatus) => {
    setStatus(status === clickedStatus ? null : clickedStatus);
  };

  const handleRowClick = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  };

  // Dark theme styling for opponent
  const containerClasses = isOpponent
    ? "bg-pb_darkgray border border-pb_textgray"
    : "bg-white border border-pb_lightergray";

  const textClasses = isOpponent
    ? "text-white"
    : "text-pb_darkgray";

  const expandedBgClasses = isOpponent
    ? "bg-pb_darkgray"
    : "bg-pb_backgroundgray/60";

  const borderClasses = isOpponent
    ? "border-pb_textgray"
    : "border-pb_lightergray";

  return (
    <div className={`${containerClasses} rounded-md`}>
      <div
        className={cn("flex items-center justify-between p-1 h-11", isExpandable && "cursor-pointer")}
        onClick={handleRowClick}
      >
        <div className={`flex items-center space-x-2 min-w-0 ${textClasses}`}>
          <GripVertical className={`w-5 h-5 flex-shrink-0 ${textClasses}`} />
          <span className={`text-sm font-semibold truncate ${textClasses}`}>{abbreviateName(player.name)}</span>
        </div>

        <div className={`flex items-center space-x-1 ${textClasses}`}>
          <div className="w-5 h-5">
            {status === 'protected' && <Lock className={`w-5 h-5 ${textClasses}`} />}
            {status === 'target' && <Package className={`w-5 h-5 ${textClasses}`} />}
            {status === 'bullseye' && <Target className={`w-5 h-5 ${textClasses}`} />}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-10 text-right text-sm font-semibold ${textClasses}`}>{player.value}</span>
            {isExpandable && <ChevronDown className={cn(`w-4 h-4 transition-transform ${textClasses}`, isExpanded ? 'rotate-180' : '')} />}
          </div>
        </div>
      </div>

      {isExpandable && isExpanded && (
        <div className={`p-3 border-t ${borderClasses} ${expandedBgClasses}`}>
            <div className="flex items-center justify-around">
                {/* Protected Button */}
                <div 
                    onClick={() => handleStatusClick('protected')}
                    className="flex flex-col items-center cursor-pointer group w-20"
                >
                    <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                        status === 'protected' 
                          ? (isOpponent ? 'bg-pb_mddarkgray' : 'bg-pb_darkgray')
                          : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <Lock className={cn(
                            "w-6 h-6",
                            status === 'protected' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'protected' 
                          ? (isOpponent ? 'text-white' : 'text-pb_darkgray')
                          : (isOpponent ? 'text-gray-300' : 'text-gray-500')
                    )}>
                        Protected
                    </span>
                </div>

                {/* Target Button */}
                <div 
                    onClick={() => handleStatusClick('target')}
                    className="flex flex-col items-center cursor-pointer group w-20"
                >
                    <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                        status === 'target' 
                          ? (isOpponent ? 'bg-pb_mddarkgray' : 'bg-pb_darkgray')
                          : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <Package className={cn(
                            "w-6 h-6",
                            status === 'target' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'target' 
                          ? (isOpponent ? 'text-white' : 'text-pb_darkgray')
                          : (isOpponent ? 'text-gray-300' : 'text-gray-500')
                    )}>
                        Target
                    </span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}