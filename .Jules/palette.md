## 2026-02-11 - Interactive overlays must be focus-accessible
**Learning:** Interactive elements hidden by default (e.g., overlay delete buttons) must use `focus-within:opacity-100` (on containers) or `focus:opacity-100` to ensure visibility for keyboard users.
**Action:** When creating hidden-by-default controls, always ensure they become visible when focused.
