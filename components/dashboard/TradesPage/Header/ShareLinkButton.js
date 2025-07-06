'use client';

import { Link } from 'lucide-react';

const ShareLinkButton = ({ className }) => {
  return (
    <button
      className={`
        flex items-center justify-center rounded-md border shadow-sm select-none 
        px-2.5 py-1 transition-colors
        border-pb_lightgray bg-white hover:bg-pb_lightestgray
        ${className}`.trim().replace(/\s+/g, ' ')}
    >
      <Link className="w-icon h-icon text-pb_darkgray" />
    </button>
  );
};

export default ShareLinkButton; 