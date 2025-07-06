'use client';

import { Ban, ChevronDown, Crosshair, GripVertical, HandHelping, Heart } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { abbreviateName } from '@/utilities/stringUtils';

export default function OpponentPlayerRow({ player, isExpandable = true }) {
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
  const containerClasses = "bg-pb_darkgray border border-pb_textgray";
  const textClasses = "text-white";
  const expandedBgClasses = "bg-pb_darkgray";
  const borderClasses = "border-pb_textgray";

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
            {status === 'favorite' && <Heart className={`w-icon-sm h-icon-sm ${textClasses}`} />}
            {status === 'target' && <Crosshair className={`w-icon-sm h-icon-sm ${textClasses}`} />}
            {status === 'tradeBlock' && <HandHelping className={`w-icon-sm h-icon-sm ${textClasses}`} />}
            {status === 'notInterested' && <Ban className={`w-icon-sm h-icon-sm ${textClasses}`} />}
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
                {/* Favorite Button */}
                <div 
                    onClick={() => handleStatusClick('favorite')}
                    className="flex flex-col items-center cursor-pointer group w-20"
                >
                    <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                        status === 'favorite' 
                          ? 'bg-pb_mddarkgray'
                          : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <Heart className={cn(
                            "w-5 h-5",
                            status === 'favorite' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'favorite' 
                          ? 'text-white'
                          : 'text-gray-300'
                    )}>
                        Favorite
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
                          ? 'bg-pb_mddarkgray'
                          : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <Crosshair className={cn(
                            "w-5 h-5",
                            status === 'target' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'target' 
                          ? 'text-white'
                          : 'text-gray-300'
                    )}>
                        Target
                    </span>
                </div>

                {/* Trade Block Button */}
                <div 
                    onClick={() => handleStatusClick('tradeBlock')}
                    className="flex flex-col items-center cursor-pointer group w-20"
                >
                    <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                        status === 'tradeBlock' 
                          ? 'bg-pb_mddarkgray'
                          : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <HandHelping className={cn(
                            "w-5 h-5",
                            status === 'tradeBlock' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'tradeBlock' 
                          ? 'text-white'
                          : 'text-gray-300'
                    )}>
                        On Block
                    </span>
                </div>

                {/* Not Interested Button */}
                <div 
                    onClick={() => handleStatusClick('notInterested')}
                    className="flex flex-col items-center cursor-pointer group w-20"
                >
                    <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                        status === 'notInterested' 
                          ? 'bg-pb_red'
                          : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <Ban className={cn(
                            "w-5 h-5",
                            status === 'notInterested' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'notInterested' 
                          ? 'text-pb_red'
                          : 'text-gray-300'
                    )}>
                        Not Interested
                    </span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
} 