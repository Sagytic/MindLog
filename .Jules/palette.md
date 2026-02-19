## 2025-02-18 - Clickable Cards Accessibility
**Learning:** List items implemented as `div` with `onClick` handlers are inaccessible to keyboard users, requiring them to use a mouse.
**Action:** Use semantic `<article>` tags, add `tabIndex="0"`, and implement `onKeyDown` handlers for `Enter` and `Space` keys to ensure full keyboard accessibility.
