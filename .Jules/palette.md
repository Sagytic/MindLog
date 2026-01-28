## 2024-05-21 - Accessible Form Controls
**Learning:** Icon-only buttons require `aria-label` or hidden text. Additionally, for file inputs styled with a custom label, relying on `display: none` (`hidden` class) makes the input inaccessible to keyboard users. Using `sr-only` on the input combined with `focus-within` styling on the parent label ensures the control remains focusable and provides visual feedback.
**Action:** Replace `hidden` with `sr-only` for inputs inside labels, and add `focus-within` styles to the label wrapper.
