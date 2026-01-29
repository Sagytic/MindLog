## 2024-05-22 - Accessibility in Navigation
**Learning:** Icon-only buttons in the main navigation were inaccessible to screen readers, and the dark mode toggle was a non-interactive `div`.
**Action:** Always check interactive elements for keyboard focusability and accessible labels, especially in global navigation components.

## 2024-05-22 - Toggle Switch Labels
**Learning:** For toggle switches (`role="switch"`), dynamic labels like "Switch to Light Mode" can be verbose or confusing.
**Action:** Use a static label describing the feature (e.g., "Dark Mode") and rely on `aria-checked` to convey state ("on"/"off").
