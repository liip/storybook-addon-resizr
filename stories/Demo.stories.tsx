import React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

const Demo: React.FC = () => (
  <p style={{ padding: '20px', margin: 0, fontSize: '16px', lineHeight: 1.6 }}>
    This is a simple paragraph to demonstrate the resizr addon. Use the viewport
    selector in the toolbar to choose a preset size, or drag the edges of the
    iframe to resize manually.
  </p>
);

const meta: Meta<typeof Demo> = {
  title: 'Demo',
  component: Demo,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {};

export const WithBreakpoints: Story = {
  parameters: {
    resizr: {
      breakpoints: [
        { name: 'xxs', min: 0 },
        { name: 'xs', min: 480 },
        { name: 'sm', min: 640 },
        { name: 'md', min: 768 },
        { name: 'lg', min: 1024 },
        { name: 'xl', min: 1280 },
      ],
    },
  },
};
