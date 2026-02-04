## 2025-02-04 - Hardcoded Secret Key in Settings
**Vulnerability:** The Django `SECRET_KEY` was hardcoded in `settings.py`, and `DEBUG` was enabled by default.
**Learning:** Default Django project templates often include insecure defaults for development convenience, which can be mistakenly deployed to production.
**Prevention:** Always use environment variables for sensitive configuration (`SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`) from the start of the project. Enforce this via `ImproperlyConfigured` exceptions if keys are missing.
