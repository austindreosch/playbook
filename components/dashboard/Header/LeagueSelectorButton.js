import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { baseball, basketball, football } from "@lucide/lab";
import { BookCopy, ChevronsUpDown, createLucideIcon } from 'lucide-react';
import { useState } from 'react';

const Basketball = createLucideIcon('basketball', basketball);
const Baseball = createLucideIcon('baseball', baseball);
const Football = createLucideIcon('football', football);

export default function LeagueSelectorButton({ className = "" }) {
  // =================================================================
  // LOCAL STATE
  // =================================================================
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // =================================================================
  // CONTEXT STORE
  // =================================================================
  // ---- INCOMING DATA ----
  const currentView = useDashboardContext((state) => state.currentView);
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const leagues = useDashboardContext((state) => state.leagues);
  
  // ---- OUTGOING DATA ----
  const setIndividualLeagueView = useDashboardContext((state) => state.setIndividualLeagueView);

  // =================================================================
  // COMPUTED VALUES
  // =================================================================
  const isLeagueView = currentView === 'league';
  const currentLeague = leagues.find(league => 
    league.leagueDetails?.leagueName === currentLeagueId
  );
  const displayName = currentLeague?.leagueDetails?.leagueName || 'Select League';

  // =================================================================
  // EVENT HANDLERS
  // =================================================================
  const handleButtonClick = () => {
    if (!isLeagueView) {
      // First click: Switch to league view with current/first league
      const targetLeague = currentLeague || leagues[0];
      if (targetLeague) {
        setIndividualLeagueView(targetLeague.leagueDetails.leagueName);
      }
    } else {
      // Second click: Open dropdown menu
      setIsDropdownOpen(true);
    }
  };

  const handleLeagueSelect = (leagueName) => {
    setIndividualLeagueView(leagueName);
    setIsDropdownOpen(false);
  };

  // =================================================================
  // RENDER
  // =================================================================
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          onClick={handleButtonClick}
          className={`flex items-center justify-between px-3 rounded-md border shadow-sm select-none transition-colors duration-200 ${
            isLeagueView 
              ? 'border-pb_lightgray bg-pb_lightestgray hover:bg-pb_lightgray hover:border-pb_textgray' 
              : 'border-pb_lightgray bg-white hover:bg-pb_lightestgray'
          } ${className}`.trim()}
        >
          <div className="flex items-center gap-3">
            <Basketball className="w-5 h-5 text-pb_darkgray hidden xl:inline" />
            <span className="text-sm font-semibold text-pb_darkgray mr-2 truncate text-left max-w-[4rem] xl:max-w-[10rem] 2xl:w-52">
              {displayName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ChevronsUpDown className="w-4 h-4 text-pb_darkgray hidden 2xl:inline" />
            <BookCopy className="w-5 h-5 text-pb_darkgray" />
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Select League</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {leagues.map((league, index) => {
          const leagueName = league.leagueDetails?.leagueName;
          const sport = league.leagueDetails?.sport;
          const format = league.leagueDetails?.format;
          const platform = league.leagueDetails?.platform;
          const isSelected = leagueName === currentLeagueId;
          
          return (
            <DropdownMenuItem
              key={index}
              onClick={() => handleLeagueSelect(leagueName)}
              className={`cursor-pointer ${isSelected ? 'bg-pb_lightestgray' : ''}`}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-pb_darkgray truncate">
                    {leagueName}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-pb_darkgray bg-pb_lightgray px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-xs text-pb_mddarkgray mt-1">
                  {sport} • {format} • {platform}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 