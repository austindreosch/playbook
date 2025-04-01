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

            {/* Sheets List */}
            <div className="space-y-1">
                {sheets.map(sheet => (
                    <div
                        key={sheet.id}
                        className={`
                        grid grid-cols-[18px_1fr] rounded-md overflow-hidden cursor-pointer
                        ${activeSheet === sheet.id
                                ? 'bg-pb_blue text-white shadow-sm'
                                : 'bg-white hover:bg-gray-100 border border-pb_lightgray shadow-sm'
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