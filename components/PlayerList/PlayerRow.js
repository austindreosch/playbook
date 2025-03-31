'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

const PlayerRow = ({ player, sport, categories }) => {
    const [expanded, setExpanded] = useState(false);

    // Set up the sortable hook
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.id });

    // Apply styles for dragging
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, };

    // Get the appropriate panel components based on the sport
    const getDetailPanel = () => {
        switch (sport) {
            case 'NBA':
                // You would import and use the actual component
                return <div className="detail-panel">NBA Detail Panel</div>;
            case 'MLB':
                return <div className="detail-panel">MLB Detail Panel</div>;
            case 'NFL':
                return <div className="detail-panel">NFL Detail Panel</div>;
            default:
                return <div className="detail-panel">Detail Panel</div>;
        }
    };

    const getInsightPanel = () => {
        switch (sport) {
            case 'NBA':
                return <div className="insight-panel">NBA Insight Panel</div>;
            case 'MLB':
                return <div className="insight-panel">MLB Insight Panel</div>;
            case 'NFL':
                return <div className="insight-panel">NFL Insight Panel</div>;
            default:
                return <div className="insight-panel">Insight Panel</div>;
        }
    };

    const leagueAverages = {
        fieldGoalPercentage: 47.5,
        threePointsMadePerGame: 2.5,
        freeThrowPercentage: 80.0,
        pointsPerGame: 45.0,
        assistsPerGame: 5.0,
        reboundsPerGame: 7.5,
        stealsPerGame: 1.2,
        blocksPerGame: 1.5,
        turnoversPerGame: 2.8
    };

    const getStatColor = (statValue, leagueAverage, statName) => {
        const isHigherBetter = statName !== 'turnoversPerGame';
        const percentDiff = ((statValue - leagueAverage) / leagueAverage) * 100;
        const adjustedDiff = isHigherBetter ? percentDiff : -percentDiff;

        // More granular steps, all using your theme colors
        if (adjustedDiff >= 30) return 'bg-pb_green';
        if (adjustedDiff >= 20) return 'bg-pb_green/90';
        if (adjustedDiff >= 15) return 'bg-pb_green/80';
        if (adjustedDiff >= 10) return 'bg-pb_green/70';
        if (adjustedDiff >= 5) return 'bg-pb_green/60';
        if (adjustedDiff >= 0) return 'bg-pb_green/50';
        if (adjustedDiff >= -5) return 'bg-pb_red/50';
        if (adjustedDiff >= -10) return 'bg-pb_red/60';
        if (adjustedDiff >= -15) return 'bg-pb_red/70';
        if (adjustedDiff >= -20) return 'bg-pb_red/80';
        if (adjustedDiff >= -30) return 'bg-pb_red/90';
        return 'bg-pb_red';
    };


    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`player-row border rounded-md overflow-hidden mb-2 shadow-sm ${isDragging ? 'z-10' : ''}`}
        >
            {/* -------------------------------------- */}
            {/* Basic player info row - always visible */}
            {/* -------------------------------------- */}
            <div
                className="flex h-9 items-center bg-white hover:bg-gray-50"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Left section with fixed widths */}
                <div className="flex items-center w-[40%]">
                    {/* Drag handle */}
                    <div
                        className="px-2 cursor-move text-gray-400"
                        {...attributes}
                        {...listeners}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                        </svg>
                    </div>

                    {/* Rank number */}
                    <div className="w-8 text-center">{player.id}</div>

                    {/* Player name and position */}
                    <div className="flex items-center gap-2">
                        <div className="font-bold">{player.name || 'Player Name'}</div>
                        <div className="text-gray-500 text-xs">{player.position}</div>
                    </div>
                </div>

                {/* Stats section - flexible width */}
                <div className="flex w-[60%] h-full gap-1"> {/* Added h-full here */}
                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.fieldGoalPercentage, leagueAverages.fieldGoalPercentage, 'fieldGoalPercentage')
                        }`}>
                        {player.stats.season.fieldGoalPercentage}
                    </div>

                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.threePointsMadePerGame, leagueAverages.threePointsMadePerGame, 'threePointsMadePerGame')
                        }`}>
                        {player.stats.season.threePointsMadePerGame}
                    </div>

                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.freeThrowPercentage, leagueAverages.freeThrowPercentage, 'freeThrowPercentage')
                        }`}>
                        {player.stats.season.freeThrowPercentage}
                    </div>

                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.pointsPerGame, leagueAverages.pointsPerGame, 'pointsPerGame')
                        }`}>
                        {player.stats.season.pointsPerGame}
                    </div>

                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.assistsPerGame, leagueAverages.assistsPerGame, 'assistsPerGame')
                        }`}>
                        {player.stats.season.assistsPerGame}
                    </div>

                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.reboundsPerGame, leagueAverages.reboundsPerGame, 'reboundsPerGame')
                        }`}>
                        {player.stats.season.reboundsPerGame}
                    </div>

                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.stealsPerGame, leagueAverages.stealsPerGame, 'stealsPerGame')
                        }`}>
                        {player.stats.season.stealsPerGame}
                    </div>

                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.blocksPerGame, leagueAverages.blocksPerGame, 'blocksPerGame')
                        }`}>
                        {player.stats.season.blocksPerGame}
                    </div>

                    <div className={`flex-1 text-center h-full flex items-center justify-center ${getStatColor(player.stats.season.turnoversPerGame, leagueAverages.turnoversPerGame, 'turnoversPerGame')
                        }`}>
                        {player.stats.season.turnoversPerGame}
                    </div>
                </div>
            </div>

            {/* Expanded content - only visible when expanded */}
            {expanded && (
                <div className="expanded-content border-t">
                    <div className="p-4">
                        {/* Render appropriate detail and insight panels */}


                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerRow;