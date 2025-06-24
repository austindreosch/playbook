import { Dna } from 'lucide-react';

export default function TeamArchetypeBlock() {
  return (
    <div className={`w-full h-full rounded-lg border-1.5 border-pb_lightgray shadow-sm p-4`}>
      <div className="flex items-center gap-3 mb-2">
        <Dna className="w-5 h-5 text-pb_darkgray" />
        <h3 className="font-semibold text-pb_darkgray">Team Archetype</h3>
      </div>
      {/* TODO: Implement TeamArchetypeBlock content */}
    </div>
  );
} 