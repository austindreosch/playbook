'use client';

export default function HistoricalViewGraph({ historicalData }) {
  const createLineChart = () => {
    const { dataPoints, yAxisMin, yAxisMax } = historicalData;
    const width = 280;
    const height = 80;
    const padding = 20;
    
    const xStep = (width - padding * 2) / (dataPoints.length - 1);
    const yRange = yAxisMax - yAxisMin;
    
    const points = dataPoints.map((point, index) => {
      const x = padding + (index * xStep);
      const y = height - padding - ((point.value - yAxisMin) / yRange) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="w-full">
        {/* Grid line at middle */}
        <line 
          x1={padding} 
          y1={height/2} 
          x2={width-padding} 
          y2={height/2} 
          stroke="#d7d7d7" 
          strokeDasharray="2,2"
        />
        {/* Chart line */}
        <polyline
          points={points}
          fill="none"
          stroke="#59cd90"
          strokeWidth="2"
        />
        {/* Data points */}
        {dataPoints.map((point, index) => {
          const x = padding + (index * xStep);
          const y = height - padding - ((point.value - yAxisMin) / yRange) * (height - padding * 2);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#59cd90"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full bg-white border border-pb_lightgray rounded-lg px-2 relative overflow-hidden flex-shrink-0 min-h-20 max-h-24 h-24 flex flex-col">
      <div className="absolute top-1.5 left-2.5 text-3xs text-pb_textlightestgray leading-none z-10">Historical View</div>
      <div className="absolute top-1.5 right-2.5 z-10">
        <div className="flex rounded border border-pb_lightgray">
          <button className="px-1.5 py-0.5 text-3xs font-medium bg-pb_lightergray text-pb_darkgray rounded-l">
            Stats
          </button>
          <button className="px-1.5 py-0.5 text-3xs font-medium text-pb_textgray rounded-r">
            Value
          </button>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="flex-1 w-full mt-3 flex items-end">
        {createLineChart()}
      </div>
    </div>
  );
}