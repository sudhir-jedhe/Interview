# __dirname/__filename Equivalent in ESM Using import.meta.url

```js
// file: paths.mjs
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
```

`__dirname` and `__filename` aren't injected into ESM files the way they are into the CJS wrapper function (see `../theory/01-commonjs-require-and-wrapper.md`) — ESM instead exposes `import.meta.url`, the module's own `file://` URL. `fileURLToPath` converts that URL into a normal filesystem path string, and `dirname` from `node:path` strips the filename to get the containing directory — together reconstructing the same two values CJS gives you for free. This pattern is common enough that it's usually extracted into a small shared utility at the top of every ESM entry file that needs filesystem paths relative to itself.
