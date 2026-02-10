## 2026-02-10 - Keyboard Accessible File Inputs
**Learning:** Standard `<input type="file">` elements are notoriously hard to style and often hidden with `display: none`, which breaks keyboard accessibility. Using the `sr-only` class on the input and `focus-within` styles on the parent label allows for a custom UI that is both visually appealing and fully keyboard accessible.
**Action:** Always replace `hidden` with `sr-only` for file inputs and ensure the parent container has visible focus indicators (e.g., `focus-within:ring`).
