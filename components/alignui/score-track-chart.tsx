'use client';

import * as React from 'react';
import { select } from 'd3-selection';

export function ScoreTrackChart({
  count = 36,
  min = 0,
  max = 100,
  value,
}: {
  count?: number;
  min?: number;
  max?: number;
  value: number;
}) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [svgWidth, setSvgWidth] = React.useState(0);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].contentRect) {
        setSvgWidth(entries[0].contentRect.width);
      }
    });

    resizeObserver.observe(svgRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (svgWidth === 0) return;

    const filledCount = Math.round(((value - min) / (max - min)) * count);
    const svg = select(svgRef.current);

    svg.selectAll('rect').remove();

    const gap = 4;
    const barWidth = (svgWidth - gap * (count - 1)) / count;
    const barHeight = 22;

    svg
      .selectAll('rect')
      .data(Array.from({ length: count }))
      .enter()
      .append('rect')
      .attr('x', (_, i) => i * (barWidth + gap))
      .attr('y', 0)
      .attr('width', barWidth)
      .attr('height', barHeight)
      .attr('class', (_, i) =>
        i < filledCount ? 'fill-success-base' : 'fill-bg-soft-200',
      );
  }, [svgWidth, count, min, max, value]);

  return <svg ref={svgRef} width='100%' height='22' />;
}
