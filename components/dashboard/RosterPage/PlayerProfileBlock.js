'use client';

import { Activity, BarChart3, Calendar, Flame, Scale, ScanSearch, Star, TrendingUp, Zap } from 'lucide-react';

export default function PlayerProfileBlock() {
  // TODO: This data should come from selected player and be sport-agnostic
  const playerData = {
    name: "Nikola Jokic",
    jerseyNumber: "#2",
    teamColor: "#1d428a", // TODO: Map team colors by sport
    teamAbbrev: "C", // TODO: This should be team abbreviation 
    image: "/avatar-default.png", // TODO: Use actual player headshots
    stats: {
      primary: [
        { value: "27.6", label: "PPG" }, // TODO: Sport-specific primary stats
        { value: "PHI", label: "Team" },
        { value: "31.3", label: "MPG" }
      ],
      secondary: [
        { value: "99%", label: "Health" },
        { value: "A+", label: "Grade" },
        { value: "H", label: "Trend", isPositive: true }
      ]
    },
    tags: {
      attributes: ["Balanced", "Elite Positional Assists"], // TODO: Sport-specific attributes
      status: ["Star", "Hot Streak", "Usage Spike"] // TODO: Dynamic status tags
    },
    valueComparisons: [
      {
        type: "Playbook",
        value: 981,
        rank: 3,
        change: "+6%",
        changeType: "positive",
        subtitle: "Playbook Differential"
      },
      {
        type: "Standard", 
        value: 957,
        rank: 4,
        change: "2%",
        changeType: "negative",
        subtitle: "Value Over Last 30"
      },
      {
        type: "Redraft",
        value: 999,
        rank: 1,
        change: null,
        changeType: null,
        subtitle: null
      }
    ],
    historicalData: {
      currentView: "Stats", // "Stats" or "Value"
      dataPoints: [
        { period: 1, value: 120 },
        { period: 2, value: 95 },
        { period: 3, value: 145 },
        { period: 4, value: 130 }
      ],
      yAxisMin: 60,
      yAxisMax: 160
    }
  };

  const getTagIcon = (tag) => {
    // TODO: Map icons based on tag types for different sports
    const iconMap = {
      "Star": Star,
      "Hot Streak": Flame,
      "Usage Spike": Activity,
      "Balanced": Scale,
      "Elite Positional Assists": Zap
    };
    return iconMap[tag] || Activity;
  };

  const createLineChart = () => {
    const { dataPoints, yAxisMin, yAxisMax } = playerData.historicalData;
    const width = 280;
    const height = 80;
    const padding = 20;
    
    const xStep = (width - padding * 2) / (dataPoints.length - 1);
    const yRange = yAxisMax - yAxisMin;
    
    const points = dataPoints.map((point, index) => {
      const x = padding + (index * xStep);
      const y = height - padding - ((point.value - yAxisMin) / yRange) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="w-full">
        {/* Grid line at middle */}
        <line 
          x1={padding} 
          y1={height/2} 
          x2={width-padding} 
          y2={height/2} 
          stroke="#d7d7d7" 
          strokeDasharray="2,2"
        />
        {/* Chart line */}
        <polyline
          points={points}
          fill="none"
          stroke="#59cd90"
          strokeWidth="2"
        />
        {/* Data points */}
        {dataPoints.map((point, index) => {
          const x = padding + (index * xStep);
          const y = height - padding - ((point.value - yAxisMin) / yRange) * (height - padding * 2);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#59cd90"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3">
      <div className="flex items-center gap-2 mb-3">
        <ScanSearch className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Player Profile</h3>
      </div>
      
      {/* Player Info Section */}
      <div className="flex items-start gap-3 mb-4">
        <img 
          src={playerData.image} 
          alt={playerData.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-pb_darkgray">{playerData.name}</h4>
            <div className="flex items-center gap-1">
              <span className="text-2xs text-pb_textgray">{playerData.jerseyNumber}</span>
              <div 
                className="w-4 h-4 rounded text-2xs text-white flex items-center justify-center font-medium"
                style={{ backgroundColor: playerData.teamColor }}
              >
                {playerData.teamAbbrev}
              </div>
            </div>
          </div>
          
          {/* Primary Stats Row */}
          <div className="flex items-center justify-between mb-1">
            {playerData.stats.primary.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xs font-medium text-pb_darkgray">{stat.value}</div>
              </div>
            ))}
          </div>
          
          {/* Secondary Stats Row */}
          <div className="flex items-center justify-between">
            {playerData.stats.secondary.map((stat, index) => (
              <div key={index} className="text-center">
                {stat.label === "Trend" ? (
                  <div className={`text-2xs font-medium px-1 py-0.5 rounded ${stat.isPositive ? 'bg-pb_green text-white' : 'bg-pb_red text-white'}`}>
                    {stat.value}
                  </div>
                ) : (
                  <div className="text-2xs font-medium text-pb_darkgray">{stat.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tags Section */}
      <div className="mb-4">
        {/* Attribute Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {playerData.tags.attributes.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-pb_lightergray text-2xs text-pb_textgray rounded font-medium">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Status Tags */}
        <div className="flex flex-wrap gap-1">
          {playerData.tags.status.map((tag, index) => {
            const IconComponent = getTagIcon(tag);
            return (
              <div key={index} className="flex items-center gap-1 px-2 py-1 bg-pb_lightergray text-2xs text-pb_textgray rounded">
                <IconComponent className="w-3 h-3" />
                <span className="font-medium">{tag}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Value Comparison Table */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-pb_darkgray">Value</span>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3 h-3 text-pb_textgray" />
            <Calendar className="w-3 h-3 text-pb_textgray" />
          </div>
        </div>
        
        <div className="space-y-1">
          {playerData.valueComparisons.map((comparison, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanSearch className="w-3 h-3 text-pb_textgray" />
                <span className="text-2xs font-medium text-pb_darkgray">{comparison.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xs font-semibold text-pb_darkgray">{comparison.value}</span>
                <span className="text-2xs text-pb_textgray w-4 text-center">{comparison.rank}</span>
                {comparison.change && (
                  <div className="text-right min-w-12">
                    <div className={`text-2xs font-medium ${comparison.changeType === 'positive' ? 'text-pb_green' : 'text-pb_red'}`}>
                      {comparison.changeType === 'negative' ? '▼' : ''} {comparison.change}
                    </div>
                    {comparison.subtitle && (
                      <div className="text-3xs text-pb_textgray">{comparison.subtitle}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Historical View */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-pb_darkgray">Historical View</span>
          <div className="flex rounded border border-pb_lightgray">
            <button className="px-2 py-1 text-2xs font-medium bg-pb_lightergray text-pb_darkgray rounded-l">
              Stats
            </button>
            <button className="px-2 py-1 text-2xs font-medium text-pb_textgray rounded-r">
              Value
            </button>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-20 flex flex-col justify-between text-3xs text-pb_textgray">
            <span>{playerData.historicalData.yAxisMax}</span>
            <span>{playerData.historicalData.yAxisMin}</span>
          </div>
          
          {/* Chart */}
          <div className="ml-6">
            {createLineChart()}
          </div>
        </div>
      </div>
    </div>
  );
} 