'use client';

import TraitTag from '@/components/common/TraitTag';
import * as CompactButton from '@/components/alignui/compact-button';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import React, { useRef, useState, useEffect } from 'react';

interface TraitTagContainerProps {
  traitIds: string[];
  className?: string;
}

export default function TraitTagContainer({ traitIds, className = "" }: TraitTagContainerProps) {
  const [emblaApi, setEmblaApi] = useState<any>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const emblaRef = useRef<HTMLDivElement>(null);

  // Embla-like scroll logic (manual, since we don't use embla-carousel-react)
  useEffect(() => {
    const container = emblaRef.current;
    if (!container) return;

    const scrollableEl = container.querySelector('.overflow-x-auto') as HTMLElement;
    if (!scrollableEl) return;

    const updateButtonStates = () => {
      setCanScrollPrev(scrollableEl.scrollLeft > 0);
      setCanScrollNext(scrollableEl.scrollLeft + scrollableEl.clientWidth < scrollableEl.scrollWidth - 1);
    };

    scrollableEl.addEventListener('scroll', updateButtonStates);
    window.addEventListener('resize', updateButtonStates);
    updateButtonStates();
    return () => {
      scrollableEl.removeEventListener('scroll', updateButtonStates);
      window.removeEventListener('resize', updateButtonStates);
    };
  }, [traitIds]);

  const scrollPrev = () => {
    const container = emblaRef.current;
    if (!container) return;
    const scrollableEl = container.querySelector('.overflow-x-auto') as HTMLElement;
    if (scrollableEl) {
      scrollableEl.scrollBy({ left: -120, behavior: 'smooth' });
    }
  };
  const scrollNext = () => {
    const container = emblaRef.current;
    if (!container) return;
    const scrollableEl = container.querySelector('.overflow-x-auto') as HTMLElement;
    if (scrollableEl) {
      scrollableEl.scrollBy({ left: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className='flex items-center justify-between gap-2'>
        <div className='text-subheading-xs uppercase tracking-wide text-text-soft-400'>
          Traits
        </div>
        <div className='flex gap-2'>
          <CompactButton.Root
            size='medium'
            variant='ghost'
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <CompactButton.Icon as={RiArrowLeftSLine} />
          </CompactButton.Root>
          <CompactButton.Root
            size='medium'
            variant='ghost'
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <CompactButton.Icon as={RiArrowRightSLine} />
          </CompactButton.Root>
        </div>
      </div>

      <div className='-mx-[15px] overflow-hidden px-[15px]' ref={emblaRef}>
        <div className='flex gap-2 overflow-x-auto scrollbar-hide' style={{ scrollBehavior: 'smooth' }}>
          {traitIds.map((traitId, idx) => (
            <TraitTag key={traitId || idx} traitId={traitId} size="normal" className="flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
}