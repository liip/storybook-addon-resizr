# @liip/storybook-addon-resizr

## 0.1.5

### Patch Changes

- 1ba1321: Avoid persisting size in the url on each drag end event to not reload
  the iframe content each time

## 0.1.4

### Patch Changes

- 94f145b: Remove preset file to avoid double instantiation of the plugin
- df8dfdd: Fix persisting dimensions in the URL

## 0.1.3

### Patch Changes

- 51b73c1: Fix how the manager bundle the react runtime to avoid React version
  mismatch

## 0.1.2

### Patch Changes

- 04b12aa: Remove `ResizeFrame` export from the `previewEntries` bundle to avoid
  React version mismatch

## 0.1.1

### Patch Changes

- bbd78b2: Add shim files at the package root so it works if plugin is embeded
  through its absolute path

## 0.1.0

### Minor Changes

- 5383479: Initial release
