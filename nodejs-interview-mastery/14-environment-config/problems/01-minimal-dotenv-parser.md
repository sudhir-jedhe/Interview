# Problem: Implement a Minimal `dotenv` Parser From Scratch

## Problem statement

Implement a `loadEnv(filePath)` function that mimics the core behavior of the `dotenv` package: read a `.env`-style file, parse `KEY=VALUE` lines, and merge the results into `process.env` — without using the `dotenv` package itself.

## Requirements

- Parse `KEY=VALUE` lines, one per line.
- Skip blank lines and comment lines (lines starting with `#`, ignoring leading whitespace).
- Support both single- and double-quoted values (`KEY="value with spaces"`, `KEY='value'`), stripping the surrounding quotes.
- Support unquoted values, stopping at end of line (trailing inline comments after unquoted values are out of scope — keep this simple, matching real `dotenv`'s base behavior).
- Support values containing `=` (e.g. `DATABASE_URL=postgres://user:pass@host/db?ssl=true`) — only the *first* `=` on a line should be treated as the key/value separator.
- Never overwrite a variable that's already set in `process.env` (so real environment variables — e.g. injected by the OS/platform — always win over `.env` file values, matching `dotenv`'s default behavior).
- Return the parsed key/value object as well as merging into `process.env`, so callers can inspect what was loaded.

## Solution

```js
// load-env.js
const fs = require('fs');

function parseLine(line) {
  const trimmed = line.trim();
  if (trimmed === '' || trimmed.startsWith('#')) return null; // blank or comment

  const separatorIndex = trimmed.indexOf('=');
  if (separatorIndex === -1) return null; // malformed line, no '=' — skip it

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (!key) return null;

  // Strip matching surrounding quotes (single or double)
  const isDoubleQuoted = value.startsWith('"') && value.endsWith('"') && value.length >= 2;
  const isSingleQuoted = value.startsWith("'") && value.endsWith("'") && value.length >= 2;
  if (isDoubleQuoted || isSingleQuoted) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function parseEnvFile(contents) {
  const result = {};
  const lines = contents.split(/\r?\n/);
  for (const line of lines) {
    const parsed = parseLine(line);
    if (parsed) result[parsed.key] = parsed.value;
  }
  return result;
}

function loadEnv(filePath = '.env') {
  let contents;
  try {
    contents = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return {}; // missing .env file is not fatal
    throw err;
  }

  const parsed = parseEnvFile(contents);

  for (const [key, value] of Object.entries(parsed)) {
    if (!(key in process.env)) {
      process.env[key] = value; // real env vars always win over the file
    }
  }

  return parsed;
}

module.exports = { loadEnv, parseEnvFile };
```

```js
// usage
const { loadEnv } = require('./load-env');

// .env file:
// # database config
// DATABASE_URL=postgres://user:pass@host/db?ssl=true
// API_KEY="sk_test_abc123"
// NAME='Ada Lovelace'

const parsed = loadEnv('.env');
console.log(parsed.DATABASE_URL); // postgres://user:pass@host/db?ssl=true
console.log(process.env.API_KEY); // sk_test_abc123
```

**How it works:** `parseLine` skips blank/comment lines, splits on the *first* `=` only (so values containing `=`, like connection strings, survive intact), trims whitespace, and strips a matching pair of surrounding quotes if present. `loadEnv` reads the file (treating a missing file as a no-op, matching real `dotenv`'s forgiving default), parses every line, and only assigns into `process.env` for keys that aren't already set — preserving the real convention that actual OS/platform environment variables take precedence over `.env` file values.
