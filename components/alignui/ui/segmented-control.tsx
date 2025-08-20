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
    disabledActive: 'text-strong',
    syncedInactive: 'text-gray-400',
    syncedActive: 'text-gray-600'
  },
  // Background colors
  background: {
    hover: 'hover:bg-gray-25',
    active: 'bg-white',
    activeHover: 'data-[state=active]:hover:bg-gray-25',
    disabledHover: 'disabled:hover:bg-transparent',
    disabledActive: 'bg-gray-100',
    syncedHover: 'hover:bg-gray-15',
    syncedActive: 'bg-gray-50',
    syncedActiveHover: 'data-[state=active]:hover:bg-gray-75'
  },
  // Container colors
  container: {
    background: 'bg-bg-weak-25',
    floatingBg: 'bg-bg-white-0',
    syncedBackground: 'bg-gray-5',
    syncedFloatingBg: 'bg-gray-25'
  },
  // Separator colors
  separator: {
    from: 'after:from-transparent',
    via: 'after:via-gray-300',
    viaDisabled: 'after:via-gray-100',
    viaSynced: 'after:via-gray-200',
    to: 'after:to-transparent'
  }
};

export type SegmentedControlColorConfig = typeof DEFAULT_SEGMENTED_CONTROL_COLORS;

// Context to pass color configuration and synced state to child components
const SegmentedControlContext = React.createContext<{
  colors: SegmentedControlColorConfig;
  isSynced: boolean;
}>({
  colors: DEFAULT_SEGMENTED_CONTROL_COLORS,
  isSynced: false
});

const SegmentedControlRoot = TabsPrimitive.Root;
SegmentedControlRoot.displayName = 'SegmentedControlRoot';

const SegmentedControlList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    floatingBgClassName?: string;
    activeValue?: string;
    colorConfig?: Partial<SegmentedControlColorConfig>;
    isDisabled?: boolean;
    isSynced?: boolean;
  }
>(({ children, className, floatingBgClassName, activeValue, colorConfig, isDisabled = false, isSynced = false, ...rest }, forwardedRef) => {
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

  // Determine background classes based on state
  const containerBg = isSynced ? colors.container.syncedBackground : colors.container.background;
  const floatingBg = isSynced ? colors.container.syncedFloatingBg : (isDisabled ? colors.background.disabledActive : colors.background.active);

  return (
    <SegmentedControlContext.Provider value={{ colors, isSynced }}>
      <TabsPrimitive.List
        ref={mergeRefs(forwardedRef, listRef)}
        className={cnExt(
          `relative isolate grid auto-cols-auto grid-flow-col gap-1 rounded-lg ${containerBg} p-1`,
          className,
        )}
        {...rest}
      >
        <Slottable>{children}</Slottable>

      {/* floating bg */}
      <div
        className={cnExt(
          `absolute inset-y-1 left-0 -z-10 rounded-md shadow-toggle-switch transition-transform duration-300`,
          floatingBg,
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
  const { colors, isSynced } = React.useContext(SegmentedControlContext);
  
  // Determine text and background classes based on state
  const getTextColor = () => {
    if (isSynced) {
      return colors.text.syncedInactive || colors.text.inactive;
    }
    return colors.text.inactive;
  };

  const getActiveTextColor = () => {
    if (isControlDisabled) {
      return colors.text.disabledActive;
    }
    if (isSynced) {
      return colors.text.syncedActive || colors.text.active;
    }
    return colors.text.active;
  };

  const getHoverColor = () => {
    if (isSynced) {
      return colors.background.syncedHover || colors.background.hover;
    }
    return colors.background.hover;
  };

  const getActiveHoverColor = () => {
    if (isSynced) {
      return colors.background.syncedActiveHover || colors.background.activeHover;
    }
    return colors.background.activeHover;
  };

  const getSeparatorColor = () => {
    if (isControlDisabled) {
      return colors.separator.viaDisabled;
    }
    if (isSynced) {
      return colors.separator.viaSynced || colors.separator.via;
    }
    return colors.separator.via;
  };

  return (
    <TabsPrimitive.Trigger
      ref={forwardedRef}
      className={cnExt(
        // base
        'peer',
        `relative z-10 h-7 whitespace-nowrap rounded-md px-2 text-label-sm ${getTextColor()} outline-none`,
        'flex items-center justify-center gap-1.5',
        // Gradient separator - only show if there's another trigger after this one
        '[&:not(:last-of-type)]:after:content-[\'\']',
        '[&:not(:last-of-type)]:after:absolute',
        '[&:not(:last-of-type)]:after:-right-[2.5px]',
        '[&:not(:last-of-type)]:after:top-1',
        '[&:not(:last-of-type)]:after:bottom-1',
        '[&:not(:last-of-type)]:after:w-px',
        // gradient style - using configurable colors
        '[&:not(:last-of-type)]:after:bg-gradient-to-b',
        colors.separator.from,
        getSeparatorColor(),
        colors.separator.to,
        // hide around active
        'data-[state=active]:after:hidden', // no separator AFTER active
        '[&:has(+[data-state=active])]:after:hidden', // no separator BEFORE active (next is active)
        'transition duration-300 ease-out',
        // global hover for all segmented controls
        getHoverColor(),
        // focus
        'focus:outline-none',
        // active - use appropriate text color based on state
        `data-[state=active]:${getActiveTextColor()} ${getActiveHoverColor()}`,
        className,
        // disabled styles using colorConfig - applied after className for highest priority
        `disabled:cursor-not-allowed disabled:opacity-100 ${colors.background.disabledHover}`,
        // Map specific disabled colors to ensure Tailwind generates them
        // Gray colors
        colors.text.disabled === 'text-gray-0' && 'disabled:!text-gray-0',
        colors.text.disabled === 'text-gray-5' && 'disabled:!text-gray-5',
        colors.text.disabled === 'text-gray-10' && 'disabled:!text-gray-10',
        colors.text.disabled === 'text-gray-25' && 'disabled:!text-gray-25',
        colors.text.disabled === 'text-gray-50' && 'disabled:!text-gray-50',
        colors.text.disabled === 'text-gray-100' && 'disabled:!text-gray-100',
        colors.text.disabled === 'text-gray-150' && 'disabled:!text-gray-150',
        colors.text.disabled === 'text-gray-200' && 'disabled:!text-gray-200',
        colors.text.disabled === 'text-gray-250' && 'disabled:!text-gray-250',
        colors.text.disabled === 'text-gray-300' && 'disabled:!text-gray-300',
        colors.text.disabled === 'text-gray-350' && 'disabled:!text-gray-350',
        colors.text.disabled === 'text-gray-400' && 'disabled:!text-gray-400',
        colors.text.disabled === 'text-gray-450' && 'disabled:!text-gray-450',
        colors.text.disabled === 'text-gray-500' && 'disabled:!text-gray-500',
        colors.text.disabled === 'text-gray-600' && 'disabled:!text-gray-600',
        colors.text.disabled === 'text-gray-700' && 'disabled:!text-gray-700',
        colors.text.disabled === 'text-gray-800' && 'disabled:!text-gray-800',
        colors.text.disabled === 'text-gray-900' && 'disabled:!text-gray-900',
        colors.text.disabled === 'text-gray-950' && 'disabled:!text-gray-950',
        // Blue colors
        colors.text.disabled === 'text-blue-5' && 'disabled:!text-blue-5',
        colors.text.disabled === 'text-blue-10' && 'disabled:!text-blue-10',
        colors.text.disabled === 'text-blue-25' && 'disabled:!text-blue-25',
        colors.text.disabled === 'text-blue-50' && 'disabled:!text-blue-50',
        colors.text.disabled === 'text-blue-100' && 'disabled:!text-blue-100',
        colors.text.disabled === 'text-blue-200' && 'disabled:!text-blue-200',
        colors.text.disabled === 'text-blue-300' && 'disabled:!text-blue-300',
        colors.text.disabled === 'text-blue-400' && 'disabled:!text-blue-400',
        colors.text.disabled === 'text-blue-500' && 'disabled:!text-blue-500',
        colors.text.disabled === 'text-blue-600' && 'disabled:!text-blue-600',
        colors.text.disabled === 'text-blue-700' && 'disabled:!text-blue-700',
        colors.text.disabled === 'text-blue-800' && 'disabled:!text-blue-800',
        colors.text.disabled === 'text-blue-900' && 'disabled:!text-blue-900',
        colors.text.disabled === 'text-blue-950' && 'disabled:!text-blue-950',
        // Orange colors
        colors.text.disabled === 'text-orange-5' && 'disabled:!text-orange-5',
        colors.text.disabled === 'text-orange-10' && 'disabled:!text-orange-10',
        colors.text.disabled === 'text-orange-25' && 'disabled:!text-orange-25',
        colors.text.disabled === 'text-orange-50' && 'disabled:!text-orange-50',
        colors.text.disabled === 'text-orange-100' && 'disabled:!text-orange-100',
        colors.text.disabled === 'text-orange-200' && 'disabled:!text-orange-200',
        colors.text.disabled === 'text-orange-300' && 'disabled:!text-orange-300',
        colors.text.disabled === 'text-orange-400' && 'disabled:!text-orange-400',
        colors.text.disabled === 'text-orange-500' && 'disabled:!text-orange-500',
        colors.text.disabled === 'text-orange-550' && 'disabled:!text-orange-550',
        colors.text.disabled === 'text-orange-600' && 'disabled:!text-orange-600',
        colors.text.disabled === 'text-orange-650' && 'disabled:!text-orange-650',
        colors.text.disabled === 'text-orange-700' && 'disabled:!text-orange-700',
        colors.text.disabled === 'text-orange-750' && 'disabled:!text-orange-750',
        colors.text.disabled === 'text-orange-800' && 'disabled:!text-orange-800',
        colors.text.disabled === 'text-orange-850' && 'disabled:!text-orange-850',
        colors.text.disabled === 'text-orange-900' && 'disabled:!text-orange-900',
        colors.text.disabled === 'text-orange-950' && 'disabled:!text-orange-950',
        colors.text.disabled === 'text-disabled' && 'disabled:!text-disabled',
        // Map specific disabledActive colors to ensure Tailwind generates them
        // Gray colors
        colors.text.disabledActive === 'text-gray-0' && 'data-[state=active]:!text-gray-0',
        colors.text.disabledActive === 'text-gray-5' && 'data-[state=active]:!text-gray-5',
        colors.text.disabledActive === 'text-gray-10' && 'data-[state=active]:!text-gray-10',
        colors.text.disabledActive === 'text-gray-25' && 'data-[state=active]:!text-gray-25',
        colors.text.disabledActive === 'text-gray-50' && 'data-[state=active]:!text-gray-50',
        colors.text.disabledActive === 'text-gray-100' && 'data-[state=active]:!text-gray-100',
        colors.text.disabledActive === 'text-gray-150' && 'data-[state=active]:!text-gray-150',
        colors.text.disabledActive === 'text-gray-200' && 'data-[state=active]:!text-gray-200',
        colors.text.disabledActive === 'text-gray-250' && 'data-[state=active]:!text-gray-250',
        colors.text.disabledActive === 'text-gray-300' && 'data-[state=active]:!text-gray-300',
        colors.text.disabledActive === 'text-gray-350' && 'data-[state=active]:!text-gray-350',
        colors.text.disabledActive === 'text-gray-400' && 'data-[state=active]:!text-gray-400',
        colors.text.disabledActive === 'text-gray-450' && 'data-[state=active]:!text-gray-450',
        colors.text.disabledActive === 'text-gray-500' && 'data-[state=active]:!text-gray-500',
        colors.text.disabledActive === 'text-gray-600' && 'data-[state=active]:!text-gray-600',
        colors.text.disabledActive === 'text-gray-700' && 'data-[state=active]:!text-gray-700',
        colors.text.disabledActive === 'text-gray-800' && 'data-[state=active]:!text-gray-800',
        colors.text.disabledActive === 'text-gray-900' && 'data-[state=active]:!text-gray-900',
        colors.text.disabledActive === 'text-gray-950' && 'data-[state=active]:!text-gray-950',
        // Blue colors
        colors.text.disabledActive === 'text-blue-5' && 'data-[state=active]:!text-blue-5',
        colors.text.disabledActive === 'text-blue-10' && 'data-[state=active]:!text-blue-10',
        colors.text.disabledActive === 'text-blue-25' && 'data-[state=active]:!text-blue-25',
        colors.text.disabledActive === 'text-blue-50' && 'data-[state=active]:!text-blue-50',
        colors.text.disabledActive === 'text-blue-100' && 'data-[state=active]:!text-blue-100',
        colors.text.disabledActive === 'text-blue-200' && 'data-[state=active]:!text-blue-200',
        colors.text.disabledActive === 'text-blue-300' && 'data-[state=active]:!text-blue-300',
        colors.text.disabledActive === 'text-blue-400' && 'data-[state=active]:!text-blue-400',
        colors.text.disabledActive === 'text-blue-500' && 'data-[state=active]:!text-blue-500',
        colors.text.disabledActive === 'text-blue-600' && 'data-[state=active]:!text-blue-600',
        colors.text.disabledActive === 'text-blue-700' && 'data-[state=active]:!text-blue-700',
        colors.text.disabledActive === 'text-blue-800' && 'data-[state=active]:!text-blue-800',
        colors.text.disabledActive === 'text-blue-900' && 'data-[state=active]:!text-blue-900',
        colors.text.disabledActive === 'text-blue-950' && 'data-[state=active]:!text-blue-950',
        // Orange colors
        colors.text.disabledActive === 'text-orange-5' && 'data-[state=active]:!text-orange-5',
        colors.text.disabledActive === 'text-orange-10' && 'data-[state=active]:!text-orange-10',
        colors.text.disabledActive === 'text-orange-25' && 'data-[state=active]:!text-orange-25',
        colors.text.disabledActive === 'text-orange-50' && 'data-[state=active]:!text-orange-50',
        colors.text.disabledActive === 'text-orange-100' && 'data-[state=active]:!text-orange-100',
        colors.text.disabledActive === 'text-orange-200' && 'data-[state=active]:!text-orange-200',
        colors.text.disabledActive === 'text-orange-300' && 'data-[state=active]:!text-orange-300',
        colors.text.disabledActive === 'text-orange-400' && 'data-[state=active]:!text-orange-400',
        colors.text.disabledActive === 'text-orange-500' && 'data-[state=active]:!text-orange-500',
        colors.text.disabledActive === 'text-orange-550' && 'data-[state=active]:!text-orange-550',
        colors.text.disabledActive === 'text-orange-600' && 'data-[state=active]:!text-orange-600',
        colors.text.disabledActive === 'text-orange-650' && 'data-[state=active]:!text-orange-650',
        colors.text.disabledActive === 'text-orange-700' && 'data-[state=active]:!text-orange-700',
        colors.text.disabledActive === 'text-orange-750' && 'data-[state=active]:!text-orange-750',
        colors.text.disabledActive === 'text-orange-800' && 'data-[state=active]:!text-orange-800',
        colors.text.disabledActive === 'text-orange-850' && 'data-[state=active]:!text-orange-850',
        colors.text.disabledActive === 'text-orange-900' && 'data-[state=active]:!text-orange-900',
        colors.text.disabledActive === 'text-orange-950' && 'data-[state=active]:!text-orange-950',
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
