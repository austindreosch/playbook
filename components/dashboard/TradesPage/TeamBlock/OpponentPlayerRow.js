'use client';

import HeartFilledIcon from '@/components/icons/HeartFilledIcon';
import { cn } from '@/lib/utils';
import { abbreviateName } from '@/utilities/stringUtils';
import { ArrowLeftRight, Ban, ChevronDown, Crosshair, GripVertical, HandHelping, Package } from 'lucide-react';
import { useState } from 'react';

export default function OpponentPlayerRow({ player }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(player.isFavorite || false);
  const [isTarget, setIsTarget] = useState(player.isTarget || false);
  const [isOnTradeBlock, setIsOnTradeBlock] = useState(player.isOnTradeBlock || false);
  const [isNotInterested, setIsNotInterested] = useState(player.isNotInterested || false);

  const handleToggle = (statusType) => {
    if (statusType === 'notInterested') {
      const newNotInterestedState = !isNotInterested;
      setIsNotInterested(newNotInterestedState);
      if (newNotInterestedState) {
        setIsFavorite(false);
        setIsTarget(false);
        setIsOnTradeBlock(false);
      }
    } else {
      setIsNotInterested(false); // Disable 'not interested' if any other toggle is activated
      if (statusType === 'favorite') setIsFavorite(!isFavorite);
      if (statusType === 'target') setIsTarget(!isTarget);
      if (statusType === 'tradeBlock') setIsOnTradeBlock(!isOnTradeBlock);
    }
  };

  const renderPriorityIcon = () => {
    if (isNotInterested) {
      return <Ban className="w-5 h-5 text-pb_darkgray" />;
    }
    if (isTarget) {
      return <Crosshair className="w-5 h-5" />;
    }
    if (isOnTradeBlock) {
      return <HandHelping className="w-5 h-5" />;
    }
    if (isFavorite) {
      return <HeartFilledIcon className="w-5 h-5 text-pb_darkgray" />;
    }
    return null;
  };

  return (
    <div className="bg-white border border-pb_lightergray rounded-md">
      <div 
        className="flex items-center justify-between p-1 h-11 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2 text-pb_darkgray min-w-0">
          <GripVertical className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold text-pb_darkgray truncate">{abbreviateName(player.name)}</span>
        </div>

        <div className="flex items-center space-x-1 text-pb_darkgray">
            <div className="w-5 h-5 flex items-center justify-center">
                {renderPriorityIcon()}
            </div>
          <div className="flex items-center space-x-2">
            <span className="w-10 text-right text-sm font-semibold text-pb_darkgray">{player.value}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 border-t border-pb_lightergray bg-pb_backgroundgray/60">
            <div className="grid grid-cols-4 items-start">
                {/* Favorite Button */}
                <div onClick={() => handleToggle('favorite')} className="flex flex-col items-center cursor-pointer group">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-full transition-colors", isFavorite ? 'bg-pb_darkgray' : 'bg-gray-200 group-hover:bg-gray-300')}>
                        <HeartFilledIcon className={cn("w-5 h-5", isFavorite ? 'text-white' : 'text-pb_textgray')} />
                    </div>
                    <span className={cn("mt-1 text-xs text-center h-8 flex items-center justify-center", isFavorite ? 'text-pb_darkgray' : 'text-pb_textgray')}>Favor</span>
                </div>

                {/* Target Button */}
                <div onClick={() => handleToggle('target')} className="flex flex-col items-center cursor-pointer group">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-full transition-colors", isTarget ? 'bg-pb_darkgray' : 'bg-gray-200 group-hover:bg-gray-300')}>
                        <Crosshair className={cn("w-5 h-5", isTarget ? 'text-white' : 'text-gray-500')} />
                    </div>
                    <span className={cn("mt-1 text-xs text-center h-8 flex items-center justify-center", isTarget ? 'text-pb_darkgray' : 'text-gray-500')}>Target</span>
                </div>

                {/* Trade Block Button */}
                <div onClick={() => handleToggle('tradeBlock')} className="flex flex-col items-center cursor-pointer group">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-full transition-colors", isOnTradeBlock ? 'bg-pb_darkgray' : 'bg-gray-200 group-hover:bg-gray-300')}>
                        <HandHelping className={cn("w-5 h-5", isOnTradeBlock ? 'text-white' : 'text-gray-500')} />
                    </div>
                    <span className={cn("mt-1 text-xs text-center h-8 flex items-center justify-center", isOnTradeBlock ? 'text-pb_darkgray' : 'text-gray-500')}>On Block</span>
                </div>

                 {/* Not Interested Button */}
                 <div onClick={() => handleToggle('notInterested')} className="flex flex-col items-center cursor-pointer group">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-full transition-colors", isNotInterested ? 'bg-pb_red' : 'bg-gray-200 group-hover:bg-gray-300')}>
                        <Ban className={cn("w-5 h-5", isNotInterested ? 'text-white' : 'text-gray-500')} />
                    </div>
                    <span className={cn("mt-1 text-xs text-center h-8 flex items-center justify-center", isNotInterested ? 'text-pb_red' : 'text-gray-500')}>Not Interested</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
} 