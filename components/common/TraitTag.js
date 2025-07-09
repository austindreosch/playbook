import { Activity, Flame, Heart, Scale, Shield, Star, Target, Timer, TrendingUp, Zap } from 'lucide-react';
import React from 'react';

// ╔════════════════════════════════════════════════════════════════╗
// ║                    🏷️ TRAIT DEFINITIONS 🏷️                   ║
// ║              DO NOT TOUCH STRUCTURE - ONLY VALUES              ║
// ║                                                                ║
// ║ This section defines all available traits across sports.       ║
// ║ Each trait has an ID, display name, icon, and description.     ║
// ║ Add new traits here as the system expands.                     ║
// ╚════════════════════════════════════════════════════════════════╝
const TRAIT_DEFINITIONS = {
  // Performance Traits
  'star': {
    name: 'Star',
    icon: Star,
    description: 'Elite player with consistent high-level performance',
    category: 'performance'
  },
  'hot_streak': {
    name: 'Hot Streak', 
    icon: Flame,
    description: 'Currently performing above season averages',
    category: 'performance'
  },
  'usage_spike': {
    name: 'Usage Spike',
    icon: Activity,
    description: 'Recent increase in team usage and opportunity',
    category: 'performance'
  },
  
  // Playstyle Traits
  'balanced': {
    name: 'Balanced',
    icon: Scale,
    description: 'Well-rounded statistical contribution across categories',
    category: 'playstyle'
  },
  'elite_assists': {
    name: 'Elite Positional Assists',
    icon: Zap,
    description: 'Exceptional assist production for their position',
    category: 'playstyle'
  },
  
  // TODO: Add more traits as system expands
  // 'clutch': { name: 'Clutch', icon: Target, description: 'Performs well in high-pressure situations', category: 'performance' },
  // 'injury_prone': { name: 'Injury Prone', icon: Heart, description: 'History of frequent injuries', category: 'health' },
  // 'rookie': { name: 'Rookie', icon: Timer, description: 'First-year player with upside potential', category: 'experience' },
};
// ══════════════════════════════════════════════════════════════
//      🚫 DO NOT MODIFY THIS TRAIT STRUCTURE 🚫
// ══════════════════════════════════════════════════════════════

export default function TraitTag({ traitId, className = "", showTooltip = true }) {
  const trait = TRAIT_DEFINITIONS[traitId];
  
  // Fallback for unknown traits
  if (!trait) {
    console.warn(`Unknown trait ID: ${traitId}`);
    return (
      <div className={`flex items-center px-2 text-2xs text-pb_textgray rounded border border-pb_lightgray ${className}`}>
        <Activity className="w-icon-xs h-icon-xs mr-3" />
        <span className="font-medium leading-loose">{traitId}</span>
      </div>
    );
  }
  
  const IconComponent = trait.icon;
  
  const tagElement = (
    <div className={`flex items-center px-2 h-6    text-2xs text-pb_textgray rounded border border-pb_lightgray ${className}`}>
      <IconComponent className="w-icon-xs h-icon-xs mr-1" />
      <span className="font-medium">{trait.name}</span>
    </div>
  );
  
  // TODO: Add tooltip implementation when needed
  // For now, just return the tag element
  return tagElement;
} 