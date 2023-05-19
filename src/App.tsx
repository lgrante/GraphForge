import React, {ReactComponentElement, ReactElement} from 'react';
import Graph from './Graph';

import data from './sample_data.json';
import './App.css';
import {GraphProps, SVGCircleStyleAttributes, TargetElementTagName} from './Graph/types';

type NodeType = 'PNode' | 'UNode' | 'TNode';
type TaskState = 'TODO' | 'DOING' | 'DONE';

function getNodeAttributes (): SVGCircleStyleAttributes<any> {
  const radius = {
    //'PNode': 80,
    'PNode': 10,
    'UNode': 60,
    'TNode': 40
  };

  const fill = {
    'PNode': '#0A3069',
    'UNode': '#000000',
    'TNode': {'TODO': '#f85149', 'DOING': '#fa7a18', 'DONE': '#26a641'}
  };

  const stroke = {
    'PNode': '#0969DA',
    'UNode': '#FFFFFF',
    'TNode': {'TODO': '#f85149', 'DOING': '#fa7a18', 'DONE': '#26a641'}
  };

  const strokeWidth = {
    'PNode': 2,
    'UNode': 5,
    'TNode': 2
  };

  return {
    r: (node: any) => radius[node.__typename as NodeType],
    fill: (node: any) => {
      if (node.__typename === 'TNode') {
        return fill.TNode[node.state as TaskState] as string;
      }
      return fill[node.__typename as NodeType] as string;
    },
    stroke: (node: any) => {
      if (node.__typename === 'TNode') {
        return stroke.TNode[node.state as TaskState] as string;
      }
      return stroke[node.__typename as NodeType] as string;
    },
    strokeWidth: (node: any) => strokeWidth[node.__typename as NodeType],
  };
}

function getNodeInnerElement (node: any): ReactElement {
  if (node.__typename === 'PNode') {
    return <h3>{ node.name }</h3>;
  }
  if (node.__typename === 'TNode') {
    return <p>{ node.name }</p>;
  }
  if (node.__typename === 'UNode') {
    return <h4>{ node.username }</h4>;
  }
  return <h4></h4>;
}


const GraphComponent = Graph<any>;
const graphProps: GraphProps<any> = {
  width: window.innerWidth,
  height: window.innerHeight,
  nodes: data.nodes,
  edges: data.edges,
  nodeIdProperty: 'id',
  nodeAttributes: getNodeAttributes(),
  edgeAttributes: {
    stroke: 'white',
    strokeWidth: (d => (d.source.__typename === 'PNode' ? 10 : 2))
  },
  edgeLabel: 'A label',
  edgeLabelAttributes: {
    fill: 'white'
  },
  nodeInnerElement: getNodeInnerElement,
  arrowAttributes: {
    fill: 'green',
  },
  nodeEventListeners: {
    'click': (e: Event, data: any, tagName: TargetElementTagName) => {
      console.log({e, data, tagName});
    }
  },
  edgeEventListeners: {
    'mouseover': (e: Event, data: any, tagName: TargetElementTagName) => {
      console.log({e, data, tagName});
    }
  },
  edgeLabelEventListeners: {
    'mouseover': (e: Event, data: any, tagName: TargetElementTagName) => {
      console.log({e, data, tagName});
    }
  },
  viewBoxEventListeners: {
    'click': (e: Event, tagName: TargetElementTagName) => {
      console.log({e, tagName});
    }
  }
}

function App(): ReactElement {
  return <GraphComponent {...graphProps} />;
}

export default App;
