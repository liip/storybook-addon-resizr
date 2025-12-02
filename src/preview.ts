import type { ProjectAnnotations, Renderer } from 'storybook/internal/types';

const preview: ProjectAnnotations<Renderer> = {
  globalTypes: {
    resizrWidth: {
      description: 'Resizr viewport width',
    },
    resizrHeight: {
      description: 'Resizr viewport height',
    },
  },
  initialGlobals: {
    resizrWidth: null,
    resizrHeight: null,
  },
};

export default preview;
