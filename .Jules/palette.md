## 2026-02-18 - Hidden File Inputs Accessibility
**Learning:** Hidden file inputs (`display: none`) are inaccessible to keyboard users, preventing them from uploading files. Using `sr-only` keeps the input in the accessibility tree while hiding it visually.
**Action:** Replace `hidden` with `sr-only` for file inputs and style the parent label with `:focus-within` to show focus state. Add `aria-label` to inputs lacking visible labels.
