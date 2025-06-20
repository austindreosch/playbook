//  /register page (bonus questions after registration)

'use client'

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@auth0/nextjs-auth0/client';
import { baseball, basketball, football, footballHelmet, golfDriver, iceHockey, soccerBall, steeringWheel, tire, toolbox } from '@lucide/lab';
import { Activity, AppWindow, Binoculars, BookOpenText, Brain, Calculator, CalendarRange, ChartCandlestick, ClipboardList, Compass, createLucideIcon, Dribbble, Gamepad2, HelpCircle, LandPlot, ListTodo, MessagesSquare, Rss, Scale, ScanSearch, Search, ShieldUser, Speech, Swords, TableProperties, ThumbsDown, Tv, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

const platformOptions = [
  { value: 'fantrax', label: 'Fantrax', supported: true },
  { value: 'sleeper', label: 'Sleeper', supported: true },
  { value: 'yahoo', label: 'Yahoo', supported: true},
  { value: 'espn', label: 'ESPN', supported: true, separator: true },
  { value: 'cbs-sports', label: 'CBS Sports' },
  { value: 'nfl-com', label: 'NFL.com' },
  { value: 'underdog', label: 'Underdog' },
  { value: 'fanduel', label: 'FanDuel' },
  { value: 'draftkings', label: 'Draft Kings' },
  { value: 'mfl', label: 'MyFantasyLeague' },
  { value: 'ffpc', label: 'FFPC' },
  { value: 'league-tycoon', label: 'League Tycoon' },
  // { value: 'fleaflicker', label: 'Fleaflicker' },
  // { value: 'ottoneu', label: 'Ottoneu' },
  { value: 'other', label: 'Other', },
];




const sportOptions = [
  { value: 'nfl', label: 'NFL',  icon: createLucideIcon('football', football), supported: true },
  { value: 'nba', label: 'NBA',  icon: createLucideIcon('basketball', basketball), supported: true },
  { value: 'mlb', label: 'MLB',  icon: createLucideIcon('baseball', baseball), supported: true, separator: true },
  { value: 'nhl', label: 'NHL', icon: createLucideIcon('ice-hockey', iceHockey) },
  { value: 'soccer', label: 'Soccer', icon: createLucideIcon('soccer-ball', soccerBall) },
  { value: 'ncaa-football', label: 'NCAA Football', icon: createLucideIcon('football-helmet', footballHelmet) },
  { value: 'ncaa-basketball', label: 'NCAA Basketball', icon: Dribbble },
  { value: 'pga', label: 'PGA', icon: createLucideIcon('golf-driver', golfDriver) },
  { value: 'nascar', label: 'NASCAR', icon: createLucideIcon('tire', tire)  },
  { value: 'esports', label: 'eSports', icon: Gamepad2 },
  // { value: 'f1', label: 'F1', icon: createLucideIcon('steering-wheel', steeringWheel)},
  // { value: 'wnba', label: 'WNBA', icon: createLucideIcon('basketball', basketball) },
  // { value: 'cfl', label: 'CFL', icon: createLucideIcon('football', football) },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

const fantasyProblemOptions = [
    { value: 'time-effort', label: 'Excelling in fantasy takes too much time & effort' },
    { value: 'info-miss', label: 'Missing key information and losing when I get lazy/busy' },
    { value: 'trade-stress', label: 'Finding league winning trades is difficult and time-consuming' },
    { value: 'expert-trust', label: 'It\'s hard to know which experts to listen to' },
    { value: 'time-advantage', label: 'Players with more free time have an unfair advantage' },
    { value: 'waiver-miss', label: 'I hate missing the big waiver wire opportunities' },
    { value: 'research-scattered', label: 'My favorite resources are scattered, annoying to use together' },
    { value: 'advice-not-tailored', label: 'Expert advice isn\'t tailored to my specific circumstances' },
    { value: 'news-overload', label: 'Keeping up with all sports news feels like a full-time job' },
    { value: 'analysis-paralysis', label: 'Analysis paralysis with every team decision' },
    { value: 'h2h-work', label: 'Min/maxing on H2H matchups all season is exhausting' },
    { value: 'league-memory', label: 'It\'s hard to keep every league\'s circumstances memorized' },
    { value: 'draft-overwhelm', label: 'I\'m overwhelmed with draft strategy and preparation' },
    { value: 'league-capacity', label: 'I can\'t join more leagues because I can\'t keep up' },
];

const futureFeatureOptions = [
    { value: 'value-calculations', label: 'Personalized Value System & Preference Tracker', icon: ChartCandlestick },
    { value: 'trade-calculator', label: 'Advanced Trade Analyzer & Smart Suggestions', icon: Scale },
    { value: 'matchup-optimizer', label: 'Advanced Matchup Optimizer', icon: Swords },
    { value: 'opponent-tracker', label: 'Opponent Context Memory & Tracker', icon: Activity },
    { value: 'ai-advisor', label: 'Integrated AI Team Advisor', icon: Brain },
    { value: 'smart-scouting', label: 'Smart Scouting & Trend Analysis', icon: Binoculars },
    { value: 'expert-rankings', label: 'Customizable Expert Rankings', icon: ClipboardList },
    { value: 'action-steps', label: 'All-League Overview & Action Steps Manager', icon: ListTodo },
    { value: 'team-insights', label: 'Team Profiles & Deep Player Insights', icon: ScanSearch },
    { value: 'draft-tools', label: 'Advanced Real-time Draft Tools', icon: ShieldUser },
    { value: 'matchup-reports', label: 'Critical Action Status Reports', icon: Rss },
    { value: 'community-forum', label: 'Community Discussions & User Leaderboards', icon: MessagesSquare },
    { value: 'commissioner-tools', label: 'Commissioner Management Tools', icon: createLucideIcon('toolbox', toolbox) },
    { value: 'dfs-tools', label: 'DFS Lineup Optimizer & Analytics Tools', icon: CalendarRange },
];

const researchMethodOptions = [
    { value: 'expert-blogs', label: 'Expert Blogs & Rankings Spreadsheets', icon: TableProperties},
    { value: 'community-forums', label: 'Community Forums & Chat Rooms', icon: MessagesSquare },
    { value: 'fantasy-creator-content', label: 'Fantasy Creator Content', icon: Speech },
    { value: 'stat-analysis', label: 'Independent Stats Research', icon: Search },
    { value: 'data-tools', label: 'Data-Driven Tools & Calculators', icon: Calculator },
    { value: 'traditional-media', label: 'Traditional Sports Media', icon: Tv },
];

export default function RegisterPage() {
  const { user, error, isLoading } = useUser()
  const router = useRouter()

  const [firstName, setFirstName] = useState('');
  const [platforms, setPlatforms] = useState([])
  const [sports, setSports] = useState([])
  const [fantasyProblems, setFantasyProblems] = useState([])
  const [futureFeatures, setFutureFeatures] = useState([])
  const [notificationsOkay, setNotificationsOkay] = useState({ email: true, sms: true })
  const [researchMethods, setResearchMethods] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [firstNameError, setFirstNameError] = useState('');

  // useEffect(() => {
  //   console.log({ user, isLoading, error });
  // }, [user, isLoading, error]);

  const handleCheckboxChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked, handleSubmit function triggered.");

    if (!user) {
      return;
    }

    // First name is now always required to proceed
    if (!firstName.trim()) {
      setFirstNameError('First name is required.');
      return;
    }
    setFirstNameError(''); // Clear error if validation passes

    setSubmitting(true);

    try {
      const payload = {
        auth0Id: user.sub,
        firstName: firstName.trim(),
        preferences: {
          platforms,
          sports,
          fantasyProblems,
          futureFeatures,
          researchMethods,
        },
        notificationsOkay,
        newUser: false, // Always completing registration now
      };

      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API responded with ${response.status}: ${JSON.stringify(errorData)}`);
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to submit registration:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const CheckboxGroup = ({ title, icon: Icon, options, selected, setter, layout = 'grid', disabled = false }) => {
    const isGrid = layout === 'grid';
    const containerClasses = isGrid
      ? 'grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-0'
      : 'flex flex-col space-y-2';

    return (
      <fieldset disabled={disabled}>
        <div>
          <h3 className="text-md font-semibold text-pb_darkgray mb-1.5 flex items-center">
            {Icon && <Icon className="w-5 h-5 mr-2 text-pb_blue" />}
            {title}
          </h3>
          <div className="rounded-lg border border-pb_lightgray bg-card text-card-foreground shadow-sm p-4 pl-5">
              <div className={containerClasses}>
              {options.map((option) => (
                  <Fragment key={option.value}>
                  <div className={`flex items-center space-x-1 transition-colors hover:bg-gray-50 rounded-md ${isGrid ? 'py-[.55rem]' : 'pr-2'} `}>
                    <Checkbox
                        id={`${title}-${option.value}`}
                        checked={selected.includes(option.value)}
                        onCheckedChange={() => handleCheckboxChange(setter, option.value)}
                        className="border-pb_textlightergray"
                    />
                    <label
                        htmlFor={`${title}-${option.value}`}
                        className={`text-sm leading-none flex items-center gap-2 cursor-pointer pl-2 ${option.supported ? 'text-pb_darkgray' : 'text-pb_darkgray'}`}
                    >
                        {option.icon && <option.icon className={`w-4 h-4 ${option.supported ? 'text-pb_darkgray' : 'text-pb_darkgray'}`} />}
                        <span className="pl-0.5">{option.label}</span>
                    </label>
                  </div>
                  {option.separator && <Separator className={`my-2 mx-2 w-62 bg-pb_lightergray ${isGrid ? 'col-span-full' : ''}`} />}
                  </Fragment>
              ))}
              </div>
          </div>
        </div>
      </fieldset>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 pb-12">
      <div className="text-left mb-6 px-4 2xl:px-0">
        <h1 className="text-4xl font-bold tracking-tight text-pb_darkgray">Let&rsquo;s build your Playbook together.</h1>
        <p className="text-md text-pb_textgray mt-2">A few quick questions so we can build the features you need most - totally optional, but every response helps.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-3 2xl:px-0">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            
            <fieldset disabled={isLoading || submitting}>
              <div>
                  <Label htmlFor="firstName" className="text-md font-semibold text-pb_darkgray mb-1.5 flex items-center">
                    <User className={`w-5 h-5 mr-2 ${firstName.trim() ? 'text-green-500' : 'text-red-500'}`} />
                    First Name {!firstName.trim() && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (firstNameError) setFirstNameError('');
                    }}
                    placeholder="Enter your first name"
                    className={`w-full border-pb_lightgray rounded-lg ${firstNameError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {firstNameError && <p className="text-red-500 text-xs mt-1.5">{firstNameError}</p>}
              </div>
            </fieldset>

            <CheckboxGroup title="Which leagues do you play?" icon={LandPlot} options={sportOptions} selected={sports} setter={setSports} layout="stack" disabled={isLoading || submitting} />
            <CheckboxGroup title="Which platforms do you use?" icon={AppWindow} options={platformOptions} selected={platforms} setter={setPlatforms} layout="stack" disabled={isLoading || submitting} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-[20px]">
            <CheckboxGroup title="What makes managing your teams frustrating?" icon={ThumbsDown} options={fantasyProblemOptions} selected={fantasyProblems} setter={setFantasyProblems} disabled={isLoading || submitting} />
            <CheckboxGroup title="Which Playbook features are you most interested in?" icon={Compass} options={futureFeatureOptions} selected={futureFeatures} setter={setFutureFeatures} disabled={isLoading || submitting} />
            <CheckboxGroup title="What are your favorite resources for fantasy sports advice?" icon={BookOpenText} options={researchMethodOptions} selected={researchMethods} setter={setResearchMethods} disabled={isLoading || submitting} />
          </div>
        </div>

        <div className="px-3 md:px-0">
          <Separator className="my-4" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <fieldset disabled={isLoading || submitting} className="flex-grow">
              <div className="flex items-start space-x-3 pl-2">
                <Checkbox
                  id="notifications"
                  checked={notificationsOkay.email}
                  onCheckedChange={(checked) => setNotificationsOkay({ email: checked, sms: checked })}
                  className="border-pb_lightgray mt-0.5"
                />
                <div>
                  <label htmlFor="notifications" className="text-sm leading-none cursor-pointer flex items-center gap-2">
                    {/* <MessagesSquare className="w-5 h-5 text-pb_midgray right-0" /> */}
                    <span>I don&rsquo;t want to miss critical alerts and useful status reports. </span>
                  </label>
                  <p className="text-xs pt-1 text-pb_textlightgray">Get priority access to game-changing insights when we launch.</p>
                </div>
              </div>
            </fieldset>

            <div className="flex items-center justify-end pt-4 md:pt-0 pl-4">
              <div className="flex items-center gap-4">
                <p className="text-xs text-pb_textlightgray hidden md:block">You can change these preferences later.</p>
                <button
                  type="submit"
                  disabled={isLoading || submitting || !user || !firstName.trim()}
                  className="bg-pb_orange text-pb_darkgray px-4 py-2 rounded-md hover:bg-pb_orangehover disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  {submitting ? 'Saving...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}