# Scenario: Migrating a Legacy Codebase to Strict Mode

Your team inherited a 3-year-old TypeScript codebase built with `strict: false`. Enabling `strict: true` outright produces over 1,200 errors, mostly `strictNullChecks` violations, and the team can't stop feature work for the weeks it would take to fix them all at once.

**Approach:**

Enable `strict: true` but immediately disable the specific sub-flags causing the bulk of the noise, then re-enable them one at a time as the codebase is cleaned up:

```jsonc
// tsconfig.json — step 1: lock in the flags that already pass
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": false,       // disable for now — 900 of the 1200 errors
    "strictPropertyInitialization": false // another 200 errors, mostly DI-style classes
  }
}
```

This immediately gets you `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `noImplicitThis`, `alwaysStrict`, and `useUnknownInCatchVariables` for free — those together were only responsible for ~100 of the 1200 errors and are usually mechanical, low-risk fixes (add a parameter type, narrow a `catch` variable).

Next, tackle `strictNullChecks` incrementally using TypeScript's per-file suppression rather than a config flag, so new code is protected immediately while legacy code is fixed gradually:

```typescript
// @ts-strict-ignore or a per-file // @ts-nocheck are too blunt; instead:
// enable strictNullChecks globally and use targeted // @ts-expect-error
// comments only where a real fix is deferred, with a tracked ticket reference.
```

In practice, the most maintainable path is:
1. Turn `strictNullChecks` on globally.
2. Run the compiler, capture the full list of newly-failing files.
3. Add those specific files to a temporary `exclude` list or a secondary `tsconfig.legacy.json` with `strictNullChecks: false` that only covers the not-yet-migrated files, while the main `tsconfig.json` (used by the IDE and for all *new* files) has it fully on.
4. Track the legacy exclude list as a burndown metric — every sprint, migrate a few files off it and delete their entry.

This guarantees zero regressions in new code (which is where bugs are cheapest to prevent) while giving the team a visible, shrinking backlog for the legacy portion, instead of an all-or-nothing 1,200-error wall that blocks all other work. `strictPropertyInitialization` is typically safe to re-enable next, since class-shaped bugs it catches (uninitialized fields) tend to be fewer and more mechanical to fix than sprinkled null-check violations across business logic.

The lesson for interviews: strict mode adoption is a *migration strategy* question as much as a "what does the flag do" question — the practical skill is triaging which sub-flag delivers the most safety per unit of migration effort, and rolling it out without freezing the codebase.
