'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Check, ChevronsUpDown, Users } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function OpponentSelectorButton({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const buttonRef = useRef(null);

  // =================================================================
  // CONTEXT STORE (Partially used for now)
  // =================================================================
  const leagues = useDashboardContext((state) => state.leagues);
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const leagueTeams = useDashboardContext((state) => state.leagueTeams); // Will use this later

  const currentLeague = useMemo(() => {
    if (!leagues || !currentLeagueId) return null;
    return leagues.find((l) => l.leagueDetails?.leagueName === currentLeagueId);
  }, [leagues, currentLeagueId]);
  
  const userTeamName = currentLeague?.leagueDetails?.teamName;

  // =================================================================
  // COMPUTED VALUES
  // =================================================================
  
  // For now, using dummy data. Later, this will come from context.
  const opponentTeams = useMemo(() => {
    if (!leagueTeams) return [];
    return leagueTeams.filter(team => team.teamName !== userTeamName);
  }, [leagueTeams, userTeamName]);

  // Determine current opponent
  const currentOpponent = selectedOpponent || (opponentTeams.length > 0 ? opponentTeams[0] : null);
  
  const displayName = currentOpponent?.teamName || 'Select Opponent';

  // =================================================================
  // EVENT HANDLERS
  // =================================================================
  const handleOpponentSelect = (team) => {
    setSelectedOpponent(team);
    setIsOpen(false);
    // TODO: Add logic to update trade context with selected opponent
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // =================================================================
  // RENDER
  // =================================================================
  
  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={handleButtonClick}
        className={`flex items-center justify-between gap-2 rounded-md  bg-bg-surface-800 text-white shadow-sm select-none px-3 py-1 hover:bg-text-strong-950 transition-colors ${className}`.trim()}
      >
        <div className="flex items-center min-w-0">
          <Users className="w-icon h-icon mr-2 text-white" />
          <span className="text-button font-semibold text-left truncate hidden md:block md:w-42 xl:w-52">
            {displayName}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <ChevronsUpDown className="w-icon-sm h-icon-sm text-white" />
        </div>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 w-full mt-1 bg-bg-surface-800 border border-text-strong-950 rounded-md shadow-md z-[10001] max-h-80 overflow-y-auto text-white animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 scrollbar-thin scrollbar-thumb-text-strong-950 scrollbar-track-bg-surface-800"
        >
          {opponentTeams.length === 0 ? (
            <div className="relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none">
              <span className="text-sm text-gray-400">
                No other teams available
              </span>
            </div>
          ) : (
            opponentTeams.map((team, index) => {
              const isSelected = team.teamName === currentOpponent?.teamName;
              
              return (
                <div
                  key={index}
                  onClick={() => handleOpponentSelect(team)}
                  className={`group relative flex cursor-default select-none items-center gap-3 rounded-sm px-3 py-3 m-1 text-button outline-none transition-colors ${
                    isSelected 
                      ? 'bg-text-strong-950' 
                      : 'hover:bg-text-strong-950'
                  }`}
                >
                  <Users className={`w-5 h-5 text-white`} />
                  <div className="flex-grow">
                    <p className="font-semibold">{team.teamName}</p>
                    <p className="text-xs text-gray-400">Owner: {team.owner}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
} 