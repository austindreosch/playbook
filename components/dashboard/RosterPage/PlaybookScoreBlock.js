'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Compass, GitCommitHorizontal, Globe, Heart, HelpCircle, Shield, Users } from 'lucide-react';
import { useState } from 'react';

export default function PlaybookScoreBlock() {
  // TODO: These values should come from actual data/calculations based on the sport
  const [metricSelections, setMetricSelections] = useState({
    0: "Prefer",  // Favor
    1: "Faith",   // Prospect  
    2: "Ironman", // Injuries
    3: "Prefer"   // Global Favor
  });

  const scoreData = {
    totalScore: 981,
    leagueFormat: "Dynasty • H2H • Categories",
    teamStatus: "Contending",
    segments: [
      { value: 45, color: "#4A90E2" }, // blue segment
      { value: 55, color: "#F5A623" }, // orange/yellow segment
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

  // Create SVG donut chart
  const createDonutChart = () => {
    const radius = 70;
    const strokeWidth = 24;
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    
    let currentAngle = 0;
    
    return scoreData.segments.map((segment, index) => {
      const strokeDasharray = `${(segment.value / 100) * circumference} ${circumference}`;
      const rotation = currentAngle;
      currentAngle += (segment.value / 100) * 360;
      
      return (
        <circle
          key={index}
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke={segment.color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={0}
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${radius}px ${radius}px`,
          }}
        />
      );
    });
  };

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
    <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Playbook Score</h3>
        </div>
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </div>
      
      {/* League format and status */}
      <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
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
      </div>
      
      {/* Donut Chart */}
      <div className="flex justify-center mb-6 relative">
        <div className="relative">
          <svg width="140" height="140" className="transform -rotate-90">
            {createDonutChart()}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-mono font-bold text-gray-900">{scoreData.totalScore}</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-8">
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {/* Metrics Rows */}
      <div className="space-y-3">
        {scoreData.metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconComponent className="w-icon-sm h-icon-sm text-pb_darkgray" />
                <span className="text-button text-pb_darkgray font-medium">{metric.label}</span>
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