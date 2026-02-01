## 2023-10-27 - [Memoization of Heavy List Calculations]
**Learning:** `DiaryList` component was calculating chart data on every render, even when the chart tab wasn't visible. This caused unnecessary CPU usage during list interactions (typing in search, hovering).
**Action:** When implementing `useMemo` for derived data in lists, verify that expensive calculations (like chart aggregation) are strictly necessary or memoized to avoid blocking the main thread during simple interactions.
