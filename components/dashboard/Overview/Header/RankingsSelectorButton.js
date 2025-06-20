import { ChevronsUpDown, ClipboardList } from 'lucide-react';

// Button that shows the current rankings list and allows changing it.
// Props:
//  - rankingName (string)
export default function RankingsSelectorButton({ rankingName = 'My Dynasty Rankings 2025', className = '' }) {
  return (
    <button
      className={`flex items-center justify-between gap-2 rounded-md border border-pb_lightgray shadow-sm select-none px-3 py-1 ${className}`.trim()}
    >
      <span className="text-sm font-semibold text-left text-pb_darkgray truncate w-52">
        {rankingName}
      </span>
      <div className="flex items-center gap-1">
        <ChevronsUpDown className="w-4 h-4 text-pb_darkgray" />
        <ClipboardList className="w-5 h-5 text-pb_darkgray" />
      </div>
    </button>
  );
} 