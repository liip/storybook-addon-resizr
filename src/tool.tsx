import { GrowIcon } from '@storybook/icons';
import React, { memo, useCallback, useMemo } from 'react';
import {
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from 'storybook/internal/components';
import { useGlobals, useParameter } from 'storybook/manager-api';
import { styled, Global } from 'storybook/theming';

import { PARAM_KEY, MINIMAL_VIEWPORTS } from './constants';

import type { ResizrGlobals, ResizrParameters, ViewportMap } from './types';

const RESET_ID = 'reset';
const CUSTOM_ID = 'custom';

const defaultGlobals: ResizrGlobals = {
  width: null,
  height: null,
};

const IconButtonLabel = styled.div({
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

export const Tool = memo(function ResizerTool() {
  const [globals, updateGlobals] = useGlobals();
  const resizrParams = useParameter<ResizrParameters>(PARAM_KEY);

  const resizrGlobals: ResizrGlobals = useMemo(
    () => ({
      ...defaultGlobals,
      ...(globals[PARAM_KEY] as Partial<ResizrGlobals> | undefined),
    }),
    [globals],
  );

  const { width, height } = resizrGlobals;

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
      updateGlobals({
        [PARAM_KEY]: { width: height, height: width },
      });
    }
  }, [updateGlobals, width, height]);

  const selectViewport = useCallback(
    (viewportId: string) => {
      if (viewportId === RESET_ID) {
        updateGlobals({
          [PARAM_KEY]: { width: null, height: null },
        });
      } else if (viewportId !== CUSTOM_ID) {
        const viewport = viewports[viewportId];
        if (viewport) {
          updateGlobals({
            [PARAM_KEY]: {
              width: parseInt(viewport.styles.width, 10),
              height: parseInt(viewport.styles.height, 10),
            },
          });
        }
      }
    },
    [updateGlobals, viewports],
  );

  const links = useMemo(() => {
    const items: {
      id: string;
      title: string;
      right?: string;
      active: boolean;
      onClick: () => void;
    }[] = [];

    const hasSize = width !== null && height !== null;

    if (hasSize) {
      items.push({
        id: RESET_ID,
        title: 'Reset',
        active: false,
        onClick: () => selectViewport(RESET_ID),
      });
    }

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
          id,
          title: viewport.name,
          right: `${w}x${h}`,
          active: selectedViewport === id,
          onClick: () => selectViewport(id),
        });
      }
    }

    if (selectedViewport === CUSTOM_ID && hasSize) {
      items.push({
        id: CUSTOM_ID,
        title: 'Custom',
        right: `${width}x${height}`,
        active: true,
        onClick: () => selectViewport(CUSTOM_ID),
      });
    }

    return items;
  }, [viewports, selectedViewport, width, height, selectViewport]);

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
  const isActive = selectedViewport !== RESET_ID;

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

      <WithTooltip
        placement="top"
        closeOnOutsideClick
        tooltip={({ onHide }) => (
          <TooltipLinkList
            links={links.map((link) => ({
              ...link,
              onClick: () => {
                link.onClick();
                onHide();
              },
            }))}
          />
        )}
      >
        <IconButton
          key="viewport-selector"
          title="Change viewport size"
          active={isActive}
        >
          <IconButtonLabel>
            <GrowIcon />
            {displayLabel && <DimensionLabel>{displayLabel}</DimensionLabel>}
          </IconButtonLabel>
        </IconButton>
      </WithTooltip>

      {hasCustomSize && (
        <IconButton
          key="viewport-rotate"
          title="Rotate viewport (swap width and height)"
          onClick={toggleLandscape}
        >
          <RotateIcon />
        </IconButton>
      )}
    </>
  );
});
