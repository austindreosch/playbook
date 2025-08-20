import { Skeleton } from "../ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="absolute inset-x-0 top-16 bottom-0">
      <div className="h-full py-4 flex flex-col">
        {/* Top navigation bar */}
        <div className="relative flex items-center">
          <Skeleton className="h-11 w-3/5 rounded-br-none bg-stroke-soft-200" />
          <div className="grid grid-cols-12 gap-2 w-2/5 items-center pb-3">
            <span className=" col-span-1 h-8 rounded"></span>
            <Skeleton className="h-8 col-span-3 rounded bg-stroke-soft-100" />
            <Skeleton className="h-8 col-span-6 rounded bg-stroke-soft-100" />
            <Skeleton className="h-8 col-span-1 rounded bg-stroke-soft-100" />
            <Skeleton className="h-8 col-span-1 rounded bg-stroke-soft-100" />
          </div>
          <div className="absolute bottom-0 right-0 w-1/2">
            <Skeleton className="h-[2px] w-full bg-stroke-soft-50" />
          </div>
        </div>
        
        <div className="grid w-full pt-3 ">
          <div className="flex w-full justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-64 rounded bg-stroke-soft-100" />
              <Skeleton className="h-8 w-96 rounded bg-stroke-soft-100" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-8 w-11 rounded bg-stroke-soft-100" />
              <Skeleton className="h-8 w-11 rounded bg-stroke-soft-100" />
              <Skeleton className="h-8 w-72 rounded bg-stroke-soft-100" />
            </div>
          </div>
        </div>

        <div className="w-full py-3">
          <Skeleton className="h-[2px] w-full bg-bg-weak-50" />
        </div>

        <div className="flex-1 grid grid-cols-11 grid-rows-2 gap-2 w-full min-h-0">
          {/* Left column (sidebar) */}
            <Skeleton className="col-span-3 row-span-2 w-full h-full bg-stroke-soft-100" />

          {/* Main content area (right) */}
          <div className="col-span-8 row-span-2 grid grid-cols-7 gap-2 w-full h-full">
            <div className="col-span-2 grid grid-rows-6 gap-2">
                <Skeleton className="w-full h-full row-span-4 bg-stroke-soft-100" />
                <Skeleton className="w-full h-full row-span-2 bg-stroke-soft-100" />
            </div>
            <div className="col-span-3 grid grid-rows-3 gap-2">
                <Skeleton className="w-full h-full row-span-1 bg-stroke-soft-100" />
                <Skeleton className="w-full h-full row-span-2 bg-stroke-soft-100" />
            </div>
            <div className="col-span-2 grid grid-rows-2 gap-2">
                <Skeleton className="w-full h-full row-span-1 bg-stroke-soft-100" />
                <Skeleton className="w-full h-full row-span-1 bg-stroke-soft-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 