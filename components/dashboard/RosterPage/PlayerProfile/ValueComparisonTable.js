'use client';

import FillArrowUp from '@/components/icons/FillArrowUp';
import FillArrowDown from '@/components/icons/FillArrowDown';

export default function ValueComparisonTable({ valueComparisons }) {
  return (
    <div className="flex-shrink-0 max-h-10 min-h-10 mdh:max-h-12 mdh:min-h-12">
      <div className="flex gap-1 mdh:gap-2">
        {/* Metrics indicators */}
        <div className="flex flex-row justify-between text-center w-full">
          <div className="flex flex-col justify-center items-center text-center flex-1">
            <div className="text-subheading-2xs font-medium text-success-base mdh:text-subheading-xs flex items-center gap-0.5">
              <FillArrowUp className="icon-2xs mdh:icon-xs" />
              6%
            </div>
            <div className="text-paragraph-xs text-text-soft-400 leading-none mdh:text-subheading-2xs mdh:leading-tight mdh:pt-0.5">Playbook<br />Differential</div>
          </div>

          <div className="w-px h-full bg-stroke-soft-200 self-center"></div>

          <div className="flex flex-col justify-center items-center text-center flex-1">
            <div className="text-subheading-2xs font-medium text-error-base mdh:text-subheading-xs flex items-center gap-0.5">
              <FillArrowDown className="icon-2xs mdh:icon-xs" />
              2%
            </div>
            <div className="text-paragraph-xs text-text-soft-400 leading-none mdh:text-subheading-2xs mdh:leading-tight mdh:pt-0.5">Value Over<br />Last 30</div>
          </div>
          
          <div className="w-px h-full bg-stroke-soft-200 self-center"></div>
          
          <div className="flex flex-col justify-center items-center text-center flex-1 px-2">
            <div className="text-subheading-2xs font-medium text-error-base mdh:text-subheading-xs flex items-center gap-0.5">
              <FillArrowDown className="icon-2xs mdh:icon-xs" />
              21%
            </div>
            <div className="text-paragraph-xs text-text-soft-400 leading-none mdh:text-subheading-2xs mdh:leading-tight mdh:pt-0.5">Performance vs.<br />Offseason Proj.</div>
          </div>
        </div>
      </div>
    </div>
  );
}