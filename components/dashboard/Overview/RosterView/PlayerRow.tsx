'use client';

import * as React from 'react';
import { ChevronRight, Compass } from 'lucide-react';
import { Avatar } from '@/components/alignui/avatar';

const PlayerRow = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    icon?: string | React.ElementType;
    iconColor?: string;
    name: string;
    position?: string;
    value: number;
    playbookScore?: number;
    type?: string;
    hasNotification?: boolean;
  }
>(
  (
    { icon, iconColor, name, position = '', value, playbookScore, type, hasNotification = false, ...rest },
    forwardedRef,
  ) => {
    const renderNotificationIcon = () => {
      const colorClass = iconColor || 'text-sub-600';
      const getColorClasses = () => {
        switch (iconColor) {
          case 'text-green-500': return 'bg-green-10 hover:bg-green-25 border-green-50 hover:border-green-25';
          case 'text-red-600': return 'bg-red-10 hover:bg-red-25 border-red-50 hover:border-red-25';
          case 'text-red-400': return 'bg-red-10 hover:bg-red-25 border-red-50 hover:border-red-25';
          case 'text-red-500': return 'bg-red-10 hover:bg-red-25 border-red-50 hover:border-red-25';
          case 'text-blue-400': return 'bg-blue-10 hover:bg-blue-25 border-blue-50 hover:border-blue-25';
          default: return 'bg-gray-10 hover:bg-gray-50 border-gray-50 hover:border-gray-100';
        }
      };
      
      const buttonClasses = `w-7 h-7 rounded border flex items-center justify-center transition-colors ${getColorClasses()}`;
      
      if (typeof icon === 'string') {
        return (
          <div className={buttonClasses}>
            <img src={icon} alt='' className={`hw-icon-sm ${colorClass}`} />
          </div>
        );
      }
      if (icon) {
        const IconComponent = icon as React.ElementType;
        return (
          <div className={buttonClasses}>
            <IconComponent className={`hw-icon-sm ${colorClass}`} />
          </div>
        );
      }
      return (
        <div className={buttonClasses}>
          <ChevronRight className='hw-icon-sm text-sub-600' />
        </div>
      );
    };

    const initials = name.split(' ').map(word => word[0]).join('').slice(0,2).toUpperCase();

    return (
      <button
        type='button'
        ref={forwardedRef}
        className='flex w-full items-center gap-2 rounded-lg ring-1 ring-inset ring-stroke-soft-100 shadow-regular-xs h-10 px-2 bg-white text-left transition-all duration-200 ease-out hover:bg-gray-10 hover:px-3'
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
          <div className='shrink-0 pr-4'>
            {renderNotificationIcon()}
          </div>
        )}
        
        {/* Z-Score */}
        <div className='flex items-center justify-start min-w-[2.5rem] h-8'>
          <div className='text-numbers-lg text-gray-450 text-left'>
            {typeof value === 'number' ? value.toFixed(2) : value}
          </div>
        </div>
      </button>
    );
  },
);
PlayerRow.displayName = 'PlayerRow';

export { PlayerRow };