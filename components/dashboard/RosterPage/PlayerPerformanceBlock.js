'use client';

import { SigmaSquare } from 'lucide-react';

export default function PlayerPerformanceBlock() {
  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3">
        <div className="flex items-center gap-2 mb-2">
            <SigmaSquare className="w-icon h-icon text-pb_darkgray" />
            <h3 className="text-sm font-semibold text-pb_darkgray">Performance</h3>
        </div>
        {/* Content for PlayerPerformanceBlock will go here */}
    </div>
  );
} 