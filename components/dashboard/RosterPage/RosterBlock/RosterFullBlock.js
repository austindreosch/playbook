'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { getSportCategories, getSportConfig } from '@/lib/utils/sportConfig';
import { useMemo, useState } from 'react';
import RosterHeader from './RosterHeader';
import RosterPlayerRow from './RosterPlayerRow';

// Main Component
export default function RosterFullBlock() {
  const { getCurrentLeague } = useDashboardContext();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  
  const currentLeague = getCurrentLeague();
  
  // Get sport-specific categories - use league categories if available, otherwise sport defaults
  const categories = useMemo(() => {
    if (!currentLeague?.leagueDetails?.sport) return [];
    return getSportCategories(
      currentLeague.leagueDetails.sport,
      currentLeague.leagueDetails.categories // TODO: Replace with actual league categories from API
    );
  }, [currentLeague?.leagueDetails?.sport, currentLeague?.leagueDetails?.categories]);
  
  // Get sport configuration for display
  const sportConfig = useMemo(() => {
    if (!currentLeague?.leagueDetails?.sport) return getSportConfig('nba'); // Default fallback
    return getSportConfig(currentLeague.leagueDetails.sport);
  }, [currentLeague?.leagueDetails?.sport]);
  
  // Get players - now works for all sports
  const players = useMemo(() => {
    if (!currentLeague) return [];
    return currentLeague.players || [];
  }, [currentLeague]);

  // Sort players
  const sortedPlayers = useMemo(() => {
    if (!sortConfig.key) {
      return [...players];
    }
    
    return [...players].sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'zScoreSum') {
        aValue = a.stats?.zScoreSum || 0;
        bValue = b.stats?.zScoreSum || 0;
      } else {
        aValue = a.stats?.[sortConfig.key] || 0;
        bValue = b.stats?.[sortConfig.key] || 0;
      }
      
      if (sortConfig.direction === 'desc') {
        return bValue - aValue;
      }
      return aValue - bValue;
    });
  }, [players, sortConfig]);

  const handleSort = (category) => {
    if (category === null) {
      // Reset to default ranking order
      setSortConfig({ key: null, direction: 'desc' });
      return;
    }
    
    setSortConfig(prev => ({
      key: category,
      direction: prev.key === category && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const toggleRowExpansion = (playerIndex) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerIndex)) {
        newSet.delete(playerIndex);
      } else {
        newSet.add(playerIndex);
      }
      return newSet;
    });
  };

  if (!currentLeague || !currentLeague.leagueDetails?.sport) {
    return (
      <div className="w-full h-full bg-bg-weak-50 rounded-lg border-1.5 border-stroke-soft-200 shadow-inner flex items-center justify-center">
        <div className="text-center text-text-sub-600">
          <p className="text-lg font-semibold mb-2">No Roster Available</p>
          <p className="text-sm">Please select a league to view your roster</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-0 bg-white flex flex-col gap-1">
      {/* Header exactly matching RankingsPlayerListHeader */}
      <RosterHeader 
        categories={categories} 
        onSort={handleSort} 
        sortConfig={sortConfig} 
      />
      
      {/* Player List exactly matching RankingsPlayerListContainer structure */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5">
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((player, index) => (
            <RosterPlayerRow
              key={player.name || index}
              player={player}
              rank={index + 1}
              categories={categories}
              isExpanded={expandedRows.has(index)}
              onToggleExpand={() => toggleRowExpansion(index)}
              rowIndex={index}
            />
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">
            No players found in this roster
          </div>
        )}
      </div>
    </div>
  );
} 