'use client';

import { MoreHorizontal } from 'lucide-react';
import React from 'react';

const MobileHeaderOptionsButton = ({ onClick, title }) => {
    return (
        <button
            onClick={onClick}
            className="px-2.5 py-2 bg-bg-surface-800 text-white hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            title={title || "Header Options"}
        >
            <MoreHorizontal className="h-5 w-5" />
        </button>
    );
};

export default MobileHeaderOptionsButton; 