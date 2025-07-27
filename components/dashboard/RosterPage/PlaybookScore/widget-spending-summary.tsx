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
import { ClipboardMinus, Compass, Sprout, Heart, Users, Shield, Globe } from 'lucide-react';
import * as Button from '@/components/alignui/button';
import MetricControlsSection from '../MetricControlsSection';

// import IconInfoCustomFill from '~/icons/icon-info-custom-fill.svg';


const chartData = [
  { id: 'shopping', name: 'Shopping', value: 400 },
  { id: 'utilities', name: 'Utilities', value: 300 },
  { id: 'others', name: 'Others', value: 300 },
];

export default function PlaybookScoreBlock({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const [chartMaxWidth, setChartMaxWidth] = React.useState(250);
  const [isClient, setIsClient] = React.useState(false);
  
  // Metrics state and data
  const [metricSelections, setMetricSelections] = React.useState({
    0: "Prefer",  // Favor
    1: "Faith",   // Prospect  
    2: "Ironman", // Injuries
    3: "Prefer"   // Global Favor
  });
  
  const scoreData = {
    totalScore: 981,
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

  const handleMetricChange = (metricIndex, value) => {
    setMetricSelections(prev => ({
      ...prev,
      [metricIndex]: value
    }));
  };

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
        <WidgetBox.HeaderIcon as={Compass} className="icon" />
        Playbook Score

        {/* <div className="ml-auto">
          <Select.Root variant='compact' size='xsmall' defaultValue='last-year' hasError={false}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content align='end'>
            {periods.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        </div> */}

      </WidgetBox.Header>

      <div className='flex flex-col gap-3 smh:gap-4 mdh:gap-5 flex-1 pb-0'>
        <Divider.Root className='hidden mdh:block'/>

        <div className='mx-auto grid w-full justify-center'>
          <SpendingSummaryPieChart
            data={chartData}
            className='[grid-area:1/1] w-full'
            maxWidth={chartMaxWidth}
          />
          <div className='pointer-events-none relative z-10 flex flex-col items-center justify-end gap-1 mdh:pb-2 text-center [grid-area:1/1]'>
            <span className='pointer-events-auto text-title-h2 mdh:text-title-h1 text-text-strong-950 '>
              981
            </span>
          </div>
        </div>

        <Divider.Root /> 

        {/*  CONTEXT FOR PLAYBOOK SCORE*/}
        <div className="flex items-center gap-8 mx-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <ClipboardMinus className="icon-sm" />
              <div className="text-label-sm">Standard</div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge.Root variant="rank" color="gray" size="medium">
                3
              </Badge.Root>
              <div className="w-px h-4 bg-stroke-soft-200" />
              <div className="text-label-lg">972</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Sprout className="icon-sm" />
              <div className="text-label-sm">Redraft</div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge.Root variant="rank" color="gray" size="medium">
                1
              </Badge.Root>
              <div className="w-px h-4 bg-stroke-soft-200" />
              <div className="text-label-lg">998</div>
            </div>
          </div>

        </div>

        {/* Metrics Controls - shows controls on mdh+ viewports, button on smaller */}
        <MetricControlsSection
          scoreData={scoreData}
          metricSelections={metricSelections}
          onMetricChange={handleMetricChange}
          className="px-1"
        />






      </div>
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
