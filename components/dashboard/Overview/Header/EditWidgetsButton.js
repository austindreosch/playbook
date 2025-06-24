import { LayoutDashboard, X } from 'lucide-react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';
import AcceptWidgetsButton from './AcceptWidgetsButton';

export default function EditWidgetsButton({ className = '' }) {
  const isEditMode = useDashboardContext((state) => state.isEditMode);
  const setIsEditMode = useDashboardContext((state) => state.setIsEditMode);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setIsEditMode(!isEditMode)}
        className={`flex items-center justify-between px-3 gap-3 rounded-md border transition-colors duration-200 shadow-sm select-none ${
          isEditMode
            ? 'border-pb_red bg-pb-red-100 hover:bg-pb_red-200'
            : 'border-pb_lightgray bg-white hover:bg-pb_lightestgray'
        } ${className}`.trim()}
      >
        {isEditMode ? (
          <X className="w-5 h-5 text-pb_red" />
        ) : (
          <LayoutDashboard className="w-5 h-5 text-pb_darkgray" />
        )}
      </button>
      {isEditMode && <AcceptWidgetsButton />}
    </div>
  );
} 