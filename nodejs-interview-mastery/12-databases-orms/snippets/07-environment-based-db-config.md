# Snippet: Environment-Based DB Config Selection

```js
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const configs = {
  development: { url: 'postgres://localhost:5432/app_dev', ssl: false },
  test: { url: process.env.TEST_DATABASE_URL, ssl: false },
  production: { url: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } },
};

const dbConfig = configs[env];
if (!dbConfig.url) throw new Error(`Missing database URL for environment: ${env}`);

module.exports = dbConfig;
```

**Explanation:** `dotenv` loads `.env` file contents into `process.env` for local development (production environments typically inject env vars directly via the platform, without a `.env` file). The config object is keyed by `NODE_ENV`, and the module fails loudly at startup (`throw`) if the selected environment's URL is missing, rather than letting the app boot and fail confusingly later at the first query — surfacing misconfiguration immediately is far easier to debug than a runtime connection error deep in a request handler.
