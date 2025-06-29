'use client';

import { ChevronDown, GripVertical, Lock, Package, Target } from 'lucide-react';
import { useState } from 'react';

import LockFilledIcon from '@/components/icons/LockFilledIcon';
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

  return (
    <div className="bg-white border border-pb_lightergray rounded-md">
      <div
        className={cn("flex items-center justify-between p-1 h-11", isExpandable && "cursor-pointer")}
        onClick={handleRowClick}
      >
        <div className="flex items-center space-x-2 text-pb_darkgray min-w-0">
          <GripVertical className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold text-pb_darkgray truncate">{abbreviateName(player.name)}</span>
        </div>

        <div className="flex items-center space-x-1 text-pb_darkgray">
          <div className="w-5 h-5">
            {status === 'protected' && <LockFilledIcon className="w-5 h-5 text-pb_darkgray" />}
            {status === 'target' && <Package className="w-5 h-5" />}
            {status === 'bullseye' && <Target className="w-5 h-5" />}
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-10 text-right text-sm font-semibold text-pb_darkgray">{player.value}</span>
            {isExpandable && <ChevronDown className={cn('w-4 h-4 transition-transform', isExpanded ? 'rotate-180' : '')} />}
          </div>
        </div>
      </div>

      {isExpandable && isExpanded && (
        <div className="p-3 border-t border-pb_lightergray bg-pb_backgroundgray/60">
            <div className="flex items-center justify-around">
                {/* Protected Button */}
                <div 
                    onClick={() => handleStatusClick('protected')}
                    className="flex flex-col items-center cursor-pointer group w-20"
                >
                    <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                        status === 'protected' ? 'bg-pb_darkgray' : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <LockFilledIcon className={cn(
                            "w-6 h-6",
                            status === 'protected' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'protected' ? 'text-pb_darkgray' : 'text-gray-500'
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
                        status === 'target' ? 'bg-pb_darkgray' : 'bg-gray-200 group-hover:bg-gray-300'
                    )}>
                        <Package className={cn(
                            "w-6 h-6",
                            status === 'target' ? 'text-white' : 'text-gray-500'
                        )} />
                    </div>
                    <span className={cn(
                        "mt-1 text-xs font-semibold",
                        status === 'target' ? 'text-pb_darkgray' : 'text-gray-500'
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