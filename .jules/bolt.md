## 2025-02-18 - [Unnecessary Stats Calculation in List View]
**Learning:** `DiaryList` component computes chart statistics for the "Stats" tab on *every* render, even when the user is on the "Home" tab or typing in the search bar. This is wasteful as it iterates over the entire `diaries` array.
**Action:** Always check for expensive derived state that runs unconditionally in the render body. Use `useMemo` to skip calculations when dependencies (like `diaries` data) haven't changed.
