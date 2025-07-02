'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Calendar, FileText, Mail, MessageSquare, Settings, Star, TrendingUp, Trophy, UserCheck, Users } from 'lucide-react';
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
    if (!rulebook) return [];
    
    const sections = rulebook.split('\n\n').filter(section => section.trim());
    const parsedSections = [];
    
    sections.forEach(section => {
      const lines = section.split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      
      if (title && content) {
        parsedSections.push({ title, content });
      } else if (title) {
        parsedSections.push({ title, content: '' });
      }
    });
    
    return parsedSections;
  };

  const ruleSections = parseRulebook(leagueData?.fullRulebook);

      return (
      <div className="min-h-screen bg-pb_backgroundgray">
        <div className="container mx-auto w-full py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-pb_darkgray mb-1">
              {leagueData?.leagueName || 'Elite NBA Dynasty League'}
            </h1>
            <p className="text-sm text-pb_textgray">
              {leagueData?.description || 'Join our competitive NBA dynasty league!'}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Badge variant="secondary" className="text-sm px-3 py-1 bg-pb_blue text-white font-semibold">
              {leagueData?.sport} {leagueData?.format}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1 border-2 border-pb_blue text-pb_blue font-semibold">
              {leagueData?.availableSpots} spots available
            </Badge>
          </div>
        </div>

                 <div className="grid grid-cols-1 lg:grid-cols-13 gap-2">
           {/* Left Column - League Details & Commissioner Info */}
           <div className="lg:col-span-3 space-y-2">
            {/* League Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-pb_blue" />
                  League Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-pb_lightestgray rounded-lg">
                    <p className="text-sm font-medium text-pb_textgray mb-1">Sport & Format</p>
                    <p className="text-lg font-semibold text-pb_darkgray">
                      {leagueData?.sport} {leagueData?.format}
                    </p>
                  </div>
                  <div className="p-3 bg-pb_lightestgray rounded-lg">
                    <p className="text-sm font-medium text-pb_textgray mb-1">Scoring System</p>
                    <p className="text-lg font-semibold text-pb_darkgray">{leagueData?.scoring}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-pb_darkgray flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    League Settings
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-pb_lightestgray rounded">
                      <p className="text-pb_textgray">Teams</p>
                      <p className="font-semibold text-pb_darkgray">{leagueData?.totalTeams || 12}</p>
                    </div>
                    <div className="p-2 bg-pb_lightestgray rounded">
                      <p className="text-pb_textgray">Available</p>
                      <p className="font-semibold text-pb_darkgray">{leagueData?.availableSpots || 2}</p>
                    </div>
                    <div className="p-2 bg-pb_lightestgray rounded">
                      <p className="text-pb_textgray">Entry Fee</p>
                      <p className="font-semibold text-pb_darkgray">{leagueData?.settings?.entryFee || '$75'}</p>
                    </div>
                    <div className="p-2 bg-pb_lightestgray rounded">
                      <p className="text-pb_textgray">Games Cap</p>
                      <p className="font-semibold text-pb_darkgray">{leagueData?.settings?.gamesCap || '40/week'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-pb_darkgray flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Roster Structure
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-pb_lightestgray rounded">
                      <p className="text-pb_textgray mb-1">Starters</p>
                      <p className="font-medium text-pb_darkgray">{leagueData?.settings?.roster?.starters}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-pb_lightestgray rounded text-center">
                        <p className="text-pb_textgray text-xs">Bench</p>
                        <p className="font-semibold text-pb_darkgray">{leagueData?.settings?.roster?.bench || 3}</p>
                      </div>
                      <div className="p-2 bg-pb_lightestgray rounded text-center">
                        <p className="text-pb_textgray text-xs">IR</p>
                        <p className="font-semibold text-pb_darkgray">{leagueData?.settings?.roster?.ir || 3}</p>
                      </div>
                      <div className="p-2 bg-pb_lightestgray rounded text-center">
                        <p className="text-pb_textgray text-xs">Minors</p>
                        <p className="font-semibold text-pb_darkgray">{leagueData?.settings?.roster?.minorLeague || 5}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commissioner Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-pb_blue" />
                  Commissioner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-pb_blue to-pb_bluehover rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {leagueData?.commissioner?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-pb_darkgray text-lg">{leagueData?.commissioner?.name || 'Austin (League Commissioner)'}</p>
                    <p className="text-pb_textgray">{leagueData?.commissioner?.email || 'austin@playbookfantasy.com'}</p>
                  </div>
                </div>
                <Button className="w-full bg-pb_blue hover:bg-pb_bluehover text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Commissioner
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
                   <UserCheck className="h-3 w-3 text-pb_blue" />
                   Available Teams ({leagueData?.availableSpots || 2})
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 {leagueData?.availableTeams?.length > 0 ? (
                   <Tabs defaultValue="team-0" className="flex gap-2" orientation="vertical">
                     {/* Vertical Tab List */}
                     <TabsList className="flex flex-col h-fit w-12 p-0">
                       {leagueData?.availableTeams?.map((team, index) => (
                         <TabsTrigger 
                           key={team.teamId} 
                           value={`team-${index}`}
                           className="w-10 h-10 p-0 data-[state=active]:bg-pb_blue data-[state=active]:text-white"
                           title={team.teamName}
                         >
                           <Users className="h-4 w-4" />
                         </TabsTrigger>
                       ))}
                     </TabsList>

                     {/* Tab Content */}
                     <div className="flex-1">
                       {leagueData?.availableTeams?.map((team, index) => (
                         <TabsContent key={team.teamId} value={`team-${index}`} className="mt-0">
                           <div className="space-y-1">
                             {/* Team Header */}
                             <div className="flex items-center justify-between p-1 bg-pb_lightestgray rounded">
                               <h3 className="font-medium text-sm text-pb_darkgray">{team.teamName}</h3>
                               <div className="flex gap-0.5">
                                 {team.teamStrengths?.slice(0, 2).map((strength, i) => (
                                   <Badge key={i} className="bg-green-100 text-green-800 text-xs px-1 py-0 h-3 text-[10px]">
                                     {strength}
                                   </Badge>
                                 ))}
                               </div>
                             </div>

                             {/* Current Roster - Ultra Compact */}
                             <div>
                               <h4 className="text-xs font-medium text-pb_darkgray mb-0.5 flex items-center gap-0.5">
                                 <TrendingUp className="h-2 w-2" />
                                 Current ({team.currentRoster?.length})
                               </h4>
                               <div className="space-y-0.5">
                                 {team.currentRoster?.map((player, i) => (
                                   <div key={i} className="flex items-center justify-between py-0.5 px-1 bg-pb_lightestgray rounded text-xs">
                                     <span className="font-medium text-pb_darkgray truncate">{player.name}</span>
                                     <div className="flex items-center gap-1 shrink-0 ml-2">
                                       <span className="text-pb_textgray">{player.team}</span>
                                       <span className="text-pb_textgray">{player.position}</span>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>

                             {/* Minor League - Ultra Compact */}
                             <div>
                               <h4 className="text-xs font-medium text-pb_darkgray mb-0.5 flex items-center gap-0.5">
                                 <Star className="h-2 w-2" />
                                 Minors ({team.minorLeague?.length})
                               </h4>
                               <div className="space-y-0.5">
                                 {team.minorLeague?.map((player, i) => (
                                   <div key={i} className="flex items-center justify-between py-0.5 px-1 bg-blue-50 rounded text-xs">
                                     <span className="font-medium text-pb_darkgray truncate">{player.name}</span>
                                     <div className="flex items-center gap-1 shrink-0 ml-2">
                                       <span className="text-pb_textgray">{player.team}</span>
                                       <span className="text-blue-700">{player.position}</span>
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
           <div className="lg:col-span-6 space-y-2">
             {/* League Rules - Compact Accordion Display */}
             <Card className="shadow-lg">
               <CardHeader className="pb-2">
                 <CardTitle className="flex items-center gap-1 text-base">
                   <FileText className="h-3 w-3 text-pb_blue" />
                   Rulebook
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 {ruleSections.length > 0 ? (
                   <Accordion type="single" collapsible className="w-full">
                     {ruleSections.map((section, index) => (
                       <AccordionItem key={index} value={`item-${index}`} className="border-b border-pb_lightgray">
                         <AccordionTrigger className="text-left font-medium text-xs text-pb_darkgray hover:text-pb_blue py-1">
                           {section.title}
                         </AccordionTrigger>
                         <AccordionContent>
                           <div className="prose prose-sm max-w-none">
                             <pre className="whitespace-pre-wrap font-sans text-xs text-pb_textgray leading-relaxed bg-pb_lightestgray p-2 rounded border border-pb_lightgray">
{section.content}
                             </pre>
                           </div>
                         </AccordionContent>
                       </AccordionItem>
                     ))}
                   </Accordion>
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