## 2025-02-12 - Frontend Config and Cleanup
**Learning:** React/Vite project configured with `"type": "module"` requires `tailwind.config.js` to use `export default` instead of `module.exports`.
**Action:** When fixing build issues in modern frontend setups, verify config files use ESM syntax.

## 2025-02-12 - Accessibility Pattern
**Learning:** `input[type="file"]` inside a `label` is best made accessible by using `sr-only` class on the input and `focus-within` styles on the label. This avoids complex sibling selectors or JavaScript for focus management.
**Action:** Use `focus-within` on parent labels for hidden inputs.
