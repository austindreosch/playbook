import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Notebook } from 'lucide-react';

export default function AllLeaguesButton({ className = "" }) {
  // =================================================================
  // CONTEXT STORE
  // =================================================================
  // ---- INCOMING DATA ----
  // Get current view state from the dashboard context store
  const currentView = useDashboardContext((state) => state.currentView);
  // ---- OUTGOING DATA ----
  // Get action to switch to All Leagues view
  const setAllLeaguesView = useDashboardContext((state) => state.setAllLeaguesView);

  const isAllLeaguesView = currentView === 'allLeagues';

  const handleClick = () => {
    setAllLeaguesView();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-between px-3 rounded-md border shadow-sm select-none transition-colors duration-200 ${
        isAllLeaguesView 
          ? 'border-stroke-soft-200 bg-stroke-soft-50 hover:bg-stroke-soft-200 hover:border-text-sub-600' 
          : 'border-stroke-soft-200 bg-white hover:bg-stroke-soft-50'
      } ${className}`.trim()}
    >
      <Notebook className="w-icon h-icon mr-2 text-bg-surface-800" />
      <span className="text-button font-semibold text-bg-surface-800 text-left pr-0.5 hidden xl:inline">All Leagues</span>
    </button>
  );
} 