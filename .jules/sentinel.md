## 2025-02-17 - Hardcoded Django Secrets
**Vulnerability:** `SECRET_KEY` and other sensitive configurations were hardcoded in `backend/config/settings.py`.
**Learning:** The project was likely started with `django-admin startproject` and the generated insecure settings were never replaced with environment variable lookups.
**Prevention:** Always use `python-dotenv` and `os.environ.get()` for sensitive variables immediately after project initialization. Enforce `ImproperlyConfigured` exceptions for missing critical secrets.
