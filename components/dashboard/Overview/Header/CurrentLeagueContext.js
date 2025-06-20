import { baseball, basketball, football } from "@lucide/lab";
import { Bolt, Circle, createLucideIcon, Path, Route, Shuffle } from 'lucide-react';

// Build lucide icons at runtime from lab definitions
const Basketball = createLucideIcon('basketball', basketball);
const Football = createLucideIcon('football', football);
const Baseball = createLucideIcon('baseball', baseball);


/*
 * Displays a concise, bullet-separated summary of the selected league's context.
 * Parts shown (in order):
 *   format  • mode • scoring • platform  [• teamDirection?]
 *
 * Props (all optional – change defaults as needed):
 *   - sport          (string)  Used by parent component for colour/icon decisions.
 *   - format         (string)  e.g. "Dynasty", "Redraft", "Keeper".
 *   - mode           (string)  e.g. "H2H (Each)", "H2H (Most)", "Roto".
 *   - scoring        (string)  e.g. "Categories", "Points".
 *   - platform       (string)  e.g. "Fantrax", "Sleeper", "ESPN", "Yahoo".
 *   - teamDirection  (string)  e.g. "Contending", "Rebuilding", "Flexible".
 *   - className      (string)  Additional Tailwind classes.
 */
export default function CurrentLeagueContext({
  sport = 'NBA', // reserved for future use / colour variants
  format = 'Dynasty',
  mode = 'H2H (Each)',
  scoring = 'Categories',
  platform = 'Fantrax',
  teamDirection = 'Contending',
  leagueName = 'League Name',
  className = '',
}) {
  const parts = [sport, format, mode, scoring, platform];
  // if (teamDirection) parts.push(teamDirection);
  const contextString = parts.filter(Boolean).join(' • ');

  return (
    <div className={`flex items-center px-3 gap-6 ${className}`.trim()}>

      <div className="flex items-center gap-3">
        {sport === 'NBA' && <Basketball className="w-4 h-4 text-pb_mddarkgray shrink-0" />}
        {sport === 'NFL' && <Football className="w-5 h-5 text-pb_mddarkgray shrink-0" />}
        {sport === 'MLB' && <Baseball className="w-5 h-5 text-pb_mddarkgray shrink-0" />}
        <span className="text-xs font-semibold text-pb_mddarkgray truncate max-w-[40rem]">
          {leagueName}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Bolt className="w-4 h-4 text-pb_mddarkgray shrink-0" />
        <span className="text-xs font-medium text-pb_mddarkgray truncate max-w-[24rem]">
          {contextString}
        </span>
      </div>
      {teamDirection && (
        <div className="flex items-center gap-3">
          <Route className="w-4 h-4 text-pb_mddarkgray" />
          <span className="text-xs font-medium text-pb_mddarkgray whitespace-nowrap">{teamDirection}</span>
        </div>
      )}
    </div>
  );
} 