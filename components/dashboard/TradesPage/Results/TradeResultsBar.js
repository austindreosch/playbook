export default function TradeResultsBar() {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        {/* Main bar container */}
        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Percentage indicator */}
          <div className="absolute top-2 right-4 text-white font-bold text-lg z-10">
            91%
          </div>
          
          {/* Progress bar */}
          <div className="flex h-16 relative">
            {/* Green section (winning candidates) */}
            <div 
              className="bg-green-400 flex items-center justify-center text-white text-xs font-medium uppercase tracking-wider"
              style={{ width: '91%' }}
            >
              <div className="flex justify-between w-full px-4">
                <span>ADEBAYO</span>
                <span>BRUNSON</span>
                <span>GILGEOUS-ALEXANDER</span>
              </div>
            </div>
            
            {/* Red section (losing candidates) */}
            <div 
              className="bg-red-400 flex items-center justify-center text-white text-xs font-medium uppercase tracking-wider"
              style={{ width: '9%' }}
            >
              <div className="flex justify-between w-full px-2">
                <span className="text-[10px]">ANTETOKOUNMPO</span>
                <span className="text-[10px]">CAPELA</span>
              </div>
            </div>
          </div>
          
          {/* Divider line */}
          <div className="absolute top-0 bottom-0 bg-gray-700 w-0.5 z-20" style={{ left: '91%' }}>
            {/* Plus icon */}
            <div className="absolute -top-1 -left-2 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>
        </div>
        
        {/* Bottom thin line indicator */}
        <div className="flex h-2 mt-1 relative">
          {/* Green section bottom line */}
          <div 
            className="bg-green-400"
            style={{ width: '91%' }}
          ></div>
          
          {/* Red section bottom line */}
          <div 
            className="bg-red-400"
            style={{ width: '9%' }}
          ></div>
          
          {/* Divider line for bottom */}
          <div className="absolute top-0 bottom-0 bg-gray-700 w-0.5" style={{ left: '91%' }}></div>
        </div>
        
        {/* Vote margin indicator */}
        <div className="mt-2 text-center">
          <span className="text-green-500 font-bold text-xl">+7,942</span>
        </div>
      </div>
    );
  }