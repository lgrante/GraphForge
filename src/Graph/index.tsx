import React from 'react';
import { useRef, useEffect, ReactElement } from 'react';

import createGraph from './d3';
import {GraphProps} from './types';


function Graph<T>(props: GraphProps<T>): ReactElement {
  const graphContainerRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    if (graphContainerRef.current.children.length > 0) {
      return;
    }
    console.log({props});
    createGraph<T>({
      ref: graphContainerRef,
      ...props
    })
  }, []);

  return (
    <div ref={graphContainerRef}></div>
  );
}

export default Graph;
