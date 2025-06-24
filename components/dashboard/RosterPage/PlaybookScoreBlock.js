'use client';

import { Compass } from 'lucide-react';

export default function PlaybookScoreBlock() {
  return (
    <div className="w-full h-full rounded-lg border-1.5 border-pb_lightgray shadow-sm p-4">
        <div className="flex items-center gap-3 mb-2">
            <Compass className="w-5 h-5 text-pb_darkgray" />
            <h3 className="font-semibold text-pb_darkgray">Playbook Score</h3>
        </div>
      {/* Content for PlaybookScoreBlock will go here */}
    </div>
  );
} 