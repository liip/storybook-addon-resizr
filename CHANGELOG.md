# @liip/storybook-addon-resizr

## 0.1.7

### Patch Changes

- 24ebdad: Update the Storybook toolbar integration to use supported menu
  components and refresh Storybook dependencies to the latest 10.2 releases.
  This removes deprecation warnings around the viewport selector and aligns the
  addon with upcoming Storybook 11 button accessibility requirements.

## 0.1.6

### Patch Changes

- 579e444: Move resize handles inside the iframe to avoid scrollbar flicker on
  Windows/Linux.

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
