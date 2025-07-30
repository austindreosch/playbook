'use client';

import FillArrowUp from '@/components/icons/FillArrowUp';
import FillArrowDown from '@/components/icons/FillArrowDown';

interface ValueComparison {
  type: string;
  value: number;
  rank: number;
  change: string | null;
  changeType: 'positive' | 'negative' | null;
  subtitle: string | null;
}

interface ValueComparisonTableProps {
  valueComparisons: ValueComparison[];
}

export default function ValueComparisonTable({ valueComparisons }: ValueComparisonTableProps) {
  return (
    <div className="flex h-10 w-full shrink-0 mdh:h-12">
      <div className="flex w-full gap-1 mdh:gap-2">
        <div className="flex w-full justify-between text-center">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex items-center gap-0.5 text-subheading-2xs font-medium text-success-base mdh:text-subheading-xs">
              <FillArrowUp className="icon-2xs mdh:icon-xs" />
              6%
            </div>
            <div className="text-paragraph-xs leading-none text-text-soft-400 mdh:pt-0.5 mdh:text-subheading-2xs mdh:leading-tight">
              Playbook<br />Differential
            </div>
          </div>

          <div className="h-full w-px self-center bg-stroke-soft-200"></div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex items-center gap-0.5 text-subheading-2xs font-medium text-error-base mdh:text-subheading-xs">
              <FillArrowDown className="icon-2xs mdh:icon-xs" />
              2%
            </div>
            <div className="text-paragraph-xs leading-none text-text-soft-400 mdh:pt-0.5 mdh:text-subheading-2xs mdh:leading-tight">
              Value Over<br />Last 30
            </div>
          </div>
          
          <div className="h-full w-px self-center bg-stroke-soft-200"></div>
          
          <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
            <div className="flex items-center gap-0.5 text-subheading-2xs font-medium text-error-base mdh:text-subheading-xs">
              <FillArrowDown className="icon-2xs mdh:icon-xs" />
              21%
            </div>
            <div className="text-paragraph-xs leading-none text-text-soft-400 mdh:pt-0.5 mdh:text-subheading-2xs mdh:leading-tight">
              Performance vs.<br />Offseason Proj.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}