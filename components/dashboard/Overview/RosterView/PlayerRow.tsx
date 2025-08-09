'use client';

import * as React from 'react';
import { ChevronRight, Compass } from 'lucide-react';
import { Avatar } from '@/components/alignui/avatar';
import { NewsNotificationIconButton } from '@/components/common/NewsNotificationIconButton';

const PlayerRow = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    icon?: string | React.ElementType;
    iconType?: 'success' | 'danger' | 'warning' | 'cold' | 'default';
    name: string;
    position?: string;
    value: number;
    playbookScore?: number;
    type?: string;
    hasNotification?: boolean;
  }
>(
(
  { icon, iconType, name, position = '', value, playbookScore, type, hasNotification = false, ...rest },
  forwardedRef,
) => {
    const renderNotificationIcon = () => (
      <NewsNotificationIconButton icon={icon} iconType={iconType} />
    );

    const initials = name.split(' ').map(word => word[0]).join('').slice(0,2).toUpperCase();

    return (
      <button
        type='button'
        ref={forwardedRef}
        className='flex w-full items-center gap-2 rounded-lg ring-1 ring-inset ring-stroke-soft-100 shadow-regular-xs h-10 px-1.5 bg-white text-left transition-all duration-200 ease-out hover:bg-gray-10 hover:px-3'
        {...rest}
      >
        {/* Rank */}
        {playbookScore && (
          <div className="w-8 flex items-center justify-center gap-1 text-label-lg font-bold text-black text-stroke-sm text-stroke-black">
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
          <div className='shrink-0 pr-4'>
            {renderNotificationIcon()}
          </div>
        )}
        
        {/* Z-Score */}
        <div className='flex items-center justify-start min-w-[2.5rem] h-8'>
          <div className='text-numbers-lg text-gray-400 text-left'>
            {typeof value === 'number' ? value.toFixed(2) : value}
          </div>
        </div>
      </button>
    );
  },
);
PlayerRow.displayName = 'PlayerRow';

export { PlayerRow };