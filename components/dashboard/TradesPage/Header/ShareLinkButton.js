'use client';

import { Link } from 'lucide-react';

const ShareLinkButton = ({ className }) => {
  return (
    <button
      className={`
        flex items-center justify-center rounded-md border shadow-sm select-none 
        px-2.5 py-1 transition-colors
        border-stroke-soft-200 bg-white hover:bg-stroke-soft-50
        ${className}`.trim().replace(/\s+/g, ' ')}
    >
      <Link className="w-icon h-icon text-bg-surface-800" />
    </button>
  );
};

export default ShareLinkButton; 