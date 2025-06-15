//  /register page (bonus questions after registration)

'use client'

import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@auth0/nextjs-auth0/client';
import { baseball, basketball, football, footballHelmet, golfDriver, iceHockey, soccerBall, steeringWheel, tire, toolbox } from '@lucide/lab';
import { Activity, AppWindow, Binoculars, BookOpenText, Brain, Calculator, CalendarRange, ChartCandlestick, ClipboardList, Compass, createLucideIcon, Dribbble, Gamepad2, HelpCircle, LandPlot, ListTodo, MessagesSquare, Rss, Scale, ScanSearch, Search, ShieldUser, Speech, Swords, TableProperties, ThumbsDown, Tv } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

const platformOptions = [
  { value: 'fantrax', label: 'Fantrax', supported: true },
  { value: 'sleeper', label: 'Sleeper', supported: true },
  { value: 'yahoo', label: 'Yahoo', supported: true},
  { value: 'espn', label: 'ESPN', supported: true, separator: true },
  { value: 'cbs', label: 'CBS Sports' },
  { value: 'nfl', label: 'NFL.com' },
  { value: 'underdog', label: 'Underdog' },
  { value: 'fanduel', label: 'FanDuel' },
  { value: 'draftkings', label: 'Draft Kings' },
  { value: 'mfl', label: 'MyFantasyLeague' },
  { value: 'ffpc', label: 'FFPC' },
  { value: 'league-tycoon', label: 'League Tycoon' },
  { value: 'fleaflicker', label: 'Fleaflicker' },
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
  { value: 'f1', label: 'F1', icon: createLucideIcon('steering-wheel', steeringWheel)},
  // { value: 'wnba', label: 'WNBA', icon: createLucideIcon('basketball', basketball) },
  // { value: 'cfl', label: 'CFL', icon: createLucideIcon('football', football) },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

const struggleOptions = [
    { value: 'time-effort', label: 'Excelling in fantasy takes too much time & effort' },
    { value: 'time-advantage', label: 'Players with more free time have an unfair advantage' },
    { value: 'trade-stress', label: 'Finding league winning trades is stressful and time-consuming' },
    { value: 'expert-trust', label: 'I often disagree with experts and can\'t trust trade opinions' },
    { value: 'analysis-paralysis', label: 'Analysis paralysis with every team decision' },
    { value: 'advice-not-tailored', label: 'Expert advice isn\'t tailored to my specific circumstances' },
    { value: 'h2h-work', label: 'Min/maxing on H2H matchups all season is exhausting' },
    { value: 'draft-overwhelm', label: 'I\'m overwhelmed with draft strategy and preparation' },
    { value: 'league-capacity', label: 'I can\'t join more leagues because I can\'t keep up' },
    { value: 'research-scattered', label: 'My favorite resources are scattered and hard to keep straight' },
    { value: 'news-overload', label: 'Keeping up with all sports news feels like a full-time job' },
    { value: 'waiver-miss', label: 'I hate missing the big waiver wire opportunities' },
    { value: 'league-memory', label: 'It\'s hard to keep every league\'s circumstances memorized' },
    { value: 'info-miss', label: 'Missing key information and losing when I get lazy/busy' },
];

const futureFeatureOptions = [
    { value: 'value-calculations', label: 'Tailored Value System & Preference Tracker', icon: ChartCandlestick },
    { value: 'trade-calculator', label: 'Advanced Trade Analyzer & Smart Suggestions', icon: Scale },
    { value: 'matchup-optimizer', label: 'Advanced Matchup Optimizer', icon: Swords },
    { value: 'opponent-tracker', label: 'Opponent Action Tracker', icon: Activity },
    { value: 'ai-advisor', label: 'Integrated AI Team Advisor', icon: Brain },
    { value: 'smart-scouting', label: 'Smart Scouting & Trend Analysis', icon: Binoculars },
    { value: 'expert-rankings', label: 'Customizable Expert Rankings', icon: ClipboardList },
    { value: 'action-steps', label: 'All-League Overview & Action Steps Manager', icon: ListTodo },
    { value: 'team-insights', label: 'Team Profiles & Deep Insights', icon: ScanSearch },
    { value: 'draft-tools', label: 'Advanced Real-time Draft Tools', icon: ShieldUser },
    { value: 'matchup-reports', label: 'Critical Action Status Reports', icon: Rss },
    { value: 'community-forum', label: 'Community Discussions & User Leaderboards', icon: MessagesSquare },
    { value: 'commissioner-tools', label: 'Commissioner Management Tools', icon: createLucideIcon('toolbox', toolbox) },
    { value: 'dfs-tools', label: 'DFS Lineup Optimizer & Analytics Tools', icon: CalendarRange },
];

const researchMethodOptions = [
    { value: 'expert-blogs', label: 'Expert Blogs & Spreadsheets', icon: TableProperties},
    { value: 'traditional-media', label: 'Traditional Sports Media', icon: Tv },
    { value: 'fantasy-creator-content', label: 'Fantasy Creator Content', icon: Speech },
    { value: 'stat-analysis', label: 'Independent Stat Analysis', icon: Search },
    { value: 'community-forums', label: 'Community Forums & Chat Rooms', icon: MessagesSquare },
    { value: 'data-tools', label: 'Data-Driven Tools & Calculators', icon: Calculator },
];

const notificationOptions = [
    { value: 'email-updates', label: 'Email Updates' },
];

export default function RegisterPage() {
  const { user, error, isLoading } = useUser()
  const router = useRouter()

  const [platforms, setPlatforms] = useState([])
  const [sports, setSports] = useState([])
  const [struggles, setStruggles] = useState([])
  const [futureFeatures, setFutureFeatures] = useState([])
  const [notificationsOkay, setNotificationsOkay] = useState(['email-updates'])
  const [researchMethods, setResearchMethods] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/landing')
  //   }
  // }, [isLoading, user, router])

  const handleCheckboxChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleRegistrationSubmit = async (completeRegistration) => {
    if (!user) return;
    setSubmitting(true);

    try {
      const payload = {
        auth0Id: user.sub,
        platforms,
        sports,
        struggles,
        futureFeatures,
        notificationsOkay,
        researchMethods,
      };

      if (completeRegistration) {
        payload.newUser = false;
      }

      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to submit registration', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistrationSubmit(true);
  };

  const handleSkip = (e) => {
    e.preventDefault();
    handleRegistrationSubmit(false);
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const CheckboxGroup = ({ title, icon: Icon, options, selected, setter, layout = 'grid' }) => {
    const isGrid = layout === 'grid';
    const containerClasses = isGrid
      ? 'grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-0'
      : 'flex flex-col space-y-2';

    return (
      <div>
        <h3 className="text-md font-semibold text-pb_darkgray mb-1.5 flex items-center">
          {Icon && <Icon className="w-5 h-5 mr-2 text-pb_midgray" />}
          {title}
        </h3>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className={containerClasses}>
            {options.map((option) => (
                <Fragment key={option.value}>
                <div className={`flex items-center space-x-1 transition-colors hover:bg-gray-50 rounded-md ${isGrid ? 'p-2' : 'px-2'} `}>
                <Checkbox
                    id={`${title}-${option.value}`}
                    checked={selected.includes(option.value)}
                    onCheckedChange={() => handleCheckboxChange(setter, option.value)}
                    className="border-pb_lightgray"
                />
                <label
                    htmlFor={`${title}-${option.value}`}
                    className={`text-sm leading-none flex items-center gap-2 cursor-pointer pl-2 ${option.supported ? 'text-pb_darkgray' : 'text-pb_mddarkgray'}`}
                >
                    {option.icon && <option.icon className={`w-4 h-4 ${option.supported ? 'text-pb_darkgray' : 'text-pb_midgray'}`} />}
                    <span className="pl-0.5">{option.label}</span>
                </label>
                </div>
                {option.separator && <Separator className={`my-2 mx-2 w-36 bg-pb_lightergray ${isGrid ? 'col-span-full' : ''}`} />}
                </Fragment>
            ))}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="text-center mb-10"> 
        <h1 className="text-4xl font-bold tracking-tight">Just a few quick questions...</h1>
        <p className="text-lg text-muted-foreground mt-2">Your answers help us build a better playbook for you.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-3 md:px-0">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <CheckboxGroup title="Which leagues do you play?" icon={LandPlot} options={sportOptions} selected={sports} setter={setSports} layout="stack" />
            <CheckboxGroup title="Which platforms do you use?" icon={AppWindow} options={platformOptions} selected={platforms} setter={setPlatforms} layout="stack" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            <CheckboxGroup title="What are your biggest pain points with playing fantasy sports?" icon={ThumbsDown} options={struggleOptions} selected={struggles} setter={setStruggles} />
            <CheckboxGroup title="Which features are you most interested in?" icon={Compass} options={futureFeatureOptions} selected={futureFeatures} setter={setFutureFeatures} />
            <CheckboxGroup title="How do you normally research for fantasy sports?" icon={BookOpenText} options={researchMethodOptions} selected={researchMethods} setter={setResearchMethods} />
          </div>
        </div>

        <div className="px-3 md:px-0">
          <Separator className="my-6" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="notifications"
                checked={notificationsOkay.includes('email-updates')}
                onCheckedChange={(checked) => setNotificationsOkay(checked ? ['email-updates'] : [])}
                className="border-pb_lightgray"
              />
              <label htmlFor="notifications" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                <MessagesSquare className="w-5 h-5 text-pb_midgray" />
                <span>Can we send you emails with notifications and status updates?</span>
              </label>
            </div>
            <div className="flex items-center gap-2 justify-end pt-4 md:pt-0">
              <button
                type="button"
                onClick={handleSkip}
                disabled={submitting}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold"
              >
                {submitting ? 'Saving...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}