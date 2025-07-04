'use client';

import { baseball, basketball, football } from "@lucide/lab";
const Basketball = createLucideIcon('basketball', basketball);
const Football = createLucideIcon('football', football);
const Baseball = createLucideIcon('baseball', baseball); 

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
import { AlertCircle, AlertTriangle, AlignLeft, ArrowRight, ArrowRightLeft, AtSign, Calendar, Clock, createLucideIcon, ExternalLink, Eye, FileText, Flag, FlagTriangleRight, FormData, Goal, Handshake, LandPlot, Mail, Mailbox, Medal, MessageSquare, NotebookTabs, Pyramid, Settings, Shield, ShieldUser, Star, Swords, Target, Ticket, TrendingUp, Trophy, UserCheck, Users } from 'lucide-react';



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
    const pos = position.split('/')[0]; // Get first position if multiple
    const colorMap = {
      'PG': 'bg-pb_pastelblue text-pb_darkgray',
      'SG': 'bg-pb_pastelgreen text-pb_darkgray', 
      'SF': 'bg-pb_pastelorange text-pb_darkgray',
      'PF': 'bg-pb_pastelpurple text-pb_darkgray',
      'C': 'bg-pb_pastelred text-pb_darkgray'
    };
    
    const colorClass = colorMap[pos] || 'bg-pb_pastelstone text-pb_darkgray';
    return `${colorClass} px-2 py-1 rounded-sm text-xs font-medium w-10 text-center shrink-0`;
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

  const parseRulebook = (rulebook) => {
    // Return your exact rulebook text
    return [
      {
        title: "Format",
        content: `**Dynasty**
The league will be true dynasty format. Players will never decay based on team tenure or be force dropped from a roster. Following the start-up draft, all subsequent yearly drafts will be rookie-only drafts.

**12 Teams** PG, SG, SF, PF, C, G, F, UTIL (3), BENCH (3), IR (3)
Each team will have a roster of up to 21 players, three being Injury Reserve slots only available to sufficiently injured players. We will also have five Minor League slots for younger players to be stashed. To be eligible for Minor League you must have played less than 175 games. Only 10 players may be active on any given day (as players on the bench do not add to team scoring totals), and owners will be free to change which players are active each day prior to the tip-off time of the opening game of the day. 

All further League rule decisions for either rule changes or rules not listed on these pages will be subject to a league-wide vote.
`
      },
      {
        title: "Matchups",
        content: `**Head to Head - Each Category** FG%, FT%, 3PM, PTS, REB, AST, STL, BLK, TO
We play Head to Head - Each Category (Weekly) with the standard 9-cat setup. 
For each weekly scoring period, team totals in all 9 categories are accumulated and a win, loss or tie is credited in each category based on the matchup results (i.e. 5-3-1 in a 9 category league). 

There will be a hard cap limit of 40 games played for each scoring period. You will maintain all stats from games played on the day you reach the cap, regardless if it exceeds the cap slightly. These matchup results are added over the course of the season and are totaled as season standings. The teams in the top 6 places in the season standings at the end of the season will enter the playoffs. (See the Playoffs section for more.)

Rosters will lock individually at the time of each player’s respective game times.
`
      },

      {
        title: "Prize Pool",
        content: `A **$75 league buy-in fee** will be collected from all members prior to the 2019 start-up draft. Once all buy-in fees have been paid, both the draft and the league will start. 

To ensure competitive integrity and longevity in the dynasty format, the league buy-in fee **for all subsequent seasons will be collected ahead of schedule**. Any owner who fails to submit their buy-in fee for the following season by the deadline will forfeit their place in the league and will not be able to collect any prize money, even for the current season.

**This makes the prize pool $900.** 
1st place will receive 550$. Second place will receive 275$. 3rd place will receive 75$.
`
      },
      {
        title: "Trades",
        content: `Trades must abide by all owner conduct rules. One of the key responsibilities of each owner as part of **your commitment to this league is the competitive integrity** of trading. Please be diligent and cautious when making trades, as it critically affects the experiences of all other owners in the league. Trading and its effects on competitive integrity will be each owner’s responsibility. In 99% of situations, you will be the one accountable for your own actions, and will be required to live with them along with the rest of us.

**The league will be commissioner veto only**, with an agenda of being as hands off as possible. In extreme situations only, if a trade is deemed by the commissioner to be excessively self-destructive or nonsensical, it will be discussed and likely reversed. 

In any unusual situation whereby a team (through technological error) completes an accidental trade that can be explained reasonably and is reported in league chat or to the commissioner directly within 5-10 minutes of the trade occurring can be reversed.

Please double and triple check your trades before and after they are executed, to be able to catch any honest mistakes and message the commissioner in time to take advantage of this forgiveness period. 

All other trades will be upheld. 
`
      },
      {
        title: "Owner Conduct",
        content: `**No collusion.** Fraternizing with, or manipulating, another player in private to achieve an outcome that could disrupt another team's fair chances of success and/or tip the competitive balance in your favor.

**No sandbagging.** You must always be engaged, playing and setting coherent lineups, regardless of the strength of your team. Season "tanking" is allowed only through trading. 

**Set your lineups.** The absolute minimum requirement for playing in the league is making sure your roster is properly placed and off the bench for every matchup. It's your responsibility to make sure that your match-ups' competitive integrity isn't spoiled by your ineptness or indifference towards this essential duty.

**No roster self-destructing.** Any malicious or nonsensical player drops or trades reasonably diagnosed as reckless and indicative of a player choosing to disregard the competitive integrity of the league will be undone and if needed, the offending team will be held frozen until a replacement owner can be found.`
      },
      {
        title: "Draft",
        content: `The draft will commence some time after the July 1st beginning of free agency, once all major free agents have signed and settled. The start-up draft will be a snake draft, and all subsequent drafts will be linear draft format, much like the real NBA draft. (1st pick will also get 13th pick.)

Draft position for all future rookie drafts will be selected based on previous season standings, with one exception. The 12th, 11th, and 10th place teams from the previous season will be placed in a random **draft lottery** to decide who gets the 1st, 2nd, and 3rd pick in the draft. Every pick following will be assigned in reverse order of the previous year's standings. 9th place will get the 4th pick, 8th place will get the 5th pick, and so on. The draft lottery results will be decided by a random choice of 3 mixed ping pong balls assigned to each of the 3 worst standing teams from the previous season. First ball selection will have the 1st pick, the second ball selection will have the 2nd pick, and the leftover team gets the 3rd pick.

After the draft, all players not drafted will enter into the Waiver Wire system. Every player on the waiver wire will be available to any owner to make a claim on for 1 day. The winner of the waiver claim will be decided by Waiver Wire Order, and any players not claimed with the waiver wire period will become a Free Agent. All Free Agents are first come first serve, and do not affect Waiver Order. If you successfully claim a player from the waiver wire, your Waiver Order will drop to last priority.
`
      },
      {
        title: "Playoffs",
        content: `6 teams will enter the playoffs after the regular season matchups, these teams are decided by league standings at the end of the season.

First round, **seeds (1) and (2) will both get a bye**. Two matchups will be played between seeds (3) v.s. (6) and seeds (4) v.s. (5).

Second round, the playoff bracket will be reseeded, placing seed (1) against the **lowest available seed** to make it out of the first round. Seed (2) will be placed against the other first round victor.

Third and final round, the two winners of the second round of matchups will face off to decide who gets 1st place and 2nd place prizes - the losers will face off in a third place matchup.

First and second round matchups will have a scoring period of one week each. And **the third round prize matchup will have a scoring period of two weeks**.

(To be clear, there is no preset option on Fantrax to set up two week playoffs, but I will be able to customize playoffs and create the same matchup for two consecutive weeks, and the totals will be added together to crown the 1st prize winner.)`
      },
    ];
  };

  const ruleSections = parseRulebook(leagueData?.fullRulebook);

  return (
      <div className="">
        <div className="container mx-auto w-full py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-pb_darkgray">
              The League
            </h1>
          </div>
          
          {/* Key Details Cards */}
          <div className="flex flex-wrap gap-2 ml-4">
            {/* <Card className="px-3 py-2 bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Basketball className="w-4 h-4 text-pb_darkgray" /> 
                <span className="text-pb_darkgray font-medium text-sm">NBA</span>
              </div>
            </Card>
            
            <Card className="px-3 py-2 bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <LandPlot className="w-4 h-4 text-pb_darkgray" />
                <span className="text-pb_darkgray font-medium text-sm">Dynasty</span>
              </div>
            </Card>
            
            <Card className="px-3 py-2 bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Pyramid className="w-4 h-4 text-pb_darkgray" />
                <span className="text-pb_darkgray font-medium text-sm">Categories</span>
              </div>
            </Card>
            
            <Card className="px-3 py-2 bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-pb_darkgray" />
                <span className="text-pb_darkgray font-medium text-sm">H2H</span>
              </div>
            </Card> */}
            
            <Card className="px-3 py-2 bg-white border border-lightergray shadow-sm">
              <div className="flex items-center gap-2">
                <FantraxIcon className="w-4 h-4 text-pb_darkgray" />
                <span className="text-pb_darkgray font-medium text-sm">Fantrax</span>
              </div>
            </Card>
            
            <Card 
              className="px-3 py-2 bg-white border border-lightergray shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => window.open('https://discord.gg/your-invite-link', '_blank')}
            >
              <div className="flex items-center gap-2">
                <DiscordIcon className="w-4 h-4 text-pb_darkgray" />
                <span className="text-pb_darkgray font-medium text-sm">Discord Group Chat</span>
                <ExternalLink className="w-3 h-3 text-pb_darkgray ml-1" />
              </div>
            </Card>
            
            <Card 
              className="px-3 py-2 bg-white border border-lightergray shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => window.open('https://leaguesafe.com/your-league-link', '_blank')}
            >
              <div className="flex items-center gap-2">
                <LeagueSafeIcon className="w-4 h-4 text-pb_darkgray" />
                <span className="text-pb_darkgray font-medium text-sm">LeagueSafe Page</span>
                <ExternalLink className="w-3 h-3 text-pb_darkgray ml-1" />
              </div>
            </Card>
            
            <Card className="px-3 py-2 bg-pb_green border border-pb_green shadow-sm">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">{leagueData?.availableSpots || 2} Spots Available</span>
              </div>
            </Card>
          </div>
        </div>

                 <div className="grid grid-cols-1 lg:grid-cols-16 gap-2">
           {/* Left Column - League Details & Commissioner Info */}
           <div className="lg:col-span-3 space-y-2">
                         {/* League Information */}
             <Card className="shadow-md border border-lightergray bg-white">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-2 text-base font-bold text-pb_darkgray">
                   <NotebookTabs className="h-5 w-5 " />
                   League Details
                 </CardTitle>
               </CardHeader>
               <Separator className="mt-[3px] mb-3 w-[92%] mx-auto" />

               <CardContent className="pt-0 space-y-2">
                 {/* Format & Scoring */}
                 <div className="grid grid-cols-2 gap-2">
                   <div className="flex items-center gap-3 py-1 px-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                     <LandPlot className="w-4 h-4 text-pb_darkgray" />
                     <div className="flex flex-col">
                       <span className="text-pb_textlightestgray text-xs">Sport</span>
                       <span className="font-bold text-pb_darkgray text-xs">NBA</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3 py-1 px-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                     <Ticket className="w-4 h-4 text-pb_darkgray" />
                     <div className="flex flex-col">
                       <span className="text-pb_textlightestgray text-xs">Format</span>
                       <span className="font-bold text-pb_darkgray text-xs">Dynasty</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3 py-1 px-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                     <Pyramid className="w-4 h-4 text-pb_darkgray" />
                     <div className="flex flex-col">
                       <span className="text-pb_textlightestgray text-xs">Scoring</span>
                       <span className="font-bold text-pb_darkgray text-xs">Categories</span>
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
                     <div className="text-lg font-bold text-pb_darkgray">12</div>
                     <div className="text-xs text-pb_textlightgray font-medium">Teams</div>
                   </div>
                   <div className="text-center py-1 rounded-lg border">
                     <div className="text-lg font-bold text-pb_darkgray">6</div>
                     <div className="text-xs text-pb_textlightgray font-medium">Playoff Spots</div>
                   </div>
                 </div>
                 
                 {/* Financial & Rules */}
                 <div className="space-y-2">
                   <div className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg">
                     <span className="text-pb_textlightgray text-xs font-medium">League Fee</span>
                     <span className="font-bold text-pb_darkgray text-xs">$75</span>
                   </div>
                   <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg cursor-help">
                            <span className="text-pb_textlightgray text-xs font-medium">Advanced Payments</span>
                            <span className="font-bold text-pb_darkgray text-xs">1YR</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">
                            Owners are always paid 1 year in advance, not just for the current season. Owners are not eligible collect prize money without being current. This ensures league continuity and competitive integrity.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                 </div>
                 
                 {/* Roster Structure */}
                 <div className="pt-2">
                   <h4 className="text-sm font-bold text-pb_darkgray mb-3 flex items-center gap-2">
                     <Users className="h-4 w-4 text-pb_darkgray" />
                     Roster Structure
                   </h4>
                   <div className="flex flex-wrap gap-1">
                     {/* Active Roster */}
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">G</div>
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">G</div>
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">G</div>
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">F</div>
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">F</div>
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">F</div>
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">C</div>
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">FLX</div>
                     <div className="bg-white border border-lightergray rounded py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">FLX</div>
                     <div className="bg-white border border-lightergray rounded  py-1 text-center text-xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">FLX</div>
                     
                                           {/* Bench */}
                      <div className="bg-pb_green/20 border border-pb_green/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">BENCH</div>
                      <div className="bg-pb_green/20 border border-pb_green/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">BENCH</div>
                      <div className="bg-pb_green/20 border border-pb_green/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">BENCH</div>
                      
                      {/* IR */}
                      <div className="bg-pb_red/20 border border-pb_red/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">IR</div>
                      <div className="bg-pb_red/20 border border-pb_red/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">IR</div>
                      <div className="bg-pb_red/20 border border-pb_red/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">IR</div>
                      <div className="bg-pb_red/20 border border-pb_red/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">IR</div>
                      
                      {/* Minors */}
                      <div className="bg-pb_blue/10 border border-pb_blue/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">MINOR</div>
                      <div className="bg-pb_blue/10 border border-pb_blue/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">MINOR</div>
                      <div className="bg-pb_blue/10 border border-pb_blue/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">MINOR</div>
                      <div className="bg-pb_blue/10 border border-pb_blue/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">MINOR</div>
                      <div className="bg-pb_blue/10 border border-pb_blue/30 rounded py-1 text-center text-2xs font-medium text-pb_midgray flex-none w-[calc(20%-0.2rem)]">MINOR</div>
                   </div>
                 </div>
               </CardContent>
             </Card>

                         {/* Commissioner Information */}
             <Card className="shadow-md">
               <CardHeader className="pb-0">
                 <CardTitle className="flex items-center pb-2 text-md">
                   <MessageSquare className="h-6 w-6 pr-1 text-pb_blue" />
                   Commissioner
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 
                 {/* Contact Methods */}
                 <div className="space-y-2">
                   <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
                     <Mailbox className="w-4 h-4 text-pb_darkgray" />
                     <div className="flex flex-col flex-1">
                       <span className="text-pb_darkgray text-xs font-medium">Email</span>
                       <span className="text-pb_textgray text-xs">austindreosch@gmail.com</span>
                     </div>
                     <button 
                       onClick={() => window.open('mailto:austindreosch@gmail.com', '_blank')}
                       className="p-1 hover:bg-gray-200 rounded transition-colors"
                     >
                       <ArrowRight className="w-3 h-3 text-pb_darkgray" />
                     </button>
                   </div>
                   <div className="flex items-center gap-3 py-2 px-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                     <DiscordIcon className="w-4 h-4 text-indigo-500" />
                     <div className="flex flex-col flex-1">
                       <span className="text-indigo-700 text-xs font-medium">Discord</span>
                       <span className="text-indigo-600 text-xs">austindreosch</span>
                     </div>
                     <button 
                       onClick={() => window.open('https://discord.com/users/austindreosch', '_blank')}
                       className="p-1 hover:bg-indigo-200 rounded transition-colors"
                     >
                       <ArrowRight className="w-3 h-3 text-indigo-600" />
                     </button>
                   </div>
                   <div className="flex items-center gap-3 py-2 px-3 bg-orange-50 border border-orange-200 rounded-lg">
                     <RedditIcon className="w-4 h-4 text-orange-500" />
                     <div className="flex flex-col flex-1">
                       <span className="text-orange-700 text-xs font-medium">Reddit</span>
                       <span className="text-orange-600 text-xs">lookalive9</span>
                     </div>
                     <button 
                       onClick={() => window.open('https://reddit.com/user/lookalive9', '_blank')}
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
             <Card className="shadow-md">
               <CardHeader className="pb-2">
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
                         View all {leagueData?.totalTeams || 12} teams in the league.
                       </DialogDescription>
                       </DialogHeader>
                       
                       <ScrollArea className="h-[70vh] w-full">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                           {/* Available Teams First */}
                           {leagueData?.availableTeams?.map((team) => (
                             <Card key={team.teamId} className="h-fit border-pb_blue bg-pb_blue/5">
                               <CardHeader className="pb-2">
                                 <div className="flex items-center justify-between">
                                   <CardTitle className="text-sm font-semibold text-pb_darkgray truncate">
                                     {team.teamName}
                                   </CardTitle>
                                   <Badge className="bg-pb_blue text-white text-xs px-2 py-1 font-medium">
                                     AVAILABLE
                                   </Badge>
                                 </div>
                               </CardHeader>
                               <CardContent className="pt-0 space-y-3">
                                 {/* Full Roster */}
                                 <div>
                                   <div className="space-y-1">
                                     {team.currentRoster?.map((player, i) => (
                                       <div key={i} className="flex items-center justify-between py-1 px-2 bg-white rounded text-xs border border-pb_blue/20">
                                         <span className="font-medium text-pb_darkgray truncate">{player.name}</span>
                                         <div className="flex items-center gap-2 shrink-0">
                                           <span className="text-pb_textgray w-8 text-center">{player.team}</span>
                                           <span className={getPositionPill(player.position)}>{player.position.split('/')[0]}</span>
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                                 
                                 
                               </CardContent>
                             </Card>
                           ))}
                           
                           {/* Filled Teams */}
                           {leagueData?.allTeams?.map((team) => (
                             <Card key={team.teamId} className="h-fit border-gray-200">
                               <CardHeader className="pb-2">
                                 <CardTitle className="text-sm font-semibold text-pb_darkgray truncate">
                                   {team.teamName}
                                 </CardTitle>
                               </CardHeader>
                               <CardContent className="pt-0 space-y-3">
                                 {/* Full Roster */}
                                 <div>
                                   <div className="space-y-1">
                                     {team.currentRoster?.map((player, i) => (
                                       <div key={i} className="flex items-center justify-between py-1 px-2 bg-pb_backgroundgray rounded text-xs border border-pb_lightergray">
                                         <span className="font-medium text-pb_darkgray truncate">{player.name}</span>
                                         <div className="flex items-center gap-2 shrink-0">
                                           <span className="text-pb_textgray w-8 text-center">{player.team}</span>
                                           <span className={getPositionPill(player.position)}>{player.position.split('/')[0]}</span>
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                                 
                               </CardContent>
                             </Card>
                           ))}
                         </div>
                       </ScrollArea>
                     </DialogContent>
                   </Dialog>
                 </div>
               </CardHeader>
               <Separator className="mt-0.5 mb-3 w-[95%] mx-auto" />
               <CardContent className="pt-0">
                 {leagueData?.availableTeams?.length > 0 ? (
                   <Tabs defaultValue="team-0" className="w-full">
                     {/* Horizontal Tab List */}
                     <TabsList className="grid w-full grid-cols-2 mb-4">
                       {leagueData?.availableTeams?.map((team, index) => (
                         <TabsTrigger 
                           key={team.teamId} 
                           value={`team-${index}`}
                           className="data-[state=active]:bg-pb_blue data-[state=active]:text-white"
                         >
                           {team.teamName}
                         </TabsTrigger>
                       ))}
                     </TabsList>

                     {/* Tab Content */}
                     <div className="w-full overflow-y-auto">
                       {leagueData?.availableTeams?.map((team, index) => (
                         <TabsContent key={team.teamId} value={`team-${index}`} className="mt-0">
                           <div className="space-y-1">
                             {/* Team Header */}
                             <div className="flex items-center justify-between pb-2 px-0 border-b border-gray-200 mb-4">
                               {/* <h3 className="font-semibold text-lg text-pb_darkgray">{team.teamName}</h3> */}
                               <div className="flex gap-2">
                                 {team.teamStrengths?.slice(0, 2).map((strength, i) => (
                                   <Badge key={i} className="bg-pb_green text-white text-xs px-2 py-1 font-medium">
                                     {strength}
                                   </Badge>
                                 ))}
                               </div>
                             </div>

                                                            {/* Current Roster - Enhanced */}
                               <div>
                                 <div className="space-y-1">
                                   {team.currentRoster?.map((player, i) => (
                                     <div key={i} className="flex items-center justify-between py-1 px-3 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                                       <div className="flex-1 min-w-0">
                                         <div className="font-medium text-sm text-pb_darkgray truncate">{player.name}</div>
                                       </div>
                                       <div className="flex items-center gap-2 shrink-0 text-xs">
                                         <span className="text-pb_textgray w-8 text-center">{player.team}</span>
                                         <span className={getPositionPill(player.position)}>{player.position.split('/')[0]}</span>
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </div>


                           </div>
                         </TabsContent>
                       ))}
                     </div>
                   </Tabs>
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
             <Card className="shadow-md">
               <CardHeader className="pb-2">
                 <CardTitle className="flex items-center gap-1 text-base text-pb_darkgray">
                   <FileText className="h-6 w-6 pr-1" />
                   Rulebook
                 </CardTitle>
               </CardHeader>
               <Separator className="mt-[7px] mb-3 w-[95%] mx-auto" />
               <CardContent className="pt-0">
                 {ruleSections.length > 0 ? (
                   <Tabs defaultValue="rule-0" className="w-full" orientation="horizontal">
                     <div className="flex h-[600px]">
                       {/* Left Sidebar with Tabs */}
                       <div className="w-40 border-r border-gray-200">
                         <TabsList className="flex flex-col h-full w-full p-0 pr-1 bg-transparent space-y-1 items-start justify-start">
                           {ruleSections.map((section, index) => {
                             const getIcon = (title) => {
                               switch (title) {
                                 case 'Format':
                                   return <AlignLeft className="h-4 w-4" />;
                                 case 'Scoring System':
                                   return <Target className="h-4 w-4" />;
                                 case 'Prize Pool':
                                   return <Medal className="h-4 w-4" />;
                                 case 'Owner Conduct':
                                   return <Handshake className="h-4 w-4" />;
                                 case 'Trades':
                                   return <ArrowRightLeft className="h-4 w-4" />;
                                 case 'Draft':
                                   return <ShieldUser className="h-4 w-4" />;
                                 case 'Playoffs':
                                   return <Goal className="h-4 w-4" />;
                                case 'Matchups':
                                  return <Swords className="h-4 w-4" />;
                                 default:
                                   return <FileText className="h-4 w-4" />;
                               }
                             };

                             return (
                               <TabsTrigger
                                 key={index}
                                 value={`rule-${index}`}
                                 className="w-full justify-start text-left px-3 py-2 text-sm font-medium text-pb_textgray hover:text-pb_blue data-[state=active]:hover:bg-pb_bluehover data-[state=active]:hover:text-white hover:bg-pb_blue/10 data-[state=active]:bg-pb_blue data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 self-start"
                               >
                                 <div className="flex items-center gap-2 w-full justify-start">
                                   {getIcon(section.title)}
                                   <span className="truncate text-left">{section.title}</span>
                                 </div>
                               </TabsTrigger>
                             );
                           })}
                         </TabsList>
                       </div>

                       {/* Right Content Area */}
                       <div className="flex-1 overflow-hidden">
                         <ScrollArea className="h-full">
                           {ruleSections.map((section, index) => (
                             <TabsContent
                               key={index}
                               value={`rule-${index}`}
                               className="mt-0 px-4 h-full focus-visible:outline-none"
                             >
                               <div className="space-y-4">
                                 <h2 className="text-md font-semibold text-pb_darkgray border-b border-gray-200 pb-2">
                                   {section.title}
                                 </h2>
                                 <div className="prose prose-sm max-w-none">
                                   <div 
                                     className="whitespace-pre-wrap text-sm text-pb_darkgray leading-relaxed"
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
      </div>
    </div>
  );
} 