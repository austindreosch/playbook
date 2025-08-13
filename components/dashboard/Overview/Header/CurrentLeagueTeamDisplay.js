import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/alignui/hover-card";
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { BookUser } from 'lucide-react';

// Displays the user team name for the currently selected league
// Props:
//  - className (string): additional Tailwind classes for sizing / layout.
export default function CurrentLeagueTeamDisplay({ className = '' }) {
  // =================================================================
  // CONTEXT STORE
  // =================================================================
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const leagues = useDashboardContext((state) => state.leagues);

  // =================================================================
  // COMPUTED VALUES
  // =================================================================
  const currentLeague = leagues.find(league => 
    league.leagueDetails?.leagueName === currentLeagueId
  );
  const teamName = currentLeague?.leagueDetails?.teamName || 'User Team Name';
  const leagueDetails = currentLeague?.leagueDetails;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className={`flex items-center gap-2 h-9 min-h-9 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none w-auto md:w-66 lg:w-54 xl:w-62 ${className}`.trim()}
        >
          {/* Team name - progressively hidden on smaller screens */}
          <span className="text-button font-semibold text-sub-600 truncate flex-1 hidden sm:block">
            {teamName}
          </span>
          
          {/* Icon - always visible, serves as fallback for smallest screens */}
          <BookUser className="size-5 text-sub-600 shrink-0" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start" side="bottom">
        <div className="space-y-3">
          <div>
            <h4 className="text-label-md font-semibold">{leagueDetails?.leagueName || 'League'}</h4>
            <p className="text-label-md text-gray-250">{teamName}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-label-sm text-gray-250">Sport</span>
              <p className="text-paragraph-sm font-medium">{leagueDetails?.sport || 'N/A'}</p>
            </div>
            <div>
              <span className="text-label-sm text-gray-250">Format</span>
              <p className="text-paragraph-sm font-medium">{leagueDetails?.format || 'N/A'}</p>
            </div>
            <div>
              <span className="text-label-sm text-gray-250">Scoring</span>
              <p className="text-paragraph-sm font-medium">{leagueDetails?.scoring || 'N/A'}</p>
            </div>
            <div>
              <span className="text-label-sm text-gray-250">Platform</span>
              <p className="text-paragraph-sm font-medium">{leagueDetails?.platform || 'N/A'}</p>
            </div>
            <div>
              <span className="text-label-sm text-gray-250">Teams</span>
              <p className="text-paragraph-sm font-medium">{leagueDetails?.teamSize || 'N/A'}</p>
            </div>
            <div>
              <span className="text-label-sm text-gray-250">Mode</span>
              <p className="text-paragraph-sm font-medium">{leagueDetails?.mode || 'N/A'}</p>
            </div>
          </div>
          {leagueDetails?.teamDirection && (
            <div className="pt-2 border-t">
              <span className="text-label-sm text-gray-250">Team Direction</span>
              <p className="text-paragraph-sm font-medium">{leagueDetails.teamDirection}</p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 