'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/alignui/button';
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
  { id: 'fantrax', name: 'Fantrax', available: true },
  { id: 'sleeper', name: 'Sleeper', available: true },
  { id: 'yahoo', name: 'Yahoo', available: true },
  { id: 'espn', name: 'ESPN', available: true }
];

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

  // Get valid matchup types based on scoring selection
  const validMatchupTypes = useMemo(() => {
    return validationRules.getValidMatchupTypes(formData.scoring);
  }, [formData.scoring]);

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

    // Fantrax requires manual league ID entry, so skip fetching leagues list
    if (platform === 'fantrax') {
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
                >
                  <option value="">Select sport...</option>
                  {SPORTS.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
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
                >
                  <option value="">Select scoring...</option>
                  {SCORING_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type} {type === 'Points' ? '- Stats converted to points' : '- Individual stat categories'}
                    </option>
                  ))}
                </select>
                {errors.scoring && <div className="text-sm text-red-500">{errors.scoring}</div>}
              </div>

              {/* Matchup Type */}
              <div className="space-y-2">
                <label htmlFor="matchup" className="text-sm font-medium">Matchup Format *</label>
                <select 
                  value={formData.matchup} 
                  onChange={(e) => updateFormField('matchup', e.target.value)}
                  disabled={!formData.scoring}
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
          <div className="flex gap-2 mt-6">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="ml-auto">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Import League
            </Button>
        </div>
      </div>
    </div>
  );
}