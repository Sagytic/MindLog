## 2025-05-23 - Hardcoded Secrets in Django Settings
**Vulnerability:** A hardcoded `SECRET_KEY` was found in `backend/config/settings.py`. This key is used for cryptographic signing and should never be committed to source control.
**Learning:** The project was likely started with `django-admin startproject` which generates a key, and it was never moved to an environment variable.
**Prevention:** Use `python-dotenv` or similar to load `SECRET_KEY` and other sensitive configuration from environment variables. Always verify `settings.py` before committing.
