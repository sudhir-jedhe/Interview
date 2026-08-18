# esModuleInterop enabling default-import syntax for CJS packages

```typescript
// tsconfig.json has: "esModuleInterop": true

import express from "express"; // CommonJS package, default import works cleanly

const app = express();
app.get("/", (_req, res) => res.send("ok"));
```
