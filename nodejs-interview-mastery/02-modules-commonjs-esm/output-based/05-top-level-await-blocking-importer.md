# Top-Level Await Blocking a CJS-Style Expectation

```js
// slow.mjs
console.log('before await');
await new Promise((resolve) => setTimeout(resolve, 100));
console.log('after await');
export const ready = true;

// consumer.mjs
console.log('importing...');
import { ready } from './slow.mjs';
console.log('ready is', ready);
```

**Answer:**
```
before await
after await
importing...
ready is true
```

**Why:** Static `import` declarations are hoisted above all other code in the module and are resolved as part of building the full module graph *before* the importing module's own body evaluates — regardless of where `console.log('importing...')` appears textually. Since `slow.mjs` is a dependency of `consumer.mjs`, Node fully evaluates `slow.mjs` first, including waiting out its top-level `await`, before `consumer.mjs`'s own top-level statements run at all. This is a key practical consequence of top-level await: a slow dependency delays every module that imports it.
