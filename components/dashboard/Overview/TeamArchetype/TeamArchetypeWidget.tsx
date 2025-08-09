'use client';

import * as React from 'react';
import { BicepsFlexed, ChartCandlestick, Dna, ShieldUser, TimerReset, Trophy } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Text, Tooltip } from 'recharts';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
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

function RenderPolarAngleAxis({
  payload,
  x,
  y,
  cx,
  cy,
  textAnchor,
  ...rest
}: any) {
  const gRef = React.useRef(null);
  const uniqueId = React.useId();
  const [bbox, setBbox] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (gRef.current) {
      const textEl = (gRef.current as HTMLElement).querySelector('text');
      if (textEl) {
        const box = textEl.getBBox();
        setBbox({
          width: box.width,
          height: box.height,
        });
      }
    }
  }, [payload.value]);

  const padding = 16;
  const xOffset = (x - cx) / 5;
  const yOffset = (y - cy) / 5;

  let rectX;
  if (textAnchor === 'start') {
    rectX = x + xOffset - padding / 2;
  } else if (textAnchor === 'middle') {
    rectX = x + xOffset - bbox.width / 2 - padding / 2;
  } else {
    rectX = x + xOffset - bbox.width - padding / 2;
  }

  const iconMap = {
    'Value': ChartCandlestick,
    'Power': BicepsFlexed,
    'Victory': Trophy,
    'Age': TimerReset,
    'Futures': ShieldUser
  };
  
  const Icon = iconMap[payload.value as keyof typeof iconMap];

  return (
    <g ref={gRef}>
      <rect
        x={rectX}
        y={y + yOffset - 12}
        width={bbox.width + padding}
        height={24}
        rx={6}
        fill='none'
        className='stroke-stroke-soft-200'
        strokeWidth={1}
      />
      <Text
        {...rest}
        id={uniqueId}
        verticalAnchor='middle'
        y={y + yOffset}
        x={x + xOffset}
        textAnchor={textAnchor}
        className='recharts-polar-angle-axis-tick-value'
      >
        {payload.value}
      </Text>
    </g>
  );
}

export default function TeamArchetypeWidget({
  blueprint: providedBlueprint,
  ...rest
}: TeamArchetypeWidgetProps) {
  const { getCurrentTeam } = useDashboardContext();
  
  // Use provided blueprint or generate dummy data
  const blueprint = providedBlueprint || generateTeamArchetypeData();

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Dna} />
        Team Archetype
      </WidgetBox.Header>

      <WidgetBox.Content>
        <div className="flex items-center flex-1 min-h-0">
          {/* Metrics List - Icon + Badge only */}
          <div className="space-y-3 flex flex-col justify-center pl-1 flex-shrink-0">
            {blueprint.metrics.map((metric, index) => {
              const Icon = metric.icon;
              const rank = parseInt(metric.rank);
              return (
                <div key={index} className="flex items-center gap-2">
                  <Icon className="hw-icon-sm text-soft-400 flex-shrink-0" strokeWidth={2} />
                  <Badge.Root
                    variant="rank"
                    size="medium"
                    className={`flex items-center justify-center`}
                  >
                    {metric.rank}
                  </Badge.Root>
                </div>
              );
            })}
          </div>

          {/* Radar Chart Container */}
          <div className="flex-1 h-full min-w-0 overflow-hidden flex items-center justify-center">
            <ResponsiveContainer
              width='100%'
              height={200}
              className='recharts-fade-in-axis-tick [&_.recharts-surface]:overflow-visible'
            >
              <RadarChart cx='50%' cy='50%' outerRadius='85%' data={blueprint.radarData}>
                <PolarGrid stroke='var(--stroke-soft-200)' />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const metric = data.payload.metric;
                      const value = data.value;
                      const rank = 11 - value; // Convert back to rank (1-10)
                      
                      return (
                        <div className="bg-white border border-stroke-soft-200 rounded-lg px-3 py-2 shadow-lg">
                          <div className="text-label-sm font-medium text-base-950">
                            {metric}
                          </div>
                          <div className="text-label-xs text-sub-600">
                            Rank: {rank === 1 ? '1st' : rank === 2 ? '2nd' : rank === 3 ? '3rd' : `${rank}th`}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <PolarAngleAxis
                  dataKey='metric'
                  className='[&_.angleAxis]:stroke-stroke-soft-200 [&_.recharts-polar-angle-axis-tick-value]:fill-text-sub-600 [&_.recharts-polar-angle-axis-tick-value]:text-label-xs'
                  tickLine
                  axisLine
                  tick={(props: any) => {
                    const iconMap = {
                      'Value': ChartCandlestick,
                      'Power': BicepsFlexed,
                      'Victory': Trophy,
                      'Age': TimerReset,
                      'Futures': ShieldUser
                    };
                    
                    const Icon = iconMap[props.payload.value as keyof typeof iconMap];
                    if (!Icon) {
                      return (
                        <g>
                          <text x={props.x} y={props.y} textAnchor={props.textAnchor}>
                            {props.payload.value}
                          </text>
                        </g>
                      );
                    }
                    
                    return (
                      <g transform={`translate(${props.x},${props.y})`}>
                        <foreignObject x="-8" y="-8" width="16" height="16">
                          <Icon className="w-4 h-4 text-soft-400" strokeWidth={2} />
                        </foreignObject>
                      </g>
                    );
                  }}
                  tickSize={12}
                  axisLineType='polygon'
                />
                <Radar
                  name='Team Performance'
                  dataKey='value'
                  stroke='#3b82f6'
                  strokeWidth={3}
                  fill='#3b82f6'
                  fillOpacity={0.3}
                  animationDuration={600}
                  animationEasing='ease-out'
                  dot={({ ...props }) => {
                    return (
                      <circle
                        {...props}
                        fill='#3b82f6'
                        stroke='#3b82f6'
                        strokeWidth={0}
                        fillOpacity={1}
                      />
                    );
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}