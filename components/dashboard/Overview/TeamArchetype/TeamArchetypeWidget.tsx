'use client';

import * as React from 'react';
import { BicepsFlexed, ChartCandlestick, Dna, ShieldUser, TimerReset, Trophy } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import { ChartContainer } from '@/components/ui/chart';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface TeamArchetypeBlueprint {
  rankings: {                           // SOURCE: useDashboardContext().getCurrentTeam().archetype.rankings
    value: number;                      // Team ranking in value (1-10)
    power: number;                      // Team ranking in power (1-10)
    victory: number;                    // Team ranking in victory (1-10)
    age: number;                        // Team ranking in age (1-10)
    futures: number;                    // Team ranking in futures (1-10)
  };

  radarData: Array<{                    // SOURCE: calculateRadarValues(rankings) [internal calculation]
    metric: string;
    value: number;                      // Inverted ranking for radar display (1st = 10, 10th = 1)
  }>;

  metrics: Array<{                      // SOURCE: formatMetricsDisplay(rankings) [internal calculation]
    icon: React.ComponentType<any>;
    label: string;
    rank: string;                       // Formatted rank (e.g., "1st", "2nd", "3rd")
  }>;
}

interface TeamArchetypeWidgetProps extends React.ComponentPropsWithoutRef<typeof WidgetBox.Root> {
  blueprint?: TeamArchetypeBlueprint;
}

// ============================================================
// ===================== DATA COLLECTION ======================
// ============================================================

const generateTeamArchetypeData = (): TeamArchetypeBlueprint => {
  // Generate realistic team archetype rankings (1-10 scale)
  const rankings = {
    value: 5,
    power: 4,
    victory: 2,
    age: 9,
    futures: 7
  };

  // Convert rankings to radar data (invert so 1st = 10, 10th = 1)
  const radarData = [
    { metric: 'Value', value: 11 - rankings.value },
    { metric: 'Power', value: 11 - rankings.power },
    { metric: 'Victory', value: 11 - rankings.victory },
    { metric: 'Age', value: 11 - rankings.age },
    { metric: 'Futures', value: 11 - rankings.futures }
  ];

  // Format metrics with icons and rank display
  const metrics = [
    { icon: ChartCandlestick, label: 'Value', rank: formatRankSuffix(rankings.value) },
    { icon: BicepsFlexed, label: 'Power', rank: formatRankSuffix(rankings.power) },
    { icon: Trophy, label: 'Victory', rank: formatRankSuffix(rankings.victory) },
    { icon: TimerReset, label: 'Age', rank: formatRankSuffix(rankings.age) },
    { icon: ShieldUser, label: 'Futures', rank: formatRankSuffix(rankings.futures) }
  ];

  return {
    rankings,
    radarData,
    metrics
  };
};

// Helper Functions
const formatRankSuffix = (rank: number): string => {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
};

const getRankColor = (rank: number): string => {
  if (rank <= 3) return 'text-success-dark bg-success-lighter border-success-light';
  if (rank <= 6) return 'text-warning-dark bg-warning-lighter border-warning-light';
  return 'text-error-dark bg-error-lighter border-error-light';
};

// ============================================================
// =================== COMPONENT DEFINITION ==================
// ============================================================

// Custom tick component for radar chart icons
const CustomTick = ({ payload, x, y, textAnchor, ...props }: any) => {
  const iconMap = {
    'Value': ChartCandlestick,
    'Power': BicepsFlexed,
    'Victory': Trophy,
    'Age': TimerReset,
    'Futures': ShieldUser
  };
  
  const Icon = iconMap[payload.value as keyof typeof iconMap];
  if (!Icon) return null;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-8" y="-8" width="16" height="16">
        <Icon className="w-4 h-4 text-text-soft-400" strokeWidth={2} />
      </foreignObject>
    </g>
  );
};

export default function TeamArchetypeWidget({
  blueprint: providedBlueprint,
  ...rest
}: TeamArchetypeWidgetProps) {
  const { getCurrentTeam } = useDashboardContext();
  
  // Use provided blueprint or generate dummy data
  const blueprint = providedBlueprint || generateTeamArchetypeData();

  const chartConfig = {
    value: {
      label: "Performance",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <WidgetBox.Root className="h-full" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Dna} />
        Team Archetype
      </WidgetBox.Header>

      <WidgetBox.Content>
        <div className="flex items-center flex-1 min-h-0">
          {/* Metrics List */}
          <div className="space-y-2 flex flex-col justify-center pl-1 flex-shrink-0">
            {blueprint.metrics.map((metric, index) => {
              const Icon = metric.icon;
              const rank = parseInt(metric.rank);
              return (
                <div key={index} className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="hw-icon-xs text-text-soft-400 flex-shrink-0" strokeWidth={2} />
                    <span className="text-label-sm text-text-soft-400">{metric.label}</span>
                  </div>
                  <Badge.Root 
                    variant="rank" 
                    color={rank <= 3 ? "green" : rank <= 6 ? "yellow" : "red"} 
                    size="small"
                    className="ml-5"
                  >
                    {metric.rank}
                  </Badge.Root>
                </div>
              );
            })}
          </div>

          {/* Radar Chart Container */}
          <div className="flex-1 h-full min-w-0 overflow-hidden flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-full w-full max-w-full">
              <RadarChart 
                data={blueprint.radarData} 
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                width="100%"
                height="100%"
              >
                <PolarGrid 
                  gridType="polygon" 
                  radialLines={false}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={CustomTick}
                  tickSize={12}
                />
                <PolarRadiusAxis 
                  domain={[0, 10]} 
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  dataKey="value"
                  stroke="hsl(var(--primary-base))"
                  strokeWidth={2}
                  fill="hsl(var(--primary-alpha-50))"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ChartContainer>
          </div>
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}