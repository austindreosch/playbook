'use client';
import { useState } from 'react';
import * as React from 'react';
import {
  RiGlobalLine,
  RiHashtag,
  RiFootballLine,
  RiBasketballLine,
  RiTrophyLine,
  RiBarChartLine,
  RiGameLine,
  RiCalendarLine,
  RiSettings3Line,
  RiTimeLine,
  RiCoinLine,
  RiExchangeLine,
  RiListCheck,
  RiAtLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarCheckLine,
  RiCloseLine,
  RiForbidLine,
  RiSunLine
} from '@remixicon/react';
import * as Button from '@/components/alignui/button';
import * as Input from '@/components/alignui/input';
import * as SegmentedControl from '@/components/alignui/ui/segmented-control';
import * as Popover from '@/components/alignui/popover';
import * as DatepickerPrimivites from '@/components/alignui/ui/datepicker';
import * as CompactButton from '@/components/alignui/compact-button';
import { InfoIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format, isSameDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/utils/cn';

interface Platform {
  id: string;
  name: string;
  available: boolean;
  sports: string[];
}

interface League {
  id: string;
  name: string;
  sport: string;
  teamCount: number;
  teams?: any[];
  rosters?: any[];
}

interface FormData {
  platform: string;
  leagueId: string;
  sport: string;
  leagueType: string;
  scoring: string;
  matchup: string;
  // Conditional fields
  teamStatus: string;
  decay: boolean;
  contracts: boolean;
  puntCategories: boolean;
  gamesLimit: number | null;
  scoringMethod: string;
  playoffSchedule: string;
  tradeDeadline: Date | undefined;
  salary: boolean;
  faab: boolean;
}

interface DynamicLeagueImportFormProps {
  onComplete?: (league: any) => void;
  onCancel?: () => void;
}

const PLATFORMS: Platform[] = [
  { id: 'fantrax', name: 'Fantrax', available: true, sports: ['NFL', 'NBA', 'MLB'] },
  { id: 'sleeper', name: 'Sleeper', available: true, sports: ['NFL'] },
  { id: 'yahoo', name: 'Yahoo', available: false, sports: ['NFL', 'NBA', 'MLB'] },
  { id: 'espn', name: 'ESPN', available: false, sports: ['NFL', 'NBA', 'MLB'] }
];

const SPORTS = ['NBA', 'MLB', 'NFL'];
const LEAGUE_TYPES = ['Redraft', 'Dynasty', 'Keeper'];
const MATCHUP_TYPES = ['H2H', 'Roto', 'Total Points'];
const SCORING_TYPES = ['Points', 'Categories'];
const SCORING_METHODS = ['Each Category', 'Most Categories'];

const TEAM_STATUSES = ['Rebuilding', 'Flexible', 'Contending'];
const PLAYOFF_SCHEDULES = ['Standard', 'Custom'];

// Helper function to extract league ID from URL
const extractLeagueId = (input: string, platform: string): string => {
  if (!input) return '';

  // If it's already just an ID (no URL structure), return as-is
  if (!input.includes('http') && !input.includes('.com')) {
    return input;
  }

  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);

    switch (platform) {
      case 'fantrax':
        // fantrax.com/fantasy/league/f1zwi0wum3y5041b/team/roster
        const fantraxMatch = url.pathname.match(/\/league\/([^\/]+)/);
        return fantraxMatch ? fantraxMatch[1] : input;

      case 'sleeper':
        // sleeper.com/leagues/1180086763643736064
        const sleeperMatch = url.pathname.match(/\/leagues\/(\d+)/);
        return sleeperMatch ? sleeperMatch[1] : input;

      case 'yahoo':
        // yahoo.com/fantasy/football/123.l.456789
        const yahooMatch = url.pathname.match(/\/(\d+\.l\.\d+)/);
        return yahooMatch ? yahooMatch[1] : input;

      case 'espn':
        // espn.com/fantasy/football/league?leagueId=123456
        const espnMatch = url.searchParams.get('leagueId') || url.pathname.match(/\/league\/(\d+)/);
        return typeof espnMatch === 'string' ? espnMatch : (espnMatch ? espnMatch[1] : input);

      default:
        return input;
    }
  } catch {
    return input;
  }
};

// Helper function to detect platform from URL
const detectPlatformFromUrl = (input: string): string | null => {
  if (!input.includes('.com')) return null;

  if (input.includes('fantrax.com')) return 'fantrax';
  if (input.includes('sleeper.com')) return 'sleeper';
  if (input.includes('yahoo.com')) return 'yahoo';
  if (input.includes('espn.com')) return 'espn';

  return null;
};

// Helper function to get platform-specific helper text
const getPlatformHelperText = (platform: string): string => {
  switch (platform) {
    case 'fantrax':
      return 'Paste your league URL or ID (e.g., f1zwi0wum3y5041b).';
    case 'sleeper':
      return 'Paste your league URL or numeric ID (long number string).';
    case 'yahoo':
      return 'Paste your league URL or key (e.g., 123.l.456789). Yahoo requires OAuth sign-in.';
    case 'espn':
      return 'Paste your league URL or ID. If season/year is in the URL, we\'ll capture it.';
    default:
      return 'Enter your league ID or paste the full league URL.';
  }
};

// Checkbox card component for settings
function CheckboxCard({ 
  icon: Icon, 
  label, 
  checked, 
  onChange, 
  disabled = false 
}: { 
  icon: React.ElementType; 
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border bg-white ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-gray-600" />
          <label className="text-label-lg text-strong-950 cursor-pointer">{label}</label>
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
    </div>
  );
}

// Simplified datepicker component for trade deadline
function TradeDatepicker({ value, onChange }: { value: Date | undefined; onChange: (date: Date | undefined) => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root variant="neutral" mode="stroke" className="w-full justify-start text-left">
          <RiCalendarLine className="size-4 mr-2" />
          {value ? format(value, 'PPP') : 'Select trade deadline date'}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-0">
        <DatepickerPrimivites.Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          initialFocus
        />
      </Popover.Content>
    </Popover.Root>
  );
}

export default function DynamicLeagueImportForm({ onComplete, onCancel }: DynamicLeagueImportFormProps) {
  const [loading, setLoading] = useState(false);
  const [leaguePreview, setLeaguePreview] = useState<League | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    platform: PLATFORMS[0].id,
    leagueId: '',
    sport: SPORTS[0],
    leagueType: LEAGUE_TYPES[0],
    scoring: SCORING_TYPES[0],
    matchup: MATCHUP_TYPES[0],
    // Conditional fields
    teamStatus: '',
    decay: false,
    contracts: false,
    puntCategories: false,
    gamesLimit: null,
    scoringMethod: '',
    playoffSchedule: '',
    tradeDeadline: undefined,
    salary: false,
    faab: false
  });

  // Get available sports based on platform
  const availableSports = React.useMemo(() => {
    if (!formData.platform) return SPORTS;
    const platform = PLATFORMS.find(p => p.id === formData.platform);
    return platform ? platform.sports : SPORTS;
  }, [formData.platform]);

  // Handle platform change
  const handlePlatformChange = (platform: string) => {
    const platformInfo = PLATFORMS.find(p => p.id === platform);

    // Handle unavailable platforms
    if (platformInfo && !platformInfo.available) {
      toast.info(`${platformInfo.name} integration is coming soon! We're working hard to bring you this feature. In the meantime, you can import leagues from Fantrax and Sleeper.`);
      return;
    }

    // Auto-select the first available sport for the platform
    const availableSportsForPlatform = platformInfo ? platformInfo.sports : SPORTS;
    const autoSelectedSport = availableSportsForPlatform.length === 1 ? availableSportsForPlatform[0] : '';

    setFormData(prev => ({
      ...prev,
      platform,
      sport: autoSelectedSport, // Auto-select if only one sport available
      leagueId: '', // Reset league ID when platform changes
      leagueType: '', // Reset subsequent fields
      scoring: '',
      matchup: ''
    }));
    setDetectedPlatform(null);
    setLeaguePreview(null);
  };

  // Handle league ID input with auto-detection
  const handleLeagueIdChange = (value: string) => {
    const detected = detectPlatformFromUrl(value);
    if (detected && detected !== formData.platform) {
      setDetectedPlatform(detected);
    } else {
      setDetectedPlatform(null);
    }

    const extractedId = formData.platform ? extractLeagueId(value, formData.platform) : value;
    setFormData(prev => ({ ...prev, leagueId: extractedId }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.platform || !formData.leagueId || !formData.sport || !formData.leagueType || !formData.scoring || !formData.matchup) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const leagueData = {
        platform: formData.platform,
        platformLeagueId: formData.leagueId,
        leagueName: leaguePreview?.name || `${formData.platform} League`,
        teamCount: leaguePreview?.teamCount || 0,
        sport: formData.sport,
        leagueType: formData.leagueType,
        scoring: formData.scoring,
        matchup: formData.matchup,
        draftType: 'Snake', // Default for now
        settings: {
          teamStatus: formData.teamStatus,
          decay: formData.decay,
          contracts: formData.contracts,
          puntCategories: formData.puntCategories,
          gamesLimit: formData.gamesLimit,
          scoringMethod: formData.scoringMethod,
          playoffSchedule: formData.playoffSchedule,
          tradeDeadline: formData.tradeDeadline ? formData.tradeDeadline.toISOString() : null,
          salary: formData.salary,
          faab: formData.faab
        },
        teams: leaguePreview?.teams || [],
        rosters: leaguePreview?.rosters || []
      };

      const response = await fetch('/api/importleague', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leagueData)
      });

      if (!response.ok) throw new Error('Failed to save league');
      const savedLeague = await response.json();

      toast.success('League imported successfully!');
      onComplete?.(savedLeague);
    } catch (error) {
      toast.error(`Failed to import league: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">


      {/* Main Form - Two Column Layout */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT COLUMN - Main Questions */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">League Information</h2>

              {/* Step 1: Platform */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RiGlobalLine className="size-5 text-gray-600" />
                  <label className="text-label-lg text-strong-950">Platform *</label>
                </div>
                <SegmentedControl.Root value={formData.platform} onValueChange={handlePlatformChange}>
                  <SegmentedControl.List
                    className="inline-flex w-128 gap-0.5 p-1 rounded-lg bg-white ring-1 ring-inset ring-gray-300"
                    activeValue={formData.platform}
                    floatingBgClassName="!bg-blue !text-white"
                  >
                    {PLATFORMS.map(platform => (
                      <SegmentedControl.Trigger
                        key={platform.id}
                        value={platform.id}
                        disabled={!platform.available}
                        className="w-32 data-[state=active]:text-white"
                      >
                        <span className="text-label-lg">{platform.name}</span>
                      </SegmentedControl.Trigger>
                    ))}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

              {/* Step 2: League ID */}
              {formData.platform && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RiHashtag className="size-5 text-gray-600" />
                    <label className="text-label-lg text-strong-950">League ID *</label>
                  </div>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        type="text"
                        value={formData.leagueId}
                        onChange={(e) => handleLeagueIdChange(e.target.value)}
                        placeholder="Paste league URL or ID..."
                        className="text-sm"
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  <p className="text-paragraph-md text-sub-600 flex items-center gap-2">
                    <InfoIcon className="hw-icon-xs" />
                    {getPlatformHelperText(formData.platform)}
                  </p>
                  {detectedPlatform && (
                    <div className="text-xs text-blue-600">
                      Detected Platform: {PLATFORMS.find(p => p.id === detectedPlatform)?.name} • League ID: {formData.leagueId}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Sport */}
              {formData.leagueId && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RiFootballLine className="size-5 text-gray-600" />
                    <label className="text-label-lg text-strong-950">Sport *</label>
                  </div>
                  <SegmentedControl.Root value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                    <SegmentedControl.List
                      className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-white ring-1 ring-inset ring-gray-300"
                      activeValue={formData.sport}
                      floatingBgClassName="!bg-blue !text-white"
                    >
                      {SPORTS.map(sport => {
                        const isAvailable = availableSports.includes(sport);
                        return (
                          <SegmentedControl.Trigger
                            key={sport}
                            value={sport}
                            disabled={!isAvailable}
                            className={`w-32 data-[state=active]:text-white ${!isAvailable ? 'cursor-not-allowed opacity-50 text-gray-400 relative group' : 'relative group'}`}
                            title={!isAvailable ? `${sport} support coming soon!` : ''}
                          >
                            {sport === 'NBA' && <RiBasketballLine className="hw-icon-xs shrink-0" />}
                            {sport === 'MLB' && <RiBasketballLine className="hw-icon-xs shrink-0" />}
                            {sport === 'NFL' && <RiFootballLine className="hw-icon-xs shrink-0" />}
                            <span className="text-label-lg">{sport}</span>
                          </SegmentedControl.Trigger>
                        );
                      })}
                    </SegmentedControl.List>
                  </SegmentedControl.Root>
                </div>
              )}

              {/* Step 4: League Type */}
              {formData.sport && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RiTrophyLine className="size-5 text-gray-600" />
                    <label className="text-label-lg text-strong-950">League Type *</label>
                  </div>
                  <SegmentedControl.Root value={formData.leagueType} onValueChange={(value) => setFormData(prev => ({ ...prev, leagueType: value }))}>
                    <SegmentedControl.List
                      className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-white ring-1 ring-inset ring-gray-300"
                      activeValue={formData.leagueType}
                      floatingBgClassName="!bg-blue !text-white"
                    >
                      {LEAGUE_TYPES.map(type => (
                        <SegmentedControl.Trigger key={type} value={type} className="w-32 data-[state=active]:text-white">
                          <span className="text-label-lg">{type}</span>
                        </SegmentedControl.Trigger>
                      ))}
                    </SegmentedControl.List>
                  </SegmentedControl.Root>
                </div>
              )}

              {/* Step 5: Scoring Type */}
              {formData.leagueType && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RiBarChartLine className="size-5 text-gray-600" />
                    <label className="text-label-lg text-strong-950">Scoring Type *</label>
                  </div>
                  <SegmentedControl.Root value={formData.scoring} onValueChange={(value) => setFormData(prev => ({ ...prev, scoring: value }))}>
                    <SegmentedControl.List
                      className="inline-flex w-64 gap-0.5 p-1 rounded-lg bg-white ring-1 ring-inset ring-gray-300"
                      activeValue={formData.scoring}
                      floatingBgClassName="!bg-blue !text-white"
                    >
                      {SCORING_TYPES.map(type => (
                        <SegmentedControl.Trigger key={type} value={type} className="w-32 data-[state=active]:text-white">
                          <span className="text-label-lg">{type}</span>
                        </SegmentedControl.Trigger>
                      ))}
                    </SegmentedControl.List>
                  </SegmentedControl.Root>
                </div>
              )}

              {/* Step 6: Matchup Type */}
              {formData.scoring && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RiGameLine className="size-5 text-gray-600" />
                    <label className="text-label-lg text-strong-950">Matchup Type *</label>
                  </div>
                  <SegmentedControl.Root value={formData.matchup} onValueChange={(value) => setFormData(prev => ({ ...prev, matchup: value }))}>
                    <SegmentedControl.List
                      className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-white ring-1 ring-inset ring-gray-300"
                      activeValue={formData.matchup}
                      floatingBgClassName="!bg-blue !text-white"
                    >
                      {MATCHUP_TYPES.map(type => (
                        <SegmentedControl.Trigger key={type} value={type} className="w-32 data-[state=active]:text-white">
                          <span className="text-label-lg">{type}</span>
                        </SegmentedControl.Trigger>
                      ))}
                    </SegmentedControl.List>
                  </SegmentedControl.Root>
                </div>
              )}

              {/* Step 7: Additional Options (Always Visible) */}
              {formData.matchup && (
                <div className="space-y-6">

                  {/* Trade Deadline */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RiExchangeLine className="size-5 text-gray-600" />
                      <label className="text-label-lg text-strong-950">Trade Deadline</label>
                    </div>
                    <TradeDatepicker 
                      value={formData.tradeDeadline}
                      onChange={(date) => setFormData(prev => ({ ...prev, tradeDeadline: date }))}
                    />
                  </div>

                  {/* Settings Cards */}
                  <div className="space-y-3">
                    <h3 className="text-label-lg text-strong-950">Additional Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <CheckboxCard 
                        icon={RiCoinLine}
                        label="Salary Cap"
                        checked={formData.salary}
                        onChange={(checked) => setFormData(prev => ({ ...prev, salary: checked }))}
                      />
                      <CheckboxCard 
                        icon={RiCoinLine}
                        label="FAAB"
                        checked={formData.faab}
                        onChange={(checked) => setFormData(prev => ({ ...prev, faab: checked }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Conditional Questions */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Additional Settings</h2>

              {/* Dynasty/Keeper Conditional Fields */}
              {(formData.leagueType === 'Dynasty' || formData.leagueType === 'Keeper') && (
                <div className="space-y-6">
                  {/* Team Status */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RiAtLine className="size-5 text-gray-600" />
                      <label className="text-label-lg text-strong-950">Team Status</label>
                    </div>
                    <SegmentedControl.Root value={formData.teamStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, teamStatus: value }))}>
                      <SegmentedControl.List
                        className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-white ring-1 ring-inset ring-gray-300"
                        activeValue={formData.teamStatus}
                        floatingBgClassName="!bg-blue !text-white"
                      >
                        {TEAM_STATUSES.map(status => (
                          <SegmentedControl.Trigger key={status} value={status} className="w-32 data-[state=active]:text-white">
                            <span className="text-label-lg">{status}</span>
                          </SegmentedControl.Trigger>
                        ))}
                      </SegmentedControl.List>
                    </SegmentedControl.Root>
                  </div>

                  {/* Dynasty/Keeper Settings Cards */}
                  <div className="space-y-3">
                    <h3 className="text-label-lg text-strong-950">Dynasty/Keeper Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <CheckboxCard 
                        icon={RiTimeLine}
                        label="Decay"
                        checked={formData.decay}
                        onChange={(checked) => setFormData(prev => ({ ...prev, decay: checked }))}
                      />
                      <CheckboxCard 
                        icon={RiSettings3Line}
                        label="Contracts"
                        checked={formData.contracts}
                        onChange={(checked) => setFormData(prev => ({ ...prev, contracts: checked }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Conditional Fields */}
              {formData.scoring === 'Categories' && (
                <div className="space-y-6">
                  {/* Categories Settings Cards */}
                  <div className="space-y-3">
                    <h3 className="text-label-lg text-strong-950">Categories Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <CheckboxCard 
                        icon={RiListCheck}
                        label="Punt Categories"
                        checked={formData.puntCategories}
                        onChange={(checked) => setFormData(prev => ({ ...prev, puntCategories: checked }))}
                      />
                    </div>
                  </div>

                  {/* Games Limit */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RiCalendarLine className="size-5 text-gray-600" />
                      <label className="text-label-lg text-strong-950">Games Limit</label>
                    </div>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input
                          type="number"
                          value={formData.gamesLimit || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, gamesLimit: e.target.value ? parseInt(e.target.value) : null }))}
                          placeholder="e.g., 82"
                          className="text-sm"
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  {/* Scoring Method */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RiBarChartLine className="size-5 text-gray-600" />
                      <label className="text-label-lg text-strong-950">Scoring Method</label>
                    </div>
                    <SegmentedControl.Root value={formData.scoringMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, scoringMethod: value }))}>
                      <SegmentedControl.List
                        className="inline-flex w-64 gap-0.5 p-1 rounded-lg bg-white ring-1 ring-inset ring-gray-300"
                        activeValue={formData.scoringMethod}
                        floatingBgClassName="!bg-blue !text-white"
                      >
                        {SCORING_METHODS.map(method => (
                          <SegmentedControl.Trigger key={method} value={method} className="w-32 data-[state=active]:text-white">
                            <span className="text-label-lg">{method}</span>
                          </SegmentedControl.Trigger>
                        ))}
                      </SegmentedControl.List>
                    </SegmentedControl.Root>
                  </div>
                </div>
              )}

              {/* H2H Conditional Fields */}
              {formData.matchup === 'Head-to-Head (H2H)' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RiCalendarLine className="size-5 text-gray-600" />
                    <label className="text-label-lg text-strong-950">Playoff Schedule</label>
                  </div>
                  <SegmentedControl.Root value={formData.playoffSchedule} onValueChange={(value) => setFormData(prev => ({ ...prev, playoffSchedule: value }))}>
                    <SegmentedControl.List
                      className="inline-flex w-64 gap-0.5 p-1 rounded-lg bg-white ring-1 ring-inset ring-gray-300"
                      activeValue={formData.playoffSchedule}
                      floatingBgClassName="!bg-blue !text-white"
                    >
                      {PLAYOFF_SCHEDULES.map(schedule => (
                        <SegmentedControl.Trigger key={schedule} value={schedule} className="w-32 data-[state=active]:text-white">
                          <span className="text-label-lg">{schedule}</span>
                        </SegmentedControl.Trigger>
                      ))}
                    </SegmentedControl.List>
                  </SegmentedControl.Root>
                </div>
              )}

              {/* Empty state when no conditional fields */}
              {!((formData.leagueType === 'Dynasty' || formData.leagueType === 'Keeper') ||
                formData.scoring === 'Categories' ||
                formData.matchup === 'Head-to-Head (H2H)') && (
                  <div className="text-center py-12 text-gray-500">
                    <RiSettings3Line className="size-12 mx-auto mb-4 opacity-30" />
                    <p className="text-paragraph-md text-sub-600">Additional settings will appear based on your selections</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Button.Root variant="neutral" mode="stroke" onClick={onCancel}>
            Cancel
          </Button.Root>
          <Button.Root
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !formData.platform || !formData.leagueId || !formData.sport || !formData.leagueType || !formData.scoring || !formData.matchup}
          >
            {loading && <Loader2 className="size-4 animate-spin mr-2" />}
            Import League
          </Button.Root>
        </div>
      </div>
    </div>
  );
}