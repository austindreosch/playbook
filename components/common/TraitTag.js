import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Root as TagRoot, Icon as TagIcon } from '@/components/ui/tag';
import { TRAIT_METADATA } from '@/lib/utils/sportConfig';
import { Activity } from 'lucide-react';
import React from 'react';

export default function TraitTag({ traitId, className = "", showTooltip = true, size = "normal" }) {
  const trait = TRAIT_METADATA[traitId];
  
  // Fallback for unknown traits
  if (!trait) {
    console.warn(`Unknown trait ID: ${traitId}`);
    return (
      <TagRoot 
        variant="stroke" 
        className={`${size === "small" ? "h-5 text-3xs" : "h-6 text-xs"} ${className}`}
      >
        <TagIcon as={Activity} className="size-3" />
        <span className="font-medium">{traitId}</span>
      </TagRoot>
    );
  }
  
  const IconComponent = trait.icon;
  
  const tagElement = (
    <TagRoot 
      variant="stroke" 
      className={`${size === "small" ? "h-5 text-3xs" : "h-6 text-xs"} ${className}`}
    >
      <TagIcon as={IconComponent} className="size-3" />
      <span>{trait.label}</span>
    </TagRoot>
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