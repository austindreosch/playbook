'use client';

import { Skeleton } from "@/components/ui/skeleton";

const RankingsPlayerListSkeleton = ({ rowCount = 16 }) => {
  return (
    <div className="space-y-1 pt-1">
      {[...Array(rowCount)].map((_, i) => (
        <div key={i} className="flex w-full h-[40px] mb-1 bg-white py-1">
          {/* Left Section (30%) */}
          <div className="flex items-center w-[30%] px-2 space-x-3 flex-shrink-0">
            <Skeleton className="h-7 w-7 rounded-md flex-shrink-0" /> 
            <Skeleton className="h-4 rounded-sm w-48" />
          </div>
          {/* Right Section (70%) */}
          <div className="flex w-[70%] h-full gap-2 flex-grow rounded-r-md">
            {[...Array(9)].map((_, j) => (
              <Skeleton key={j} className="h-full flex-1 rounded-sm" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RankingsPlayerListSkeleton; 