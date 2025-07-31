import { cnExt } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';

interface WidgetBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  fixedHeight?: boolean;
}

function WidgetBox({
  className,
  fixedHeight = false,
  ...rest
}: WidgetBoxProps) {
  return (
    <div
      className={cnExt(
        'w-full min-w-0 rounded-lg bg-bg-white-0 shadow-regular-xs p-3 ring-1 ring-inset ring-stroke-soft-100',
        fixedHeight ? 'flex flex-col justify-between' : '',
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
        'flex items-center gap-2.5 px-[2px]',
        'h-6 text-label-lg md:text-label-xl mb-2',
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
      className={cnExt('icon text-text-strong-900', className)}
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

