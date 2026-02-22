## 2025-02-17 - Hardcoded Secrets in Settings

**Vulnerability:** Found hardcoded `SECRET_KEY`, `DEBUG=True`, and `ALLOWED_HOSTS=['*']` in `backend/config/settings.py`.
**Learning:** These settings were likely left from the initial project setup (`django-admin startproject`) or for ease of local development.
**Prevention:** Use `python-dotenv` from the start of the project. Raise `ImproperlyConfigured` if critical environment variables are missing to prevent insecure deployments.
