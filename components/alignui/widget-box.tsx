import { cnExt } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';

function WidgetBox({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt(
        'w-full min-w-0 rounded-lg bg-bg-white-0 p-3 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
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
        'flex items-center gap-2',
        'h-8 pb-3 text-label-sm md:text-label-lg',
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
      className={cnExt('icon text-text-sub-600', className)}
      {...rest}
    />
  );
}

export {
  WidgetBoxHeader as Header,
  WidgetBoxHeaderIcon as HeaderIcon, WidgetBox as Root
};

