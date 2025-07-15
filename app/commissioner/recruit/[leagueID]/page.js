'use client';

import { baseball, basketball, football, lunchBox } from "@lucide/lab";
const Basketball = createLucideIcon('basketball', basketball);
const Football = createLucideIcon('football', football);
const Baseball = createLucideIcon('baseball', baseball); 
const Lunchbox = createLucideIcon('lunchbox', lunchBox);

import FantraxIcon from '@/components/icons/FantraxIcon';
import LeagueSafeIcon from '@/components/icons/LeagueSafeIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, AlertTriangle, AlignHorizontalDistributeCenter, AlignLeft, ArrowRight, ArrowRightLeft, AtSign, Binoculars, Book, BookMarked, BookOpenText, Boxes, Calendar, ChartBarStacked, ChartCandlestick, ClipboardList, Clock, ContactRound, createLucideIcon, ExternalLink, Eye, FileText, Flag, FlagTriangleRight, FormData, Goal, Grid2X2X, Handshake, LandPlot, LucideClipboardSignature, Mail, Mailbox, MailPlus, Medal, Megaphone, MessageSquare, NotebookTabs, Pyramid, Scale, Settings, Settings2, Shield, ShieldHalf, ShieldUser, SquareArrowOutUpRight, Star, Swords, Target, Ticket, TrendingUp, Trophy, UserCheck, Users, Wrench } from 'lucide-react';



import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Custom Reddit Icon Component
const RedditIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

// Custom Discord Icon Component  
const DiscordIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
  </svg>
);

export default function CommissionerRecruitPage() {
  const params = useParams();
  const leagueID = params.leagueID;
  
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get position pill styling  
  const getPositionPill = (position) => {
    const positions = position.split(',').filter(pos => pos.trim() !== 'Flx');
    
    if (positions.length === 2) {
      // Dual position - create split background using inline styles
      return 'relative px-2 py-1 rounded-sm text-xs font-medium text-center shrink-0 text-pb_darkgray overflow-hidden w-11 h-6';
    } else {
      // Single position
      const colorMap = {
        // NBA positions
        'PG': 'bg-pb_pastelblue text-pb_darkgray',
        'SG': 'bg-pb_pastelgreen text-pb_darkgray', 
        'SF': 'bg-pb_pastelorange text-pb_darkgray',
        'PF': 'bg-pb_pastelpurple text-pb_darkgray',
        'C': 'bg-pb_pastelred text-pb_darkgray',
        'G': 'bg-pb_pastelblue text-pb_darkgray',
        'F': 'bg-pb_pastelpurple text-pb_darkgray',
        // NFL positions
        'QB': 'bg-pb_pastelblue text-pb_darkgray',
        'RB': 'bg-pb_pastelgreen text-pb_darkgray',
        'WR': 'bg-pb_pastelorange text-pb_darkgray',
        'TE': 'bg-pb_pastelpurple text-pb_darkgray',
        'DEF': 'bg-pb_pastelred text-pb_darkgray',
        'K': 'bg-pb_pastelstone text-pb_darkgray',
        'FLEX': 'bg-pb_pastelstone text-pb_darkgray'
      };
      
      const colorClass = colorMap[positions[0]] || 'bg-pb_pastelstone text-pb_darkgray';
      return `${colorClass} px-2 py-1 rounded-sm text-xs font-medium text-center shrink-0 w-11`;
    }
  };

  const getPositionStyle = (position) => {
    const positions = position.split(',').filter(pos => pos.trim() !== 'Flx');
    
    if (positions.length === 2) {
      const colorMap = {
        // NBA positions
        'PG': '#79addc',  // pb_pastelblue
        'SG': '#b8dca7',  // pb_pastelgreen
        'SF': '#f5d491',  // pb_pastelorange
        'PF': '#ababef',  // pb_pastelpurple
        'C': '#f17e92',   // pb_pastelred
        'G': '#79addc',   // pb_pastelblue
        'F': '#ababef',   // pb_pastelpurple
        // NFL positions
        'QB': '#79addc',  // pb_pastelblue
        'RB': '#b8dca7',  // pb_pastelgreen
        'WR': '#f5d491',  // pb_pastelorange
        'TE': '#ababef',  // pb_pastelpurple
        'DEF': '#f17e92', // pb_pastelred
        'K': '#d6d3c2',   // pb_pastelstone
        'FLEX': '#d6d3c2' // pb_pastelstone
      };
      
      const color1 = colorMap[positions[0]] || '#d6d3c2';
      const color2 = colorMap[positions[1]] || '#d6d3c2';
      
      return {
        background: `linear-gradient(90deg, ${color1} 50%, ${color2} 50%)`
      };
    }
    
    return {};
  };

  const getDisplayPositions = (position) => {
    // Split by comma and filter out "Flx"
    const positions = position.split(',').filter(pos => pos.trim() !== 'Flx');
    return positions.join('/');
  };

  const getDraftPickColor = (pick) => {
    // Extract year from draft pick (e.g., "2025 1st" -> "2025")
    const year = pick.match(/(\d{4})/)?.[1];
    if (!year) return 'bg-pb_green/10 text-pb_greendisabled border-pb_green/30';
    
    // Dynamic color assignment based on year - completely year agnostic
    const colors = [
      'bg-pb_green/10 text-pb_greendisabled border-pb_green/30',
      'bg-pb_blue/10 text-pb_blue border-pb_blue/30',
      'bg-pb_orangedisabled/10 text-pb_orangedisabled border-pb_orangedisabled/30',
      'bg-pb_red/10 text-pb_red border-pb_red/30',
      'bg-pb_purple/10 text-pb_purple border-pb_purple/30',
    ];
    
    // Use year modulo to cycle through colors
    const colorIndex = parseInt(year) % colors.length;
    return colors[colorIndex];
  };

  const isFirstRoundPick = (pick) => {
    // Check if it's a first round pick (contains "1st" or matches "1.XX" pattern)
    return pick.includes('1st') || /1\.\d+/.test(pick);
  };

  useEffect(() => {
    // Fetch league data from dummy database
    const fetchLeagueData = async () => {
      try {
        const response = await fetch(`/api/commissioner/league/${leagueID}`);
        if (!response.ok) {
          throw new Error('League not found');
        }
        const data = await response.json();
        setLeagueData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, [leagueID]);

  // Dynamic page title based on league data
  useEffect(() => {
    if (leagueData?.leagueName) {
      document.title = `Playbook Recruitment Hub | ${leagueData.leagueName}`;
    } else {
      document.title = 'Playbook Recruit | League';
    }
  }, [leagueData?.leagueName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pb_backgroundgray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pb_blue mx-auto"></div>
          <p className="mt-4 text-pb_textgray">Loading league information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pb_backgroundgray flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-pb_red flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              League Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pb_textgray mb-4">
              The league with ID &quot;{leagueID}&quot; could not be found or is not available for recruitment.
            </p>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  const ruleSections = leagueData?.rulebook ? Object.entries(leagueData.rulebook).map(([title, content]) => ({ title, content })) : [];

  return (
      <div className="pb-12">
        <div className="w-full pt-5 pb-5">
                {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 gap-2">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-2 lg:hidden">
            {/* Row 1: Recruitment Hub + Available Spots */}
            <div className="flex items-center gap-2">
              <Card className="px-3 h-8 sm:h-10 flex items-center bg-pb_darkgray border border-pb_darkergray shadow-sm rounded-lg flex-1">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">
                    Recruitment Hub
                  </span>
                </div>
              </Card>
              <Card className="px-2 sm:px-3 h-8 sm:h-10 flex items-center bg-pb_green border border-pb_green-900 hover:bg-pb_greenhover shadow-sm rounded-lg flex-1">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-xs sm:text-sm">{leagueData?.availableTeams.length} Spots Available</span>
                </div>
              </Card>
            </div>
            
            {/* Row 2: League Info (always on one line) */}
            <Card className="px-3 py-2 sm:py-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] flex items-center bg-white border border-lightergray shadow-sm rounded-lg">
              <div className="flex items-center gap-2 sm:gap-4 w-full justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const platform = leagueData?.settings?.platform?.toLowerCase();
                    if (platform === 'fantrax') {
                      return <FantraxIcon className="w-4 h-4 text-pb_darkgray" />;
                    } else {
                      return <Settings className="w-4 h-4 text-pb_darkgray" />;
                    }
                  })()}
                  <span className="text-pb_darkgray font-medium text-xs sm:text-sm">{leagueData?.settings?.platform}</span>
                </div>
                <div className="h-4 w-px bg-pb_lightgray"></div>
                <div className="flex items-center gap-3 flex-1">
                  <h1 className="text-sm sm:text-base font-semibold text-pb_darkgray">
                    {leagueData?.leagueName}
                  </h1>
                  <span className="text-xs text-pb_textgray bg-pb_backgroundgray px-2 py-0.5 rounded">
                    ID: {leagueData?.platformLeagueId || leagueID}
                  </span>
                </div>
              </div>
            </Card>
            
            {/* Row 3: Discord + LeagueSafe */}
            <div className="flex gap-2">
              <Card 
                className="px-2 h-8 flex items-center bg-white border border-lightergray shadow-sm rounded-lg cursor-pointer hover:bg-pb_backgroundgray transition-colors flex-1"
                onClick={() => window.open(leagueData?.settings?.discordLink, '_blank')}
              >
                <div className="flex items-center gap-2">
                  <DiscordIcon className="w-4 h-4 text-pb_darkgray" />
                  <span className="text-pb_darkgray font-medium text-xs">Discord</span>
                  <SquareArrowOutUpRight className="w-3 h-3 text-pb_darkgray" />
                </div>
              </Card>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="px-2 h-8 flex items-center bg-white border border-lightergray shadow-sm rounded-lg cursor-pointer hover:bg-pb_backgroundgray transition-colors flex-1">
                    <div className="flex items-center gap-2">
                      <LeagueSafeIcon className="w-4 h-4 text-pb_darkgray" />
                      <span className="text-pb_darkgray font-medium text-xs">LeagueSafe</span>
                      <SquareArrowOutUpRight className="w-3 h-3 text-pb_darkgray" />
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-pb_darkgray">
                      <AlertTriangle className="h-5 w-5 text-pb_orange" />
                      Verify With Commissioner
                    </DialogTitle>
                    <DialogDescription className="text-pb_textgray">
                      Please reach out to the league commissioner and confirm arrangements before making any payments.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={() => window.open(leagueData?.settings?.leagueSafeLink, '_blank')}
                      className="bg-pb_blue hover:bg-pb_bluehover text-white"
                    >
                      Continue to LeagueSafe
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center gap-2">
            <Card className="px-3 h-10 flex items-center bg-pb_darkgray border border-pb_darkergray shadow-sm rounded-lg">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 mr-1 text-white" />
                <span className="text-md font-bold text-white">
                  Recruitment Hub
                </span>
              </div>
            </Card>
            <Card className="px-3 py-2 h-10 flex items-center bg-white border border-lightergray shadow-sm rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {(() => {
                    const platform = leagueData?.settings?.platform?.toLowerCase();
                    if (platform === 'fantrax') {
                      return <FantraxIcon className="w-4 h-4 mr-1 text-pb_darkgray" />;
                    } else {
                      return <Settings className="w-4 h-4 mr-1 text-pb_darkgray" />;
                    }
                  })()}
                  <span className="text-pb_darkgray font-medium text-sm">{leagueData?.settings?.platform}</span>
                </div>
                <div className="h-4 w-px bg-pb_lightgray"></div>
                <div className="flex items-center gap-3">
                  <h1 className="text-sm font-bold text-pb_darkgray">
                    {leagueData?.leagueName}
                  </h1>
                  <span className="text-xs text-pb_textgray bg-pb_backgroundgray px-2 py-0.5 rounded">
                    ID: {leagueData?.platformLeagueId || leagueID}
                  </span>
                </div>
              </div>
            </Card>
          </div>
            
          {/* Desktop Right Side */}
          <div className="hidden lg:flex gap-2">
            <Card 
              className="px-3 h-10 flex items-center bg-white border border-lightergray shadow-sm rounded-lg cursor-pointer hover:bg-pb_backgroundgray transition-colors"
              onClick={() => window.open(leagueData?.settings?.discordLink, '_blank')}
            >
              <div className="flex items-center gap-2">
                <DiscordIcon className="w-4 h-4 text-pb_darkgray" />
                <span className="text-pb_darkgray font-medium text-sm">Discord</span>
                <SquareArrowOutUpRight className="w-3 h-3 text-pb_darkgray" />
              </div>
            </Card>
            
            <Dialog>
              <DialogTrigger asChild>
                <Card className="px-3 h-10 flex items-center bg-white border border-lightergray shadow-sm rounded-lg cursor-pointer hover:bg-pb_backgroundgray transition-colors">
                  <div className="flex items-center gap-2">
                    <LeagueSafeIcon className="w-4 h-4 text-pb_darkgray" />
                    <span className="text-pb_darkgray font-medium text-sm">LeagueSafe</span>
                    <SquareArrowOutUpRight className="w-3 h-3 text-pb_darkgray" />
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-pb_darkgray">
                    <AlertTriangle className="h-5 w-5 text-pb_orange" />
                    Verify With Commissioner
                  </DialogTitle>
                  <DialogDescription className="text-pb_textgray">
                    Please reach out to the league commissioner and confirm arrangements before making any payments.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={() => window.open(leagueData?.settings?.leagueSafeLink, '_blank')}
                    className="bg-pb_blue hover:bg-pb_bluehover text-white"
                  >
                    Continue to LeagueSafe
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Card className="px-3 h-10 flex items-center bg-pb_green border border-pb_green-900 hover:bg-pb_greenhover shadow-sm rounded-lg">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">{leagueData?.availableTeams.length} Spots Available</span>
              </div>
            </Card>
          </div>
        </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-16 gap-2">
           {/* Left Column - League Details & Commissioner Info */}
           <div className="lg:col-span-3 space-y-2">
                         {/* League Information */}
             <Card className="shadow-md border border-lightergray bg-white rounded-lg">
               <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2 text-base font-bold text-pb_darkgray">
                   <Settings2 className="h-5 w-5 mr-1" />
                   League Details
                 </CardTitle>
               </CardHeader>
               {/* <Separator className="mt-[3px] mb-3 w-[92%] mx-auto" /> */}

               <CardContent className="p-4 pt-0 space-y-2">
                 {/* Format & Scoring */}
                 <div className="grid grid-cols-2 gap-2">
                   <div className="flex items-center gap-3 py-1 px-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                     {(() => {
                       const sport = leagueData?.sport?.toLowerCase();
                       if (sport === 'nfl') {
                         return <Football className="w-4 h-4 text-pb_darkgray" />;
                       } else if (sport === 'mlb') {
                         return <Baseball className="w-4 h-4 text-pb_darkgray" />;
                       } else {
                         return <Basketball className="w-4 h-4 text-pb_darkgray" />;
                       }
                     })()}
                     <div className="flex flex-col">
                       <span className="text-pb_textlightestgray text-xs">Sport</span>
                       <span className="font-bold text-pb_darkgray text-xs">{leagueData?.sport}</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3 py-1 px-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                     <Binoculars className="w-4 h-4 text-pb_darkgray" />
                     <div className="flex flex-col">
                       <span className="text-pb_textlightestgray text-xs">Format</span>
                       <span className="font-bold text-pb_darkgray text-xs">{leagueData?.format}</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3 py-1 px-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <Boxes className="w-4 h-4 text-pb_darkgray" />
                     <div className="flex flex-col">
                       <span className="text-pb_textlightestgray text-xs">Scoring</span>
                       <span className="font-bold text-pb_darkgray text-xs">{leagueData?.scoring}</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3 py-1 px-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                     <Swords className="w-4 h-4 text-pb_darkgray" />
                     <div className="flex flex-col">
                       <span className="text-pb_textlightestgray text-xs">Matchup</span>
                       <span className="font-bold text-pb_darkgray text-xs">H2H</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* Key Numbers */}
                 <div className="grid grid-cols-2 gap-2">
                   <div className="text-center py-1 rounded-lg border">
                     <div className="text-lg font-bold text-pb_darkgray">{leagueData?.totalTeams}</div>
                     <div className="text-xs text-pb_textlightgray font-medium">Teams</div>
                   </div>
                   <div className="text-center py-1 rounded-lg border">
                     <div className="text-lg font-bold text-pb_darkgray">{leagueData?.settings?.playoffs?.teams}</div>
                     <div className="text-xs text-pb_textlightgray font-medium">Playoff Spots</div>
                   </div>
                 </div>
                 
                 {/* Financial & Rules */}
                 <div className="space-y-2">
                   <div className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg">
                     <span className="text-pb_textlightgray text-xs font-medium">League Fee</span>
                     <span className="font-bold text-pb_darkgray text-xs">{leagueData?.settings?.entryFee}</span>
                   </div>
                   <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg cursor-help">
                            <span className="text-pb_textlightgray text-xs font-medium">Advanced Payments</span>
                            <span className="font-bold text-pb_darkgray text-xs">{leagueData?.settings?.advancedPayments} YR</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">
                            Owners are always paid {leagueData?.settings?.advancedPayments} year{leagueData?.settings?.advancedPayments !== '1' ? 's' : ''} in advance, not just for the current season. Owners are not eligible collect prize money without being current. This ensures league continuity and competitive integrity.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                 </div>
                 
                 {/* Roster Structure */}
                 <div className="pt-2">
                   <h4 className="text-sm font-bold text-pb_darkgray mb-3 flex items-center gap-2">
                     <Users className="h-4 w-4 text-pb_darkgray" />
                     Roster Structure ({(() => {
                       const rosterStructure = leagueData?.settings?.roster?.structure;
                       if (!rosterStructure) return 0;
                       return rosterStructure.split(',').length;
                     })()})
                   </h4>
                   <div className="flex flex-wrap gap-1">
                     {/* Dynamic Roster Structure */}
                     {(() => {
                       const getRosterSlotStyle = (position) => {
                         const baseClasses = "rounded py-1 text-center font-medium flex-none w-[calc(20%-0.2rem)]";
                         
                         switch (position?.toUpperCase()) {
                           case 'BENCH':
                             return `${baseClasses} text-2xs text-pb_textlightestgray border border-lightergray`;
                           case 'IR':
                             return `${baseClasses} text-2xs text-pb_textlightestgray border border-lightergray`;
                           case 'MINOR':
                             return `${baseClasses} text-2xs text-pb_textlightestgray border border-lightergray`;
                           default:
                             // Active roster positions (G, F, C, FLX, etc.) - use position-specific colors
                             const colorMap = {
                               // NBA positions
                               'PG': 'bg-pb_pastelblue text-pb_darkgray border-pb_pastelblue/30',
                               'SG': 'bg-pb_pastelgreen text-pb_darkgray border-pb_pastelgreen/30', 
                               'SF': 'bg-pb_pastelorange text-pb_darkgray border-pb_pastelorange/30',
                               'PF': 'bg-pb_pastelpurple text-pb_darkgray border-pb_pastelpurple/30',
                               'C': 'bg-pb_pastelred text-pb_darkgray border-pb_pastelred/30',
                               'G': 'bg-pb_pastelblue text-pb_darkgray border-pb_pastelblue/30',
                               'F': 'bg-pb_pastelpurple text-pb_darkgray border-pb_pastelpurple/30',
                               'FLX': 'bg-pb_pastelstone text-pb_darkgray border-pb_pastelstone/30',
                               // NFL positions
                               'QB': 'bg-pb_pastelblue text-pb_darkgray border-pb_pastelblue/30',
                               'RB': 'bg-pb_pastelgreen text-pb_darkgray border-pb_pastelgreen/30',
                               'WR': 'bg-pb_pastelorange text-pb_darkgray border-pb_pastelorange/30',
                               'TE': 'bg-pb_pastelpurple text-pb_darkgray border-pb_pastelpurple/30',
                               'DEF': 'bg-pb_pastelred text-pb_darkgray border-pb_pastelred/30',
                               'K': 'bg-pb_pastelstone text-pb_darkgray border-pb_pastelstone/30',
                               'FLEX': 'bg-pb_pastelstone text-pb_darkgray border-pb_pastelstone/30',
                               'TAXI': 'bg-pb_pastelstone text-pb_darkgray border-pb_pastelstone/30'
                             };
                             
                             const colorClass = colorMap[position?.toUpperCase()] || 'bg-white border-lightergray text-pb_midgray';
                             return `${baseClasses} ${colorClass} text-xs`;
                         }
                       };
                       
                        const rosterStructure = leagueData?.settings?.roster?.structure;
                        
                        if (!rosterStructure) {
                          return <div className="text-xs text-pb_textgray">Loading roster structure...</div>;
                        }
                        
                        const positions = rosterStructure.split(',').map(pos => pos.trim());
                        
                        return positions.map((position, index) => (
                          <div key={index} className={getRosterSlotStyle(position)}>
                            {position}
                          </div>
                        ));
                     })()}
                   </div>
                 </div>
                 
                 
               </CardContent>
             </Card>

                         {/* Commissioner Information */}
             <Card className="shadow-md rounded-lg">
               <CardHeader className="p-4 pb-0">
                 <CardTitle className="flex items-center pb-2 text-sm">
                   <MessageSquare className="h-4 w-4 mr-2 text-pb_darkgray" />
                   Commissioner
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                 
                 {/* Contact Methods */}
                 <div className="space-y-2">
                   <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
                     <Mail className="w-4 h-4 text-pb_darkgray" />
                     <div className="flex flex-col flex-1">
                       <span className="text-pb_darkgray text-xs font-medium">Email</span>
                       <span className="text-pb_textgray text-xs">{leagueData?.commissioner?.email}</span>
                     </div>
                     <button 
                       onClick={() => window.open(`mailto:${leagueData?.commissioner?.email}`, '_blank')}
                       className="p-1 hover:bg-pb_backgroundgray rounded transition-colors"
                     >
                       <ArrowRight className="w-3 h-3 text-pb_darkgray" />
                     </button>
                   </div>
                   <div className="flex items-center gap-3 py-2 px-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                     <DiscordIcon className="w-4 h-4 text-indigo-500" />
                     <div className="flex flex-col flex-1">
                       <span className="text-indigo-700 text-xs font-medium">Discord</span>
                       <span className="text-indigo-600 text-xs">{leagueData?.commissioner?.discord}</span>
                     </div>
                     <button 
                       onClick={() => window.open(`https://discord.com/users/${leagueData?.commissioner?.discord}`, '_blank')}
                       className="p-1 hover:bg-indigo-200 rounded transition-colors"
                     >
                       <ArrowRight className="w-3 h-3 text-indigo-600" />
                     </button>
                   </div>
                   <div className="flex items-center gap-3 py-2 px-3 bg-orange-50 border border-orange-200 rounded-lg">
                     <RedditIcon className="w-4 h-4 text-orange-500" />
                     <div className="flex flex-col flex-1">
                       <span className="text-orange-700 text-xs font-medium">Reddit</span>
                       <span className="text-orange-600 text-xs">{leagueData?.commissioner?.reddit}</span>
                     </div>
                     <button 
                       onClick={() => window.open(`https://reddit.com/user/${leagueData?.commissioner?.reddit}`, '_blank')}
                       className="p-1 hover:bg-orange-200 rounded transition-colors"
                     >
                       <ArrowRight className="w-3 h-3 text-orange-600" />
                     </button>
                   </div>
                 </div>
                 
               </CardContent>
             </Card>
                     </div>

           {/* Middle Column - Available Teams */}
           <div className="lg:col-span-5 space-y-2">
                         {/* Available Teams - Vertical Tabs with Compact Rows */}
             <Card className="shadow-md rounded-lg" style={{ '--card-height': '70vh' }}>
               <CardHeader className="p-4">
                 <div className="flex items-center justify-between">
                   <CardTitle className="flex items-center gap-1 text-base text-pb_darkgray">
                     <UserCheck className="h-6 w-6 pr-1 " />
                     Available Teams
                   </CardTitle>
                   
                   {/* View All Teams Button */}
                   <Dialog>
                     <DialogTrigger asChild>
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="text-xs h-7 px-2 text-pb_blue border-pb_blue hover:bg-pb_blue hover:text-white"
                       >
                         <Eye className="h-4 w-4 mr-1" />
                         View Opponents
                       </Button>
                     </DialogTrigger>
                     <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                       <DialogHeader>
                         <DialogTitle className="flex items-center gap-2">
                           <Users className="h-5 w-5 text-pb_blue" />
                           All League Teams
                         </DialogTitle>
                                                <DialogDescription>
                         View all {leagueData?.totalTeams} teams in the league.
                       </DialogDescription>
                       </DialogHeader>
                       
                       <ScrollArea className="h-[70vh] w-full">
                         <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 p-1 space-y-4">
                           {/* All Teams - with availability status */}
                           {leagueData?.allTeams?.map((team) => {
                             const isAvailable = leagueData?.availableTeams?.some(availableTeam => availableTeam.teamId === team.teamId);
                             return (
                               <Card key={team.teamId} className={`break-inside-avoid mb-4 w-full ${isAvailable ? 'border-pb_blue bg-pb_blue/5' : 'border-gray-200'}`}>
                                 <CardHeader className="pb-4">
                                   <div className="flex items-center justify-between">
                                     <CardTitle className="text-sm font-semibold text-pb_darkgray truncate">
                                       {team.teamName}
                                     </CardTitle>
                                     {isAvailable && (
                                       <Badge className="bg-pb_blue text-white text-xs px-2 py-1 font-medium">
                                         AVAILABLE
                                       </Badge>
                                     )}
                                   </div>
                                 </CardHeader>
                                 <CardContent className="p-4 pt-0 space-y-3">
                                   {/* Full Roster */}
                                   <div>
                                     <div className="space-y-1">
                                       {team.currentRoster?.map((player, i) => (
                                         <div key={i} className={`flex items-center justify-between py-1 px-2 rounded text-xs border ${isAvailable ? 'bg-white border-pb_blue/20' : 'bg-pb_backgroundgray border-pb_lightergray'}`}>
                                           <span className="font-medium text-pb_darkgray truncate">{player.name}</span>
                                           <div className="flex items-center gap-2 shrink-0">
                                             <span className="text-pb_textgray w-8 text-center">{player.team}</span>
                                             {(() => {
                                               const positions = player.position.split(',').filter(pos => pos.trim() !== 'Flx');
                                               if (positions.length === 2) {
                                                 return (
                                                   <span className={getPositionPill(player.position)} style={getPositionStyle(player.position)}>
                                                     <span className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center">{positions[0]}</span>
                                                     <span className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center">{positions[1]}</span>
                                                   </span>
                                                 );
                                               } else {
                                                 return <span className={getPositionPill(player.position)} style={getPositionStyle(player.position)}>{getDisplayPositions(player.position)}</span>;
                                               }
                                             })()}
                                           </div>
                                         </div>
                                       ))}
                                     </div>
                                   </div>
                                   
                                   {/* Draft Picks */}
                                   {team.draftPicks && team.draftPicks.length > 0 && (
                                     <div className="">
                                       <h5 className="text-xs font-semibold text-pb_darkgray mb-2">Draft Picks</h5>
                                            <div className="flex flex-wrap gap-1 justify-start overflow-y-auto" style={{ height: '50px' }}>
                                           {team.draftPicks.map((pick, index) => (
                                             <span key={index} className={`${getDraftPickColor(pick)} border px-2 py-1 rounded text-xs ${isFirstRoundPick(pick) ? 'font-bold' : 'font-medium'} flex items-center`}>
                                             <ShieldUser className="h-4 w-4 mr-1" />{pick}
                                           </span>
                                           ))}
                                         </div>
                                     </div>
                                   )}
                                   
                                 </CardContent>
                               </Card>
                             );
                           })}
                         </div>
                       </ScrollArea>
                     </DialogContent>
                   </Dialog>
                 </div>
               </CardHeader>
               {/* <Separator className="mt-0.5 mb-3 w-[95%] mx-auto" /> */}
               <CardContent className="p-4 pt-0 lg:h-[var(--card-height)]">
                 {leagueData?.availableTeams?.length > 0 ? (
                   <div className="lg:h-full lg:overflow-hidden">
                     <Tabs defaultValue="team-0" className="w-full lg:h-full">
                       {/* Horizontal Tab List */}
                       <TabsList className={`grid w-full mb-4 border border-lightestgray bg-pb_backgroundgray ${
                         leagueData?.availableTeams?.length === 1 ? 'grid-cols-1' :
                         leagueData?.availableTeams?.length === 2 ? 'grid-cols-2' :
                         leagueData?.availableTeams?.length === 3 ? 'grid-cols-3' :
                         leagueData?.availableTeams?.length === 4 ? 'grid-cols-4' :
                         leagueData?.availableTeams?.length >= 5 ? 'grid-cols-5' : 'grid-cols-3'
                       }`}>
                         {leagueData?.availableTeams?.map((team, index) => (
                           <TabsTrigger 
                             key={team.teamId} 
                             value={`team-${index}`}
                             className="data-[state=active]:bg-pb_green data-[state=active]:text-white text-xs h-full"
                           >
                             {team.teamName}
                           </TabsTrigger>
                         ))}
                       </TabsList>

                       {/* Tab Content */}
                       <div className="flex flex-col pr-2 lg:h-[calc(100%-58px)]">
                         {leagueData?.availableTeams?.map((team, index) => (
                           <TabsContent key={team.teamId} value={`team-${index}`} className="mt-0 flex flex-col lg:h-full space-y-4">
                             {/* Team Header */}
                             <div className="flex items-center justify-between px-0">
                               {/* <h3 className="font-semibold text-lg text-pb_darkgray">{team.teamName}</h3> */}
                               <div className="flex gap-2">
                                 {team.teamStrengths?.slice(0, 3).map((strength, i) => {
                                   const getStrengthIcon = (strengthName) => {
                                     switch (strengthName?.toLowerCase()) {
                                       case 'young core':
                                         return <Binoculars className="h-3.5 w-3.5 mr-1 text-pb_blue" />;
                                       case 'veteran core':
                                         return <ShieldHalf className="h-3.5 w-3.5 mr-1 text-pb_blue" />;
                                       case 'balanced':
                                         return <Scale className="h-3.5 w-3.5 mr-1 text-pb_blue" />;
                                       case 'previous champion x3':
                                         return <Trophy className="h-3.5 w-3.5 mr-1 text-pb_blue" />;
                                       case 'flexible':
                                         return <AlignHorizontalDistributeCenter className="h-3.5 w-3.5 mr-1 text-pb_blue" />;
                                       case 'rebuilding':
                                         return <Wrench className="h-3.5 w-3.5 mr-1 text-pb_blue" />;
                                       case 'depth':
                                         return <Boxes className="h-3.5 w-3.5 mr-1 text-pb_blue" />;
                                       default:
                                         return <Star className="h-3.5 w-3.5 mr-1 text-pb_blue" />;
                                     }
                                   };
                                   
                                   return (
                                     <Badge key={i} className="bg-white text-pb_darkgray border border-lightergray text-xs px-2 py-1 font-medium flex items-center gap-1 rounded-md hover:bg-pb_backgroundgray transition-colors">
                                       {getStrengthIcon(strength)}
                                       {strength}
                                     </Badge>
                                   );
                                 })}
                               </div>
                             </div>

                             {/* Current Roster - Enhanced with Scrolling */}
                             <div className="bg-pb_backgroundgray border border-lightergray rounded-lg p-3 shadow-inner" style={{ height: 'calc(100% - 160px)' }}>
                               <div 
                                 className="h-full overflow-y-auto"
                                 style={{
                                   scrollbarWidth: 'thin',
                                   scrollbarColor: '#d1d5db transparent'
                                 }}
                               >
                                 <style jsx>{`
                                   @media (min-width: 1024px) {
                                     div::-webkit-scrollbar {
                                       width: 6px;
                                     }
                                     div::-webkit-scrollbar-track {
                                       background: transparent;
                                     }
                                     div::-webkit-scrollbar-thumb {
                                       background-color: #d1d5db;
                                       border-radius: 3px;
                                     }
                                     div::-webkit-scrollbar-thumb:hover {
                                       background-color: #9ca3af;
                                     }
                                   }
                                 `}</style>
                                 <div className="space-y-1">
                                   {team.currentRoster?.map((player, i) => (
                                     <div key={i} className="flex items-center justify-between py-1 px-3 bg-white border border-gray-200 rounded hover:bg-pb_backgroundgray transition-colors">
                                       <div className="flex-1 min-w-0">
                                         <div className="font-medium text-sm text-pb_darkgray truncate">{player.name}</div>
                                       </div>
                                       <div className="flex items-center gap-2 shrink-0 text-xs">
                                         <span className="text-pb_textgray w-8 text-center">{player.team}</span>
                                         {(() => {
                                           const positions = player.position.split(',').filter(pos => pos.trim() !== 'Flx');
                                           if (positions.length === 2) {
                                             return (
                                               <span className={getPositionPill(player.position)} style={getPositionStyle(player.position)}>
                                                 <span className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center">{positions[0]}</span>
                                                 <span className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center">{positions[1]}</span>
                                               </span>
                                             );
                                           } else {
                                             return <span className={getPositionPill(player.position)} style={getPositionStyle(player.position)}>{getDisplayPositions(player.position)}</span>;
                                           }
                                         })()}
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             </div>

                             {/* Draft Picks - Always Visible */}
                             <div className="flex-shrink-0 mt-4" style={{ height: '120px' }}>
                                 <h5 className="text-xs font-semibold text-pb_darkgray mb-2">Draft Picks</h5>
                                <div className="flex flex-wrap gap-1 justify-start overflow-y-auto" style={{ height: '90px' }}>
                                 {team.draftPicks && team.draftPicks.length > 0 ? (
                                   team.draftPicks.map((pick, index) => (
                                     <span key={index} className={`${getDraftPickColor(pick)} border px-3 py-1 rounded text-xs ${isFirstRoundPick(pick) ? 'font-bold' : 'font-medium'} flex items-center flex-shrink-0`} style={{ height: '24px' }}>
                                       <ShieldUser className="h-4 w-4 mr-1" />{pick}
                                     </span>
                                   ))
                                 ) : (
                                   <span className="text-xs text-pb_textgray italic">No draft picks</span>
                                 )}
                               </div>
                             </div>

                           </TabsContent>
                         ))}
                       </div>
                     </Tabs>
                   </div>
                 ) : (
                   <div className="flex items-center justify-center py-8">
                     <p className="text-pb_textgray">No available teams information loaded.</p>
                   </div>
                 )}
                              </CardContent>
             </Card>
           </div>

                      {/* Right Column - League Rules */}
           <div className="lg:col-span-8 space-y-2">
             {/* League Rules - Left-Justified Tabs Display */}
             <Card className="shadow-md rounded-lg" style={{ '--card-height': '70vh' }}>
               <CardHeader className="p-4">
                 <div className="flex items-center justify-between">
                   <CardTitle className="flex items-center gap-1 text-base text-pb_darkgray">
                     <FileText className="h-6 w-6 pr-1" />
                     Rulebook
                   </CardTitle>
                   <div className="h-7"></div>
                 </div>
               </CardHeader>
               {/* <Separator className="mt-[7px] mb-3 w-[95%] mx-auto" /> */}
               <CardContent className="p-4 pt-0 lg:h-[var(--card-height)]">
                 {ruleSections.length > 0 ? (
                   <div className="lg:h-full lg:overflow-hidden">
                                            <Tabs defaultValue="rule-0" className="w-full lg:h-full" orientation="horizontal">
                         <div className="flex lg:h-full">
                           {/* Left Sidebar with Tabs */}
                         <div className="w-20 lg:w-40 border-r border-gray-200 lg:h-full">
                           <TabsList className="flex flex-col lg:h-full w-full p-0 pr-1 bg-transparent space-y-1 items-start justify-start">
                             {ruleSections.map((section, index) => {
                               const getIcon = (title) => {
                                 switch (title) {
                                   case 'Format':
                                     return <AlignLeft className="h-3 w-3 lg:h-4 lg:w-4" />;
                                   case 'Scoring System':
                                     return <Target className="h-3 w-3 lg:h-4 lg:w-4" />;
                                   case 'Prize Pool':
                                     return <Medal className="h-3 w-3 lg:h-4 lg:w-4" />;
                                   case 'Conduct':
                                     return <Handshake className="h-3 w-3 lg:h-4 lg:w-4" />;
                                   case 'Trades':
                                     return <ArrowRightLeft className="h-3 w-3 lg:h-4 lg:w-4" />;
                                   case 'Draft':
                                     return <ShieldUser className="h-3 w-3 lg:h-4 lg:w-4" />;
                                    case 'Playoffs':
                                      return <Goal className="h-3 w-3 lg:h-4 lg:w-4" />;
                                  case 'Waiver':
                                    return <ContactRound className="h-3 w-3 lg:h-4 lg:w-4" />;
                                  case 'Matchups':
                                    return <Swords className="h-3 w-3 lg:h-4 lg:w-4" />;
                                   default:
                                     return <FileText className="h-3 w-3 lg:h-4 lg:w-4" />;
                                 }
                               };

                               return (
                                 <TabsTrigger
                                   key={index}
                                   value={`rule-${index}`}
                                   className="w-full justify-start text-left px-2 py-2 lg:px-3 lg:py-2 text-xs lg:text-sm font-medium text-pb_textgray hover:text-pb_blue data-[state=active]:hover:bg-pb_bluehover data-[state=active]:hover:text-white hover:bg-pb_blue/10 data-[state=active]:bg-pb_blue data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 self-start"
                                 >
                                   <div className="flex flex-col lg:flex-row items-center lg:gap-2 w-full justify-start">
                                     {getIcon(section.title)}
                                     <span className="truncate text-left text-xs lg:text-sm leading-tight mt-1 lg:mt-0">{section.title}</span>
                                   </div>
                                 </TabsTrigger>
                               );
                             })}
                           </TabsList>
                         </div>

                         {/* Right Content Area */}
                         <div className="flex-1 lg:h-full lg:overflow-hidden">
                           <ScrollArea className="lg:h-full">
                             {ruleSections.map((section, index) => (
                               <TabsContent
                                 key={index}
                                 value={`rule-${index}`}
                                 className="mt-0 px-2 lg:px-4 focus-visible:outline-none lg:h-full"
                               >
                                 <div className="space-y-3 lg:space-y-4">
                                   <h2 className="text-sm lg:text-md font-semibold text-pb_darkgray border-b border-gray-200 pb-2">
                                     {section.title}
                                   </h2>
                                   <div className="prose prose-sm max-w-none">
                                     <div 
                                       className="whitespace-pre-wrap text-xs lg:text-sm text-pb_darkgray leading-relaxed"
                                       dangerouslySetInnerHTML={{
                                         __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-pb_blue">$1</strong>')
                                       }}
                                     />
                                   </div>
                                 </div>
                               </TabsContent>
                             ))}
                           </ScrollArea>
                         </div>
                       </div>
                     </Tabs>
                   </div>
                 ) : (
                   <div className="p-4 text-center">
                     <FileText className="h-6 w-6 text-pb_lightgray mx-auto mb-2" />
                     <p className="text-pb_textgray text-xs">League rulebook is being prepared...</p>
                   </div>
                 )}
               </CardContent>
             </Card>
           </div>
        </div>
      
        {/* Footer - App Advertisement */}
        <footer className="lg:fixed lg:bottom-0 lg:left-0 lg:right-0 border-t border-pb_lightgray py-2 lg:z-10 bg-white">
          <div className="px-4 lg:px-0">
            <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between text-xs gap-3 lg:gap-0">
              <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3 lg:gap-0">
                <div className="flex flex-col items-center lg:flex-row lg:items-center mt-4 lg:mt-0">
                  <div className="flex items-center mb-1 lg:mb-0">
                    <Image src="/logo-tpfull.png" alt="Playbook Fantasy Sports" width={18} height={18} className="mr-2" />
                    <p className="text-pb_textgray text-sm font-bold">
                      Playbook
                    </p>
                  </div>
                  <p className="text-pb_textgray text-center lg:text-left lg:ml-2">
                    The AI-powered fantasy sports command center that learns your leagues and strategy.
                  </p>
                </div>

                <div className="h-4.5 w-px bg-pb_lightgray mx-3 ml-5 hidden lg:block"></div>

                <div className="flex items-center gap-1">
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-pb_blue hover:bg-pb_blue hover:text-white px-2 py-1 h-6 text-xs"
                    onClick={() => window.open('/api/auth/login', '_blank')}
                  >
                    <LucideClipboardSignature className="w-4 h-4" />
                    Join the Waitlist
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-pb_textgray hover:bg-pb_lightergray  px-2 py-1 h-6 text-xs"
                    onClick={() => window.open('/landing', '_blank')}
                  >
                    <BookOpenText className="w-4 h-4" />
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="flex items-center">
                <Lunchbox className="h-4 w-4 text-pb_textgray mb-[2px] mr-1" />
                <p className="text-pb_textgray font-bold">
                  Commissioner Tools              
                </p>
                <p className="text-pb_textgray ml-[3px]">
                  are in early development.              
                </p>
              </div>

            </div>
          </div>
        </footer>
        </div>
      </div>
  );  
} 