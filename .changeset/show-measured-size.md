---
'@liip/storybook-addon-resizr': patch
---

Show the iframe dimensions in the toolbar as soon as Storybook loads. The label
used to stay empty until a preset was picked or the iframe was dragged, because
it only read the persisted size. The toolbar now measures the preview iframe
itself and displays that size in a dimmed style until an explicit size is set.
