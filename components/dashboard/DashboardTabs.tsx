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

export default function DashboardTabs({ maxWidth }: { maxWidth?: number | string }) {
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
    <div className="w-fit" style={maxWidth !== undefined ? { maxWidth } : undefined}>
      <SegmentedControl.Root value={currentTab} onValueChange={handleValueChange}>
        <SegmentedControl.List className="w-auto inline-grid gap-0.5 p-1">
          {availableTabs.map(({ id, label, enabled }) => {
            const IconComponent = tabIcons[id as keyof typeof tabIcons];
            return (
              <SegmentedControl.Trigger key={id} value={id} disabled={!enabled}>
                {IconComponent && <IconComponent className="hw-icon-xs shrink-0" />}
                <span className="text-label-lg">{label}</span>
              </SegmentedControl.Trigger>
            );
          })}
        </SegmentedControl.List>
      </SegmentedControl.Root>
    </div>
  );
}


