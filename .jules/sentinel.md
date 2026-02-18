## 2025-02-19 - Inconsistent Environment Variable Loading
**Vulnerability:** Hardcoded secrets in `settings.py` while `ai_utils.py` used `python-dotenv` locally.
**Learning:** This fragmentation led to `SECRET_KEY` being exposed while API keys were protected, creating a false sense of security.
**Prevention:** Centralize `load_dotenv()` in `settings.py` (or `manage.py`/`wsgi.py`) to ensure all components share the same secure configuration source.
