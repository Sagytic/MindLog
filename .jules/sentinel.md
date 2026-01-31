## 2025-02-12 - [CRITICAL] Hardcoded Secrets and Debug Mode
**Vulnerability:** The `SECRET_KEY` was hardcoded in `backend/config/settings.py` and `DEBUG` was set to `True` by default.
**Learning:** This is a common pattern in development environments but creates a critical security risk if deployed to production, exposing the application to attacks (session hijacking, RCE via pickle, etc.) and leaking sensitive information via debug tracebacks.
**Prevention:** Always use environment variables for sensitive configuration (`SECRET_KEY`, `DEBUG`, `API_KEYS`). Use `python-dotenv` to load these variables and fail securely if critical keys are missing.
