## 2026-02-22 - Keyboard Accessibility for File Inputs
**Learning:** Using `display: none` (or Tailwind's `hidden`) on a file input completely removes it from the accessibility tree, making it impossible for keyboard users to upload files.
**Action:** Use `sr-only` (screen-reader only) for the input and ensure its container or associated label has visible focus styles (e.g., `focus-within:ring`) to indicate when the hidden input is focused.
