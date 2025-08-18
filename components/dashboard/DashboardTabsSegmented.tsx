'use client';

import * as React from 'react';
import { trackUserAction } from '@/lib/gtag';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Search,
  FileText,
  TrendingUp,
  Swords,
} from 'lucide-react';

import * as SegmentedControl from '@/components/alignui/ui/segmented-control';

// Custom color configuration for dashboard tabs
const dashboardTabsColors = {
  text: {
    inactive: 'text-black',                     // Inactive tab text color
    active: 'text-black',                       // Active tab text color
    disabled: 'text-orange-700',               // Disabled tab text color
    disabledActive: 'text-black'               // Disabled but active tab text color
  },
  background: {
    hover: 'hover:bg-orange-25',               // Tab hover background
    active: 'bg-orange-500',                   // Active tab background (floating background)
    activeHover: 'data-[state=active]:hover:bg-orange-550', // Active tab hover background
    disabledHover: 'disabled:hover:bg-orange-25', // Disabled tab hover background
    disabledActive: 'bg-orange-400'            // Disabled but active tab background (floating background)
  },
  container: {
    background: 'bg-orange-600',               // Container background
    floatingBg: 'bg-orange-500'                // Floating background
  },
  separator: {
    from: 'after:from-transparent',            // Gradient start (transparent)
    via: 'after:via-orange-700',               // Gradient middle color
    to: 'after:to-transparent'                 // Gradient end (transparent)
  }
} as const;

const tabIcons = {
  overview: LayoutDashboard,
  roster: Users,
  trades: ArrowLeftRight,
  scouting: Search,
  waiver: FileText,
  trends: TrendingUp,
  matchups: Swords,
} as const;

export default function DashboardTabsSegmented({ maxWidth }: { maxWidth?: number | string }) {
  const currentTab = useDashboardContext((state) => state.currentTab);
  const availableTabs = useDashboardContext((state) => state.availableTabs);
  const setCurrentTab = useDashboardContext((state) => state.setCurrentTab);

  const handleValueChange = React.useCallback(
    (value: string) => {
      // Track the tab click event
      trackUserAction('dashboard_tab_click', `${value}_tab`);
      setCurrentTab(value);
    },
    [setCurrentTab],
  );

  return (
    <div className="w-full" style={maxWidth !== undefined ? { maxWidth } : undefined}>
      <SegmentedControl.Root value={currentTab} onValueChange={handleValueChange} className="w-full">
        <SegmentedControl.List
          activeValue={currentTab}
          colorConfig={dashboardTabsColors}
          className="ring-1 ring-inset ring-orange-700"
          floatingBgClassName="ring-1 ring-inset ring-orange-700"
        >
          {availableTabs.map(({ id, label, enabled }) => {
            const IconComponent = tabIcons[id as keyof typeof tabIcons];
            return (
              <SegmentedControl.Trigger
                key={id}
                value={id}
                disabled={!enabled}
                className="transition-colors font-bold data-[state=active]:font-bold"
              >
                {IconComponent && <IconComponent className="hw-icon-xs shrink- mr-0.5 mb-[1px]" />}
                <span className="text-label-md tracking-wide font-black">{label}</span>
              </SegmentedControl.Trigger>
            );
          })}
        </SegmentedControl.List>
      </SegmentedControl.Root>
    </div>
  );
}


