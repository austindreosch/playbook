//  /register page (bonus questions after registration)

'use client'

import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const platformOptions = [
  { value: 'fantrax', label: 'Fantrax', supported: true },
  { value: 'sleeper', label: 'Sleeper', supported: true },
  { value: 'yahoo', label: 'Yahoo', supported: true },
  { value: 'espn', label: 'ESPN', supported: true },
  { value: 'cbs', label: 'CBS Sports' },
  { value: 'nfl', label: 'NFL.com' },
  { value: 'underdog', label: 'Underdog' },
  { value: 'fanduel', label: 'FanDuel' },
  { value: 'draftkings', label: 'DraftKings' },
  { value: 'mfl', label: 'MyFantasyLeague' },
  { value: 'ffpc', label: 'FFPC' },
  { value: 'league-tycoon', label: 'League Tycoon' },
  { value: 'fleaflicker', label: 'Fleaflicker' },
  { value: 'ottoneu', label: 'Ottoneu' },
  { value: 'other', label: 'Other' },
];

const sportOptions = [
  { value: 'nfl', label: 'NFL', supported: true },
  { value: 'nba', label: 'NBA', supported: true },
  { value: 'mlb', label: 'MLB', supported: true },
  { value: 'nhl', label: 'NHL' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'cfb', label: 'NCAA Football' },
  { value: 'cbb', label: 'NCAA Basketball' },
  { value: 'pga', label: 'PGA' },
  { value: 'nascar', label: 'NASCAR' },
  { value: 'esports', label: 'eSports' },
  { value: 'wnba', label: 'WNBA' },
  { value: 'cfl', label: 'CFL' },
  { value: 'f1', label: 'F1' },
  { value: 'other', label: 'Other' },
];

const struggleOptions = [
    { value: 'player-injuries', label: 'Not knowing which opinions to trust' },
    { value: 'advice-not-tailored', label: 'Advice isn\'t tailored to my specific circumstances' },
    { value: 'research-scattered', label: 'Research scattered across too many sources' },
    { value: 'waiver-wire', label: 'Takes too much time & effort' },
    { value: 'trade-analysis-paralysis', label: 'Trade analysis paralysis' },
];

const futureFeatureOptions = [
    { value: 'value-calculations', label: 'Personalized Value System' },
    { value: 'smart-scouting', label: 'Smart Scouting & Analysis' },
    { value: 'trade-calculator', label: 'Smart Trade Calculator & AI Integrated Suggestions' },
    { value: 'action-steps', label: 'Action Steps' },
    { value: 'matchup-optimizer', label: 'Advanced Matchup Optimizer' },
    { value: 'ai-advisor', label: 'Integrated AI Team Advisor' },
    { value: 'team-insights', label: 'Deep Insights & Team Profiles' },
    { value: 'expert-rankings', label: 'Customizable Expert Rankings' },
    { value: 'draft-tools', label: 'Draft Tools' },
    { value: 'matchup-reports', label: 'Matchup Action Reports' },
    { value: 'community-forum', label: 'Community Forum & Leaderboards'},
    { value: 'commissioner-tools', label: 'Commissioner Tools' },
    { value: 'dfs-tools', label: 'DFS Tools' },
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

  const CheckboxGroup = ({ title, options, selected, setter }) => (
    <div>
      <label className="block text-sm font-medium text-pb_darkgray mb-3">{title}</label>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <Checkbox
              id={`${title}-${option.value}`}
              checked={selected.includes(option.value)}
              onCheckedChange={() => handleCheckboxChange(setter, option.value)}
              className={`border-pb_textlightgray `}
            />
            <label
              htmlFor={`${title}-${option.value}`}
              className={`text-sm leading-none text-pb_mddarkgray `}
              // className={`text-sm leading-none text-pb_mddarkgray ${option.supported ? 'font-bold' : 'font-medium'}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-4">Just a few quick questions...</h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        <CheckboxGroup title="Which fantasy platforms do you play on?" options={platformOptions} selected={platforms} setter={setPlatforms} />
        <CheckboxGroup title="Which fantasy sports do you enjoy?" options={sportOptions} selected={sports} setter={setSports} />
        <CheckboxGroup title="What are your biggest struggles in fantasy sports?" options={struggleOptions} selected={struggles} setter={setStruggles} />
        <CheckboxGroup title="What features are you be most interested in?" options={futureFeatureOptions} selected={futureFeatures} setter={setFutureFeatures} />
        <CheckboxGroup title="How do you normally research for fantasy sports?" options={researchMethodOptions} selected={researchMethods} setter={setResearchMethods} />
        <Separator className="my-6" />
        <CheckboxGroup title="Notifications & Marketing" options={notificationOptions} selected={notificationsOkay} setter={setNotificationsOkay} />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}