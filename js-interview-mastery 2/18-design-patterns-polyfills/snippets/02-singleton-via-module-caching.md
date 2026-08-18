# Snippet: Singleton via module-level caching (the natural JS way)

```js
// config.js (conceptually) -- ES modules are cached, so every import gets the same object
const config = { apiUrl: "https://api.example.com" };
export default config;
// Every file that does `import config from './config.js'` shares this exact same object reference.
```
