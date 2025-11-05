'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './TimeSeriesChart.module.scss';

export interface DataPoint {
  time: Date | string | number;
  value: number;
}

export interface TimeSeriesChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  lineColor?: string;
  backgroundColor?: string;
  gridColor?: string;
  axisColor?: string;
  className?: string;
}

export default function TimeSeriesChart({ data, width = 800, height = 400, marginTop = 20, marginRight = 30, marginBottom = 40, marginLeft = 60, lineColor = '#00ff00', backgroundColor = 'transparent', gridColor = '#333', axisColor = '#fff', className }: TimeSeriesChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        const containerWidth = svgRef.current.parentElement.clientWidth;
        setDimensions({
          width: Math.min(containerWidth, width),
          height: height,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const { width: svgWidth, height: svgHeight } = dimensions;
    const innerWidth = svgWidth - marginLeft - marginRight;
    const innerHeight = svgHeight - marginTop - marginBottom;

    // Parse and sort data
    const parsedData = data
      .map((d) => ({
        time: d.time instanceof Date ? d.time : new Date(d.time),
        value: d.value,
      }))
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.time) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(parsedData, (d) => d.value) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Create main group
    const g = svg.append('g').attr('transform', `translate(${marginLeft},${marginTop})`);

    // Add background
    g.append('rect').attr('width', innerWidth).attr('height', innerHeight).attr('fill', backgroundColor).attr('stroke', gridColor).attr('stroke-width', 1);

    // Add grid lines
    const xTicks = xScale.ticks(6);
    const yTicks = yScale.ticks(6);

    // Vertical grid lines
    g.selectAll('.grid-x')
      .data(xTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-x')
      .attr('x1', (d) => xScale(d))
      .attr('x2', (d) => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', gridColor)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.5);

    // Horizontal grid lines
    g.selectAll('.grid-y')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-y')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', gridColor)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.5);

    // Create line generator
    const line = d3
      .line<{ time: Date; value: number }>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add the line path
    g.append('path').datum(parsedData).attr('fill', 'none').attr('stroke', lineColor).attr('stroke-width', 2).attr('d', line);

    // Add data points
    g.selectAll('.dot')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.time))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 3)
      .attr('fill', lineColor)
      .attr('stroke', backgroundColor)
      .attr('stroke-width', 1);

    // Add x-axis
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat('%m/%d'));
    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(xAxis).selectAll('text').style('fill', axisColor).style('font-family', 'monospace').style('font-size', '12px');

    g.select('.domain').style('stroke', axisColor);

    g.selectAll('.tick line').style('stroke', axisColor);

    // Add y-axis
    const yAxis = d3.axisLeft(yScale).ticks(6);
    g.append('g').call(yAxis).selectAll('text').style('fill', axisColor).style('font-family', 'monospace').style('font-size', '12px');

    g.select('.domain').style('stroke', axisColor);

    g.selectAll('.tick line').style('stroke', axisColor);

    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + marginBottom - 5})`)
      .style('text-anchor', 'middle')
      .style('fill', axisColor)
      .style('font-family', 'monospace')
      .style('font-size', '14px')
      .text('Time');
  }, [data, dimensions, marginTop, marginRight, marginBottom, marginLeft, lineColor, backgroundColor, gridColor, axisColor]);

  return (
    <div className={`${styles.chartContainer} ${className || ''}`}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className={styles.chart} />
    </div>
  );
}
