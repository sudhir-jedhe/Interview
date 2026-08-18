# Two Teams Depend on Incompatible Major Versions of the Same Internal Utility Package in One Monorepo

Team A's service needs `@company/http-client@^3.0.0`; Team B's service in the same monorepo still depends on `@company/http-client@^1.0.0` and hasn't migrated yet.

**Approach:** This is exactly what nested `node_modules` resolution is designed to handle — as long as each service has its own `package.json` declaring its own required range, npm (or a workspace-aware tool) will install both versions, nesting the non-hoistable one inside the dependent package's own `node_modules` rather than forcing a single shared version at the root:

```
/monorepo/node_modules/@company/http-client@3.0.0       (hoisted, most common version)
/monorepo/packages/team-b-service/node_modules/@company/http-client@1.0.0  (nested override)
```

No code changes needed for this to work correctly — Node's require/import resolution walks up from each file's own directory, so Team B's code naturally finds its nested v1 copy before reaching the hoisted v3. Track the migration explicitly (e.g., a tracked ticket) so the older version doesn't linger indefinitely, since duplicate versions increase install size and can cause subtle bugs if singleton state (like a shared cache) was expected across the codebase. See `../theory/04-node-modules-resolution.md` for the full resolution algorithm this relies on.
