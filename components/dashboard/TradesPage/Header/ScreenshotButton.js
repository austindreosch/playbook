'use client';

import { Camera } from 'lucide-react';

const ScreenshotButton = ({ className }) => {
  return (
    <button
      className={`
        flex items-center justify-center rounded-md border shadow-sm select-none 
        px-2.5 py-1 transition-colors
        border-pb_lightgray bg-white hover:bg-pb_lightestgray
        ${className}`.trim().replace(/\s+/g, ' ')}
    >
      <Camera className="w-icon h-icon text-pb_darkgray" />
    </button>
  );
};

export default ScreenshotButton; 