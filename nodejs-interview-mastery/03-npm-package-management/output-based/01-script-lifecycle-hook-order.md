# npm Script Lifecycle Hook Order

```json
{
  "scripts": {
    "prestart": "node -e \"console.log('prestart')\"",
    "start": "node -e \"console.log('start')\"",
    "poststart": "node -e \"console.log('poststart')\""
  }
}
```

Running `npm start`, what prints, and in what order?

**Answer:** `prestart`, `start`, `poststart`

**Why:** npm automatically runs `pre<script>` before and `post<script>` after any script invoked via `npm run <name>` (and the built-in aliases like `start`, `test`, `install`), without needing to reference them explicitly. This is npm's lifecycle hook convention based purely on naming.
