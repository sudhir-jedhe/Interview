# Output-Based: unguarded lookup with unset `NODE_ENV`

```js
const environments = { production: 'PROD', staging: 'STAGE' };
console.log(environments[process.env.NODE_ENV]);
```

**Answer:** `undefined`

**Why:** `NODE_ENV` was never set in this snippet (no prior assignment), so `process.env.NODE_ENV` is `undefined`, and `environments[undefined]` isn't a key in the object — it evaluates to `undefined` rather than throwing. This is why unguarded environment-keyed lookups need a fallback (`|| 'development'`) to avoid silently falling through to `undefined` config in production if the deploy pipeline forgets to set the variable.
