'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLeagueFormatDisplay, getSportConfig } from '@/lib/utils/sportConfig';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { CircleHelp, CircleQuestionMark, Compass, GitCommitHorizontal, Globe, Heart, HelpCircle, Settings, Shield, Trophy, Users, X, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Label, Pie, PieChart } from "recharts";
import MetricControlsSection from './MetricControlsSection';

export default function PlaybookScoreBlock() {
  const { getCurrentLeague } = useDashboardContext();
  const currentLeague = getCurrentLeague();
  
  // Get sport configuration and league format
  const sportConfig = useMemo(() => {
    const sport = currentLeague?.leagueDetails?.sport || 'nba';
    return getSportConfig(sport);
  }, [currentLeague?.leagueDetails?.sport]);
  
  const leagueFormatDisplay = useMemo(() => {
    return getLeagueFormatDisplay(currentLeague?.leagueDetails);
  }, [currentLeague?.leagueDetails]);
  
  // TODO: These values should come from actual data/calculations based on the sport
  const [metricSelections, setMetricSelections] = useState({
    0: "Prefer",  // Favor
    1: "Faith",   // Prospect  
    2: "Ironman", // Injuries
    3: "Prefer"   // Global Favor
  });
  
  const [calculatedInnerRadius, setCalculatedInnerRadius] = useState(50);
  const chartContainerRef = useRef(null);
  const containerRef = useRef(null);
  const desiredThickness = 40; // Desired thickness in pixels

  const scoreData = {
    totalScore: 981,
    leagueFormat: leagueFormatDisplay,
    teamStatus: "Contending", // TODO: Make dynamic based on team performance analysis
    segments: [
      { category: "primary", value: 45, fill: "#4A90E2" }, // blue segment
      { category: "secondary", value: 55, fill: "#F5A623" }, // orange/yellow segment
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

  const chartConfig = {
    value: {
      label: "Score",
    },
    primary: {
      label: "Primary",
      color: "#4A90E2",
    },
    secondary: {
      label: "Secondary", 
      color: "#F5A623",
    },
  };


  useEffect(() => {
    const calculateInnerRadius = () => {
      if (chartContainerRef.current) {
        const containerRect = chartContainerRef.current.getBoundingClientRect();
        const containerSize = Math.min(containerRect.width, containerRect.height);
        const outerRadius = containerSize / 2;
        const calculatedInner = Math.max(0, outerRadius - desiredThickness);
        setCalculatedInnerRadius(calculatedInner);
      }
    };

    calculateInnerRadius();
    window.addEventListener('resize', calculateInnerRadius);
    
    return () => window.removeEventListener('resize', calculateInnerRadius);
  }, [desiredThickness]);

  const handleMetricChange = (metricIndex, value) => {
    setMetricSelections(prev => ({
      ...prev,
      [metricIndex]: value
    }));
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-white rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0">
        <div className='flex items-center gap-2 flex-shrink-0'>
          <Compass className="w-icon h-icon text-pb_darkgray" />
          <h3 className="text-sm font-semibold text-pb_darkgray">Playbook Score</h3>
        </div>
        <div className='flex items-center gap-1'>
          <CircleHelp className="w-icon-sm h-icon-sm text-pb_textgray" />
        </div>
      </div>
      {/* Main content: evenly spread inner components */}
      <div className="flex flex-col justify-between flex-1 h-full">
        {/* Donut Chart */}
        <div className="relative flex-1 basis-0 min-h-32 max-h-52">
          <ChartContainer
            ref={chartContainerRef}
            config={chartConfig}
            className="mx-auto h-full w-full p-0"
          >
            <PieChart 
              width="100%" 
              height="100%" 
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={scoreData.segments}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                innerRadius={calculatedInnerRadius}
                strokeWidth={8}
              />
            </PieChart>
          </ChartContainer>
          {/* Center Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-5xl font-bold text-gray-900">{scoreData.totalScore}</div>
          </div>
        </div>
        {/* Score Context */}
        <div className="flex items-center justify-between gap-2 flex-shrink-0 mdh:mt-5">
          {/* Standard */}
          <div className="flex items-center gap-1  rounded px-2 min-w-[90px]">
            <Trophy className="w-icon-xs h-icon-xs text-pb_textlightergray mr-1" />
            <span className="text-2xs text-pb_textlightergray font-medium">Standard</span>
            <span className="ml-2 text-xs font-bold text-pb_textlightergray">957</span>
          </div>
          {/* Redraft */}
          <div className="flex items-center gap-1  rounded px-2 min-w-[90px]">
            <Zap className="w-icon-xs h-icon-xs text-pb_textlightergray mr-1" />
            <span className="text-2xs text-pb_textlightergray font-medium">Redraft</span>
            <span className="ml-2 text-xs font-bold text-pb_textlightergray">999</span>
          </div>
        </div>
        {/* Separator between score context and metrics controls */}
        <Separator className="my-2" />
        {/* Metrics Section - now a single component */}
        <MetricControlsSection
          scoreData={scoreData}
          metricSelections={metricSelections}
          onMetricChange={handleMetricChange}
          className="px-1"
        />
      </div>
    </div>
  );
}