import { Popover, PopoverContent, PopoverTrigger } from '@/components/alignui/popover';
import { Root as TagRoot, Icon as TagIcon } from '@/components/alignui/tag';
import { TRAIT_METADATA } from '@/lib/utils/sportConfig';
import { Activity } from 'lucide-react';
import React from 'react';

export default function TraitTag({ traitId, className = "", showTooltip = true, size = "normal" }) {
  const trait = TRAIT_METADATA[traitId];
  
  // Fallback for unknown traits
  if (!trait) {
    console.warn(`Unknown trait ID: ${traitId}`);
    return (
      <TagRoot variant="stroke" className={`r ${className}`}>
        <TagIcon as={Activity} className="icon-xs" />
        <span className="font-medium">{traitId}</span>
      </TagRoot>
    );
  }
  
  const IconComponent = trait.icon;
  
  const tagElement = (
    <TagRoot variant="stroke" className={` ${className}`}>
      <TagIcon as={IconComponent} className="icon-xs" />
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