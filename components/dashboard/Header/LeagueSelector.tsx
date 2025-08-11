import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { baseball, basketball, football } from "@lucide/lab";
import { BookCopy, createLucideIcon, Notebook, Users } from 'lucide-react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, TriggerIcon } from '@/components/alignui/select';
import * as Divider from '@/components/alignui/divider';

const Basketball = createLucideIcon('basketball', basketball);
const Football = createLucideIcon('football', football);
const Baseball = createLucideIcon('baseball', baseball);

// Function to get sport icon
const getSportIcon = (sport: string, className: string = "size-5") => {
  switch (sport?.toLowerCase()) {
    case 'nba':
      return <Basketball className={className} />;
    case 'nfl':
      return <Football className={className} />;
    case 'mlb':
      return <Baseball className={className} />;
    default:
      return <Users className={className} />;
  }
};

interface LeagueSelectorProps {
  className?: string;
}

export default function LeagueSelector({ className = "" }: LeagueSelectorProps) {

  // =================================================================
  // CONTEXT STORE
  // =================================================================
  // ---- INCOMING DATA ----
  const currentView = useDashboardContext((state) => state.currentView);
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const leagues = useDashboardContext((state) => state.leagues);
  
  // ---- OUTGOING DATA ----
  const setCurrentLeague = useDashboardContext((state) => state.setCurrentLeague);
  const setAllLeaguesView = useDashboardContext((state) => state.setAllLeaguesView);

  // =================================================================
  // COMPUTED VALUES
  // =================================================================
  const isAllLeaguesView = currentView === 'allLeagues';
  const currentLeague = leagues.find((league: any) => 
    league.leagueDetails?.leagueName === currentLeagueId
  );
  
  // Determine current value for select
  const currentValue = isAllLeaguesView ? 'all-leagues' : currentLeagueId || '';
  
  // =================================================================
  // EVENT HANDLERS
  // =================================================================
  const handleValueChange = (value: string) => {
    if (value === 'all-leagues') {
      setAllLeaguesView();
    } else {
      setCurrentLeague(value);
    }
  };

  // Sort leagues so the currently selected league appears first
  const sortedLeagues = leagues.sort((a: any, b: any) => {
    const aIsSelected = a.leagueDetails?.leagueName === currentLeagueId;
    const bIsSelected = b.leagueDetails?.leagueName === currentLeagueId;
    
    if (aIsSelected && !bIsSelected) return -1;
    if (!aIsSelected && bIsSelected) return 1;
    
    // If neither or both are selected, maintain original order
    return 0;
  });

  // =================================================================
  // RENDER
  // =================================================================
  return (
    <div className={className}>
      <Select value={currentValue} onValueChange={handleValueChange} size="small">
        <SelectTrigger className="w-auto gap-2 bg-bg-white-0 ">
          <div className="flex items-center gap-2">
            <TriggerIcon className="hidden xl:flex">
              {isAllLeaguesView ? (
                <Notebook className="hw-icon text-sub-600" />
              ) : (
                currentLeague ? getSportIcon(currentLeague.leagueDetails?.sport, "hw-icon text-sub-600") : <Basketball className="hw-icon text-sub-600" />
              )}
            </TriggerIcon>
            <span className="hidden mdlg:inline text-label-md font-semibold truncate text-left max-w-[7rem] xl:max-w-[8rem] 2xl:max-w-[13rem] 2xl:w-52">
              {isAllLeaguesView ? 'All Leagues' : (currentLeague?.leagueDetails?.leagueName || 'Select League')}
            </span>
          </div>
          <BookCopy className="hw-icon text-sub-600" />
        </SelectTrigger>
        
        <SelectContent className="w-72 max-h-[32rem]">
          {/* All Leagues Option */}
          <SelectItem 
            value="all-leagues" 
            className={`p-3 ${isAllLeaguesView ? 'bg-bg-weak-50' : ''}`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center size-8 rounded-full bg-bg-weak-10 border border-stroke-soft-200">
                <Notebook className="hw-icon text-sub-600" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-label-md font-semibold text-strong-950">All Leagues View</span>
                <span className="text-subheading-sm text-gray-300">Integrated overview of all leagues</span>
              </div>
            </div>
          </SelectItem>
          
          <Divider.Root variant="line-spacing" className="my-1" />
          
          {/* League Items */}
          {sortedLeagues.map((league: any, index: number) => {
              const leagueName = league.leagueDetails?.leagueName;
              const sport = league.leagueDetails?.sport;
              const format = league.leagueDetails?.format;
              const platform = league.leagueDetails?.platform;
              const teamSize = league.leagueDetails?.teamSize;
              
              return (
                <SelectItem 
                  key={index} 
                  value={leagueName} 
                  className={`p-3 my-1 ${leagueName === currentLeagueId ? 'bg-bg-weak-50' : ''}`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center size-8 rounded-full bg-bg-weak-10 border border-stroke-soft-200">
                      {getSportIcon(sport, "hw-icon text-sub-600")}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-label-md font-semibold text-strong-950">{leagueName}</span>
                      <span className="text-subheading-sm text-gray-300">
                        {format} • {platform}{teamSize ? ` • ${teamSize} Team` : ''}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
    </div>
  );
}