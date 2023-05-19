## What is it?

💪 GraphForge is a  powerful React library for creating and displaying customizable graphs based on the D3 library. With GraphForge, you can easily create complex graphs that depict relationships between nodes and edges in your data.

🔧 GraphForge provides a highly customizable component that allows you to control every aspect of your graph, from the layout and style to the data points and labels. You can use the built-in tools to create basic graphs quickly, or dive deep into the library's advanced features to create complex, interactive visualizations that allow users to explore your data in new and exciting ways.

## API reference

# GraphProps

The interface representing the properties for the graph component.

## Props

`width (number)`
The width of the graph SVG container in pixels.

`height: number`
The height of the graph SVG container in pixels.

`nodes: T[]`
An array of objects representing the nodes in the graph.

`edges: Edge[]` 
An array of objects representing the edges in the graph.

`nodeIdProperty: string`
The property name of the nodes used as a unique identifier.

`nodeAttributes: SVGCircleStyleAttributes<T>` (optional)
Additional attributes to be applied to each node SVG circle element. It can be a direct value or a function that receives a node and returns the attribute value.

**Example:**

```tsx
// Using a function to dynamically set the node color
const nodeAttributes = {
  fill: (node) => (node.status === 'active' ? 'green' : 'gray'),
  // other attributes...
};
```

`nodeInnerElement: ReactElement | (node: T) => ReactElement` (optional)
The React component or function used to render the inner content of each node. It can be a static React element or a function that receives a node and returns a React element.

**Example:**

```tsx
// Using a custom component as the inner element
const CustomNode = ({ node }) => (
  <div className="custom-node">
    <span>{node.name}</span>
  </div>
);

// In the Graph component:
<Graph
  // other props...
  nodeInnerElement={CustomNode}
/>
```

`edgeAttributes: SVGLineStyleAttributes<T>` (optional)
Additional attributes to be applied to each edge SVG line element. It can be a direct value or a function that receives an edge and returns the attribute value.

`edgeLabel: string | (edge: Edge) => string` (optional)
The label text or function used to determine the label of each edge.

**Example:**
```tsx
// Using a function to dynamically set the edge label
const edgeLabel = (edge) => `Edge ${edge.id}`;

// In the Graph component:
<Graph
  // other props...
  edgeLabel={edgeLabel}
/>
```

`edgeLabelAttributes: SVGTextStyleAttributes<T>` (optional)
Additional attributes to be applied to each edge label SVG text element. It can be a direct value or a function that receives an edge and returns the attribute value.

`arrowHeight: number` (optional) 
The height of the arrowheads for directed edges.

`arrowWidth: number` (optional)
The width of the arrowheads for directed edges.

`arrowAttributes: SVGPolygonStyleAttributes<T>` (optional)
Additional attributes to be applied to each arrowhead SVG polygon element. It can be a direct value or a function that receives an edge and returns the attribute value.

`nodeEventListeners: SVGDataEventListeners<T>` (optional)
Event listeners for the node SVG elements. Each key is an SVG element event, and the corresponding value is the callback function that handles the event. The callback receives the event object, the data of the node, and the tag name of the target element.

**Example**
```tsx
// Event listener example for nodes
const handleNodeClick = (event, node, tagName) => {
  console.log('Node clicked:', node);
};

// In the Graph component:
<Graph
  // other props...
  nodeEventListeners={{
    click: handleNodeClick,
  }}
/>
```

The listener function receives this parameters:

- `event`: The event object represents the specific event that occurred, such as a click event. You can access properties of the event object, such as event.target, to retrieve information about the event.

- `node`: The node parameter represents the data associated with the clicked node. It provides access to the properties and values of the specific node that triggered the event. You can access attributes like node.id, node.name, or any other custom properties defined for the node.

- `tagName`: The tagName parameter indicates the HTML tag name of the target element that triggered the event. This can be useful when you want to perform different actions based on the type of element that was clicked.

`edgeEventListeners: SVGDataEventListeners<Edge>` (optional)
Event listeners for the edge SVG elements. Each key is an SVG element event, and the corresponding value is the callback function that handles the event. The callback receives the event object, the data of the edge, and the tag name of the target element.

The listener function receives this paremeters:

- `event`: The event object represents the specific event that occurred, such as a click or mouseover event. You can access properties of the event object, such as event.target, to retrieve information about the event.

- `edge`: The edge parameter represents the data associated with the edge that triggered the event. It provides access to the properties and values of the specific edge that triggered the event. You can access attributes like edge.id, edge.source, edge.target, or any other custom properties defined for the edge.

- `tagName`: The tagName parameter indicates the HTML tag name of the target element that triggered the event. This can be useful when you want to perform different actions based on the type of element that was interacted with.

`edgeLabelEventListeners: SVGDataEventListeners<Edge>` (optional)
Event listeners for the edge label SVG text elements. Each key is an SVG element event, and the corresponding value is the callback function that handles the event. The callback receives the event object, the data of the edge, and the tag name of the target element.

`viewBoxEventListeners: SVGEventListeners` (optional)
Event listeners for the SVG viewBox element. Each key is an SVG element event, and the corresponding value is the callback function that handles the event. The callback receives the event object and the tag name of the target element.
