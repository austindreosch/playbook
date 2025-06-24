import { Button } from '@/components/ui/button';
import { Check, LayoutDashboard, RotateCcw, X } from 'lucide-react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';

export default function EditWidgetsButton({ className = '' }) {
  const isEditMode = useDashboardContext(state => state.isEditMode);
  const startEditingLayout = useDashboardContext(state => state.startEditingLayout);
  const saveLayoutChanges = useDashboardContext(state => state.saveLayoutChanges);
  const cancelLayoutChanges = useDashboardContext(state => state.cancelLayoutChanges);
  const resetLayoutToDefault = useDashboardContext(state => state.resetLayoutToDefault);

  if (isEditMode) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {/* Reset to Default Button */}
        <Button variant="outline" size="icon" onClick={resetLayoutToDefault} title="Reset to Default Layout">
          <RotateCcw className="w-4 h-4" />
        </Button>
        {/* Cancel Button */}
        <Button variant="destructive" size="icon" onClick={cancelLayoutChanges} title="Cancel Changes">
          <X className="w-4 h-4" />
        </Button>
        {/* Save/Done Button */}
        <Button variant="primary" size="icon" onClick={saveLayoutChanges} title="Save Layout">
          <Check className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" onClick={startEditingLayout} className={className}>
      <LayoutDashboard className="w-4 h-4 mr-2" />
      Edit Widgets
    </Button>
  );
} 