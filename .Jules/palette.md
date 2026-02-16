## 2025-02-13 - File Input Accessibility & Tailwind Config
**Learning:** Hidden inputs (`display: none` / `hidden` class) are removed from the accessibility tree, making them inaccessible to keyboard users. Using `sr-only` keeps them focusable.
**Action:** Always use `sr-only` (or equivalent visually-hidden styles) for file inputs and other controls that need to be visually replaced but remain keyboard accessible. Ensure the wrapping label has `focus-within` styles to provide visual feedback.

**Learning:** Tailwind CSS configuration using `module.exports` causes linting errors in ES Module (`type: "module"`) projects.
**Action:** Use `export default` for `tailwind.config.js` in Vite/ESM projects to ensure compatibility and avoid linting issues.
