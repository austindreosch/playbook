'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowRight, ArrowRightLeft, Calendar, Clock, FileText, Flag, Mail, Medal, MessageSquare, Settings, Shield, ShieldUser, Star, Swords, Target, TrendingUp, Trophy, UserCheck, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CommissionerRecruitPage() {
  const params = useParams();
  const leagueID = params.leagueID;
  
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

**No sandbagging.** You must always be engaged, playing and setting coherent lineups, regardless of the strength of your team. Season "tanking" is **allowed only through trading**. 

**Set your lineups.** The absolute minimum requirement for playing in the league is making sure your roster is properly placed and off the bench for every matchup. It's your responsibility to make sure that your match-ups' competitive integrity isn't spoiled by your ineptness or indifference towards this essential duty.

**No roster self-destructing.** Any malicious or nonsensical player drops or trades reasonably diagnosed as reckless and indicative of a player choosing to disregard the competitive integrity of the league will be **undone** and if needed, the offending team will be **held frozen** until a replacement owner can be found.`
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
              {leagueData?.leagueName || 'Elite NBA Dynasty League'}
            </h1>
          </div>
          
          {/* Key Details Badges */}
          <div className="flex flex-wrap gap-2 ml-4">
            <Badge className="bg-pb_blue hover:bg-pb_bluehover text-white font-semibold px-3 py-1">
              NBA
            </Badge>
            <Badge className="bg-pb_blue hover:bg-pb_bluehover text-white font-semibold px-3 py-1">
              Dynasty
            </Badge>
            <Badge className="bg-pb_blue hover:bg-pb_bluehover text-white font-semibold px-3 py-1">
              9-Cat
            </Badge>
            <Badge className="bg-pb_blue hover:bg-pb_bluehover text-white font-semibold px-3 py-1">
              H2H
            </Badge>
            <Badge className="bg-pb_textgray hover:bg-pb_darkgray text-white font-semibold px-3 py-1">
              Fantrax
            </Badge>
            <Badge className="bg-pb_darkgray hover:bg-pb_textgray text-white font-semibold px-3 py-1">
              {leagueData?.availableSpots || 2} Spots Available
            </Badge>
          </div>
        </div>

                 <div className="grid grid-cols-1 lg:grid-cols-13 gap-2">
           {/* Left Column - League Details & Commissioner Info */}
           <div className="lg:col-span-2 space-y-2">
                         {/* League Information */}
             <Card className="shadow-lg border-0 bg-white">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-2 text-base font-bold text-pb_darkgray">
                   <Trophy className="h-5 w-5 text-pb_blue" />
                   League Details
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0 space-y-4">
                 {/* Format & Scoring */}
                 <div className="space-y-2">
                   <div className="flex items-center justify-between py-2 px-3 bg-pb_blue/5 rounded-lg">
                     <span className="text-pb_textgray text-sm font-medium">Sport</span>
                     <span className="font-bold text-pb_darkgray text-sm">
                       NBA
                     </span>
                   </div>
                   <div className="flex items-center justify-between py-2 px-3 bg-pb_blue/5 rounded-lg">
                     <span className="text-pb_textgray text-sm font-medium">Format</span>
                     <span className="font-bold text-pb_darkgray text-sm">
                       {leagueData?.format || 'Dynasty'}
                     </span>
                   </div>
                   <div className="flex items-center justify-between py-2 px-3 bg-pb_blue/5 rounded-lg">
                     <span className="text-pb_textgray text-sm font-medium">Scoring</span>
                     <span className="font-bold text-pb_darkgray text-sm">Categories</span>
                   </div>
                   <div className="flex items-center justify-between py-2 px-3 bg-pb_blue/5 rounded-lg">
                     <span className="text-pb_textgray text-sm font-medium">Scoring</span>
                     <span className="font-bold text-pb_darkgray text-sm">H2H</span>
                   </div>
                 </div>
                 
                 {/* Key Numbers */}
                 <div className="grid grid-cols-2 gap-2">
                   <div className="text-center py-2 bg-gray-50 rounded-lg border">
                     <div className="text-2xl font-bold text-pb_blue">12</div>
                     <div className="text-xs text-pb_textgray font-medium">Total Teams</div>
                   </div>
                   <div className="text-center py-2 bg-gray-50 rounded-lg border">
                     <div className="text-2xl font-bold text-pb_green">6</div>
                     <div className="text-xs text-pb_textgray font-medium">Playoff Spots</div>
                   </div>
                 </div>
                 
                 {/* Financial & Rules */}
                 <div className="space-y-2">
                   <div className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg">
                     <span className="text-pb_textgray text-sm font-medium">Entry Fee</span>
                     <span className="font-bold text-pb_darkgray text-sm">$75</span>
                   </div>
                   {/* <div className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg">
                     <span className="text-pb_textgray text-sm font-medium">Games Cap</span>
                     <span className="font-bold text-pb_darkgray text-sm">40</span>
                   </div> */}
                 </div>
                 
                 {/* Roster Breakdown */}
                 <div className="border-t pt-3">
                   <h4 className="text-sm font-bold text-pb_darkgray mb-2">Roster Structure</h4>
                   <div className="space-y-2">
                                           <div className="flex items-center justify-between py-2 px-3 bg-pb_blue/5 rounded-lg">
                        <span className="text-pb_textgray text-sm font-medium">Starters</span>
                        <span className="font-bold text-pb_darkgray text-sm">PG, SG, SF, PF, C, G, F, UTIL (3)</span>
                      </div>
                     <div className="grid grid-cols-3 gap-2 text-xs">
                       <div className="text-center py-2 bg-white border rounded">
                         <div className="font-bold text-pb_darkgray">{leagueData?.settings?.roster?.bench || 3}</div>
                         <div className="text-pb_textgray">Bench</div>
                       </div>
                       <div className="text-center py-2 bg-white border rounded">
                         <div className="font-bold text-pb_darkgray">{leagueData?.settings?.roster?.ir || 3}</div>
                         <div className="text-pb_textgray">IR</div>
                       </div>
                       <div className="text-center py-2 bg-white border rounded">
                         <div className="font-bold text-pb_darkgray">{leagueData?.settings?.roster?.minorLeague || 5}</div>
                         <div className="text-pb_textgray">Minors</div>
                       </div>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>

                         {/* Commissioner Information */}
             <Card className="shadow-lg">
               <CardHeader className="pb-1">
                 <CardTitle className="flex items-center gap-1 text-sm">
                   <MessageSquare className="h-5 w-5 pr-1 text-pb_blue" />
                   Commissioner
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="h-8 w-8 bg-gradient-to-br from-pb_blue to-pb_bluehover rounded-full flex items-center justify-center text-white font-bold text-xs shadow">
                     {leagueData?.commissioner?.name?.charAt(0) || 'A'}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium text-pb_darkgray text-xs truncate">{leagueData?.commissioner?.name || 'Austin (League Commissioner)'}</p>
                     <p className="text-pb_textgray text-xs truncate">{leagueData?.commissioner?.email || 'austin@playbookfantasy.com'}</p>
                   </div>
                 </div>
                 <Button className="w-full bg-pb_blue hover:bg-pb_bluehover text-white text-xs h-7">
                   <Mail className="h-5 w-5 pr-1" />
                   Contact
                 </Button>
               </CardContent>
             </Card>
                     </div>

           {/* Middle Column - Available Teams */}
           <div className="lg:col-span-4 space-y-2">
                         {/* Available Teams - Vertical Tabs with Compact Rows */}
             <Card className="shadow-lg">
               <CardHeader className="pb-2">
                 <CardTitle className="flex items-center gap-1 text-base">
                   <UserCheck className="h-5 w-5 pr-1 text-pb_blue" />
                   Available Teams ({leagueData?.availableSpots || 2})
                 </CardTitle>
               </CardHeader>
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
                             <div className="flex items-center justify-between py-3 px-0 border-b border-gray-200">
                               <h3 className="font-semibold text-lg text-pb_darkgray">{team.teamName}</h3>
                               <div className="flex gap-2">
                                 {team.teamStrengths?.slice(0, 2).map((strength, i) => (
                                   <Badge key={i} className="bg-pb_blue text-white text-xs px-2 py-1 font-medium">
                                     {strength}
                                   </Badge>
                                 ))}
                               </div>
                             </div>

                                                            {/* Current Roster - Enhanced */}
                               <div>
                                 <h4 className="text-xs font-medium text-pb_darkgray mb-1 flex items-center gap-0.5">
                                   <TrendingUp className="h-5 w-5 pr-1" />
                                   Current Roster ({team.currentRoster?.length})
                                 </h4>
                                 <div className="space-y-1">
                                   {team.currentRoster?.map((player, i) => (
                                     <div key={i} className="flex items-center justify-between py-1 px-3 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                                       <div className="flex-1 min-w-0">
                                         <div className="font-medium text-sm text-pb_darkgray truncate">{player.name}</div>
                                       </div>
                                       <div className="shrink-0 ml-2 flex items-center gap-2 text-xs">
                                         <span className="font-mono bg-gray-100 px-2 py-1 rounded text-pb_textgray">{player.team}</span>
                                         <span className="text-pb_blue font-medium">{player.position}</span>
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </div>

                             {/* Minor League - Ultra Compact */}
                             <div>
                               <h4 className="text-xs font-medium text-pb_darkgray my-1 flex items-center gap-0.5">
                                 <Star className="h-5 w-5 pr-1" />
                                 Minors ({team.minorLeague?.length})
                               </h4>
                               <div className="space-y-1">
                                 {team.minorLeague?.map((player, i) => (
                                   <div key={i} className="flex items-center justify-between py-1 px-3 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                                     <div className="flex-1 min-w-0">
                                       <div className="font-medium text-sm text-pb_darkgray truncate">{player.name}</div>
                                     </div>
                                     <div className="shrink-0 ml-2 flex items-center gap-2 text-xs">
                                       <span className="font-mono bg-gray-100 px-2 py-1 rounded text-pb_textgray">{player.team}</span>
                                       <span className="text-pb_blue font-medium">{player.position}</span>
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
           <div className="lg:col-span-7 space-y-2">
             {/* League Rules - Left-Justified Tabs Display */}
             <Card className="shadow-lg">
               <CardHeader className="pb-2">
                 <CardTitle className="flex items-center gap-1 text-base">
                   <FileText className="h-5 w-5 pr-1 text-pb_blue" />
                   Rulebook
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 {ruleSections.length > 0 ? (
                   <Tabs defaultValue="rule-0" className="w-full" orientation="horizontal">
                     <div className="flex h-[600px]">
                       {/* Left Sidebar with Tabs */}
                       <div className="w-48 border-r border-gray-200">
                         <TabsList className="flex flex-col h-full w-full p-0 pr-1 bg-transparent space-y-1 items-start justify-start">
                           {ruleSections.map((section, index) => {
                             const getIcon = (title) => {
                               switch (title) {
                                 case 'Format':
                                   return <Users className="h-4 w-4" />;
                                 case 'Scoring System':
                                   return <Target className="h-4 w-4" />;
                                 case 'Prize Pool':
                                   return <Medal className="h-4 w-4" />;
                                 case 'Owner Conduct':
                                   return <Flag className="h-4 w-4" />;
                                 case 'Trades':
                                   return <ArrowRightLeft className="h-4 w-4" />;
                                 case 'Draft':
                                   return <ShieldUser className="h-4 w-4" />;
                                 case 'Playoffs':
                                   return <FlagTarget className="h-4 w-4" />;
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
                                 className="w-full justify-start text-left px-3 py-2 text-sm font-medium text-pb_textgray hover:text-pb_blue hover:bg-pb_blue/5 data-[state=active]:bg-pb_blue data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 self-start"
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
                                 <h2 className="text-lg font-semibold text-pb_darkgray border-b border-gray-200 pb-2">
                                   {section.title}
                                 </h2>
                                 <div className="prose prose-sm max-w-none">
                                   <div 
                                     className="whitespace-pre-wrap font-sans text-sm text-pb_darkgray leading-relaxed"
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