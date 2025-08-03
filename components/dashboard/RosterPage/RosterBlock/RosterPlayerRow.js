'use client';

import { memo, useState } from 'react';
import PlayerRowStatsSection from './PlayerRowStatsSection';
import { ROSTER_COLUMN_CLASSES } from './rosterColumnConfig';

// Player Row Component exactly matching RankingsPlayerRow structure
const RosterPlayerRow = memo(({ player, rank, categories, isExpanded, onToggleExpand, rowIndex }) => {
  const playerName = player.name || 'Unknown Player';
  const playerPosition = player.position || 'N/A';
  const playerTeam = player.team || 'FA';
  const defaultImageSrc = '/avatar-default.png';

  // Use actual Playbook score from player data, fallback to dummy if not available
  const playbookScore = player.playbookScore || playerStats?.playbookScore || Math.max(1, Math.floor(999 - (rank - 1) * 15 - Math.random() * 20));

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
        <div className={`${ROSTER_COLUMN_CLASSES.playerInfoSectionRow}  `}>
          {/* Playbook Score instead of rank number */}
          <div className={`${ROSTER_COLUMN_CLASSES.playbookScoreBox} font-mono text-label-md font-semibold text-black select-none rounded-sm border border-pb_lightergray`}>
            {playbookScore}
          </div>

          {/* Player Image */}
          <div className="hidden lg:flex pl-2 text-center select-none items-center justify-center">
            <img
              src={player.imageUrl || defaultImageSrc}
              key={player.name}
              alt={playerName}
              className="w-6 h-6 object-cover bg-gray-25 border border-pb_lightgray rounded-sm lg:block"
              loading="lazy"
              width="28"
              height="28"
              onError={handleImageError}
            />
          </div>

          {/* Player name and position */}
          <div className="flex items-baseline gap-2 select-none min-w-0 pl-3">
            <div className="font-semibold text-label-md truncate text-black">
              {playerName}
            </div>
            <div className="text-gray-300 text-paragraph-xs flex-shrink-0">
              {playerPosition}
            </div>
          </div>
        </div>

        {/* Stats section - flexible width */}
        <div className="flex-grow min-w-0 h-full">
          <PlayerRowStatsSection 
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