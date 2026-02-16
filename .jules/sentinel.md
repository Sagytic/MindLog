## 2025-02-17 - Django Dotenv Path Resolution
**Vulnerability:** `load_dotenv()` without arguments searches specifically in the current working directory, which may fail depending on the execution context (e.g., `python manage.py` vs `gunicorn`).
**Learning:** Relying on CWD for environment variables in Django is fragile.
**Prevention:** Explicitly use `load_dotenv(BASE_DIR / '.env')` to ensure configuration is loaded reliably from the project root regardless of execution context.
