## 2025-01-28 - Client-Side Search Bottleneck
**Learning:** The application fetches ALL records ('?all=true') to implement search, performing filtering entirely on the client side. This causes massive network payloads and main thread blocking as the dataset grows.
**Action:** Future optimizations should implement server-side search using Django filters (e.g., 'django-filter' or 'SearchFilter') to return only relevant results and reduce payload size.
