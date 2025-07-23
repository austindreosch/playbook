import * as React from 'react';

import { cnExt } from '@/utils/cn';

type LegendDotProps = {
  size?: 'small' | 'medium';
} & React.HTMLAttributes<HTMLDivElement>;

export function LegendDot({
  size = 'small',
  className,
  ...rest
}: LegendDotProps) {
  return (
    <div
      className={cnExt(
        'shrink-0 rounded-full border-2 border-stroke-white-0 bg-bg-soft-200 shadow-regular-sm',
        {
          'size-2.5': size === 'small',
          'size-3': size === 'medium',
        },
        className,
      )}
      {...rest}
    />
  );
}
