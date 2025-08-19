'use client';

import { CheckCircle } from 'lucide-react';
import { 
  Provider as TooltipProvider, 
  Root as TooltipRoot, 
  Trigger as TooltipTrigger, 
  Content as TooltipContent 
} from '@/components/alignui/tooltip';

interface SyncIndicatorProps {
  /** Whether this field is synced from API */
  synced: boolean;
  /** Platform name for the tooltip */
  platform?: string;
  /** Custom tooltip content */
  customTooltip?: string;
  /** Size of the indicator */
  size?: 'sm' | 'md' | 'lg';
  /** Custom styling class */
  className?: string;
}

/**
 * Green checkmark indicator showing that a field has been synced from league API data
 * Includes tooltip explaining the sync status
 */
export default function SyncIndicator({ 
  synced, 
  platform,
  customTooltip,
  size = 'sm',
  className = ''
}: SyncIndicatorProps) {
  // Don't render anything if not synced
  if (!synced) return null;

  // Determine icon size based on size prop
  const iconSizeClass = {
    sm: 'hw-icon-xs',
    md: 'hw-icon',
    lg: 'hw-icon-lg'
  }[size];

  // Create tooltip content
  const tooltipContent = customTooltip || 
    `This info has been synced from your ${platform ? platform + ' ' : ''}league data`;

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <CheckCircle 
            className={`${iconSizeClass} text-green-600 ml-1 flex-shrink-0 ${className}`}
            aria-label="Synced from API"
          />
        </TooltipTrigger>
        <TooltipContent size="small">
          {tooltipContent}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

/**
 * Variant for use in form field labels
 * Optimized for inline use with label text
 */
export function SyncIndicatorInline({ synced, platform, className = '' }: Pick<SyncIndicatorProps, 'synced' | 'platform' | 'className'>) {
  if (!synced) return null;
  
  return (
    <SyncIndicator
      synced={synced}
      platform={platform}
      size="sm"
      className={`inline-block align-middle ${className}`}
    />
  );
}

/**
 * Badge variant showing sync status with text
 * Good for showing multiple synced fields
 */
interface SyncBadgeProps {
  synced: boolean;
  platform?: string;
  text?: string;
  variant?: 'success' | 'info';
}

export function SyncBadge({ synced, platform, text = 'Synced', variant = 'success' }: SyncBadgeProps) {
  if (!synced) return null;

  const variantClasses = {
    success: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200'
  };

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-badge border ${variantClasses[variant]}`}>
            <CheckCircle className="hw-icon-2xs" />
            {text}
          </div>
        </TooltipTrigger>
        <TooltipContent size="small">
          This info has been synced from your {platform ? platform + ' ' : ''}league data
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}