## 2024-05-22 - Hardcoded Secrets in Configuration
**Vulnerability:** Hardcoded `SECRET_KEY` and `DEBUG=True` found in `backend/config/settings.py`.
**Learning:** Developers often commit generated settings files without extracting sensitive values to environment variables, exposing the application to session hijacking and information leakage.
**Prevention:** Always use environment variables for secrets and environment-specific configurations. Use `python-dotenv` to load these variables in development.
