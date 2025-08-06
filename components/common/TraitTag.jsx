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
      <TagRoot variant="trait" className={`flex items-center gap-3 ${className}`}>
        <TagIcon as={Activity} className="hw-icon-xs" />
        <span className="text-paragraph-md ">{traitId}</span>
      </TagRoot>
    );
  }
  
  const IconComponent = trait.icon;
  
  const tagElement = (
    <TagRoot variant="trait" className={`flex items-center gap-3 ${className}`}>
      <TagIcon as={IconComponent} className="hw-icon-xs" />
      <span className="text-paragraph-md">{trait.label}</span>
    </TagRoot>
  );
  
  // Implement tooltip using Popover based on showTooltip prop
  if (showTooltip && trait.tooltip) {
    return (
      <Popover>
        <PopoverTrigger asChild>{tagElement}</PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <p className="text-paragraph-md text-black">{trait.tooltip}</p>
        </PopoverContent>
      </Popover>
    );
  }
  
  return tagElement;
} 