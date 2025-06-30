'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { mockTrades } from '../dummyDataTradesPage';

export default function TradeHistoricalView() {
  const { leagues, currentLeagueId } = useDashboardContext();
  const svgRef = useRef();

  useEffect(() => {
    if (!currentLeagueId || !leagues || leagues.length === 0) {
      return;
    }

    const currentLeague = leagues.find(
      (league) => league.leagueDetails.leagueName === currentLeagueId
    );

    if (!currentLeague) {
      return;
    }

    const selectedSport = currentLeague.leagueDetails.sport.toLowerCase();
    const trade = mockTrades[selectedSport];

    if (!trade) {
      return;
    }

    // Generate mock historical data points - using exact HTML example data
    const generateHistoricalData = () => {
      // Use the exact data from your HTML example
      const points = [
        { period: '1Y', value: -600 },
        { period: '6M', value: -350 },
        { period: '1M', value: 800 },
        { period: '►', value: 1000 }
      ];
      
      return points;
    };

    const historicalData = generateHistoricalData();
    const breakeven = 0; // Profit/loss breakeven point
    const yearlyAverage = 317; // Reference line for yearly average
    if (!svgRef.current) return;

    const drawChart = () => {
      // Clear previous chart
      d3.select(svgRef.current).selectAll("*").remove();

    // Get the actual container dimensions
    const containerRect = svgRef.current.parentElement.getBoundingClientRect();
    const margin = { top: 0, right:  0, bottom: 28, left: 0 };
    const width = containerRect.width - margin.left - margin.right;
    const height = containerRect.height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scalePoint()
      .domain(historicalData.map(d => d.period))
      .range([0, width])
      .padding(0.1);

    // Create an efficient scale that centers 317 in the visual middle
    const dataExtent = d3.extent(historicalData, d => d.value);
    const dataRange = dataExtent[1] - dataExtent[0];
    
    // Calculate scale to center 317 while efficiently using space
    const currentDataCenter = (dataExtent[1] + dataExtent[0]) / 2;
    const offset = yearlyAverage - currentDataCenter;
    
    // Adjust domain to center 317, with very minimal padding for better space usage
    const padding = dataRange * 0.03;
    const adjustedMin = dataExtent[0] + offset - padding;
    const adjustedMax = dataExtent[1] + offset + padding;
    
    const yScale = d3.scaleLinear()
      .domain([adjustedMin, adjustedMax])
      .range([height, 0]);

    // Create gradient definitions
    const defs = svg.append('defs');

    // Line gradient for the adjusted scale
    const lineGradient = defs.append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', yScale(adjustedMin))
      .attr('x2', 0).attr('y2', yScale(adjustedMax));

    // Calculate gradient stops based on breakeven position
    const breakEvenPosition = ((breakeven - adjustedMin) / (adjustedMax - adjustedMin)) * 100;
    
    lineGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ef4444');

    lineGradient.append('stop')
      .attr('offset', `${breakEvenPosition}%`)
      .attr('stop-color', '#ef4444');

    lineGradient.append('stop')
      .attr('offset', `${breakEvenPosition}%`)
      .attr('stop-color', '#22c55e');

    lineGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#22c55e');

    // Add subtle grid lines (like HTML example)
    const yAxis = d3.axisLeft(yScale).tickSize(-width).tickFormat('');
    g.append('g')
      .attr('class', 'grid')
      .call(yAxis)
      .selectAll('line')
      .attr('stroke', '#f0f0f0')
      .attr('stroke-width', 1);

    // Add yearly average reference line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(yearlyAverage))
      .attr('y2', yScale(yearlyAverage))
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Add white background rectangle behind the label
    const labelText = `+${yearlyAverage}`;
    const textWidth = labelText.length * 6.5; // Approximate text width
    const textHeight = 14;
    
    g.append('rect')
      .attr('x', 10 - 4)
      .attr('y', yScale(yearlyAverage) - 8)
      .attr('width', textWidth + 8)
      .attr('height', textHeight)
      .attr('fill', 'white')
      .attr('stroke', 'none');

    // Add yearly average label (positioned on the left side inside chart area)
    g.append('text')
      .attr('x', 10)
      .attr('y', yScale(yearlyAverage) + 3)
      .attr('font-size', '11')
      .attr('font-weight', '400')
      .attr('fill', '#999')
      .text(labelText);

    // Line generator - LINEAR for zigzag effect
    const line = d3.line()
      .x(d => xScale(d.period))
      .y(d => yScale(d.value))
      .curve(d3.curveLinear);

    // Add the line with gradient
    g.append('path')
      .datum(historicalData)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add main data points (colored by breakeven like HTML example)
    g.selectAll('.dot')
      .data(historicalData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.period))
      .attr('cy', d => yScale(d.value))
      .attr('r', (d, i) => i === historicalData.length - 1 ? 6 : 5)
      .attr('fill', d => d.value >= breakeven ? '#22c55e' : '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Add x-axis labels (at the bottom like HTML example)
    g.selectAll('.x-label')
      .data(historicalData)
      .enter().append('text')
      .attr('class', 'axis-label')
      .attr('x', d => xScale(d.period))
      .attr('y', height + 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11')
      .attr('fill', '#666')
      .attr('font-weight', '500')
      .text(d => d.period);

      // Remove default axes (we're doing custom)
      g.selectAll('.domain').remove();
      g.selectAll('.tick').remove();
    };

    // Initial draw
    drawChart();

    // Set up resize observer for responsive behavior
    const resizeObserver = new ResizeObserver(() => {
      drawChart();
    });

    if (svgRef.current.parentElement) {
      resizeObserver.observe(svgRef.current.parentElement);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };

  }, [leagues, currentLeagueId]);

  if (!currentLeagueId || !leagues || leagues.length === 0) {
    return null;
  }

  const currentLeague = leagues.find(
    (league) => league.leagueDetails.leagueName === currentLeagueId
  );

  if (!currentLeague) {
    return null;
  }

  const selectedSport = currentLeague.leagueDetails.sport.toLowerCase();
  const trade = mockTrades[selectedSport];

  if (!trade) {
    return <div className="p-4 text-center text-xs">No data available</div>;
  }

  return (
    <div className="w-full h-full bg-white border border-pb_lightgray rounded-lg p-3">
      {/* D3 Chart Container */}
      <div className="relative w-full h-full">
        <svg ref={svgRef} className="overflow-visible"></svg>
      </div>
    </div>
  );
} 