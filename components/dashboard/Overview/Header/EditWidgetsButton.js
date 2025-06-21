import { LayoutDashboard } from 'lucide-react';

export default function EditWidgetsButton({ className = '' }) {
  return (
    <button
      className={`flex items-center justify-between px-3 gap-3 rounded-md border border-pb_lightgray bg-white hover:bg-pb_lightestgray transition-colors duration-200 shadow-sm select-none ${className}`.trim()}
    >
      <LayoutDashboard className="w-5 h-5 text-pb_darkgray" />
    </button>
  );
} 