'use client';

import * as React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as ButtonGroup from '@/components/ui/button-group';

export function CardSwitchContainer({
  children,
  onActiveCardChange,
}: {
  children: React.ReactNode;
  onActiveCardChange?: (activeCardId: string) => void;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [prevIndex, setPrevIndex] = React.useState(0);
  const childrenArray = React.Children.toArray(children);
  const childrenCount = childrenArray.length;

  React.useEffect(() => {
    const currentCardId = (
      childrenArray[activeIndex] as React.ReactElement<any>
    ).props.id;
    if (onActiveCardChange) {
      onActiveCardChange(currentCardId);
    }
  }, [activeIndex, onActiveCardChange, childrenArray]);

  const mappedChildren = React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const childProps = (child as React.ReactElement<any>).props;
    const isActive = i === activeIndex;
    const isBeforeActive = i < activeIndex;
    const isNotPrevOrActive = i !== prevIndex && i !== activeIndex;

    return React.cloneElement(child, {
      ...childProps,
      className: cn(childProps?.className, 'absolute left-0 top-0'),
      style: {
        ...childProps?.style,
        zIndex: ++i,
        transform: isActive
          ? 'rotateY(0deg)'
          : isBeforeActive
            ? 'rotateY(-180deg)'
            : 'rotateY(180deg)',
        visibility: isNotPrevOrActive && 'hidden',
      },
    });
  });

  return (
    <div className='relative mx-auto w-full max-w-96'>
      <div className='relative h-[188px] w-full overflow-visible [perspective:1000px] [transform-style:preserve-3d]'>
        {mappedChildren}
      </div>
      {childrenCount > 1 ? (
        <ButtonGroup.Root size='xxsmall' className='absolute bottom-4 right-4'>
          <ButtonGroup.Item
            disabled={activeIndex === 0}
            onClick={() => {
              setPrevIndex(activeIndex);
              setActiveIndex((p) => (p - 1 + childrenCount) % childrenCount);
            }}
          >
            <ButtonGroup.Icon as={RiArrowLeftSLine} />
          </ButtonGroup.Item>
          <ButtonGroup.Item
            disabled={activeIndex === childrenCount - 1}
            onClick={() => {
              setPrevIndex(activeIndex);
              setActiveIndex((p) => (p + 1) % childrenCount);
            }}
          >
            <ButtonGroup.Icon as={RiArrowRightSLine} />
          </ButtonGroup.Item>
        </ButtonGroup.Root>
      ) : null}
    </div>
  );
}
