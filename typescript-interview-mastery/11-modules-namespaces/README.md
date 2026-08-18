# 11 — Modules and Namespaces

This topic covers how TypeScript code is organized across files: ES module `import`/`export` syntax (including `import type` for type-only imports), the `export default` vs. named-export trade-off, ambient declarations for typing untyped JavaScript libraries, the legacy `namespace` construct and why ES modules replaced it, module augmentation for extending third-party library types (most commonly Express's `Request`), and triple-slash directives. Modules are foundational — nearly every real TypeScript codebase leans on `import type`, default-vs-named conventions, and at least occasional ambient declarations or augmentation, making this one of the most practically-tested topics in a senior interview, especially for backend/Node roles where the Express `Request` augmentation pattern comes up constantly.

## What's covered

- ES module import/export syntax and why `import type` matters for build tooling and tree-shaking
- `export default` vs. named exports: refactor safety, tree-shaking, and interop trade-offs
- Ambient declarations (`declare module`, `.d.ts` files) for typing untyped JS libraries and global values
- Namespaces: what they are, why they predate ES modules, and the narrow cases where they're still seen today
- Module augmentation for extending third-party library types, and the declaration-merging mechanism behind it
- Triple-slash directives and when they're still relevant
- Failure modes: circular imports, augmentation that silently fails to merge, global-script vs. module scope confusion

## Index

### theory/
- [01-es-module-syntax.md](theory/01-es-module-syntax.md)
- [02-export-default-vs-named.md](theory/02-export-default-vs-named.md)
- [03-ambient-declarations-and-d-ts.md](theory/03-ambient-declarations-and-d-ts.md)
- [04-namespaces.md](theory/04-namespaces.md)
- [05-module-augmentation.md](theory/05-module-augmentation.md)
- [06-triple-slash-directives.md](theory/06-triple-slash-directives.md)

### snippets/
- [01-named-exports.md](snippets/01-named-exports.md)
- [02-default-export.md](snippets/02-default-export.md)
- [03-import-type.md](snippets/03-import-type.md)
- [04-ambient-module-declaration.md](snippets/04-ambient-module-declaration.md)
- [05-namespace-basic.md](snippets/05-namespace-basic.md)
- [06-module-augmentation-basic.md](snippets/06-module-augmentation-basic.md)
- [07-triple-slash-directive.md](snippets/07-triple-slash-directive.md)

### output-based/
- [01-import-type-erasure.md](output-based/01-import-type-erasure.md)
- [02-mixing-default-and-named.md](output-based/02-mixing-default-and-named.md)
- [03-namespace-merging.md](output-based/03-namespace-merging.md)
- [04-declaration-merging-interface-namespace.md](output-based/04-declaration-merging-interface-namespace.md)
- [05-ambient-module-wildcard.md](output-based/05-ambient-module-wildcard.md)
- [06-module-augmentation-missing-export.md](output-based/06-module-augmentation-missing-export.md)
- [07-circular-imports.md](output-based/07-circular-imports.md)
- [08-triple-slash-vs-import.md](output-based/08-triple-slash-vs-import.md)

### scenarios/
- [01-typing-untyped-npm-library.md](scenarios/01-typing-untyped-npm-library.md)
- [02-augmenting-express-request.md](scenarios/02-augmenting-express-request.md)
- [03-organizing-global-types-with-namespace.md](scenarios/03-organizing-global-types-with-namespace.md)

### interview-qa/
- [01-modules-vs-namespaces-qa.md](interview-qa/01-modules-vs-namespaces-qa.md)
- [02-import-export-qa.md](interview-qa/02-import-export-qa.md)
- [03-declaration-files-augmentation-qa.md](interview-qa/03-declaration-files-augmentation-qa.md)

### problems/
- [01-write-d-ts-for-untyped-library.md](problems/01-write-d-ts-for-untyped-library.md) — write an ambient `.d.ts` for an untyped library
- [02-augment-express-request.md](problems/02-augment-express-request.md) — augment Express's `Request` type
- [03-import-type-vs-import-demo.md](problems/03-import-type-vs-import-demo.md) — demonstrate the practical difference `import type` makes

### assets/
- [README.md](assets/README.md) — placeholder for original notes
