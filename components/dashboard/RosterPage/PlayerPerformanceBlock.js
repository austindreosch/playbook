'use client';

import { SigmaSquare } from 'lucide-react';

export default function PlayerPerformanceBlock() {
  return (
    <div className="w-full h-full rounded-lg border-1.5 border-pb_lightgray shadow-sm p-4">
        <div className="flex items-center gap-3 mb-2">
            <SigmaSquare className="w-5 h-5 text-pb_darkgray" />
            <h3 className="font-semibold text-pb_darkgray">Performance</h3>
        </div>
        {/* Content for PlayerPerformanceBlock will go here */}
    </div>
  );
} 