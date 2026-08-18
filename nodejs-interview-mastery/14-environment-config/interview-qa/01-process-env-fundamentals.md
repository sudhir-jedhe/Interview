# Interview Q&A: `process.env` Fundamentals

**Q: What type is every value in `process.env`?**

Always a string, regardless of what the underlying value semantically represents. `process.env.PORT` is `"3000"`, not the number `3000`, and boolean-looking values like `"false"` are still just non-empty (truthy) strings that need explicit comparison (`=== 'true'`) rather than relying on JS truthiness.

**Q: What's in `process.argv`, and what do the first two entries represent?**

An array of strings representing the command used to launch the process. Index 0 is the path to the Node executable, index 1 is the path to the script being run, and actual user-supplied arguments start at index 2 — none of it is parsed into flags/values automatically, that's left to your code or a library.

**Q: What's the risk of using truthiness to check a boolean-like env var?**

Any set environment variable is a non-empty string, and non-empty strings are always truthy in JavaScript — so `if (process.env.DISABLE_FEATURE)` is true even when the value is literally `"false"`. You must compare explicitly against the expected string (`=== 'true'`) or use a config-parsing library that converts to real booleans.
