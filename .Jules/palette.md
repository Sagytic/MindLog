## 2026-02-21 - Accessible Interactive List Items
**Learning:** Interactive list items (like diary cards) implemented as `div`s need `role="article"`, `tabIndex="0"`, and `onKeyDown` handlers for keyboard accessibility. Nested interactive elements (like Edit/Delete buttons) require `e.stopPropagation()` on clicks and `e.target === e.currentTarget` checks in the parent's key handler to prevent conflict.
**Action:** Use this pattern for any clickable card components to ensure keyboard users can access the primary action (view details) and secondary actions (edit/delete).

## 2026-02-21 - Revealing Actions on Focus
**Learning:** Action buttons hidden by default (`opacity-0`) must be revealed not just on hover (`group-hover:opacity-100`) but also when they receive focus (`focus-within:opacity-100`). This ensures keyboard users can see the controls they tab into.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` (or `focus:opacity-100`) for hidden interactive elements.
