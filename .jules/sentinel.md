## 2026-02-24 - Hardcoded Secrets in Settings
**Vulnerability:** Found hardcoded `SECRET_KEY`, `DEBUG=True`, and `ALLOWED_HOSTS=['*']` in `backend/config/settings.py`.
**Learning:** Hardcoded secrets in version control expose the application to compromise (session hijacking, etc.). `DEBUG=True` in production leaks stack traces and environment info.
**Prevention:** Use `python-dotenv` to load sensitive configuration from environment variables.
