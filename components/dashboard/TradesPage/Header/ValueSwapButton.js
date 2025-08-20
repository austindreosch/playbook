'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { ClipboardMinus, Compass } from 'lucide-react';

const ValueSwapButton = ({ className }) => {
  const tradeValueMode = useDashboardContext((state) => state.tradeValueMode);
  const setTradeValueMode = useDashboardContext((state) => state.setTradeValueMode);

  return (
    <div className={cn("inline-flex h-button rounded-md shadow-sm", className)}>
      <ToggleGroup
        type="single"
        value={tradeValueMode}
        onValueChange={(value) => { if (value) setTradeValueMode(value); }}
        className="flex items-center gap-0"
      >
        <ToggleGroupItem 
          value="compass" 
          aria-label="Toggle compass" 
          className={cn(
            "px-3 shadow-inner h-full flex items-center justify-center rounded-l-md rounded-r-none border-t border-b border-l data-[state=on]:border-r transition-colors",
            "data-[state=on]:bg-primary-base data-[state=on]:text-white data-[state=on]:border-primary-basehover hover:data-[state=on]:bg-primary-basehover hover:data-[state=on]:text-white",
            "data-[state=off]:bg-white data-[state=off]:text-stroke-soft-200 data-[state=off]:border-stroke-soft-200 hover:data-[state=off]:bg-backgroundgray hover:data-[state=off]:text-bg-surface-800"
          )}
        >
          <Compass className="w-icon h-icon" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="clipboard" 
          aria-label="Toggle clipboard" 
          className={cn(
            "px-3 shadow-inner h-full flex items-center justify-center rounded-r-md rounded-l-none border-t border-b border-r data-[state=on]:border-l transition-colors",
            "data-[state=on]:bg-bg-surface-800 data-[state=on]:text-white data-[state=on]:border-bg-strong-950 hover:data-[state=on]:bg-bg-surface-800hover hover:data-[state=on]:text-white",
            "data-[state=off]:bg-white data-[state=off]:text-stroke-soft-200 data-[state=off]:border-stroke-soft-200 hover:data-[state=off]:bg-backgroundgray hover:data-[state=off]:text-bg-surface-800"
          )}
        >
          <ClipboardMinus className="h-5 w-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ValueSwapButton; 