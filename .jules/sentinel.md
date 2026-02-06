## 2025-02-18 - Hardcoded Secret Key in Production Settings

**Vulnerability:** The Django `SECRET_KEY` was hardcoded in `backend/config/settings.py`.
**Learning:** This is a default behavior of `django-admin startproject`, but it is critical to move this to an environment variable before any deployment or public exposure.
**Prevention:** Use `python-dotenv` and enforce `os.environ.get('DJANGO_SECRET_KEY')` in `settings.py`. Fail if missing in production.
