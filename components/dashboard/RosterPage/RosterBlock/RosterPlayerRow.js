'use client';

import { memo, useState } from 'react';
import RosterStatsSection from './PlayerRowStatsSection';

// Player Row Component exactly matching RankingsPlayerRow structure
const RosterPlayerRow = memo(({ player, rank, categories, isExpanded, onToggleExpand, rowIndex }) => {
  const playerName = player.name || 'Unknown Player';
  const playerPosition = player.position || 'N/A';
  const playerTeam = player.team || 'FA';
  const defaultImageSrc = '/avatar-default.png';

  // Generate dummy Playbook score out of 999 based on player index/rank
  const playbookScore = Math.max(1, Math.floor(999 - (rank - 1) * 15 - Math.random() * 20));

  const handleImageError = (event) => {
    if (event.target.src !== defaultImageSrc) {
      event.target.src = defaultImageSrc;
      event.target.classList.add('image-fallback');
    }
  };

  return (
    <div className="player-row border rounded-md overflow-hidden shadow-sm bg-white hover:bg-gray-50">
      <div
        className="flex h-8 items-center bg-white hover:bg-gray-50"
        onClick={onToggleExpand}
      >
        {/* Left section with fixed widths - exactly matching RankingsPlayerRow */}
        <div className="flex items-center w-[35%] flex-shrink-0 relative h-full ml-1">
          {/* Playbook Score instead of rank number */}
          <div className="w-9 h-6 text-button text-center select-none rounded-sm border border-pb_lightergray flex items-center justify-center font-bold">
            {playbookScore}
          </div>

          {/* Player Image */}
          <div className="hidden lg:flex pl-2 text-center select-none items-center justify-center">
            <img
              src={player.imageUrl || defaultImageSrc}
              key={player.name}
              alt={playerName}
              className="w-6 h-6 object-cover bg-pb_backgroundgray border border-pb_lightgray rounded-sm lg:block"
              loading="lazy"
              width="28"
              height="28"
              onError={handleImageError}
            />
          </div>

          {/* Player name and position */}
          <div className="flex items-baseline gap-2 select-none min-w-0 pl-3">
            <div className="font-semibold text-button truncate text-pb_darkgray">
              {playerName}
            </div>
            <div className="text-pb_textgray text-2xs flex-shrink-0">
              {playerPosition}
            </div>
          </div>
        </div>

        {/* Stats section - flexible width */}
        <div className="flex flex-grow min-w-0 h-full">
          <RosterStatsSection 
            categories={categories}
            playerStats={player.stats}
            player={player}
            rowIndex={rowIndex}
          />
        </div>
      </div>
    </div>
  );
});

RosterPlayerRow.displayName = 'RosterPlayerRow';

export default RosterPlayerRow; 