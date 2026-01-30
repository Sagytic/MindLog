## 2024-05-23 - Search API Bottleneck
**Learning:** The search functionality in `DiaryList` fetches the entire dataset (`?all=true`) whenever a search term is present, and due to `onChange` binding, this happened on every keystroke. This combines a heavy API call with high-frequency triggering.
**Action:** Always check for debouncing on search inputs that trigger API calls, especially if the API response is large or unpaginated (like `?all=true`). Use `useDebounce` hook.
