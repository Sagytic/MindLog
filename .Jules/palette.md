## 2025-01-27 - Accessible File Inputs with Custom UI
**Learning:** `className='hidden'` makes file inputs inaccessible to keyboard users because it applies `display: none`.
**Action:** Use `className='sr-only'` on the input and `className='focus-within:ring-...'` on the wrapper `<label>` to provide visual feedback for keyboard focus.
