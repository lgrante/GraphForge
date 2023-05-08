import React, { useRef, useEffect } from 'react';

import data from './data.json';
import createGraph from './d3';


function Graph (props) {
  const graphContainerRef = useRef(null);


  useEffect(() => {
    createGraph({
      ref: graphContainerRef,
      width: window.innerWidth,
      height: window.innerHeight,
      nodes: data.nodes,
      links: data.links
    });
  }, []);

  return (
    <div ref={graphContainerRef}>
    </div>
  )
}

export default Graph;
