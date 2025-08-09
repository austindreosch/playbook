'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';

type IconType = 'success' | 'danger' | 'cold' | 'warning' | 'default';

export type NewsNotificationIconButtonProps = {
  icon?: string | React.ElementType;
  iconType?: IconType;
  className?: string;
  iconClassName?: string;
};

function getIconTypeClasses(iconType: IconType | undefined): string {
  switch (iconType) {
    case 'success':
      return 'bg-green-10 hover:bg-green-25 border-green-100 hover:border-green-100';
    case 'danger':
      return 'bg-red-10 hover:bg-red-25 border-red-100 hover:border-red-100';
    case 'cold':
      return 'bg-blue-10 hover:bg-blue-25 border-blue-100 hover:border-blue-100';
    case 'warning':
      return 'bg-orange-10 hover:bg-orange-25 border-orange-200 hover:border-orange-200';
    default:
      return 'bg-gray-10 hover:bg-gray-50 border-gray-150 hover:border-gray-150';
  }
}

function getIconColorClass(iconType: IconType | undefined): string {
  switch (iconType) {
    case 'success':
      return 'text-green-600';
    case 'danger':
      return 'text-red-600';
    case 'cold':
      return 'text-blue-600';
    case 'warning':
      return 'text-orange-600';
    default:
      return 'text-sub-600';
  }
}

export function NewsNotificationIconButton({
  icon,
  iconType = 'default',
  className = '',
  iconClassName = '',
}: NewsNotificationIconButtonProps) {
  const containerClasses = `w-7 h-7 rounded border flex items-center justify-center transition-colors ${getIconTypeClasses(iconType)} ${className}`;
  const colorClass = getIconColorClass(iconType);

  if (typeof icon === 'string') {
    return (
      <div className={containerClasses}>
        <img src={icon} alt='' className={`hw-icon-sm ${iconClassName}`} />
      </div>
    );
  }

  if (icon) {
    const IconComponent = icon as React.ElementType;
    return (
      <div className={containerClasses}>
        <IconComponent className={`hw-icon-sm ${colorClass} ${iconClassName}`} />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <ChevronRight className={`hw-icon-sm ${colorClass}`} />
    </div>
  );
}


