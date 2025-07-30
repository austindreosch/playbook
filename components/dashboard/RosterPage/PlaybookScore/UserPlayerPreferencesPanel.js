import { Root as SegmentedControlRoot, List as SegmentedControlList, Trigger as SegmentedControlTrigger } from '@/components/alignui/segmented-control';
import { GitCommitHorizontal, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as Button from '@/components/alignui/button';

function UserPlayerPreferencesPanel({ scoreData, className = "" }) {
  const [isClient, setIsClient] = useState(false);
  
  // Individual state for each preference type
  const [favorPreference, setFavorPreference] = useState("Prefer");
  const [prospectPreference, setProspectPreference] = useState("Faith");
  const [injuriesPreference, setInjuriesPreference] = useState("Ironman");
  const [globalFavorPreference, setGlobalFavorPreference] = useState("Prefer");

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavor = localStorage.getItem('userPreference_favor');
      const savedProspect = localStorage.getItem('userPreference_prospect');
      const savedInjuries = localStorage.getItem('userPreference_injuries');
      const savedGlobalFavor = localStorage.getItem('userPreference_globalFavor');

      if (savedFavor) setFavorPreference(savedFavor);
      if (savedProspect) setProspectPreference(savedProspect);
      if (savedInjuries) setInjuriesPreference(savedInjuries);
      if (savedGlobalFavor) setGlobalFavorPreference(savedGlobalFavor);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreference_favor', favorPreference);
    }
  }, [favorPreference]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreference_prospect', prospectPreference);
    }
  }, [prospectPreference]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreference_injuries', injuriesPreference);
    }
  }, [injuriesPreference]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreference_globalFavor', globalFavorPreference);
    }
  }, [globalFavorPreference]);

  const handlePreferenceChange = (preferenceType, value) => {
    switch (preferenceType) {
      case 'favor':
        setFavorPreference(value);
        break;
      case 'prospect':
        setProspectPreference(value);
        break;
      case 'injuries':
        setInjuriesPreference(value);
        break;
      case 'globalFavor':
        setGlobalFavorPreference(value);
        break;
      default:
        console.warn(`Unknown preference type: ${preferenceType}`);
    }
  };

  // Get current preference value based on metric type
  const getCurrentPreference = (metricLabel) => {
    switch (metricLabel.toLowerCase()) {
      case 'favor':
        return favorPreference;
      case 'prospect':
        return prospectPreference;
      case 'injuries':
        return injuriesPreference;
      case 'global favor':
        return globalFavorPreference;
      default:
        return "Prefer"; // fallback
    }
  };

  // Get preference type for localStorage key
  const getPreferenceType = (metricLabel) => {
    switch (metricLabel.toLowerCase()) {
      case 'favor':
        return 'favor';
      case 'prospect':
        return 'prospect';
      case 'injuries':
        return 'injuries';
      case 'global favor':
        return 'globalFavor';
      default:
        return 'favor'; // fallback
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pure controls UI using AlignUI SegmentedControl
  const PreferencesControls = () => (
    <div className={`space-y-1`}>
      {scoreData.metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        const currentValue = getCurrentPreference(metric.label);
        const preferenceType = getPreferenceType(metric.label);
        
        return (
          <div key={`metric-${metric.label}-${index}`} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <IconComponent className="icon-xs text-pb_darkgray" />
              <span className="text-2xs text-pb_darkgray font-medium">{metric.label}</span>
            </div>
            <SegmentedControlRoot 
              key={`control-${metric.label}-${index}`}
              value={currentValue} 
              onValueChange={(value) => handlePreferenceChange(preferenceType, value)}
              className="flex-shrink-0"
            >
              <SegmentedControlList className="w-48">
                {metric.options.map((option, buttonIndex) => (
                  <SegmentedControlTrigger
                    key={`${metric.label}-${buttonIndex}-${option}`}
                    value={option}
                    className="text-2xs font-medium flex-1 flex items-center justify-center"
                  >
                    {option || <GitCommitHorizontal className="icon-xs text-pb_textlightestgray" />}
                  </SegmentedControlTrigger>
                ))}
              </SegmentedControlList>
            </SegmentedControlRoot>
          </div>
        );
      })}
    </div>
  );

  // Don't render anything until client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Always show controls for now - we'll add conditional logic back once this works */}
      <div className={`block ${className}`}>
        <div className="flex-shrink-0 mt-0">
          <PreferencesControls />
        </div>
      </div>
      {/* Temporarily hide button completely */}
      <div className={`hidden flex-shrink-0 flex justify-center w-full ${className}`}>
        <Button.Root variant='neutral' mode='stroke' size='xsmall' className='w-full flex items-center gap-2 justify-center'>
          <Search className='icon-xs' />
          <span className='text-label-m'>Preferences Panel</span>
        </Button.Root>
      </div>
    </>
  );
}

export default UserPlayerPreferencesPanel; 