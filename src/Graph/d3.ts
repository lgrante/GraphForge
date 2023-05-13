// @ts-nocheck

import React from 'react';
import * as d3 from 'd3';
import * as ReactDOMServer from 'react-dom/server';

import {CreateGraphParams} from './types';
import {getInsribedRectInCircle} from './utils';


function createGraph<T>({
  ref,
  width,
  height,
  nodes,
  edges,
  nodeIdProperty,
  nodeAttributes,
  nodeInnerElement,
  // TODO: Integrate these parameters. I'm too tired and lazy to do it now :p.
  edgeAttributes,
  edgeLabel,
  edgeLabelAttributes
}: CreateGraphParams<T>) {

  const getMatchingSVGElement = (element, d: any) => {
      const id = d[nodeIdProperty];
      const nodeElement = element.filter(md => md[nodeIdProperty] === id).node();

      return nodeElement;
  }

  const getInnerNodeElementSize = (element, d: any) => {
      const nodeElement = getMatchingSVGElement(element, d);
      const radius = nodeElement.r.baseVal.value;

      return getInsribedRectInCircle(radius);
  }
  

  const svg = d3.select(ref.current)
    .append('svg')
    .attr('viewBox', [0, 0, width, height]);

  const simulation = d3.forceSimulation(nodes)
    .force('edge', d3.forceLink(edges).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const defaultNodeAttributes = {
    strokeWidth: 5,
    stroke: 'white'
  };

  const edge = svg.append('g')
    .selectAll('line')
    .data(edges)
    .join('line')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)

  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .call(drag(simulation));

  nodeAttributes = !nodeAttributes ? defaultNodeAttributes : nodeAttributes;

  for (const key in nodeAttributes) {
    node.attr(key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`), nodeAttributes[key]);
  }

  const innerNodeElement = svg.append('g')
    .selectAll('foreignObject')
    .data(nodes)
    .join('foreignObject')
    .attr('width', d => getInnerNodeElementSize(node, d))
    .attr('height', d => getInnerNodeElementSize(node, d))
    .html(d => {
      let element = nodeInnerElement;

      if (typeof nodeInnerElement === 'function') {
        element = nodeInnerElement(d);
      }
      return ReactDOMServer.renderToString(element);
    })
    .call(drag(simulation));

  simulation.on('tick', () => {
    edge
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);


    innerNodeElement
      .attr('x', d => {
        const nodeBBox = getMatchingSVGElement(node, d).getBBox();
        const innerNodeElementBBox = getMatchingSVGElement(innerNodeElement, d).getBBox();

        return nodeBBox.x + (nodeBBox.width / 2) - (innerNodeElementBBox.width / 2);
      })
      .attr('y', d => {
        const nodeBBox = getMatchingSVGElement(node, d).getBBox();
        const innerNodeElementBBox = getMatchingSVGElement(innerNodeElement, d).getBBox();

        return nodeBBox.y + (nodeBBox.height / 2) - (innerNodeElementBBox.height / 2);
      });
  });


  function drag (simulation) {
    function dragstarted (e, d) {
      if (!e.active) {
        simulation.alphaTarget(0.1).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged (e, d) {
      d.fx = e.x;
      d.fy = e.y;
    }

    function dragended (e, d) {
      if (!e.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
}


export default createGraph;
