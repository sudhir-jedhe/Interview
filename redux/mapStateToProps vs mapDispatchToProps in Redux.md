### **`mapStateToProps` vs `mapDispatchToProps` in Redux**

In **React Redux**, `mapStateToProps` and `mapDispatchToProps` are two key functions used in the `connect()` function to link your React components to the Redux store. They both play different roles in the flow of data between your Redux store and React components.

Here's a breakdown of the differences between **`mapStateToProps`** and **`mapDispatchToProps`**, including when and how to use each.

---

### **1. `mapStateToProps`**

**Purpose**:  
`mapStateToProps` is used to **map the Redux state** to the component’s **props**. This allows the component to access parts of the state from the Redux store and re-render when that part of the state changes.

**Usage**:  
You use `mapStateToProps` when your component needs to read or display data stored in the Redux store. It subscribes the component to the Redux store and makes sure the component re-renders whenever the part of the state it depends on changes.

**Syntax**:

```javascript
const mapStateToProps = (state) => {
  return {
    propName: state.someStatePart,
  };
};
```

**Key Points**:

- **Takes the entire Redux state** as an argument.
- **Returns an object** where the keys are the names of the props and the values are derived from the Redux store’s state.
- **Component re-renders** whenever the mapped state changes.

#### **Example**:

```javascript
const mapStateToProps = (state) => ({
  count: state.counter.count,
});

export default connect(mapStateToProps)(Counter);
```

In this example:

- The `Counter` component will receive the `count` value from the Redux store as a prop (`this.props.count`).
- If the `state.counter.count` value changes in the Redux store, the component will automatically re-render.

---

### **2. `mapDispatchToProps`**

**Purpose**:  
`mapDispatchToProps` is used to **map dispatch functions** to the component’s **props**. It allows the component to dispatch actions to the Redux store, which in turn updates the store’s state.

**Usage**:  
You use `mapDispatchToProps` when your component needs to dispatch actions (e.g., when a user interacts with the component, such as clicking a button).

**Syntax**:

```javascript
const mapDispatchToProps = (dispatch) => {
  return {
    actionName: () => dispatch(actionCreator()),
  };
};
```

Alternatively, you can pass an **object** directly with action creators, and `connect` will automatically bind them to `dispatch`:

```javascript
const mapDispatchToProps = {
  actionName: actionCreator,
};
```

**Key Points**:

- **Takes `dispatch`** as an argument and returns an object where the keys are function names, and the values are the **action creators** wrapped in `dispatch()`.
- The returned object maps **action creators** to props, which you can then call to dispatch actions.
- Helps your component **trigger state changes** in the Redux store.

#### **Example**:

```javascript
const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: "INCREMENT" }),
  decrement: () => dispatch({ type: "DECREMENT" }),
});

export default connect(null, mapDispatchToProps)(Counter);
```

Or using the shorthand approach:

```javascript
const mapDispatchToProps = {
  increment: () => ({ type: "INCREMENT" }),
  decrement: () => ({ type: "DECREMENT" }),
};

export default connect(null, mapDispatchToProps)(Counter);
```

In these examples:

- The `Counter` component will receive `increment` and `decrement` as props.
- These props are functions that, when invoked, will **dispatch actions** to the Redux store.

---

### **Comparing `mapStateToProps` and `mapDispatchToProps`**

| **Feature**    | **`mapStateToProps`**                                   | **`mapDispatchToProps`**                                                   |
| -------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Purpose**    | Maps Redux store state to component props               | Maps action creators to dispatch functions                                 |
| **Argument**   | Receives the **entire Redux state**                     | Receives the **`dispatch` function**                                       |
| **Return**     | Returns an object with state values                     | Returns an object with dispatch functions (action creators)                |
| **Usage**      | When you need to **read** state values from the store   | When you need to **dispatch actions** to update the store                  |
| **Re-renders** | Triggers component re-renders when mapped state changes | Does **not** affect re-renders directly; it maps action dispatch functions |

---

### **When to Use Each**

1. **`mapStateToProps`**:
   - Use `mapStateToProps` when your component needs to **display data** from the Redux store.
   - It is necessary if your component needs to **react** to changes in state, as it ensures the component is re-rendered whenever the state that it maps to changes.

   Example:
   - Displaying a user's profile information (`mapStateToProps` would map the user's info from the store to props in the component).
   - Displaying a list of items from the Redux store (`mapStateToProps` maps the items from the store to props).

2. **`mapDispatchToProps`**:
   - Use `mapDispatchToProps` when your component needs to **trigger state updates** by **dispatching actions** to the Redux store.
   - It is necessary when your component needs to **call actions** that will modify the store's state.

   Example:
   - A component with a button to **increment** or **decrement** a counter (`mapDispatchToProps` binds the `increment` and `decrement` action creators to the component's props).
   - A form component that **submits** data, triggering an action to update the store with the form data.

---

### **Example: Counter Component**

Let’s put everything together in a simple counter app. The component needs to access the current count (`mapStateToProps`) and dispatch `increment` and `decrement` actions (`mapDispatchToProps`).

```javascript
// Actions (actions.js)
export const increment = () => ({ type: 'INCREMENT' });
export const decrement = () => ({ type: 'DECREMENT' });

// Reducer (reducer.js)
const initialState = { count: 0 };
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

export default counterReducer;

// Counter Component (Counter.js)
import React from 'react';
import { connect } from 'react-redux';
import { increment, decrement } from './actions';

const Counter = ({ count, increment, decrement }) => (
  <div>
    <h1>Count: {count}</h1>
    <button onClick={increment}>Increment</button>
    <button onClick={decrement}>Decrement</button>
  </div>
);

// Map state to props
const mapStateToProps = (state) => ({
  count: state.count,
});

// Map dispatch to props
const mapDispatchToProps = {
  increment,
  decrement,
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

### **Explanation**:

- **`mapStateToProps`** maps the `count` from the Redux store’s state to the `count` prop in the `Counter` component.
- **`mapDispatchToProps`** maps the `increment` and `decrement` action creators to the component’s props, enabling the component to dispatch those actions when the user clicks the corresponding buttons.

---

### **Summary**

- **`mapStateToProps`** is used to **access the Redux state** in a component, mapping state from the Redux store to props.
- **`mapDispatchToProps`** is used to **dispatch actions** from the component, mapping action creators to props.
- These two functions together allow your component to **read** from the Redux store and **write** to it via actions.
