# Scope & Hoisting

Scope determines where a variable is visible, and hoisting determines when it becomes usable — the two together explain some of the most commonly-tested JS gotchas, from `var`'s function-scoping quirks to the classic `for (var i...) setTimeout` bug. This topic covers how `var`, `let`, and `const` differ in scoping and re-declaration rules, how the engine "hoists" declarations before execution, and why `let`/`const` are hoisted into a Temporal Dead Zone rather than initialized like `var`. Interviewers use this area to see whether you understand JS execution in two phases (compile-then-execute) rather than treating code as running top-to-bottom in one pass. Getting this solid also makes closures (the next topic) far easier to reason about, since closures are built directly on top of scope chains.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`from-your-notes/`** — your original flat notes on scope and `var`/`let`/`const`, kept as-is.
- **`theory/`** — concept-by-concept notes: scope types (global/function/block), `var`/`let`/`const` declaration rules, hoisting mechanics & the TDZ, function declaration vs expression hoisting, lexical scoping & the scope chain, and the classic `var` loop bug.
- **`snippets/`** — 7 focused, runnable code examples, one per file.
- **`output-based/`** — 8 "predict the output" questions covering hoisting order, TDZ errors, and loop-closure gotchas, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (a `var` → `let` refactor breaking tests, dynamically registered handlers, hoisting discrepancies between declaration forms, cross-script global collisions), each with a worked approach.
- **`interview-qa/`** — 12 Q&A pairs grouped into 3 themed files: hoisting/TDZ, scope types/declaration rules, and the loop bug/IIFEs.
- **`problems/`** — 3 hands-on coding challenges: a TDZ demonstration with caught errors, an IIFE-based private counter module, and three independent fixes for the classic `var` loop bug.
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`).

## What's covered

- `var` vs `let` vs `const`: redeclaration, reassignment, block scope
- Function scope vs block scope vs global scope
- Hoisting mechanics: `var` (hoisted + initialized to `undefined`) vs `let`/`const` (hoisted but in the Temporal Dead Zone)
- Function declaration hoisting vs function expression hoisting
- Lexical scoping and the scope chain
- The classic `for (var i...) setTimeout` closure bug and how `let` fixes it
- Hands-on: triggering and catching TDZ errors, building private state with an IIFE, and three ways to fix the loop-closure bug
