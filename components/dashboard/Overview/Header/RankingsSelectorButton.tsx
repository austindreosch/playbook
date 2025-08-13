import { ClipboardList, ClipboardMinus, BookCopy } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';
import { Select, SelectContent, SelectItem, SelectTrigger, TriggerIcon } from '@/components/alignui/select';
import * as Divider from '@/components/alignui/divider';

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
  const [selectedRanking, setSelectedRanking] = useState<Ranking | null>(null);

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

  // Ensure a default selection when options change
  useEffect(() => {
    if (!currentRanking && allRankings.length > 0) {
      setSelectedRanking(allRankings[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRankings.length]);

  // Build Select values using stable indices
  const allValues = allRankings.map((_, index) => String(index));
  const currentValue = currentRanking ? String(allRankings.findIndex(r => r === currentRanking)) : (allValues[0] || '');

  const handleValueChange = (value: string) => {
    const index = Number(value);
    if (!Number.isNaN(index) && allRankings[index]) {
      setSelectedRanking(allRankings[index]);
    }
  };
  
  return (
    <div className={className}>
      <Select value={currentValue} onValueChange={handleValueChange} size="small">
        <SelectTrigger className="w-auto gap-2 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none ">
          <div className="flex items-center gap-2">
            <TriggerIcon className="hidden xl:flex">
              <ClipboardList className="hw-icon text-sub-600" />
            </TriggerIcon>
            <span className="hidden mdlg:inline text-label-md font-semibold truncate text-left max-w-[7rem] xl:max-w-[8rem] 2xl:max-w-[13rem] 2xl:w-52">
              {displayName}
            </span>
          </div>
        </SelectTrigger>

        <SelectContent className="w-64 max-h-[32rem]">
          {(!allRankings || allRankings.length === 0) ? (
            <div className="relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none">
              <span className="text-label-sm text-sub-500">
                No rankings available
              </span>
            </div>
          ) : (
            <>
              {/* <Divider.Root variant="line-spacing" className="my-1" /> */}
              {allRankings.map((ranking, index) => {
                const isSelected = currentValue === String(index);
                const isUserType = ranking.type === 'user';
                const display = isUserType ? ranking.name : 'Expert Rankings';

                const formatDetails = (item: Ranking) => {
                  const details: string[] = [];
                  if (item.sport) details.push(item.sport.toUpperCase());
                  if (item.format) details.push(item.format.charAt(0).toUpperCase() + item.format.slice(1));
                  if (item.scoring) details.push(item.scoring.charAt(0).toUpperCase() + item.scoring.slice(1));
                  return details.length > 0 ? details.join(' • ') : 'Rankings';
                };
                const detailsText = formatDetails(ranking);

                return (
                  <SelectItem 
                    key={index} 
                    value={String(index)} 
                    className={`p-3 my-1 ${isSelected ? 'bg-bg-weak-50' : ''}`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center justify-center size-8 rounded-full bg-bg-weak-10 border border-stroke-soft-200">
                        {isUserType ? (
                          <ClipboardList className="hw-icon text-sub-600" />
                        ) : (
                          <ClipboardMinus className="hw-icon text-sub-500" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-label-md font-semibold text-strong-950">{display}</span>
                        <span className="text-subheading-sm text-gray-300">{detailsText}</span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}