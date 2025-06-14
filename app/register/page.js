//  /register page (bonus questions after registration)

'use client'

import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@auth0/nextjs-auth0/client';
import { baseball, basketball, football, golfDriver, iceHockey, soccerBall, toolbox } from '@lucide/lab';
import { Activity, Binoculars, Brain, CalendarRange, Car, ChartCandlestick, ClipboardList, createLucideIcon, Flag, Headset, HelpCircle, MessageSquareWarning, MessagesSquare, Scale, ScanSearch, ShieldUser, Swords } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const platformOptions = [
  { value: 'fantrax', label: 'Fantrax' },
  { value: 'sleeper', label: 'Sleeper', },
  { value: 'yahoo', label: 'Yahoo', },
  { value: 'espn', label: 'ESPN',},
  { value: 'cbs', label: 'CBS Sports' },
  { value: 'nfl', label: 'NFL.com' },
  { value: 'underdog', label: 'Underdog' },
  { value: 'fanduel', label: 'FanDuel' },
  { value: 'draftkings', label: 'Draft Kings' },
  { value: 'mfl', label: 'My Fantasy League' },
  { value: 'league-tycoon', label: 'League Tycoon' },
  { value: 'fleaflicker', label: 'Fleaflicker' },
  // { value: 'ottoneu', label: 'Ottoneu' },
  { value: 'other', label: 'Other', },
];


const sportOptions = [
  { value: 'nfl', label: 'NFL',  icon: createLucideIcon('football', football), supported: true },
  { value: 'nba', label: 'NBA',  icon: createLucideIcon('basketball', basketball), supported: true },
  { value: 'mlb', label: 'MLB',  icon: createLucideIcon('baseball', baseball), supported: true },
  { value: 'nhl', label: 'NHL', icon: createLucideIcon('ice-hockey', iceHockey) },
  { value: 'soccer', label: 'Soccer', icon: createLucideIcon('soccer-ball', soccerBall) },
  { value: 'cfb', label: 'NCAA Football', icon: createLucideIcon('football', football) },
  { value: 'cbb', label: 'NCAA Basketball', icon: createLucideIcon('basketball', basketball) },
  { value: 'pga', label: 'PGA', icon: createLucideIcon('golf-driver', golfDriver) },
  { value: 'esports', label: 'eSports', icon: Headset },
  // { value: 'nascar', label: 'NASCAR', icon: Car },
  // { value: 'wnba', label: 'WNBA', icon: createLucideIcon('basketball', basketball) },
  // { value: 'f1', label: 'F1', icon: Flag },
  // { value: 'cfl', label: 'CFL', icon: createLucideIcon('football', football) },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

const struggleOptions = [
    { value: 'player-injuries', label: 'Not knowing which opinions to trust' },
    { value: 'advice-not-tailored', label: 'Advice isn\'t tailored to my specific circumstances' },
    { value: 'research-scattered', label: 'Research scattered across too many sources' },
    { value: 'waiver-wire', label: 'Takes too much time & effort' },
    { value: 'trade-analysis-paralysis', label: 'Trade analysis paralysis' },
];

const futureFeatureOptions = [
    { value: 'value-calculations', label: 'Personalized Value System', icon: ChartCandlestick },
    { value: 'trade-calculator', label: 'Advanced Trade Analyzer & Smart Suggestions', icon: Scale },
    { value: 'opponent-tracker', label: 'Opponent Action Tracker', icon: ChartCandlestick },
    { value: 'smart-scouting', label: 'Smart Scouting & Analysis', icon: Binoculars },
    { value: 'action-steps', label: 'Action Steps for All Leagues', icon: Activity },
    { value: 'matchup-optimizer', label: 'Advanced Matchup Optimizer', icon: Swords },
    { value: 'ai-advisor', label: 'Integrated AI Team Advisor', icon: Brain },
    { value: 'team-insights', label: 'Deep Insights & Team Profiles', icon: ScanSearch },
    { value: 'expert-rankings', label: 'Customizable Expert Rankings', icon: ClipboardList },
    { value: 'draft-tools', label: 'Draft Tools', icon: ShieldUser },
    { value: 'matchup-reports', label: 'Matchup Action Reports', icon: MessageSquareWarning },
    { value: 'community-forum', label: 'Community Forum & Leaderboards', icon: MessagesSquare },
    { value: 'commissioner-tools', label: 'Commissioner Tools', icon: createLucideIcon('toolbox', toolbox) },
    { value: 'dfs-tools', label: 'DFS Tools', icon: CalendarRange },
];

const researchMethodOptions = [
    { value: 'fantasy-creator-content', label: 'Fantasy Creator Content' },
    { value: 'expert-blogs', label: 'Expert Blogs & Spreadsheets' },
    { value: 'traditional-media', label: 'Traditional Sports Media' },
    { value: 'stat-analysis', label: 'Independent Stat Analysis' },
    { value: 'community-forums', label: 'Community Forums & Chat Rooms' },
    { value: 'data-tools', label: 'Data-Driven Tools & Calculators' },
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
  const [notificationsOkay, setNotificationsOkay] = useState([])
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth0Id: user.sub,
          platforms,
          sports,
          struggles,
          futureFeatures,
          notificationsOkay,
          researchMethods,
          newUser: false,
        }),
      });  

      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to submit registration', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const CheckboxGroup = ({ title, options, selected, setter, layout = 'grid' }) => {
    const isGrid = layout === 'grid';
    const containerClasses = isGrid
      ? 'grid grid-cols-2 gap-x-4 gap-y-2'
      : 'flex flex-col space-y-2';

    return (
      <div>
        <h3 className="text-xl font-semibold text-pb_darkgray mb-3">{title}</h3>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5">
            <div className={containerClasses}>
            {options.map((option) => (
                <div key={option.value} className={`flex items-center space-x-1 transition-colors hover:bg-gray-50 rounded-md ${isGrid ? 'p-2' : 'px-2'}`}>
                <Checkbox
                    id={`${title}-${option.value}`}
                    checked={selected.includes(option.value)}
                    onCheckedChange={() => handleCheckboxChange(setter, option.value)}
                    className="border-gray-400"
                />
                <label
                    htmlFor={`${title}-${option.value}`}
                    className="text-sm leading-none flex items-center gap-2 cursor-pointer pl-2"
                >
                    {option.icon && <option.icon className="text-pb_textlightgray w-3.5 h-3.5" />}
                    <span className={option.supported ? 'font-bold text-pb_mddarkgray' : 'font-medium text-pb_mddarkgray'}>{option.label}</span>
                </label>
                </div>
            ))}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Just a few quick questions...</h1>
        <p className="text-lg text-muted-foreground mt-2">Your answers help us build a better playbook for you.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <CheckboxGroup title="Which fantasy platforms do you play?" options={platformOptions} selected={platforms} setter={setPlatforms} layout="stack" />
            <CheckboxGroup title="Which fantasy sports do you enjoy?" options={sportOptions} selected={sports} setter={setSports} layout="stack" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            <CheckboxGroup title="What are your biggest pain points in fantasy sports?" options={struggleOptions} selected={struggles} setter={setStruggles} />
            <CheckboxGroup title="What features are you be most interested in?" options={futureFeatureOptions} selected={futureFeatures} setter={setFutureFeatures} />
            <CheckboxGroup title="How do you normally research for fantasy sports?" options={researchMethodOptions} selected={researchMethods} setter={setResearchMethods} />
          </div>
        </div>

        <Separator className="my-6" />
        <CheckboxGroup title="Notifications & Marketing" options={notificationOptions} selected={notificationsOkay} setter={setNotificationsOkay} />

        <div className="pt-8">
            <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
            >
            {submitting ? 'Saving...' : 'Continue'}
            </button>
        </div>
      </form>
    </div>
  );
}