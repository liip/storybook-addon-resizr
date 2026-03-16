import { GrowIcon } from '@storybook/icons';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Select, Separator } from 'storybook/internal/components';
import { addons, useGlobals, useParameter } from 'storybook/manager-api';
import { styled, Global } from 'storybook/theming';

import { PARAM_KEY, MINIMAL_VIEWPORTS, EVENTS } from './constants';

import type { ResizrParameters, ViewportMap } from './types';

const RESET_ID = 'reset';
const CUSTOM_ID = 'custom';

const ButtonLabel = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
});

const DimensionLabel = styled.span({
  fontSize: '11px',
  fontVariantNumeric: 'tabular-nums',
  opacity: 0.9,
});

const RotateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 9V7a2 2 0 0 0-2-2h-6" />
    <path d="m15 2-3 3 3 3" />
    <path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
  </svg>
);

const PersistIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
  </svg>
);

const ResetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 15 6 6" />
    <path d="m15 9 6-6" />
    <path d="M21 16v5h-5" />
    <path d="M21 8V3h-5" />
    <path d="M3 16v5h5" />
    <path d="m3 21 6-6" />
    <path d="M3 8V3h5" />
    <path d="M9 9 3 3" />
  </svg>
);

export const Tool = memo(function ResizerTool() {
  const [globals, updateGlobals] = useGlobals();
  const resizrParams = useParameter<ResizrParameters>(PARAM_KEY);

  const persistedWidth = (globals.resizrWidth as number | null) ?? null;
  const persistedHeight = (globals.resizrHeight as number | null) ?? null;

  const [pendingSize, setPendingSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const channel = addons.getChannel();
    const handlePendingSizeChanged = (
      data: {
        width: number;
        height: number;
      } | null,
    ) => {
      setPendingSize(data);
    };
    channel.on(EVENTS.PENDING_SIZE_CHANGED, handlePendingSizeChanged);
    return () => {
      channel.off(EVENTS.PENDING_SIZE_CHANGED, handlePendingSizeChanged);
    };
  }, []);

  const width = pendingSize?.width ?? persistedWidth;
  const height = pendingSize?.height ?? persistedHeight;
  const hasPendingSize = pendingSize !== null;

  const viewports: ViewportMap = useMemo(
    () => resizrParams?.presets ?? MINIMAL_VIEWPORTS,
    [resizrParams?.presets],
  );

  const selectedViewport = useMemo(() => {
    if (width === null && height === null) {
      return RESET_ID;
    }

    for (const [id, viewport] of Object.entries(viewports)) {
      const presetWidth = parseInt(viewport.styles.width, 10);
      const presetHeight = parseInt(viewport.styles.height, 10);

      if (width === presetWidth && height === presetHeight) {
        return id;
      }
    }

    return CUSTOM_ID;
  }, [width, height, viewports]);

  const toggleLandscape = useCallback(() => {
    if (width !== null && height !== null) {
      const channel = addons.getChannel();
      const newPendingSize = { width: height, height: width };
      setPendingSize(newPendingSize);
      channel.emit(EVENTS.PENDING_SIZE_CHANGED, newPendingSize);
    }
  }, [width, height]);

  const persistSize = useCallback(() => {
    if (pendingSize !== null) {
      updateGlobals({
        resizrWidth: pendingSize.width,
        resizrHeight: pendingSize.height,
      });
      setPendingSize(null);
      const channel = addons.getChannel();
      channel.emit(EVENTS.PENDING_SIZE_CHANGED, null);
    }
  }, [updateGlobals, pendingSize]);

  const selectViewport = useCallback(
    (viewportId: string) => {
      setPendingSize(null);
      const channel = addons.getChannel();
      channel.emit(EVENTS.PENDING_SIZE_CHANGED, null);

      if (viewportId === RESET_ID) {
        updateGlobals({
          resizrWidth: null,
          resizrHeight: null,
        });
      } else if (viewportId !== CUSTOM_ID) {
        const viewport = viewports[viewportId];
        if (viewport) {
          updateGlobals({
            resizrWidth: parseInt(viewport.styles.width, 10),
            resizrHeight: parseInt(viewport.styles.height, 10),
          });
        }
      }
    },
    [updateGlobals, viewports],
  );

  const resetViewport = useCallback(() => {
    setPendingSize(null);
    const channel = addons.getChannel();
    channel.emit(EVENTS.PENDING_SIZE_CHANGED, null);

    updateGlobals({
      resizrWidth: null,
      resizrHeight: null,
    });
  }, [updateGlobals]);

  const selectOptions = useMemo(() => {
    const items: {
      title: string;
      description?: string;
      value: string;
    }[] = [];

    const grouped = {
      mobile: Object.entries(viewports).filter(([, v]) => v.type === 'mobile'),
      tablet: Object.entries(viewports).filter(([, v]) => v.type === 'tablet'),
      desktop: Object.entries(viewports).filter(
        ([, v]) => v.type === 'desktop',
      ),
      other: Object.entries(viewports).filter(
        ([, v]) => !v.type || v.type === 'other',
      ),
    };

    for (const group of Object.values(grouped)) {
      for (const [id, viewport] of group) {
        const w = parseInt(viewport.styles.width, 10);
        const h = parseInt(viewport.styles.height, 10);
        items.push({
          value: id,
          title: `${w}x${h}`,
          description: viewport.name,
        });
      }
    }

    if (selectedViewport === CUSTOM_ID && width !== null && height !== null) {
      items.push({
        value: CUSTOM_ID,
        title: `${width}x${height}`,
        description: 'Custom',
      });
    }

    return items;
  }, [viewports, selectedViewport, width, height]);

  const displayLabel = useMemo(() => {
    if (selectedViewport === RESET_ID) {
      return null;
    }

    if (selectedViewport === CUSTOM_ID) {
      return width !== null && height !== null ? `${width}x${height}` : null;
    }

    const viewport = viewports[selectedViewport];

    if (viewport) {
      return `${parseInt(viewport.styles.width, 10)}x${parseInt(viewport.styles.height, 10)}`;
    }

    return null;
  }, [selectedViewport, viewports, width, height]);

  if (resizrParams?.disable) {
    return null;
  }

  const hasCustomSize = width !== null && height !== null;

  const iframeStyles = hasCustomSize
    ? {
        [`iframe[data-is-storybook="true"]`]: {
          width: `${width}px`,
          height: `${height}px`,
        },
      }
    : {};

  return (
    <>
      {hasCustomSize && <Global styles={iframeStyles} />}

      <Separator />

      <Select
        ariaLabel="Viewport size"
        size="small"
        icon={<GrowIcon />}
        options={selectOptions}
        defaultOptions={selectedViewport !== RESET_ID ? selectedViewport : []}
        onSelect={(value) => selectViewport(value as string)}
        onReset={resetViewport}
        resetLabel="Reset viewport"
      >
        {displayLabel && <DimensionLabel>{displayLabel}</DimensionLabel>}
      </Select>

      {hasCustomSize && (
        <Button
          key="viewport-rotate"
          title="Rotate viewport (swap width and height)"
          ariaLabel={false}
          variant="ghost"
          size="small"
          onClick={toggleLandscape}
        >
          <ButtonLabel>
            <RotateIcon />
            Rotate
          </ButtonLabel>
        </Button>
      )}

      {hasCustomSize && (
        <Button
          key="viewport-reset"
          title="Reset viewport to full size"
          ariaLabel={false}
          variant="ghost"
          size="small"
          onClick={resetViewport}
        >
          <ButtonLabel>
            <ResetIcon />
            Reset
          </ButtonLabel>
        </Button>
      )}

      {hasPendingSize && (
        <Button
          key="viewport-persist"
          title="Persist current size to URL"
          ariaLabel={false}
          variant="ghost"
          size="small"
          onClick={persistSize}
        >
          <ButtonLabel>
            <PersistIcon />
            Persist
          </ButtonLabel>
        </Button>
      )}

      <Separator />
    </>
  );
});
