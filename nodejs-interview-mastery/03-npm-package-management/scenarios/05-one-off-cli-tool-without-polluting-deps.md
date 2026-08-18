# You Need a One-Off Code Generator CLI and Don't Want to Pollute Dependencies or Install Globally

A teammate wants to run a scaffolding tool once to generate boilerplate, but doesn't want it lingering in `package.json` or installed system-wide where it'll go stale.

**Approach:** Use `npx`, which downloads and runs the package's binary from a temporary cache without adding it to `package.json` or installing it persistently:

```bash
npx create-something-boilerplate@latest my-new-module
```

Pin the version explicitly (`@latest` or a specific version) to avoid unexpected behavior from whatever happens to be newest at execution time, and add `--yes` in scripted/CI contexts to skip the interactive "ok to install" confirmation prompt:

```bash
npx --yes some-codegen-tool generate --output ./src/generated
```

If the tool ends up being used repeatedly by the team, that's a signal to actually add it as a proper `devDependency` and invoke it via an `npm run` script instead, so everyone gets the same pinned version rather than whatever `npx` happens to fetch each time. See `../theory/05-scripts-npx-and-install-scope.md` for when `npx` is appropriate versus a proper local/global install.
