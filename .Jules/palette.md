## 2025-02-04 - [Accessibility]
**Learning:** Icon-only buttons revealed on hover (`group-hover:opacity-100`) are inaccessible to keyboard users unless `focus-within:opacity-100` or `focus:opacity-100` is also added.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` for container-based reveals, or `focus:opacity-100` for self-reveals.
