import { PARAM_KEY } from './constants';

import type { ProjectAnnotations, Renderer } from 'storybook/internal/types';

const preview: ProjectAnnotations<Renderer> = {
  initialGlobals: {
    [PARAM_KEY]: {
      width: null,
      height: null,
    },
  },
};

export default preview;
