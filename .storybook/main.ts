import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    // Use local addon (auto-discovers manager.js and preview.js from package root)
    resolve(__dirname, '..'),
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    // Disable the official viewport addon - we provide our own
    viewport: false,
  },
};

export default config;
