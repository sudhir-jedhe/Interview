# Interview Q&A: Module Resolution

**Q: How does Node resolve a require('some-module') call to an actual file on disk?**
Starting from the requiring file's own directory, Node looks for a `node_modules/some-module` directory, and if not found, walks up to the parent directory and repeats, continuing all the way to the filesystem root. The first match wins. This is why a single root-level `node_modules` typically satisfies requires from any file nested anywhere in the project, and why a package can have a private, version-conflicting copy of a dependency nested inside its own `node_modules` that takes precedence for its own code.

**Q: What happens if two different packages in your dependency tree require incompatible versions of the same sub-dependency?**
npm's installer hoists the most broadly compatible version to the top-level `node_modules` where possible, but nests a separate, private copy inside the `node_modules` of whichever package(s) need an incompatible version — this is transparent to your code because Node's resolution algorithm always finds the nearest matching `node_modules` directory by walking up from the requiring file, so each package naturally gets the version it declared.

**Q: How would you find out which package in your dependency tree is pulling in a specific transitive dependency?**
Use `npm ls <package-name>` (or `npm explain <package-name>`), which prints the dependency chain(s) responsible for including that package, showing exactly which direct dependency required it and at what version — useful for tracking down why an unexpected or vulnerable version of something ended up installed.
