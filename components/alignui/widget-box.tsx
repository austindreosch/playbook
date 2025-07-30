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
        'w-full min-w-0 rounded-lg bg-bg-white-0 px-3 py-2 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-100',
        fixedHeight && 'flex flex-col justify-between',
        className,
      )}
      {...rest}
    />
  );
}

function WidgetBoxHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt(
        'flex items-center gap-2.5',
        'h-8 mb-2 text-label-lg md:text-label-xl',
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

export {
  WidgetBoxHeader as Header,
  WidgetBoxHeaderIcon as HeaderIcon, WidgetBox as Root
};

