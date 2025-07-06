import { Shield, Swords } from 'lucide-react';

export default function MatchupBlock() {
  return (
    <div className={`w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-2.5`}>
      <div className="flex items-center gap-2 mb-2">
        <Swords className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Matchup</h3>
      </div>
      {/* TODO: Implement MatchupBlock content */}
    </div>
  );
} 