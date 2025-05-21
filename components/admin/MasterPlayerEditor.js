'use client';

import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';

// TODO: Define more specific types based on actual data structure for better intellisense and type checking
// interface Player {
//   _id: string;
//   sport: string; 
//   nameVariants: string[];
//   position?: string;
//   primaryFirstName?: string;
//   primaryLastName?: string;
//   primaryName?: string;
//   teamId?: number | string; 
//   teamName?: string;
//   [key: string]: any;
// }

export default function MasterPlayerEditor() {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [newNameVariant, setNewNameVariant] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/players/master');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
          throw new Error(errorData.message);
        }
        const data = await response.json();
        setPlayers(data);
      } catch (e) {
        console.error("Failed to fetch players:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const fuse = useMemo(() => {
    if (players.length > 0) {
      return new Fuse(players, {
        keys: [
          'primaryName',
          'primaryFirstName',
          'primaryLastName',
          'nameVariants',
          'sport',
          'teamName',
          // TODO: Consider adding provider-specific IDs if they become searchable, e.g., 'mySportsFeeds.id'
        ],
        threshold: 0.3,
        includeScore: true,
      });
    }
    return null;
  }, [players]);

  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) {
      return players;
    }
    if (fuse) {
      return fuse.search(searchTerm).map(result => result.item);
    }
    return players;
  }, [searchTerm, players, fuse]);

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    setEditFormData(JSON.parse(JSON.stringify(player))); // Deep copy for editing
    setNewNameVariant('');
    setError(null); // Clear previous save errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameVariantAdd = () => {
    if (newNameVariant.trim() && editFormData && !editFormData.nameVariants.includes(newNameVariant.trim())) {
      setEditFormData(prev => ({
        ...prev,
        nameVariants: [...(prev.nameVariants || []), newNameVariant.trim()]
      }));
      setNewNameVariant('');
    }
  };

  const handleNameVariantRemove = (variantToRemove) => {
    setEditFormData(prev => ({
      ...prev,
      nameVariants: prev.nameVariants.filter(v => v !== variantToRemove)
    }));
  };

  const handleSaveChanges = async () => {
    if (!editFormData || !selectedPlayer) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/players/master/${selectedPlayer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message);
      }
      const updatedPlayer = await response.json();
      
      setPlayers(prevPlayers => prevPlayers.map(p => (p._id === updatedPlayer._id ? updatedPlayer : p)));
      setSelectedPlayer(updatedPlayer);
      setEditFormData(JSON.parse(JSON.stringify(updatedPlayer)));
      alert('Player updated successfully!');

    } catch (e) {
      console.error('Failed to save player changes:', e);
      setError(e.message);
      alert(`Error saving player: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !players.length && !error) {
    return <div className="p-4 text-center">Loading players...</div>;
  }

  if (error && !players.length) {
    return <div className="p-4 text-center text-red-500">Error fetching players: {error}</div>;
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 h-full bg-gray-100">
      {/* Player List and Search */}
      <div className="md:w-1/3 border rounded-lg p-4 bg-white shadow-lg h-[calc(100vh-6rem)] flex flex-col">
        <input
          type="text"
          placeholder="Search players (Name, Sport, Team...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 sticky top-0 bg-white z-10 shadow-sm"
        />
        {isLoading && players.length > 0 && <p className="text-sm text-gray-500 mb-2">Updating list...</p>}
        <ul className="space-y-2 overflow-y-auto flex-grow">
          {filteredPlayers.map((player) => (
            <li
              key={player._id}
              onClick={() => handleSelectPlayer(player)}
              className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${selectedPlayer?._id === player._id ? 'bg-blue-100 ring-2 ring-blue-500' : 'border border-gray-200'}`}
            >
              <div className="font-semibold text-gray-800">{player.primaryName || `${player.primaryFirstName || ''} ${player.primaryLastName || ''}`.trim()}</div>
              <div className="text-xs text-gray-500">
                {/* TODO: Sport specific labels or icons */}
                {player.sport?.toUpperCase()} {player.teamName && `- ${player.teamName}`} {player.position && `- ${player.position}`}
              </div>
            </li>
          ))}
          {!filteredPlayers.length && !isLoading && <li className="text-gray-500 p-2">No players found for your search.</li>}
          {filteredPlayers.length === 0 && players.length > 0 && searchTerm && <li className="text-gray-500 p-2">No players match &quot;{searchTerm}&quot;.</li>}
           {players.length === 0 && !isLoading && <li className="text-gray-500 p-2">No players loaded.</li>}
        </ul>
      </div>

      {/* Player Edit Form */}
      <div className="md:w-2/3 border rounded-lg p-6 bg-white shadow-lg h-[calc(100vh-6rem)] overflow-y-auto">
        {selectedPlayer && editFormData ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Player: <span className="text-indigo-600">{selectedPlayer.primaryName}</span></h2>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">Error: {error}</div>}
            <div className="space-y-5">
              {/* General Info Fields */}
              {[ 
                { label: 'Primary Name', name: 'primaryName' },
                { label: 'Primary First Name', name: 'primaryFirstName' },
                { label: 'Primary Last Name', name: 'primaryLastName' },
                // TODO: Convert sport to a select: NBA, NFL, MLB (sport-agnostic rule)
                { label: 'Sport', name: 'sport' /*, type: 'select', options: ['nba', 'nfl', 'mlb'] */ }, 
                // TODO: Position could be sport-specific dropdown (sport-agnostic rule)
                { label: 'Position', name: 'position' }, 
                { label: 'Team Name', name: 'teamName' },
                { label: 'Team ID', name: 'teamId' }
              ].map(field => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input 
                    type="text" 
                    name={field.name} 
                    id={field.name} 
                    value={editFormData[field.name] || ''} 
                    onChange={handleInputChange} 
                    className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                  />
                </div>
              ))}
              
              {/* Name Variants */}
              <div className="pt-4 border-t border-gray-200 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Name Variants</h3>
                {editFormData.nameVariants && editFormData.nameVariants.length > 0 ? (
                  <ul className="space-y-2 mb-3">
                    {editFormData.nameVariants.map((variant, index) => (
                      <li key={index} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-md border border-gray-200 text-sm">
                        <span className="text-gray-700">{variant}</span>
                        <button type="button" onClick={() => handleNameVariantRemove(variant)} className="text-red-500 hover:text-red-700 font-medium text-xs p-1 hover:bg-red-100 rounded">Remove</button>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-500 mb-3">No name variants defined.</p>}
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={newNameVariant}
                    onChange={(e) => setNewNameVariant(e.target.value)}
                    placeholder="Add new name variant"
                    className="flex-grow p-2.5 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-white"
                  />
                  <button type="button" onClick={handleNameVariantAdd} className="p-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium whitespace-nowrap">Add Variant</button>
                </div>
              </div>

              {/* TODO: Add editable fields for provider-specific data if needed (e.g., mySportsFeeds, fantrax objects) */}
              {/* This might involve a more dynamic form generation approach for nested objects. */}

              {/* Action Buttons */}
              <div className="pt-8 flex justify-end space-x-3 border-t border-gray-200 mt-8">
                <button 
                    type="button" 
                    onClick={() => handleSelectPlayer(selectedPlayer)} // Resets form to selected player's current state
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel / Reset Form
                </button>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select a player from the list to view or edit details.</p>
          </div>
        )}
      </div>
    </div>
  );
} 