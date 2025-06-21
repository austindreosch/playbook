import { Notebook } from 'lucide-react';

export default function AllLeaguesButton({ className = "" }) {
  return (
    <button
      className={`flex items-center justify-between px-3 gap-3 rounded-md border border-pb_lightgray bg-white hover:bg-pb_lightestgray shadow-sm select-none ${className}`.trim()}
    >
      <Notebook className="w-5 h-5 text-pb_darkgray" />
      <span className="text-sm font-semibold text-pb_darkgray text-left pr-0.5 hidden xl:inline">All Leagues</span>
    </button>
  );
} 