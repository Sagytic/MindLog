## 2025-02-22 - Frontend Performance & Configuration
**Learning:** `fetchDiaries` was dead code in `DiaryList.jsx`, but its presence caused confusion during review. Also, `useMemo` significantly optimizes derived state and calendar rendering (O(N*M) -> O(N+M)).
**Action:** Always verify if "unused" functions are truly unused before removal, but remove them to clean up the codebase. Use `useMemo` for expensive derived calculations.

## 2025-02-22 - React State Initialization
**Learning:** Initializing state from `localStorage` inside `useEffect` causes an extra re-render.
**Action:** Use lazy initialization `useState(() => localStorage.getItem(...))` to read from storage only once during the initial render.

## 2025-02-22 - Tailwind Configuration in ESM
**Learning:** Mixing `module.exports` and `export default` in `tailwind.config.js` causes lint/build errors in ESM projects.
**Action:** Ensure `tailwind.config.js` uses `export default` exclusively in Vite/ESM projects.
