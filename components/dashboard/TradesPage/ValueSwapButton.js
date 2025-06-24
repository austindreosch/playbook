'use client';

import { Switch } from '@/components/ui/switch';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { ClipboardMinus, Compass } from 'lucide-react';

const ValueSwapButton = ({ className }) => {
  const tradeValueMode = useDashboardContext((state) => state.tradeValueMode);
  const setTradeValueMode = useDashboardContext((state) => state.setTradeValueMode);

  const handleSwap = (isChecked) => {
    setTradeValueMode(isChecked ? 'clipboard' : 'compass');
  };

  return (
    <div
      className={`
        flex items-center justify-between rounded-md border shadow-sm select-none 
        px-3 py-1 transition-colors
        border-pb_lightgray bg-white hover:bg-pb_lightestgray
        ${className}`.trim().replace(/\s+/g, ' ')}
    >
      <Compass 
        className={`h-5 w-5 ${tradeValueMode === 'compass' ? 'text-pb_darkgray' : 'text-gray-300'}`} 
      />
      <Switch 
        id="value-swap" 
        className="mx-2"
        checked={tradeValueMode === 'clipboard'}
        onCheckedChange={handleSwap}
      />
      <ClipboardMinus 
        className={`h-5 w-5 ${tradeValueMode === 'clipboard' ? 'text-pb_darkgray' : 'text-gray-300'}`} 
      />
    </div>
  );
};

export default ValueSwapButton; 