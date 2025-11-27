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
}

export type Direction = 'horizontal' | 'vertical' | 'both';

export interface ResizeHandleProps {
  direction: Direction;
  onDragStart: () => void;
  onDrag: (deltaX: number, deltaY: number) => void;
  onDragEnd: () => void;
}
