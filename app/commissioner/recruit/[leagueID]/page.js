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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading league information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">League Not Found</CardTitle>
            <CardDescription>
              The league with ID "{leagueID}" could not be found or is not available for recruitment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {leagueData?.leagueName || 'Elite NBA Dynasty League'}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {leagueData?.description || 'Join our competitive NBA dynasty league!'}
          </p>
          <div className="flex justify-center gap-2 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {leagueData?.sport} {leagueData?.format}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {leagueData?.availableSpots} spots available
            </Badge>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              League Details
            </TabsTrigger>
            <TabsTrigger value="rulebook" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Rulebook
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Available Teams
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Join League
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: League Overview */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* League Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    League Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Sport</Label>
                      <p className="text-lg font-semibold">{leagueData?.sport || 'NBA'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Format</Label>
                      <p className="text-lg font-semibold">{leagueData?.format || 'Dynasty'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Scoring</Label>
                      <p className="text-lg font-semibold">{leagueData?.scoring || 'Categories'}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">League Settings</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Teams: {leagueData?.totalTeams || 12}</li>
                        <li>• Available Spots: {leagueData?.availableSpots || 2}</li>
                        <li>• Entry Fee: {leagueData?.settings?.entryFee || '$75'}</li>
                        <li>• Games Cap: {leagueData?.settings?.gamesCap || '40 per week'}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Roster Structure</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Starters: {leagueData?.settings?.roster?.starters || 'PG, SG, SF, PF, C, G, F, UTIL (3)'}</li>
                        <li>• Bench: {leagueData?.settings?.roster?.bench || 3}</li>
                        <li>• IR: {leagueData?.settings?.roster?.ir || 3}</li>
                        <li>• Minor League: {leagueData?.settings?.roster?.minorLeague || 5}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commissioner Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Commissioner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {leagueData?.commissioner?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-semibold">{leagueData?.commissioner?.name || 'Austin (League Commissioner)'}</p>
                      <p className="text-gray-600">{leagueData?.commissioner?.email || 'austin@playbookfantasy.com'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Content: Rulebook */}
          <TabsContent value="rulebook">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Complete League Rulebook
                </CardTitle>
                <CardDescription>
                  Full rules and regulations for this dynasty league
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">
{leagueData?.fullRulebook || 'League rulebook loading...'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Content: Available Teams */}
          <TabsContent value="teams">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Available Teams ({leagueData?.availableSpots || 2})
                  </CardTitle>
                  <CardDescription>
                    Choose from these available teams with their current rosters
                  </CardDescription>
                </CardHeader>
              </Card>

              {leagueData?.availableTeams?.map((team, index) => (
                <Card key={team.teamId}>
                  <CardHeader>
                    <CardTitle>{team.teamName}</CardTitle>
                    <CardDescription>
                      <div className="flex gap-2 mt-2">
                        {team.teamStrengths?.map((strength, i) => (
                          <Badge key={i} variant="secondary">{strength}</Badge>
                        ))}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Current Roster</h4>
                        <div className="space-y-2">
                          {team.currentRoster?.map((player, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="font-medium">{player.name}</span>
                              <div className="text-right">
                                <div className="text-sm font-medium">{player.position}</div>
                                <div className="text-xs text-gray-500">{player.team}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Minor League Roster</h4>
                        <div className="space-y-2">
                          {team.minorLeague?.map((player, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                              <span className="font-medium">{player.name}</span>
                              <div className="text-right">
                                <div className="text-sm font-medium">{player.position}</div>
                                <div className="text-xs text-gray-500">{player.team}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Team Analysis</h5>
                          <div className="text-sm text-gray-600">
                            <p><strong>Strengths:</strong> {team.teamStrengths?.join(', ')}</p>
                            <p><strong>Needs:</strong> {team.teamWeaknesses?.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No available teams information loaded.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab Content: Join League */}
          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {submitted ? 'Request Submitted!' : 'Join This League'}
                </CardTitle>
                <CardDescription>
                  {submitted 
                    ? 'Your join request has been sent to the commissioner. You should hear back soon!'
                    : 'Fill out the form below to request to join this league'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Request Submitted Successfully</h3>
                    <p className="text-gray-600 mb-4">
                      The commissioner will review your application and get back to you via email.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="Your first name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Your last name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="teamName">Preferred Team Name</Label>
                        <Input 
                          id="teamName" 
                          placeholder="Enter your team name"
                          value={formData.teamName}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="experience">Fantasy Experience</Label>
                        <Textarea 
                          id="experience" 
                          placeholder="Tell us about your fantasy sports experience and why you'd be a great addition to this league..."
                          rows={4}
                          value={formData.experience}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <Button type="submit" className="flex-1" disabled={submitting}>
                          <Mail className="h-4 w-4 mr-2" />
                          {submitting ? 'Submitting...' : 'Request to Join'}
                        </Button>
                        <Button type="button" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Save for Later
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 