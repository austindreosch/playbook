'use client';

import { cnExt } from '@/utils/cn';
import NotificationButton from '@/components/notification-button';
import { SearchMenuButton } from '@/components/search';

export default function Header({
  children,
  className,
  icon,
  title,
  description,
  contentClassName,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  contentClassName?: string;
}) {
  return (
    <header
      className={cnExt(
        'flex min-h-[88px] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8',
        className,
      )}
      {...rest}
    >
      <div className='flex flex-1 gap-4 lg:gap-3.5'>
        {icon}
        <div className='space-y-1'>
          <div className='text-label-md lg:text-label-lg'>{title}</div>
          <div className='text-paragraph-sm text-text-sub-600'>
            {description}
          </div>
        </div>
      </div>
      <div className={cnExt('flex items-center gap-3', contentClassName)}>
        <SearchMenuButton className='hidden lg:flex' />
        <NotificationButton className='hidden lg:flex' />

        {children}
      </div>
    </header>
  );
}
