'use client';
import { useState, useEffect, useMemo } from 'react';
import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import {
  RiSettings3Line,
  RiGamepadLine,
  RiTrophyLine,
  RiTeamLine,
  RiFootballLine,
  RiBasketballLine,
  RiBaseballLine,
  RiHockeyPuckLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCheckLine,
  RiCloseLine,
  RiGlobalLine,
  RiHashtag,
  RiCalendarLine,
  RiTargetLine,
  RiListCheck,
  RiTimeLine,
  RiBarChartLine,
  RiGameLine,
  RiFlag3Line
} from '@remixicon/react';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  SPORTS,
  LEAGUE_TYPES,
  SCORING_TYPES,
  DRAFT_TYPES,
  TEAM_DIRECTIONS,
  SPORT_CATEGORIES,
  promptRegistry,
  getActivePrompts,
  getDefaultPromptValues,
  validationRules,
  validateLeagueForm
} from '@/lib/leagueImport/promptEngine';

const PLATFORMS = [
  { id: 'fantrax', name: 'Fantrax', available: true, sports: ['NFL', 'NBA', 'MLB', 'NHL'], supportedScoring: ['Points', 'Categories'], supportedMatchups: ['H2H', 'Roto', 'Points'] },
  { id: 'sleeper', name: 'Sleeper', available: true, sports: ['NFL'], supportedScoring: ['Points'], supportedMatchups: ['H2H'] },
  { id: 'yahoo', name: 'Yahoo', available: false, sports: ['NFL', 'NBA', 'MLB'], supportedScoring: ['Points', 'Categories'], supportedMatchups: ['H2H', 'Roto', 'Points'] },
  { id: 'espn', name: 'ESPN', available: false, sports: ['NFL', 'NBA', 'MLB'], supportedScoring: ['Points', 'Categories'], supportedMatchups: ['H2H', 'Roto', 'Points'] }
];

function IconInfoCustom(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10 16.25C13.4518 16.25 16.25 13.4518 16.25 10C16.25 6.54822 13.4518 3.75 10 3.75C6.54822 3.75 3.75 6.54822 3.75 10C3.75 13.4518 6.54822 16.25 10 16.25ZM11.1158 13.2086L11.2156 12.8006C11.164 12.8249 11.0807 12.8526 10.9665 12.8841C10.852 12.9157 10.7489 12.9318 10.6583 12.9318C10.4654 12.9318 10.3295 12.9001 10.2507 12.8366C10.1724 12.773 10.1333 12.6534 10.1333 12.4783C10.1333 12.4089 10.1451 12.3054 10.1697 12.17C10.1936 12.0337 10.2211 11.9126 10.2516 11.8067L10.6242 10.4876C10.6607 10.3665 10.6857 10.2334 10.6992 10.0882C10.7129 9.94325 10.7193 9.84185 10.7193 9.78429C10.7193 9.50614 10.6218 9.28041 10.4268 9.10629C10.2317 8.93229 9.95393 8.84529 9.59396 8.84529C9.39365 8.84529 9.18188 8.88088 8.95776 8.95201C8.73363 9.02294 8.49933 9.1084 8.25421 9.2082L8.15415 9.6165C8.22719 9.58949 8.31419 9.56043 8.41598 9.53034C8.51732 9.50038 8.61674 9.48489 8.71347 9.48489C8.91096 9.48489 9.04399 9.51856 9.1137 9.58488C9.18342 9.65139 9.21844 9.7697 9.21844 9.93883C9.21844 10.0324 9.20736 10.1363 9.18438 10.2492C9.16172 10.3628 9.13342 10.483 9.10013 10.6098L8.72595 11.9342C8.69266 12.0734 8.66834 12.1979 8.65304 12.3084C8.63786 12.4189 8.63057 12.5272 8.63057 12.6326C8.63057 12.9048 8.73114 13.1292 8.93222 13.3063C9.13329 13.4826 9.41523 13.5714 9.77769 13.5714C10.0137 13.5714 10.2209 13.5406 10.3992 13.4785C10.5773 13.4167 10.8164 13.3268 11.1158 13.2086ZM11.0495 7.8502C11.2235 7.68882 11.3101 7.49254 11.3101 7.26272C11.3101 7.03341 11.2236 6.83675 11.0495 6.67331C10.8758 6.51032 10.6666 6.42857 10.4219 6.42857C10.1765 6.42857 9.96635 6.51013 9.79107 6.67331C9.61579 6.83675 9.52796 7.03334 9.52796 7.26272C9.52796 7.49254 9.61579 7.68875 9.79107 7.8502C9.96667 8.01217 10.1764 8.09321 10.4219 8.09321C10.6666 8.09321 10.8758 8.01217 11.0495 7.8502Z'
        fill='#D1D1D1'
      />
    </svg>
  );
}

const InputWithIcons = ({
  value,
  onChange,
  size: _size,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const { input } = Input.inputVariants();
  const { root: compactButtonRoot, icon: compactButtonIcon } =
    CompactButton.compactButtonVariants({ variant: 'ghost' });

  const handleClear = () => {
    const event = {
      target: { name: props.name, value: '' },
    };
    onChange?.(event);
  };

  const handleComplete = () => {
    console.log('Completed:', value);
  };

  return (
    <Input.Root
      className={`${!isFocused ? 'shadow-none before:!ring-0' : 'before:!ring-1'}`}
    >
      <Input.Wrapper>
        <input
          {...props}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={input({ size: 'small' })}
        />
        {isFocused && (
          <>
            <CompactButton.Root
              variant='ghost'
              onClick={handleClear}
              className={compactButtonRoot()}
            >
              <RiCloseLine className={compactButtonIcon()} />
            </CompactButton.Root>
            <CompactButton.Root
              variant='ghost'
              onClick={handleComplete}
              className={compactButtonRoot()}
            >
              <RiCheckLine className={compactButtonIcon()} />
            </CompactButton.Root>
          </>
        )}
      </Input.Wrapper>
    </Input.Root>
  );
};

const SelectWithIcons = ({
  value,
  onChange,
  children,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  
  return (
    <div className="relative">
      <select
        {...props}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm bg-white border border-stroke-soft-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 ${isFocused ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}
      >
        {children}
      </select>
    </div>
  );
};

export default function DynamicLeagueImportForm({ onComplete, onCancel }) {
  // Form state
  const [availableLeagues, setAvailableLeagues] = useState([]);
  const [leaguePreview, setLeaguePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Core form fields (now includes platform)
  const [formData, setFormData] = useState({
    platform: '',
    leagueId: '',
    sport: '',
    leagueType: '',
    scoring: '',
    matchup: '',
    draftType: '',
    settings: {}
  });

  // Get active prompts based on current selections
  const activePrompts = useMemo(() => {
    return getActivePrompts(formData);
  }, [formData]);

  // Get selected platform info
  const selectedPlatform = useMemo(() => {
    return PLATFORMS.find(platform => platform.id === formData.platform);
  }, [formData.platform]);

  // Get valid sports based on platform selection
  const validSports = useMemo(() => {
    if (!selectedPlatform) return SPORTS;
    return SPORTS.filter(sport => selectedPlatform.sports.includes(sport));
  }, [selectedPlatform]);

  // Get valid scoring types based on platform selection
  const validScoringTypes = useMemo(() => {
    if (!selectedPlatform) return SCORING_TYPES;
    return SCORING_TYPES.filter(scoring => selectedPlatform.supportedScoring.includes(scoring));
  }, [selectedPlatform]);

  // Get valid matchup types based on platform and scoring selection
  const validMatchupTypes = useMemo(() => {
    const baseMatchups = validationRules.getValidMatchupTypes(formData.scoring);
    if (!selectedPlatform) return baseMatchups;
    return baseMatchups.filter(matchup => selectedPlatform.supportedMatchups.includes(matchup));
  }, [formData.scoring, selectedPlatform]);

  // Initialize default settings when sport changes
  useEffect(() => {
    if (formData.sport) {
      const defaults = getDefaultPromptValues(formData.sport);
      setFormData(prev => ({
        ...prev,
        settings: { ...defaults, ...prev.settings }
      }));
    }
  }, [formData.sport]);

  // Clear matchup if it becomes invalid
  useEffect(() => {
    if (formData.scoring && formData.matchup) {
      const validation = validationRules.validateScoringMatchup(formData.scoring, formData.matchup);
      if (!validation.isValid) {
        setFormData(prev => ({ ...prev, matchup: '' }));
        setErrors(prev => ({ ...prev, matchup: validation.error }));
      } else {
        setErrors(prev => ({ ...prev, matchup: null }));
      }
    }
  }, [formData.scoring, formData.matchup]);

  // Handle platform change to fetch available leagues
  const handlePlatformChange = async (platform) => {
    updateFormField('platform', platform);
    
    if (!platform) {
      setAvailableLeagues([]);
      updateFormField('leagueId', '');
      return;
    }

    const platformInfo = PLATFORMS.find(p => p.id === platform);
    
    // Clear invalid selections when platform changes
    if (platformInfo) {
      // Clear sport if not supported by platform
      if (formData.sport && !platformInfo.sports.includes(formData.sport)) {
        updateFormField('sport', '');
      }
      
      // Clear scoring if not supported by platform
      if (formData.scoring && !platformInfo.supportedScoring.includes(formData.scoring)) {
        updateFormField('scoring', '');
      }
      
      // Clear matchup if not supported by platform
      if (formData.matchup && !platformInfo.supportedMatchups.includes(formData.matchup)) {
        updateFormField('matchup', '');
      }
    }

    // Fantrax requires manual league ID entry, so skip fetching leagues list
    if (platform === 'fantrax') {
      setAvailableLeagues([]);
      updateFormField('leagueId', '');
      return;
    }

    // Sleeper requires user ID, so skip fetching leagues list for now
    if (platform === 'sleeper') {
      setAvailableLeagues([]);
      updateFormField('leagueId', '');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/platforms/${platform}/leagues`);
      if (!response.ok) throw new Error('Failed to fetch leagues');
      const leagues = await response.json();
      setAvailableLeagues(leagues);
    } catch (error) {
      toast.error(`Failed to connect to ${platform}: ${error.message}`);
      setAvailableLeagues([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle league selection and preview
  const handleLeagueSelect = async (leagueId) => {
    updateFormField('leagueId', leagueId);
    
    if (!leagueId || !formData.platform) {
      setLeaguePreview(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/platforms/${formData.platform}/leagues/${leagueId}`);
      if (!response.ok) throw new Error('Failed to fetch league details');
      const preview = await response.json();
      setLeaguePreview(preview);
      
      // Auto-populate detected fields but don't override user selections
      setFormData(prev => ({
        ...prev,
        sport: prev.sport || preview.sport || '',
        // Don't auto-populate other fields - let user confirm manually
      }));
    } catch (error) {
      toast.error(`Failed to load league details: ${error.message}`);
      setLeaguePreview(null);
    } finally {
      setLoading(false);
    }
  };

  // Update form field
  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Update settings field
  const updateSettingsField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }));
  };

  // Submit form
  const handleSubmit = async () => {
    // Enhanced validation to include platform and league ID
    const validation = validateLeagueForm({
      ...formData,
      platform: formData.platform,
      leagueId: formData.leagueId
    });
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const leagueData = {
        platform: formData.platform,
        platformLeagueId: formData.leagueId,
        leagueName: leaguePreview?.name || `${formData.platform} League`,
        teamCount: leaguePreview?.teamCount || 0,
        ...formData,
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
      toast.error(`Failed to import league: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Render the unified form
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-semibold">League Import</h1>
        {leaguePreview && (
          <div className="text-sm text-muted-foreground mt-2">
            {leaguePreview.name} • {leaguePreview.teamCount} teams
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Core fields */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">League Settings</h3>
              
              {/* Platform */}
              <div className="space-y-2">
                <label htmlFor="platform" className="text-sm font-medium">Platform *</label>
                <select 
                  value={formData.platform} 
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select platform...</option>
                  {PLATFORMS.map(platform => (
                    <option key={platform.id} value={platform.id} disabled={!platform.available}>
                      {platform.name} {!platform.available ? '(Coming Soon)' : ''}
                    </option>
                  ))}
                </select>
                {errors.platform && <div className="text-sm text-red-500">{errors.platform}</div>}
              </div>

              {/* League ID / Selection */}
              <div className="space-y-2">
                <label htmlFor="leagueId" className="text-sm font-medium">League ID *</label>
                {formData.platform === 'fantrax' ? (
                  <div>
                    <input
                      type="text"
                      value={formData.leagueId}
                      onChange={(e) => updateFormField('leagueId', e.target.value)}
                      onBlur={() => {
                        if (formData.leagueId && formData.platform) {
                          handleLeagueSelect(formData.leagueId);
                        }
                      }}
                      placeholder="e.g. f1zwi0wum3y5041b (from your Fantrax league URL)"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Find this in your league URL: fantrax.com/fantasy/league/<strong>your-league-id</strong>/team/roster
                    </div>
                  </div>
                ) : formData.platform === 'sleeper' ? (
                  <div>
                    <input
                      type="text"
                      value={formData.leagueId}
                      onChange={(e) => updateFormField('leagueId', e.target.value)}
                      onBlur={() => {
                        if (formData.leagueId && formData.platform) {
                          handleLeagueSelect(formData.leagueId);
                        }
                      }}
                      placeholder="e.g. 1180086763643736064 (from your Sleeper league URL)"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Find this in your league URL: sleeper.com/leagues/<strong>your-league-id</strong>
                    </div>
                  </div>
                ) : formData.platform && availableLeagues.length > 0 ? (
                  <select 
                    value={formData.leagueId} 
                    onChange={(e) => handleLeagueSelect(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="">Choose a league...</option>
                    {availableLeagues.map(league => (
                      <option key={league.id} value={league.id}>
                        {league.name} ({league.sport}) - {league.teamCount} teams
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.leagueId}
                    onChange={(e) => updateFormField('leagueId', e.target.value)}
                    placeholder="Enter league ID..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
                {loading && <div className="text-xs text-gray-500">Loading league details...</div>}
                {errors.leagueId && <div className="text-sm text-red-500">{errors.leagueId}</div>}
                {leaguePreview && (
                  <div className="text-xs text-green-600">
                    ✓ Found: {leaguePreview.name} ({leaguePreview.teamCount} teams)
                  </div>
                )}
              </div>

              {/* Sport */}
              <div className="space-y-2">
                <label htmlFor="sport" className="text-sm font-medium">Sport *</label>
                <select 
                  value={formData.sport} 
                  onChange={(e) => updateFormField('sport', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!formData.platform}
                >
                  <option value="">Select sport...</option>
                  {validSports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
                {!formData.platform && <div className="text-xs text-gray-500">Select a platform first</div>}
                {formData.platform && validSports.length === 0 && <div className="text-xs text-red-500">No sports supported by selected platform</div>}
                {errors.sport && <div className="text-sm text-red-500">{errors.sport}</div>}
              </div>

              {/* League Type */}
              <div className="space-y-2">
                <label htmlFor="leagueType" className="text-sm font-medium">League Type *</label>
                <select 
                  value={formData.leagueType} 
                  onChange={(e) => updateFormField('leagueType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type...</option>
                  {LEAGUE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.leagueType && <div className="text-sm text-red-500">{errors.leagueType}</div>}
              </div>

              {/* Scoring Type */}
              <div className="space-y-2">
                <label htmlFor="scoring" className="text-sm font-medium">Scoring Type *</label>
                <select 
                  value={formData.scoring} 
                  onChange={(e) => updateFormField('scoring', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!formData.platform}
                >
                  <option value="">Select scoring...</option>
                  {validScoringTypes.map(type => (
                    <option key={type} value={type}>
                      {type} {type === 'Points' ? '- Stats converted to points' : '- Individual stat categories'}
                    </option>
                  ))}
                </select>
                {!formData.platform && <div className="text-xs text-gray-500">Select a platform first</div>}
                {formData.platform && validScoringTypes.length === 0 && <div className="text-xs text-red-500">No scoring types supported by selected platform</div>}
                {errors.scoring && <div className="text-sm text-red-500">{errors.scoring}</div>}
              </div>

              {/* Matchup Type */}
              <div className="space-y-2">
                <label htmlFor="matchup" className="text-sm font-medium">Matchup Format *</label>
                <select 
                  value={formData.matchup} 
                  onChange={(e) => updateFormField('matchup', e.target.value)}
                  disabled={!formData.scoring || !formData.platform}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Select format...</option>
                  {validMatchupTypes.map(type => (
                    <option key={type} value={type}>
                      {type} {type === 'H2H' ? '- Weekly matchups' : 
                             type === 'Roto' ? '- Season-long ranking' : 
                             '- Total points race'}
                    </option>
                  ))}
                </select>
                {!formData.platform && <div className="text-xs text-gray-500">Select a platform first</div>}
                {!formData.scoring && formData.platform && <div className="text-xs text-gray-500">Select scoring type first</div>}
                {formData.platform && formData.scoring && validMatchupTypes.length === 0 && <div className="text-xs text-red-500">No matchup formats supported by selected platform and scoring combination</div>}
                {errors.matchup && <div className="text-sm text-red-500">{errors.matchup}</div>}
              </div>

              {/* Draft Type */}
              <div className="space-y-2">
                <label htmlFor="draftType" className="text-sm font-medium">Draft Type *</label>
                <select 
                  value={formData.draftType} 
                  onChange={(e) => updateFormField('draftType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select draft type...</option>
                  {DRAFT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.draftType && <div className="text-sm text-red-500">{errors.draftType}</div>}
              </div>
            </div>

            {/* Right side - Dynamic prompts */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Advanced Settings</h3>
              
              {activePrompts.length === 0 && (
                <div className="text-sm text-muted-foreground italic">
                  Additional settings will appear based on your selections
                </div>
              )}

              {activePrompts.map(promptKey => {
                const prompt = promptRegistry[promptKey];
                
                return (
                  <div key={promptKey} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      {prompt.label}
                      {prompt.help && (
                        <div className="group relative">
                          <Info className="h-3 w-3 text-muted-foreground" />
                          <div className="absolute invisible group-hover:visible bg-popover text-popover-foreground text-xs p-2 rounded border shadow-md z-10 w-48 -top-2 left-4">
                            {prompt.help}
                          </div>
                        </div>
                      )}
                    </label>
                    
                    {prompt.control === 'toggle' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.settings[promptKey] || false}
                          onChange={(e) => updateSettingsField(promptKey, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm">{prompt.label}</span>
                      </div>
                    )}
                    
                    {prompt.control === 'number' && (
                      <input
                        type="number"
                        value={formData.settings[promptKey] || ''}
                        onChange={(e) => updateSettingsField(promptKey, parseInt(e.target.value) || 0)}
                        placeholder="Enter number..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                    
                    {prompt.control === 'select' && promptKey === 'teamDirection' && (
                      <select 
                        value={formData.settings[promptKey] || ''} 
                        onChange={(e) => updateSettingsField(promptKey, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select direction...</option>
                        {TEAM_DIRECTIONS.map(direction => (
                          <option key={direction} value={direction}>{direction}</option>
                        ))}
                      </select>
                    )}
                    
                    {prompt.control === 'multiselect' && promptKey === 'categories' && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {SPORT_CATEGORIES[formData.sport]?.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              className={`px-2 py-1 text-xs rounded border cursor-pointer ${
                                formData.settings.categories?.includes(cat) 
                                  ? 'bg-blue-500 text-white border-blue-500' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                const current = formData.settings.categories || [];
                                const updated = current.includes(cat)
                                  ? current.filter(c => c !== cat)
                                  : [...current, cat];
                                updateSettingsField('categories', updated);
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {prompt.control === 'multiselect' && promptKey === 'puntCategories' && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {(formData.settings.categories || []).map(cat => (
                            <button
                              key={cat}
                              type="button"
                              className={`px-2 py-1 text-xs rounded border cursor-pointer ${
                                formData.settings.puntCategories?.includes(cat) 
                                  ? 'bg-red-500 text-white border-red-500' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                const current = formData.settings.puntCategories || [];
                                const updated = current.includes(cat)
                                  ? current.filter(c => c !== cat)
                                  : [...current, cat];
                                updateSettingsField('puntCategories', updated);
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        {(!formData.settings.categories || formData.settings.categories.length === 0) && (
                          <div className="text-xs text-gray-500">
                            Select categories first to enable punt options
                          </div>
                        )}
                      </div>
                    )}
                    
                    {prompt.control === 'object' && promptKey === 'playoffSchedule' && (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs font-medium">Start Week</label>
                          <input
                            type="number"
                            value={formData.settings.playoffSchedule?.startWeek || ''}
                            onChange={(e) => updateSettingsField('playoffSchedule', {
                              ...formData.settings.playoffSchedule,
                              startWeek: parseInt(e.target.value) || 14
                            })}
                            className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">End Week</label>
                          <input
                            type="number"
                            value={formData.settings.playoffSchedule?.endWeek || ''}
                            onChange={(e) => updateSettingsField('playoffSchedule', {
                              ...formData.settings.playoffSchedule,
                              endWeek: parseInt(e.target.value) || 16
                            })}
                            className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Teams</label>
                          <input
                            type="number"
                            value={formData.settings.playoffSchedule?.teams || ''}
                            onChange={(e) => updateSettingsField('playoffSchedule', {
                              ...formData.settings.playoffSchedule,
                              teams: parseInt(e.target.value) || 6
                            })}
                            className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation errors */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="ml-3">
                  <div className="text-sm text-red-700">
                    Please fix the following errors:
                    <ul className="list-disc list-inside mt-1">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Action buttons */}
        <div className="flex w-full items-center justify-end gap-3 mt-6 pt-6 border-t border-stroke-soft-200">
          <Button.Root
            variant='neutral'
            mode='stroke'
            onClick={onCancel}
            className='flex-1'
          >
            Cancel
          </Button.Root>
          <Button.Root
            variant='primary'
            onClick={handleSubmit}
            disabled={loading}
            className='flex-1'
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Import League
          </Button.Root>
        </div>
      </div>
    </div>
  );
}