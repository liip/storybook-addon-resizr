# @liip/storybook-addon-resizr

## 0.2.0

### Minor Changes

- 7a93e30: Add a `breakpoints` parameter so consumers can declare their own
  breakpoints and see the active one in the toolbar, e.g. `1280x800 - lg`.
  Entries are plain `{ name, min }` data with `min-width` semantics, resolved
  against the width the iframe actually has. Without a match there is no suffix
  — name the base range with a `min: 0` entry — and omitting the parameter
  leaves the label unchanged.
- 7d4c86e: Add improved responsive viewport handling in the Storybook Resizr
  addon.

### Patch Changes

- 7a93e30: Show the iframe dimensions in the toolbar as soon as Storybook loads.
  The label used to stay empty until a preset was picked or the iframe was
  dragged, because it only read the persisted size. The toolbar now measures the
  preview iframe itself and displays that size in a dimmed style until an
  explicit size is set.

## 0.1.8

### Patch Changes

- 5d4e2f2: Relax the Storybook peer dependency to support Storybook 10.1
  consumers. The manager toolbar no longer imports the unsupported
  `ToggleButton` component, so projects on Storybook 10.1 can consume the fixed
  bundle without upgrading their Storybook runtime.

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
