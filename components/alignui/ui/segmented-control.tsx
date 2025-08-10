// AlignUI SegmentedControl v0.0.0

'use client';

import * as React from 'react';
import { Slottable } from '@radix-ui/react-slot';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import mergeRefs from 'merge-refs';

import { cnExt } from '@/utils/cn';
import { useTabObserver } from '@/hooks/use-tab-observer';

const SegmentedControlRoot = TabsPrimitive.Root;
SegmentedControlRoot.displayName = 'SegmentedControlRoot';

const SegmentedControlList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    floatingBgClassName?: string;
    activeValue?: string;
  }
>(({ children, className, floatingBgClassName, activeValue, ...rest }, forwardedRef) => {
  const [lineStyle, setLineStyle] = React.useState({ width: 0, left: 0 });

  const { mounted, listRef, updateActiveTab } = useTabObserver({
    onActiveTabChange: (_, activeTab) => {
      const { offsetWidth: width, offsetLeft: left } = activeTab;
      setLineStyle({ width, left });
    },
  });

  // Sync floating background when the active tab value changes
  React.useEffect(() => {
    updateActiveTab();
  }, [activeValue, updateActiveTab]);

  return (
    <TabsPrimitive.List
      ref={mergeRefs(forwardedRef, listRef)}
      className={cnExt(
        'relative isolate grid auto-cols-auto grid-flow-col gap-1 rounded-10 bg-bg-weak-50 p-1',
        className,
      )}
      {...rest}
    >
      <Slottable>{children}</Slottable>

      {/* floating bg */}
      <div
        className={cnExt(
          'absolute inset-y-1 left-0 -z-10 rounded-md bg-bg-white-0 shadow-toggle-switch transition-transform duration-300',
          {
            hidden: !mounted,
          },
          floatingBgClassName,
        )}
        style={{
          transform: `translate3d(${lineStyle.left}px, 0, 0)`,
          width: `${lineStyle.width}px`,
          transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
        }}
        aria-hidden='true'
      />
    </TabsPrimitive.List>
  );
});
SegmentedControlList.displayName = 'SegmentedControlList';

const SegmentedControlTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <TabsPrimitive.Trigger
      ref={forwardedRef}
      className={cnExt(
        // base
        'peer',
        'relative z-10 h-7 whitespace-nowrap rounded-md px-2 text-label-sm text-soft-400 outline-none',
        'flex items-center justify-center gap-1.5',
        'transition duration-300 ease-out',
        // global hover for all segmented controls (visible on dark and light backgrounds)
        'hover:bg-white/10',
        // focus
        'focus:outline-none',
        // active
        'data-[state=active]:text-strong-950 data-[state=active]:hover:bg-bg-white-0',
        className,
      )}
      {...rest}
    />
  );
});
SegmentedControlTrigger.displayName = 'SegmentedControlTrigger';

const SegmentedControlContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ ...rest }, forwardedRef) => {
  return <TabsPrimitive.Content ref={forwardedRef} {...rest} />;
});
SegmentedControlContent.displayName = 'SegmentedControlContent';

export {
  SegmentedControlRoot as Root,
  SegmentedControlList as List,
  SegmentedControlTrigger as Trigger,
  SegmentedControlContent as Content,
};
