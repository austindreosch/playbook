'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn } from '@/utils/cn';
import * as Textarea from '@/components/ui/textarea';

type RatingBarWithTextareaProps = {
  data: {
    value: string;
    label: string;
  }[];
  onRatingChange?: (value: string | undefined) => void;
  onTextChange?: (value: string) => void;
  placeholder?: string;
};

export const RatingBarWithTextarea = React.forwardRef<
  HTMLTextAreaElement,
  RatingBarWithTextareaProps
>(({ data, onTextChange, onRatingChange, placeholder = '' }, forwardedRef) => {
  const [selectedRating, setSelectedRating] = React.useState<string>();
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    if (onTextChange) onTextChange(text);
  }, [text]);

  React.useEffect(() => {
    if (onRatingChange) onRatingChange(selectedRating);
  }, [selectedRating]);

  return (
    <div className='flex flex-col -space-y-px'>
      <ToggleGroupPrimitive.Root
        type='single'
        className='flex w-full -space-x-px'
        onValueChange={setSelectedRating}
        value={selectedRating}
      >
        {data.map((item, i) => (
          <ToggleGroupPrimitive.Item
            key={i}
            value={item.value}
            className={cn(
              'group grid h-9 w-full items-center justify-center text-label-sm text-text-sub-600 ring-1 ring-inset ring-stroke-soft-200',
              'transition duration-200 ease-out',
              'first:rounded-tl-xl last:rounded-tr-xl',
              // hover
              'hover:bg-bg-weak-50',
              // focus
              'outline-none focus:outline-none',
              'focus-visible:z-10 focus-visible:!border-transparent focus-visible:ring-1 focus-visible:ring-stroke-strong-950',
              // selected
              'data-[state=on]:bg-bg-weak-50 data-[state=on]:text-text-strong-950',
            )}
          >
            {item.label}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
      <Textarea.Root
        ref={forwardedRef}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        simple
        className='h-[85px] min-h-0 resize-none rounded-t-none shadow-none hover:[&:not(:focus)]:!ring-stroke-soft-200'
      />
    </div>
  );
});

RatingBarWithTextarea.displayName = 'RatingBarWithTextarea';
