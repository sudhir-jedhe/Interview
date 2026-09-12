The ECMAScript specification divides module loading into three distinct, non-overlapping phases: **Construction (Fetching & Parsing)**, **Instantiation (Linking)**, and **Evaluation (Execution)**.

Unlike CommonJS—where resolving, linking, and running occur synchronously in a single step during `require()`—ESM separates these phases to allow asynchronous loading over networks and to build a static dependency graph before executing any JavaScript.

```
       Phase 1: Construction          Phase 2: Instantiation           Phase 3: Evaluation
    ┌──────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
    │  Fetch file from disk/   │    │  Allocate memory boxes  │    │  Run top-level JS code  │
    │  network -> Parse into   │ ─► │  for all exports and    │ ─► │  Fill memory boxes with │
    │  Module Record (AST)     │    │  wire import/export     │    │  actual computed values │
    │                          │    │  live bindings          │    │                         │
    └──────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘

```

---

### Phase 1: Construction (Fetching & Parsing)

The goal of this phase is to turn raw file paths/URLs into an interconnected graph of **Module Records**. A Module Record is the engine's internal data structure representing the module's Abstract Syntax Tree (AST), listing its imports, exports, and child dependencies.

1. **Module Resolution:** The engine takes a specifier (e.g., `'./utils.js'`) and resolves it into a canonical URL or absolute file path.
2. **Fetching:** The engine retrieves the file text from the network, local disk, or cache. In browsers, this step happens asynchronously (which is why ESM does not block the main thread like synchronous CommonJS would).
3. **Parsing:** The engine parses the raw source code into a Module Record.

* Syntax is validated under strict mode by default.
* The parser scans top-level `import` and `export` statements.
* If an import statement has child dependencies, the engine recurses: resolving, fetching, and parsing each child.

1. **Module Map Caching:** Every fetched module is cached by its canonical URL in the browser/engine's internal **Module Map**. If multiple files import `'./logger.js'`, it is fetched and parsed **only once**.

> **Outcome:** An in-memory tree of Module Records describing how all modules depend on one another. **No user JavaScript has executed yet.**

---

### Phase 2: Instantiation (Linking & Wiring Live Bindings)

Once the entire graph of Module Records is built, the engine connects the pieces together.

1. **Memory Allocation:** The engine scans all exports across the entire graph and allocates empty slots (memory locations) for each exported variable.
2. **Wiring Pointers (Live Bindings):**

* When Module A exports `count` and Module B imports `count`, the engine links the identifier in Module B directly to the exact memory address in Module A.
* No values are assigned yet—the memory boxes simply exist.

1. **Graph Traversal (Depth-First Post-Order):** The engine links leaves first, wiring parent and child modules together.

#### Why Instantiation is Separated from Evaluation

Because memory pointers are wired *before* any code runs, ESM handles **circular dependencies** without the broken intermediate states common in CommonJS:

```javascript
// a.js
import { bVal } from './b.js';
export const aVal = 'A';

// b.js
import { aVal } from './a.js';
export const bVal = 'B';

```

During Instantiation, both `aVal` and `bVal` get memory slots allocated and wired. By the time evaluation starts, both modules know exactly where to find the other's bindings.

> **Outcome:** All import/export bindings point to corresponding memory locations. **Variables still contain no values (uninitialized).**

---

### Phase 3: Evaluation (Execution)

In the final phase, the engine finally runs the top-level executable JavaScript code to fill those allocated memory slots with actual values.

1. **Execution Order (Depth-First Post-Order):**

* The engine traverses to the deepest leaf modules first.
* Dependencies execute *before* the modules that consume them.

1. **Populating Bindings:** As the code executes line-by-line, assignments populate the memory boxes wired during Phase 2.
2. **Run-Once Guarantee:** Even if imported across dozens of files, a module’s top-level code runs **exactly once**. Subsequent imports simply read the already-populated live bindings.
3. **Top-Level Await (TLA):**

* If a module contains `await` at the top level, execution pauses for that module and its dependents, returning a Promise to the module loader.
* Sibling branches in the dependency graph that do not depend on the awaiting module continue evaluating concurrently.

---

### Summary Comparison of the Three Phases

| Phase                | What Happens                                                                                                 | Are Values Defined?                           | Can Code Run?                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ------------------------------------ |
| **1. Construction**  | Fetches files from disk/network, parses text into ASTs and Module Records, builds dependency graph.          | No                                            | No                                   |
| **2. Instantiation** | Allocates memory addresses for all exports; wires import identifiers to export pointers (**Live Bindings**). | No (Memory boxes allocated but uninitialized) | No                                   |
| **3. Evaluation**    | Executes top-level JS code in post-order depth-first traversal; fills memory boxes with values.              | Yes (Assigned as lines evaluate)              | **Yes** (Only phase where code runs) |
