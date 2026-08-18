# Snippet: Loading a `.env` file with `dotenv`

```js
require('dotenv').config();
console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL ?? '(not set)');
```

**Explanation:** `dotenv.config()` synchronously reads a `.env` file from the current working directory and merges its key/value pairs into `process.env`. It must run before any code that depends on those values reads `process.env` — calling it as the very first line of your entry point (or via `-r dotenv/config`) avoids ordering bugs.
