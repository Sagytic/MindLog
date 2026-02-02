## 2026-02-02 - Hardcoded Secrets in Django Settings
**Vulnerability:** Hardcoded `SECRET_KEY` and `DEBUG=True` in `backend/config/settings.py`.
**Learning:** Default Django project templates often include insecure defaults that must be changed before deployment. Hardcoding secrets exposes the application to session hijacking and other attacks.
**Prevention:** Use `python-dotenv` or similar libraries to load sensitive configuration from environment variables. Always validate that critical secrets are present at startup.
