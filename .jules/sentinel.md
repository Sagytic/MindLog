# Sentinel's Journal

## 2025-02-18 - Hardcoded Django Secret Key
**Vulnerability:** The Django `SECRET_KEY` was hardcoded in `settings.py` with the default insecure value ('django-insecure-...'), compromising cryptographic signing for sessions and tokens.
**Learning:** Default Django templates include an insecure key for development convenience, which often gets committed to version control if not immediately replaced.
**Prevention:** Configure `settings.py` to raise `ImproperlyConfigured` if critical environment variables like `DJANGO_SECRET_KEY` are missing, forcing developers to set them up.
