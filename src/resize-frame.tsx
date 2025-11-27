import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useGlobals, useParameter } from 'storybook/manager-api';
import { styled } from 'storybook/theming';

import { PARAM_KEY, DEFAULT_MIN_WIDTH, DEFAULT_MIN_HEIGHT } from './constants';

import type { ResizrGlobals, ResizrParameters, Direction } from './types';

const defaultGlobals: ResizrGlobals = {
  width: null,
  height: null,
};

let isDragging = false;
let dragStartMouseX = 0;
let dragStartMouseY = 0;
let dragStartWidth = 0;
let dragStartHeight = 0;

const Wrapper = styled.div({
  width: '100%',
  height: '100%',
  position: 'relative',
});

const DragOverlay = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 99999,
  cursor: 'inherit',
});

const HandlesOverlay = styled.div<{
  $top: number;
  $left: number;
  $width: number;
  $height: number;
}>(({ $top, $left, $width, $height }) => ({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 100,
  top: `${$top}px`,
  left: `${$left}px`,
  width: `${$width}px`,
  height: `${$height}px`,
}));

const HandleBase = styled.div<{ $direction: Direction; $visible: boolean }>(
  ({ $direction, $visible }) => ({
    position: 'absolute',
    pointerEvents: 'auto',
    background: $visible ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
    zIndex: 101,
    transition: 'background-color 0.15s ease',
    ...($direction === 'horizontal' && {
      top: 0,
      right: -6,
      width: '12px',
      height: '100%',
      cursor: 'ew-resize',
    }),
    ...($direction === 'vertical' && {
      bottom: -6,
      left: 0,
      width: '100%',
      height: '12px',
      cursor: 'ns-resize',
    }),
    ...($direction === 'both' && {
      bottom: -6,
      right: -6,
      width: '16px',
      height: '16px',
      cursor: 'nwse-resize',
      borderRadius: '2px',
    }),
    '&:hover': {
      background: 'rgba(59, 130, 246, 0.3)',
      '& > div': { opacity: 1 },
    },
    '&:active': {
      background: 'rgba(59, 130, 246, 0.4)',
      '& > div': { opacity: 1, background: 'rgba(59, 130, 246, 0.9)' },
    },
  }),
);

const HandleIndicator = styled.div<{ $direction: Direction }>(
  ({ $direction }) => ({
    position: 'absolute',
    background: 'rgba(59, 130, 246, 0.7)',
    borderRadius: '2px',
    opacity: 0,
    transition: 'opacity 0.15s ease',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    ...($direction === 'horizontal' && { width: '4px', height: '40px' }),
    ...($direction === 'vertical' && { width: '40px', height: '4px' }),
    ...($direction === 'both' && { width: '8px', height: '8px' }),
  }),
);

interface ResizeHandleProps {
  direction: Direction;
  visible: boolean;
  onDragStart: (startX: number, startY: number) => void;
  onDrag: (direction: Direction, mouseX: number, mouseY: number) => void;
  onDragEnd: () => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  visible,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      onDragStart(e.clientX, e.clientY);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        onDrag(direction, moveEvent.clientX, moveEvent.clientY);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        onDragEnd();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      const cursors: Record<Direction, string> = {
        horizontal: 'ew-resize',
        vertical: 'ns-resize',
        both: 'nwse-resize',
      };
      document.body.style.cursor = cursors[direction];
      document.body.style.userSelect = 'none';
    },
    [direction, onDragStart, onDrag, onDragEnd],
  );

  return (
    <HandleBase
      $direction={direction}
      $visible={visible}
      onMouseDown={handleMouseDown}
    >
      <HandleIndicator $direction={direction} />
    </HandleBase>
  );
};

const clamp = (value: number, min: number, max?: number): number => {
  if (max !== undefined) {
    return Math.max(min, Math.min(max, value));
  }

  return Math.max(min, value);
};

interface ResizeFrameProps {
  children?: React.ReactNode;
}

export const ResizeFrame: React.FC<ResizeFrameProps> = ({ children }) => {
  const [globals, updateGlobals] = useGlobals();
  const params = useParameter<ResizrParameters>(PARAM_KEY);
  const [isHovering, setIsHovering] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [iframeRect, setIframeRect] = useState<DOMRect | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const resizrGlobals: ResizrGlobals = {
    ...defaultGlobals,
    ...(globals[PARAM_KEY] as Partial<ResizrGlobals> | undefined),
  };

  const { width, height } = resizrGlobals;

  const minWidth = params?.minWidth ?? DEFAULT_MIN_WIDTH;
  const minHeight = params?.minHeight ?? DEFAULT_MIN_HEIGHT;
  const maxWidth = params?.maxWidth;
  const maxHeight = params?.maxHeight;

  useEffect(() => {
    const updateIframeRect = () => {
      const iframe = document.querySelector(
        'iframe[data-is-storybook="true"]',
      ) as HTMLIFrameElement;
      const wrapper = wrapperRef.current;
      if (iframe && wrapper) {
        const iframeR = iframe.getBoundingClientRect();
        const wrapperR = wrapper.getBoundingClientRect();
        setIframeRect(
          new DOMRect(
            iframeR.left - wrapperR.left,
            iframeR.top - wrapperR.top,
            iframeR.width,
            iframeR.height,
          ),
        );
      }
    };

    updateIframeRect();

    const observer = new ResizeObserver(updateIframeRect);
    const iframe = document.querySelector('iframe[data-is-storybook="true"]');
    if (iframe) {
      observer.observe(iframe);
    }
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [width, height]);

  const isNearIframeEdge = useCallback(
    (clientX: number, clientY: number): boolean => {
      const wrapper = wrapperRef.current;
      if (!wrapper || !iframeRect) {
        return false;
      }

      const wrapperRect = wrapper.getBoundingClientRect();
      const iframeLeft = wrapperRect.left + iframeRect.left;
      const iframeTop = wrapperRect.top + iframeRect.top;
      const iframeRight = iframeLeft + iframeRect.width;
      const iframeBottom = iframeTop + iframeRect.height;

      const threshold = 20;
      const nearRightEdge =
        clientX >= iframeRight - threshold &&
        clientX <= iframeRight + threshold;
      const nearBottomEdge =
        clientY >= iframeBottom - threshold &&
        clientY <= iframeBottom + threshold;
      const nearLeftEdge =
        clientX >= iframeLeft - threshold && clientX <= iframeLeft + threshold;
      const nearTopEdge =
        clientY >= iframeTop - threshold && clientY <= iframeTop + threshold;

      const withinVerticalBounds =
        clientY >= iframeTop - threshold && clientY <= iframeBottom + threshold;
      const withinHorizontalBounds =
        clientX >= iframeLeft - threshold && clientX <= iframeRight + threshold;

      return (
        (nearRightEdge && withinVerticalBounds) ||
        (nearBottomEdge && withinHorizontalBounds) ||
        ((nearRightEdge || nearLeftEdge) && (nearTopEdge || nearBottomEdge))
      );
    },
    [iframeRect],
  );

  useEffect(() => {
    if (isDraggingState) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsHovering(isNearIframeEdge(e.clientX, e.clientY));
    };

    const handleIframeMouseMove = (e: MouseEvent) => {
      const iframe = document.querySelector(
        'iframe[data-is-storybook="true"]',
      ) as HTMLIFrameElement;
      if (!iframe) {
        return;
      }

      const rect = iframe.getBoundingClientRect();
      setIsHovering(
        isNearIframeEdge(rect.left + e.clientX, rect.top + e.clientY),
      );
    };

    document.addEventListener('mousemove', handleMouseMove);

    const iframe = document.querySelector(
      'iframe[data-is-storybook="true"]',
    ) as HTMLIFrameElement;
    let iframeDoc: Document | null = null;

    try {
      iframeDoc =
        iframe?.contentDocument || iframe?.contentWindow?.document || null;
      if (iframeDoc) {
        iframeDoc.addEventListener('mousemove', handleIframeMouseMove);
      }
    } catch {
      // Cross-origin iframe
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (iframeDoc) {
        try {
          iframeDoc.removeEventListener('mousemove', handleIframeMouseMove);
        } catch {
          // Ignore
        }
      }
    };
  }, [isDraggingState, isNearIframeEdge]);

  const getIframeSizeFromDOM = useCallback(() => {
    const iframe = document.querySelector(
      'iframe[data-is-storybook="true"]',
    ) as HTMLIFrameElement;
    if (iframe) {
      const rect = iframe.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    return { width: 800, height: 600 };
  }, []);

  const handleDragStart = useCallback(
    (startX: number, startY: number) => {
      isDragging = true;
      setIsDraggingState(true);
      dragStartMouseX = startX;
      dragStartMouseY = startY;

      if (width !== null && height !== null) {
        dragStartWidth = width;
        dragStartHeight = height;
      } else {
        const size = getIframeSizeFromDOM();
        dragStartWidth = size.width;
        dragStartHeight = size.height;
      }
    },
    [width, height, getIframeSizeFromDOM],
  );

  const isIframeCenteredHorizontally = useCallback(() => {
    const iframe = document.querySelector(
      'iframe[data-is-storybook="true"]',
    ) as HTMLIFrameElement;
    const wrapper = wrapperRef.current;
    if (!iframe || !wrapper) {
      return false;
    }

    const iframeRect = iframe.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const leftSpace = iframeRect.left - wrapperRect.left;
    const rightSpace = wrapperRect.right - iframeRect.right;

    return Math.abs(leftSpace - rightSpace) < 5 && leftSpace > 5;
  }, []);

  const handleDrag = useCallback(
    (direction: Direction, mouseX: number, mouseY: number) => {
      if (!isDragging) {
        return;
      }

      const horizontalMultiplier = isIframeCenteredHorizontally() ? 2 : 1;
      const deltaX = mouseX - dragStartMouseX;
      const deltaY = mouseY - dragStartMouseY;

      let newWidth = dragStartWidth;
      let newHeight = dragStartHeight;

      if (direction === 'horizontal' || direction === 'both') {
        newWidth = clamp(
          dragStartWidth + deltaX * horizontalMultiplier,
          minWidth,
          maxWidth,
        );
      }

      if (direction === 'vertical' || direction === 'both') {
        newHeight = clamp(dragStartHeight + deltaY, minHeight, maxHeight);
      }

      updateGlobals({
        [PARAM_KEY]: {
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        },
      });
    },
    [
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      updateGlobals,
      isIframeCenteredHorizontally,
    ],
  );

  const handleDragEnd = useCallback(() => {
    isDragging = false;
    setIsDraggingState(false);
  }, []);

  if (params?.disable) {
    return <>{children}</>;
  }

  return (
    <Wrapper ref={wrapperRef}>
      {children}

      {isDraggingState && <DragOverlay />}

      {iframeRect && (
        <HandlesOverlay
          $top={iframeRect.top}
          $left={iframeRect.left}
          $width={iframeRect.width}
          $height={iframeRect.height}
        >
          <ResizeHandle
            direction="horizontal"
            visible={isHovering || isDraggingState}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
          <ResizeHandle
            direction="vertical"
            visible={isHovering || isDraggingState}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
          <ResizeHandle
            direction="both"
            visible={isHovering || isDraggingState}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
        </HandlesOverlay>
      )}
    </Wrapper>
  );
};
