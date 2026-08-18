# Interview Q&A: Modules

**Q: What's the difference between a named export and a default export?**
A module can have any number of named exports but only one default export. Named exports must be imported using the exact same name (or explicitly aliased with `as`), which helps tooling auto-import and refactor reliably; a default export can be imported under any name the importer chooses, which is more flexible but harder to trace across a large codebase.

**Q: Are ES module imports copies of the exported values, or live references?**
Live, read-only bindings. If the exporting module later reassigns an exported `let`/`var` variable, every module that imported it sees the updated value automatically — the importer cannot reassign the binding itself, only read it. This differs from CommonJS's `module.exports`, which copies primitive values at require-time.

**Q: Can you use top-level `await` in any JavaScript file?**
No — only inside an ES module (a file loaded with `type="module"` in the browser, or a `.mjs` file / a `.js` file in a package with `"type": "module"` in Node). Regular scripts and CommonJS modules cannot use `await` outside an `async function`.
