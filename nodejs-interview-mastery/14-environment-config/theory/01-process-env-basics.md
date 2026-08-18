# Environment & Configuration — `process.env` Basics

## `process.env`

`process.env` is a plain object Node populates at startup from the OS environment the process was launched in. Every value is always a **string** — there's no automatic type coercion, so `process.env.PORT` is `"3000"`, not `3000`, and `process.env.DEBUG` is `"false"` (a truthy string!) rather than boolean `false`.

```js
console.log(process.env.PATH);      // whatever the shell's PATH is
console.log(typeof process.env.PORT); // 'string', even if it looks numeric

const port = Number(process.env.PORT) || 3000;
const isDebug = process.env.DEBUG === 'true'; // explicit string comparison, not truthiness
```

**Gotcha:** `if (process.env.FEATURE_FLAG)` is true for the string `"false"`. Always compare explicitly (`=== 'true'`) or use a validation library that parses booleans for you.

## `process.env` is mutable at runtime

`process.env` is an ordinary mutable object — assigning to it (`process.env.FOO = 'bar'`) updates it for the rest of the process, and later reads in your own code see the new value. What it does *not* do is retroactively change decisions other code already made based on an earlier value — if a module read `NODE_ENV` and cached some behavior during its own initialization, changing `process.env.NODE_ENV` afterward won't undo that. Order of initialization matters.

## `process.argv`

`process.argv` is an array of the command-line arguments used to launch the process. The first two entries are always the Node executable path and the script path — real arguments start at index 2.

```js
// node script.js --name Alice --verbose
console.log(process.argv);
// ['/usr/bin/node', '/path/to/script.js', '--name', 'Alice', '--verbose']

const args = process.argv.slice(2);
```

For anything beyond trivial parsing, reach for a library (`yargs`, `commander`) rather than hand-rolling flag parsing — you'll want `--flag=value` support, short aliases, and help text eventually anyway.

### Manual parsing vs a CLI library (`commander`/`yargs`)

| Aspect | Manual `process.argv` parsing | commander / yargs |
|---|---|---|
| Setup | Zero dependencies | One extra dependency |
| Flag syntax support | You implement `--flag=val` vs `--flag val` vs `-f` yourself | Built-in, consistent |
| Help text / usage | Manual | Auto-generated |
| Validation, defaults, types | Manual | Declarative |

Manual parsing is fine for a one-off script with one or two flags; for any real CLI tool, a library saves you from re-implementing edge cases (quoted values, combined short flags, `--help`) that are easy to get subtly wrong. The common mistake is under-engineering a "quick script" that grows more flags over time until the hand-rolled parser becomes an unmaintainable pile of `if` statements.
