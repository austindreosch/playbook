'use client';

import { useState } from 'react';

const SimpleRankingsSelector = ({ activeSheet = 'NBA_Dynasty', onSelectSheet }) => {
    // Available sheets
    const sheets = [
        { id: 'NBA_Dynasty', name: 'NBA Dynasty Sheet', sport: 'NBA', type: 'DYNASTY', categories: 'CATEGORIES', date: '1/18/2025', icon: '🏀' },
        { id: 'NFL_Redraft', name: 'Football Redraft 2025', sport: 'NFL', type: 'REDRAFT', categories: 'POINTS', date: '3/24/2025', icon: '🏈' },
        { id: 'MLB_Dynasty', name: 'Baseball Dynasty League', sport: 'MLB', type: 'DYNASTY', categories: 'CATEGORIES', date: '2/21/2025', icon: '⚾' },
        { id: 'NBA_Redraft', name: 'Basketball 2025', sport: 'NBA', type: 'REDRAFT', categories: 'CATEGORIES', date: '1/18/2025', icon: '🏀' },
    ];

    // Handle sheet selection
    const handleSelectSheet = (sheetId) => {
        if (onSelectSheet) {
            onSelectSheet(sheetId);
        }
    };

    return (
        <div className="rankings-selector max-w-24 p-3 bg-gray-50 rounded-lg">

            {/* Add New Button */}
            <button className="w-full p-3 mb-3 bg-white rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Sheets List */}
            <div className="space-y-2">
                {sheets.map(sheet => (
                    <div
                        key={sheet.id}
                        className={`p-3 rounded-md cursor-pointer ${activeSheet === sheet.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white hover:bg-gray-100'
                            }`}
                        onClick={() => handleSelectSheet(sheet.id)}
                    >
                        <div className="font-medium">{sheet.name}</div>
                        <div className="text-xs mt-1 flex justify-between items-center">
                            <div className={activeSheet === sheet.id ? 'text-blue-100' : 'text-gray-500'}>
                                {sheet.sport} • {sheet.type} • {sheet.categories}
                            </div>
                            <div className={activeSheet === sheet.id ? 'text-blue-100' : 'text-gray-500'}>
                                {sheet.date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleRankingsSelector;