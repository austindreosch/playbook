import { Dna } from 'lucide-react';

export default function TeamArchetypeBlock() {
  return (
    <div className={`w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <Dna className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Team Archetype</h3>
      </div>
      {/* TODO: Implement TeamArchetypeBlock content */}
    </div>
  );
} 