**Immer** is the engine embedded directly inside Redux Toolkit that resolves one of JavaScript’s biggest pain points: updating complex nested state immutably without drowning in boilerplate spread syntax.

It lets you write straightforward, imperative code that looks like direct mutation, while guaranteeing the underlying state remains strictly immutable.

---

### The Problem: The "Spread Hell" of Manual Immutability

In standard JavaScript, mutating state in place breaks React's shallow comparison checks (`prev !== next`), causing components to skip re-renders.

To update a single nested value immutably in classic Redux, you had to shallow-copy every parent level manually:

```javascript
// Classic Redux: Fragile and verbose
function userReducer(state, action) {
  return {
    ...state,
    preferences: {
      ...state.preferences,
      notifications: {
        ...state.preferences.notifications,
        email: action.payload // Copied 3 levels just to change one boolean
      }
    }
  };
}

```

Missing a single `...` spread results in an accidental mutation bug or lost state references.

---

### How Immer Solves It: The "Draft" Proxy

Immer operates on a **Copy-on-Write** mechanism using JavaScript **`Proxy`** objects.

When a reducer runs inside Redux Toolkit:

1. Immer intercepts the `state` argument and provides a temporary **`draft`**.
2. You modify this `draft` directly using standard mutating JavaScript methods (`.push()`, `delete`, direct property reassignment).
3. Under the hood, the `Proxy` records every mutation you attempt.
4. When the reducer function finishes executing, Immer reviews the recorded changes and produces a brand new, frozen, immutable state tree containing only the necessary clones, leaving untouched branches referenced as-is (structural sharing).

---

### Code Comparison

#### Before Immer (Manual Immutability)

```javascript
case 'todos/toggleComplete':
  return {
    ...state,
    todos: state.todos.map((todo) => {
      if (todo.id !== action.payload.id) return todo;
      return {
        ...todo,
        completed: !todo.completed
      };
    })
  };

```

#### With Immer in Redux Toolkit

```javascript
toggleComplete: (state, action) => {
  const todo = state.todos.find((t) => t.id === action.payload.id);
  if (todo) {
    // Looks like direct mutation, but Immer safely handles it
    todo.completed = !todo.completed;
  }
}

```

---

### Critical Rules When Working with Immer

* **Mutate OR Return, Never Both**:
* You can mutate the draft directly:

```javascript
state.count += 1;

```

* Or you can return an entirely new state value:

```javascript
return { ...initialState };

```

* *Do not* do both in the same reducer, or Immer will throw an error because it cannot determine whether to use the draft or the returned value.

* **Replacing the Whole State**:
* If you need to reset or overwrite the entire state object, direct reassignment (`state = []`) will not work because it only rebinds the local variable reference.
* To overwrite the entire state, **return** the new value explicitly:

```javascript
resetState: () => initialState

```
