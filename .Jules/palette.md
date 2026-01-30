## 2025-02-18 - Keyboard Accessible File Inputs
**Learning:** Using `<label>` to wrap hidden file inputs is common but often lacks keyboard accessibility unless the label is explicitly made focusable and handles key events.
**Action:** Prefer using a semantic `<button>` trigger linked to a hidden input via `ref` for better native accessibility and focus management.
