---
'@liip/storybook-addon-resizr': minor
---

Add a `breakpoints` parameter so consumers can declare their own breakpoints
and see the active one in the toolbar, e.g. `1280x800 - lg`. Entries are plain
`{ name, min }` data with `min-width` semantics, resolved against the width the
iframe actually has. Without a match there is no suffix — name the base range
with a `min: 0` entry — and omitting the parameter leaves the label unchanged.
