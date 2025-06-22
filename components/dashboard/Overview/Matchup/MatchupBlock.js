import { Swords } from 'lucide-react';

export default function MatchupBlock({ className = '' }) {
  return (
    <div className={`w-full h-full rounded-lg border-1.5 border-pb_lightgray shadow-sm p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <Swords className="w-5 h-5 text-pb_darkgray" />
        <h3 className="font-semibold text-pb_darkgray">Matchup</h3>
      </div>
      {/* TODO: Implement MatchupBlock content */}
    </div>
  );
} 