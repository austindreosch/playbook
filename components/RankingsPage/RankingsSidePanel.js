'use client';

import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { useState } from 'react';

const SimpleRankingsSelector = ({ activeSheet = 'NBA_Dynasty', onSelectSheet }) => {
    // Available sheets
    const sheets = [
        { id: 'NBA_Dynasty', name: 'NBA Dynasty Sheet', sport: 'NBA', type: 'DYNASTY', categories: 'CATEGORIES', date: '1/18/25', icon: '🏀' },
        { id: 'NFL_Redraft', name: 'Football Redraft 2025', sport: 'NFL', type: 'REDRAFT', categories: 'POINTS', date: '3/24/25', icon: '🏈' },
        { id: 'MLB_Dynasty', name: 'Baseball Dynasty League', sport: 'MLB', type: 'DYNASTY', categories: 'CATEGORIES', date: '2/21/25', icon: '⚾' },
        { id: 'NBA_Redraft', name: 'Basketball 2025', sport: 'NBA', type: 'REDRAFT', categories: 'CATEGORIES', date: '1/18/25', icon: '🏀' },
    ];

    // Handle sheet selection
    const handleSelectSheet = (sheetId) => {
        if (onSelectSheet) {
            onSelectSheet(sheetId);
        }
    };

    return (
        <div className="rankings-selector max-w-24 rounded-lg">

            {/* Add New Button */}
            <div className="p-3 bg-gray-100 rounded-md mb-2 border border-gray-200">
                <button className="w-full p-3 bg-white rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Sheets List */}
            <div className="space-y-1">

                {sheets.map(sheet => (

                    <div
                        key={sheet.id}
                        className={`
                        grid grid-cols-[18px_1fr] rounded-md overflow-hidden cursor-pointer
                        ${activeSheet === sheet.id
                                ? 'bg-pb_blue text-white'
                                : 'bg-pb_lightergray hover:bg-gray-100 border border-gray-100'
                            }
                        `}
                        onClick={() => handleSelectSheet(sheet.id)}
                    >
                        <div className={`${activeSheet === sheet.id ? 'bg-pb_orange' : 'bg-pb_lightgray'}`} />
                        <div className="p-3">
                            <div className={`text-lg font-bold ${activeSheet === sheet.id ? 'text-white' : 'text-pb_darkgray'}`}>{sheet.name}</div>

                            <div className="text-2xs mt-1 flex justify-between items-center tracking-wider">
                                <div className={activeSheet === sheet.id ? 'text-white' : 'text-pb_midgray'}>
                                    {sheet.sport} • {sheet.type} • {sheet.categories}
                                </div>
                                <div className={activeSheet === sheet.id ? 'text-white' : 'text-pb_midgray'}>
                                    <HistoryIcon className="w-2 h-2 inline-block mr-1" /> {sheet.date}
                                </div>
                            </div>
                        </div>
                    </div>


                ))}
            </div>
        </div>
    );
};

export default SimpleRankingsSelector;