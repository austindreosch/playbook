import useDashboardContext from '@/stores/dashboard/useDashboardContext';

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
    setCurrentTab(id);
  };

  return (
    <div className="h-12 w-full flex items-center rounded-t-lg gap-0.5 overflow-hidden border border-pb_darkgray border-b-0 bg-pb_darkgray px-0.5">
      {availableTabs.map(({ id, label, enabled }) => (
        <button
          key={id}
          disabled={!enabled}
          className={`
            flex-1 flex items-center justify-center text-sm font-semibold tracking-wider uppercase
            focus:outline-none select-none transition-colors
            ${currentTab === id
              ? 'h-full bg-pb_paperwhite text-pb_darkgray border mt-1 border-pb_darkgray border-b-0 rounded-t-lg'
              : 'h-full text-white hover:bg-pb_mddarkgray rounded-md mt-1.5 mx-0.5'}
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