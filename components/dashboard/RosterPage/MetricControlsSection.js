import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitCommitHorizontal, Settings, X } from 'lucide-react';
import { useState } from 'react';

function MetricControlsSection({ scoreData, metricSelections, onMetricChange, className = "" }) {
  const [showMetricsPopup, setShowMetricsPopup] = useState(false);

  const getButtonStyles = (option, selectedOption, buttonIndex) => {
    // Handle empty middle button (neutral)
    if (option === "") {
      return "data-[state=active]:bg-pb_lightergray data-[state=active]:text-pb_textgray bg-white text-pb_textlightestgray";
    }
    // Define styles based on button position: 0=positive (green), 2=negative (red)
    if (buttonIndex === 0) {
      return "data-[state=active]:bg-pb_green bg-white text-pb_textlightestgray hover:bg-gray-50";
    } else if (buttonIndex === 2) {
      return "data-[state=active]:bg-pb_red bg-white text-pb_textlightestgray hover:bg-gray-50";
    }
    // Fallback
    return "bg-white text-pb_textlightestgray hover:bg-gray-50";
  };

  // Pure controls UI
  const MetricsControls = () => (
    <div className={`space-y-2`}>
      {scoreData.metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          // Correctly structured div for each metric row
          <div key={index} className="flex items-center justify-center">
            <div className="flex items-center gap-1.5">
              <IconComponent className="icon-xs text-pb_darkgray" />
              <span className="text-2xs text-pb_darkgray font-medium">{metric.label}</span>
            </div>
            <Tabs 
              value={metricSelections[index]} 
              onValueChange={(value) => onMetricChange(index, value)}
              className="w-auto"
            >
              <TabsList className="h-auto p-0 border border-pb_lightgray grid w-32" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                {metric.options.map((option, buttonIndex) => (
                  <TabsTrigger
                    key={buttonIndex}
                    value={option}
                    className={`px-1.5 h-5 text-2xs font-medium data-[state=active]:text-white border-r border-pb_lightgray last:border-r-0 first:rounded-l last:rounded-r rounded-none w-full ${getButtonStyles(option, metricSelections[index], buttonIndex)}`}
                  >
                    {option || <GitCommitHorizontal className="w-icon-xs h-icon-xs text-pb_textlightestgray" />}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop: show controls directly */}
      <div className={`smh:hidden mdh:block lgh:block ${className}`}>
        <div className="space-y-2 flex-shrink-0 mt-0">
          <MetricsControls />
        </div>
      </div>
      {/* Mobile: show controls in popover */}
      <div className={`smh:block mdh:hidden lgh:hidden flex-shrink-0 flex justify-center w-full ${className}`}>
        <Popover open={showMetricsPopup} onOpenChange={setShowMetricsPopup}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 text-xs text-pb_textgray hover:text-pb_darkgray hover:bg-gray-50 rounded border border-pb_lightergray transition-colors mx-auto">
              <Settings className="w-4 h-4" />
              <span>Configure Metrics</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="center">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-pb_darkgray">Playbook Metrics</h4>
              <button 
                onClick={() => setShowMetricsPopup(false)}
                className="w-4 h-4 flex items-center justify-center hover:bg-gray-100 rounded"
              >
                <X className="w-3 h-3 text-pb_textgray" />
              </button>
            </div>
            <MetricsControls />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export default MetricControlsSection; 