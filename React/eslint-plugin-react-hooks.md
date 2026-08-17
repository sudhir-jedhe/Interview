**`eslint-plugin-react-hooks`** is an official ESLint plugin maintained by the React core team. It enforces the Rules of React and prevents common bugs related to incorrect Hook usage and missing dependencies.

---

## 1. Core Rules Enforced

The plugin primarily enforces two critical rules:

### 1. `react-rules/rules-of-hooks`

* **What it does:** Enforces the fundamental Rules of Hooks:

1. Only call Hooks at the **top level** of your React component or custom Hook. Do not call Hooks inside loops, conditions, or nested functions.
2. Only call Hooks from **React function components** or **custom Hooks** (functions starting with `use`).

* **Why it matters:** React relies on the exact chronological order in which Hooks are called across renders to associate state and effects with the correct component instance. Violating this rule breaks internal state mapping and causes unpredictable runtime crashes.

### 2. `react-hooks/exhaustive-deps`

* **What it does:** Scans your `useEffect`, `useLayoutEffect`, `useMemo`, and `useCallback` hooks to check their dependency arrays. It flags any reactive values (props, state, or variables derived from them) that are used inside the hook body but omitted from the dependency array.
* **Why it matters:** Omitting dependencies leads to stale closures, bugs where UI fails to update when props/state change, or subtle infinite loops. The linter ensures your dependencies are fully exhaustive.

---

## 2. Installation & Configuration

### Installation

You can install the plugin via npm, yarn, or pnpm:

```bash
npm install eslint-plugin-react-hooks --save-dev

```

### Configuration (Flat Config format / ESLint v9+)

Add it to your ESLint configuration file:

```javascript
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    },
  },
];

```
