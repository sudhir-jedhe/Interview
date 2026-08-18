```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "module": "ESNext"
  }
}
```
```typescript
import { z } from "zod"; // a package whose package.json only defines "exports", no "main"
```

Under `moduleResolution: "node"`, does TypeScript reliably resolve this import? What's the fix?

**Answer:** Not reliably — many modern packages that expose only a `package.json` `"exports"` map (no legacy `"main"`/`"module"` fields) will fail to resolve under `"node"` resolution, producing `Cannot find module 'zod' or its corresponding type declarations`, even though the package is correctly installed and works fine at runtime through a bundler. The fix is `"moduleResolution": "bundler"` (for projects using Webpack/Vite/esbuild) or `"nodenext"` (for projects running compiled output directly under modern Node).

**Why:** `"node"` (also called `"node10"`) resolution predates the `package.json` `"exports"` field, which is now the standard way packages declare their public entry points and conditional exports (ESM vs CJS, types vs runtime). `"bundler"` and `"nodenext"` resolution both understand `"exports"` maps and pick the correct target path per import condition; `"node"` resolution simply doesn't look at `"exports"` at all and falls back to legacy heuristics (`"main"`, `index.js`), which many modern packages no longer provide. This is a case where the type-checking failure is a pure tooling-configuration problem, not a real bug in the code — but it blocks compilation exactly the same as a genuine type error would.
