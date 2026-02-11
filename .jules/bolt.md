## 2024-02-11 - Calendar Rendering Bottleneck
**Learning:** The `react-calendar` `tileContent` prop is called for every day in the view (approx 35-42 times) on every render. Doing an O(N) array search inside this function creates an O(N*M) performance issue that scales poorly with dataset size.
**Action:** Always pre-compute a date-keyed Map (O(N)) using `useMemo` for O(1) lookups inside `tileContent`.
