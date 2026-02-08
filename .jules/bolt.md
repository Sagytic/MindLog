## 2025-02-14 - React Calendar Tile Rendering Optimization
**Learning:** `react-calendar`'s `tileContent` function runs for every visible tile (approx 30-42 times) on every render. If this function performs an O(N) search (e.g., `array.find`), the total complexity becomes O(Tiles * N), causing significant lag with large datasets.
**Action:** Always pre-calculate a lookup Map (O(1) access) using `useMemo` before passing data to `tileContent` or similar repetitive render callbacks.
