'use client';
import { useState } from 'react';
import * as React from 'react';
import * as Button from '@/components/alignui/button';
import * as Input from '@/components/alignui/input';
import * as Select from '@/components/alignui/select';
import * as SegmentedControl from '@/components/alignui/ui/segmented-control';
import { Datepicker } from '@/components/ui/PBDatePicker';
import { 
  InfoIcon, 
  Loader2, 
  Minus, 
  ScanLine,
  Globe,
  Hash,
  Swords,
  Trophy,
  BarChart2,
  Calendar,
  Settings,
  Clock,
  CircleDollarSign,
  ArrowRightLeft,
  ListChecks,
  Plus,
  MinusIcon,
  Gamepad2,
} from 'lucide-react';
import {
  Button as ReactAriaButton,
  Group as ReactAriaGroup,
  Input as ReactAriaInput,
  NumberField as ReactAriaNumberField,
} from 'react-aria-components';
import { compactButtonVariants } from '@/components/alignui/compact-button';
import { inputVariants } from '@/components/alignui/input';
import { toast } from 'sonner';

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
  categories?: string[];
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
  puntedCategories: string[];
  gamesLimit: number | null;
  gamesLimitType: string;
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

const SPORTS = ['NBA', 'NFL', 'MLB'];
const LEAGUE_TYPES = ['Dynasty', 'Keeper', 'Redraft'];
const MATCHUP_TYPES = ['H2H', 'Roto', 'Total Points'];
const SCORING_TYPES = ['Categories', 'Points'];
const SCORING_METHODS = ['Each Category', 'Most Categories'];

const TEAM_STATUSES = ['Rebuilding', 'Flexible', 'Contending'];

// Default categories by sport
const DEFAULT_CATEGORIES = {
  NBA: ['FG%', 'FT%', '3PM', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO'],
  MLB: ['R', 'HR', 'RBI', 'SB', 'AVG', 'W', 'SV', 'K', 'ERA', 'WHIP'],
  NFL: []  // NFL typically uses points, not categories
};

// Sport-specific playoff schedules
const PLAYOFF_SCHEDULES = {
  NFL: ['Week 15', 'Week 16', 'Week 17', 'Week 18'],
  NBA: ['Week 18', 'Week 19', 'Week 20', 'Week 21'],
  MLB: ['Week 18', 'Week 19', 'Week 20', 'Week 21']
};

// Default trade deadlines by sport and year
const TRADE_DEADLINES = {
  NFL: {
    2025: new Date(2025, 10, 16), // Nov 16, 2025
    2026: new Date(2026, 10, 15), // Nov 15, 2026
    2027: new Date(2027, 10, 14), // Nov 14, 2027
    2028: new Date(2028, 10, 19), // Nov 19, 2028
    2029: new Date(2029, 10, 18), // Nov 18, 2029
  },
  NBA: {
    2025: new Date(2025, 1, 16), // Feb 16, 2025
    2026: new Date(2026, 1, 15), // Feb 15, 2026
    2027: new Date(2027, 1, 21), // Feb 21, 2027
    2028: new Date(2028, 1, 20), // Feb 20, 2028
    2029: new Date(2029, 1, 18), // Feb 18, 2029
  },
  MLB: {
    2025: new Date(2025, 7, 10), // Aug 10, 2025
    2026: new Date(2026, 7, 9),  // Aug 9, 2026
    2027: new Date(2027, 7, 8),  // Aug 8, 2027
    2028: new Date(2028, 7, 13), // Aug 13, 2028
    2029: new Date(2029, 7, 12), // Aug 12, 2029
  }
};

// Helper function to get default trade deadline for a sport
const getDefaultTradeDeadline = (sport: string): Date | undefined => {
  const currentYear = new Date().getFullYear();
  const sportDeadlines = TRADE_DEADLINES[sport as keyof typeof TRADE_DEADLINES];
  
  if (!sportDeadlines) return undefined;
  
  // Find the next available deadline (current year or later)
  for (let year = currentYear; year <= currentYear + 5; year++) {
    if (sportDeadlines[year as keyof typeof sportDeadlines]) {
      const deadline = sportDeadlines[year as keyof typeof sportDeadlines];
      // Only return if the deadline is in the future
      if (deadline > new Date()) {
        return deadline;
      }
    }
  }
  
  return undefined;
};

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

// Counter Input component
function CounterInput({ 
  value, 
  onChange, 
  disabled = false,
  minValue = 0,
  maxValue = 200 
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  minValue?: number;
  maxValue?: number;
}) {
  const { root: inputRoot, wrapper: inputWrapper, input } = inputVariants();
  const { root: compactButtonRoot, icon: compactButtonIcon } =
    compactButtonVariants({ variant: 'ghost' });

  return (
    <ReactAriaNumberField
      value={value}
      onChange={onChange}
      minValue={minValue}
      maxValue={maxValue}
      isDisabled={disabled}
      className="w-full"
    >
      <div className={inputRoot()}>
        <ReactAriaGroup className={inputWrapper()}>
          <ReactAriaButton slot="decrement" className={compactButtonRoot()}>
            <MinusIcon className={compactButtonIcon()} />
          </ReactAriaButton>
          <ReactAriaInput className={input({ class: 'text-center text-sm' })} />
          <ReactAriaButton slot="increment" className={compactButtonRoot()}>
            <Plus className={compactButtonIcon()} />
          </ReactAriaButton>
        </ReactAriaGroup>
      </div>
    </ReactAriaNumberField>
  );
}

// Unified setting card component with reasonable height
function SettingCard({ 
  icon: Icon, 
  label, 
  children,
  disabled = false 
}: { 
  icon: React.ElementType; 
  label: string; 
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className={`h-24 rounded-lg ring-1 ring-inset ring-stroke-soft-100 bg-white ${disabled ? 'opacity-50' : 'hover:bg-gray-5'} flex flex-col`}>
      <div className="flex flex-col items-center text-center flex-1">
        <div className="w-full flex items-center gap-2 border-b border-gray-100 py-2 justify-center">
          <Icon className="hw-icon " />
          <label className="text-label">{label}</label>
        </div>
        
        <div className="flex-1 flex items-center justify-center text-paragraph">
          {children}
        </div>
      </div>
    </div>
  );
}




// Helper functions to determine disabled states
const isFieldDisabled = {
  sport: (formData: FormData) => formData.platform === 'none' || !formData.leagueId,
  leagueType: (formData: FormData) => formData.platform === 'none' || !formData.leagueId,
  scoring: (formData: FormData) => formData.platform === 'none' || !formData.leagueId,
  matchup: (formData: FormData) => formData.platform === 'none' || !formData.leagueId
};


// Custom color configuration for league import form
const leagueImportColors = {
  text: {
    inactive: 'text-black',                     // Inactive tab text color
    active: 'text-white',                       // Active tab text color
    disabled: 'text-gray-200',                  // Disabled tab text color
    disabledActive: 'text-white'                // Disabled but active tab text color
  },
  background: {
    hover: 'hover:bg-gray-25',                  // Tab hover background
    active: 'bg-blue',                          // Active tab background (floating background)
    activeHover: 'data-[state=active]:hover:bg-blue-600', // Active tab hover background
    disabledHover: 'disabled:hover:bg-gray-25', // Disabled tab hover background
    disabledActive: 'bg-blue-200'               // Disabled but active tab background (floating background)
  },
  // Custom colors for form labels and icons
  label: {
    normal: 'text-strong',                      // Form field labels when enabled
    disabled: 'text-disabled'                   // Form field labels when disabled
  },
  icon: {
    normal: 'text-strong',                      // Form field icons when enabled
    disabled: 'text-disabled'                   // Form field icons when disabled
  },
  separator: {
    from: 'after:from-transparent',
    via: 'after:via-gray-150', 
    viaDisabled: 'after:via-gray-100',
    to: 'after:to-transparent'
  }
} as const;

export default function DynamicLeagueImportForm({ onComplete, onCancel }: DynamicLeagueImportFormProps) {
  const [loading, setLoading] = useState(false);
  const [leaguePreview, setLeaguePreview] = useState<League | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    platform: 'none',
    leagueId: '',
    sport: 'none',
    leagueType: 'none',
    scoring: 'none',
    matchup: 'none',
    // Conditional fields
    teamStatus: TEAM_STATUSES[1], // Default to 'Flexible'
    decay: false,
    contracts: false,
    puntCategories: false,
    puntedCategories: [],
    gamesLimit: 40,
    gamesLimitType: 'none',
    scoringMethod: SCORING_METHODS[0],
    playoffSchedule: PLAYOFF_SCHEDULES.NFL[0],
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

  // Get playoff schedules based on sport
  const availablePlayoffSchedules = React.useMemo(() => {
    if (!formData.sport) return PLAYOFF_SCHEDULES.NFL;
    return PLAYOFF_SCHEDULES[formData.sport as keyof typeof PLAYOFF_SCHEDULES] || PLAYOFF_SCHEDULES.NFL;
  }, [formData.sport]);

  // Update playoff schedule and trade deadline when sport changes
  React.useEffect(() => {
    if (formData.sport && availablePlayoffSchedules.length > 0) {
      const defaultTradeDeadline = getDefaultTradeDeadline(formData.sport);
      
      // Set sport-specific defaults for games limit
      let defaultGamesLimit = 40; // Default for most sports
      if (formData.sport === 'NBA') {
        defaultGamesLimit = 40; // NBA default
      } else if (formData.sport === 'MLB') {
        defaultGamesLimit = 162; // MLB default (full season)
      } else if (formData.sport === 'NFL') {
        defaultGamesLimit = 17; // NFL default
      }
      
      setFormData(prev => ({ 
        ...prev, 
        playoffSchedule: availablePlayoffSchedules[0],
        tradeDeadline: defaultTradeDeadline,
        gamesLimit: defaultGamesLimit
      }));
    }
  }, [formData.sport, availablePlayoffSchedules]);

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
      sport: autoSelectedSport || 'none', // Auto-select if only one sport available, otherwise none
      leagueId: '', // Reset league ID when platform changes
      leagueType: 'none', // Reset subsequent fields to none
      scoring: 'none',
      matchup: 'none'
    }));
    setDetectedPlatform(null);
    setLeaguePreview(null);
  };

  // Handle league ID input with auto-detection
  const handleLeagueIdChange = (value: string) => {
    const detected = detectPlatformFromUrl(value);
    let platformToUse = formData.platform;
    
    if (detected && detected !== formData.platform) {
      setDetectedPlatform(detected);
      platformToUse = detected;
      // Auto-select the detected platform
      handlePlatformChange(detected);
    } else {
      setDetectedPlatform(null);
    }

    const extractedId = platformToUse ? extractLeagueId(value, platformToUse) : value;
    setFormData(prev => ({ ...prev, leagueId: extractedId }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.platform || formData.platform === 'none' || !formData.leagueId || !formData.sport || formData.sport === 'none' || !formData.leagueType || formData.leagueType === 'none' || !formData.scoring || formData.scoring === 'none' || !formData.matchup || formData.matchup === 'none') {
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
          puntedCategories: formData.puntedCategories,
          gamesLimit: formData.gamesLimit,
          gamesLimitType: formData.gamesLimitType,
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
      <div className="flex-1 overflow-y-auto p-6 bg-white rounded-t-xl">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT COLUMN - Main Questions */}
            <div className="space-y-4">
              {/* <h2 className="text-header font-semibold text-gray-900">League Information</h2> */}

              {/* Step 1: Platform */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="hw-icon text-gray-600" />
                  <label className="text-label text-strong-950">Platform</label>
                </div>
                <SegmentedControl.Root value={formData.platform} onValueChange={handlePlatformChange}>
                  <SegmentedControl.List
                    className="inline-flex w-128 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.platform}
                    floatingBgClassName="!bg-blue !text-white"
                    colorConfig={leagueImportColors}
                    isDisabled={formData.platform === 'none'}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      isControlDisabled={formData.platform === 'none'}
                    >
                      <Minus className={`hw-icon-2xs ${formData.platform === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {PLATFORMS.map(platform => (
                      <SegmentedControl.Trigger
                        key={platform.id}
                        value={platform.id}
                        disabled={!platform.available}
                        className="w-32"
                      >
                        <span className="text-label">{platform.name}</span>
                      </SegmentedControl.Trigger>
                    ))}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

              {/* Step 2: League ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="size-5 text-gray-600" />
                  <label className="text-label text-strong-950">League ID</label>
                </div>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      type="text"
                      value={formData.leagueId}
                      onChange={(e) => handleLeagueIdChange(e.target.value)}
                      placeholder="Paste league URL or ID..."
                      className=""
                      disabled={!formData.platform}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {formData.platform && (
                  <p className="text-sublabel text-soft flex items-center gap-2">
                    <InfoIcon className="hw-icon-2xs" />
                    {getPlatformHelperText(formData.platform)}
                  </p>
                )}
                {detectedPlatform && (
                  <div className="text-xs text-blue-600">
                    Detected Platform: {PLATFORMS.find(p => p.id === detectedPlatform)?.name} • League ID: {formData.leagueId}
                  </div>
                )}
              </div>

              {/* Step 3: Sport */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gamepad2 className={`hw-icon ${isFieldDisabled.sport(formData) ? leagueImportColors.icon.disabled : leagueImportColors.icon.normal}`} />
                  <label className={`text-label ${isFieldDisabled.sport(formData) ? leagueImportColors.label.disabled : 'text-strong'}`}>Sport</label>
                </div>
                <SegmentedControl.Root value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                  <SegmentedControl.List
                    className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.sport}
                    isDisabled={isFieldDisabled.sport(formData)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.sport(formData)}
                      isControlDisabled={isFieldDisabled.sport(formData) || formData.sport === 'none'}
                    >
                      <ScanLine className={`hw-icon-2xs ${formData.sport === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {SPORTS.map(sport => {
                      const isAvailable = availableSports.includes(sport);
                      return (
                        <SegmentedControl.Trigger
                          key={sport}
                          value={sport}
                          disabled={!isAvailable || isFieldDisabled.sport(formData)}
                          className="w-32 relative group"
                          title={!isAvailable ? `${sport} support coming soon!` : ''}
                          isControlDisabled={isFieldDisabled.sport(formData)}
                        >
                    
                          <span className="text-label">{sport}</span>
                        </SegmentedControl.Trigger>
                      );
                    })}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

              {/* Step 4: League Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className={`size-5 ${isFieldDisabled.leagueType(formData) ? leagueImportColors.icon.disabled : leagueImportColors.icon.normal}`} />
                  <label className={`text-label ${isFieldDisabled.leagueType(formData) ? leagueImportColors.label.disabled : leagueImportColors.label.normal}`}>League Type</label>
                </div>
                <SegmentedControl.Root value={formData.leagueType} onValueChange={(value) => setFormData(prev => ({ ...prev, leagueType: value }))}>
                  <SegmentedControl.List
                    className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.leagueType}
                    isDisabled={isFieldDisabled.leagueType(formData)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.leagueType(formData)}
                      isControlDisabled={isFieldDisabled.leagueType(formData) || formData.leagueType === 'none'}
                    >
                      <ScanLine className={`hw-icon-2xs ${formData.leagueType === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {LEAGUE_TYPES.map(type => (
                      <SegmentedControl.Trigger 
                        key={type} 
                        value={type} 
                        className="w-32" 
                        disabled={isFieldDisabled.leagueType(formData)}
                        isControlDisabled={isFieldDisabled.leagueType(formData)}
                      >
                          <span className="text-label">{type}</span>
                      </SegmentedControl.Trigger>
                    ))}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

              {/* Step 5: Scoring Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className={`size-5 ${isFieldDisabled.scoring(formData) ? leagueImportColors.icon.disabled : leagueImportColors.icon.normal}`} />
                  <label className={`text-label ${isFieldDisabled.scoring(formData) ? leagueImportColors.label.disabled : leagueImportColors.label.normal}`}>Scoring Type</label>
                </div>
                <SegmentedControl.Root value={formData.scoring} onValueChange={(value) => setFormData(prev => ({ ...prev, scoring: value }))}>
                  <SegmentedControl.List
                    className="inline-flex w-64 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.scoring}
                    isDisabled={isFieldDisabled.scoring(formData)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.scoring(formData)}
                      isControlDisabled={isFieldDisabled.scoring(formData) || formData.scoring === 'none'}
                    >
                      <ScanLine className={`hw-icon-2xs ${formData.scoring === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {SCORING_TYPES.map(type => (
                      <SegmentedControl.Trigger 
                        key={type} 
                        value={type} 
                        className="w-32" 
                        disabled={isFieldDisabled.scoring(formData)}
                        isControlDisabled={isFieldDisabled.scoring(formData)}
                      >
                        <span className="text-label">{type}</span>
                      </SegmentedControl.Trigger>
                    ))}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

              {/* Step 6: Matchup Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Swords className={`size-5 ${isFieldDisabled.matchup(formData) ? leagueImportColors.icon.disabled : leagueImportColors.icon.normal}`} />
                  <label className={`text-label ${isFieldDisabled.matchup(formData) ? leagueImportColors.label.disabled : leagueImportColors.label.normal}`}>Matchup Type</label>
                </div>
                <SegmentedControl.Root value={formData.matchup} onValueChange={(value) => setFormData(prev => ({ ...prev, matchup: value }))}>
                  <SegmentedControl.List
                    className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.matchup}
                    isDisabled={isFieldDisabled.matchup(formData)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.matchup(formData)}
                      isControlDisabled={isFieldDisabled.matchup(formData) || formData.matchup === 'none'}
                    >
                      <ScanLine className={`hw-icon-2xs ${formData.matchup === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {MATCHUP_TYPES.map(type => {
                      const isDisabledType = type === 'Roto' || type === 'Total Points';
                      return (
                        <SegmentedControl.Trigger 
                          key={type} 
                          value={type} 
                          className="w-32" 
                          disabled={isFieldDisabled.matchup(formData) || isDisabledType}
                          isControlDisabled={isFieldDisabled.matchup(formData)}
                          title={isDisabledType ? `${type} support coming soon!` : ''}
                        >
                          <span className="text-label">{type}</span>
                        </SegmentedControl.Trigger>
                      );
                    })}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

            </div>

            {/* RIGHT COLUMN - Conditional Questions */}
            <div className="space-y-2">
              <h2 className="text-label text-gray-900">Additional Settings</h2>

              {/* Settings Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* Trade Deadline (only show if sport is selected) */}
                {formData.sport && formData.sport !== 'none' && (
                  <SettingCard icon={ArrowRightLeft} label="Trade Deadline">
                    <Datepicker 
                      value={formData.tradeDeadline}
                      onChange={(date: Date | undefined) => setFormData(prev => ({ ...prev, tradeDeadline: date }))}
                    />
                  </SettingCard>
                )}

                {/* Salary League */}
                <SettingCard icon={CircleDollarSign} label="Salary League">
                  <input
                    type="checkbox"
                    checked={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </SettingCard>

                {/* FAAB Waivers */}
                <SettingCard icon={CircleDollarSign} label="FAAB Waivers">
                  <input
                    type="checkbox"
                    checked={formData.faab}
                    onChange={(e) => setFormData(prev => ({ ...prev, faab: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </SettingCard>

                {/* Categories Scoring (conditional) */}
                {formData.scoring === 'Categories' && (
                  <SettingCard icon={BarChart2} label="Categories Scoring">
                    <Select.Root value={formData.scoringMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, scoringMethod: value }))} size="xsmall">
                      <Select.Trigger className="w-full">
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {SCORING_METHODS.map(method => (
                          <Select.Item key={method} value={method}>{method}</Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </SettingCard>
                )}

                {/* Playoff Schedule (conditional) */}
                {formData.matchup === 'H2H' && (
                  <SettingCard icon={Calendar} label="Playoff Schedule">
                    <Select.Root value={formData.playoffSchedule} onValueChange={(value) => setFormData(prev => ({ ...prev, playoffSchedule: value }))} size="xsmall">
                      <Select.Trigger className="w-full">
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {availablePlayoffSchedules.map(schedule => (
                          <Select.Item key={schedule} value={schedule}>{schedule}</Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </SettingCard>
                )}

                {/* Games Limit (conditional - show for NBA and MLB, hide for NFL) */}
                {formData.scoring === 'Categories' && (formData.sport === 'NBA' || formData.sport === 'MLB') && (
                  <SettingCard icon={Gamepad2} label="Games Limit">
                    <div className="w-full space-y-2">
                      <Select.Root 
                        value={formData.gamesLimitType} 
                        onValueChange={(value) => {
                          let defaultLimit = 40;
                          if (formData.sport === 'NBA' && value === 'weekly-starts') {
                            defaultLimit = 40;
                          } else if (formData.sport === 'MLB' && value === 'weekly-pitching-starts') {
                            defaultLimit = 7;
                          }
                          setFormData(prev => ({ 
                            ...prev, 
                            gamesLimitType: value,
                            gamesLimit: value !== 'none' ? defaultLimit : prev.gamesLimit
                          }))
                        }} 
                        size="xsmall"
                      >
                        <Select.Trigger className="w-full">
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="none">None</Select.Item>
                          {formData.sport === 'NBA' && (
                            <Select.Item value="weekly-starts">Weekly Starts</Select.Item>
                          )}
                          {formData.sport === 'MLB' && (
                            <Select.Item value="weekly-pitching-starts">Weekly Pitching Starts</Select.Item>
                          )}
                        </Select.Content>
                      </Select.Root>
                      
                      {formData.gamesLimitType !== 'none' && (
                        <CounterInput 
                          value={formData.gamesLimit || (formData.sport === 'NBA' ? 40 : 7)}
                          onChange={(value) => setFormData(prev => ({ ...prev, gamesLimit: value }))}
                          disabled={formData.gamesLimitType === 'none'}
                          minValue={0}
                          maxValue={200}
                        />
                      )}
                    </div>
                  </SettingCard>
                )}

                {/* Dynasty Strategy (Dynasty/Keeper only) */}
                {(formData.leagueType === 'Dynasty' || formData.leagueType === 'Keeper') && (
                  <SettingCard icon={Trophy} label="Dynasty Strategy">
                    <Select.Root value={formData.teamStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, teamStatus: value }))} size="xsmall">
                      <Select.Trigger className="w-full">
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {TEAM_STATUSES.map(status => (
                          <Select.Item key={status} value={status}>{status}</Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </SettingCard>
                )}

                {/* Decay (Dynasty/Keeper only) */}
                {(formData.leagueType === 'Dynasty' || formData.leagueType === 'Keeper') && (
                  <SettingCard icon={Clock} label="Decay">
                    <input
                      type="checkbox"
                      checked={formData.decay}
                      onChange={(e) => setFormData(prev => ({ ...prev, decay: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </SettingCard>
                )}

                {/* Contracts (Dynasty/Keeper only) */}
                {(formData.leagueType === 'Dynasty' || formData.leagueType === 'Keeper') && (
                  <SettingCard icon={Settings} label="Contracts">
                    <input
                      type="checkbox"
                      checked={formData.contracts}
                      onChange={(e) => setFormData(prev => ({ ...prev, contracts: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </SettingCard>
                )}
              </div>



              {/* Categories Conditional Fields */}
              {formData.scoring === 'Categories' && (
                <div className="space-y-4">
                  {/* Punt Categories Section */}
                  <div className="rounded-lg ring-1 ring-inset ring-stroke-soft-100 bg-white hover:bg-gray-5 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ListChecks className="hw-icon text-gray-600" />
                        <h4 className="text-label text-strong">Punt Strategy</h4>
                      </div>
                      <div className="flex gap-1 overflow-x-auto">
                        {(leaguePreview?.categories && leaguePreview.categories.length > 0 
                          ? leaguePreview.categories 
                          : DEFAULT_CATEGORIES[formData.sport as keyof typeof DEFAULT_CATEGORIES] || []
                        ).map((category) => {
                          const isPunted = formData.puntedCategories.includes(category);
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                const newPuntedCategories = isPunted
                                  ? formData.puntedCategories.filter(cat => cat !== category)
                                  : [...formData.puntedCategories, category];
                                setFormData(prev => ({ 
                                  ...prev, 
                                  puntedCategories: newPuntedCategories,
                                  puntCategories: newPuntedCategories.length > 0 
                                }));
                              }}
                              className={`w-16 px-2 py-1 text-paragraph font-medium rounded border transition-colors ${
                                isPunted 
                                  ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                                  : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {category}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/*  */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 rounded-b-xl ring-1 ring-inset ring-stroke-soft-100">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Button.Root variant="neutral" mode="stroke" onClick={onCancel}>
            Cancel
          </Button.Root>
          <Button.Root
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !formData.platform || formData.platform === 'none' || !formData.leagueId || !formData.sport || formData.sport === 'none' || !formData.leagueType || formData.leagueType === 'none' || !formData.scoring || formData.scoring === 'none' || !formData.matchup || formData.matchup === 'none'}
          >
            {loading && <Loader2 className="size-4 animate-spin mr-2" />}
            Import League
          </Button.Root>
        </div>
      </div>
    </div>
  );
}