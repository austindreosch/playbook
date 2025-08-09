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
    const baseHeight = size * 8; // 8rem per size unit (128px each)
    const gapHeight = (size - 1) * 0.5; // 0.5rem per gap between units
    const totalHeight = baseHeight + gapHeight;
    return `h-[${totalHeight}rem]`;
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

function WidgetBoxContent({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cnExt('flex-1 flex flex-col justify-between', className)} 
      {...rest}
    >
      {children}
    </div>
  );
}

export {
  WidgetBoxHeader as Header,
  WidgetBoxHeaderIcon as HeaderIcon,
  WidgetBoxContent as Content,
  WidgetBox as Root
};

