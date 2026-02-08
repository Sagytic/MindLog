## 2025-02-17 - Hardcoded Secrets in Settings
**Vulnerability:** A hardcoded `SECRET_KEY`, `DEBUG=True`, and `ALLOWED_HOSTS=['*']` were present in `backend/config/settings.py`.
**Learning:** These settings are default in Django's `startproject` template and can be easily overlooked if not immediately externalized.
**Prevention:** Use `python-dotenv` immediately after project creation and enforce `ImproperlyConfigured` for missing security-critical variables.
