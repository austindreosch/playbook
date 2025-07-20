import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TRAIT_METADATA } from '@/lib/utils/sportConfig';
import { Activity } from 'lucide-react';
import React from 'react';

// Removed TRAIT_DEFINITIONS - now using TRAIT_METADATA from sportConfig.js

export default function TraitTag({ traitId, className = "", showTooltip = true }) {
  const trait = TRAIT_METADATA[traitId]; // Use TRAIT_METADATA
  
  // Fallback for unknown traits
  if (!trait) {
    console.warn(`Unknown trait ID: ${traitId}`);
    return (
      <div className={`flex items-center px-2 text-2xs text-pb_textgray rounded border border-pb_lightgray ${className}`}>
        <Activity className="w-icon-2xs h-icon-2xs mr-1.5" /> {/* Use smaller icon and adjust margin */}
        <span className="font-medium">{traitId}</span> {/* Removed leading-loose class */}
      </div>
    );
  }
  
  const IconComponent = trait.icon;
  
  const tagElement = (
    <div className={`flex items-center px-2 h-6 text-2xs text-pb_mddarkgray rounded border border-pb_lightgray ${className}`}>
      <IconComponent className="w-icon-2xs h-icon-2xs mr-1.5" /> {/* Use smaller icon and adjust margin */}
      <span className="">{trait.label}</span>
    </div>
  );
  
  // Implement tooltip using Popover based on showTooltip prop
  if (showTooltip && trait.tooltip) {
    return (
      <Popover>
        <PopoverTrigger asChild>{tagElement}</PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <p className="text-xs text-pb_darkgray">{trait.tooltip}</p>
        </PopoverContent>
      </Popover>
    );
  }
  
  return tagElement;
} 