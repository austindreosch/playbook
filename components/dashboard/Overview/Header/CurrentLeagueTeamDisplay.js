import { BookUser } from 'lucide-react';

// Displays the user team name for the currently selected league
// Props:
//  - teamName  (string): team name to display. Defaults to "User Team Name".
//  - className (string): additional Tailwind classes for sizing / layout.
export default function CurrentLeagueTeamDisplay({ teamName = 'User Team Name', className = '' }) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-md border border-pb_lightgray bg-white shadow-sm px-3 py-1 select-none ${className}`.trim()}
    >
      <span className="text-sm font-semibold text-pb_darkgray truncate w-52">
        {teamName}
      </span>
      <BookUser className="w-5 h-5 text-pb_darkgray flex-none" />
    </div>
  );
} 