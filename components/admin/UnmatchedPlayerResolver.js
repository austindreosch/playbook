'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

// TODO: Debounce search input if desired

export default function UnmatchedPlayerResolver({ player, sport, rankingDocId, onPlayerLinked }) {
    const [searchTerm, setSearchTerm] = useState(player.name); // Default search to the unmatched name
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return; // Don't search if empty

        setIsLoading(true);
        setError(null);
        setSearchResults([]);

        try {
            // Construct search URL
            const params = new URLSearchParams({ name: searchTerm.trim(), sport });
            const response = await fetch(`/api/players/search?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to fetch (${response.status})`);
            }

            setSearchResults(data.players || []);
             if (!data.players || data.players.length === 0) {
                 setError('No players found matching the search term.');
            }

        } catch (err) {
            console.error("Search error:", err);
            setError(err.message);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLink = async (selectedPlayerId) => {
        setIsLoading(true); 
        setError(null); 

        try {
            let response;
            let data;

            if (rankingDocId) {
                // --- Original Logic: Link and update ranking doc --- 
                console.log("Calling link-player API with data:", {
                    unmatchedName: player.name,
                    unmatchedRank: player.userRank,
                    selectedPlayerId: selectedPlayerId,
                    rankingDocId: rankingDocId
                });
                response = await fetch('/api/admin/link-player', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        unmatchedName: player.name,
                        unmatchedRank: player.userRank,
                        selectedPlayerId: selectedPlayerId,
                        rankingDocId: rankingDocId
                    }),
                });
                data = await response.json();
                 if (!response.ok) {
                     throw new Error(data.message || `Failed to link player (${response.status})`);
                 }
                 console.log(`Successfully linked '${player.name}' to ID ${selectedPlayerId} and updated ranking doc.`);
                 alert(`Successfully linked '${player.name}' to ID ${selectedPlayerId}`); 

            } else {
                // --- New Logic: Just add name variant --- 
                console.log("Calling add-name-variant API...");
                 response = await fetch('/api/admin/add-name-variant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        playerId: selectedPlayerId,
                        newNameVariant: player.name // The original unmatched name
                    }),
                 });
                 data = await response.json();
                 if (!response.ok) {
                     throw new Error(data.message || `Failed to add name variant (${response.status})`);
                 }
                 console.log(`Successfully added '${player.name}' as variant to player ID ${selectedPlayerId}.`);
                 alert(`Successfully added '${player.name}' as variant. Player will be matched on next sync.`);
            }

            // Link/Variant add successful!
            // Call the callback to remove this item from the parent list
            if (onPlayerLinked) {
                onPlayerLinked(player.name); 
            }

        } catch (err) {
            console.error("Link/Variant Add error:", err);
            setError(`Operation failed: ${err.message}`); 
        } finally {
             setIsLoading(false); 
        }
    };

    const handleCreateProspect = async () => {
        // Confirm with the user
        const confirmMessage = rankingDocId 
            ? `Create a new prospect player entry for '${player.name}' and link it?`
            : `Create a new prospect player entry for '${player.name}'? (Linking will occur on next ranking sync)`;
        const confirmed = confirm(confirmMessage);
        if (!confirmed) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/create-prospect-player', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prospectName: player.name,
                    sport: sport,
                    // Only include these if rankingDocId is present
                    ...(rankingDocId && { 
                        unmatchedRank: player.userRank,
                        rankingDocId: rankingDocId 
                    })
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to create prospect (${response.status})`);
            }

            // Adjust success message based on response
            console.log(`Create prospect response:`, data);
            alert(data.message || `Successfully created prospect '${player.name}'.`); 
            
            // Call the callback to remove this item from the parent list
            if (onPlayerLinked) {
                onPlayerLinked(player.name); 
            }

        } catch (err) {
            console.error("Create prospect error:", err);
            setError(`Create failed: ${err.message}`); 
        } finally {
             setIsLoading(false); 
        }
    };

    return (
        <li className="py-4 px-3 border-b last:border-b-0 bg-white rounded shadow-sm space-y-2">
            <div>
                <span className="text-xs font-medium">
                    Rank {player.userRank}: <span className="text-blue-700 font-semibold">{player.name}</span>
                </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search DB name..."
                    className="h-6 text-xs flex-grow min-w-[150px]"
                />
                <Button onClick={handleSearch} disabled={isLoading} className="h-6 px-2 py-1 text-xs whitespace-nowrap">
                    {isLoading ? '...' : 'Search DB'}
                </Button>
                <Button 
                    onClick={handleCreateProspect} 
                    disabled={isLoading} 
                    variant="outline" 
                    className="h-6 px-2 py-1 text-xs border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 whitespace-nowrap"
                >
                    + Create Prospect
                </Button>
            </div>
           
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            {searchResults.length > 0 && (
                <div className="mt-2 pl-1">
                    <p className="text-xs font-semibold mb-1">Potential Matches:</p>
                    <ul className="text-xs list-none space-y-1">
                        {searchResults.map((p) => (
                            <li key={p._id} className="flex items-center justify-between gap-2 bg-gray-50 p-1 rounded">
                                <span className="text-xs">{p.primaryName} <span className='text-gray-500'>(ID: ...{p._id.slice(-6)})</span></span>
                                <Button
                                    variant="link"
                                    className="h-auto px-1 py-0 text-xs text-blue-600 hover:text-blue-800"
                                    onClick={() => handleLink(p._id)}
                                >
                                    Link
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
} 