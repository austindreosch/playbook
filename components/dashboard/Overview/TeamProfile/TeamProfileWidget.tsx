'use client';

import * as React from 'react';
import { Users } from 'lucide-react';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Divider from '@/components/alignui/divider';
import TraitTagContainer from '@/components/common/TraitTagContainer';
import TeamPositionStrengthBar from '@/components/common/TeamPositionStrengthBar';
import TeamCategoryStrengthBar from '@/components/common/TeamCategoryStrengthBar';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface TeamProfileBlueprint {
  teamTraitIds: string[];        // SOURCE: useDashboardContext().getCurrentTeam().traits OR calculated team analysis trait IDs
  
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
  // Team trait IDs corresponding to the original team tags
  const teamTraitIds = [
    'heavy_punt',
    'contending', 
    'aging',
    'poor_playoff_schedule',
    'injured_team'
  ];

  return {
    sport: 'nba',
    teamTraitIds,
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
        <div className="flex-1 min-h-0 space-y-2">
          
          {/* Position Strength Bar */}
          <div className="flex-shrink-0">
            <TeamPositionStrengthBar team={blueprint.userTeam} />
          </div>

          <Divider.Root variant='line-spacing' className="pt-3" />

          {/* Category Strength Bar */}
          <div className="flex-shrink-0 pt-1 pb-2"  >
            <TeamCategoryStrengthBar team={blueprint.userTeam} />
          </div>

          {/* <Divider.Root variant='line-spacing' /> */}

          {/* Team Traits */}
          <div className="flex-shrink-0">
            <TraitTagContainer traitIds={blueprint.teamTraitIds} variant="wrap" />
          </div>
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}