'use client';

import * as React from 'react';
import { ChevronRight, Compass } from 'lucide-react';
import { Avatar } from '@/components/alignui/avatar';

const PlayerRow = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    icon?: string | React.ElementType;
    name: string;
    position?: string;
    value: number;
    playbookScore?: number;
    type?: string;
    hasNotification?: boolean;
  }
>(
  (
    { icon, name, position = '', value, playbookScore, type, hasNotification = false, ...rest },
    forwardedRef,
  ) => {
    const renderNotificationIcon = () => {
      if (typeof icon === 'string') {
        return <img src={icon} alt='' className='w-4 h-4' />;
      }
      if (icon) {
        const IconComponent = icon as React.ElementType;
        return <IconComponent className='w-4 h-4' />;
      }
      return <ChevronRight className='w-4 h-4 text-sub-600' />;
    };

    const initials = name.split(' ').map(word => word[0]).join('').slice(0,2).toUpperCase();

    return (
      <button
        type='button'
        ref={forwardedRef}
        className='flex w-full items-center gap-2 rounded-lg ring-1 ring-inset ring-stroke-soft-100 h-10 px-2 bg-white text-left transition-all duration-200 ease-out hover:bg-bg-weak-50 hover:px-3'
        {...rest}
      >
        {/* Rank */}
        {playbookScore && (
          <div className="w-7 flex items-center justify-center gap-1 text-label-lg font-bold text-sub-600">
            {/* <Compass className="hw-icon-xs text-blue" /> */}
            <span className='mt-[1px]'>{playbookScore}</span>
          </div>
        )}
        
        {/* Headshot */}
        <div className='shrink-0'>
          <Avatar size="24" shape='square'>

          </Avatar>
        </div>
        
        {/* Name and Position */}
        <div className='min-w-0 flex items-center gap-2'>
          <span className='truncate text-label-lg text-strong-950 font-semibold'>{name}</span>
          {position && (
            <span className='truncate text-paragraph-sm text-sub-600'>
              {position}
            </span>
          )}
        </div>
        
        {/* Spacer */}
        <div className='flex-1' />
        
        {/* Notification Icon */}
        {(hasNotification || icon) && (
          <div className='shrink-0'>
            {renderNotificationIcon()}
          </div>
        )}
        
        {/* Z-Score */}
        <div className='flex items-center justify-end min-w-[3rem] h-8 pl-3'>
          <div className='text-numbers-md font-mono text-strong-950 text-right'>
            {typeof value === 'number'
              ? value.toFixed(2).padStart(5, '0')
              : value}
          </div>
        </div>
      </button>
    );
  },
);
PlayerRow.displayName = 'PlayerRow';

export { PlayerRow };