# Sentinel's Journal

## 2025-02-12 - [Hardcoded Django Secret Key]
**Vulnerability:** Found a hardcoded `SECRET_KEY` in `backend/config/settings.py`, which compromises session security and other cryptographic operations.
**Learning:** Hardcoded secrets are common in initial project setups but must be migrated to environment variables immediately. The existing setup relied on `DEBUG=True` and `ALLOWED_HOSTS=['*']`, which are also insecure defaults.
**Prevention:** Always use environment variables for sensitive configuration (`SECRET_KEY`, `DEBUG`, `DB_PASSWORD`) and enforce strict defaults in production. Used `python-dotenv` for local development convenience.
