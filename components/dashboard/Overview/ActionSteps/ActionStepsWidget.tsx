'use client';

import * as React from 'react';
import { Activity, ActivitySquare, Shuffle, UserPlus, Wrench, X } from 'lucide-react';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Button from '@/components/alignui/button';
import * as Badge from '@/components/alignui/badge';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface ActionStepsBlueprint {
  actionItems: Array<{                 // SOURCE: useDashboardContext().getCurrentTeam().actionSteps
    id: string;
    type: 'add' | 'fix' | 'trade' | 'drop' | 'claim';
    icon: React.ComponentType<any>;     // SOURCE: getActionIcon(type) [internal calculation]
    title: string;                      // Action type display name
    description: string;                // Detailed description of the action
    player?: {                          // Player involved in the action
      name: string;
      position?: string;
    };
    buttonText: string;                 // CTA button text
    buttonIcon: React.ComponentType<any>; // CTA button icon
    priority: 'high' | 'medium' | 'low'; // Action priority level
    actionUrl?: string;                 // Optional URL to navigate to
    onDismiss?: () => void;            // Optional dismiss handler
  }>;

  totalActions: number;                 // SOURCE: actionItems.length [internal calculation]
  highPriorityCount: number;           // SOURCE: actionItems.filter(priority === 'high').length [internal calculation]
}

interface ActionStepsWidgetProps extends React.ComponentPropsWithoutRef<typeof WidgetBox.Root> {
  blueprint?: ActionStepsBlueprint;
}

// ============================================================
// ===================== DATA COLLECTION ======================
// ============================================================

const generateActionStepsData = (): ActionStepsBlueprint => {
  const actionItems = [
    {
      id: 'action-1',
      type: 'add' as const,
      icon: UserPlus,
      title: 'Potential Add',
      description: 'A. Caruso (1.8 STL) was just dropped by Opponent Team and is available on your waiver wire.',
      player: {
        name: 'A. Caruso',
        position: 'PG'
      },
      buttonText: 'Go to Waivers',
      buttonIcon: Shuffle,
      priority: 'high' as const,
      actionUrl: '/waivers'
    },
    {
      id: 'action-2',
      type: 'fix' as const,
      icon: Wrench,
      title: 'Fix Lineup',
      description: 'Scottie Barnes is slated to play but is sitting on your bench.',
      player: {
        name: 'Scottie Barnes',
        position: 'SF'
      },
      buttonText: 'Go to Roster',
      buttonIcon: Shuffle,
      priority: 'medium' as const,
      actionUrl: '/roster'
    },
    {
      id: 'action-3',
      type: 'fix' as const,
      icon: Wrench,
      title: 'Fix Lineup',
      description: 'Alperen Sengun is slated to play but is sitting on your bench.',
      player: {
        name: 'Alperen Sengun',
        position: 'C'
      },
      buttonText: 'Go to Roster',
      buttonIcon: Shuffle,
      priority: 'medium' as const,
      actionUrl: '/roster'
    },
    {
      id: 'action-4',
      type: 'add' as const,
      icon: UserPlus,
      title: 'Potential Add',
      description: 'D. Green is trending up in minutes and available in 73% of leagues.',
      player: {
        name: 'D. Green',
        position: 'PF'
      },
      buttonText: 'Go to Waivers',
      buttonIcon: Shuffle,
      priority: 'low' as const,
      actionUrl: '/waivers'
    }
  ];

  const totalActions = actionItems.length;
  const highPriorityCount = actionItems.filter(item => item.priority === 'high').length;

  return {
    actionItems,
    totalActions,
    highPriorityCount
  };
};

// Helper Functions
const getActionTypeIcon = (type: string) => {
  switch (type) {
    case 'add':
      return UserPlus;
    case 'fix':
      return Wrench;
    case 'trade':
      return Shuffle;
    case 'drop':
      return X;
    case 'claim':
      return UserPlus;
    default:
      return Activity;
  }
};

const getActionTypeColor = (type: string) => {
  switch (type) {
    case 'add':
      return 'text-success-base';
    case 'fix':
      return 'text-warning-base';
    case 'trade':
      return 'text-primary-base';
    case 'drop':
      return 'text-error-base';
    case 'claim':
      return 'text-success-base';
    default:
      return 'text-text-soft-400';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-error-lighter border-l-error-base';
    case 'medium':
      return 'bg-warning-lighter border-l-warning-base';
    case 'low':
      return 'bg-bg-weak-50 border-l-stroke-soft-200';
    default:
      return 'bg-bg-weak-50 border-l-stroke-soft-200';
  }
};

// ============================================================
// =================== COMPONENT DEFINITION ==================
// ============================================================

export default function ActionStepsWidget({
  blueprint: providedBlueprint,
  ...rest
}: ActionStepsWidgetProps) {
  const { getCurrentTeam } = useDashboardContext();
  
  // Use provided blueprint or generate dummy data
  const blueprint = providedBlueprint || generateActionStepsData();

  const handleActionClick = (actionUrl?: string) => {
    if (actionUrl) {
      // In a real implementation, you would navigate to the URL
      console.log(`Navigating to: ${actionUrl}`);
    }
  };

  const handleDismissAction = (actionId: string) => {
    // In a real implementation, you would remove the action from the list
    console.log(`Dismissing action: ${actionId}`);
  };

  return (
    <WidgetBox.Root className="h-full" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={ActivitySquare} />
        Action Steps
      </WidgetBox.Header>

      <WidgetBox.Content>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5">
          {blueprint.actionItems.map((item) => {
            const Icon = item.icon;
            const ButtonIcon = item.buttonIcon;
            const priorityColor = getPriorityColor(item.priority);
            const actionColor = getActionTypeColor(item.type);

            return (
              <div 
                key={item.id} 
                className={`rounded-md flex-shrink-0 border border-stroke-soft-100`}
              >
                {/* Action header */}
                <div className="flex items-center justify-between h-9 mb-2 bg-bg-weak-10 rounded-t-md p-1 pr-1.5 pl-3 border-b border-stroke-soft-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`hw-icon-sm flex-shrink-0 text-gray-450`} strokeWidth={2} />
                    <h4 className="text-label-lg font-semibold text-gray-450 truncate">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button.Root
                        variant="primary"
                        size="small"
                        className="w-32 h-6 border border-blue-600"
                        onClick={() => handleActionClick(item.actionUrl)}
                      >
                      <ButtonIcon className="hw-icon-xs flex-shrink-0" strokeWidth={2} />
                      <span className="truncate text-label-md">{item.buttonText}</span>
                    </Button.Root>
                    <Button.Root
                      variant="secondary"
                      size="small"
                      onClick={() => handleDismissAction(item.id)}
                      className="flex-shrink-0 border border-stroke-soft-150 hover:bg-gray-100 rounded-lg h-6 w-6 p-0"
                    >
                      <X className="hw-icon-xs text-gray-400" strokeWidth={2} />
                    </Button.Root>
                  </div>
                </div>

                {/* Description */}
                <p className="text-paragraph-md text-text-soft-400 mb-3 px-2 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Action button */}
                {/* <Button.Root
                  variant="primary"
                  size="small"
                  className="w-full"
                  onClick={() => handleActionClick(item.actionUrl)}
                >
                  <ButtonIcon className="hw-icon-xs flex-shrink-0" strokeWidth={2} />
                  <span className="truncate">{item.buttonText}</span>
                </Button.Root> */}
              </div>
            );
          })}

          {/* Empty state */}
          {blueprint.actionItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ActivitySquare className="hw-icon-lg text-text-disabled-300 mb-3" strokeWidth={1.5} />
              <p className="text-label-base text-text-disabled-300 mb-1">No action items</p>
              <p className="text-paragraph-sm text-text-disabled-300">
                All caught up! Check back later for new recommendations.
              </p>
            </div>
          )}
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}