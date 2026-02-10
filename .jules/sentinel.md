## 2025-02-18 - [Inconsistent Configuration Management]
**Vulnerability:** Hardcoded `SECRET_KEY`, `DEBUG=True`, and `ALLOWED_HOSTS=['*']` were found in `backend/config/settings.py` despite `python-dotenv` being installed and used in `backend/diaries/ai_utils.py`.
**Learning:** The project had partial environment variable adoption, leading to critical security misconfigurations in the core settings while other parts were secure.
**Prevention:** Centralize environment variable loading in `settings.py` and enforce critical variables (like `SECRET_KEY`) with `ImproperlyConfigured` to prevent startup with insecure defaults.
