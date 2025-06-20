import { RefreshCw } from 'lucide-react';

// Button that triggers a sync/refresh of the currently selected league.
// Props:
//  - onClick (function)
//  - className (string)
export default function SyncLeagueButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-md border border-pb_lightgray bg-white hover:bg-pb_lightestgray shadow-sm select-none px-3 py-1 ${className}`.trim()}
    >
      <RefreshCw className="w-5 h-5 text-pb_darkgray" />
    </button>
  );
} 