## 2025-05-20 - React Calendar Performance
**Learning:** `react-calendar`'s `tileContent` is a render callback executed for every visible tile on every render. Performing O(N) operations (like `.find()`) inside this callback causes significant performance degradation (O(N * M) per render) as the dataset grows.
**Action:** Always pre-compute lookup maps (e.g. `Map<DateString, Data>`) using `useMemo` outside the render loop, so `tileContent` can perform O(1) lookups.
