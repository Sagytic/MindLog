## 2025-02-28 - [Optimized Calendar Data Load]
**Learning:** The calendar view was fetching `all=true` (full dataset), leading to massive payloads as diary count grows. `ModelViewSet` can dynamically switch serializers based on query params (`mode=calendar`) to return only necessary fields (`id`, `date`, `emotion`).
**Action:** When designing "summary" or "calendar" views, always use a dedicated lightweight serializer and fetch full details only on interaction (lazy loading).
