import React from 'react';
import { addons, types } from 'storybook/manager-api';

import { ADDON_ID, TOOL_ID, PREVIEW_ID } from './constants';
import { ResizeFrame } from './resize-frame';
import { Tool } from './tool';

addons.add(PREVIEW_ID, {
  type: types.PREVIEW,
  render: (p: { children: React.ReactNode }) => {
    return React.createElement(ResizeFrame, null, p.children);
  },
});

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Resizr',
    match: ({ viewMode, tabId }) => viewMode === 'story' && !tabId,
    render: () => React.createElement(Tool),
  });
});
