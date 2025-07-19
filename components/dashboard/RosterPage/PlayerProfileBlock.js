'use client';

import TraitTag from '@/components/common/TraitTag';
import EmptyIcon from '@/components/icons/EmptyIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Activity, Bandage, BarChart3, Calendar, ChevronRight, ClipboardMinus, Clock, Compass, Flame, Goal, Heart, MoreHorizontal, Scale, ScanSearch, Shield, ShieldHalf, Sprout, Star, TimerReset, TrendingUp, Users, Watch, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function PlayerProfileBlock() {
  // NEW: State for height detection and tag management
  const containerRef = useRef(null);
  const tagsRef = useRef(null);
  const [isHeightConstrained, setIsHeightConstrained] = useState(false);
  const [visibleTagsCount, setVisibleTagsCount] = useState(null);
  const [showTagsPopover, setShowTagsPopover] = useState(false);

  // NEW: Effect to monitor container height and determine tag truncation
  useEffect(() => {
    const updateHeightConstraints = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerHeight = rect.height;
        
        // More intelligent constraint detection:
        // Based on debug measurements: in 730px main content, top row gets ~438px
        // For 620px window, top row would get ~338px (620 * 0.6 = 372, minus gaps ~338px)
        // So we should compact when height is less than 380px to handle 620px scenario
        const constrained = containerHeight < 500; // Temporarily high for testing
        setIsHeightConstrained(constrained);
        
        // When constrained, show only 2 tags max to ensure single row
        if (constrained) {
          setVisibleTagsCount(2);
        } else {
          setVisibleTagsCount(null); // Show all tags when not constrained
        }
      }
    };

    updateHeightConstraints();
    window.addEventListener('resize', updateHeightConstraints);
    
    // Delay to ensure DOM is ready and measure properly
    const timer = setTimeout(updateHeightConstraints, 300);
    
    return () => {
      window.removeEventListener('resize', updateHeightConstraints);
      clearTimeout(timer);
    };
  }, []);

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
    <div ref={containerRef} className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <ScanSearch className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Player Profile</h3>
        {/* NEW: Height constraint indicator */}
        {isHeightConstrained && (
          <span className="text-3xs text-pb_textgray">
            (Compact)
          </span>
        )}
      </div>
      
      {/* Player Info Section */}
      <div className="flex gap-3 mb-4 flex-shrink-0">
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
          
          <Separator className="my-1 mb-1.5" />
          
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

      {/* Tags Section - Height Responsive */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-1">
          <div ref={tagsRef} className={`flex gap-1 items-center justify-start flex-1 ${isHeightConstrained ? 'flex-nowrap overflow-hidden' : 'flex-wrap'}`}>
            {playerData.tags.traitIds
              .slice(0, visibleTagsCount || playerData.tags.traitIds.length)
              .map((traitId, index) => (
                <TraitTag key={index} traitId={traitId} />
              ))}
          </div>
          
          {/* Show More Button - Only when tags are truncated */}
          {visibleTagsCount && visibleTagsCount < playerData.tags.traitIds.length && (
            <Popover open={showTagsPopover} onOpenChange={setShowTagsPopover}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 px-2 py-1 text-3xs text-pb_textgray hover:text-pb_darkgray hover:bg-gray-50 rounded border border-pb_lightergray transition-colors">
                  <span>+{playerData.tags.traitIds.length - visibleTagsCount}</span>
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-pb_darkgray">All Player Traits</h4>
                  <button 
                    onClick={() => setShowTagsPopover(false)}
                    className="w-4 h-4 flex items-center justify-center hover:bg-gray-100 rounded"
                  >
                    <X className="w-3 h-3 text-pb_textgray" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {playerData.tags.traitIds.map((traitId, index) => (
                    <TraitTag key={index} traitId={traitId} />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      {/* Value Comparison Table */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex gap-4">
          {/* Left side - Value rows */}
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-pb_darkgray flex-1">Value</span>
              <div className="w-10 flex justify-center">
                <BarChart3 className="w-icon-sm h-icon-sm text-pb_textgray" />
              </div>
              <div className="w-6 flex justify-center">
                <Calendar className="w-icon-sm h-icon-sm text-pb_textgray" />
              </div>
            </div>
            <div className="space-y-2">
              {/* Playbook row (highlighted) */}
              <div className="flex items-center gap-2">
                <Compass className="w-icon-sm h-icon-sm text-pb_darkgray" />
                <span className="text-2xs font-semibold text-pb_darkgray flex-1">Playbook</span>
                <div className="w-10 flex justify-center">
                  <span className="text-2xs font-bold text-pb_darkgray">981</span>
                </div>
                <div className="w-6 flex justify-center">
                  <span className="text-2xs text-pb_darkgray">3</span>
                </div>
              </div>

              {/* Standard row (muted) */}
              <div className="flex items-center gap-2 opacity-50">
                <ClipboardMinus className="w-icon-sm h-icon-sm text-pb_textgray" />
                <span className="text-2xs font-medium text-pb_textgray flex-1">Standard</span>
                <div className="w-10 flex justify-center">
                  <span className="text-2xs text-pb_textgray">957</span>
                </div>
                <div className="w-6 flex justify-center">
                  <span className="text-2xs text-pb_textgray">4</span>
                </div>
              </div>

              {/* Redraft row (muted) */}
              <div className="flex items-center gap-2 opacity-50">
                <Sprout className="w-icon-sm h-icon-sm text-pb_textgray" />
                <span className="text-2xs font-medium text-pb_textgray flex-1">Redraft</span>
                <div className="w-10 flex justify-center">
                  <span className="text-2xs text-pb_textgray">999</span>
                </div>
                <div className="w-6 flex justify-center">
                  <span className="text-2xs text-pb_textgray">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Change indicators */}
          <div className="flex flex-col justify-center text-center space-y-1 w-20">
            <div>
              <div className="text-sm font-medium text-pb_green">▲ 6%</div>
              <div className="text-3xs text-pb_textgray leading-tight">Playbook<br />Differential</div>
            </div>
            <div>
              <div className="text-sm font-medium text-pb_red">▼ 2%</div>
              <div className="text-3xs text-pb_textgray leading-tight">Value Over<br />Last 30</div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical View - Collapsible when height constrained */}
      {!isHeightConstrained ? (
        <div className="relative flex-1 border border-pb_lightergray rounded bg-pb_backgroundgray min-h-0">
          <div className="absolute top-1.5 left-2.5 text-3xs text-pb_textlightestgray leading-none z-10">Historical View</div>
          <div className="absolute top-1.5 right-2.5 z-10">
            <div className="flex rounded border border-pb_lightgray">
              <button className="px-1.5 py-0.5 text-3xs font-medium bg-pb_lightergray text-pb_darkgray rounded-l">
                Stats
              </button>
              <button className="px-1.5 py-0.5 text-3xs font-medium text-pb_textgray rounded-r">
                Value
              </button>
            </div>
          </div>
          
          {/* Chart Container */}
          <div className="flex-1 w-full mt-3 flex items-end">
            {createLineChart()}
          </div>
        </div>
      ) : (
        <div className="text-center py-2 text-3xs text-pb_textgray border border-pb_lightergray rounded bg-pb_backgroundgray">
          Historical View (hidden in compact mode)
        </div>
      )}
    </div>
  );
} 