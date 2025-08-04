'use client';

import * as React from 'react';
import { useMeasure } from '@uidotdev/usehooks';

export function ProgressChart({ value }: { value: number }) {
  const [containerRef, { width }] = useMeasure();

  const computedProgress = React.useMemo(() => {
    const progressWidth = (value / 100) * width!;
    return Math.round(progressWidth / 9) * 9;
  }, [value, width]);

  const computedWidth = React.useMemo(() => {
    return Math.round(width! / 9) * 9;
  }, [width]);

  return (
    <div ref={containerRef} className='w-full'>
      <div
        className='relative h-8 w-full bg-error-base'
        style={{
          WebkitMaskImage: `linear-gradient(90deg, #000 6px, #0000 6px)`,
          maskImage: `linear-gradient(90deg, #000 6px, #0000 6px)`,
          maskSize: '9px 100%',
          maskRepeat: 'space',
          backgroundPosition: '0 0',
          width: computedWidth,
        }}
      >
        <div
          className='h-full [clip-path:inset(0)]'
          style={{
            width: `${computedProgress}px`,
          }}
        >
          <div className='absolute inset-0 bg-success-base' />
        </div>
      </div>
    </div>
  );
}