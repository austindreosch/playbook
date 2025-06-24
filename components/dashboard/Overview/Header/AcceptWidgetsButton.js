import { Check } from 'lucide-react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';

export default function AcceptWidgetsButton({ className = '' }) {
  const setIsEditMode = useDashboardContext((state) => state.setIsEditMode);

  const handleAccept = () => {
    setIsEditMode(false);
    // TODO: Add logic to save the new widget layout to the backend
  };

  return (
    <button
      onClick={handleAccept}
      className={`flex items-center justify-between px-3 py-1.5 gap-3 rounded-md bg-pb_green hover:bg-pb_greenhover text-white transition-colors duration-200 shadow-sm select-none ${className}`.trim()}
    >
      <Check className="w-5 h-5" />
    </button>
  );
} 