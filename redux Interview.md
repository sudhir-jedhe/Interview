Here are detailed, interview-ready answers for **Q1 to Q35** from your Redux interview screenshots, complete with code examples where applicable.

---

### **Q1: Do you need to keep all component states in Redux store?**

**No.** Transient or UI-specific local state (such as form inputs, open/closed modal toggles, hovered elements, or active tab indices) should stay in local component state (`useState`).

Only put data in Redux if it needs to be accessed by multiple un-nested components, needs to persist across route changes, or represents global domain data.

---

### **Q2: What is Redux?**

Redux is an open-source JavaScript library for managing and centralizing application state. It follows a predictable state container pattern based on the Flux architecture, making state changes predictable by enforcing a unidirectional data flow and pure functions.

---

### **Q3: What is Redux DevTools?**

Redux DevTools is a browser extension and development tool set that allows developers to inspect Redux state changes in real-time, log dispatched actions, track action payloads, and perform "time-travel debugging" (rewinding or fast-forwarding through state changes).

---

### **Q4: What is Flux?**

Flux is an application architecture pattern developed by Facebook for building client-side web applications. It enforces **unidirectional data flow** with four main parts: **Action** $\rightarrow$ **Dispatcher** $\rightarrow$ **Store** $\rightarrow$ **View**. Redux is heavily inspired by Flux but replaces multiple stores and a central dispatcher with a single store and pure reducer functions.

---

### **Q5: What is redux-saga?**

`redux-saga` is a Redux middleware library designed to handle complex asynchronous side effects (like data fetching, caching, and background tasks). It relies heavily on **ES6 Generator functions** (`function*` and `yield`) to make asynchronous flows easy to read, test, and handle.

---

### **Q6: What are the core principles of Redux?**

1. **Single Source of Truth:** The global state of the entire application is stored in an object tree inside a single Redux store.
2. **State is Read-Only:** The only way to change the state is to dispatch an **Action** (an object describing what happened).
3. **Changes are made with Pure Functions:** **Reducers** are pure functions that take the previous state and an action, returning a brand-new state without mutating the previous one.

---

### **Q7: What are Redux selectors and why use them?**

**Selectors** are functions that extract specific pieces of state from the Redux store.

**Why use them?**

- They centralize and encapsulate state shape logic (if state structure changes, you only update the selector).
- Using **Reselect** (`createSelector`) enables memoization to prevent expensive recalculations and unnecessary re-renders.

```javascript
// Basic selector:
export const selectUserList = (state) => state.users.list;

// Memoized selector using Reselect / Redux Toolkit:
import { createSelector } from "@reduxjs/toolkit";

export const selectActiveUsers = createSelector([selectUserList], (users) =>
  users.filter((user) => user.isActive),
);
```

---

### **Q8: How to structure Redux top level directories?**

The modern best practice recommended by the Redux team is the **Feature Folder Structure ("Ducks" pattern)** or **Redux Toolkit Slices**:

```text
src/
├── app/
│   ├── store.js
│   └── rootReducer.js
├── features/
│   ├── auth/
│   │   ├── authSlice.js
│   │   └── Login.jsx
│   └── posts/
│       ├── postsSlice.js
│       └── PostList.jsx

```

---

### **Q9: What are the features of Redux DevTools?**

1. **Time Travel Debugging:** Step backward and forward through dispatched actions to inspect exact historical state states.
2. **Action Cancellation:** Toggle specific actions on/off to see how state recalculates without them.
3. **State Persistence:** Retain current state across page reloads.
4. **Action Dispatching:** Manually dispatch actions directly from the DevTools console.

---

### **Q10: How to add multiple middlewares to Redux?**

Use `applyMiddleware()` from core Redux or pass them directly into Redux Toolkit's `configureStore`:

```javascript
// Legacy Redux:
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

const store = createStore(rootReducer, applyMiddleware(thunk, logger));

// Modern Redux Toolkit:
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
```

---

### **Q11: What is Redux Thunk?**

Redux Thunk is a middleware that allows you to write action creators that return a **function** instead of a plain action object. The returned function receives `dispatch` and `getState` as arguments, enabling asynchronous logic like API calls before dispatching real actions.

---

### **Q12: What is the difference between React context and React redux?**

| Feature                | React Context                                                      | React Redux                                                                        |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| **Primary Purpose**    | Dependency injection / passing data deeply to avoid prop drilling. | Comprehensive state management with centralized architecture.                      |
| **Performance**        | Every consumer component re-renders when context value updates.    | Components re-render **only** when their specific selected slice of state changes. |
| **Debugging**          | Basic React DevTools support.                                      | Rich DevTools with time-travel debugging, action logs, and state diffing.          |
| **Middleware Support** | None built-in.                                                     | Strong ecosystem (Thunk, Saga, RTK Query).                                         |

---

### **Q13: How to set initial state in Redux?**

1. **In Reducer Default Parameter:**

```javascript
const initialState = { count: 0 };
function counterReducer(state = initialState, action) { ... }

```

2. **Via `createStore` / `configureStore`:**

```javascript
const store = configureStore({
  reducer: rootReducer,
  preloadedState: { counter: { count: 10 } },
});
```

---

### **Q14: What is the difference between Component and Container in Redux?**

- **Presentational Component ("Dumb" Component):** Focuses on how things look. Reads data via props and invokes callbacks passed via props. Contains no Redux dependency.
- **Container Component ("Smart" Component):** Focuses on how things work. Connects directly to Redux (`useSelector`, `useDispatch`, or `connect`), fetches data, and passes it to presentational components.

---

### **Q15 & Q30: What are reducers in Redux?**

A **Reducer** is a pure function that takes the current state and an action object, then calculates and returns the next state: $\text{Reducer}(\text{previousState}, \text{action}) \rightarrow \text{newState}$.

**Rules for Reducers:**

1. Must be pure functions (same inputs $\rightarrow$ same output).
2. Must never mutate existing state directly (return a modified shallow copy).
3. Must not execute asynchronous side effects or call non-deterministic functions (`Date.now()`, `Math.random()`).

---

### **Q16 & Q25: What is Redux Form and its main features?**

`redux-form` is a legacy library that stores every form field value and validation state in the Redux store.

- **Features:** Tracks dirty/pristine states, handles synchronous/asynchronous validation, and syncs field values directly into Redux.
- **Modern Note:** **Not recommended for new projects.** Storing every keystroke in Redux causes heavy performance bottlenecks. Use **React Hook Form** or **Formik** instead.

---

### **Q17: What is a store in Redux?**

The **Store** is the central JavaScript object holding the application's global state tree. It provides methods to:

- Read state (`getState()`).
- Dispatch actions (`dispatch(action)`).
- Register state listeners (`subscribe(listener)`).

---

### **Q18: What are typical middleware choices for handling asynchronous calls in Redux?**

1. **RTK Query** (Modern standard included with Redux Toolkit).
2. **Redux Thunk** (Ideal for straightforward async workflows).
3. **Redux Saga** (Ideal for complex event-driven async streams and cancellations).
4. **Redux Observable** (Uses RxJS Observables).

---

### **Q19: What are the differences between redux-saga and redux-thunk?**

| Feature           | Redux Thunk                                  | Redux Saga                                                                               |
| ----------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Core Paradigm** | Functions returning functions (Promises).    | ES6 Generator Functions (`function*`).                                                   |
| **Complexity**    | Simple, lightweight, easy to learn.          | Steeper learning curve, requires understanding generators and side effects.              |
| **Testing**       | Requires mocking API calls/network requests. | Very easy to unit test by checking yielded effect objects without network mocks.         |
| **Capabilities**  | Basic async handling.                        | Advanced features (canceling requests, debouncing, race conditions, background polling). |

---

### **Q20: Are there any similarities between Redux and RxJS?**

Yes. Both are based on **reactive data stream concepts**:

- Redux Actions act as observable streams of events.
- Redux Reducers act similarly to RxJS `scan()` operators (accumulating state over time).
- Both encourage immutable data flows and pure functional principles.

---

### **Q21: What is the purpose of the constants in Redux?**

Action type constants prevent typos during development. If an action string is misspelled as a literal string, it fails silently in reducers; using a declared constant variable throws an immediate `ReferenceError`.

```javascript
// constants.js
export const ADD_TODO = "ADD_TODO";

// action.js
import { ADD_TODO } from "./constants";
export const addTodo = (text) => ({ type: ADD_TODO, payload: text });
```

---

### **Q22: How to use `connect` from react-redux?**

`connect()` is an ES5/ES6 higher-order component (HOC) pattern used prior to React Hooks:

```javascript
import React from "react";
import { connect } from "react-redux";

const Counter = ({ count, increment }) => (
  <button onClick={increment}>Count: {count}</button>
);

const mapStateToProps = (state) => ({ count: state.counter.value });
const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: "INCREMENT" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

---

### **Q23: What are the downsides of Redux over Flux?**

- Higher initial boilerplate (Actions, Action Creators, Reducers, Types).
- Strict immutability requirement requires careful copying logic (alleviated by Redux Toolkit / Immer).
- Steeper initial learning curve for beginners compared to plain component state.

---

### **Q24: How to access redux store outside a react component?**

You can import the exported `store` instance directly into utility scripts or API interceptors:

```javascript
import { store } from "./app/store";

export function makeAuthenticatedRequest() {
  const token = store.getState().auth.token; // Read state
  if (token) {
    // Process request
  }
  store.dispatch({ type: "LOG_REQUEST" }); // Dispatch action
}
```

---

### **Q26: How to make Ajax request in Redux?**

- **Using Redux Thunk (with RTK `createAsyncThunk`):**

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return response.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: { data: [], status: "idle" },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      });
  },
});
```

---

### **Q27: What are the differences between `call` and `put` in redux-saga?**

- **`call(fn, ...args)`:** Instructs the saga middleware to call a function (usually returning a Promise). It pauses the saga execution until the Promise resolves or rejects.
- **`put(action)`:** Dispatches an action to the Redux store (equivalent to calling `dispatch(action)`).

```javascript
import { call, put } from "redux-saga/effects";

function* fetchUserSaga(action) {
  try {
    const user = yield call(api.fetchUser, action.payload.userId); // Calls API
    yield put({ type: "FETCH_USER_SUCCESS", payload: user }); // Dispatches action
  } catch (error) {
    yield put({ type: "FETCH_USER_FAILED", error });
  }
}
```

---

### **Q28: Why are Redux state functions called as reducers?**

They are named after the functional programming array method `Array.prototype.reduce()`. Just as `.reduce()` accumulates an array of values down to a single result value, a Redux reducer accumulates a stream of actions over time into a single updated state object.

---

### **Q29: What's the purpose of `@` symbol in the redux connect decorator?**

The `@` symbol is used for **ES2016 Class Decorator syntax**. It was an experimental feature that allowed applying HOCs cleanly on class components:

```javascript
// Decorator Syntax:
@connect(mapStateToProps, mapDispatchToProps)
class MyComponent extends React.Component { ... }

// Equivalent to:
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

```

---

### **Q31: How to reset state in redux?**

Provide a root reducer wrapper that intercepts a global reset action (e.g., `USER_LOGOUT`) and passes `undefined` as state to child reducers, causing them to re-initialize with default states:

```javascript
const appReducer = combineReducers({
  /* child reducers */
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined; // Forces child reducers to return initialState
  }
  return appReducer(state, action);
};
```

---

### **Q32: What is the proper way to access Redux store?**

In modern React-Redux, use the **`useSelector`** hook to access slices of state and **`useDispatch`** to send actions:

```javascript
import { useSelector, useDispatch } from "react-redux";
import { increment } from "./counterSlice";

function CounterComponent() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return <button onClick={() => dispatch(increment())}>{count}</button>;
}
```

---

### **Q33: What is the mental model of redux-saga?**

Think of `redux-saga` as a **separate background thread** in your application that is solely responsible for side effects. It acts like a daemon or middleware worker that listens continuously to dispatched actions, runs async tasks, and dispatches new actions back to the store.

---

### **Q34: How Relay is different from Redux?**

| Feature           | Redux                                                 | Relay                                                                                |
| ----------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Scope**         | General-purpose state container for any client state. | Opinionated framework strictly for **GraphQL** data fetching and caching.            |
| **Data Coupling** | Components explicitly select data from global store.  | Components declare their exact data requirements using co-located GraphQL fragments. |
| **Backend**       | Backend agnostic (REST, WebSockets, GraphQL, Local).  | Strictly requires a GraphQL server matching Relay conventions.                       |

---

### **Q35: What is Redux Thunk used for?**

Redux Thunk is primarily used for:

1. Handling **asynchronous side effects** like fetching data over HTTP.
2. Writing delayed dispatch logic that depends on checking the current store state (`getState()`).
3. Executing conditional action dispatching sequences.

Here are code examples for every single question from **Q1 to Q35**, demonstrating modern Redux Toolkit (RTK) and standard React-Redux patterns.

---

### **Q1: Do you need to keep all component states in Redux store?**

```jsx
// GOOD: Form input state stays local; global user state comes from Redux
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBio } from "./userSlice";

function UserBioForm() {
  // Local state for transient text input
  const [bioText, setBioText] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBio(bioText)); // Sent to Redux only on submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={bioText} onChange={(e) => setBioText(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
}
```

---

### **Q2: What is Redux?**

```javascript
import { createStore } from "redux";

// Pure Reducer Function
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

// Predictable Centralized Store
const store = createStore(counterReducer);
store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: "INCREMENT" }); // Logs: { count: 1 }
```

---

### **Q3 & Q9: Redux DevTools Integration & Features**

```javascript
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  // DevTools are enabled by default in development mode with RTK!
  devTools: process.env.NODE_ENV !== "production",
});
```

---

### **Q4: What is Flux?**

```javascript
// Conceptual Flux Architecture Flow
// 1. Action
const addTodoAction = { type: "ADD_TODO", payload: "Learn Flux" };

// 2. Dispatcher -> 3. Store -> 4. View Updates
// In native Flux, a Central Dispatcher broadcasts actions to multiple Stores.
```

---

### **Q5: What is redux-saga?**

```javascript
import { call, put, takeEvery } from "redux-saga/effects";
import api from "./api";

// Worker Saga: Executed using ES6 Generators
function* fetchUserSaga(action) {
  try {
    const user = yield call(api.getUser, action.payload);
    yield put({ type: "USER_FETCH_SUCCEEDED", user });
  } catch (e) {
    yield put({ type: "USER_FETCH_FAILED", message: e.message });
  }
}

// Watcher Saga
export default function* mySaga() {
  yield takeEvery("USER_FETCH_REQUESTED", fetchUserSaga);
}
```

---

### **Q6: Core Principles of Redux**

```javascript
// 1. Single Source of Truth: Store holds global state
// 2. State is Read-Only: Dispatch an action to trigger change
const action = { type: "ADD_TASK", payload: "Read Docs" };

// 3. Pure Reducer handles changes immutably
function tasksReducer(state = [], action) {
  if (action.type === "ADD_TASK") {
    return [...state, action.payload]; // Returns NEW array copy
  }
  return state;
}
```

---

### **Q7: What are Redux selectors and why use them?**

```javascript
import { createSelector } from "@reduxjs/toolkit";

const selectItems = (state) => state.cart.items;
const selectTaxRate = (state) => state.cart.taxRate;

// Reselect Memoized Selector: Only recalculates if items or taxRate change
export const selectCartTotal = createSelector(
  [selectItems, selectTaxRate],
  (items, taxRate) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    return subtotal + subtotal * taxRate;
  },
);
```

---

### **Q8: How to structure Redux top level directories?**

```javascript
// src/features/todos/todosSlice.js (Feature / "Ducks" pattern)
import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload); // RTK uses Immer under the hood
    },
  },
});

export const { addTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

---

### **Q10: How to add multiple middlewares to Redux?**

```javascript
import { configureStore } from "@reduxjs/toolkit";
import loggerMiddleware from "redux-logger";
import counterReducer from "./counterSlice";

const store = configureStore({
  reducer: { counter: counterReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});
```

---

### **Q11 & Q35: What is Redux Thunk and what is it used for?**

```javascript
// Async Thunk Action Creator
export const fetchUserById = (userId) => {
  return async (dispatch, getState) => {
    dispatch({ type: "USER_LOADING" });
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      dispatch({ type: "USER_LOADED", payload: data });
    } catch (error) {
      dispatch({ type: "USER_ERROR", error: error.message });
    }
  };
};
```

---

### **Q12: Difference between React Context vs React Redux**

```jsx
// React Context: All consuming components re-render on value change
const ThemeContext = React.createContext();

// React Redux: Component ONLY re-renders if selected state changes
import { useSelector } from "react-redux";

function UserAvatar() {
  // Only triggers re-render if state.user.avatarUrl changes!
  const avatarUrl = useSelector((state) => state.user.avatarUrl);
  return <img src={avatarUrl} alt="User Avatar" />;
}
```

---

### **Q13: How to set initial state in Redux?**

```javascript
// Method 1: In Reducer default parameter
const initialState = { items: [], status: "idle" };
function cartReducer(state = initialState, action) {
  return state;
}

// Method 2: Via preloadedState in store configuration
const store = configureStore({
  reducer: { cart: cartReducer },
  preloadedState: {
    cart: { items: [{ id: 1, name: "Book" }], status: "loaded" },
  },
});
```

---

### **Q14: Difference between Component and Container in Redux**

```jsx
// 1. Presentational Component ("Dumb")
const UserList = ({ users, onDelete }) => (
  <ul>
    {users.map((u) => (
      <li key={u.id} onClick={() => onDelete(u.id)}>
        {u.name}
      </li>
    ))}
  </ul>
);

// 2. Container Component ("Smart")
import { useSelector, useDispatch } from "react-redux";
import { deleteUser } from "./userSlice";

export function UserListContainer() {
  const users = useSelector((state) => state.users.list);
  const dispatch = useDispatch();

  return <UserList users={users} onDelete={(id) => dispatch(deleteUser(id))} />;
}
```

---

### **Q15 & Q30: What are Reducers in Redux?**

```javascript
// Pure Reducer Example
const initialState = { value: 0 };

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "counter/incremented":
      // MUST return a new object (Immutability)
      return { ...state, value: state.value + 1 };
    default:
      return state;
  }
}
```

---

### **Q16 & Q25: Redux Form Example**

```jsx
import React from "react";
import { Field, reduxForm } from "redux-form";

let ContactForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field name="firstName" component="input" type="text" />
      <button type="submit">Submit</button>
    </form>
  );
};

// Connects form inputs directly to Redux store
ContactForm = reduxForm({ form: "contact" })(ContactForm);
```

---

### **Q17: What is a store in Redux?**

```javascript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

const store = configureStore({ reducer: { counter: counterReducer } });

// Access Store APIs directly:
console.log(store.getState()); // Read state
const unsubscribe = store.subscribe(() => console.log("State updated!"));
store.dispatch({ type: "counter/increment" }); // Dispatch action
```

---

### **Q18: Middleware Choices for Asynchronous Calls**

```javascript
// RTK Query (Modern Recommended Solution)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name) => `pokemon/${name}`,
    }),
  }),
});

export const { useGetPokemonByNameQuery } = pokemonApi;
```

---

### **Q19: Differences between Redux-Saga and Redux-Thunk**

```javascript
// Thunk: Promises / Impure async logic inside functions
const fetchThunk = () => async (dispatch) => {
  const res = await fetch("/data");
  dispatch({ type: "SUCCESS", payload: await res.json() });
};

// Saga: Yields pure Effect objects (Easier to test, declarative)
function* fetchSaga() {
  const res = yield call(fetch, "/data");
  const data = yield call([res, "json"]);
  yield put({ type: "SUCCESS", payload: data });
}
```

---

### **Q20: Similarities between Redux and RxJS**

```javascript
// RxJS Scan operator works identically to a Redux Reducer
import { Subject } from "rxjs";
import { scan } from "rxjs/operators";

const action$ = new Subject();
const store$ = action$.pipe(
  scan((state, action) => {
    if (action.type === "ADD") return state + action.payload;
    return state;
  }, 0),
);

store$.subscribe((state) => console.log("State:", state));
action$.next({ type: "ADD", payload: 5 }); // State: 5
```

---

### **Q21: Purpose of Constants in Redux**

```javascript
// actionTypes.js
export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";

// reducer.js
import { FETCH_DATA_REQUEST } from "./actionTypes";

function dataReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_DATA_REQUEST: // Safe from typo bugs
      return { ...state, loading: true };
    default:
      return state;
  }
}
```

---

### **Q22: How to use `connect` from react-redux?**

```jsx
import { connect } from "react-redux";

const SimpleCounter = ({ count, dispatchIncrement }) => (
  <button onClick={dispatchIncrement}>{count}</button>
);

const mapStateToProps = (state) => ({ count: state.counter.value });
const mapDispatchToProps = (dispatch) => ({
  dispatchIncrement: () => dispatch({ type: "INCREMENT" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SimpleCounter);
```

---

### **Q23: Downsides of Redux over Flux**

```javascript
// Redux requires immutable updates (more code boilerplate without RTK):
function legacyReducer(state = { nested: { count: 0 } }, action) {
  return {
    ...state,
    nested: {
      ...state.nested,
      count: state.nested.count + 1, // Deep copy overhead
    },
  };
}
```

---

### **Q24: How to access Redux store outside a React component?**

```javascript
// axiosInterceptor.js
import { store } from "./app/store";

export function getAuthHeader() {
  // Access global state anywhere in non-React JS code
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

---

### **Q26: How to make Ajax request in Redux using RTK `createAsyncThunk`?**

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
});

const postsSlice = createSlice({
  name: "posts",
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  },
});
```

---

### **Q27: Difference between `call` and `put` in redux-saga**

```javascript
import { call, put } from "redux-saga/effects";
import { fetchApi } from "./api";

function* loadDataSaga() {
  // call(fn, ...args): Pauses generator, executes async Promise function
  const data = yield call(fetchApi, "/endpoint");

  // put(action): Non-blocking dispatch to store
  yield put({ type: "DATA_SUCCESS", payload: data });
}
```

---

### **Q28: Why are Redux state functions called reducers?**

```javascript
// Array.prototype.reduce logic is conceptually identical to Redux
const actions = [
  { type: "ADD", val: 10 },
  { type: "ADD", val: 20 },
];

const finalState = actions.reduce((state, action) => {
  if (action.type === "ADD") return state + action.val;
  return state;
}, 0); // Accumulates to 30
```

---

### **Q29: Purpose of `@` symbol in the Redux connect decorator**

```jsx
// ES2016 Class Decorator Syntax (Legacy pattern)
import React from "react";
import { connect } from "react-redux";

@connect((state) => ({ user: state.user }), {
  logout: () => ({ type: "LOGOUT" }),
})
class ProfilePage extends React.Component {
  render() {
    return <div>{this.props.user.name}</div>;
  }
}
```

---

### **Q31: How to reset state in Redux?**

```javascript
import { combineReducers } from "redux";

const appReducer = combineReducers({
  /* slices */
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    // Passing undefined forces all reducers to reset to initial state
    state = undefined;
  }
  return appReducer(state, action);
};
```

---

### **Q32: Proper way to access Redux store in Functional Components**

```jsx
import { useSelector, useDispatch } from "react-redux";
import { increment } from "./counterSlice";

export function Counter() {
  const count = useSelector((state) => state.counter.value); // Select
  const dispatch = useDispatch(); // Dispatch

  return <button onClick={() => dispatch(increment())}>{count}</button>;
}
```

---

### **Q33: Mental Model of redux-saga**

```javascript
import { takeLatest } from "redux-saga/effects";

// Background thread listening for action events
function* watcherSaga() {
  // Cancels previous execution if a new 'SEARCH_REQUEST' comes in
  yield takeLatest("SEARCH_REQUEST", performSearchWorkerSaga);
}
```

---

### **Q34: How Relay is different from Redux?**

```graphql
# Relay co-locates GraphQL fragments inside components:
fragment UserCard_user on User {
  id
  name
  profilePicture
}
```

```jsx
// Redux manually selects global object keys:
const user = useSelector((state) => state.users[id]);
```

Here is how to solve and write those **Redux Interview Questions** using **Modern Redux Toolkit (RTK)** and **RTK Query** (the official, standard way to write Redux).

---

### **1. Creating a Redux State Slice (`createSlice`)**

Instead of writing separate action constants, action creators, and switch-case reducers, RTK uses `createSlice` to generate everything automatically.

```javascript
// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      // RTK uses Immer under the hood so you can write "mutable" code directly!
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Auto-generated Action Creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Auto-generated Reducer
export default counterSlice.reducer;
```

---

### **2. Setting Up the Store (`configureStore`)**

`configureStore` replaces `createStore`, automatically setting up Redux DevTools and including `redux-thunk` middleware out of the box.

```javascript
// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});
```

---

### **3. Asynchronous Data Fetching (`createAsyncThunk`)**

Replaces manual async thunk functions and dispatch actions (`FETCH_START`, `FETCH_SUCCESS`, `FETCH_ERROR`).

```javascript
// src/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 1. Create the Async Thunk
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// 2. Handle pending, fulfilled, rejected in Slice extraReducers
const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
```

---

### **4. Modern Data Fetching with RTK Query (`createApi`)**

RTK Query is built into Redux Toolkit and completely replaces `redux-thunk`, `redux-saga`, and manual `fetch` logic for server state caching.

```javascript
// src/features/api/pokemonApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name) => `pokemon/${name}`,
    }),
  }),
});

// Auto-generated React Hook!
export const { useGetPokemonByNameQuery } = pokemonApi;
```

---

### **5. Connecting RTK to React Components Hooks (`useSelector` & `useDispatch`)**

```jsx
// src/features/counter/Counter.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./counterSlice";
import { useGetPokemonByNameQuery } from "../api/pokemonApi";

export function Counter() {
  // Read state using useSelector
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  // Fetch API using RTK Query
  const { data, error, isLoading } = useGetPokemonByNameQuery("pikachu");

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>

      <hr />

      {isLoading ? (
        <p>Loading Pokemon...</p>
      ) : error ? (
        <p>Error loading data</p>
      ) : (
        <div>
          <h3>{data.name}</h3>
          <img src={data.sprites.front_default} alt={data.name} />
        </div>
      )}
    </div>
  );
}
```

---

### **6. Reselect Memoized Selectors (`createSelector`)**

```javascript
// src/features/cart/cartSelectors.js
import { createSelector } from "@reduxjs/toolkit";

const selectCartItems = (state) => state.cart.items;
const selectTaxRate = (state) => state.cart.taxRate;

// Memoized Selector: Calculates total ONLY if cart items or tax rate changes
export const selectCartTotal = createSelector(
  [selectCartItems, selectTaxRate],
  (items, taxRate) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    return subtotal + subtotal * taxRate;
  },
);
```

---

### **Key Interview Highlights for Redux Toolkit:**

- **Immutability made easy:** RTK uses **Immer** internally, allowing you to write `state.value += 1` inside reducers safely.
- **No Switch Statements / Action Strings:** `createSlice` generates action types and action creators automatically behind the scenes.
- **Built-in Middleware:** `configureStore` includes `redux-thunk` and integrates **Redux DevTools Extension** automatically.
- **RTK Query:** Eliminates the need for manual async lifecycle action handlers and state management for API calls.
