'use client';

import * as React from 'react';
import { Users, AlertTriangle, Clock, Heart, Shield, Trophy } from 'lucide-react';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Divider from '@/components/alignui/divider';
import TraitTag from '@/components/common/TraitTag';
import TeamPositionStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamPositionStrengthBar';
import TeamCategoryStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamCategoryStrengthBar';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface TeamTag {
  icon: React.ComponentType<any>; // SOURCE: Lucide icon component for the tag
  label: string;                 // SOURCE: display text for the tag
}

interface TeamProfileBlueprint {
  teamTags: TeamTag[];           // SOURCE: useDashboardContext().getCurrentTeam().traits OR calculated team analysis tags
  
  userTeam: {                    // SOURCE: useDashboardContext().getCurrentTeam()
    teamId: string;
    teamName: string;
    ownerName: string;
  };
  
  sport: string;                 // SOURCE: useDashboardContext().getCurrentLeague().sport
}

interface TeamProfileWidgetProps extends React.ComponentPropsWithoutRef<typeof WidgetBox.Root> {
  blueprint?: TeamProfileBlueprint;
}

// ============================================================
// ===================== DATA COLLECTION ======================
// ============================================================

const generateDummyTeamProfileData = (): TeamProfileBlueprint => {
  // Team tags from original design - exact icons and labels
  const teamTags: TeamTag[] = [
    { icon: Shield, label: 'Heavy Punt' },
    { icon: Trophy, label: 'Contending' },
    { icon: Clock, label: 'Aging' },
    { icon: AlertTriangle, label: 'Poor Playoff Schedule' },
    { icon: Heart, label: 'Injured Team' }
  ];

  return {
    sport: 'nba',
    teamTags,
    userTeam: {
      teamId: 'team_user_123',
      teamName: 'Dynasty Dreams',
      ownerName: 'Alex Rodriguez'
    }
  };
};

// Helper Functions - removed since we're using actual components

// ============================================================
// =================== COMPONENT DEFINITION ==================
// ============================================================

export default function TeamProfileWidget({
  blueprint: providedBlueprint,
  ...rest
}: TeamProfileWidgetProps) {
  const { getCurrentLeague, getCurrentTeam } = useDashboardContext();
  
  // Use provided blueprint or generate dummy data
  const blueprint = providedBlueprint || generateDummyTeamProfileData();

  return (
    <WidgetBox.Root className="h-full" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Users} />
        Team Profile
      </WidgetBox.Header>

      <WidgetBox.Content>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
          
          {/* Position Strength Bar */}
          <div className="flex-shrink-0">
            <TeamPositionStrengthBar team={blueprint.userTeam} />
          </div>

          {/* Category Strength Bar */}
          <div className="flex-shrink-0">
            <TeamCategoryStrengthBar team={blueprint.userTeam} />
          </div>

          <Divider.Root variant='line-spacing' />

          {/* Team Tags - Simple flex layout */}
          <div className="flex-shrink-0">
            <div className="space-y-1.5">
              <div className="flex gap-1 flex-wrap">
                {blueprint.teamTags.slice(0, 3).map((tag, index) => {
                  const Icon = tag.icon;
                  return (
                    <div key={index} className="flex items-center gap-1 px-2 py-1 border border-stroke-soft-200 rounded-full bg-bg-white-0 flex-1 min-w-0">
                      <Icon className="w-3 h-3 text-text-sub-600 flex-shrink-0" strokeWidth={2} />
                      <span className="text-xs text-text-sub-600 truncate">{tag.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1 flex-wrap">
                {blueprint.teamTags.slice(3).map((tag, index) => {
                  const Icon = tag.icon;
                  return (
                    <div key={index + 3} className="flex items-center gap-1 px-2 py-1 border border-stroke-soft-200 rounded-full bg-bg-white-0 flex-1 min-w-0">
                      <Icon className="w-3 h-3 text-text-sub-600 flex-shrink-0" strokeWidth={2} />
                      <span className="text-xs text-text-sub-600 truncate">{tag.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}