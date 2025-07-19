import { Check, ChevronsUpDown, ClipboardList, ClipboardMinus, Clock } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';

// Button that shows the current rankings list and allows changing it.
// Automatically finds relevant rankings based on current league context.
// Props:
//  - className (string): additional styling classes
export default function RankingsSelectorButton({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState(null);
  const buttonRef = useRef(null);

  // =================================================================
  // CONTEXT STORE
  // =================================================================
  // By selecting each piece of state individually, we ensure the component
  // only re-renders when the exact data it needs changes, preventing loops.
  const leagues = useDashboardContext((state) => state.leagues);
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const userRankings = useDashboardContext((state) => state.userRankings);
  const expertRankings = useDashboardContext((state) => state.expertRankings);

  const leagueDetails = useMemo(() => {
    if (!leagues || !currentLeagueId) return {};
    const currentLeague = leagues.find(
      (l) => l.leagueDetails?.leagueName === currentLeagueId
    );
    return currentLeague?.leagueDetails || {};
  }, [leagues, currentLeagueId]);
  
  // =================================================================
  // COMPUTED VALUES
  // =================================================================
  
  // Extract current league context for matching, with fallbacks for safety
  const currentSport = leagueDetails?.sport?.toLowerCase();
  const currentFormat = leagueDetails?.format?.toLowerCase();
  const currentScoring = leagueDetails?.scoring?.toLowerCase();
  
  // Find and tag matching user rankings for current league context
  const matchingUserRankings = (userRankings || []).filter(ranking => {
    const rankingSport = ranking.sport?.toLowerCase();
    const rankingFormat = ranking.format?.toLowerCase(); 
    const rankingScoring = ranking.scoring?.toLowerCase();
    
    return rankingSport === currentSport && 
           rankingFormat === currentFormat && 
           rankingScoring === currentScoring;
  }).map(ranking => ({ ...ranking, type: 'user' }));
  
  // Find and tag matching expert rankings for current league context
  const matchingExpertRankings = (expertRankings || []).filter(ranking => {
    const rankingSport = ranking.sport?.toLowerCase();
    const rankingFormat = ranking.format?.toLowerCase(); 
    const rankingScoring = ranking.scoring?.toLowerCase();
    
    return rankingSport === currentSport && 
           rankingFormat === currentFormat && 
           rankingScoring === currentScoring;
  }).map(ranking => ({ ...ranking, type: 'expert' }));
  
  // Combine all available rankings with expert rankings first, then sorted user rankings
  const allRankings = [
    ...matchingExpertRankings,
    ...matchingUserRankings
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdated);
        const dateB = new Date(b.lastUpdated);
        return dateB - dateA; // Sort newest first
      })
  ];
  
  // Determine current ranking (prefer selected, then user rankings, fallback to expert)
  const currentRanking = selectedRanking || 
    (matchingUserRankings?.length > 0 ? matchingUserRankings[0] : matchingExpertRankings?.[0]);
  
  // Determine display name for the button
  const displayName = currentRanking?.type === 'expert' 
    ? 'Expert Rankings' 
    : currentRanking?.name || 'Select Rankings';

  // =================================================================
  // EVENT HANDLERS
  // =================================================================
  const handleRankingSelect = (ranking) => {
    setSelectedRanking(ranking);
    setIsOpen(false);
    // TODO: Add logic to actually switch to the selected ranking
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
        className={`flex items-center justify-between gap-2 rounded-md border border-pb_lightgray shadow-sm select-none px-3 hover:bg-pb_lightestgray transition-colors ${className}`.trim()}
      >
        <div className="flex items-center min-w-0">
          <ClipboardList className="w-icon h-icon mr-2 text-pb_darkgray" />
          <span className="text-button font-semibold text-left text-pb_darkgray truncate hidden md:block md:w-44 xl:w-54">
            {displayName}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <ChevronsUpDown className="w-icon-sm h-icon-sm text-pb_darkgray" />
        </div>
      </button>

      {/* Custom Floating Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-pb_lightgray rounded-md shadow-md z-[10001] max-h-80 overflow-y-auto text-pb_darkgray animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          style={{
            position: 'absolute',
            zIndex: 10001
          }}
        >
          {/* Ranking Items */}
          {(!allRankings || allRankings.length === 0) ? (
            <div className="relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none">
              <span className="text-sm text-pb_mddarkgray">
                No rankings available
              </span>
            </div>
          ) : (
            allRankings.map((ranking, index) => {
              const isSelected = ranking.name === currentRanking?.name;
              const isUserType = ranking.type === 'user';
              const Icon = isUserType ? ClipboardList : ClipboardMinus;
              
              // Determine display name and details based on ranking type
              let displayName, detailsText;
              
              // Format sport, format, and scoring details
              const formatDetails = (ranking) => {
                const details = [];
                if (ranking.sport) details.push(ranking.sport.toUpperCase());
                if (ranking.format) details.push(ranking.format.charAt(0).toUpperCase() + ranking.format.slice(1));
                if (ranking.scoring) details.push(ranking.scoring.charAt(0).toUpperCase() + ranking.scoring.slice(1));
                return details.length > 0 ? details.join(' • ') : 'Rankings';
              };

              if (isUserType) {
                // User rankings: show ranking name and sport/format/scoring details
                displayName = ranking.name;
                detailsText = formatDetails(ranking);
              } else {
                // Expert rankings: show "Expert Rankings" and sport/format/scoring details
                displayName = 'Expert Rankings';
                detailsText = formatDetails(ranking);
              }
              
              return (
                <div
                  key={index}
                  onClick={() => handleRankingSelect(ranking)}
                  className={`group relative flex cursor-default select-none items-center gap-3 rounded-sm px-3 py-3 m-1 text-sm outline-none transition-colors ${
                    isSelected 
                      ? 'bg-pb_lightestgray' 
                      : 'hover:bg-pb_lightestgray'
                  }`}
                >
                  <Icon className={`w-icon h-icon ${isUserType ? 'text-pb_darkgray' : 'text-pb_mddarkgray'}`} />
                  <div className="flex-grow">
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-xs text-pb_mddarkgray">{detailsText}</p>
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