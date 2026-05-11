---
'@liip/storybook-addon-resizr': patch
---

Relax the Storybook peer dependency to support Storybook 10.1 consumers. The
manager toolbar no longer imports the unsupported `ToggleButton` component, so
projects on Storybook 10.1 can consume the fixed bundle without upgrading their
Storybook runtime.
