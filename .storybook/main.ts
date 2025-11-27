import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    // Use our local addon preset (replaces official viewport addon)
    import.meta.resolve('../dist/preset.js'),
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
