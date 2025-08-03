'use client';

import {
  RiPieChartLine,
} from '@remixicon/react';
import * as React from 'react';

import SpendingSummaryPieChart from '@/components/alignui/spending-summary-pie-chart';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import * as Select from '@/components/alignui/select';
import { cnExt } from '@/utils/cn';
import { ClipboardMinus, Compass, Sprout, Heart, Users, Shield, Globe, Info } from 'lucide-react';
import * as Button from '@/components/alignui/button';
import * as Popover from '@/components/alignui/ui/popover';
import UserPlayerPreferencesPanel from './UserPlayerPreferencesPanel';


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

export default function PlaybookScoreBlock({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const [chartMaxWidth, setChartMaxWidth] = React.useState(250);
  const [isClient, setIsClient] = React.useState(false);
  
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
      { category: "primary", value: 45, fill: "var(--blue-500)" },
      { category: "secondary", value: 55, fill: "var(--orange-500)" },
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

  return (
    <WidgetBox.Root fixedHeight className="h-full" {...rest}>
      <WidgetBox.Header noMargin fixedHeight>
        <WidgetBox.HeaderIcon as={Compass} className="" />
        Playbook Score

        <div className="ml-auto">
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button.Root
                variant="neutral"
                mode="ghost"
                size="small"
                className="p-1 h-auto"
              >
                <Info className="hw-icon-sm text-text-soft-400 hover:text-text-soft-600" />
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

        <div className='mx-auto grid w-full justify-center'>
          <SpendingSummaryPieChart
            data={chartData}
            className='[grid-area:1/1] w-full'
            maxWidth={chartMaxWidth}
        />
        <div className='pointer-events-none relative z-10 flex flex-col items-center justify-end gap-1 mdh:pb-0 text-center [grid-area:1/1]'>
            <span className='pointer-events-auto text-title-h1 mdh:text-title-h0 text-text-strong-950 '>
              {scoreData.totalScore}
            </span>
        </div>

        </div>

        <Divider.Root className='mt-4' /> 

        {/*  CONTEXT FOR PLAYBOOK SCORE*/}
        <div className="flex items-center gap-8 mx-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="text-label-sm text-text-sub-600">STANDARD</div>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-0.5">
                <ClipboardMinus className="hw-icon-sm" />
                <Badge.Root variant="rank" color="gray" size="medium">
                  3
                </Badge.Root>
              </div>
              <div className="w-px h-4 bg-stroke-soft-200" />
              <div className="text-label-lg text-">972</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="text-label-sm text-text-sub-600">REDRAFT</div>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-0.5">
                <Sprout className="hw-icon-sm" />
                <Badge.Root variant="rank" color="gray" size="medium">
                  1
                </Badge.Root>
              </div>
              <div className="w-px h-4 bg-stroke-soft-200" />
              <div className="text-label-lg">998</div>
            </div>
          </div>
        </div>

        <UserPlayerPreferencesPanel
          scoreData={scoreData}
          className="px-1"
        />
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}

export function PlaybookScoreBlockEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiPieChartLine} />
        Playbook Score
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <div className='size-[108px] bg-bg-weak-50 rounded-lg flex items-center justify-center text-text-sub-600'>Empty</div>
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No Playbook Score data yet.
            <br />
            Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
