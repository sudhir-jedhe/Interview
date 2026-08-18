## What breaks, and why, when this module is imported twice (e.g., via a hot-reload or two different bundle entry points)?

```javascript
import { atom } from 'recoil';

// Module-level atom declaration, evaluated once per module load.
export const userAtom = atom({
  key: 'userAtom', // must be globally unique across the ENTIRE app
  default: { name: '', loggedIn: false },
});
```

If a bundler or hot-module-reload setup causes this module to be evaluated twice, what does Recoil do, and what's the practical implication for local development?

**Answer:** Recoil throws a runtime error: `Duplicate atom key "userAtom". This is a FATAL ERROR in production. But it is safe to ignore this warning if it occurred because of hot module replacement.`

**Why:** Recoil requires every atom's `key` to be globally unique across the entire application, because internally it uses that string as the lookup key in its own state graph — there's no per-module or per-file scoping the way a plain JS variable would have. This is a direct consequence of the atomic model's design: atoms aren't namespaced by where they're defined, they're identified by this key alone, so two atoms (even in genuinely different files) sharing a key would be indistinguishable to Recoil's internals. In production this is a real bug to avoid (typically solved with a naming convention like prefixing keys by feature/file path, e.g., `'cart/userAtom'`); in development, it's usually just hot-reload re-evaluating a module and is safe to ignore, per Recoil's own warning text — but it's worth knowing the difference so you don't panic-debug a false alarm, and worth contrasting with Redux, where there's no equivalent global-uniqueness constraint on reducer key names beyond what `combineReducers` itself requires for its top-level slice keys.
