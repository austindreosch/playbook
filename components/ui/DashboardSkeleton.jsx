import { Skeleton } from "./skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="absolute inset-x-0 top-16 bottom-0">
      <div className="container mx-auto h-full py-4 flex flex-col">
        {/* Top navigation bar */}
        <div className="relative flex items-center">
          <Skeleton className="h-11 w-1/2 rounded-br-none bg-pb_lightgray" />
          <div className="grid grid-cols-15 gap-2 w-1/2 items-center pb-3">
            <span className="col-start-4 col-span-1 h-8 rounded"></span>
            <Skeleton className="h-8 col-span-3 rounded bg-pb_lightestgray" />
            <Skeleton className="h-8 col-span-5 rounded bg-pb_lightestgray" />
            <Skeleton className="h-8 col-span-3 rounded bg-pb_lightestgray" />
          </div>
          <div className="absolute bottom-0 right-0 w-1/2">
            <Skeleton className="h-[2px] w-full bg-pb_lightestgray" />
          </div>
        </div>
        
        <div className="grid grid-cols-20 gap-2 w-full pt-3">
          <Skeleton className="h-8 col-span-3 rounded bg-pb_lightestgray" />
          <Skeleton className="h-8 col-span-6 rounded bg-pb_lightestgray" />
          <div className="col-span-6"></div>
          <Skeleton className="h-8 col-span-2 rounded bg-pb_lightergray" />
          <Skeleton className="h-8 col-span-3 rounded bg-pb_lightergray" />
        </div>

        <div className="w-full py-3">
          <Skeleton className="h-[2px] w-full bg-pb_backgroundgray" />
        </div>

        <div className="flex-1 grid grid-cols-11 grid-rows-2 gap-6 w-full min-h-0">
          {/* Left column (sidebar) */}
            <Skeleton className="col-span-3 row-span-2 w-full h-full bg-pb_lightergray" />

          {/* Main content area (right) */}
          <div className="col-span-8 row-span-2 grid grid-cols-7 gap-2 w-full h-full">
            <div className="col-span-2 grid grid-rows-6 gap-2">
                <Skeleton className="w-full h-full row-span-4 bg-pb_lightestgray" />
                <Skeleton className="w-full h-full row-span-2 bg-pb_lightestgray" />
            </div>
            <div className="col-span-3 grid grid-rows-3 gap-2">
                <Skeleton className="w-full h-full row-span-1 bg-pb_lightestgray" />
                <Skeleton className="w-full h-full row-span-2 bg-pb_lightestgray" />
            </div>
            <div className="col-span-2 grid grid-rows-2 gap-2">
                <Skeleton className="w-full h-full row-span-1 bg-pb_lightestgray" />
                <Skeleton className="w-full h-full row-span-1 bg-pb_lightestgray" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 