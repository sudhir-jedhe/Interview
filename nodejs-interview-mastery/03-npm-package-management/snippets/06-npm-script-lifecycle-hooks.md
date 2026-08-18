# A Minimal npm Script with pre/post Lifecycle Hooks

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc -p .",
    "postbuild": "node scripts/copy-assets.js"
  }
}
```

`npm run build` automatically runs `prebuild`, then `build`, then `postbuild` in order. This is npm's naming-convention-based lifecycle hook system — you never invoke `prebuild`/`postbuild` directly; npm recognizes the `pre`/`post` prefix on any script name and runs them around the matching base script automatically, including for built-in commands like `npm start`/`npm test`. See `../theory/05-scripts-npx-and-install-scope.md` and `../problems/03-npm-script-pipeline.md` for a full build+test pipeline built on this mechanism.
