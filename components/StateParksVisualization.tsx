'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PARKS } from '@data/parks';
import styles from './StateParksVisualization.module.scss';

interface StateParksVisualizationProps {
  width?: number;
  height?: number;
}

interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
  imports?: string[];
}

interface EdgeBundlingNode extends d3.HierarchyNode<HierarchyNode> {
  incoming: Array<[EdgeBundlingNode, EdgeBundlingNode]>;
  outgoing: Array<[EdgeBundlingNode, EdgeBundlingNode]>;
  x: number;
  y: number;
}

const StateParksVisualization: React.FC<StateParksVisualizationProps> = ({ width = 1200, height = 800 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create hierarchical data structure from parks
    const createVisualizationData = () => {
      const stateParksMap = new Map<string, string[]>();
      const allParks: string[] = [];

      // Group parks by state and collect all parks
      PARKS.forEach((park) => {
        allParks.push(park.name);
        park.states.forEach((state) => {
          if (!stateParksMap.has(state)) {
            stateParksMap.set(state, []);
          }
          stateParksMap.get(state)!.push(park.name);
        });
      });

      const states = Array.from(stateParksMap.keys()).sort();

      return {
        states,
        parks: allParks,
        stateParksMap,
      };
    };

    const { states, parks, stateParksMap } = createVisualizationData();

    // Create the visualization
    const margin = 150;
    const outerRadius = Math.min(width, height) / 2 - margin; // Parks on outer circle
    const innerRadius = outerRadius * 0.5; // States on inner circle with more gap

    // Set viewBox to ensure everything is visible
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Position parks on outer circle
    const parkPositions = parks.map((park, i) => {
      const angle = (i / parks.length) * 2 * Math.PI - Math.PI / 2;
      return {
        name: park,
        x: Math.cos(angle) * outerRadius,
        y: Math.sin(angle) * outerRadius,
        angle: angle,
      };
    });

    // Position states on inner circle
    const statePositions = states.map((state, i) => {
      const angle = (i / states.length) * 2 * Math.PI - Math.PI / 2;
      return {
        name: state,
        x: Math.cos(angle) * innerRadius,
        y: Math.sin(angle) * innerRadius,
        angle: angle,
      };
    });

    // Create line generator for curved connections
    const line = d3
      .line()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveBundle.beta(0.85));

    // Add connection lines group (initially hidden)
    const connections = g.append('g').attr('class', 'connections');

    // Add parks nodes (outer circle)
    const parkNodes = g
      .selectAll('.park-node')
      .data(parkPositions)
      .join('g')
      .attr('class', 'park-node')
      .attr('transform', (d) => `rotate(${(d.angle * 180) / Math.PI}) translate(${outerRadius},0)`)
      .style('cursor', 'pointer');

    parkNodes
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.angle > Math.PI / 2 && d.angle < (3 * Math.PI) / 2 ? -8 : 8))
      .attr('text-anchor', (d) => (d.angle > Math.PI / 2 && d.angle < (3 * Math.PI) / 2 ? 'end' : 'start'))
      .attr('transform', (d) => (d.angle > Math.PI / 2 && d.angle < (3 * Math.PI) / 2 ? 'rotate(180)' : null))
      .text((d) => (d.name.length > 25 ? d.name.substring(0, 22) + '...' : d.name))
      .style('font-size', '10px')
      .style('font-family', 'sans-serif')
      .style('fill', '#000');

    // Add state nodes (inner circle)
    const stateNodes = g
      .selectAll('.state-node')
      .data(statePositions)
      .join('g')
      .attr('class', 'state-node')
      .attr('transform', (d) => `rotate(${(d.angle * 180) / Math.PI}) translate(${innerRadius},0)`)
      .style('cursor', 'pointer');

    stateNodes
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.angle > Math.PI / 2 && d.angle < (3 * Math.PI) / 2 ? -8 : 8))
      .attr('text-anchor', (d) => (d.angle > Math.PI / 2 && d.angle < (3 * Math.PI) / 2 ? 'end' : 'start'))
      .attr('transform', (d) => (d.angle > Math.PI / 2 && d.angle < (3 * Math.PI) / 2 ? 'rotate(180)' : null))
      .text((d) => (d.name.length > 12 ? d.name.substring(0, 10) + '...' : d.name))
      .style('font-size', '11px')
      .style('font-family', 'sans-serif')
      .style('fill', '#000')
      .style('font-weight', 'bold');

    // Function to show connections
    const showConnections = (nodeName: string, isState: boolean) => {
      connections.selectAll('*').remove();

      if (isState) {
        // Show connections from state to its parks
        const stateParkNames = stateParksMap.get(nodeName) || [];
        const statePos = statePositions.find((s) => s.name === nodeName);

        if (statePos) {
          stateParkNames.forEach((parkName) => {
            const parkPos = parkPositions.find((p) => p.name === parkName);
            if (parkPos) {
              // Create curved path
              const midX = (statePos.x + parkPos.x) / 2;
              const midY = (statePos.y + parkPos.y) / 2;
              const controlX = midX * 0.3; // Pull towards center for curve
              const controlY = midY * 0.3;

              connections.append('path').attr('d', `M${statePos.x},${statePos.y} Q${controlX},${controlY} ${parkPos.x},${parkPos.y}`).attr('stroke', '#ff6b35').attr('stroke-width', 2).attr('fill', 'none').attr('opacity', 0.8).style('filter', 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))');
            }
          });
        }
      } else {
        // Show connections from park to its states
        const park = PARKS.find((p) => p.name === nodeName);
        const parkPos = parkPositions.find((p) => p.name === nodeName);

        if (park && parkPos) {
          park.states.forEach((stateName) => {
            const statePos = statePositions.find((s) => s.name === stateName);
            if (statePos) {
              // Create curved path
              const midX = (parkPos.x + statePos.x) / 2;
              const midY = (parkPos.y + statePos.y) / 2;
              const controlX = midX * 0.3; // Pull towards center for curve
              const controlY = midY * 0.3;

              connections.append('path').attr('d', `M${parkPos.x},${parkPos.y} Q${controlX},${controlY} ${statePos.x},${statePos.y}`).attr('stroke', '#9c27b0').attr('stroke-width', 2).attr('fill', 'none').attr('opacity', 0.8).style('filter', 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))');
            }
          });
        }
      }
    };

    // Function to hide connections
    const hideConnections = () => {
      connections.selectAll('*').transition().duration(200).attr('opacity', 0).remove();
    };

    // Add interactivity to park nodes
    parkNodes
      .on('mouseenter', function (event, d) {
        setHoveredNode(d.name);
        d3.select(this).select('text').transition().duration(200).style('fill', '#e53e3e').style('font-weight', 'bold');

        showConnections(d.name, false);
      })
      .on('mouseleave', function (event, d) {
        if (selectedNode !== d.name) {
          setHoveredNode(null);
          d3.select(this).select('text').transition().duration(200).style('fill', '#000').style('font-weight', 'normal');

          hideConnections();
        }
      })
      .on('click', function (event, d) {
        if (selectedNode === d.name) {
          setSelectedNode(null);
          hideConnections();
          d3.select(this).select('text').transition().duration(200).style('fill', '#000').style('font-weight', 'normal');
        } else {
          setSelectedNode(d.name);
          showConnections(d.name, false);
          // Reset all other nodes
          parkNodes.select('text').transition().duration(200).style('fill', '#000').style('font-weight', 'normal');
          stateNodes.select('text').transition().duration(200).style('fill', '#000');
          // Highlight selected park
          d3.select(this).select('text').transition().duration(200).style('fill', '#e53e3e').style('font-weight', 'bold');
        }
      });

    // Add interactivity to state nodes
    stateNodes
      .on('mouseenter', function (event, d) {
        setHoveredNode(d.name);
        d3.select(this).select('text').transition().duration(200).style('fill', '#3182ce');

        showConnections(d.name, true);
      })
      .on('mouseleave', function (event, d) {
        if (selectedNode !== d.name) {
          setHoveredNode(null);
          d3.select(this).select('text').transition().duration(200).style('fill', '#000');

          hideConnections();
        }
      })
      .on('click', function (event, d) {
        if (selectedNode === d.name) {
          setSelectedNode(null);
          hideConnections();
          d3.select(this).select('text').transition().duration(200).style('fill', '#000');
        } else {
          setSelectedNode(d.name);
          showConnections(d.name, true);
          // Reset all other nodes
          parkNodes.select('text').transition().duration(200).style('fill', '#000').style('font-weight', 'normal');
          stateNodes.select('text').transition().duration(200).style('fill', '#000');
          // Highlight selected state
          d3.select(this).select('text').transition().duration(200).style('fill', '#3182ce');
        }
      });

    // Add simple text legend
    const legend = svg.append('g').attr('transform', `translate(30, ${height - 60})`);

    legend.append('text').attr('dy', '.35em').style('font-size', '11px').style('fill', '#666').style('font-weight', 'bold').text('National Parks (outer circle)');

    legend.append('text').attr('y', 20).attr('dy', '.35em').style('font-size', '11px').style('fill', '#666').style('font-weight', 'bold').text('States (inner circle)');
  }, [width, height, selectedNode]);

  return (
    <div className={styles.stateParksVisualization}>
      <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} />
      {/* {(hoveredNode || selectedNode) && <div className={styles.tooltip}>{hoveredNode || selectedNode}</div>} */}
    </div>
  );
};

export default StateParksVisualization;
