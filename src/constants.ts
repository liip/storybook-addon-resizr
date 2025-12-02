export const ADDON_ID = 'storybook-addon-resizr';
export const TOOL_ID = `${ADDON_ID}/tool`;
export const PREVIEW_ID = `${ADDON_ID}/preview`;
export const PARAM_KEY = 'resizr';

// Channel events for pending size (not persisted to URL)
export const EVENTS = {
  PENDING_SIZE_CHANGED: `${ADDON_ID}/pending-size-changed`,
};

export const DEFAULT_MIN_WIDTH = 200;
export const DEFAULT_MIN_HEIGHT = 200;

export const MINIMAL_VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '360px',
      height: '800px',
    },
    type: 'mobile' as const,
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
    type: 'tablet' as const,
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1920px',
      height: '1080px',
    },
    type: 'desktop' as const,
  },
};
