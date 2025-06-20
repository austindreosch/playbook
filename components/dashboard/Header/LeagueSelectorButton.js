import { basketball } from "@lucide/lab";
import { BookCopy, ChevronsUpDown, createLucideIcon } from 'lucide-react';
const Basketball = createLucideIcon('basketball', basketball);

export default function LeagueSelectorButton({ leagueName = 'League Name', className = "" }) {
  return (
    <button
      className={`flex items-center justify-between px-3 rounded-md border border-pb_lightgray bg-pb_lightestgray shadow-sm select-none ${className}`.trim()}
    >
      <div className="flex items-center gap-3">
        <Basketball className="w-5 h-5 text-pb_darkgray" />
        <span className="text-sm font-semibold text-pb_darkgray truncate text-left w-52">{leagueName}</span>
      </div>
      <div className="flex items-center gap-2">
        <ChevronsUpDown className="w-4 h-4 text-pb_darkgray" />
        <BookCopy className="w-5 h-5 text-pb_darkgray" />
      </div>
    </button>
  );
} 