# @liip/storybook-addon-resizr

A Storybook addon that replaces the official Viewport addon with a resizable iframe. Select viewport presets from a dropdown or drag handles to resize freely.

## Features

- **Viewport selector dropdown** - Choose from preset device sizes (Mobile, Tablet, Desktop)
- **Draggable resize handles** - Resize the iframe by dragging edges or corner
- **Rotate button** - Swap width/height to toggle portrait/landscape orientation
- **Custom dimensions** - Auto-detected when you manually resize
- **Configurable presets** - Define your own viewport presets

## Installation

```bash
npm install @liip/storybook-addon-resizr
```

## Configuration

Add the addon to your `.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  addons: ['@liip/storybook-addon-resizr'],
  features: {
    // Disable the official viewport addon (optional, recommended)
    viewport: false,
  },
};

export default config;
```

## Usage

Once installed, you'll see in the toolbar:

1. **Viewport selector** - Click to open dropdown with preset sizes
2. **Rotate button** - Appears when a size is set, swaps width/height
3. **Resize handles** - Drag right edge, bottom edge, or corner to resize

### Default Presets

| Name    | Size       | Type    |
|---------|------------|---------|
| Mobile  | 360x800    | mobile  |
| Tablet  | 768x1024   | tablet  |
| Desktop | 1920x1080  | desktop |

### Dropdown Options

- **Reset** - Returns to auto-sizing (only visible when a size is set)
- **Preset sizes** - Mobile, Tablet, Desktop
- **Custom** - Auto-selected when you manually drag to resize

## Parameters

Configure the addon per-story or globally:

```ts
// In a story file
export const MyStory = {
  parameters: {
    resizr: {
      disable: false,         // Disable for this story
      minWidth: 200,          // Minimum width constraint (default: 200)
      minHeight: 200,         // Minimum height constraint (default: 200)
      maxWidth: 1920,         // Maximum width constraint
      maxHeight: 1080,        // Maximum height constraint
      presets: {              // Custom viewport presets
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
      },
    },
  },
};
```

### Global Configuration

Set defaults in `.storybook/preview.ts`:

```ts
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    resizr: {
      minWidth: 320,
      minHeight: 480,
    },
  },
};

export default preview;
```

## API

### Exports

```ts
import {
  ADDON_ID,
  PARAM_KEY,
  MINIMAL_VIEWPORTS,
  ResizeFrame,
} from '@liip/storybook-addon-resizr';

import type {
  ResizrGlobals,
  ResizrParameters,
  Viewport,
  ViewportMap,
  Direction,
} from '@liip/storybook-addon-resizr';
```

### Globals

The addon stores state in Storybook globals under the `resizr` key:

```ts
interface ResizrGlobals {
  width: number | null;   // Custom width in px (null = auto)
  height: number | null;  // Custom height in px (null = auto)
}
```

## Compatibility

- Storybook 10.x
- Works with React, Vue, Angular, Svelte, Web Components, and other frameworks

## Development

```bash
# Install dependencies
npm install

# Build the addon
npm run build

# Start development (builds addon + runs Storybook)
npm run start

# Run Storybook only
npm run storybook
```

## License

MIT
