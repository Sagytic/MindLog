## 2025-05-22 - [Duplicate Configuration Overwrite]
**Vulnerability:** Duplicate `SIMPLE_JWT` configuration blocks were found in `settings.py`, with the latter overwriting the former.
**Learning:** This caused potential loss of configuration keys (like `AUTH_HEADER_TYPES`) and confusion about active settings (e.g., token lifetime).
**Prevention:** Regularly audit configuration files for duplicate keys. Use static analysis tools (linters) that flag variable redefinition. Consolidate settings into single blocks.
