'use client';

import { ChevronDown, GripVertical, Lock, Package, Target } from 'lucide-react';
import { useState } from 'react';


import { cn } from '@/lib/utils';
import { abbreviateName } from '@/utilities/stringUtils';

export default function TradePlayerRow({ player, isExpandable = true }) {
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

  // Light theme styling for your team
  const containerClasses = "bg-white border border-pb_lightergray";
  const textClasses = "text-pb_darkgray";
  const expandedBgClasses = "bg-pb_backgroundgray/60";
  const borderClasses = "border-pb_lightergray";

  return (
    <div className={`${containerClasses} rounded-md`}>
      <div
        className={cn("flex items-center justify-between p-1 pr-2 h-9", isExpandable && "cursor-pointer")}
        onClick={handleRowClick}
      >
        <div className={`flex items-center space-x-2 min-w-0 ${textClasses}`}>
          <GripVertical className={`w-icon h-icon flex-shrink-0 ${textClasses}`} />
          <span className={`text-button font-semibold truncate ${textClasses}`}>{abbreviateName(player.name)}</span>
        </div>

        <div className={`flex items-center space-x-1 ${textClasses}`}>
          <div className="w-icon-sm h-icon-sm">
            {status === 'protected' && <Lock className={`w-icon-sm h-icon-sm ${textClasses}`} />}
            {status === 'target' && <Package className={`w-icon-sm h-icon-sm ${textClasses}`} />}
            {status === 'bullseye' && <Target className={`w-icon-sm h-icon-sm ${textClasses}`} />}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-11 text-right text-button font-semibold ${textClasses}`}>{player.value}</span>
            {isExpandable && <ChevronDown className={cn(`w-icon-sm h-icon-sm mr-1 transition-transform ${textClasses}`, isExpanded ? 'rotate-180' : '')} />}
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
                        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                        status === 'protected' 
                          ? 'bg-pb_darkgray'
                          : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <Lock className={cn(
                            "w-5 h-5",
                            status === 'protected' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'protected' 
                          ? 'text-pb_darkgray'
                          : 'text-gray-500'
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
                        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                        status === 'target' 
                          ? 'bg-pb_darkgray'
                          : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <Package className={cn(
                            "w-5 h-5",
                            status === 'target' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'target' 
                          ? 'text-pb_darkgray'
                          : 'text-gray-500'
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