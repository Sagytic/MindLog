## 2025-10-27 - Calendar Rendering Optimization
**Learning:** React Calendar's `tileContent` and `onClickDay` props are called frequently (for every tile, often on re-renders). Doing O(N) searches inside these props causes O(N*M) complexity (N=diaries, M=tiles), which scales poorly.
**Action:** Use `useMemo` to pre-calculate a lookup Map (date string -> diary) to reduce lookup complexity to O(1), making the total render complexity O(N + M). This pattern should be applied whenever rendering lists where individual items need to query a larger dataset.
