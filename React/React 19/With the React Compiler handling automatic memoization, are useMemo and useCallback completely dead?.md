The short answer is **no, they are not completely dead**, but in a project where the React Compiler is enabled, you will almost **never** need to write them yourself in standard application code.

Think of `useMemo` and `useCallback` under the React Compiler the same way you think of low-level memory assembly instructions in high-level programming languages: **still part of the language for edge cases, but hidden away by default.**

Here is a detailed breakdown of when they are no longer needed versus the rare situations where they are still relevant.

---

## 1. When They Are Obsolete (99% of Application Code)

In standard React code, the compiler automatically converts normal variables and functions into cached representations using internal index-based cache array slots (`useMemoCache`).

### A. Caching Heavy Computations

* **Before Compiler:** You had to manually profile and wrap operations in `useMemo(() => filterItems(items), [items])`.
* **With Compiler:** You write standard, clean JavaScript. The compiler automatically tracks variables and caches the result when dependencies stay stable.

### B. Preventing Re-renders in Child Components

* **Before Compiler:** Passing callbacks to children wrapped in `React.memo` required wrapping functions in `useCallback` to preserve referential equality.
* **With Compiler:** The compiler automatically memoizes function references and individual JSX node slots. It eliminates the need for both `useCallback` and `React.memo`.

### C. Stable Object References for Custom Hooks

* **Before Compiler:** Objects passed to custom hooks or context providers needed `useMemo` so downstream `useEffect` or consumer components wouldn't re-trigger unnecessarily.
* **With Compiler:** Object definitions and function references inside custom hooks are auto-memoized statically.

---

## 2. Rare Scenarios Where `useMemo` and `useCallback` Are Still Used

Despite the compiler, there are a few specific edge cases where manually writing `useMemo` or `useCallback` is still necessary or useful:

### 1. Library Authors & Published npm Packages

Published library packages (e.g., UI component kits, data tables, state management libraries) are distributed as compiled JavaScript bundles. Because you cannot guarantee that every consumer's project build setup uses the React Compiler, library maintainers will continue to use explicit `useMemo` and `useCallback` to preserve strict performance guarantees for all users.

### 2. Explicit Opt-Outs (`"use no memo"`)

If a legacy component or complex第三方 library integration violates the **Rules of React** (e.g., directly mutating props or state) and cannot easily be refactored, you can opt out of compilation for that specific component by adding `"use no memo";` at the top of the function. Inside an opted-out component, manual `useMemo` and `useCallback` remain the only way to optimize performance.

### 3. Deliberate Cache Invalidation or Custom Semantic Lifecycles

The React Compiler memoizes based on structural data flow and reactive inputs. If you deliberately need to control a value's lifecycle based on unique conditions that static analysis cannot infer, manual hooks offer precise, explicit control over when a value resets.

---

## 3. Summary Matrix

| Metric                                            | Without React Compiler                          | With React Compiler                                  |
| ------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| **Writing `useCallback` for event handlers**      | **Mandatory** when passed to memoized children. | ❌ **Obsolete** (Auto-memoized).                      |
| **Writing `useMemo` for expensive array filters** | **Mandatory** to avoid UI stutter.              | ❌ **Obsolete** (Auto-memoized).                      |
| **Wrapping components in `React.memo**`           | **Mandatory** for skipping child renders.       | ❌ **Obsolete** (Auto-memoized).                      |
| **Writing npm packages for public distribution**  | **Recommended**                                 | ✅ **Still Recommended** (For maximum compatibility). |
| **Opted-out legacy components (`"use no memo"`)** | N/A                                             | ✅ **Required** if manual caching is needed.          |

---

### Final Takeaway

You should **stop writing `useMemo` and `useCallback` by default** in new React 19 code bases that have the React Compiler enabled. Write clean, standard JavaScript first, and let the compiler handle the optimization.
