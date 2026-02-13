## 2025-02-18 - File Input Accessibility
**Learning:** `display: none` (`hidden` class) removes elements from the accessibility tree, making file inputs inaccessible to keyboard users. Using `sr-only` keeps them focusable while visually hidden.
**Action:** Always use `sr-only` for file inputs and style the wrapping label with `focus-within` to provide visual feedback.
