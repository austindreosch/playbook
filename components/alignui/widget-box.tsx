import * as React from 'react';
import { cnExt } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';

interface WidgetBoxBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  fixedHeight?: boolean;
}

interface WidgetBoxSnapHeightProps extends WidgetBoxBaseProps {
  snapHeight: true;
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

interface WidgetBoxRegularProps extends WidgetBoxBaseProps {
  snapHeight?: false;
  size?: never;
}

type WidgetBoxProps = WidgetBoxSnapHeightProps | WidgetBoxRegularProps;

function WidgetBox({
  className,
  fixedHeight = false,
  snapHeight,
  size,
  ...rest
}: WidgetBoxProps) {
  const getSnapHeightClass = () => {
    if (!snapHeight || !size) return '';
    
    // Standard Tailwind height classes - 4rem increments
    const heightMap = {
      1: 'h-32',     // 8rem (128px)
      2: 'h-48',     // 12rem (192px)  
      3: 'h-64',     // 16rem (256px)
      4: 'h-80',     // 20rem (320px)
      5: 'h-96',     // 24rem (384px)
      6: 'h-112',    // 28rem (448px)
      7: 'h-128',    // 32rem (512px)
      8: 'h-144',    // 36rem (576px)
      9: 'h-160',    // 40rem (640px)
      10: 'h-176',   // 44rem (704px)
    } as const;
    
    return heightMap[size] || '';
  };
  return (
    <div
      className={cnExt(
        'w-full min-w-0 rounded-lg bg-bg-white-0 shadow-regular-sm p-3.5 ring-1 ring-inset ring-stroke-soft-200',
        snapHeight ? `${getSnapHeightClass()} flex flex-col` : '',
        fixedHeight && !snapHeight ? 'flex flex-col justify-between' : '',
        className,
      )}
      {...rest}
    />
  );
}

interface WidgetBoxHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noMargin?: boolean;
  fixedHeight?: boolean;
}

function WidgetBoxHeader({
  className,
  noMargin = false,
  fixedHeight = false,
  ...rest
}: WidgetBoxHeaderProps) {
  return (
    <div
      className={cnExt(
        'flex items-center gap-2',
        'h-6 text-label-lg md:text-label-xl mb-2.5',
        !noMargin && '',
        fixedHeight && '',
        className,
      )}
      {...rest}
    />
  );
}

function WidgetBoxHeaderIcon<T extends React.ElementType>({
  className,
  as,
  ...rest
}: PolymorphicComponentProps<T, React.HTMLAttributes<HTMLDivElement>>) {
  const Component = as || 'div';
  return (
    <Component
      className={cnExt('hw-icon text-black', className)}
      {...rest}
    />
  );
}

interface WidgetBoxContentProps extends React.HTMLAttributes<HTMLDivElement> {
  autoSpace?: boolean; // For snapHeight widgets - auto-distributes children
}

function WidgetBoxContent({
  className,
  children,
  autoSpace = false,
  ...rest
}: WidgetBoxContentProps) {
  // Convert children to array and count them
  const childrenArray = React.Children.toArray(children);
  const hasMultipleChildren = childrenArray.length > 1;
  
  return (
    <div 
      className={cnExt(
        'flex-1 flex flex-col',
        className
      )} 
      {...rest}
    >
      {hasMultipleChildren ? (
        <>
          {/* Top sections with gap spacing - allow flex children to grow */}
          <div className="flex flex-col gap-3 flex-1">
            {childrenArray.slice(0, -1)}
          </div>
          {/* Fixed minimum gap - no competition */}
          <div className="min-h-6" />
          {/* Bottom section - flush to bottom */}
          <div>
            {childrenArray[childrenArray.length - 1]}
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}

export {
  WidgetBoxHeader as Header,
  WidgetBoxHeaderIcon as HeaderIcon,
  WidgetBoxContent as Content,
  WidgetBox as Root
};

