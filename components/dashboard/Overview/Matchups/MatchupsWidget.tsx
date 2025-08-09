'use client';

import * as React from 'react';
import NumberFlow from '@number-flow/react';
import { 
  Calendar, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Crown, 
  FileText, 
  Medal, 
  Shield, 
  ShieldAlert, 
  Swords, 
  Users, 
  Wrench,
  Sword,
  Scroll,
  ScrollText,
  Bandage,
  BookLock,
  CalendarClock,
  BicepsFlexed
} from 'lucide-react';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import * as Tooltip from '@/components/alignui/tooltip';
import * as ProgressBar from '@/components/alignui/ui/progress-bar';
import { ProgressChart } from '@/components/progress-chart';
import { useAnimateNumber } from '@/hooks/use-animate-number';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface MatchupsBlueprint {
  currentWeek: {                         // SOURCE: useDashboardContext().getCurrentLeague().currentWeek
    week: number;
    dateRange: string;
  };

  projectedWin: {                        // SOURCE: useMatchupProjection().getWinProbability()
    userScore: number;
    opponentScore: number;
    winProbability: number;
    opponentTeamName: string;
  };

  weeklyStats: {                         // SOURCE: useMatchupStats().getWeeklyStats()
    totalGames: number;
    gamesPlayed: number;
    remainingGames: number;
    capHit: string;
    currentRank: number;
  };

  lineup: Array<{                        // SOURCE: useLineupStore().getCurrentLineup()
    playerId: string;
    name: string;
    position: string;
    isPlaying: boolean;
    isInjured: boolean;
    isOut: boolean;
    gameStatus: 'active' | 'upcoming' | 'completed' | 'postponed';
  }>;

  battlegroundStats: Array<{             // SOURCE: useMatchupAnalysis().getBattlegroundCategories()
    category: string;
    categoryShort: string;
    userAdvantage: number;
    isUserFavored: boolean;
    significance: 'high' | 'medium' | 'low';
  }>;

  missingPlayers: {                      // SOURCE: useLineupOptimization().getMissingPlayers()
    userTeam: Array<{
      playerId: string;
      name: string;
      isOut: boolean;
      isInjured: boolean;
      reason: string;
    }>;
    opponentTeam: Array<{
      playerId: string;
      name: string;
      isOut: boolean;
      isInjured: boolean;
      reason: string;
    }>;
    healthAdvantage: number; // Percentage advantage (positive = user has fewer missing players)
  };
}

interface MatchupsWidgetProps extends React.ComponentPropsWithoutRef<typeof WidgetBox.Root> {
  blueprint?: MatchupsBlueprint;
}

// ============================================================
// ===================== DATA COLLECTION ======================
// ============================================================

const generateMatchupsData = (): MatchupsBlueprint => {
  // Generate lineup with varied player statuses
  const lineup = [
    { 
      playerId: 'player_1', 
      name: 'A. Sengun', 
      position: 'C',
      isPlaying: false, 
      isInjured: true, 
      isOut: false,
      gameStatus: 'upcoming' as const
    },
    { 
      playerId: 'player_2', 
      name: 'C. Capela', 
      position: 'C',
      isPlaying: true, 
      isInjured: false, 
      isOut: false,
      gameStatus: 'active' as const
    },
    { 
      playerId: 'player_3', 
      name: 'A. Caruso', 
      position: 'PG',
      isPlaying: true, 
      isInjured: false, 
      isOut: false,
      gameStatus: 'active' as const
    },
    { 
      playerId: 'player_4', 
      name: 'S. Barnes', 
      position: 'SF',
      isPlaying: false, 
      isInjured: true, 
      isOut: false,
      gameStatus: 'upcoming' as const
    },
    { 
      playerId: 'player_5', 
      name: 'D. Mitchell', 
      position: 'SG',
      isPlaying: true, 
      isInjured: false, 
      isOut: false,
      gameStatus: 'active' as const
    }
  ];

  // Generate battleground categories
  const battlegroundStats = [
    {
      category: 'Rebounds',
      categoryShort: 'REB',
      userAdvantage: 3,
      isUserFavored: true,
      significance: 'high' as const
    },
    {
      category: 'Steals',
      categoryShort: 'STL',
      userAdvantage: -1,
      isUserFavored: false,
      significance: 'medium' as const
    },
    {
      category: 'Turnovers',
      categoryShort: 'TO',
      userAdvantage: 2,
      isUserFavored: true,
      significance: 'high' as const
    }
  ];

  // Generate missing players for both teams
  const missingPlayersUserTeam = [
    { 
      playerId: 'missing_1', 
      name: 'J. Tatum', 
      isOut: true, 
      isInjured: false, 
      reason: 'Personal Leave' 
    },
    { 
      playerId: 'missing_2', 
      name: 'C. Holmgren', 
      isOut: true, 
      isInjured: false, 
      reason: 'Rest' 
    },
    { 
      playerId: 'missing_3', 
      name: 'A. Sengun', 
      isOut: false, 
      isInjured: true, 
      reason: 'Ankle Injury' 
    },
    { 
      playerId: 'missing_4', 
      name: 'S. Barnes', 
      isOut: false, 
      isInjured: true, 
      reason: 'Back Spasms' 
    }
  ];

  const missingPlayersOpponentTeam = [
    { 
      playerId: 'opp_missing_1', 
      name: 'S. Gilgeous-Alexa...', 
      isOut: true, 
      isInjured: false, 
      reason: 'Personal' 
    },
    { 
      playerId: 'opp_missing_2', 
      name: 'P. George', 
      isOut: true, 
      isInjured: false, 
      reason: 'Load Management' 
    },
    { 
      playerId: 'opp_missing_3', 
      name: 'T. Murphy III', 
      isOut: true, 
      isInjured: false, 
      reason: 'Illness' 
    }
  ];

  return {
    currentWeek: {
      week: 7,
      dateRange: '12/4 - 12/10'
    },
    projectedWin: {
      userScore: 5.7,
      opponentScore: 4.3,
      winProbability: 57,
      opponentTeamName: 'Opponent Team'
    },
    weeklyStats: {
      totalGames: 12,
      gamesPlayed: 8,
      remainingGames: 4,
      capHit: '< 5',
      currentRank: 4
    },
    lineup,
    battlegroundStats,
    missingPlayers: {
      userTeam: missingPlayersUserTeam,
      opponentTeam: missingPlayersOpponentTeam,
      healthAdvantage: 45 // User team has 45% fewer missing players (advantage)
    }
  };
};

// ============================================================
// ===================== HELPER FUNCTIONS ====================
// ============================================================

const getPlayerStatusIcon = (player: MatchupsBlueprint['lineup'][0]) => {
  if (player.isInjured || player.isOut) {
    return <Wrench className="hw-icon-xs text-soft-400 flex-shrink-0" strokeWidth={2} />;
  }
  return <Check className="hw-icon-xs text-success-base flex-shrink-0" strokeWidth={2} />;
};

const getBattlegroundColor = (isUserFavored: boolean, significance: string) => {
  if (isUserFavored) {
    return significance === 'high' ? 'bg-success-base' : 'bg-success-light';
  }
  return significance === 'high' ? 'bg-error-base' : 'bg-error-light';
};

const getMissingPlayerIcon = (player: MatchupsBlueprint['missingPlayers']['userTeam'][0]) => {
  if (player.isOut) {
    return <ShieldAlert className="hw-icon-xs text-soft-400" strokeWidth={2} />;
  }
  if (player.isInjured) {
    return <Wrench className="hw-icon-xs text-soft-400" strokeWidth={2} />;
  }
  return <Shield className="hw-icon-xs text-soft-400" strokeWidth={2} />;
};

const formatRankSuffix = (rank: number): string => {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
};

// ============================================================
// =================== COMPONENT DEFINITION ==================
// ============================================================

export default function MatchupsWidget({
  blueprint: providedBlueprint,
  ...rest
}: MatchupsWidgetProps) {
  const { getCurrentLeague } = useDashboardContext();
  
  // Use provided blueprint or generate dummy data
  const blueprint = providedBlueprint || generateMatchupsData();

  // Animation setup for projected win percentage
  const initialRenderRef = React.useRef(true);
  const prevValueRef = React.useRef(0);

  const animateNumber = useAnimateNumber({
    start: prevValueRef.current,
    end: blueprint.projectedWin.winProbability,
    duration: initialRenderRef.current ? 600 : 200,
    onComplete: () => {
      prevValueRef.current = blueprint.projectedWin.winProbability;
      initialRenderRef.current = false;
    },
  });

  React.useEffect(() => {
    if (blueprint.projectedWin.winProbability) {
      animateNumber.start();
    } else {
      animateNumber.reset();
    }
  }, [blueprint.projectedWin.winProbability, animateNumber]);

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Swords} />
        Matchup
        
        <div className="ml-auto">
          {/* Week selector */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div className="flex items-center gap-1 ring-1 ring-inset ring-stroke-soft-200 rounded-lg px-2 h-6 cursor-pointer hover:bg-bg-weak-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-soft-400" strokeWidth={2} />
                <span className="text-label-md font-medium text-soft-400">Week {blueprint.currentWeek.week}</span>
                <ChevronRight className="w-4 h-4 text-soft-400" strokeWidth={2} />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
              Week {blueprint.currentWeek.week} ({blueprint.currentWeek.dateRange})
            </Tooltip.Content>
          </Tooltip.Root>
        </div>
      </WidgetBox.Header>

      <WidgetBox.Content>
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-3">
          {/* Projected Win section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
              <div className="text-title-h5 text-strong-950">
                <NumberFlow value={animateNumber.value} suffix="%" />
              </div>
                <span className="text-subheading-md text-sub-300">Projected Win</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-subheading-md text-gray-300 truncate pr-1">
                  <span className="font-normal">vs</span> {blueprint.projectedWin.opponentTeamName}
                </span>
                {/* <ScrollText className="hw-icon-sm text-soft-400" /> */}
              </div>
            </div>

            {/* Win probability bar - animated */}
            <ProgressChart value={animateNumber.value} />
          </div>

          <Divider.Root variant="line-spacing" />

          {/* Stats row */}
          <div className="flex gap-2">

            <div className="flex items-center gap-1 bg-bg-weak-25 rounded-md px-2 py-1.5 flex-1 min-w-0 justify-between">
              <div className="flex items-center gap-1">
                <CalendarClock className="hw-icon-xs text-soft-400 flex-shrink-0" strokeWidth={2} />
                <span className="text-label-sm text-soft-400">Games Left</span>
              </div>
              <span className="text-label-md font-semibold text-strong-950">{blueprint.weeklyStats.gamesPlayed}</span>
            </div>

            <div className="flex items-center gap-1 bg-bg-weak-25 rounded-md px-2 py-1.5 flex-1 min-w-0 justify-between">
              <div className="flex items-center gap-1">
                <BookLock className="hw-icon-xs text-soft-400 flex-shrink-0" strokeWidth={2} />
                <span className="text-label-sm text-soft-400">Cap</span>
              </div>
              <span className="text-label-md font-semibold text-strong-950">{blueprint.weeklyStats.capHit}</span>
            </div>

            <div className="flex items-center gap-1 bg-bg-weak-25 rounded-md px-2 py-1.5 flex-1 min-w-0 justify-between">
              <div className="flex items-center gap-1">
                <BicepsFlexed className="hw-icon-xs text-soft-400 flex-shrink-0" strokeWidth={2} />
                <span className="text-label-sm text-soft-400">Strength</span>
              </div>
              <span className="text-label-md font-semibold text-strong-950">{blueprint.weeklyStats.gamesPlayed}</span>
            </div>

          </div>

          {/* Lineup and Battleground Stats */}
          <div className="grid grid-cols-3 gap-3">
            {/* Player Lineup */}
            <div className="min-w-0">
              <span className="text-label-md text-soft-400 truncate">Lineup</span>
              <Divider.Root variant="line-spacing" />
              <div className="space-y-1">
                {blueprint.lineup.slice(0, 4).map((player) => (
                  <div key={player.playerId} className="flex items-center gap-2 min-w-0">
                    {getPlayerStatusIcon(player)}
                    <span className="text-paragraph-lg text-gray-400 truncate min-w-0">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Battleground Stats */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                {/* <Sword className="hw-icon-sm text-soft-400 flex-shrink-0" strokeWidth={2} /> */}
                <h4 className="text-label-md text-soft-400 truncate">Battleground Stats</h4>
              </div>
              
              <div className="flex gap-1 mb-1 min-w-0">
                {blueprint.battlegroundStats.map((stat) => (
                  <div 
                    key={stat.category}
                    className={`${getBattlegroundColor(stat.isUserFavored, stat.significance)} text-static-white text-label-sm font-medium px-2 py-0.5 rounded flex-1 text-center min-w-0`}
                  >
                    {stat.categoryShort}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-1 min-w-0">
                {blueprint.battlegroundStats.map((stat) => (
                  <span key={`${stat.category}-value`} className="text-label-sm text-soft-400 flex-1 text-center min-w-0">
                    {stat.userAdvantage > 0 ? '+' : ''}{stat.userAdvantage}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Divider.Root variant="line-spacing" />

          {/* Missing Players section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
              <Bandage className="hw-icon-sm text-black" />
              <span className="text-label-lg text-black">Injury Report</span>
              </div>
              <button className="flex items-center gap-1 text-label-md text-soft-400 hover:text-strong-950 transition-colors">
                <Wrench className="hw-icon-sm" strokeWidth={2} />
                <span className="hidden sm:inline text-label-md">Fix Lineup</span>
              </button>
            </div>

            {/* Health advantage progress bar */}
            <div className="flex gap-1 mb-2">
              <ProgressBar.Root 
                value={blueprint.missingPlayers.healthAdvantage} 
                max={100} 
                color="green" 
                className="flex-1"
              />
              <ProgressBar.Root
                value={100 - blueprint.missingPlayers.healthAdvantage} 
                max={100} 
                color="red" 
                className="flex-1"
              />
            </div>

            {/* Missing players lists */}
            <div className="grid grid-cols-2 gap-2">
              {/* User team missing players */}
              <div className="space-y-1 min-w-0">
                {blueprint.missingPlayers.userTeam.map((player) => (
                  <div key={player.playerId} className="flex items-center gap-2 min-w-0">
                    <div className="hw-icon-md flex items-center justify-center flex-shrink-0">
                      {getMissingPlayerIcon(player)}
                    </div>
                    <span className="text-paragraph-lg text-gray-400 truncate min-w-0">{player.name}</span>
                  </div>
                ))}
              </div>

              {/* Opponent missing players */}
              <div className="space-y-1 min-w-0">
                {blueprint.missingPlayers.opponentTeam.map((player) => (
                  <div key={player.playerId} className="flex items-center gap-2 min-w-0">
                    <div className="hw-icon-md flex items-center justify-center flex-shrink-0">
                      {getMissingPlayerIcon(player)}
                    </div>
                    <span className="text-paragraph-lg text-gray-400 truncate min-w-0">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}