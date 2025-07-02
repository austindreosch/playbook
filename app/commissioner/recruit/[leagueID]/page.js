'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, FileText, Mail, MessageSquare, Settings, Trophy, UserCheck, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CommissionerRecruitPage() {
  const params = useParams();
  const leagueID = params.leagueID;
  
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    teamName: '',
    experience: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/commissioner/join-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leagueID,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const result = await response.json();
      console.log('Join request submitted:', result);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting join request:', err);
      setError('Failed to submit join request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="w-full max-w-md rounded-lg border-1.5 border-pb_lightgray shadow-sm bg-pb_paperwhite p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-pb_red mb-2">League Not Found</h2>
            <p className="text-pb_textgray mb-4">
              The league with ID "{leagueID}" could not be found or is not available for recruitment.
            </p>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pb_backgroundgray">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pb_darkgray mb-2">
            {leagueData?.leagueName || 'Elite NBA Dynasty League'}
          </h1>
          <p className="text-xl text-pb_textgray mb-4">
            {leagueData?.description || 'Join our competitive NBA dynasty league!'}
          </p>
          <div className="flex justify-center gap-2 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-pb_blue text-white">
              {leagueData?.sport} {leagueData?.format}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 border-pb_lightgray text-pb_darkgray">
              {leagueData?.availableSpots} spots available
            </Badge>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-pb_lightestgray">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-pb_paperwhite data-[state=active]:text-pb_darkgray">
              <Trophy className="h-4 w-4" />
              League Details
            </TabsTrigger>
            <TabsTrigger value="rulebook" className="flex items-center gap-2 data-[state=active]:bg-pb_paperwhite data-[state=active]:text-pb_darkgray">
              <FileText className="h-4 w-4" />
              Rulebook
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2 data-[state=active]:bg-pb_paperwhite data-[state=active]:text-pb_darkgray">
              <UserCheck className="h-4 w-4" />
              Available Teams
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-2 data-[state=active]:bg-pb_paperwhite data-[state=active]:text-pb_darkgray">
              <MessageSquare className="h-4 w-4" />
              Join League
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: League Overview */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* League Information */}
              <div className="rounded-lg border-1.5 border-pb_lightgray shadow-sm bg-pb_paperwhite p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="h-5 w-5 text-pb_darkgray" />
                  <h3 className="font-semibold text-pb_darkgray text-lg">League Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-pb_textgray">Sport</Label>
                      <p className="text-lg font-semibold text-pb_darkgray">{leagueData?.sport || 'NBA'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-pb_textgray">Format</Label>
                      <p className="text-lg font-semibold text-pb_darkgray">{leagueData?.format || 'Dynasty'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-pb_textgray">Scoring</Label>
                      <p className="text-lg font-semibold text-pb_darkgray">{leagueData?.scoring || 'Categories'}</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-pb_lightgray" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-pb_darkgray">League Settings</h4>
                      <ul className="space-y-1 text-pb_textgray">
                        <li>• Teams: {leagueData?.totalTeams || 12}</li>
                        <li>• Available Spots: {leagueData?.availableSpots || 2}</li>
                        <li>• Entry Fee: {leagueData?.settings?.entryFee || '$75'}</li>
                        <li>• Games Cap: {leagueData?.settings?.gamesCap || '40 per week'}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-pb_darkgray">Roster Structure</h4>
                      <ul className="space-y-1 text-pb_textgray">
                        <li>• Starters: {leagueData?.settings?.roster?.starters || 'PG, SG, SF, PF, C, G, F, UTIL (3)'}</li>
                        <li>• Bench: {leagueData?.settings?.roster?.bench || 3}</li>
                        <li>• IR: {leagueData?.settings?.roster?.ir || 3}</li>
                        <li>• Minor League: {leagueData?.settings?.roster?.minorLeague || 5}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commissioner Information */}
              <div className="rounded-lg border-1.5 border-pb_lightgray shadow-sm bg-pb_paperwhite p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="h-5 w-5 text-pb_darkgray" />
                  <h3 className="font-semibold text-pb_darkgray text-lg">Commissioner</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-pb_blue rounded-full flex items-center justify-center text-white font-semibold">
                    {leagueData?.commissioner?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-pb_darkgray">{leagueData?.commissioner?.name || 'Austin (League Commissioner)'}</p>
                    <p className="text-pb_textgray">{leagueData?.commissioner?.email || 'austin@playbookfantasy.com'}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab Content: Rulebook */}
          <TabsContent value="rulebook">
            <div className="rounded-lg border-1.5 border-pb_lightgray shadow-sm bg-pb_paperwhite p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-pb_darkgray" />
                <h3 className="font-semibold text-pb_darkgray text-lg">Complete League Rulebook</h3>
              </div>
              <p className="text-pb_textgray mb-4">
                Full rules and regulations for this dynasty league
              </p>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-pb_lightestgray p-4 rounded-lg border border-pb_lightgray text-pb_darkgray">
{leagueData?.fullRulebook || 'League rulebook loading...'}
                </pre>
              </div>
            </div>
          </TabsContent>

          {/* Tab Content: Available Teams */}
          <TabsContent value="teams">
            <div className="space-y-6">
              <div className="rounded-lg border-1.5 border-pb_lightgray shadow-sm bg-pb_paperwhite p-6">
                <div className="flex items-center gap-3 mb-2">
                  <UserCheck className="h-5 w-5 text-pb_darkgray" />
                  <h3 className="font-semibold text-pb_darkgray text-lg">Available Teams ({leagueData?.availableSpots || 2})</h3>
                </div>
                <p className="text-pb_textgray">
                  Choose from these available teams with their current rosters
                </p>
              </div>

              {leagueData?.availableTeams?.map((team, index) => (
                <div key={team.teamId} className="rounded-lg border-1.5 border-pb_lightgray shadow-sm bg-pb_paperwhite p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-pb_darkgray text-lg mb-2">{team.teamName}</h4>
                    <div className="flex gap-2">
                      {team.teamStrengths?.map((strength, i) => (
                        <Badge key={i} className="bg-pb_blue text-white">{strength}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-3 text-pb_darkgray">Current Roster</h5>
                      <div className="space-y-2">
                        {team.currentRoster?.map((player, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-pb_lightestgray rounded border border-pb_lightgray">
                            <span className="font-medium text-pb_darkgray">{player.name}</span>
                            <div className="text-right">
                              <div className="text-sm font-medium text-pb_darkgray">{player.position}</div>
                              <div className="text-xs text-pb_textgray">{player.team}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-3 text-pb_darkgray">Minor League Roster</h5>
                      <div className="space-y-2">
                        {team.minorLeague?.map((player, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-pb_blue-50 rounded border border-pb_blue-200">
                            <span className="font-medium text-pb_darkgray">{player.name}</span>
                            <div className="text-right">
                              <div className="text-sm font-medium text-pb_darkgray">{player.position}</div>
                              <div className="text-xs text-pb_textgray">{player.team}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <h6 className="font-medium mb-2 text-pb_darkgray">Team Analysis</h6>
                        <div className="text-sm text-pb_textgray">
                          <p><strong className="text-pb_darkgray">Strengths:</strong> {team.teamStrengths?.join(', ')}</p>
                          <p><strong className="text-pb_darkgray">Needs:</strong> {team.teamWeaknesses?.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="rounded-lg border-1.5 border-pb_lightgray shadow-sm bg-pb_paperwhite p-8">
                  <div className="text-center">
                    <p className="text-pb_textgray">No available teams information loaded.</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab Content: Join League */}
          <TabsContent value="join">
            <div className="rounded-lg border-1.5 border-pb_lightgray shadow-sm bg-pb_paperwhite p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-5 w-5 text-pb_darkgray" />
                <h3 className="font-semibold text-pb_darkgray text-lg">
                  {submitted ? 'Request Submitted!' : 'Join This League'}
                </h3>
              </div>
              <p className="text-pb_textgray mb-6">
                {submitted 
                  ? 'Your join request has been sent to the commissioner. You should hear back soon!'
                  : 'Fill out the form below to request to join this league'
                }
              </p>
              <div className="space-y-4">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-pb_green rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-pb_darkgray">Request Submitted Successfully</h4>
                    <p className="text-pb_textgray mb-4">
                      The commissioner will review your application and get back to you via email.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline" className="border-pb_lightgray text-pb_darkgray hover:bg-pb_lightestgray">
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-pb_darkgray">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="Your first name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="border-pb_lightgray focus:border-pb_blue"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-pb_darkgray">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Your last name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="border-pb_lightgray focus:border-pb_blue"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-pb_darkgray">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="border-pb_lightgray focus:border-pb_blue"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="teamName" className="text-pb_darkgray">Preferred Team Name</Label>
                        <Input 
                          id="teamName" 
                          placeholder="Enter your team name"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          className="border-pb_lightgray focus:border-pb_blue"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="experience" className="text-pb_darkgray">Fantasy Experience</Label>
                        <Textarea 
                          id="experience" 
                          placeholder="Tell us about your fantasy sports experience and why you'd be a great addition to this league..."
                          rows={4}
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="border-pb_lightgray focus:border-pb_blue"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <Button type="submit" className="flex-1 bg-pb_blue hover:bg-pb_bluehover text-white" disabled={submitting}>
                          <Mail className="h-4 w-4 mr-2" />
                          {submitting ? 'Submitting...' : 'Request to Join'}
                        </Button>
                        <Button type="button" variant="outline" className="border-pb_lightgray text-pb_darkgray hover:bg-pb_lightestgray">
                          <Calendar className="h-4 w-4 mr-2" />
                          Save for Later
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 