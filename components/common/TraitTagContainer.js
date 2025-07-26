'use client';

import TraitTag from '@/components/common/TraitTag';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Root as ButtonRoot } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

export default function TraitTagContainer({ traitIds, maxRows = 3, className = "" }) {
  const tagsContainerRef = useRef(null);
  const hiddenMeasureRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [visibleTagsCount, setVisibleTagsCount] = useState(traitIds.length);

  // Calculate how many tags can fit dynamically by measuring actual widths
  useEffect(() => {
    const calculateVisibleTags = () => {
      const screenHeight = window.innerHeight;
      const isSmall = screenHeight <= 650;
      setIsSmallScreen(isSmall);

      if (!tagsContainerRef.current || !hiddenMeasureRef.current) return;

      const containerWidth = tagsContainerRef.current.offsetWidth;
      const gap = 4;
      
      // Measure actual tag and button widths
      const allElements = hiddenMeasureRef.current.children;
      const tagElements = Array.from(allElements).slice(0, -1); // All except last (View All button)
      const viewAllButton = allElements[allElements.length - 1]; // Last element is View All button
      const viewAllButtonWidth = viewAllButton.offsetWidth;
      const totalTags = traitIds.length;
      
      console.log('TraitTagContainer calc:', { containerWidth, totalTags, isSmall, viewAllButtonWidth });
      
      if (isSmall) {
        // Small screens: 1 row only - fit as many as possible with View All
        let currentWidth = 0;
        let fittingTags = 0;
        
        for (let i = 0; i < tagElements.length; i++) {
          const tagWidth = tagElements[i].offsetWidth;
          const neededWidth = currentWidth + tagWidth + (fittingTags > 0 ? gap : 0);
          
          // Check if we can fit this tag + View All button
          if (neededWidth + gap + viewAllButtonWidth <= containerWidth) {
            currentWidth = neededWidth;
            fittingTags++;
          } else {
            break;
          }
        }
        
        console.log('Small screen: fitting', fittingTags, 'tags');
        setVisibleTagsCount(Math.min(fittingTags, totalTags));
        
      } else {
        // Large screens: maxRows max - count tags that fit in maxRows, reserve space for View All
        let currentRowWidth = 0;
        let currentRow = 1;
        let fittingTags = 0;
        
        for (let i = 0; i < tagElements.length; i++) {
          const tagWidth = tagElements[i].offsetWidth;
          const neededWidth = currentRowWidth + tagWidth + (currentRowWidth > 0 ? gap : 0);
          
          if (neededWidth <= containerWidth) {
            // Fits in current row
            currentRowWidth = neededWidth;
            fittingTags++;
          } else if (currentRow < maxRows) {
            // Start new row
            currentRow++;
            currentRowWidth = tagWidth;
            fittingTags++;
          } else {
            // Would exceed maxRows
            break;
          }
        }
        
        // Reserve space for View All button
        const maxVisibleTags = Math.max(0, fittingTags - 1);
        console.log(`Large screen: fitting ${maxVisibleTags} tags in ${maxRows} rows`);
        setVisibleTagsCount(maxVisibleTags);
      }
    };

    calculateVisibleTags();
    window.addEventListener('resize', calculateVisibleTags);
    
    const timer = setTimeout(calculateVisibleTags, 100);
    
    return () => {
      window.removeEventListener('resize', calculateVisibleTags);
      clearTimeout(timer);
    };
  }, [traitIds, maxRows]);

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden container for measuring actual tag and button widths */}
      <div 
        ref={hiddenMeasureRef}
        className="absolute invisible pointer-events-none flex flex-wrap gap-1"
        style={{ width: tagsContainerRef.current?.offsetWidth || '100%' }}
      >
        {traitIds.map((traitId, index) => (
          <TraitTag 
            key={`measure-${index}`} 
            traitId={traitId} 
            size={isSmallScreen ? 'small' : 'normal'}
          />
        ))}
        {/* Hidden View All button for measuring */}
        <ButtonRoot 
          variant="neutral" 
          mode="stroke" 
          size={isSmallScreen ? "xxsmall" : "xxsmall"}
          className="flex-shrink-0"
        >
          <span>View All</span>
        </ButtonRoot>
      </div>

      {/* Visible tags container - only render calculated number of tags */}
      <div 
        ref={tagsContainerRef}
        className="flex gap-1 flex-wrap justify-center"
        style={isSmallScreen ? { 
          height: '20px', // Smaller height for one row on small screens
          flexWrap: 'nowrap'
        } : {
          maxHeight: `${maxRows * 28}px`, // Dynamic max height based on maxRows
          alignContent: 'flex-start'
        }}
      >
        {/* Render only the visible tags */}
        {traitIds.slice(0, visibleTagsCount).map((traitId, index) => (
          <TraitTag 
            key={index} 
            traitId={traitId} 
            size={isSmallScreen ? 'small' : 'normal'}
            className="flex-shrink-0"
          />
        ))}
        
        {/* View All button - show when there are more tags than visible */}
        {visibleTagsCount < traitIds.length && (
          <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
              <ButtonRoot 
                variant="neutral" 
                mode="stroke" 
                size={isSmallScreen ? "xxsmall" : "xxsmall"}
                className="flex-shrink-0"
              >
                <span>View All</span>
              </ButtonRoot>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-80 p-3" align="start">
              <div className="flex flex-wrap gap-1">
                {traitIds.map((traitId, index) => (
                  <TraitTag key={`popover-${index}`} traitId={traitId} showTooltip={false} />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}