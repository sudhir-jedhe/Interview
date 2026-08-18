# Output-Based: `dotenv.config()` call order matters

```js
require('dotenv').config();
console.log('API_KEY:', process.env.API_KEY);
// .env file in the same directory contains: API_KEY=abc123
// but dotenv.config() is called AFTER this next line in the real file:
console.log('Before config:', process.env.API_KEY);
```

**Answer:** As literally written, `API_KEY: abc123` prints (since `.config()` runs first here), but the comment describing a version where the log came *before* `.config()` would print `Before config: undefined`.

**Why:** `dotenv.config()` synchronously reads and parses the `.env` file, merging values into `process.env` at the moment it's called — not at module load time implicitly. Any code that reads `process.env` before `require('dotenv').config()` executes sees `undefined` for values that only exist in `.env`. Call order matters, which is why `dotenv.config()` should be one of the very first lines executed (often via `-r dotenv/config` at the process level).
