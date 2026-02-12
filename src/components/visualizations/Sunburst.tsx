'use client';

import React, { useRef, useEffect, memo } from 'react';
import * as d3 from 'd3';

interface SunburstData {
  name: string;
  value?: number;
  children?: SunburstData[];
}

interface SunburstProps {
  data: SunburstData;
  width?: number;
  height?: number;
  colorScale?: (value: number, depth: number) => string;
  onNodeClick?: (name: string | null) => void;
  selectedNode?: string | null;
}

const SunburstComponent: React.FC<SunburstProps> = ({
  data,
  width = 600,
  height = 600,
  colorScale,
  onNodeClick,
  selectedNode,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  // Ensure minimum dimensions to prevent rendering issues
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const radius = Math.min(safeWidth, safeHeight) / 2;


  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous svg
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, safeWidth, safeHeight])
      .style('font', '10px sans-serif');

    const g = svg
      .append('g')
      .attr('transform', `translate(${safeWidth / 2},${safeHeight / 2})`);


    // Prepare data hierarchy
    const root = d3.hierarchy(data)
      .sum((d: any) => d.value || 0)
      .sort((a: any, b: any) => (b.value || 0) - (a.value || 0));

    // Create partition layout
    const partition = d3.partition<SunburstData>().size([2 * Math.PI, radius]);

    // Apply layout to data
    partition(root as any);

    // Arc generator
    const arc = d3.arc<d3.HierarchyRectangularNode<SunburstData>>()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius((d: any) => d.y0)
      .outerRadius((d: any) => d.y1 - 1);

    // Default color scale if not provided
    const defaultColor = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children?.length || 1 + 1));

    // Draw arcs
    const path = g.append('g')
      .selectAll('path')
      .data(root.descendants().slice(1)) // Skip root
      .join('path')
      .attr('fill', (d: any) => {
        if (colorScale) {
          // Use custom color scale logic based on value and depth
          // Assuming leaf nodes carry the actual score value we want to color by
          const val = d.data.value || 0;
          // If node has children, maybe average them? For now use its own value if exists
          // In our CognitiveSunburst, internal nodes also have values.
          return colorScale(val, d.depth);
        }
        while (d.depth > 1 && d.parent) d = d.parent;
        return defaultColor(d.data.name);
      })
      .attr('fill-opacity', (d: any) =>
        arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0
      )
      .attr('pointer-events', (d: any) => arcVisible(d.current) ? 'auto' : 'none')
      .attr('d', (d: any) => arc(d.current));

    // Add interactivity
    path.filter((d: any) => !!d.children)
      .style('cursor', 'pointer')
      .on('click', clicked);

    path.filter((d: any) => !d.children)
      .style('cursor', 'pointer')
      .on('click', (event: any, d: any) => {
        if (onNodeClick) onNodeClick(d.data.name);
      });

    // Add titles
    path.append('title')
      .text((d: any) => `${d.ancestors().map((d: any) => d.data.name).reverse().join('/')}\nScore: ${d.value}`);

    // Add labels
    const label = g.append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .selectAll('text')
      .data(root.descendants().slice(1))
      .join('text')
      .attr('dy', '0.35em')
      .attr('fill-opacity', (d: any) => +labelVisible(d.current))
      .attr('transform', (d: any) => labelTransform(d.current))
      .text((d: any) => d.data.name)
      .style('fill', 'white')
      .style('font-size', '10px');

    // Zoom Parent Circle
    const parent = g.append('circle')
      .datum(root)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('click', clicked);

    // --- Helper Functions ---

    function clicked(event: any, p: any) {
      if (onNodeClick && p.data.name) onNodeClick(p.data.name);

      parent.datum(p.parent || root);

      root.each((d: any) => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = g.transition().duration(750);

      path.transition(t as any)
        .tween('data', (d: any) => {
          const i = d3.interpolate(d.current, d.target);
          return (t: any) => d.current = i(t);
        })
        .filter(function (this: any, d: any) {
          return !!(+(this as any).getAttribute('fill-opacity') || arcVisible(d.target));
        })
        .attr('fill-opacity', (d: any) => arcVisible(d.target) ? (d.children ? 0.8 : 0.6) : 0)
        .attr('pointer-events', (d: any) => arcVisible(d.target) ? 'auto' : 'none')
        .attrTween('d', (d: any) => () => arc(d.current) || '');

      label.filter(function (this: any, d: any) {
        return !!(+(this as any).getAttribute('fill-opacity') || labelVisible(d.target));
      }).transition(t as any)
        .attr('fill-opacity', (d: any) => +labelVisible(d.target))
        .attrTween('transform', (d: any) => () => labelTransform(d.current));
    }

    function arcVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d: any) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    // Initialize state
    root.each((d: any) => d.current = d);

  }, [data, safeWidth, safeHeight, colorScale, onNodeClick]);

  return <svg ref={svgRef} width={safeWidth} height={safeHeight} />;

};

// Memoize Sunburst component to prevent unnecessary re-renders
const Sunburst = memo(SunburstComponent, (prevProps, nextProps) => {
  // Only re-render if data, dimensions, or callbacks change
  return (
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.colorScale === nextProps.colorScale &&
    prevProps.onNodeClick === nextProps.onNodeClick &&
    prevProps.selectedNode === nextProps.selectedNode
  );
});

export default Sunburst;
