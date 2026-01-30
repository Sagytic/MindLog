## 2026-01-30 - Hardcoded Secret Key in Django Settings
**Vulnerability:** The Django `SECRET_KEY` was hardcoded in `backend/config/settings.py`, exposing the cryptographic signature key.
**Learning:** Initial project setup often prioritizes convenience over security, leaving secrets exposed in source control.
**Prevention:** Use `python-dotenv` and `os.environ` to load `SECRET_KEY` and `DEBUG` settings. Ensure strict failures (e.g., `ImproperlyConfigured`) if secrets are missing in production.
