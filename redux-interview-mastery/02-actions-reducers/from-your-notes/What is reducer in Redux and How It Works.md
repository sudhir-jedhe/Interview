### **What is `reducer` in Redux and How It Works?**

In Redux, a **reducer** is a **pure function** that specifies how the application's state should change in response to an **action**. Reducers are responsible for handling the actions dispatched to the Redux store and updating the state accordingly. They work by **receiving the current state** and an **action** as arguments, and then returning a **new state** based on the action's type and payload.

### **Key Concepts of Reducers in Redux**

1. **Pure Functions**: Reducers must be pure functions, meaning:
   - They always return the same output for the same input.
   - They do not modify the existing state (no side effects).
   - They should not mutate the input state but instead return a **new state**.

2. **State Transitions**: Reducers determine how the application state changes in response to actions. When an action is dispatched, the reducer checks the action's `type` and updates the state accordingly.

3. **Immutability**: Reducers must return a **new object** (or array) instead of mutating the existing state object. This ensures that the state remains immutable.

4. **Switch-Case Structure**: A typical reducer function uses a `switch` statement to handle different action types and return the appropriate state updates.

---

### **Basic Structure of a Reducer**

```javascript
// A basic structure of a reducer
const initialState = {
  todos: [],
};

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state, // Copy the existing state
        todos: [...state.todos, action.payload], // Add new todo to the list
      };

    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload), // Remove the todo with the given id
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed } // Toggle the completed status
            : todo,
        ),
      };

    default:
      return state; // Return the current state if no matching action type
  }
};

export default todoReducer;
```

### **How Reducer Works:**

1. **Arguments**:
   - The **`state`** parameter represents the current state of the application or a slice of the state. If the state is not provided (e.g., when the reducer is called for the first time), Redux uses the **`initialState`**.
   - The **`action`** parameter represents the dispatched action object, which contains:
     - `type`: The type of action (e.g., `ADD_TODO`, `REMOVE_TODO`, etc.).
     - `payload`: Optional data associated with the action (e.g., the todo item data, or the id of a todo item).

2. **`switch` Statement**:
   - Inside the reducer, a `switch` statement typically checks the `action.type` to decide how to modify the state.
   - For each action type, the reducer will return a new state, ensuring the state is updated immutably.
   - If no action matches, the default case returns the current state unchanged.

3. **Immutability**:
   - The reducer does not mutate the state directly. Instead, it returns a new object by copying the existing state and making necessary modifications.
   - For example, when adding a new todo, the reducer uses the spread operator (`...state`) to create a new object and appends the new todo to the `todos` array.

4. **Return New State**:
   - After processing the action, the reducer always returns the **new state**. It never modifies the state directly.

---

### **Example: Todo Application**

Let’s build a simple **todo app** using Redux to understand how the `reducer` works in practice.

#### **1. Action Types (Constants)**

First, we define action types to avoid string literals throughout the code.

```javascript
// src/redux/types.js

export const ADD_TODO = "ADD_TODO";
export const REMOVE_TODO = "REMOVE_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
```

#### **2. Action Creators**

Action creators generate the action objects that will be dispatched.

```javascript
// src/redux/actions/todoActions.js
import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from "./types";

export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false },
});

export const removeTodo = (id) => ({
  type: REMOVE_TODO,
  payload: id,
});

export const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id,
});
```

#### **3. Reducer**

Here’s how the reducer works to handle the actions we defined earlier.

```javascript
// src/redux/reducers/todoReducer.js
import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from "../types";

const initialState = {
  todos: [],
};

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state, // Copy the current state
        todos: [...state.todos, action.payload], // Add new todo item
      };

    case REMOVE_TODO:
      return {
        ...state, // Copy the current state
        todos: state.todos.filter((todo) => todo.id !== action.payload), // Remove todo by id
      };

    case TOGGLE_TODO:
      return {
        ...state, // Copy the current state
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed } // Toggle completed status
            : todo,
        ),
      };

    default:
      return state; // Return current state if action is not recognized
  }
};

export default todoReducer;
```

#### **4. Store**

Finally, we create the Redux store and combine the reducers.

```javascript
// src/redux/store.js
import { createStore, combineReducers } from "redux";
import todoReducer from "./reducers/todoReducer";

const rootReducer = combineReducers({
  todo: todoReducer, // Combine reducers (even though we have only one in this case)
});

const store = createStore(rootReducer);

export default store;
```

#### **5. Dispatching Actions**

In a React component, we can dispatch the actions using the `dispatch` function.

```javascript
// src/containers/TodoApp.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, removeTodo, toggleTodo } from "../redux/actions/todoActions";

function TodoApp() {
  const [text, setText] = useState("");
  const todos = useSelector((state) => state.todo.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    if (text.trim()) {
      dispatch(addTodo(text)); // Dispatch the ADD_TODO action
      setText(""); // Clear input
    }
  };

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id)); // Dispatch the REMOVE_TODO action
  };

  const handleToggleTodo = (id) => {
    dispatch(toggleTodo(id)); // Dispatch the TOGGLE_TODO action
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              onClick={() => handleToggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => handleRemoveTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

---

### **Key Points About Reducers**

1. **Pure Function**: A reducer is a pure function, meaning it does not have side effects and always returns the same output given the same input.
2. **State Update**: Reducers return a **new state** based on the current state and action, without modifying the original state.
3. **Action Processing**: The reducer processes actions and updates the state according to the action's type.
4. **Immutability**: The reducer does not mutate the state directly; it creates and returns a new state object.

---

### **Conclusion**

In Redux, the **reducer** is responsible for managing and updating the state based on the dispatched actions. It listens for different action types, performs the required state transformations, and returns a new state. Reducers are **pure functions** that adhere to the principles of immutability and predictability, which are key aspects of Redux's design.
