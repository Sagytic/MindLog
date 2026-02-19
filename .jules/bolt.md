## 2025-02-19 - React Calendar Performance
**Learning:** Naive `find()` inside `tileContent` (React-Calendar) causes O(N*M) rendering complexity, which freezes the UI on month switch when diary entries are numerous.
**Action:** Always pre-compute a `Map` (Date -> Data) using `useMemo` for O(1) lookups in tile renderers.
