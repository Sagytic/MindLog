# Palette's Journal

## 2024-05-23 - Accessible Custom File Inputs
**Learning:** Standard `input[type="file"]` elements are often hidden (`display: none`) to style the label instead, but this removes them from the accessibility tree, making them impossible to use with keyboards or screen readers.
**Action:** Use the `sr-only` class (visually hidden but accessible) instead of `hidden`. Combine this with `focus-within` styles on the parent label to provide a clear visual focus indicator when the invisible input receives focus.
