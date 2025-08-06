'use client';

import * as React from 'react';

import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import * as Select from '@/components/alignui/select';
import { cnExt } from '@/utils/cn';
import { ClipboardMinus, Compass, Sprout, Heart, Users, Shield, Globe, Info, ScanSearch } from 'lucide-react';
import * as Button from '@/components/alignui/button';
import * as Popover from '@/components/alignui/ui/popover';

import PlayerInfoSection from './PlayerInfoSection';
import TraitTagContainer from '@/components/common/TraitTagContainer';
import ValueComparisonTable from './ValueComparisonTable';
import { formatStatValue, getSportConfig, getSportPrimaryStats, getSportTraits } from '@/lib/utils/sportConfig';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { useMemo } from 'react';
import HistoricalViewWidget from './HistoricalViewWidget';


// Dynamic chart data calculation
const calculateChartData = (totalScore, maxScore = 999, powerRatio = 0.6, dynastyRatio = 0.4) => {
  const scoreRatio = totalScore / maxScore;
  const missingScore = maxScore - totalScore;
  
  // Calculate proportions for the filled portion
  const filledPortion = totalScore;
  const powerValue = filledPortion * powerRatio;
  const dynastyValue = filledPortion * dynastyRatio;
  
  return [
    { id: 'power', name: 'Power', value: powerValue },
    { id: 'dynasty', name: 'Dynasty Value', value: dynastyValue },
    { id: 'missing', name: 'Remaining', value: missingScore },
  ];
};

function PlayerProfileWidget({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const [chartMaxWidth, setChartMaxWidth] = React.useState(250);
  const [isClient, setIsClient] = React.useState(false);
  
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
        { period: 4, value: 130 },
        { period: 5, value: 110 },
        { period: 6, value: 125 }
      ],
      yAxisMin: 60,
      yAxisMax: 160
    }
  };
    
    // TODO: Replace dummy data with actual selected player data when available
    return selectedPlayer || dummyPlayer;
  }, [selectedPlayer, primaryStats, sportTraits]);
  
  // Individual state for each preference type
  const [favorPreference, setFavorPreference] = React.useState("Prefer");
  const [prospectPreference, setProspectPreference] = React.useState("Faith");
  const [injuriesPreference, setInjuriesPreference] = React.useState("Ironman");
  const [globalFavorPreference, setGlobalFavorPreference] = React.useState("Prefer");

  // Combined state for backward compatibility with the component
  const metricSelections = {
    0: favorPreference,
    1: prospectPreference,
    2: injuriesPreference,
    3: globalFavorPreference
  };
  
  const scoreData = {
    totalScore: 981,
    maxScore: 999,
    powerRatio: 0.6, // 60% Power
    dynastyRatio: 0.4, // 40% Dynasty Value
    segments: [
      { category: "primary", value: 45, fill: "#4A90E2" },
      { category: "secondary", value: 55, fill: "#F5A623" },
    ],
    metrics: [
      { 
        icon: Heart, 
        label: "Favor", 
        options: ["Prefer", "", "Dislike"] 
      },
      { 
        icon: Users, 
        label: "Prospect", 
        options: ["Faith", "", "Doubt"] 
      },
      { 
        icon: Shield, 
        label: "Injuries", 
        options: ["Prone", "", "Ironman"] 
      },
      { 
        icon: Globe, 
        label: "Global Favor", 
        options: ["Prefer", "", "Dislike"] 
      }
    ]
  };

  const handleMetricChange = (metricIndex: number, value: string) => {
    switch (metricIndex) {
      case 0: // Favor
        setFavorPreference(value);
        break;
      case 1: // Prospect
        setProspectPreference(value);
        break;
      case 2: // Injuries
        setInjuriesPreference(value);
        break;
      case 3: // Global Favor
        setGlobalFavorPreference(value);
        break;
      default:
        console.warn(`Unknown metric index: ${metricIndex}`);
    }
  };

  // Calculate dynamic chart data
  const chartData = calculateChartData(
    scoreData.totalScore,
    scoreData.maxScore,
    scoreData.powerRatio,
    scoreData.dynastyRatio
  );

  // Load preferences from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavor = localStorage.getItem('userPreference_favor');
      const savedProspect = localStorage.getItem('userPreference_prospect');
      const savedInjuries = localStorage.getItem('userPreference_injuries');
      const savedGlobalFavor = localStorage.getItem('userPreference_globalFavor');

      if (savedFavor) setFavorPreference(savedFavor);
      if (savedProspect) setProspectPreference(savedProspect);
      if (savedInjuries) setInjuriesPreference(savedInjuries);
      if (savedGlobalFavor) setGlobalFavorPreference(savedGlobalFavor);
    }
  }, []);

  // Save preferences to localStorage when they change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreference_favor', favorPreference);
    }
  }, [favorPreference]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreference_prospect', prospectPreference);
    }
  }, [prospectPreference]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreference_injuries', injuriesPreference);
    }
  }, [injuriesPreference]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreference_globalFavor', globalFavorPreference);
    }
  }, [globalFavorPreference]);

  React.useEffect(() => {
    setIsClient(true);
    
    const updateChartSize = () => {
      const viewportHeight = window.innerHeight;
      if (viewportHeight <= 620) {
        setChartMaxWidth(180);
      } else if (viewportHeight >= 900) {
        setChartMaxWidth(250);
      } else {
        // Linear interpolation between 180 and 250 for heights between 620 and 900
        const ratio = (viewportHeight - 620) / (900 - 620);
        setChartMaxWidth(Math.round(180 + (250 - 180) * ratio));
      }
    };

    updateChartSize();
    window.addEventListener('resize', updateChartSize);
    return () => window.removeEventListener('resize', updateChartSize);
  }, []);


  // ============================================================
  // ==================== PLAYER PROFILE WIDGET =================
  // ============================================================

  return (
    <WidgetBox.Root fixedHeight className="h-full" {...rest}>
      <WidgetBox.Header noMargin fixedHeight>
        <WidgetBox.HeaderIcon as={ScanSearch} className="" />
        Player Profile

        <div className="ml-auto">
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button.Root
                variant="neutral"
                mode="ghost"
                size="small"
                className="p-1 h-auto"
              >
                <Info className="hw-icon-sm text-soft-400 hover:text-soft-600" />
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content
              side="top"
              align="end"
              className="max-w-xs p-4"
            >
              <p className="text-center text-sm">
                Playbook Score evaluates your roster&apos;s strength across power and dynasty value metrics, 
                helping you understand your team&apos;s competitive position and long-term potential.
              </p>
            </Popover.Content>
          </Popover.Root>
        </div>

      </WidgetBox.Header>
      <WidgetBox.Content>

        <PlayerInfoSection playerData={playerData} />
        <TraitTagContainer traitIds={playerData.tags.traitIds} />
        <ValueComparisonTable valueComparisons={playerData.valueComparisons} />
        <HistoricalViewWidget historicalData={playerData.historicalData} />

      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}

// Default export
export default PlayerProfileWidget;





export function PlayerProfileWidgetEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Compass} className="" />
        Player Profile
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <div className='size-[108px] bg-bg-weak-50 rounded-lg flex items-center justify-center text-sub-600'>Empty</div>
          <div className='text-center text-paragraph-sm text-soft-400'>
            No Playbook Score data yet.
            <br />
            Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
