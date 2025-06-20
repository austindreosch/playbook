import { Settings2 } from 'lucide-react';

// Button that opens settings for the current league.
export default function LeagueSettingsButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-md border border-pb_lightgray bg-white hover:bg-pb_lightestgray shadow-sm select-none px-3 py-1 ${className}`.trim()}
    >
      <Settings2 className="w-5 h-5 text-pb_darkgray" />
    </button>
  );
} 