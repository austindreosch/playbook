import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { baseball, basketball, football } from "@lucide/lab";
import { BookCheck, BookCopy, Check, CheckCircle, ChevronsUpDown, CircleCheck, createLucideIcon, Search, Users, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const Basketball = createLucideIcon('basketball', basketball);
const Football = createLucideIcon('football', football);
const Baseball = createLucideIcon('baseball', baseball);

// Function to get sport icon
const getSportIcon = (sport, className = "w-5 h-5") => {
  const iconClass = className.includes('text-') ? className : `${className} text-pb_darkgray`;
  
  switch (sport?.toLowerCase()) {
    case 'nba':
      return <Basketball className={iconClass} />;
    case 'nfl':
      return <Football className={iconClass} />;
    case 'mlb':
      return <Baseball className={iconClass} />;
    default:
      return <Users className={iconClass} />;
  }
};

export default function LeagueSelectorButton({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);

  // =================================================================
  // CONTEXT STORE
  // =================================================================
  // ---- INCOMING DATA ----
  const currentView = useDashboardContext((state) => state.currentView);
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const leagues = useDashboardContext((state) => state.leagues);
  
  // ---- OUTGOING DATA ----
  const setCurrentLeague = useDashboardContext((state) => state.setCurrentLeague);

  // =================================================================
  // COMPUTED VALUES
  // =================================================================
  const isLeagueView = currentView === 'league';
  const currentLeague = leagues.find(league => 
    league.leagueDetails?.leagueName === currentLeagueId
  );
  const displayName = currentLeague?.leagueDetails?.leagueName || 'Select League';

  // =================================================================
  // EVENT HANDLERS
  // =================================================================
  const handleLeagueSelect = (leagueName) => {
    console.log('🔄 League selected:', leagueName);
    setCurrentLeague(leagueName);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    console.log('🖱️ Button clicked');
    
    // If not in league view, directly enter the current league
    if (!isLeagueView) {
      if (currentLeagueId) {
        console.log('🔄 Entering current league:', currentLeagueId);
        setCurrentLeague(currentLeagueId);
      }
      return;
    }
    
    // If already in league view, show dropdown to switch leagues
    setIsOpen(!isOpen);
    setSearchQuery(''); // Clear search when opening
  };

  // Filter leagues based on search query
  const filteredLeagues = leagues.filter(league => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const leagueName = league.leagueDetails?.leagueName?.toLowerCase() || '';
    const sport = league.leagueDetails?.sport?.toLowerCase() || '';
    const format = league.leagueDetails?.format?.toLowerCase() || '';
    const platform = league.leagueDetails?.platform?.toLowerCase() || '';
    
    return leagueName.includes(query) || 
           sport.includes(query) || 
           format.includes(query) || 
           platform.includes(query);
  }).sort((a, b) => {
    // Sort so the currently selected league appears first
    const aIsSelected = a.leagueDetails?.leagueName === currentLeagueId;
    const bIsSelected = b.leagueDetails?.leagueName === currentLeagueId;
    
    if (aIsSelected && !bIsSelected) return -1;
    if (!aIsSelected && bIsSelected) return 1;
    
    // If neither or both are selected, maintain original order
    return 0;
  });

  // Optional: Focus search input when dropdown opens (disabled for better UX)
  // useEffect(() => {
  //   if (isOpen && searchInputRef.current) {
  //     setTimeout(() => {
  //       searchInputRef.current?.focus();
  //     }, 100);
  //   }
  // }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Debug logging
  console.log('🔍 LeagueSelectorButton Debug:', {
    currentView,
    currentLeagueId,
    leaguesCount: leagues.length,
    displayName,
    isLeagueView,
    isOpen
  });

  // =================================================================
  // RENDER
  // =================================================================
  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={handleButtonClick}
        className={`flex items-center justify-between px-3 rounded-md border shadow-sm select-none transition-colors duration-200 ${
          isLeagueView 
            ? 'border-pb_lightgray bg-pb_lightestgray hover:bg-pb_lightgray hover:border-pb_textgray' 
            : 'border-pb_lightgray bg-white hover:bg-pb_lightestgray'
        } ${className}`.trim()}
      >
        <div className="flex items-center gap-3">
          <div className="hidden xl:inline">
            {currentLeague ? getSportIcon(currentLeague.leagueDetails?.sport) : <Basketball className="w-5 h-5 text-pb_darkgray" />}
          </div>
          <span className="hidden mdlg:inline text-sm font-semibold text-pb_darkgray mr-2 truncate text-left max-w-[7rem] xl:max-w-[8rem] 2xl:max-w-[13rem] 2xl:w-52">
            {displayName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ChevronsUpDown className="w-4 h-4 text-pb_darkgray hidden 2xl:inline" />
          <BookCopy className="w-5 h-5 text-pb_darkgray" />
        </div>
      </button>

      {/* Custom Floating Dropdown */}
      {isOpen && (
                  <div 
          className="absolute top-full right-0 mt-1 w-80 bg-white border border-pb_lightgray rounded-md shadow-md z-[10001] max-h-96 overflow-y-auto text-pb_darkgray animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          style={{
            position: 'absolute',
            zIndex: 10001
          }}
        >
          {/* Search Input */}
          <div className="pb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pb_mddarkgray" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search your leagues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm border-0 bg-transparent text-pb_darkgray placeholder:text-pb_mddarkgray focus:outline-none"
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              />
            </div>
          </div>
          
          {/* Separator */}
          <div className="mx-0 my-0 h-px bg-pb_lightgray"></div>
          
          {/* League Items */}
          {filteredLeagues.length === 0 ? (
            <div className="relative flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <span className="text-sm text-pb_mddarkgray">
                {searchQuery ? `No leagues found for "${searchQuery}"` : 'No leagues available'}
              </span>
            </div>
          ) : (
            filteredLeagues.map((league, index) => {
              const leagueName = league.leagueDetails?.leagueName;
              const sport = league.leagueDetails?.sport;
              const format = league.leagueDetails?.format;
              const platform = league.leagueDetails?.platform;
              const teamSize = league.leagueDetails?.teamSize;
              const isSelected = leagueName === currentLeagueId; //This will be changed for real leagueIds later
              
              return (
                                 // League Item
                  <div
                    key={index}
                    onClick={() => handleLeagueSelect(leagueName)}
                    className={`group relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 m-1 py-7 max-h-4 text-sm outline-none transition-colors ${
                      isSelected 
                        ? 'bg-pb_lightergray text-pb_darkgray hover:bg-pb_lightgray focus:bg-pb_lightgray' 
                        : 'text-pb_darkgray hover:bg-pb_backgroundgray hover:text-pb_darkgray'
                    }`}
                >
                                                        {/* Sport Icon & Container */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mr-0.5 transition-colors
                      ${isSelected ? ' text-white group-hover:bg-lightgray' : 'bg-pb_backgroundgray border border-pb_lightgray text-pb_darkgray'}`}>
                    {getSportIcon(sport, isSelected ? 'w-5.5 h-5.5 text-pb_darkgray' : 'w-5 h-5 text-pb_darkgray')}
                  </div>

                  {/* League Name & Format */}
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">
                        {leagueName}
                      </span>
                    </div>
                    <span className={`text-xs ${isSelected ? 'text-pb_midgray' : 'text-pb_textgray'}`}>
                      {format} • {platform} {teamSize ? `• ${teamSize} Team` : ''}
                    </span>
                  </div>

                  {/* Check Mark for Selected League */}
                  {isSelected && (
                    <div className="flex items-center justify-center mr-1">
                      <BookCheck className="w-5 h-5 text-pb_darkgray" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
} 