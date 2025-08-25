'use client';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import * as Button from '@/components/alignui/button';
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
import { AnimatePresence, motion } from 'framer-motion';
import { SyncIndicatorInline } from './SyncIndicator';
import LeaguePreviewCard from './LeaguePreviewCard';

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

// Helper function to detect platform from league ID pattern
const detectPlatformFromLeagueId = (input: string): string | null => {
  // Clean input - remove whitespace
  const cleanInput = input.trim();
  
  // Skip if it looks like a URL
  if (cleanInput.includes('http') || cleanInput.includes('.com')) {
    return null;
  }

  // Fantrax: 16-character alphanumeric (lowercase letters and numbers)
  if (/^[a-z0-9]{16}$/.test(cleanInput)) {
    return 'fantrax';
  }

  // Sleeper: 18-19 digit numbers (Snowflake IDs)
  if (/^\d{18,19}$/.test(cleanInput)) {
    return 'sleeper';
  }

  // Yahoo: game.l.league format (e.g., 423.l.12345)
  if (/^\d+\.l\.\d+$/.test(cleanInput)) {
    return 'yahoo';
  }

  // ESPN: 6-9 digit numbers
  if (/^\d{6,9}$/.test(cleanInput)) {
    return 'espn';
  }

  return null;
};

// Helper function to get platform-specific helper text
const getPlatformHelperText = (platform: string): string => {
  switch (platform) {
    case 'fantrax':
      return 'Paste your league URL or 16-character ID (e.g., f1zwi0wum3y5041b). Platform auto-detected from ID format.';
    case 'sleeper':
      return 'Paste your league URL or 18-19 digit numeric ID. Platform auto-detected from ID format.';
    case 'yahoo':
      return 'Paste your league URL or key format ID (e.g., 423.l.12345). Yahoo requires OAuth sign-in.';
    case 'espn':
      return 'Paste your league URL or 6-9 digit ID. Platform auto-detected from ID format.';
    case 'none':
      return 'Enter any league URL or ID - we\'ll auto-detect the platform!';
    default:
      return 'Enter your league ID or paste the full league URL. Platform will be auto-detected.';
  }
};

// Highlighted League ID Input component
function HighlightedLeagueInput({
  value,
  onChange,
  placeholder,
  platform,
  disabled = false
}: {
  value: string;
  onChange: (value: string, inputRef?: React.RefObject<HTMLInputElement | null>) => void;
  placeholder?: string;
  platform: string;
  disabled?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isUrl = (input: string): boolean => {
    return input.includes('http') || input.includes('.com');
  };

  const renderHighlightedContent = () => {
    if (!value || !isUrl(value) || platform === 'none' || isFocused) {
      return null;
    }

    const extractedId = extractLeagueId(value, platform);
    if (!extractedId || extractedId === value) {
      return null;
    }

    const parts = value.split(extractedId);
    if (parts.length !== 2) {
      return null;
    }

    return (
      <div className="absolute inset-0 flex items-center px-3 pointer-events-none overflow-hidden">
        <div className="flex items-center text-paragraph break-all">
          <span className="text-gray-700">{parts[0]}</span>
          <span className="inline-flex items-center px-1  mx-[1px] bg-blue-50 text-blue-800 font-bold rounded border border-blue-200 text-label whitespace-nowrap">
            {extractedId}
          </span>
          <span className="text-gray-700">{parts[1]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value, inputRef)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-type ${
          !isFocused && value && isUrl(value) && platform !== 'none' ? 'text-transparent' : 'text-gray-900'
        } bg-white disabled:bg-gray-50 disabled:text-gray-500`}
      />
      {renderHighlightedContent()}
    </div>
  );
}

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
  disabled = false,
  pulseKey
}: { 
  icon: React.ElementType; 
  label: string; 
  children: React.ReactNode;
  disabled?: boolean;
  pulseKey?: string;
}) {
  return (
    <motion.div 
      key={pulseKey}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`h-24 rounded-lg ring-1 ring-inset ring-stroke-soft-100 bg-white ${disabled ? 'opacity-50' : 'hover:bg-gray-5'} flex flex-col`}
    >
      <div className="flex flex-col items-center text-center flex-1">
        <div className="w-full flex items-center gap-2 border-b border-gray-100 py-2 justify-center">
          <Icon className="hw-icon-xs " />
          <label className="text-label">{label}</label>
        </div>
        
        <div className="flex-1 flex items-center justify-center text-paragraph">
          {children}
        </div>
      </div>
    </motion.div>
  );
}




// Helper functions to determine disabled states
const isFieldDisabled = {
  platform: (formData: FormData, hasApiSync: boolean) => !formData.leagueId || !hasApiSync,
  sport: (formData: FormData, hasApiSync: boolean) => !formData.leagueId || !hasApiSync || formData.platform === 'none',
  leagueType: (formData: FormData, hasApiSync: boolean) => !formData.leagueId || !hasApiSync || formData.platform === 'none',
  scoring: (formData: FormData, hasApiSync: boolean) => !formData.leagueId || !hasApiSync || formData.platform === 'none',
  matchup: (formData: FormData, hasApiSync: boolean) => !formData.leagueId || !hasApiSync || formData.platform === 'none'
};

// Helper functions to determine synced states
const isFieldSynced = {
  platform: (apiSyncedFields: string[]) => apiSyncedFields.includes('platform'),
  sport: (apiSyncedFields: string[]) => apiSyncedFields.includes('sport'),
  leagueType: (apiSyncedFields: string[]) => apiSyncedFields.includes('leagueType'),
  scoring: (apiSyncedFields: string[]) => apiSyncedFields.includes('scoring'),
  matchup: (apiSyncedFields: string[]) => apiSyncedFields.includes('matchup')
};

// Helper function to get appropriate styling based on field state
const getFieldStyling = (field: keyof typeof isFieldDisabled, currentFormData: FormData, apiSyncedFields: string[], hasApiSync: boolean) => {
  const disabled = isFieldDisabled[field](currentFormData, hasApiSync);
  const synced = isFieldSynced[field](apiSyncedFields);
  
  if (disabled) {
    return {
      iconClass: leagueImportColors.icon.disabled,
      labelClass: leagueImportColors.label.disabled
    };
  } else if (synced) {
    return {
      iconClass: leagueImportColors.icon.synced,
      labelClass: leagueImportColors.label.synced
    };
  } else {
    return {
      iconClass: leagueImportColors.icon.normal,
      labelClass: leagueImportColors.label.normal
    };
  }
};


// Custom color configuration for league import form
const leagueImportColors = {
  text: {
    inactive: 'text-black',                     // Inactive tab text color
    active: 'text-white',                       // Active tab text color
    disabled: 'text-gray-200',                  // Disabled tab text color
    disabledActive: 'text-white',               // Disabled but active tab text color
    syncedInactive: 'text-gray-500',            // Synced inactive tab text color
    syncedActive: 'text-gray-700'               // Synced active tab text color
  },
  background: {
    hover: 'hover:bg-gray-25',                  // Tab hover background
    active: 'bg-blue',                          // Active tab background (floating background)
    activeHover: 'data-[state=active]:hover:bg-blue-600', // Active tab hover background
    disabledHover: 'disabled:hover:bg-gray-25', // Disabled tab hover background
    disabledActive: 'bg-blue-200',              // Disabled but active tab background (floating background)
    syncedHover: 'hover:bg-gray-15',            // Synced tab hover background
    syncedActive: 'bg-gray-200',                // Synced active tab background (floating background)
    syncedActiveHover: 'data-[state=active]:hover:bg-gray-250' // Synced active tab hover background
  },
  container: {
    background: 'bg-bg-weak-25',                // Default container background
    floatingBg: 'bg-bg-white-0',               // Default floating background
    syncedBackground: 'bg-gray-25',             // Synced container background
    syncedFloatingBg: 'bg-gray-200'            // Synced floating background
  },
  // Custom colors for form labels and icons
  label: {
    normal: 'text-strong',                      // Form field labels when enabled
    disabled: 'text-disabled',                  // Form field labels when disabled
    synced: 'text-gray-600'                     // Form field labels when synced
  },
  icon: {
    normal: 'text-strong',                      // Form field icons when enabled
    disabled: 'text-disabled',                  // Form field icons when disabled
    synced: 'text-gray-600'                     // Form field icons when synced
  },
  separator: {
    from: 'after:from-transparent',
    via: 'after:via-gray-150', 
    viaDisabled: 'after:via-gray-100',
    viaSynced: 'after:via-gray-100',            // Synced separator color
    to: 'after:to-transparent'
  }
} as const;

export default function DynamicLeagueImportForm({ onComplete, onCancel }: DynamicLeagueImportFormProps) {
  const [loading, setLoading] = useState(false);
  const [leaguePreview, setLeaguePreview] = useState<League | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  
  // API sync state
  const [apiSyncedData, setApiSyncedData] = useState<any>(null);
  const [apiSyncedFields, setApiSyncedFields] = useState<string[]>([]);
  const [apiFetching, setApiFetching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Helper to check if we have successful API sync
  const hasApiSync = apiSyncedData && apiSyncedFields.length > 0;

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
  const handleLeagueIdChange = (value: string, inputRef?: React.RefObject<HTMLInputElement | null>) => {
    let detected = detectPlatformFromUrl(value);
    let detectionMethod = 'URL';
    
    // If no URL detection, try league ID pattern detection
    if (!detected) {
      detected = detectPlatformFromLeagueId(value);
      detectionMethod = 'ID pattern';
    }
    
    if (detected && detected !== formData.platform) {
      setDetectedPlatform(detected);
      
      // DON'T auto-select the platform immediately - wait for API sync
      // Just store the detected platform for later use
      
      // Show detection feedback to user
      const platformName = PLATFORMS.find(p => p.id === detected)?.name;
      toast.info(`Detected ${platformName} league from ${detectionMethod}! Syncing league data...`);
      
      // Unfocus the input to show the blue bubble highlight immediately
      if (inputRef?.current && (value.includes('http') || value.includes('.com'))) {
        setTimeout(() => {
          inputRef.current?.blur();
        }, 100);
      }
    } else if (!detected) {
      setDetectedPlatform(null);
    }

    // Keep the full URL in the form data instead of extracting
    setFormData(prev => ({ ...prev, leagueId: value }));
  };

  // Auto-fetch API data when detectedPlatform and leagueId are available
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchApiData = async () => {
      // Use detectedPlatform instead of formData.platform for API calls
      const platformToUse = detectedPlatform || formData.platform;
      
      if (!platformToUse || platformToUse === 'none' || !formData.leagueId) {
        // Clear existing API data if missing requirements
        setApiSyncedData(null);
        setApiSyncedFields([]);
        setApiError(null);
        return;
      }

      // Only fetch for supported platforms
      if (!['fantrax', 'sleeper'].includes(platformToUse)) {
        return;
      }

      // Extract the actual league ID for the API call
      const actualLeagueId = extractLeagueId(formData.leagueId, platformToUse);
      if (!actualLeagueId) {
        return;
      }

      setApiFetching(true);
      setApiError(null);

      try {
        const response = await fetch(`/api/platforms/${platformToUse}/leagues/${actualLeagueId}?mapToForm=true`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch league data: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.formMapping && data.formMapping.apiSuccess) {
          const { formData: mappedData, syncedFields } = data.formMapping;
          
          // Add platform to synced fields since we auto-detected it
          const extendedSyncedFields = [...syncedFields];
          if (!extendedSyncedFields.includes('platform')) {
            extendedSyncedFields.push('platform');
          }
          
          // Store the API synced data
          setApiSyncedData(data.formMapping);
          setApiSyncedFields(extendedSyncedFields);

          // NOW set the platform in the form data after successful API sync
          setFormData(prev => {
            const updates: Partial<typeof prev> = {
              platform: platformToUse // Set the platform from the detected/successful API call
            };
            
            // Map API data to form fields that exist in FormData interface, but respect user overrides
            if (syncedFields.includes('sport') && mappedData.sport && (prev.sport === 'none' || !prev.sport)) {
              updates.sport = mappedData.sport;
            }
            if (syncedFields.includes('leagueType') && mappedData.leagueType && (prev.leagueType === 'none' || !prev.leagueType)) {
              updates.leagueType = mappedData.leagueType;
            }
            if (syncedFields.includes('scoring') && mappedData.scoring && (prev.scoring === 'none' || !prev.scoring)) {
              updates.scoring = mappedData.scoring;
            }
            if (syncedFields.includes('matchup') && mappedData.matchup && (prev.matchup === 'none' || !prev.matchup)) {
              updates.matchup = mappedData.matchup;
            }

            return { ...prev, ...updates };
          });

          // Clear detected platform since we've now set it in formData
          setDetectedPlatform(null);

          // Show success toast
          toast.success(`League data synced from ${platformToUse.charAt(0).toUpperCase() + platformToUse.slice(1)}!`);
        } else {
          throw new Error('Failed to map league data to form fields');
        }
      } catch (error) {
        console.error('Error fetching API data:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to fetch league data');
        setApiSyncedData(null);
        setApiSyncedFields([]);
        
        // Show error toast
        toast.error('Failed to sync league data from API');
      } finally {
        setApiFetching(false);
      }
    };

    // Debounce the API call to avoid excessive requests
    timeoutId = setTimeout(fetchApiData, 1000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [detectedPlatform, formData.leagueId]); // Note: formData.platform intentionally omitted to prevent double sync

  // Handle form submission
  const handleSubmit = async () => {
    // Extract actual league ID for submission
    const actualLeagueId = extractLeagueId(formData.leagueId, formData.platform);
    
    // Basic validation
    if (!formData.platform || formData.platform === 'none' || !actualLeagueId || !formData.sport || formData.sport === 'none' || !formData.leagueType || formData.leagueType === 'none' || !formData.scoring || formData.scoring === 'none' || !formData.matchup || formData.matchup === 'none') {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const leagueData = {
        platform: formData.platform,
        platformLeagueId: actualLeagueId,
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

              {/* Step 1: League ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                <Hash className="hw-icon-xs text-gray-600" />
                  <label className="text-label text-strong-950">League ID</label>
                </div>
                <HighlightedLeagueInput
                  value={formData.leagueId}
                  onChange={handleLeagueIdChange}
                  placeholder="Paste league URL or ID..."
                  platform={formData.platform}
                />
                {formData.platform && (
                  <p className="text-sublabel text-soft flex items-center gap-2">
                    <InfoIcon className="hw-icon-2xs" />
                    {getPlatformHelperText(formData.platform)}
                  </p>
                )}
                {detectedPlatform && (
                  <div className="text-xs text-blue-600">
                    Detected Platform: {PLATFORMS.find(p => p.id === detectedPlatform)?.name}
                  </div>
                )}
              </div>

              {/* League Preview Card (shows when API data is available) */}
              <LeaguePreviewCard 
                apiData={apiSyncedData} 
                loading={apiFetching} 
                error={apiError} 
                platform={formData.platform !== 'none' ? formData.platform : undefined}
              />

              {/* Step 2: Platform */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className={`hw-icon-xs ${getFieldStyling('platform', formData, apiSyncedFields, hasApiSync).iconClass}`} />
                  <label className={`text-label ${getFieldStyling('platform', formData, apiSyncedFields, hasApiSync).labelClass}`}>
                    Platform
                    <SyncIndicatorInline 
                      synced={apiSyncedFields.includes('platform')} 
                      platform={formData.platform !== 'none' ? formData.platform : undefined} 
                    />
                  </label>
                </div>
                <SegmentedControl.Root value={formData.platform} onValueChange={handlePlatformChange}>
                  <SegmentedControl.List
                    className="inline-flex w-128 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.platform}
                    isDisabled={isFieldDisabled.platform(formData, hasApiSync)}
                    isSynced={isFieldSynced.platform(apiSyncedFields)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.platform(formData, hasApiSync)}
                      isControlDisabled={isFieldDisabled.platform(formData, hasApiSync) || formData.platform === 'none'}
                    >
                      <Minus className={`hw-icon-2xs ${formData.platform === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {PLATFORMS.map(platform => (
                      <SegmentedControl.Trigger
                        key={platform.id}
                        value={platform.id}
                        disabled={!platform.available || isFieldDisabled.platform(formData, hasApiSync)}
                        className="w-32"
                        isControlDisabled={isFieldDisabled.platform(formData, hasApiSync)}
                      >
                        <span className="text-label">{platform.name}</span>
                      </SegmentedControl.Trigger>
                    ))}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

              {/* Step 3: League Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className={`hw-icon ${getFieldStyling('leagueType', formData, apiSyncedFields, hasApiSync).iconClass}`} />
                  <label className={`text-label ${getFieldStyling('leagueType', formData, apiSyncedFields, hasApiSync).labelClass}`}>
                    League Type
                    <SyncIndicatorInline 
                      synced={apiSyncedFields.includes('leagueType')} 
                      platform={formData.platform !== 'none' ? formData.platform : undefined} 
                    />
                  </label>
                </div>
                <SegmentedControl.Root value={formData.leagueType} onValueChange={(value) => setFormData(prev => ({ ...prev, leagueType: value }))}>
                  <SegmentedControl.List
                    className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.leagueType}
                    isDisabled={isFieldDisabled.leagueType(formData, hasApiSync)}
                    isSynced={isFieldSynced.leagueType(apiSyncedFields)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.leagueType(formData, hasApiSync)}
                      isControlDisabled={isFieldDisabled.leagueType(formData, hasApiSync) || formData.leagueType === 'none'}
                    >
                      <ScanLine className={`hw-icon-2xs ${formData.leagueType === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {LEAGUE_TYPES.map(type => (
                      <SegmentedControl.Trigger 
                        key={type} 
                        value={type} 
                        className="w-32" 
                        disabled={isFieldDisabled.leagueType(formData, hasApiSync)}
                        isControlDisabled={isFieldDisabled.leagueType(formData, hasApiSync)}
                      >
                          <span className="text-label">{type}</span>
                      </SegmentedControl.Trigger>
                    ))}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

              {/* Step 4: Sport */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gamepad2 className={`hw-icon-sm ${getFieldStyling('sport', formData, apiSyncedFields, hasApiSync).iconClass}`} />
                  <label className={`text-label ${getFieldStyling('sport', formData, apiSyncedFields, hasApiSync).labelClass}`}>
                    Sport
                    <SyncIndicatorInline 
                      synced={apiSyncedFields.includes('sport')} 
                      platform={formData.platform !== 'none' ? formData.platform : undefined} 
                    />
                  </label>
                </div>
                <SegmentedControl.Root value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                  <SegmentedControl.List
                    className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.sport}
                    isDisabled={isFieldDisabled.sport(formData, hasApiSync)}
                    isSynced={isFieldSynced.sport(apiSyncedFields)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.sport(formData, hasApiSync)}
                      isControlDisabled={isFieldDisabled.sport(formData, hasApiSync) || formData.sport === 'none'}
                    >
                      <ScanLine className={`hw-icon-2xs ${formData.sport === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {SPORTS.map(sport => {
                      const isAvailable = availableSports.includes(sport);
                      return (
                        <SegmentedControl.Trigger
                          key={sport}
                          value={sport}
                          disabled={!isAvailable || isFieldDisabled.sport(formData, hasApiSync)}
                          className="w-32 relative group"
                          title={!isAvailable ? `${sport} support coming soon!` : ''}
                          isControlDisabled={isFieldDisabled.sport(formData, hasApiSync)}
                        >
                    
                          <span className="text-label">{sport}</span>
                        </SegmentedControl.Trigger>
                      );
                    })}
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>

              {/* Step 5: Scoring Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className={`hw-icon ${getFieldStyling('scoring', formData, apiSyncedFields, hasApiSync).iconClass}`} />
                  <label className={`text-label ${getFieldStyling('scoring', formData, apiSyncedFields, hasApiSync).labelClass}`}>
                    Scoring Type
                    <SyncIndicatorInline 
                      synced={apiSyncedFields.includes('scoring')} 
                      platform={formData.platform !== 'none' ? formData.platform : undefined} 
                    />
                  </label>
                </div>
                <SegmentedControl.Root value={formData.scoring} onValueChange={(value) => setFormData(prev => ({ ...prev, scoring: value }))}>
                  <SegmentedControl.List
                    className="inline-flex w-64 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.scoring}
                    isDisabled={isFieldDisabled.scoring(formData, hasApiSync)}
                    isSynced={isFieldSynced.scoring(apiSyncedFields)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.scoring(formData, hasApiSync)}
                      isControlDisabled={isFieldDisabled.scoring(formData, hasApiSync) || formData.scoring === 'none'}
                    >
                      <ScanLine className={`hw-icon-2xs ${formData.scoring === 'none' ? 'text-white' : 'text-current'}`} />
                    </SegmentedControl.Trigger>
                    {SCORING_TYPES.map(type => (
                      <SegmentedControl.Trigger 
                        key={type} 
                        value={type} 
                        className="w-32" 
                        disabled={isFieldDisabled.scoring(formData, hasApiSync)}
                        isControlDisabled={isFieldDisabled.scoring(formData, hasApiSync)}
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
                  <Swords className={`hw-icon ${getFieldStyling('matchup', formData, apiSyncedFields, hasApiSync).iconClass}`} />
                  <label className={`text-label ${getFieldStyling('matchup', formData, apiSyncedFields, hasApiSync).labelClass}`}>
                    Matchup Type
                    <SyncIndicatorInline 
                      synced={apiSyncedFields.includes('matchup')} 
                      platform={formData.platform !== 'none' ? formData.platform : undefined} 
                    />
                  </label>
                </div>
                <SegmentedControl.Root value={formData.matchup} onValueChange={(value) => setFormData(prev => ({ ...prev, matchup: value }))}>
                  <SegmentedControl.List
                    className="inline-flex w-96 gap-0.5 p-1 rounded-lg bg-gray-10 ring-1 ring-inset ring-stroke-soft-100"
                    activeValue={formData.matchup}
                    isDisabled={isFieldDisabled.matchup(formData, hasApiSync)}
                    isSynced={isFieldSynced.matchup(apiSyncedFields)}
                    colorConfig={leagueImportColors}
                  >
                    <SegmentedControl.Trigger
                      value="none"
                      className="w-8"
                      disabled={isFieldDisabled.matchup(formData, hasApiSync)}
                      isControlDisabled={isFieldDisabled.matchup(formData, hasApiSync) || formData.matchup === 'none'}
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
                          disabled={isFieldDisabled.matchup(formData, hasApiSync) || isDisabledType}
                          isControlDisabled={isFieldDisabled.matchup(formData, hasApiSync)}
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
            <div className="space-y-2 border border-gray-100 rounded-lg p-4 bg-gray-5">
              {/* <h2 className="text-label text-gray-900">Additional Settings</h2> */}

              {/* Settings Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <AnimatePresence mode="popLayout">
                {/* Trade Deadline (only show if sport is selected) */}
                {formData.sport && formData.sport !== 'none' && (
                  <SettingCard icon={ArrowRightLeft} label="Trade Deadline" pulseKey={`trade-deadline-${formData.sport}`}>
                    <Datepicker 
                      value={formData.tradeDeadline}
                      onChange={(date: Date | undefined) => setFormData(prev => ({ ...prev, tradeDeadline: date }))}
                    />
                  </SettingCard>
                )}

                {/* Salary League */}
                <SettingCard icon={CircleDollarSign} label="Salary League" pulseKey="salary-league">
                  <input
                    type="checkbox"
                    checked={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </SettingCard>

                {/* FAAB Waivers */}
                <SettingCard icon={CircleDollarSign} label="FAAB Waivers" pulseKey="faab-waivers">
                  <input
                    type="checkbox"
                    checked={formData.faab}
                    onChange={(e) => setFormData(prev => ({ ...prev, faab: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </SettingCard>

                {/* Categories Scoring (conditional) */}
                {formData.scoring === 'Categories' && (
                  <SettingCard icon={BarChart2} label="Categories Scoring" pulseKey={`categories-scoring-${formData.scoring}`}>
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
                  <SettingCard icon={Calendar} label="Playoff Schedule" pulseKey={`playoff-schedule-${formData.matchup}`}>
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
                  <SettingCard icon={Gamepad2} label="Games Limit" pulseKey={`games-limit-${formData.scoring}-${formData.sport}`}>
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
                  <SettingCard icon={Trophy} label="Dynasty Strategy" pulseKey={`dynasty-strategy-${formData.leagueType}`}>
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
                  <SettingCard icon={Clock} label="Decay" pulseKey={`decay-${formData.leagueType}`}>
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
                  <SettingCard icon={Settings} label="Contracts" pulseKey={`contracts-${formData.leagueType}`}>
                    <input
                      type="checkbox"
                      checked={formData.contracts}
                      onChange={(e) => setFormData(prev => ({ ...prev, contracts: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </SettingCard>
                )}
                </AnimatePresence>
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
                        ).filter((category, index, array) => 
                          // Filter out empty/null categories and ensure uniqueness
                          category && category.trim() && array.indexOf(category) === index
                        ).map((category) => {
                          const isPunted = formData.puntedCategories.includes(category);
                          return (
                            <button
                              key={`category-${category}`}
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
            disabled={loading || !formData.platform || formData.platform === 'none' || !formData.leagueId || !extractLeagueId(formData.leagueId, formData.platform) || !formData.sport || formData.sport === 'none' || !formData.leagueType || formData.leagueType === 'none' || !formData.scoring || formData.scoring === 'none' || !formData.matchup || formData.matchup === 'none'}
          >
            {loading && <Loader2 className="hw-icon animate-spin mr-2" />}
            Import League
          </Button.Root>
        </div>
      </div>
    </div>
  );
}