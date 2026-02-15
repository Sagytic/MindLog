## 2026-02-15 - Accessible File Inputs
**Learning:** `input[type="file"]` with `display: none` (or `hidden` class) is inaccessible to keyboard users because it's removed from the accessibility tree.
**Action:** Use `sr-only` class on the input to hide it visually but keep it focusable, and apply `focus-within` styles to the parent label to visually indicate focus state.
