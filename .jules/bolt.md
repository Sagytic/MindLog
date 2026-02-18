# Bolt's Journal ⚡

This file tracks critical performance learnings and patterns specific to this codebase.

## 2025-05-23 - Calendar Lookup & Lazy State
**Learning:** The `Calendar` component in `DiaryList.jsx` performed an O(N) lookup for every rendered tile, leading to O(N * Days) complexity. Additionally, `App.jsx` triggered unnecessary re-renders on mount by syncing `localStorage` in `useEffect` instead of using lazy initialization.
**Action:** Always index data by date (e.g., `Map<DateString, Data>`) when rendering calendars to achieve O(1) tile rendering. Use `useState(() => value)` for expensive or synchronous initializers like `localStorage`.

## 2025-05-23 - DiaryList Pagination Pattern
**Learning:** `DiaryList.jsx` implemented pagination logic inside a `useEffect` hook listening to `inView`, which duplicated the logic in `fetchDiaries`. `fetchDiaries` was effectively dead code for infinite scroll but was mistakenly thought to be the primary fetcher.
**Action:** When refactoring pagination, verify if helper functions like `fetchData` are actually used or if logic has migrated to effects. Remove dead code to reduce confusion.
