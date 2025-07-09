'use client';

import { Compass, Globe, Heart, HelpCircle, Shield, Users } from 'lucide-react';

export default function PlaybookScoreBlock() {
  // TODO: These values should come from actual data/calculations based on the sport
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
        selectedOption: "Prefer", 
        options: ["Prefer", "Dislike"] 
      },
      { 
        icon: Users, 
        label: "Prospect", 
        selectedOption: "Faith", 
        options: ["Faith", "Doubt"] 
      },
      { 
        icon: Shield, 
        label: "Injuries", 
        selectedOption: "Ironman", 
        options: ["Prone", "Ironman"] 
      },
      { 
        icon: Globe, 
        label: "Global Favor", 
        selectedOption: "Prefer", 
        options: ["Prefer", "Dislike"] 
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

  const getButtonStyles = (option, selectedOption, index) => {
    const isSelected = option === selectedOption;
    
    // Define color schemes for each metric based on the design
    const colorSchemes = {
      0: { // Favor
        prefer: isSelected ? "bg-green-500 text-white" : "bg-white text-gray-500 border border-gray-200",
        dislike: isSelected ? "bg-red-500 text-white" : "bg-white text-gray-500 border border-gray-200"
      },
      1: { // Prospect  
        faith: isSelected ? "bg-green-500 text-white" : "bg-white text-gray-500 border border-gray-200",
        doubt: isSelected ? "bg-red-500 text-white" : "bg-white text-gray-500 border border-gray-200"
      },
      2: { // Injuries
        prone: isSelected ? "bg-red-500 text-white" : "bg-white text-gray-500 border border-gray-200",
        ironman: isSelected ? "bg-red-500 text-white" : "bg-white text-gray-500 border border-gray-200"
      },
      3: { // Global Favor
        prefer: isSelected ? "bg-gray-700 text-white" : "bg-white text-gray-500 border border-gray-200",
        dislike: isSelected ? "bg-red-500 text-white" : "bg-white text-gray-500 border border-gray-200"
      }
    };
    
    const scheme = colorSchemes[index];
    return scheme[option.toLowerCase()] || "bg-white text-gray-500 border border-gray-200";
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
                <IconComponent className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-900 font-medium">{metric.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {metric.options.map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${getButtonStyles(option, metric.selectedOption, index)}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}