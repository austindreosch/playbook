import { Check, ChevronsUpDown, ClipboardList, ClipboardMinus } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';

interface RankingsSelectorButtonProps {
  className?: string;
}

interface Ranking {
  name: string;
  sport?: string;
  format?: string;
  scoring?: string;
  lastUpdated?: string;
  type?: 'user' | 'expert';
}

export default function RankingsSelectorButton({ className = '' }: RankingsSelectorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<Ranking | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const leagues = useDashboardContext((state) => state.leagues);
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const userRankings = useDashboardContext((state) => state.userRankings);
  const expertRankings = useDashboardContext((state) => state.expertRankings);

  const leagueDetails = useMemo(() => {
    if (!leagues || !currentLeagueId) return {};
    const currentLeague = leagues.find(
      (l: any) => l.leagueDetails?.leagueName === currentLeagueId
    );
    return currentLeague?.leagueDetails || {};
  }, [leagues, currentLeagueId]);
  
  const currentSport = leagueDetails?.sport?.toLowerCase();
  const currentFormat = leagueDetails?.format?.toLowerCase();
  const currentScoring = leagueDetails?.scoring?.toLowerCase();
  
  const matchingUserRankings = (userRankings || []).filter((ranking: Ranking) => {
    const rankingSport = ranking.sport?.toLowerCase();
    const rankingFormat = ranking.format?.toLowerCase(); 
    const rankingScoring = ranking.scoring?.toLowerCase();
    
    return rankingSport === currentSport && 
           rankingFormat === currentFormat && 
           rankingScoring === currentScoring;
  }).map((ranking: Ranking) => ({ ...ranking, type: 'user' as const }));
  
  const matchingExpertRankings = (expertRankings || []).filter((ranking: Ranking) => {
    const rankingSport = ranking.sport?.toLowerCase();
    const rankingFormat = ranking.format?.toLowerCase(); 
    const rankingScoring = ranking.scoring?.toLowerCase();
    
    return rankingSport === currentSport && 
           rankingFormat === currentFormat && 
           rankingScoring === currentScoring;
  }).map((ranking: Ranking) => ({ ...ranking, type: 'expert' as const }));
  
  const allRankings = [
    ...matchingExpertRankings,
    ...matchingUserRankings
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdated || 0);
        const dateB = new Date(b.lastUpdated || 0);
        return dateB.getTime() - dateA.getTime();
      })
  ];
  
  const currentRanking = selectedRanking || 
    (matchingUserRankings?.length > 0 ? matchingUserRankings[0] : matchingExpertRankings?.[0]);
  
  const displayName = currentRanking?.type === 'expert' 
    ? 'Expert Rankings' 
    : currentRanking?.name || 'Select Rankings';

  const handleRankingSelect = (ranking: Ranking) => {
    setSelectedRanking(ranking);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
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
  
  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={handleButtonClick}
        className={`flex items-center justify-center h-9 min-h-9 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none ${className}`.trim()}
      >
        <div className="flex items-center min-w-0">
          <ClipboardList className="size-5 text-sub-600 mr-2" />
          <span className="text-label-md font-semibold text-left text-strong-950 truncate hidden md:block md:max-w-44 xl:max-w-54">
            {displayName}
          </span>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <ChevronsUpDown className="size-4 text-sub-600" />
        </div>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-bg-white-0 ring-1 ring-stroke-soft-200 rounded-lg shadow-regular-lg z-[10001] max-h-80 overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          style={{
            position: 'absolute',
            zIndex: 10001
          }}
        >
          {(!allRankings || allRankings.length === 0) ? (
            <div className="relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none">
              <span className="text-label-sm text-sub-500">
                No rankings available
              </span>
            </div>
          ) : (
            allRankings.map((ranking, index) => {
              const isSelected = ranking.name === currentRanking?.name;
              const isUserType = ranking.type === 'user';
              const Icon = isUserType ? ClipboardList : ClipboardMinus;
              
              const formatDetails = (ranking: Ranking) => {
                const details = [];
                if (ranking.sport) details.push(ranking.sport.toUpperCase());
                if (ranking.format) details.push(ranking.format.charAt(0).toUpperCase() + ranking.format.slice(1));
                if (ranking.scoring) details.push(ranking.scoring.charAt(0).toUpperCase() + ranking.scoring.slice(1));
                return details.length > 0 ? details.join(' • ') : 'Rankings';
              };

              const displayName = isUserType ? ranking.name : 'Expert Rankings';
              const detailsText = formatDetails(ranking);
              
              return (
                <div
                  key={index}
                  onClick={() => handleRankingSelect(ranking)}
                  className={`group relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-3 m-1 text-sm outline-none transition-colors ${
                    isSelected 
                      ? 'bg-bg-weak-50' 
                      : 'hover:bg-bg-weak-50'
                  }`}
                >
                  <Icon className={`size-5 ${isUserType ? 'text-sub-600' : 'text-sub-500'}`} />
                  <div className="flex-grow">
                    <p className="text-label-md font-semibold text-strong-950">{displayName}</p>
                    <p className="text-subheading-sm text-sub-500">{detailsText}</p>
                  </div>
                  {isSelected && <Check className="size-4 text-sub-600" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}