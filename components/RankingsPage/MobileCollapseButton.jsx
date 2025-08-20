'use client';

import { ArrowUpNarrowWideIcon, Loader2 } from 'lucide-react';
import React from 'react';

const MobileCollapseButton = ({ onClick, isCollapsing, title }) => {
    return (
        <button
            onClick={onClick}
            disabled={isCollapsing}
            className="px-2.5 py-2 bg-bg-surface-800 text-white hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            title={title || "Collapse/Expand All Rows"}
        >
            {isCollapsing ? (
                <Loader2 className="animate-spin h-5 w-5" />
            ) : (
                <ArrowUpNarrowWideIcon className="h-5 w-5" />
            )}
        </button>
    );
};

export default MobileCollapseButton; 