# Bolt's Journal

## 2024-05-23 - Package Lock & Lazy Loading
**Learning:** `npm install` can generate significant noise in `package-lock.json` if the npm version differs from the project's setup. This can pollute PRs.
**Action:** Always check `git status` after `npm install` and revert `package-lock.json` if the changes are just noise (e.g., `peer` dependency flags) unless intentional.

**Learning:** Memory is not always the source of truth. Memory stated images had `loading="lazy"`, but the code did not.
**Action:** Always verify "facts" in memory against the actual code.
