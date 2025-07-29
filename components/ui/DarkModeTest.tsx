'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import * as Button from '@/components/alignui/button';
import * as WidgetBox from '@/components/alignui/widget-box';
import { Settings, Moon, Sun } from 'lucide-react';

export function DarkModeTest() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <WidgetBox.Root className="w-80">
        <WidgetBox.Header>
          <WidgetBox.HeaderIcon as={Settings} />
          Dark Mode Test
          <ThemeToggle />
        </WidgetBox.Header>
        
        <div className="space-y-3 pt-4">
          <p className="text-text-sub-600 text-sm">
            This widget tests the dark mode implementation. Toggle between themes using the button above.
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-bg-weak-50 p-3 rounded border border-stroke-soft-200">
              <div className="text-text-strong-950 font-medium text-sm">Background</div>
              <div className="text-text-sub-600 text-xs">bg-bg-weak-50</div>
            </div>
            
            <div className="bg-information-lighter p-3 rounded">
              <div className="text-information-dark font-medium text-sm">Info Color</div>
              <div className="text-information-base text-xs">Auto-adapts</div>
            </div>
            
            <div className="bg-success-lighter p-3 rounded">
              <div className="text-success-dark font-medium text-sm">Success</div>
              <div className="text-success-base text-xs">Auto-adapts</div>
            </div>
            
            <div className="bg-error-lighter p-3 rounded">
              <div className="text-error-dark font-medium text-sm">Error</div>
              <div className="text-error-base text-xs">Auto-adapts</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button.Root variant="primary" size="small">
              Primary
            </Button.Root>
            <Button.Root variant="neutral" mode="stroke" size="small">
              Neutral
            </Button.Root>
          </div>
        </div>
      </WidgetBox.Root>
    </div>
  );
}