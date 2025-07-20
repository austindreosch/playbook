'use client';

export default function ValueComparisonTable({ valueComparisons }) {
  return (
    <div className="mb-4 flex-shrink-0 max-h-16 min-h-16">
      <div className="flex gap-4">
        {/* Right side - Change indicators */}
        <div className="flex flex-row justify-between text-center w-full px-1">
          <div className="flex flex-col justify-center items-center text-center flex-1">
            <div className="text-sm font-medium text-pb_green">▲ 6%</div>
            <div className="text-3xs text-pb_textgray leading-tight">Playbook<br />Differential</div>
          </div>
          <div className="w-px h-8 bg-pb_lightgray self-center"></div>
          <div className="flex flex-col justify-center items-center text-center flex-1">
            <div className="text-sm font-medium text-pb_red">▼ 2%</div>
            <div className="text-3xs text-pb_textgray leading-tight">Value Over<br />Last 30</div>
          </div>
          <div className="w-px h-8 bg-pb_lightgray self-center"></div>
          <div className="flex flex-col justify-center items-center text-center flex-1">
            <div className="text-sm font-medium text-pb_red">▼ 21%</div>
            <div className="text-3xs text-pb_textgray leading-tight">Performance vs.<br />Offseason Proj.</div>
          </div>
        </div>
      </div>
    </div>
  );
}