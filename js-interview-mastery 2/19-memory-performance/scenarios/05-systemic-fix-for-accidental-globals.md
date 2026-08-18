# Scenario: Thousands of accidental globals in a large legacy codebase

**Your app accidentally creates thousands of accidental global variables across a large, older non-strict-mode codebase (missing `let`/`const` in many places), and it's causing subtle bugs and bloated global scope. How do you find and fix these systematically, without rewriting the whole codebase at once?**

**Approach:**
Rather than manually hunting through thousands of lines, add `"use strict"` incrementally (per-file or per-module) so the engine itself throws a `ReferenceError` on any undeclared assignment, immediately surfacing every offending line during testing/CI rather than requiring manual code review. Pair this with a linter rule (e.g., ESLint's `no-undef` / `no-implicit-globals`) so new violations are caught before merge, and migrate files to ES modules over time (which are strict by default and give real file-scoped privacy instead of relying on discipline alone).

```js
"use strict";
// Any line like `total = 0;` (missing declaration) now throws immediately in
// testing/dev instead of silently leaking a `total` property onto `window`,
// surfacing the bug location precisely instead of requiring a memory audit.
```
