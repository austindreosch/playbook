'use client';

import TraitTag from '@/components/common/TraitTag';
import EmptyIcon from '@/components/icons/EmptyIcon';
import { Separator } from '@/components/ui/separator';
import { Activity, Bandage, BarChart3, Calendar, ClipboardMinus, Clock, Compass, Flame, Goal, Heart, Scale, ScanSearch, Shield, ShieldHalf, Sprout, Star, TimerReset, TrendingUp, Users, Watch, Zap } from 'lucide-react';

export default function PlayerProfileBlock() {
  // TODO: This data should come from selected player and be sport-agnostic
  const playerData = {
    name: "Nikola Jokic",
    positionRank: "#2",
    positionColor: "#ababef", // TODO: Map team colors by sport
    position: "C", // TODO: This should be team abbreviation 
    image: "/avatar-default.png", // TODO: Use actual player headshots
    // Grid stats
    mpg: "31.3",
    team: "DEN", 
    age: "29",
    rosterPercentage: "84%",
    playoffScheduleGrade: "A-",
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
      traitIds: ["star", "hot_streak", "usage_spike", "balanced", "elite_assists"] // TODO: Sport-specific trait IDs
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
      <div className="flex gap-3 mb-4">
        {/* Player Image */}
        <img 
          src={playerData.image} 
          alt={playerData.name}
          className="w-14 rounded-lg object-cover flex-shrink-0"
        />
        {/* Player Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-pb_blue">{playerData.name}</h4>
            <div className="flex items-center gap-1">
              <span className="text-2xs text-pb_textgray">{playerData.positionRank}</span>
              <div 
                className="w-4 h-4 rounded text-2xs text-pb_darkgray/80 flex items-center justify-center font-medium"
                style={{ backgroundColor: playerData.positionColor }}
              >
                {playerData.position}
              </div>
            </div>
          </div>
          
          <Separator className="my-1 mb1.5" />
          
          {/* Stats Grid - 2 rows x 3 columns */}
          <div className="grid grid-cols-3 grid-rows-2 gap-x-5 gap-y-2">
            {/* Top row */}
            <div className="grid grid-cols-3">
              <Watch className="col-span-1 w-icon-xs h-icon-xs flex justify-start my-auto text-pb_mddarkgray" />
              <div className="col-span-2 w-full text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.mpg || <EmptyIcon className="w-icon-xs h-icon-xs text-pb_textlightestgray" />}</div>
            </div>
            
            <div className="grid grid-cols-3">
              <ShieldHalf className="col-span-1 w-icon-xs h-icon-xs flex justify-start my-auto text-pb_mddarkgray" />
              <div className="col-span-2 w-full text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.team || <EmptyIcon className="w-icon-xs h-icon-xs text-pb_textlightestgray" />}</div>
            </div>
              
            <div className="grid grid-cols-3">
              <TimerReset className="col-span-1 w-icon-xs h-icon-xs flex justify-start my-auto text-pb_mddarkgray" />
              <div className="col-span-2 w-full text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.age || <EmptyIcon className="w-icon-xs h-icon-xs text-pb_textlightestgray" />}</div>
            </div>
              
            {/* Bottom row */}
            <div className="grid grid-cols-3">
              <Users className="col-span-1 w-icon-xs h-icon-xs flex justify-start my-auto text-pb_mddarkgray" />
              <div className="col-span-2 w-full text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.rosterPercentage || <EmptyIcon className="w-icon-xs h-icon-xs text-pb_textlightestgray" />}</div>
            </div>
              
            <div className="grid grid-cols-3">
              <Goal className="col-span-1 w-icon-xs h-icon-xs flex justify-start my-auto text-pb_mddarkgray" />
              <div className="col-span-2 w-full text-2xs font-medium text-pb_textlightergray flex items-center justify-center">{playerData.playoffScheduleGrade || <EmptyIcon className="w-icon-xs h-icon-xs text-pb_textlightestgray" />}</div>
            </div>
              
            <div className="grid grid-cols-3">
              <Bandage className="col-span-1 w-icon-xs h-icon-xs flex justify-start my-auto text-pb_mddarkgray" />
              <div className="col-span-2 w-full text-2xs font-medium text-pb_textlightergray flex items-center justify-center">
                <div className="w-6 h-4 bg-pb_green text-white text-2xs font-medium rounded-sm2 flex items-center justify-center">
                  H
                </div>
              </div>
            </div>
          </div>

          
        </div>

      </div>
      


      {/* Tags Section */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1 items-center justify-center">
          {playerData.tags.traitIds.map((traitId, index) => (
            <TraitTag key={index} traitId={traitId} />
          ))}
        </div>
      </div>
      
      {/* Value Comparison Table */}
      <div className="mb-6">
        <div className="flex gap-4">
          {/* Left side - Value rows */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="text-xs font-semibold text-pb_darkgray">Value</span>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-icon-sm h-icon-sm text-pb_textgray" />
                <Calendar className="w-icon-sm h-icon-sm text-pb_textgray" />
              </div>
            </div>
            <div className="space-y-2">
              {/* Playbook row (highlighted) */}
              <div className="flex items-center gap-2">
                <Compass className="w-icon-sm h-icon-sm text-pb_darkgray" />
                <span className="text-2xs font-semibold text-pb_darkgray">Playbook</span>
                <span className="text-2xs font-bold text-pb_darkgray ml-auto">981</span>
                <span className="text-2xs text-pb_darkgray w-4 text-center">3</span>
              </div>

              {/* Standard row (muted) */}
              <div className="flex items-center justify-center mx-auto text-center gap-2 opacity-50">
                <ClipboardMinus className="w-icon-sm h-icon-sm text-pb_textgray" />
                <span className="text-2xs font-medium text-pb_textgray">Standard</span>
                <span className="text-2xs text-pb_textgray ml-auto ">957</span>
                <span className="text-2xs text-pb_textgray w-4 text-center">4</span>
              </div>

              {/* Redraft row (muted) */}
              <div className="flex items-center gap-2 opacity-50">
                <Sprout className="w-icon-sm h-icon-sm text-pb_textgray" />
                <span className="text-2xs font-medium text-pb_textgray">Redraft</span>
                <span className="text-2xs text-pb_textgray ml-auto">999</span>
                <span className="text-2xs text-pb_textgray w-4 text-center">1</span>
              </div>
            </div>
          </div>

          {/* Right side - Change indicators */}
          <div className="flex flex-col justify-center text-center space-y-1 w-20">
            <div>
              <div className="text-md font-medium text-pb_green">▲ 6%</div>
              <div className="text-3xs text-pb_textgray leading-tight">Playbook<br />Differential</div>
            </div>
            <div>
              <div className="text-md font-medium text-pb_red">▼ 2%</div>
              <div className="text-3xs text-pb_textgray leading-tight">Value Over<br />Last 30</div>
            </div>
          </div>
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