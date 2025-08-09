'use client';

import * as React from 'react';
import { Layers, Telescope } from 'lucide-react';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import * as Tooltip from '@/components/alignui/tooltip';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface StandingsBlueprint {
  seasonRecord: {                    // SOURCE: useDashboardContext().getCurrentLeague().seasonStats
    wins: number;
    losses: number;
    ties: number;
  };

  leagueRankings: {                  // SOURCE: useDashboardContext().getCurrentLeague().standings + useScheduleStore().getStrengthRanking()
    standings: number;
    strengthOfSchedule: number;
  };

  userTeam: {                        // SOURCE: useDashboardContext().getCurrentTeam()
    teamId: string;
    teamName: string;
    ownerName: string;
    record: {
      wins: number;
      losses: number;
      ties: number;
    };
    playoffOdds: number;
    strengthOfScheduleRank: number;
  };

  winStreak: {                       // SOURCE: calculateStreak(recentMatchups) [internal calculation]
    type: 'W' | 'L';
    count: number;
  };

  upcomingSchedule: Array<{          // SOURCE: useScheduleStore().getFutureMatchups()
    opponent: {
      teamId: string;
      teamName: string;
      ownerName: string;
      record: {
        wins: number;
        losses: number;
        ties: number;
      };
      playoffOdds: number;
      strengthOfScheduleRank: number;
    };
    result: 'W' | 'L' | 'T';
    week: number;
    isCompleted: false;
    winProbability: number;
    score?: undefined;
  }>;

  leagueStandings: Array<{           // SOURCE: useDashboardContext().getCurrentLeague().allTeams
    teamId: string;
    teamName: string;
    ownerName: string;
    record: {
      wins: number;
      losses: number;
      ties: number;
    };
    playoffOdds: number;
    strengthOfScheduleRank: number;
  }>;

  recentMatchups: Array<{            // SOURCE: useMatchupHistory().getRecentGames()
    opponent: {
      teamId: string;
      teamName: string;
      ownerName: string;
      record: { wins: number; losses: number; ties: number; };
      playoffOdds: number;
      strengthOfScheduleRank: number;
    };
    result: 'W' | 'L' | 'T';
    week: number;
    isCompleted: true;
    winProbability?: undefined;
    score: {
      userScore: number;
      opponentScore: number;
    };
  }>;
}

interface StandingsWidgetProps extends React.ComponentPropsWithoutRef<typeof WidgetBox.Root> {
  blueprint?: StandingsBlueprint;
}

// ============================================================
// ===================== DATA COLLECTION ======================
// ============================================================

const generateDummyStandingsData = (): StandingsBlueprint => {
  // Helper type for generating team data
  type TeamData = StandingsBlueprint['userTeam'];
  
  // Create league teams
  const teams: TeamData[] = [
    {
      teamId: 'team_1',
      teamName: 'The Gridiron Gods',
      ownerName: 'Mike Johnson',
      record: { wins: 9, losses: 3, ties: 0 },
      playoffOdds: 89,
      strengthOfScheduleRank: 4
    },
    {
      teamId: 'team_2',
      teamName: 'Championship Chasers',
      ownerName: 'Sarah Chen',
      record: { wins: 8, losses: 4, ties: 0 },
      playoffOdds: 76,
      strengthOfScheduleRank: 2
    },
    {
      teamId: 'team_3',
      teamName: 'Dynasty Dreams',
      ownerName: 'Alex Rodriguez',
      record: { wins: 7, losses: 5, ties: 0 },
      playoffOdds: 61,
      strengthOfScheduleRank: 7
    },
    {
      teamId: 'team_4',
      teamName: 'Lightning Bolts',
      ownerName: 'Emma Wilson',
      record: { wins: 6, losses: 6, ties: 0 },
      playoffOdds: 34,
      strengthOfScheduleRank: 1
    },
    {
      teamId: 'team_5',
      teamName: 'Underdog United',
      ownerName: 'David Kim',
      record: { wins: 5, losses: 7, ties: 0 },
      playoffOdds: 18,
      strengthOfScheduleRank: 6
    }
  ];

  const userTeam = teams[2]; // User is "Dynasty Dreams"

  // Generate recent matchups (past games)
  const recentMatchups: MatchupResult[] = [
    {
      opponent: teams[0],
      result: 'L',
      week: 9,
      isCompleted: true,
      score: { userScore: 112.5, opponentScore: 128.3 }
    },
    {
      opponent: teams[1],
      result: 'W',
      week: 10,
      isCompleted: true,
      score: { userScore: 145.7, opponentScore: 132.1 }
    },
    {
      opponent: teams[4],
      result: 'W',
      week: 11,
      isCompleted: true,
      score: { userScore: 139.2, opponentScore: 98.4 }
    },
    {
      opponent: teams[3],
      result: 'W',
      week: 12,
      isCompleted: true,
      score: { userScore: 156.8, opponentScore: 134.2 }
    }
  ];

  // Generate upcoming schedule (12 future matchups)
  const upcomingSchedule: MatchupResult[] = [
    {
      opponent: teams[0],
      result: 'W', // Placeholder
      week: 13,
      isCompleted: false,
      winProbability: 35 // 35% chance to win (tough matchup)
    },
    {
      opponent: teams[4],
      result: 'W',
      week: 14,
      isCompleted: false,
      winProbability: 78 // 78% chance to win (easier matchup)
    },
    {
      opponent: teams[1],
      result: 'W',
      week: 15,
      isCompleted: false,
      winProbability: 52 // 52% chance to win (close matchup)
    },
    {
      opponent: teams[3],
      result: 'W',
      week: 16,
      isCompleted: false,
      winProbability: 71 // 71% chance to win
    },
    {
      opponent: teams[0],
      result: 'W',
      week: 17,
      isCompleted: false,
      winProbability: 28 // 28% chance to win (very tough)
    },
    {
      opponent: teams[1],
      result: 'W',
      week: 18,
      isCompleted: false,
      winProbability: 65 // 65% chance to win
    },
    {
      opponent: teams[4],
      result: 'W',
      week: 19,
      isCompleted: false,
      winProbability: 82 // 82% chance to win (easy matchup)
    },
    {
      opponent: teams[3],
      result: 'W',
      week: 20,
      isCompleted: false,
      winProbability: 59 // 59% chance to win
    },
    {
      opponent: teams[0],
      result: 'W',
      week: 21,
      isCompleted: false,
      winProbability: 41 // 41% chance to win (tough)
    },
    {
      opponent: teams[1],
      result: 'W',
      week: 22,
      isCompleted: false,
      winProbability: 48 // 48% chance to win (close)
    },
    {
      opponent: teams[4],
      result: 'W',
      week: 23,
      isCompleted: false,
      winProbability: 75 // 75% chance to win
    },
    {
      opponent: teams[3],
      result: 'W',
      week: 24,
      isCompleted: false,
      winProbability: 67 // 67% chance to win
    }
  ];

  return {
    userTeam,
    seasonRecord: { wins: 42, losses: 19, ties: 2 }, // Overall season record
    leagueStandings: teams.sort((a, b) => {
      const winPctA = a.record.wins / (a.record.wins + a.record.losses);
      const winPctB = b.record.wins / (b.record.wins + b.record.losses);
      return winPctB - winPctA;
    }),
    recentMatchups,
    upcomingSchedule,
    winStreak: { type: 'W', count: 3 },
    leagueRankings: {
      standings: 4, // 4th place
      strengthOfSchedule: 7 // 7th easiest remaining schedule
    }
  };
};

// Helper Functions
const getWinProbabilityColor = (winProbability: number): string => {
  if (winProbability >= 70) return 'bg-success-base'; // High probability - strong green
  if (winProbability >= 55) return 'bg-success-light'; // Good probability - light green
  if (winProbability >= 45) return 'bg-success-lighter'; // Neutral - very light green
  if (winProbability >= 30) return 'bg-error-lighter'; // Poor probability - light red
  return 'bg-error-base'; // Very poor probability - strong red
};

const formatRecord = (record: { wins: number; losses: number; ties: number }): string => {
  return `${record.wins} - ${record.losses}${record.ties > 0 ? ` - ${record.ties}` : ''}`;
};

const getStreakDisplay = (streak: { type: 'W' | 'L'; count: number }): { text: string; color: string } => {
  const count = streak.count;
  const type = streak.type;
  return {
    text: `${count}${type}`,
    color: type === 'W' ? 'text-success-dark' : 'text-error-dark'
  };
};



// ===========================================================
// =================== COMPONENT DEFINITION ==================
// ===========================================================


export default function StandingsWidget({
  blueprint: providedBlueprint,
  ...rest
}: StandingsWidgetProps) {
  const { getCurrentLeague } = useDashboardContext();
  const currentLeague = getCurrentLeague();
  
  // Use provided blueprint or generate dummy data
  const blueprint = providedBlueprint || generateDummyStandingsData();
  
  const streakDisplay = getStreakDisplay(blueprint.winStreak);
return (
    <WidgetBox.Root snapHeight size={3} {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Layers} />
        Standings
        
        <div className="ml-auto">
          <div className='flex items-center gap-1.5'>
            <div className="flex items-center justify-center gap-1">
              <span className="text-label-lg text-soft-400">{blueprint.seasonRecord.wins}</span>
              <span className="text-label-lg text-disabled-300">-</span>
              <span className="text-label-lg text-soft-400">{blueprint.seasonRecord.losses}</span>
              {blueprint.seasonRecord.ties > 0 && (
                <>
                  <span className="text-label-lg text-disabled-300">-</span>
                  <span className="text-label-lg text-soft-400">{blueprint.seasonRecord.ties}</span>
                </>
              )}
            </div>
            <Badge.Root variant="rank" color="gray" size="medium">
              {blueprint.leagueRankings.standings}
            </Badge.Root>
          </div>
        </div>
      </WidgetBox.Header>

      <WidgetBox.Content>
        {/* Stats Box */}
        <div className="relative overflow-hidden rounded-10 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-10 before:ring-1 before:ring-inset before:ring-stroke-soft-100 flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between p-3 w-full">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1">
                <span className="text-title-h5 font-bold text-soft-400">{blueprint.userTeam.record.wins}</span>
                <span className="text-title-h5 font-bold text-gray-200">-</span>
                <span className="text-title-h5 font-bold text-soft-400">{blueprint.userTeam.record.losses}</span>
                <span className="text-title-h5 font-bold text-gray-200">-</span>
                <span className="text-title-h5 font-bold text-soft-400">{blueprint.userTeam.record.ties}</span>
              </div>
              <div className="text-paragraph-sm text-disabled-300 mt-1">Matchups</div>
            </div>
            
            <div className="text-center flex-1">
              <div className='flex gap-0.5 text-center justify-center'>
                <div className={`text-title-h5 font-bold ${streakDisplay.color}`}>{blueprint.winStreak.count}</div>
                <div className={`text-title-h5 font-bold ${streakDisplay.color}`}>{blueprint.winStreak.type}</div>
              </div>
              <div className="text-paragraph-sm text-disabled-300 mt-1">Streak</div>
            </div>
            
            <div className="text-center flex-1">
              <div className="text-title-h5 w-14 mx-auto font-bold bg-success-lighter text-success-dark px-1 py-0.5 rounded ">
                {blueprint.userTeam.playoffOdds}%
              </div>
              <div className="text-paragraph-sm text-disabled-300 mt-1">Playoffs Odds</div>
            </div>
          </div>
        </div>

        {/* Strength of Schedule */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Telescope className="hw-icon-sm text-black" />
              <span className="text-label-lg text-black">Strength of Schedule</span>
            </div>
            <Badge.Root variant="rank" color="gray" size="medium">
              {blueprint.leagueRankings.strengthOfSchedule}
            </Badge.Root>
          </div>
        
          {/* Schedule Difficulty Bars with Tooltips */}
          <div className="grid grid-flow-col gap-1 h-11">
            {blueprint.upcomingSchedule.map((matchup, index) => (
              <Tooltip.Root key={`matchup-${matchup.week}`}>
                <Tooltip.Trigger asChild>
                  <div 
                    className={`h-full rounded-sm cursor-pointer hover:opacity-80 transition-opacity ${
                      getWinProbabilityColor(matchup.winProbability || 50)
                    }`}
                  />
                </Tooltip.Trigger>
                <Tooltip.Content side="top" className="max-w-xs">
                  <div className="text-center space-y-1">
                    <div className="font-semibold text-label-sm">Week {matchup.week}</div>
                    <div className="text-paragraph-xs pr-1">vs {matchup.opponent.teamName}</div>
                    <div className="text-paragraph-xs text-soft-400">
                      {formatRecord(matchup.opponent.record)}
                    </div>
                    <div className="text-paragraph-xs">
                      Win Probability: <span className="font-semibold">{matchup.winProbability}%</span>
                    </div>
                  </div>
                </Tooltip.Content>
              </Tooltip.Root>
            ))}
          </div>
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}