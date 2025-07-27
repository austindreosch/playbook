'use client';

import TraitTag from '@/components/common/TraitTag';
import * as CompactButton from '@/components/alignui/compact-button';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import React, { useRef, useState, useEffect } from 'react';

export default function TraitTagContainer({ traitIds, className = "" }) {
  const [emblaApi, setEmblaApi] = useState(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const emblaRef = useRef(null);

  // Embla-like scroll logic (manual, since we don't use embla-carousel-react)
  useEffect(() => {
    const el = emblaRef.current;
    if (!el) return;

    const updateButtonStates = () => {
      setCanScrollPrev(el.scrollLeft > 0);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    el.addEventListener('scroll', updateButtonStates);
    window.addEventListener('resize', updateButtonStates);
    updateButtonStates();
    return () => {
      el.removeEventListener('scroll', updateButtonStates);
      window.removeEventListener('resize', updateButtonStates);
    };
  }, [traitIds]);

  const scrollPrev = () => {
    const el = emblaRef.current;
    if (!el) return;
    el.scrollBy({ left: -120, behavior: 'smooth' });
  };
  const scrollNext = () => {
    const el = emblaRef.current;
    if (!el) return;
    el.scrollBy({ left: 120, behavior: 'smooth' });
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className='flex items-center justify-between gap-2'>
        <div className='text-subheading-xs uppercase text-text-soft-400'>
          Traits ({traitIds.length})
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
        <div className='flex gap-2 overflow-x-auto' style={{ scrollBehavior: 'smooth' }}>
          {traitIds.map((traitId, idx) => (
            <TraitTag key={traitId || idx} traitId={traitId} size="normal" className="flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
}