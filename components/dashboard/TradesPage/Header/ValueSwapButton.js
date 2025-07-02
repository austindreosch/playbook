'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { ClipboardMinus, Compass } from 'lucide-react';

const ValueSwapButton = ({ className }) => {
  const tradeValueMode = useDashboardContext((state) => state.tradeValueMode);
  const setTradeValueMode = useDashboardContext((state) => state.setTradeValueMode);

  return (
    <div className={cn("inline-flex h-9 rounded-md shadow-sm", className)}>
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
            "data-[state=on]:bg-pb_blue data-[state=on]:text-white data-[state=on]:border-pb_bluehover hover:data-[state=on]:bg-pb_bluehover hover:data-[state=on]:text-white",
            "data-[state=off]:bg-white data-[state=off]:text-pb_lightgray data-[state=off]:border-pb_lightgray hover:data-[state=off]:bg-backgroundgray hover:data-[state=off]:text-pb_darkgray"
          )}
        >
          <Compass className="h-5 w-5" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="clipboard" 
          aria-label="Toggle clipboard" 
          className={cn(
            "px-3 shadow-inner h-full flex items-center justify-center rounded-r-md rounded-l-none border-t border-b border-r data-[state=on]:border-l transition-colors",
            "data-[state=on]:bg-pb_darkgray data-[state=on]:text-white data-[state=on]:border-pb_darkergray hover:data-[state=on]:bg-pb_darkgrayhover hover:data-[state=on]:text-white",
            "data-[state=off]:bg-white data-[state=off]:text-pb_lightgray data-[state=off]:border-pb_lightgray hover:data-[state=off]:bg-backgroundgray hover:data-[state=off]:text-pb_darkgray"
          )}
        >
          <ClipboardMinus className="h-5 w-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ValueSwapButton; 