import {ReactElement, SVGAttributes} from "react";


export type Id = number | string;


type MappedSVGAttributes<D, T> = {
  [P in keyof T]: T[P] | ((node: D) => T[P])
}

type OriginalSVGCircleStyleAttributes = Omit<SVGAttributes<SVGCircleElement>, 'cx' | 'cy'>;
type OriginalSVGLineStyleAttributes = Omit<SVGAttributes<SVGLineElement>, 'x1' | 'y1' | 'x2' | 'y2'>;
type OriginalSVGTextStyleAttributes = Omit<SVGAttributes<SVGTextElement>, 'x' | 'y'>;

export type SVGCircleStyleAttributes<T> = MappedSVGAttributes<T, OriginalSVGCircleStyleAttributes>;
export type SVGLineStyleAttributes<T> = MappedSVGAttributes<T, OriginalSVGLineStyleAttributes>;
export type SVGTextStyleAttributes<T> = MappedSVGAttributes<T, OriginalSVGTextStyleAttributes>;

export interface Edge {
  id: Id,
  source: Id,
  target: Id
}

export interface GraphProps<T> {
  width: number,
  height: number,
  nodes: T [],
  edges: Edge [],
  nodeIdProperty: string,
  nodeAttributes?: SVGCircleStyleAttributes<T>,
  nodeInnerElement?: ReactElement | ((node: T) => ReactElement),
  edgeAttributes?: SVGLineStyleAttributes<T>,
  edgeLabel?: string | ((node: T) => string),
  edgeLabelAttributes?: SVGTextStyleAttributes<T>
}

export interface CreateGraphParams<T> extends GraphProps<T> {
  ref: React.RefObject<Element>
}
