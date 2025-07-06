'use client';

import { ScanSearch } from 'lucide-react';

export default function PlayerProfileBlock() {
  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <ScanSearch className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Player Profile</h3>
      </div>
      {/* Content for PlayerProfileBlock will go here */}
    </div>
  );
} 