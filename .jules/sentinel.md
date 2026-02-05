## 2025-02-23 - Hardcoded Django SECRET_KEY
**Vulnerability:** A hardcoded Django `SECRET_KEY` was found in `backend/config/settings.py` along with `DEBUG=True` and `ALLOWED_HOSTS=['*']`.
**Learning:** Default Django templates often encourage hardcoding for quick start, but this persists into production if not refactored. The absence of strict environment variable enforcement allowed this.
**Prevention:** Use `python-dotenv` and `os.getenv` to load sensitive configuration. Enforce `ImproperlyConfigured` exceptions when critical keys are missing.
