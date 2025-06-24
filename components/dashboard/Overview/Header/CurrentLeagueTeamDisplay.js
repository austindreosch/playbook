import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
        <div
          className={`flex items-center gap-2 rounded-md border border-pb_lightgray bg-white shadow-sm px-2 sm:px-3  py-1 select-none cursor-pointer hover:bg-pb_lightestgray transition-colors w-auto md:w-66 lg:w-54 xl:w-62 ${className}`.trim()}
        >
                      {/* Team name - progressively hidden on smaller screens */}
            <span className="text-sm font-semibold text-pb_darkgray truncate flex-1 hidden sm:block">
              {teamName}
            </span>
          
          {/* Icon - always visible, serves as fallback for smallest screens */}
          <BookUser className="w-5 h-5 text-pb_darkgray shrink-0" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start" side="bottom">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold">{leagueDetails?.leagueName || 'League'}</h4>
            <p className="text-xs text-muted-foreground">{teamName}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Sport</span>
              <p className="font-medium">{leagueDetails?.sport || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Format</span>
              <p className="font-medium">{leagueDetails?.format || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Scoring</span>
              <p className="font-medium">{leagueDetails?.scoring || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Platform</span>
              <p className="font-medium">{leagueDetails?.platform || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Teams</span>
              <p className="font-medium">{leagueDetails?.teamSize || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mode</span>
              <p className="font-medium">{leagueDetails?.mode || 'N/A'}</p>
            </div>
          </div>
          {leagueDetails?.teamDirection && (
            <div className="pt-2 border-t">
              <span className="text-xs text-muted-foreground">Team Direction</span>
              <p className="text-sm font-medium">{leagueDetails.teamDirection}</p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 