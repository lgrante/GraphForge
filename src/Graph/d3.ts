// @ts-nocheck

import React, {ReactElement} from 'react';
import * as d3 from 'd3';
import * as ReactDOMServer from 'react-dom/server';

import {CreateGraphParams} from './types';
import {getInsribedRectInCircle} from './utils';


function processNodeData<T, D>(
  nodeSVG: T,
  data: D | ((nodeSVG: T) => D)
): D {
  if (typeof data === 'function') {
    return data(nodeSVG);
  }
  return data;
}


function renderNodeComponentToHTML<T>(
  node: T,
  renderNode: ReactElement | ((nodeSVG: T) => ReactElement)
) {
  const nodeComponent = processNodeData<T, ReactElement>(node, renderNode);
  const htmlString = ReactDOMServer.renderToString(nodeComponent);
  const parser = new DOMParser();
  const document = parser.parseFromString(htmlString, 'text/html');

  return document.body.firstChild;
}


function getMatchingSVGElement<T> (
  element: any, 
  node: T,
  nodeIdProperty: string
) {
  const id = node[nodeIdProperty];
  const nodeElement = element.filter(md => md[nodeIdProperty] === id).node();

  return nodeElement;
}


function getNodeInnerElementSize<T> (
  element, 
  node: any,
  nodeIdProperty: string
) {
  /**
   * TODO: Understand why the foreignObject rectangle doesn't take the while size of the circle for the Project node.
   */
  const nodeElement = getMatchingSVGElement<T>(element, node, nodeIdProperty);
  const radius = nodeElement.r.baseVal.value;

  return getInsribedRectInCircle(radius);
}


function isRectangleContained(innerRect, outerRect) {
  return (
    innerRect.left >= outerRect.left &&
    innerRect.right <= outerRect.right &&
    innerRect.top >= outerRect.top &&
    innerRect.bottom <= outerRect.bottom
  );
}


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

  const nodeInnerElementId = (node: T) => `node_inner_element_${node[nodeIdProperty]}`;

  const svg = d3.select(ref.current)
    .append('svg')
    .attr('viewBox', [0, 0, width, height]);

  const simulation = d3.forceSimulation(nodes)
    .force('edgeSVG', d3.forceLink(edges).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const defaultNodeAttributes = {
    strokeWidth: 5,
    stroke: 'white'
  };

  const edgeSVG = svg.append('g')
    .selectAll('line')
    .data(edges)
    .join('line')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)

  const nodeSVG = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .call(drag(simulation));

  nodeAttributes = !nodeAttributes ? defaultNodeAttributes : nodeAttributes;

  for (const key in nodeAttributes) {
    const name = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
    let value = nodeAttributes[key];

    nodeSVG.attr(name, value);
  }

  const nodeInnerElementSVG = svg.append('g')
    .selectAll('foreignObject')
    .data(nodes)
    .join('foreignObject')
    .attr('width', d => getNodeInnerElementSize<T>(nodeSVG, d, nodeIdProperty))
    .attr('height', d => getNodeInnerElementSize<T>(nodeSVG, d, nodeIdProperty))
    .html(d => {
      const element = renderNodeComponentToHTML<T>(d, nodeInnerElement);

      element.setAttribute('id', nodeInnerElementId(d));
      return element.outerHTML;
    })
    .call(drag(simulation));

  nodeSVG.attr('r', d => {
    const circle = getMatchingSVGElement(nodeSVG, d, nodeIdProperty);
    const foreignObject = getMatchingSVGElement<T>(nodeInnerElementSVG, d, nodeIdProperty);
    const innerElement = foreignObject.firstChild;

    const foreignObjectRect = foreignObject.getBoundingClientRect();
    const innerElementRect = innerElement.getBoundingClientRect();

    if (!isRectangleContained(innerElementRect, foreignObjectRect)) {
      const margin = 14;
      const largestSize = Math.max(innerElementRect.height, innerElementRect.width) + margin;

      nodeInnerElementSVG.filter(d2 => d2.id === d.id)
        .attr('width', largestSize)
        .attr('height', largestSize);
      return Math.sqrt(2 * Math.pow(largestSize, 2)) / 2;
    }

    return circle.r.baseVal.value;
  });

  simulation.on('tick', () => {
    edgeSVG
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodeSVG
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);


    nodeInnerElementSVG
      .attr('x', d => {
        const nodeBBox = getMatchingSVGElement<T>(nodeSVG, d, nodeIdProperty).getBBox();
        const innerNodeElementBBox = getMatchingSVGElement<T>(nodeInnerElementSVG, d, nodeIdProperty).getBBox();

        return nodeBBox.x + (nodeBBox.width / 2) - (innerNodeElementBBox.width / 2);
      })
      .attr('y', d => {
        const nodeBBox = getMatchingSVGElement<T>(nodeSVG, d, nodeIdProperty).getBBox();
        const innerNodeElementBBox = getMatchingSVGElement<T>(nodeInnerElementSVG, d, nodeIdProperty).getBBox();

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
