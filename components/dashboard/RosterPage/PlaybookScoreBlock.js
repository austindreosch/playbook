'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLeagueFormatDisplay, getSportConfig } from '@/lib/utils/sportConfig';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { CircleHelp, CircleQuestionMark, Compass, GitCommitHorizontal, Globe, Heart, HelpCircle, Settings, Shield, Trophy, Users, X, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Label, Pie, PieChart } from "recharts";

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

  // State for popup management
  const [showMetricsPopup, setShowMetricsPopup] = useState(false);

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

  const getButtonStyles = (option, selectedOption, buttonIndex) => {
    // Handle empty middle button (neutral)
    if (option === "") {
      return "data-[state=active]:bg-pb_lightergray data-[state=active]:text-pb_textgray bg-white text-pb_textlightestgray";
    }
    
    // Define styles based on button position: 0=positive (green), 2=negative (red)
    if (buttonIndex === 0) { // First button - positive
      return "data-[state=active]:bg-pb_green bg-white text-pb_textlightestgray hover:bg-gray-50";
    } else if (buttonIndex === 2) { // Third button - negative  
      return "data-[state=active]:bg-pb_red bg-white text-pb_textlightestgray hover:bg-gray-50";
    }
    
    // Fallback
    return "bg-white text-pb_textlightestgray hover:bg-gray-50";
  };

  // NEW: Metrics component for reuse
  const MetricsControls = ({ className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      {scoreData.metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <IconComponent className="w-icon-xs h-icon-xs text-pb_darkgray" />
              <span className="text-2xs text-pb_darkgray font-medium">{metric.label}</span>
            </div>
            <Tabs 
              value={metricSelections[index]} 
              onValueChange={(value) => handleMetricChange(index, value)}
              className="w-auto"
            >
              <TabsList className="h-auto p-0 border border-pb_lightgray grid w-32" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                {metric.options.map((option, buttonIndex) => (
                  <TabsTrigger
                    key={buttonIndex}
                    value={option}
                    className={`px-1.5 h-5 text-2xs font-medium data-[state=active]:text-white border-r border-pb_lightgray last:border-r-0 first:rounded-l last:rounded-r rounded-none w-full ${getButtonStyles(option, metricSelections[index], buttonIndex)}`}
                  >
                    {option || <GitCommitHorizontal className="w-icon-xs h-icon-xs text-pb_textlightestgray" />}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        );
      })}
    </div>
  );

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
      
      {/* Donut Chart */}
      <div className="relative flex-shrink-0 h-full max-h-60 min-h-40">
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
      <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0">
        {/* Standard */}
        <div className="flex items-center gap-1  rounded px-2 py-1 min-w-[90px]">
          <Trophy className="w-4 h-4 text-pb_gold mr-1" />
          <span className="text-2xs text-pb_textgray font-medium">Standard</span>
          <span className="ml-2 text-xs font-bold text-pb_darkgray">957</span>
        </div>
        {/* Redraft */}
        <div className="flex items-center gap-1  rounded px-2 py-1 min-w-[90px]">
          <Zap className="w-4 h-4 text-pb_blue mr-1" />
          <span className="text-2xs text-pb_textgray font-medium">Redraft</span>
          <span className="ml-2 text-xs font-bold text-pb_darkgray">999</span>
        </div>
      </div>


      {/* Metrics Section - Using height constraint classes */}
      <div className="smh:hidden mdh:block lgh:block">
        <div className="space-y-2 flex-shrink-0 mt-0">
          <MetricsControls className="mr-0 space-x-0 px-4" />
        </div>
      </div>
      
      <div className="smh:block mdh:hidden lgh:hidden flex-shrink-0 mt-3 flex justify-center">
        <Popover open={showMetricsPopup} onOpenChange={setShowMetricsPopup}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 text-xs text-pb_textgray hover:text-pb_darkgray hover:bg-gray-50 rounded border border-pb_lightergray transition-colors">
              <Settings className="w-4 h-4" />
              <span>Configure Metrics</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="center">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-pb_darkgray">Playbook Metrics</h4>
              <button 
                onClick={() => setShowMetricsPopup(false)}
                className="w-4 h-4 flex items-center justify-center hover:bg-gray-100 rounded"
              >
                <X className="w-3 h-3 text-pb_textgray" />
              </button>
            </div>
            <MetricsControls />
          </PopoverContent>
        </Popover>
      </div>





      
    </div>
  );
}