// AlignUI SegmentedControl v0.0.0

'use client';

import * as React from 'react';
import { Slottable } from '@radix-ui/react-slot';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import mergeRefs from 'merge-refs';

import { cnExt } from '@/utils/cn';
import { useTabObserver } from '@/hooks/use-tab-observer';

// Default color configuration for SegmentedControl
const DEFAULT_SEGMENTED_CONTROL_COLORS = {
  // Base colors
  text: {
    inactive: 'text-sub',
    active: 'text-strong',
    disabled: 'text-disabled',
    disabledActive: 'text-strong'
  },
  // Background colors
  background: {
    hover: 'hover:bg-gray-25',
    active: 'bg-white',
    activeHover: 'data-[state=active]:hover:bg-gray-25',
    disabledHover: 'disabled:hover:bg-transparent',
    disabledActive: 'bg-gray-100'
  },
  // Container colors
  container: {
    background: 'bg-bg-weak-25',
    floatingBg: 'bg-bg-white-0'
  },
  // Separator colors
  separator: {
    from: 'after:from-transparent',
    via: 'after:via-gray-300', 
    to: 'after:to-transparent'
  }
};

export type SegmentedControlColorConfig = typeof DEFAULT_SEGMENTED_CONTROL_COLORS;

// Context to pass color configuration to child components
const SegmentedControlContext = React.createContext<SegmentedControlColorConfig>(DEFAULT_SEGMENTED_CONTROL_COLORS);

const SegmentedControlRoot = TabsPrimitive.Root;
SegmentedControlRoot.displayName = 'SegmentedControlRoot';

const SegmentedControlList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    floatingBgClassName?: string;
    activeValue?: string;
    colorConfig?: Partial<SegmentedControlColorConfig>;
    isDisabled?: boolean;
  }
>(({ children, className, floatingBgClassName, activeValue, colorConfig, isDisabled = false, ...rest }, forwardedRef) => {
  // Deep merge the color configuration to ensure all nested properties are merged
  const colors = {
    ...DEFAULT_SEGMENTED_CONTROL_COLORS,
    text: {
      ...DEFAULT_SEGMENTED_CONTROL_COLORS.text,
      ...(colorConfig?.text || {})
    },
    background: {
      ...DEFAULT_SEGMENTED_CONTROL_COLORS.background,
      ...(colorConfig?.background || {})
    },
    container: {
      ...DEFAULT_SEGMENTED_CONTROL_COLORS.container,
      ...(colorConfig?.container || {})
    },
    separator: {
      ...DEFAULT_SEGMENTED_CONTROL_COLORS.separator,
      ...(colorConfig?.separator || {})
    }
  };
  
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
    <SegmentedControlContext.Provider value={colors}>
      <TabsPrimitive.List
        ref={mergeRefs(forwardedRef, listRef)}
        className={cnExt(
          `relative isolate grid auto-cols-auto grid-flow-col gap-1 rounded-lg ${colors.container.background} p-1`,
          className,
        )}
        {...rest}
      >
        <Slottable>{children}</Slottable>

      {/* floating bg */}
      <div
        className={cnExt(
          `absolute inset-y-1 left-0 -z-10 rounded-md shadow-toggle-switch transition-transform duration-300`,
          isDisabled ? colors.background.disabledActive : colors.background.active,
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
    </SegmentedControlContext.Provider>
  );
});
SegmentedControlList.displayName = 'SegmentedControlList';

const SegmentedControlTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    isControlDisabled?: boolean;
  }
>(({ className, isControlDisabled = false, ...rest }, forwardedRef) => {
  const colors = React.useContext(SegmentedControlContext);
  
  return (
    <TabsPrimitive.Trigger
      ref={forwardedRef}
      className={cnExt(
        // base
        'peer',
        `relative z-10 h-7 whitespace-nowrap rounded-md px-2 text-label-sm ${colors.text.inactive} outline-none`,
        'flex items-center justify-center gap-1.5',
        // Gradient separator - only show if there's another trigger after this one
        '[&:not(:last-of-type)]:after:content-[\'\']',
        '[&:not(:last-of-type)]:after:absolute',
        '[&:not(:last-of-type)]:after:right-0',
        '[&:not(:last-of-type)]:after:top-1',
        '[&:not(:last-of-type)]:after:bottom-1',
        '[&:not(:last-of-type)]:after:w-px',
        // gradient style - using configurable colors
        '[&:not(:last-of-type)]:after:bg-gradient-to-b',
        colors.separator.from,
        colors.separator.via,
        colors.separator.to,
        // hide around active
        'data-[state=active]:after:hidden', // no separator AFTER active
        '[&:has(+[data-state=active])]:after:hidden', // no separator BEFORE active (next is active)
        'transition duration-300 ease-out',
        // global hover for all segmented controls
        colors.background.hover,
        // focus
        'focus:outline-none',
        // active - use disabledActive text if control is disabled
        isControlDisabled 
          ? `data-[state=active]:${colors.text.disabledActive} ${colors.background.activeHover}`
          : `data-[state=active]:${colors.text.active} ${colors.background.activeHover}`,
        className,
        // disabled styles using colorConfig - applied after className for highest priority
        `disabled:cursor-not-allowed disabled:opacity-100 ${colors.background.disabledHover}`,
        // Map specific disabled colors to ensure Tailwind generates them
        colors.text.disabled === 'text-gray-50' && 'disabled:!text-gray-50',
        colors.text.disabled === 'text-gray-100' && 'disabled:!text-gray-100', 
        colors.text.disabled === 'text-gray-200' && 'disabled:!text-gray-200',
        colors.text.disabled === 'text-gray-300' && 'disabled:!text-gray-300',
        colors.text.disabled === 'text-gray-400' && 'disabled:!text-gray-400',
        colors.text.disabled === 'text-orange-700' && 'disabled:!text-orange-700',
        colors.text.disabled === 'text-disabled' && 'disabled:!text-disabled',
        // Map specific disabledActive colors to ensure Tailwind generates them
        colors.text.disabledActive === 'text-blue-800' && 'data-[state=active]:!text-blue-800',
        colors.text.disabledActive === 'text-blue-900' && 'data-[state=active]:!text-blue-900',
        colors.text.disabledActive === 'text-gray-700' && 'data-[state=active]:!text-gray-700',
        colors.text.disabledActive === 'text-white' && 'data-[state=active]:!text-white',
        // Force white color for all children (including SVGs) in disabled active state
        isControlDisabled && colors.text.disabledActive === 'text-white' && 'data-[state=active]:[&_*]:!text-white',
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
