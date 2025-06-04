'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Example using ShadCN Card
import { useState } from 'react';
import UnmatchedPlayerResolver from './UnmatchedPlayerResolver'; // Import the new component

// Define known CSV files and their metadata
// TODO: Move this to a config file or fetch dynamically if needed
const CSV_RANKING_SOURCES = [
    { id: 'mlb_dyn_cat', label: 'MLB Dynasty Categories', filePath: 'public/docs/mlb_dynasty_categories_rankings.csv', sport: 'mlb', format: 'dynasty', scoringType: 'categories' },
    { id: 'mlb_dyn_pts', label: 'MLB Dynasty Points', filePath: 'public/docs/mlb_dynasty_points_rankings.csv', sport: 'mlb', format: 'dynasty', scoringType: 'points' },
    { id: 'mlb_red_cat', label: 'MLB Redraft Categories', filePath: 'public/docs/mlb_redraft_categories_rankings.csv', sport: 'mlb', format: 'redraft', scoringType: 'categories' },
    { id: 'mlb_red_pts', label: 'MLB Redraft Points', filePath: 'public/docs/mlb_redraft_points_rankings.csv', sport: 'mlb', format: 'redraft', scoringType: 'points' },
    { id: 'nba_dyn_cat', label: 'NBA Dynasty Categories', filePath: 'public/docs/nba_dynasty_categories_rankings.csv', sport: 'nba', format: 'dynasty', scoringType: 'categories' },
    { id: 'nba_dyn_pts', label: 'NBA Dynasty Points', filePath: 'public/docs/nba_dynasty_points_rankings.csv', sport: 'nba', format: 'dynasty', scoringType: 'points' },
    { id: 'nba_red_cat', label: 'NBA Redraft Categories', filePath: 'public/docs/nba_redraft_categories_rankings.csv', sport: 'nba', format: 'redraft', scoringType: 'categories' },
    { id: 'nba_red_pts', label: 'NBA Redraft Points', filePath: 'public/docs/nba_redraft_points_rankings.csv', sport: 'nba', format: 'redraft', scoringType: 'points' },
    // --- Example NFL CSV entry (if you add one later) ---
    // { id: 'nfl_dyn_sf_1ppr', label: 'NFL Dynasty SF 1PPR', filePath: 'public/docs/nfl_dynasty_sf_1ppr.csv', sport: 'nfl', format: 'dynasty', scoringType: 'points', flexSetting: 'superflex', pprSetting: '1ppr'},
];

// Helper to detect duplicates by name
function detectDuplicates(players) {
    const nameMap = new Map();
    for (const player of players) {
        const name = player.name || player.fullName;
        if (!name) continue;
        if (!nameMap.has(name)) nameMap.set(name, []);
        nameMap.get(name).push(player);
    }
    return Array.from(nameMap.entries())
        .filter(([name, arr]) => arr.length > 1)
        .map(([name, arr]) => ({ name, players: arr }));
}

// DuplicatePlayerResolver component
function DuplicatePlayerResolver({ duplicates, onDelete, onConfirm }) {
    return (
        <div className="mt-4 p-4 border rounded bg-yellow-50">
            <h3 className="font-bold mb-2 text-yellow-800">Duplicate Players Detected</h3>
            {duplicates.map(group => (
                <div key={group.name} className="mb-4">
                    <h4 className="font-semibold">{group.name}</h4>
                    {group.players.map((player, idx) => (
                        <div key={player.id || idx} className="flex items-center space-x-2 mb-1 text-xs">
                            <span className="font-semibold mr-1">Rk: {player.userRank || 'N/A'} |</span>
                            <span className="mr-1">Matched ID: {player.matched && player.id ? player.id : 'Unmatched'} |</span>
                            <button className="text-red-600 underline" onClick={() => onDelete(player, group.name)}>Delete</button>
                            <button className="text-blue-600 underline" onClick={() => onConfirm(player, group.name)}>Confirm as Different</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// Single sync button component to avoid repetition
function SyncCsvButton({ source }) {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [unmatchedList, setUnmatchedList] = useState([]); // State for unmatched players
    const [rankingDocId, setRankingDocId] = useState(null); // State for the created ranking doc ID
    const [importedPlayers, setImportedPlayers] = useState([]); // Store imported players for duplicate detection
    const [duplicates, setDuplicates] = useState([]); // Store detected duplicates

    const handleSync = async () => {
        setIsLoading(true);
        setStatusMessage(null);
        setIsError(false);
        setUnmatchedList([]); // Clear previous list on new sync
        setRankingDocId(null); // Clear previous doc ID

        const body = {
            relativeFilePath: source.filePath,
            sport: source.sport,
            format: source.format,
            scoringType: source.scoringType,
            // Add NFL settings if they exist for this source
            ...(source.sport === 'nfl' && { flexSetting: source.flexSetting, pprSetting: source.pprSetting })
        };

        try {
            const response = await fetch('/api/admin/syncCsvRankingsRoute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body), 
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error ${response.status}`);

            const details = data.details || {}; // Get details object safely

            // --- Duplicate detection logic ---
            if (details.players && Array.isArray(details.players)) {
                setImportedPlayers(details.players);
                const dups = detectDuplicates(details.players);
                setDuplicates(dups);
            } else {
                setImportedPlayers([]);
                setDuplicates([]);
            }

            if (details.errors?.length > 0) {
                setStatusMessage(`Completed with ${details.errors.length} errors.`);
                setIsError(true);
                setUnmatchedList([]); // Clear list on error
                setRankingDocId(null); // Clear doc ID on error
            } else {
                // Include version in success message if available
                const versionInfo = details.metadata?.version ? ` (Version: ${details.metadata.version})` : '';
                setStatusMessage(`Sync successful! Matched: ${details.matchedPlayers}, Unmatched: ${details.unmatchedPlayers?.length}${versionInfo}. Doc ID: ${details.newRankingDocId}`);
                setIsError(false);
                setUnmatchedList(details.unmatchedPlayers || []); // Store unmatched list
                setRankingDocId(details.newRankingDocId); // Store the ranking doc ID
            }
        } catch (error) {
            setStatusMessage(`Error: ${error.message}`);
            setIsError(true);
            setUnmatchedList([]); // Clear list on error
            setRankingDocId(null); // Clear doc ID on error
            setImportedPlayers([]);
            setDuplicates([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to remove a player from the list after linking
    const handlePlayerLinked = (linkedPlayerName) => {
        setUnmatchedList(currentList => 
            currentList.filter(p => p.name !== linkedPlayerName)
        );
    };

    // Handle delete/confirm actions for duplicates
    const handleDeleteDuplicate = async (playerToDelete, groupName) => {
        // Call backend to remove from ranking doc
        await fetch('/api/admin/deleteRankingPlayer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rankingDocId, // from your state
                playerId: playerToDelete.id || playerToDelete.playerId,
            }),
        });
        // Then update local state as before
        setImportedPlayers(players => players.filter(p => p !== playerToDelete));
        setDuplicates(dups => dups.map(group =>
            group.name === groupName
                ? { ...group, players: group.players.filter(p => p !== playerToDelete) }
                : group
        ).filter(group => group.players.length > 1));
    };
    const handleConfirmDuplicate = (playerToConfirm, groupName) => {
        // Just mark as resolved for now (remove from duplicates UI, keep in importedPlayers)
        setDuplicates(dups => dups.map(group =>
            group.name === groupName
                ? { ...group, players: group.players.filter(p => p !== playerToConfirm) }
                : group
        ).filter(group => group.players.length > 1));
    };

    return (
         <div className="flex flex-col items-start space-y-1 mt-2">
            <Button onClick={handleSync} disabled={isLoading} variant="secondary" size="sm">
                 {isLoading ? 'Syncing...' : 'Sync Now'}
            </Button>
             {statusMessage && (
                <p className={`text-xs ${isError ? 'text-red-600' : 'text-green-600'}`}>{statusMessage}</p>
             )}
             {/* Display Unmatched Players List */}
             {unmatchedList.length > 0 && (
                 <div className="mt-2 w-full border-t pt-2">
                    <p className="text-xs font-semibold mb-1">Unmatched Players ({unmatchedList.length}):</p>
                    {/* Use an ordered list for semantic ranking, style similarly */}
                    <ul className="text-xs space-y-1 max-h-96 overflow-y-auto bg-gray-50 p-1 rounded">
                        {unmatchedList.map((player) => (
                           <UnmatchedPlayerResolver 
                                key={`${player.rank}-${player.name}`} // More stable key
                                player={player} 
                                sport={source.sport} // Pass sport down
                                rankingDocId={rankingDocId} // Pass down the ranking doc ID
                                onPlayerLinked={handlePlayerLinked} // Pass down the removal function
                           />
                        ))}
                    </ul>
                 </div>
             )}
             {/* Display Duplicate Players Resolver */}
             {duplicates.length > 0 && (
                 <DuplicatePlayerResolver 
                    duplicates={duplicates} 
                    onDelete={handleDeleteDuplicate} 
                    onConfirm={handleConfirmDuplicate} 
                 />
             )}
        </div>
    );
}


// Main component to display the list
export default function CsvRankingsSyncManager() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sync CSV Rankings</CardTitle>
                <CardDescription>Process local CSV ranking files and store them.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Use grid for better layout */}
                {CSV_RANKING_SOURCES.map((source) => (
                    <div key={source.id} className="p-3 border rounded-md flex flex-col justify-between"> {/* Basic card styling */}
                        <div>
                            <p className="font-medium">{source.label}</p>
                            <p className="text-xs text-muted-foreground">{source.filePath}</p>
                            {/* Version display could go here if pre-fetched */}
                        </div>
                        <SyncCsvButton source={source} />
                    </div>
                ))}
                 {CSV_RANKING_SOURCES.length === 0 && <p>No CSV sources configured.</p>}
            </CardContent>
        </Card>
    );
} 