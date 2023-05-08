import * as d3 from 'd3';


function createGraph ({
  ref,
  width,
  height,
  nodes,
  links,
  renderNode
}) {

  const svg = d3.select(ref.current)
    .append('svg')
    .attr('viewBox', [0, 0, width, height]);

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(d => {
      const isConnected = links.some(link => link.source === d || link.target === d);

      return isConnected ? -200 : 0;
    }))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', 'white')
    .attr('stroke-width', 2);

  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('stroke-width', 5)
    .attr('stroke', 'white')
    .attr('r', 10)
    .call(drag(simulation));

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });


  function drag (simulation) {
    function dragstarted (e, d) {
      console.log(d);
      if (!e.active) {
        simulation.alphaTarget(0.1).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged (e, d) {
      console.log('DRAGGING');
      d.fx = e.x;
      d.fy = e.y;
    }

    function dragended (e, d) {
      console.log('DRAG END');
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
