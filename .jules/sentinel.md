## 2025-02-18 - [Django Insecure Defaults]
**Vulnerability:** Hardcoded `SECRET_KEY` and `DEBUG=True` found in `settings.py`.
**Learning:** Initial project templates often contain insecure defaults that persist if not immediately moved to environment variables.
**Prevention:** Enforce `python-dotenv` and `ImproperlyConfigured` checks for `SECRET_KEY` at project inception.
