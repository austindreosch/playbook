import { Check, ChevronsUpDown, ClipboardList, ClipboardMinus, Clock } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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
  const getCurrentLeagueDetails = useDashboardContext(state => state.getCurrentLeagueDetails);
  const userRankings = useDashboardContext(state => state.userRankings);
  const dashboardSettings = useDashboardContext(state => state.dashboardSettings);
  
  const leagueDetails = getCurrentLeagueDetails();
  
  // Get expert rankings from dashboard context (assuming they're stored in dashboardSettings or similar)
  // TODO: Update this path based on where expert rankings are actually stored in the context
  const allExpertRankings = dashboardSettings?.expertRankings || [];
  
  // =================================================================
  // UTILITY FUNCTIONS
  // =================================================================
  
  // Convert timestamp to relative time (e.g., "2d ago", "1w ago")
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  // =================================================================
  // COMPUTED VALUES
  // =================================================================
  
  // Extract current league context for matching
  const currentSport = leagueDetails.sport?.toLowerCase();
  const currentFormat = leagueDetails.format?.toLowerCase();
  const currentScoring = leagueDetails.scoring?.toLowerCase();
  
  // Find matching user rankings for current league context
  const matchingUserRankings = userRankings.filter(ranking => {
    const rankingSport = ranking.sport?.toLowerCase();
    const rankingFormat = ranking.format?.toLowerCase(); 
    const rankingScoring = ranking.scoring?.toLowerCase();
    
    return rankingSport === currentSport && 
           rankingFormat === currentFormat && 
           rankingScoring === currentScoring;
  });
  
  // Find matching expert rankings for current league context
  const matchingExpertRankings = allExpertRankings.filter(ranking => {
    const rankingSport = ranking.sport?.toLowerCase();
    const rankingFormat = ranking.format?.toLowerCase(); 
    const rankingScoring = ranking.scoring?.toLowerCase();
    
    return rankingSport === currentSport && 
           rankingFormat === currentFormat && 
           rankingScoring === currentScoring;
  });
  
  // Combine all available rankings (user + expert)
  const allRankings = [
    ...matchingUserRankings.map(ranking => ({ ...ranking, type: 'user' })),
    ...matchingExpertRankings.map(ranking => ({ ...ranking, type: 'expert' }))
  ];
  
  // Determine current ranking (prefer selected, then user rankings, fallback to expert)
  const currentRanking = selectedRanking || 
    (matchingUserRankings.length > 0 ? matchingUserRankings[0] : matchingExpertRankings[0]);
  
  // Determine display name
  const displayName = currentRanking?.name || 'Select Rankings';

  // =================================================================
  // EVENT HANDLERS
  // =================================================================
  const handleRankingSelect = (ranking) => {
    console.log('🔄 Ranking selected:', ranking);
    setSelectedRanking(ranking);
    setIsOpen(false);
    // TODO: Add logic to actually switch to the selected ranking
  };

  const handleButtonClick = () => {
    console.log('🖱️ Rankings button clicked');
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
        className={`flex items-center justify-between gap-2 rounded-md border border-pb_lightgray shadow-sm select-none px-3 py-1 hover:bg-pb_lightestgray transition-colors w-auto ${className}`.trim()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <ClipboardList className="w-5 h-5 text-pb_darkgray" />
          <span className="text-sm font-semibold text-left text-pb_darkgray truncate hidden md:block lg:w-48 xl:w-62">
            {displayName}
          </span>
        </div>
        
        <ChevronsUpDown className="w-4 h-4 text-pb_darkgray" />
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
          {allRankings.length === 0 ? (
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
              
              if (isUserType) {
                // User rankings: show ranking name, then "My Rankings"
                displayName = ranking.name;
                detailsText = 'My Rankings';
              } else {
                // Expert rankings: show "Expert Rankings", then sport/format/scoring details
                displayName = 'Expert Rankings';
                const details = [];
                if (ranking.sport) details.push(ranking.sport.toUpperCase());
                if (ranking.format) details.push(ranking.format.charAt(0).toUpperCase() + ranking.format.slice(1));
                if (ranking.scoring) details.push(ranking.scoring.charAt(0).toUpperCase() + ranking.scoring.slice(1));
                detailsText = details.length > 0 ? details.join(' • ') : 'Expert Rankings';
              }
              
              return (
                <div
                  key={index}
                  onClick={() => handleRankingSelect(ranking)}
                  className={`group relative flex cursor-default select-none items-center gap-3 rounded-sm px-3 py-3 m-1 text-sm outline-none transition-colors ${
                    isSelected 
                      ? 'bg-pb_lightergray text-pb_darkgray hover:bg-pb_lightgray focus:bg-pb_lightgray' 
                      : 'text-pb_darkgray hover:bg-pb_backgroundgray hover:text-pb_darkgray'
                  }`}
                >
                  {/* Ranking Type Icon */}
                  <Icon className="w-4 h-4 text-pb_darkgray shrink-0" />

                  {/* Ranking Name & Details */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">
                        {displayName}
                      </span>
                      {/* Check Mark for Selected Ranking */}
                      {isSelected && (
                        <Check className="w-4 h-4 text-pb_darkgray shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isSelected ? 'text-pb_midgray' : 'text-pb_textgray'}`}>
                        {detailsText}
                      </span>
                      {ranking.lastUpdated && (
                        <div 
                          className="flex items-center gap-1 shrink-0"
                          title={`Last updated: ${new Date(ranking.lastUpdated).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}`}
                        >
                          <Clock className="w-3 h-3 text-pb_textgray" />
                          <span className="text-xs text-pb_textgray">
                            {getRelativeTime(ranking.lastUpdated)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
} 