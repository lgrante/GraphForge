## What is it?

💪 GraphForge is a  powerful React library for creating and displaying customizable graphs based on the D3 library. With GraphForge, you can easily create complex graphs that depict relationships between nodes and edges in your data.

🔧 GraphForge provides a highly customizable component that allows you to control every aspect of your graph, from the layout and style to the data points and labels. You can use the built-in tools to create basic graphs quickly, or dive deep into the library's advanced features to create complex, interactive visualizations that allow users to explore your data in new and exciting ways.

## API reference

### GraphProps<T>

The interface representing the properties for the graph component.

#### Props

- `width` (`number`): The width of the graph SVG container in pixels.

- `height` (`number`): The height of the graph SVG container in pixels.

- `nodes` (`T[]`): An array of objects representing the nodes in the graph.

- `edges` (`Edge[]`): An array of objects representing the edges in the graph.

- `nodeIdProperty` (`string`): The property name of the nodes used as a unique identifier.

- `nodeAttributes` (`SVGCircleStyleAttributes<T>` | _optional_): Additional attributes to be applied to each node SVG circle element. It can be a direct value or a function that receives a node and returns the attribute value.

- `nodeInnerElement` (`ReactElement` \| `(node: T) => ReactElement` | _optional_): The React component or function used to render the inner content of each node. It can be a static React element or a function that receives a node and returns a React element.

- `edgeAttributes` (`SVGLineStyleAttributes<T>` | _optional_): Additional attributes to be applied to each edge SVG line element. It can be a direct value or a function that receives an edge and returns the attribute value.

- `edgeLabel` (`string` \| `(edge: Edge) => string` | _optional_): The label text or function used to determine the label of each edge.

- `edgeLabelAttributes` (`SVGTextStyleAttributes<T>` | _optional_): Additional attributes to be applied to each edge label SVG text element. It can be a direct value or a function that receives an edge and returns the attribute value.

- `arrowHeight` (`number` | _optional_): The height of the arrowheads for directed edges.

- `arrowWidth` (`number` | _optional_): The width of the arrowheads for directed edges.

- `arrowAttributes` (`SVGPolygonStyleAttributes<T>` | _optional_): Additional attributes to be applied to each arrowhead SVG polygon element. It can be a direct value or a function that receives an edge and returns the attribute value.

- `nodeEventListeners` (`SVGDataEventListeners<T>` | _optional_): Event listeners for the node SVG elements. Each key is an SVG element event, and the corresponding value is the callback function that handles the event. The callback receives the event object, the data of the node, and the tag name of the target element.

- `edgeEventListeners` (`SVGDataEventListeners<Edge>` | _optional_): Event listeners for the edge SVG elements. Each key is an SVG element event, and the corresponding value is the callback function that handles the event. The callback receives the event object, the data of the edge, and the tag name of the target element.

- `edgeLabelEventListeners` (`SVGDataEventListeners<Edge>` | _optional_): Event listeners for the edge label SVG text elements. Each key is an SVG element event, and the corresponding value is the callback function that handles the event. The callback receives the event object, the data of the edge, and the tag name of the target element.

- `viewBoxEventListeners` (`SVGEventListeners` | _optional_): Event listeners for the SVG viewBox element. Each key is an SVG element event, and the corresponding value is the callback function that handles the event. The callback receives the event object and the tag name of the target element.

