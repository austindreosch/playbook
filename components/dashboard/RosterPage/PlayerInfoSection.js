'use client';

import EmptyIcon from '@/components/icons/EmptyIcon';
import { Separator } from '@/components/ui/separator';
import { Bandage, Goal, ShieldHalf, TimerReset, Users, Watch } from 'lucide-react';

export default function PlayerInfoSection({ playerData }) {
  return (
    <div className="flex gap-2 mdh:gap-3 flex-shrink-0">
      {/* Player Image */}
      <img 
        src={playerData.image} 
        alt={playerData.name}
        className="w-10 mdh:w-14 rounded-lg object-cover flex-shrink-0"
      />
      {/* Player Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs mdh:text-sm font-semibold text-pb_blue">{playerData.name}</h4>
          <div className="flex items-center gap-0.5 mdh:gap-1">
            <span className="text-3xs mdh:text-2xs text-pb_textgray">{playerData.positionRank}</span>
            <div 
              className="w-3 h-3 mdh:w-4 mdh:h-4 rounded text-3xs mdh:text-2xs text-pb_darkgray/80 flex items-center justify-center font-medium"
              style={{ backgroundColor: playerData.positionColor }}
            >
              {playerData.position}
            </div>
          </div>
        </div>
        
        <Separator className="my-0.5 mb-1" />
        
        {/* Stats Grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-3 grid-rows-2 gap-x-3 gap-y-1 mdh:gap-x-5 mdh:gap-y-2">
          {/* Top row */}
          <div className="grid grid-cols-3">
            <Watch className="col-span-1 icon-sm mdh:icon-xs flex justify-start my-auto text-pb_mddarkgray" />
            <div className="col-span-2 w-full text-3xs mdh:text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.mpg || <EmptyIcon className="icon-sm mdh:icon-xs text-pb_textlightestgray" />}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <ShieldHalf className="col-span-1 icon-sm mdh:icon-xs flex justify-start my-auto text-pb_mddarkgray" />
            <div className="col-span-2 w-full text-3xs mdh:text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.team || <EmptyIcon className="icon-sm mdh:icon-xs text-pb_textlightestgray" />}</div>
          </div>
            
          <div className="grid grid-cols-3">
            <TimerReset className="col-span-1 icon-sm mdh:icon-xs flex justify-start my-auto text-pb_mddarkgray" />
            <div className="col-span-2 w-full text-3xs mdh:text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.age || <EmptyIcon className="icon-sm mdh:icon-xs text-pb_textlightestgray" />}</div>
          </div>
            
          {/* Bottom row */}
          <div className="grid grid-cols-3">
            <Users className="col-span-1 icon-sm mdh:icon-xs flex justify-start my-auto text-pb_mddarkgray" />
            <div className="col-span-2 w-full text-3xs mdh:text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.rosterPercentage || <EmptyIcon className="icon-sm mdh:icon-xs text-pb_textlightestgray" />}</div>
          </div>
            
          <div className="grid grid-cols-3">
            <Goal className="col-span-1 icon-sm mdh:icon-xs flex justify-start my-auto text-pb_mddarkgray" />
            <div className="col-span-2 w-full text-3xs mdh:text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.playoffScheduleGrade || <EmptyIcon className="icon-sm mdh:icon-xs text-pb_textlightestgray" />}</div>
          </div>
            
          <div className="grid grid-cols-3">
            <Bandage className="col-span-1 icon-sm mdh:icon-xs flex justify-start my-auto text-pb_mddarkgray" />
            <div className="col-span-2 w-full text-3xs mdh:text-2xs font-medium text-pb_textlightergray flex items-center justify-center">
              <div className="w-5 h-3 mdh:w-6 mdh:h-4 bg-pb_green text-white text-3xs mdh:text-2xs font-medium rounded-sm2 flex items-center justify-center">
                H
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}