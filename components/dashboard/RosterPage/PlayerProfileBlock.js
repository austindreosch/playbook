'use client';

import TraitTag from '@/components/common/TraitTag';
import EmptyIcon from '@/components/icons/EmptyIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { formatStatValue, getSportConfig, getSportPrimaryStats, getSportTraits } from '@/lib/utils/sportConfig';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Activity, Bandage, BarChart3, Calendar, ChevronRight, ClipboardMinus, Clock, Compass, Flame, Goal, Heart, MoreHorizontal, Scale, ScanSearch, Shield, ShieldHalf, Sprout, Star, TimerReset, TrendingUp, Users, Watch, X, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function PlayerProfileBlock() {
  const { getCurrentLeague, getSelectedPlayer } = useDashboardContext();
  const currentLeague = getCurrentLeague();
  const selectedPlayer = getSelectedPlayer();
  
  // Get sport configuration
  const sportConfig = useMemo(() => {
    const sport = currentLeague?.leagueDetails?.sport || 'nba';
    return getSportConfig(sport);
  }, [currentLeague?.leagueDetails?.sport]);
  
  const primaryStats = getSportPrimaryStats(currentLeague?.leagueDetails?.sport || 'nba');
  const sportTraits = getSportTraits(currentLeague?.leagueDetails?.sport || 'nba');
  
  // TODO: This data should come from selected player and be sport-agnostic
  // For now, using dummy data but structured to be easily replaceable
  const playerData = useMemo(() => {
    // If we have a selected player, use their data, otherwise use dummy data
    const dummyPlayer = {
      name: "Nikola Jokic",
      positionRank: "#2",
      positionColor: "#ababef", // TODO: Map position colors by sport
      position: "C", // TODO: This should be position abbreviation 
      image: "/avatar-default.png", // TODO: Use actual player headshots
    // Grid stats
    mpg: "31.3",
    team: "DEN", 
    age: "29",
    rosterPercentage: "84%",
    playoffScheduleGrade: "A-",
    stats: {
      // Use sport-specific primary stats from config
      primary: [
        ...primaryStats.slice(0, 3).map(stat => ({
          value: "27.6", // TODO: Replace with actual player stat value
          label: stat.label
        })),
        { value: "DEN", label: "Team" }
      ],
      secondary: [
        { value: "99%", label: "Health" },
        { value: "A+", label: "Grade" },
        { value: "H", label: "Trend", isPositive: true }
      ]
    },
    tags: {
      // Use sport-specific traits from config
      traitIds: [
        ...sportTraits
      ]
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
    
    // TODO: Replace dummy data with actual selected player data when available
    return selectedPlayer || dummyPlayer;
  }, [selectedPlayer, primaryStats, sportTraits]);

  const tagsContainerRef = useRef(null);
  const hiddenMeasureRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [visibleTagsCount, setVisibleTagsCount] = useState(playerData.tags.traitIds.length);

  // Calculate how many tags can fit dynamically by measuring actual widths
  useEffect(() => {
    const calculateVisibleTags = () => {
      const screenHeight = window.innerHeight;
      const isSmall = screenHeight <= 650;
      setIsSmallScreen(isSmall);

      if (!tagsContainerRef.current || !hiddenMeasureRef.current) return;

      const containerWidth = tagsContainerRef.current.offsetWidth;
      const gap = 4;
      const viewAllButtonWidth = 70; // Approximate View All button width
      
      // Measure actual tag widths
      const tagElements = hiddenMeasureRef.current.children;
      const totalTags = playerData.tags.traitIds.length;
      
      console.log('Dynamic calc:', { containerWidth, totalTags, isSmall });
      
      if (isSmall) {
        // Small screens: 1 row only - fit as many as possible with View All
        let currentWidth = 0;
        let fittingTags = 0;
        
        for (let i = 0; i < tagElements.length; i++) {
          const tagWidth = tagElements[i].offsetWidth;
          const neededWidth = currentWidth + tagWidth + (fittingTags > 0 ? gap : 0);
          
          // Check if we can fit this tag + View All button
          if (neededWidth + gap + viewAllButtonWidth <= containerWidth) {
            currentWidth = neededWidth;
            fittingTags++;
          } else {
            break;
          }
        }
        
        console.log('Small screen: fitting', fittingTags, 'tags');
        setVisibleTagsCount(Math.min(fittingTags, totalTags));
        
      } else {
        // Large screens: 3 rows max - count tags that fit in 3 rows, reserve space for View All
        let currentRowWidth = 0;
        let currentRow = 1;
        let fittingTags = 0;
        
        for (let i = 0; i < tagElements.length; i++) {
          const tagWidth = tagElements[i].offsetWidth;
          const neededWidth = currentRowWidth + tagWidth + (currentRowWidth > 0 ? gap : 0);
          
          if (neededWidth <= containerWidth) {
            // Fits in current row
            currentRowWidth = neededWidth;
            fittingTags++;
          } else if (currentRow < 3) {
            // Start new row
            currentRow++;
            currentRowWidth = tagWidth;
            fittingTags++;
          } else {
            // Would exceed 3 rows
            break;
          }
        }
        
        // Reserve space for View All button
        const maxVisibleTags = Math.max(0, fittingTags - 1);
        console.log('Large screen: fitting', maxVisibleTags, 'tags in 3 rows');
        setVisibleTagsCount(maxVisibleTags);
      }
    };

    calculateVisibleTags();
    window.addEventListener('resize', calculateVisibleTags);
    
    const timer = setTimeout(calculateVisibleTags, 100);
    
    return () => {
      window.removeEventListener('resize', calculateVisibleTags);
      clearTimeout(timer);
    };
  }, [playerData.tags.traitIds]);


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
    <div className="w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <ScanSearch className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">Player Profile</h3>
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

      {/* --- REFACTORED TAGS SECTION --- */}
      <div className="mb-4 flex-shrink-0 w-full">
        {/* Hidden container for measuring actual tag widths */}
        <div 
          ref={hiddenMeasureRef}
          className="absolute invisible pointer-events-none flex flex-wrap gap-1"
          style={{ width: tagsContainerRef.current?.offsetWidth || '100%' }}
        >
          {playerData.tags.traitIds.map((traitId, index) => (
            <TraitTag key={`measure-${index}`} traitId={traitId} />
          ))}
        </div>

        {/* Visible tags container - only render calculated number of tags */}
        <div 
          ref={tagsContainerRef}
          className="flex gap-1 flex-wrap"
          style={isSmallScreen ? { 
            height: '24px', // Exact height for one row
            flexWrap: 'nowrap'
          } : {
            maxHeight: '84px', // 3 rows max on larger screens
            alignContent: 'flex-start'
          }}
        >
          {/* Render only the visible tags */}
          {playerData.tags.traitIds.slice(0, visibleTagsCount).map((traitId, index) => (
            <TraitTag key={index} traitId={traitId} className="flex-shrink-0" />
          ))}
          
          {/* View All button - show when there are more tags than visible */}
          {visibleTagsCount < playerData.tags.traitIds.length && (
            <Popover open={showPopover} onOpenChange={setShowPopover}>
              <PopoverTrigger asChild>
                <button className="flex items-center px-2 h-6 text-2xs text-white bg-pb_blue hover:bg-pb_darkblue rounded border border-pb_blue flex-shrink-0">
                  <span>View All</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto max-w-80 p-3" align="start">
                <div className="flex flex-wrap gap-1">
                  {playerData.tags.traitIds.map((traitId, index) => (
                    <TraitTag key={`popover-${index}`} traitId={traitId} showTooltip={false} />
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

          {/* Right side - Change indicators */}
          <div className="flex flex-row justify-between text-center w-full px-1">
            <div className="flex flex-col justify-center items-center text-center flex-1">
              <div className="text-sm font-medium text-pb_green">▲ 6%</div>
              <div className="text-3xs text-pb_textgray leading-tight">Playbook<br />Differential</div>
            </div>
            <div className="w-px h-8 bg-pb_lightgray self-center"></div>
            <div className="flex flex-col justify-center items-center text-center flex-1">
              <div className="text-sm font-medium text-pb_red">▼ 2%</div>
              <div className="text-3xs text-pb_textgray leading-tight">Value Over<br />Last 30</div>
            </div>
            <div className="w-px h-8 bg-pb_lightgray self-center"></div>
            <div className="flex flex-col justify-center items-center text-center flex-1">
              <div className="text-sm font-medium text-pb_red">▼ 21%</div>
              <div className="text-3xs text-pb_textgray leading-tight">Performance vs.<br />Offseason Proj.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical View - Always visible, but compact when height constrained */}
      <div className="w-full bg-white border border-pb_lightgray rounded-lg px-2 pt-1 relative overflow-hidden flex-1 min-h-20 max-h-32 flex flex-col">
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




    </div>
  );
} 