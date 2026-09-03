export interface Viewport {
  name: string;
  styles: {
    width: string;
    height: string;
  };
  type?: 'desktop' | 'mobile' | 'tablet' | 'other';
}

export type ViewportMap = Record<string, Viewport>;

export interface ResizrGlobals {
  width: number | null;
  height: number | null;
}

export interface ResizrBreakpoint {
  /** Label shown next to the dimensions, e.g. 'md'. */
  name: string;
  /** Lower bound of the range, in px (min-width semantics). */
  min: number;
}

export interface ResizrParameters {
  disable?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  showDimensions?: boolean;
  presets?: ViewportMap;
  breakpoints?: ResizrBreakpoint[];
}

export type Direction = 'horizontal' | 'vertical' | 'both';

export interface ResizeHandleProps {
  direction: Direction;
  onDragStart: () => void;
  onDrag: (deltaX: number, deltaY: number) => void;
  onDragEnd: () => void;
}
