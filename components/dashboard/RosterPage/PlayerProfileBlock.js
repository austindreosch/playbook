'use client';

import TraitTagContainer from '@/components/common/TraitTagContainer';
import PlayerInfoSection from '@/components/dashboard/RosterPage/PlayerInfoSection';
import EmptyIcon from '@/components/icons/EmptyIcon';
import { Separator } from '@/components/ui/separator';
import { formatStatValue, getSportConfig, getSportPrimaryStats, getSportTraits } from '@/lib/utils/sportConfig';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { ScanSearch } from 'lucide-react';
import { useMemo } from 'react';
import HistoricalViewGraph from './HistoricalViewGraph';
import ValueComparisonTable from './ValueComparisonTable';

export default function PlayerProfileBlock() {
  const { getCurrentLeague, getSelectedPlayer } = useDashboardContext();
  const currentLeague = getCurrentLeague();
  const selectedPlayer = getSelectedPlayer();
  
  // Get sport configuration
  const sportConfig = useMemo(() => {
    const sport = currentLeague?.leagueDetails?.sport || 'nba';
    return getSportConfig(sport);
  }, [currentLeague?.leagueDetails?.sport]);
  
  const primaryStats = getSportPrimaryStats(currentLeague?.leagueDetails?.sport || 'nba');
  const sportTraits = getSportTraits(currentLeague?.leagueDetails?.sport || 'nba');
  
  // TODO: This data should come from selected player and be sport-agnostic
  // For now, using dummy data but structured to be easily replaceable
  const playerData = useMemo(() => {
    // If we have a selected player, use their data, otherwise use dummy data
    const dummyPlayer = {
      name: "Nikola Jokic",
      positionRank: "#2",
      positionColor: "#ababef", // TODO: Map position colors by sport
      position: "C", // TODO: This should be position abbreviation 
      image: "/avatar-default.png", // TODO: Use actual player headshots
    // Grid stats
    mpg: "31.3",
    team: "DEN", 
    age: "29",
    rosterPercentage: "84%",
    playoffScheduleGrade: "A-",
    stats: {
      // Use sport-specific primary stats from config
      primary: [
        ...primaryStats.slice(0, 3).map(stat => ({
          value: "27.6", // TODO: Replace with actual player stat value
          label: stat.label
        })),
        { value: "DEN", label: "Team" }
      ],
      secondary: [
        { value: "99%", label: "Health" },
        { value: "A+", label: "Grade" },
        { value: "H", label: "Trend", isPositive: true }
      ]
    },
    tags: {
      // Use sport-specific traits from config
      traitIds: [
        ...sportTraits
      ]
    },
    valueComparisons: [
      {
        type: "Playbook",
        value: 981,
        rank: 3,
        change: "+6%",
        changeType: "positive",
        subtitle: "Playbook Differential"
      },
      {
        type: "Standard", 
        value: 957,
        rank: 4,
        change: "2%",
        changeType: "negative",
        subtitle: "Value Over Last 30"
      },
      {
        type: "Redraft",
        value: 999,
        rank: 1,
        change: null,
        changeType: null,
        subtitle: null
      }
    ],
    historicalData: {
      currentView: "Stats", // "Stats" or "Value"
      dataPoints: [
        { period: 1, value: 120 },
        { period: 2, value: 95 },
        { period: 3, value: 145 },
        { period: 4, value: 130 }
      ],
      yAxisMin: 60,
      yAxisMax: 160
    }
  };
    
    // TODO: Replace dummy data with actual selected player data when available
    return selectedPlayer || dummyPlayer;
  }, [selectedPlayer, primaryStats, sportTraits]);











  

  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <ScanSearch className="icon-sm mdh:icon text-pb_darkgray" />
        <h3 className="text-xs mdh:text-sm font-semibold text-pb_darkgray">Player Profile</h3>
      </div>
      
      <div className="flex flex-col flex-1 min-h-0 gap-2">
        <div className="flex-shrink-0">
          <PlayerInfoSection playerData={playerData} />
        </div>
        <div className="flex-shrink-0">
          <TraitTagContainer traitIds={playerData.tags.traitIds} maxRows={3} className="" />
        </div>
        <div className="flex-shrink-0">
          <ValueComparisonTable valueComparisons={playerData.valueComparisons} />
        </div>
        <div className="flex-1 min-h-0">
          <HistoricalViewGraph historicalData={playerData.historicalData} />
        </div>
      </div>

    </div>
  );
} 