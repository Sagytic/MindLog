## 2026-02-05 - Accessible File Input Pattern
**Learning:** Hidden file inputs wrapped in `<label>` tags can be inaccessible to keyboard users, preventing tab focus.
**Action:** Use a visible `<button type="button">` that triggers a hidden input via `ref.current.click()`. This ensures the trigger is in the natural tab order and can be activated with Enter/Space.
