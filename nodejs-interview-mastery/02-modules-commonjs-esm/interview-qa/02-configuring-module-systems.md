# Interview Q&A: Enabling & Configuring Module Systems

**Q: How do you enable ES Modules in a Node.js project?**
Either set `"type": "module"` in the nearest `package.json`, which makes all `.js` files in that package ESM by default, or name individual files with a `.mjs` extension, which is always treated as ESM regardless of the `"type"` field. The inverse escape hatch, `.cjs`, always forces CommonJS even inside an ESM package.

**Q: If a package.json has no "type" field at all, how are .js files interpreted?**
As CommonJS — the absence of a `"type"` field defaults to `"commonjs"`. This is purely a backward-compatibility default; explicitly setting `"type": "commonjs"` has the same effect as omitting it, but omitting it is more common in existing/legacy projects.

**Q: Why is ESM strict mode by default, but CommonJS isn't?**
ESM was designed after `"use strict"` was already established as best practice, so the spec simply mandates strict mode for all ES modules — no opt-in needed. CommonJS predates widespread strict-mode adoption and needed to preserve backward compatibility with existing non-strict scripts, so it defaults to sloppy mode unless a file explicitly opts in with `"use strict"` at the top.
