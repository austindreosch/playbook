import { Layers, Telescope } from 'lucide-react';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import { cn } from '@/utils/cn';



const gamesRemaining = 12

export default function 
StandingsBlock() {
  return (
    <div className="w-full h-full rounded-lg border border-gray-200 shadow-sm p-3 bg-white flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-2 flex-shrink-0 justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="hw-icon text-black" />
          <h3 className="text-label-xl font-semibold text-black">Standings</h3>
        </div>


        <div className='flex items-center gap-1.5'>
          <div className="flex items-center justify-center gap-1">
            <span className="text-label-lg text-gray-400">42</span>
            <span className="text-label-lg text-gray-200">-</span>
            <span className="text-label-lg text-gray-400">19</span>
            <span className="text-label-lg text-gray-200">-</span>
            <span className="text-label-lg text-gray-400">2</span>
          </div>
          <Badge.Root variant="rank" color="gray" size="medium">
            4th
          </Badge.Root>
        </div>
      </div>
      

      <Divider.Root variant='line-spacing' className='mb-3 mt-1 bg-text-gray-00' />
      
      {/* Stats Row */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-1">
            <span className="text-title-h5 font-bold text-gray-400">5</span>
            <span className="text-title-h5 font-bold text-gray-200">-</span>
            <span className="text-title-h5 font-bold text-gray-400">2</span>
            <span className="text-title-h5 font-bold text-gray-200">-</span>
            <span className="text-title-h5 font-bold text-gray-400">0</span>
          </div>
          <div className="text-paragraph-sm text-gray-300 mt-1">Matchups</div>
        </div>
        
        <div className="text-center flex-1">
          <div className='flex gap-0.5 text-center justify-center'>
            <div className="text-title-h5 font-bold text-green-600">3</div>
            <div className="text-title-h5 font-bold text-green-600">W</div>
          </div>
          <div className="text-paragraph-sm text-gray-300 mt-1">Streak</div>
        </div>
        
        <div className="text-center flex-1">
          <div className="text-title-h5 w-14 mx-auto font-bold bg-green-100 text-green-800 px-1 py-0.5 rounded ">
            61%
          </div>
          <div className="text-paragraph-sm text-gray-300 mt-1">Playoffs Odds</div>
        </div>
      </div>
      

      <Divider.Root variant='line-spacing' className='mb-3 mt-1 bg-text-gray-00' />

      {/*  */}
      {/* Strength of Schedule */}
      {/*  */}
      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Telescope className="hw-icon-sm text-black" />
            <span className="text-label-lg text-gray-450">Strength of Schedule</span>
          </div>
          {/* <span className="text-xs text-gray-500">7th</span> */}
          <Badge.Root variant="rank" color="gray" size="medium">
            7th
          </Badge.Root>
        </div>
      
        {/* Schedule Difficulty Bars */}

        <div className="grid grid-flow-col gap-1 h-11">
          <div className="h-full bg-green-400 rounded-sm"></div>
          <div className="h-full bg-red-300 rounded-sm"></div>
          <div className="h-full bg-green-200 rounded-sm"></div>
          <div className="h-full bg-red-500 rounded-sm"></div>
          <div className="h-full bg-green-100 rounded-sm"></div>
          <div className="h-full bg-red-200 rounded-sm"></div>
          <div className="h-full bg-red-400 rounded-sm"></div>
          <div className="h-full bg-green-300 rounded-sm"></div>
          <div className="h-full bg-green-400 rounded-sm"></div>
          <div className="h-full bg-red-500 rounded-sm"></div>
          <div className="h-full bg-red-100 rounded-sm"></div>
          <div className="h-full bg-green-100 rounded-sm"></div>
        </div>




      </div>
    </div>
  );
}