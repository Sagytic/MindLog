# Palette's Design Journal

This journal tracks critical UX and accessibility learnings for this project.

## Format
```
## YYYY-MM-DD - [Title]
**Learning:** [UX/a11y insight]
**Action:** [How to apply next time]
```

## 2025-02-18 - Accessible File Inputs
**Learning:** Using a `<label>` to wrap a hidden file input creates accessibility issues for keyboard users because the `label` element is not focusable by default, even if it has `cursor-pointer`.
**Action:** Instead of wrapping with a label, use a standard `<button type="button">` that triggers the hidden input via a `ref` (`inputRef.current.click()`). This ensures the "upload" action is in the natural tab order and can be activated with Enter/Space.
