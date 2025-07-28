'use client';

import FillArrowUp from '@/components/icons/FillArrowUp';
import FillArrowDown from '@/components/icons/FillArrowDown';

export default function ValueComparisonTable({ valueComparisons }) {
  return (
    <div className="flex-shrink-0 max-h-10 min-h-10 mdh:max-h-12 mdh:min-h-12">
      <div className="flex gap-1 mdh:gap-2">
        {/* Right side - Change indicators */}
        <div className="flex flex-row justify-between text-center w-full">
          <div className="flex flex-col justify-center items-center text-center flex-1">
            <div className="text-3xs font-medium text-pb_green mdh:text-2xs flex items-center gap-0.5">
              <FillArrowUp className="w-1.5 h-1.5 mdh:w-2 mdh:h-2" />
              6%
            </div>
            <div className="text-4xs text-pb_textgray leading-none mdh:text-3xs mdh:leading-tight mdh:pt-0.5">Playbook<br />Differential</div>
          </div>

          <div className="w-px h-full bg-pb_lightgray self-center"></div>

          <div className="flex flex-col justify-center items-center text-center flex-1">
            <div className="text-3xs font-medium text-pb_red mdh:text-2xs flex items-center gap-0.5">
              <FillArrowDown className="w-1.5 h-1.5 mdh:w-2 mdh:h-2" />
              2%
            </div>
            <div className="text-4xs text-pb_textgray leading-none mdh:text-3xs mdh:leading-tight mdh:pt-0.5">Value Over<br />Last 30</div>
          </div>
          
          <div className="w-px h-full bg-pb_lightgray self-center"></div>
          
          <div className="flex flex-col justify-center items-center text-center flex-1 px-2">
            <div className="text-3xs font-medium text-pb_red mdh:text-2xs flex items-center gap-0.5">
              <FillArrowDown className="w-1.5 h-1.5 mdh:w-2 mdh:h-2" />
              21%
            </div>
            <div className="text-4xs text-pb_textgray leading-none mdh:text-3xs mdh:leading-tight mdh:pt-0.5">Performance vs.<br />Offseason Proj.</div>
          </div>
        </div>
      </div>
    </div>
  );
}