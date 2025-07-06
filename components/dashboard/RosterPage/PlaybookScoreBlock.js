'use client';

import { Compass } from 'lucide-react';

export default function PlaybookScoreBlock() {
  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3">
        <div className="flex items-center gap-2 mb-2">
            <Compass className="w-icon h-icon text-pb_darkgray" />
            <h3 className="text-sm font-semibold text-pb_darkgray">Playbook Score</h3>
        </div>
      {/* Content for PlaybookScoreBlock will go here */}
    </div>
  );
} 