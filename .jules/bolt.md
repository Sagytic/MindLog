## 2025-01-28 - DiaryList Search Optimization
**Learning:** `DiaryList.jsx` was fetching ALL records (`?all=true`) on every keystroke in the search field, causing a severe performance bottleneck. The `useEffect` dependency on `searchTerm` without debouncing was the root cause.
**Action:** Implemented a `useDebounce` hook to delay the API call by 500ms. Always check `useEffect` dependencies for frequent updates (like input fields) and debounce them if they trigger expensive operations (like API calls).
