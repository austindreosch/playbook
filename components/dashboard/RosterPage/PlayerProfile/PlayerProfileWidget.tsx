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

export default function PlayerProfileWidget({
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

  return (
    <WidgetBox.Root className=" flex flex-col" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={ScanSearch} className="icon" />
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
                <Info className="icon-sm text-text-soft-400 hover:text-text-soft-600" />
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content
              side="top"
              align="end"
              className="max-w-xs p-4"
            >
              <p className="text-center text-sm">
                Playbook Score evaluates your roster's strength across power and dynasty value metrics, 
                helping you understand your team's competitive position and long-term potential.
              </p>
            </Popover.Content>
          </Popover.Root>
        </div>

      </WidgetBox.Header>

      <div className='flex flex-col gap-3 smh:gap-4 mdh:gap-5 flex-1 pb-0'>
        <Divider.Root className='hidden mdh:block'/>

        

      </div>
    </WidgetBox.Root>
  );
}





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
        <WidgetBox.HeaderIcon as={Compass} className="icon" />
        Player Profile
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <div className='size-[108px] bg-gray-100 rounded-lg flex items-center justify-center'>Empty</div>
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
