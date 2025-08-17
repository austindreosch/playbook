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
          className="bg-orange-600 ring-1 ring-inset ring-orange-700"
          floatingBgClassName="!bg-black !text-white "
        >
          {availableTabs.map(({ id, label, enabled }) => {
            const IconComponent = tabIcons[id as keyof typeof tabIcons];
            return (
              <SegmentedControl.Trigger
                key={id}
                value={id}
                disabled={!enabled}
                className="text-black disabled:text-orange-700 transition-colors data-[state=active]:!text-white data-[state=active]:font-bold data-[state=active]:hover:!bg-orange-850"
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


