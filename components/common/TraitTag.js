import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TRAIT_METADATA } from '@/lib/utils/sportConfig';
import { Activity } from 'lucide-react';
import React from 'react';

// Removed TRAIT_DEFINITIONS - now using TRAIT_METADATA from sportConfig.js

export default function TraitTag({ traitId, className = "", showTooltip = true, size = "normal" }) {
  const trait = TRAIT_METADATA[traitId]; // Use TRAIT_METADATA
  
  // Fallback for unknown traits
  if (!trait) {
    console.warn(`Unknown trait ID: ${traitId}`);
    // Size variants for fallback too
    const sizeClasses = size === "small" 
      ? "px-1.5 h-5 text-3xs" 
      : "px-2 h-6 text-2xs";
      
    const iconClasses = size === "small"
      ? "w-3 h-3 mr-1"
      : "w-icon-2xs h-icon-2xs mr-1.5";
      
    return (
      <div className={`flex items-center ${sizeClasses} text-pb_textgray rounded border border-pb_lightgray ${className}`}>
        <Activity className={iconClasses} />
        <span className="font-medium">{traitId}</span>
      </div>
    );
  }
  
  const IconComponent = trait.icon;
  
  // Size variants
  const sizeClasses = size === "small" 
    ? "px-1.5 h-5 text-3xs" 
    : "px-2 h-6 text-2xs";
    
  const iconClasses = size === "small"
    ? "w-3 h-3 mr-1"
    : "w-icon-2xs h-icon-2xs mr-1.5";
  
  const tagElement = (
    <div className={`flex items-center ${sizeClasses} text-pb_mddarkgray rounded border border-pb_lightgray ${className}`}>
      <IconComponent className={iconClasses} />
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