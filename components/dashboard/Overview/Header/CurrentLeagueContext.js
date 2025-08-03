import { baseball, basketball, football } from "@lucide/lab";
import { Bolt, Circle, createLucideIcon, Path, Route, Shuffle } from 'lucide-react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';

// Build lucide icons at runtime from lab definitions
const Basketball = createLucideIcon('basketball', basketball);
const Football = createLucideIcon('football', football);
const Baseball = createLucideIcon('baseball', baseball);


/*
 * Displays a concise, bullet-separated summary of the selected league's context.
 * Automatically pulls data from the useDashboardContext store.
 * Parts shown (in order):
 *   sport • format • mode • scoring • platform  [• teamDirection?]
 *
 * Props (all optional):
 *   - className      (string)  Additional Tailwind classes.
 */
export default function CurrentLeagueContext({
  className = '',
}) {
  const getCurrentLeagueDetails = useDashboardContext(state => state.getCurrentLeagueDetails);
  const leagueDetails = getCurrentLeagueDetails();

  // Extract data from league details with fallbacks
  const sport = leagueDetails.sport
  const format = leagueDetails.format
  const mode = leagueDetails.mode
  const scoring = leagueDetails.scoring
  const platform = leagueDetails.platform
  const teamDirection = leagueDetails.teamDirection;
  const leagueName = leagueDetails.leagueName
  const contextString = [sport, format, mode, scoring, platform].filter(Boolean).join(' • ');

  return (
    <div className={`hidden lg:flex items-center pl-1 gap-2.5 xl:pl-1.5 ${className}`.trim()}>
      
      {/* Lightning bolt separator */}
      <Bolt className="hw-icon-xs text-gray-400" />
      
      {/* Context string */}
      <span className="text-paragraph-md font-medium text-gray-350 truncate">
        {contextString}
      </span>

      {/* Team direction */}
      {teamDirection && (
        <div className="items-center gap-2 shrink-0 hidden 2xl:flex">
          <Route className="hw-icon-xs text-gray-400" />
          <span className="text-paragraph-md font-medium text-gray-350 whitespace-nowrap">{teamDirection}</span>
        </div>
      )}
    </div>
  );
} 