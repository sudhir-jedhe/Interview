# Interview Q&A: Typing Context

**Q: Why does `createContext<T | undefined>(undefined)` cause every `useContext` consumer to see `T | undefined`?**
A: Because that's genuinely the context's type — `createContext`'s type parameter is inferred from (or matches) the default value you pass, and `undefined` is a legitimate value the context can hold before any provider mounts, or if a component using it is rendered outside its intended provider tree. TypeScript can't statically prove every consumer is wrapped correctly, so it reflects that uncertainty honestly in the type.

**Q: What's the standard pattern for avoiding repeated `undefined` checks at every context consumption site?**
A: Wrap `useContext` in a custom hook (`useAuth`, `useTheme`, etc.) that checks for `undefined` once and throws a clear error if the context wasn't provided, then returns the narrowed non-nullable type. Every other component calls the custom hook instead of `useContext` directly, getting a fully-typed, non-nullable value with no repeated boilerplate.

**Q: Why not just give the context a fake default value instead of `undefined`, to avoid the null-check problem entirely?**
A: Because a fake default (e.g., a no-op `logout` function or an empty `user` object) can silently mask a real bug — a component rendered outside its provider would work "fine" with meaningless fake data instead of failing loudly with a clear error message. Throwing on `undefined` inside a guard hook surfaces the actual mistake (missing provider) immediately during development, rather than producing confusing behavior that only reveals itself later.

**Q: Is there a case where a non-`undefined` default value for context genuinely makes sense?**
A: Yes — when there's a legitimate, safe default that makes sense app-wide even without a specific provider higher up, such as a theme context defaulting to `"light"` mode, or a feature-flag context defaulting to all flags off. In those cases, `createContext<ThemeContextValue>(defaultThemeValue)` with a real default is appropriate, and no `undefined`-guarding hook is needed, since there's no invalid "unconfigured" state to detect.
