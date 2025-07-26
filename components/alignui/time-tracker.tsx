'use client';

import * as React from 'react';
import {
  RiPauseCircleFill,
  RiPlayCircleFill,
  RiPlayMiniFill,
  RiStopCircleFill,
} from '@remixicon/react';
import {
  millisecondsToHours,
  millisecondsToMinutes,
  millisecondsToSeconds,
} from 'date-fns';
import { TimerRenderer, useStopwatch } from 'react-use-precision-timer';

import * as LinkButton from '@/components/ui/link-button';
import { DigitScroll } from '@/components/digit-scroll';

function formatTime(ms: number) {
  const hours = millisecondsToHours(ms);
  const minutes = millisecondsToMinutes(ms) % 60;
  const seconds = millisecondsToSeconds(ms) % 60;

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

type TimeTrackerProps = {
  onStart?: () => void;
  onStop?: (elapsedTime: number) => void;
  onPause?: (elapsedTime: number) => void;
  onResume?: () => void;
};

export function TimeTracker({
  onStart,
  onStop,
  onPause,
  onResume,
}: TimeTrackerProps) {
  const stopwatch = useStopwatch();

  const handleStart = () => {
    stopwatch.start();
    if (onStart) onStart();
  };

  const handleStop = () => {
    if (onStop) onStop(stopwatch.getElapsedRunningTime());
    stopwatch.stop();
  };

  const handlePause = () => {
    stopwatch.pause();
    if (onPause) onPause(stopwatch.getElapsedRunningTime());
  };

  const handleResume = () => {
    stopwatch.resume();
    if (onResume) onResume();
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='text-center text-title-h3 tabular-nums text-text-strong-950'>
        <TimerRenderer
          timer={stopwatch}
          renderRate={500}
          render={(t) => {
            const { hours, minutes, seconds } = formatTime(
              t.getElapsedRunningTime(),
            );
            return (
              <>
                <DigitScroll size='2.5rem' value={hours} />:
                <DigitScroll size='2.5rem' value={minutes} />:
                <span className='text-text-soft-400'>
                  <DigitScroll size='2.5rem' value={seconds} />
                </span>
              </>
            );
          }}
        />
      </div>
      <div className='mt-2.5 flex justify-center'>
        {!stopwatch.isStarted() && (
          <LinkButton.Root
            size='medium'
            variant='primary'
            onClick={handleStart}
            data-cursor-type='pointer'
          >
            <LinkButton.Icon as={RiPlayMiniFill} />
            Start Time Tracker
          </LinkButton.Root>
        )}
        {stopwatch.isStarted() && (
          <div className='flex items-center gap-3'>
            {!stopwatch.isPaused() ? (
              <LinkButton.Root
                size='medium'
                variant='black'
                onClick={handlePause}
                data-cursor-type='pointer'
              >
                <LinkButton.Icon as={RiPauseCircleFill} />
                Pause
              </LinkButton.Root>
            ) : (
              <LinkButton.Root
                size='medium'
                variant='black'
                onClick={handleResume}
                data-cursor-type='pointer'
              >
                <LinkButton.Icon as={RiPlayCircleFill} />
                Resume
              </LinkButton.Root>
            )}
            <div className='h-3 w-px bg-stroke-soft-200' role='separator' />
            <LinkButton.Root
              size='medium'
              variant='error'
              onClick={handleStop}
              data-cursor-type='pointer'
            >
              <LinkButton.Icon as={RiStopCircleFill} />
              Stop
            </LinkButton.Root>
          </div>
        )}
      </div>
    </div>
  );
}
