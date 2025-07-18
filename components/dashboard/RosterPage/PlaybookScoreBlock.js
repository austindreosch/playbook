'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleHelp, CircleQuestionMark, Compass, GitCommitHorizontal, Globe, Heart, HelpCircle, Shield, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Label, Pie, PieChart } from "recharts";

export default function PlaybookScoreBlock() {
  // TODO: These values should come from actual data/calculations based on the sport
  const [metricSelections, setMetricSelections] = useState({
    0: "Prefer",  // Favor
    1: "Faith",   // Prospect  
    2: "Ironman", // Injuries
    3: "Prefer"   // Global Favor
  });
  
  const [calculatedInnerRadius, setCalculatedInnerRadius] = useState(50);
  const chartContainerRef = useRef(null);
  const desiredThickness = 40; // Desired thickness in pixels

  const scoreData = {
    totalScore: 981,
    leagueFormat: "Dynasty • H2H • Categories",
    teamStatus: "Contending",
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

  return (
    <div className="w-full h-full bg-white rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col bg-white">
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
      
      {/* League format and status */}
      {/* <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          <span>{scoreData.leagueFormat}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          <span>{scoreData.teamStatus}</span>
        </div>
      </div> */}
      
            {/* Donut Chart */}
      <div className="flex justify-center mb-3 relative flex-1 items-center">
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
          {/* <div className="text-xs text-gray-500">Playbook Score</div> */}
        </div>
      </div>
      
      {/* Metrics Rows */}
      <div className="space-y-2 flex-shrink-0 overflow-auto max-h-32">
        {scoreData.metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconComponent className="w-icon-xs h-icon-xs text-pb_darkgray" />
                <span className="text-xs text-pb_darkgray font-medium">{metric.label}</span>
              </div>
              <Tabs 
                value={metricSelections[index]} 
                onValueChange={(value) => handleMetricChange(index, value)}
                className="w-auto"
              >
                <TabsList className="h-auto p-0  border border-pb_lightgray grid w-36" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                  {metric.options.map((option, buttonIndex) => (
                    <TabsTrigger
                      key={buttonIndex}
                      value={option}
                      className={`px-2 h-6 text-2xs font-medium data-[state=active]:text-white border-r border-pb_lightgray last:border-r-0 first:rounded-l last:rounded-r rounded-none w-full ${getButtonStyles(option, metricSelections[index], buttonIndex)}`}
                    >
                      {option || <GitCommitHorizontal className="w-icon-sm h-icon-sm text-pb_textlightestgray" />}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          );
        })}
      </div>
    </div>
  );
}