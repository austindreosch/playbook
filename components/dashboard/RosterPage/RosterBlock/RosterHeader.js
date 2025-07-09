'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Compass, SigmaSquare } from "lucide-react";
import { ROSTER_COLUMN_CLASSES } from './rosterColumnConfig';

// Header Component exactly matching RankingsPlayerListHeader
const RosterHeader = ({ categories, onSort, sortConfig }) => {
  return (
    <div className="player-list-header bg-pb_darkgray text-white rounded-sm overflow-hidden">
      <div className="flex h-8 items-center">
        {/* Left section - Player Info Area */}
        <div className={ROSTER_COLUMN_CLASSES.playerInfoSectionHeader}>
          <div className="flex flex-1 bg-transparent hover:bg-gray-600 transition-colors cursor-pointer min-w-0">
            {/* Compass icon above rankings - clickable to reset to ranking order */}
            <div 
              className={`${ROSTER_COLUMN_CLASSES.compassIcon} hover:bg-gray-600 cursor-pointer`}
              onClick={() => onSort(null)}
              title="Sort by Ranking (Default Order)"
            >
              <Compass className="w-icon h-icon text-white" />
              {/* No chevrons for compass - it resets to default ranking order */}
            </div>
          </div>
        </div>

        {/* Stats Headers */}
        <div className={`${ROSTER_COLUMN_CLASSES.statsContainer} font-bold overflow-visible`}>
          {/* Z-Score Sum Sort Button */}
          <div
            key="zScoreSum"
            className={`${ROSTER_COLUMN_CLASSES.headerZScoreColumn} hover:bg-gray-600 cursor-pointer text-sm text-white select-none py-1`}
            onClick={() => onSort('zScoreSum')}
            title="Sort by Z-Score Sum"
          >
            <SigmaSquare className="w-icon h-icon" />
            {sortConfig?.key === 'zScoreSum' && (
              <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                {sortConfig?.direction === 'asc' ? (
                  <ChevronUp className="w-3 h-3 text-white" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-white" />
                )}
              </div>
            )}
          </div>

          {categories.map((abbrev) => (
            <TooltipProvider key={abbrev} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`${ROSTER_COLUMN_CLASSES.headerStatColumn} hover:bg-gray-600 cursor-pointer text-sm text-white select-none py-1`}
                    onClick={() => onSort(abbrev)}
                  >
                    {/* Centered abbreviation */}
                    <span className="text-xs font-semibold tracking-wide">
                      {abbrev}
                    </span>
                    
                    {/* Sort indicator positioned absolutely on the right */}
                    {sortConfig?.key === abbrev && (
                      <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                        {sortConfig?.direction === 'asc' ? (
                          <ChevronUp className="w-3 h-3 text-white" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] bg-pb_darkgray text-white border-pb_lightgray">
                  <div className="space-y-1 p-2">
                    <p className="font-semibold">{abbrev}</p>
                    <p className="text-xs text-gray-300">Fantasy basketball statistic</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RosterHeader; 