import { trackUserAction } from '@/lib/gtag';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { EllipsisVertical } from 'lucide-react';

export default function DashboardTabs() {
  // =================================================================
  // CONTEXT STORE
  // =================================================================
  // ---- INCOMING DATA ----
  // Get current tab state and available tabs from the dashboard context store
  const currentTab = useDashboardContext((state) => state.currentTab);
  const availableTabs = useDashboardContext((state) => state.availableTabs);
  // ---- OUTGOING DATA ----
  // Get setter function to update the current tab in the store
  const setCurrentTab = useDashboardContext((state) => state.setCurrentTab);

  const handleClick = (id) => {
    // Track the tab click event
    trackUserAction('dashboard_tab_click', `${id}_tab`);
    
    setCurrentTab(id);
  };

  return (
    <div className="h-9 w-full flex items-center rounded-t-lg gap-0.5 overflow-hidden border-pb_darkgray border-b-0 bg-pb_darkgray px-0.5">
      {availableTabs.map(({ id, label, enabled }) => (
        <button
          key={id}
          disabled={!enabled}
          className={`
            flex-1 flex items-center justify-center text-xs tracking-wider leading-relaxed uppercase focus:outline-none select-none transition-colors
                          ${currentTab === id
                ? 'h-full bg-pb_paperwhite text-pb_darkgray font-semibold  border border-pb_darkgray border-b-0 rounded-t-lg mt-1'
                : 'h-full text-white hover:bg-pb_mddarkgray font-semibold rounded-md mt-[5px] '}
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
          onClick={() => handleClick(id)}
        >
          {/* ---- DISPLAY DATA ---- */}
          {/* Display tab label */}
          {label}
        </button>
      ))}
    </div>
  );
}

// Dummy version for "In Development" dashboard
export function DummyDashboardTabs({ currentTab, onTabClick }) {
  const dummyTabs = [
    { id: 'overview', label: 'Overview', enabled: true },
    { id: 'roster', label: 'Roster', enabled: true },
    { id: 'trades', label: 'Trades', enabled: true },
    { id: 'scouting', label: 'Scouting', enabled: false },
    { id: 'waiver', label: 'Waiver', enabled: false },
    { id: 'trends', label: 'Trends', enabled: false },
  ];

  // Mobile: Show only first 3 tabs + "..." for others
  const mainTabs = dummyTabs.slice(0, 3);

  const handleClick = (id, enabled) => {
    if (enabled && onTabClick) {
      // Track the tab click event (development version)
      trackUserAction('dashboard_tab_click_preview', `${id}_tab`);
      
      onTabClick(id);
    }
  };

  return (
    <div className="h-9 w-full flex items-center rounded-t-lg gap-0.5 overflow-hidden border-pb_darkgray border-b-0 bg-pb_darkgray px-0.5">
      {/* Desktop: Show all tabs */}
      <div className="hidden md:contents">
        {dummyTabs.map(({ id, label, enabled }) => (
          <button
            key={id}
            disabled={!enabled}
            onClick={() => handleClick(id, enabled)}
            className={`
              flex-1 flex items-center justify-center text-xs tracking-wider leading-relaxed uppercase focus:outline-none select-none transition-colors
              ${currentTab === id
                ? 'h-full bg-pb_paperwhite text-pb_darkgray font-semibold border border-pb_darkgray border-b-0 rounded-t-lg mt-1'
                : 'h-full text-white hover:bg-pb_mddarkgray font-semibold rounded-md mt-[5px]'}
              ${enabled ? 'cursor-pointer' : 'disabled:opacity-70 disabled:cursor-not-allowed'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mobile: Show main 3 tabs + "..." */}
      <div className="md:hidden contents">
        {mainTabs.map(({ id, label, enabled }) => (
          <button
            key={id}
            disabled={!enabled}
            onClick={() => handleClick(id, enabled)}
            className={`
              flex-1 flex items-center justify-center text-xs tracking-wider leading-relaxed uppercase focus:outline-none select-none transition-colors
              ${currentTab === id
                ? 'h-full bg-pb_paperwhite text-pb_darkgray font-semibold border border-pb_darkgray border-b-0 rounded-t-lg mt-1'
                : 'h-full text-white hover:bg-pb_mddarkgray font-semibold rounded-md mt-[5px]'}
              ${enabled ? 'cursor-pointer' : 'disabled:opacity-70 disabled:cursor-not-allowed'}
            `}
          >
            {label}
          </button>
        ))}
        
        {/* "⋮" button for other tabs */}
        <button
          disabled={true}
          className="w-12 flex items-center justify-center text-sm font-semibold tracking-wider uppercase
            focus:outline-none select-none transition-colors
            h-full text-white/50 rounded-md mt-1.5 mx-0.5 cursor-not-allowed"
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}