## 2024-05-23 - Hardcoded Secrets in Django Settings
**Vulnerability:** The `SECRET_KEY` and `DEBUG=True` settings were hardcoded in `backend/config/settings.py`, exposing the application to session hijacking and information leakage.
**Learning:** Default Django project templates often include insecure settings for development convenience, which developers sometimes forget to externalize before deployment.
**Prevention:** Use environment variables for all sensitive configuration from the start. Tools like `python-dotenv` can manage these variables in development, while CI/CD pipelines inject them in production. Always validate critical settings (like `SECRET_KEY`) at startup to prevent insecure execution.
