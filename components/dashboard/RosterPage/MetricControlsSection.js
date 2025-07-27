import { Root as SegmentedControlRoot, List as SegmentedControlList, Trigger as SegmentedControlTrigger } from '@/components/alignui/segmented-control';
import { GitCommitHorizontal, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as Button from '@/components/alignui/button';

function MetricControlsSection({ scoreData, metricSelections, onMetricChange, className = "" }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pure controls UI using AlignUI SegmentedControl
  const MetricsControls = () => (
    <div className={`space-y-2`}>
      {scoreData.metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div key={index} className="flex items-center justify-center">
            <div className="flex items-center gap-1.5">
              <IconComponent className="icon-xs text-pb_darkgray" />
              <span className="text-2xs text-pb_darkgray font-medium">{metric.label}</span>
            </div>
            <SegmentedControlRoot 
              value={metricSelections[index]} 
              onValueChange={(value) => onMetricChange(index, value)}
              className="w-auto ml-2"
            >
              <SegmentedControlList className="w-32 h-5">
                {metric.options.map((option, buttonIndex) => (
                  <SegmentedControlTrigger
                    key={buttonIndex}
                    value={option}
                    className="text-2xs font-medium"
                  >
                    {option || <GitCommitHorizontal className="w-icon-xs h-icon-xs text-pb_textlightestgray" />}
                  </SegmentedControlTrigger>
                ))}
              </SegmentedControlList>
            </SegmentedControlRoot>
          </div>
        );
      })}
    </div>
  );

  // Don't render anything until client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Medium height and larger: show controls directly */}
      <div className={`smh:hidden mdh:block lgh:block ${className}`}>
        <div className="space-y-2 flex-shrink-0 mt-0">
          <MetricsControls />
        </div>
      </div>
      {/* Small height: show Evaluation Panel button */}
      <div className={`smh:block mdh:hidden lgh:hidden flex-shrink-0 flex justify-center w-full ${className}`}>
        <Button.Root variant='neutral' mode='stroke' size='xsmall' className='w-full flex items-center gap-2 justify-center'>
          <Search className='icon-xs' />
          <span className='text-label-m'>Evaluation Panel</span>
        </Button.Root>
      </div>
    </>
  );
}

export default MetricControlsSection; 