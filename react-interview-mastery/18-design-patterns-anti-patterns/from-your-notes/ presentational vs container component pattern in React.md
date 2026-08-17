**The presentational vs container component pattern** (also known as "dumb vs smart components") splits components into two roles: presentational components decide how things look and receive everything via props, while container components decide how things work — they fetch data, hold state, and pass props down. Dan Abramov, who popularized the pattern in 2015, updated his original article in 2019 to say he no longer recommends splitting components this way: hooks (especially custom hooks) cover the same separation of concerns without forcing you to introduce a wrapper component. The vocabulary is still useful for talking about responsibilities, but in modern React the "container" layer is usually a custom hook.

**Presentational vs container component pattern in React**
A note on relevance
This pattern was widely used in the class-component era (2015–2018) and is still common in older codebases — particularly Redux apps that lean on connect. Since hooks landed in React 16.8 (2019), the standard way to encapsulate data-fetching and stateful logic is a custom hook, not a wrapper component. Dan Abramov, who introduced and popularized the pattern, edited his original article to recommend hooks instead.

It is still worth knowing the pattern: the underlying idea — separating "how it looks" from "how it works" — is sound, and a lot of code in the wild is structured this way.

**Presentational components**
Presentational components are concerned with the UI. They receive data and callbacks exclusively via props and rarely own state beyond local UI state (e.g. whether a dropdown is open, whether a tooltip is visible, the current value of an uncontrolled input). They are written as function components.

**Characteristics**
Focus on how things look
Receive data and callbacks via props
Rarely own state beyond local UI state
Written as function components
Do not subscribe directly to external stores (Redux, Zustand, etc.) — they receive the data they need via props
Example

```js
const Button = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);
```

Container components
Container components are concerned with how things work. They fetch data, manage state, and pass that data down to presentational components as props.

Characteristics
Focus on how things work
Manage state and business logic
Fetch data and handle user interactions
Pass data and callbacks to presentational components
May subscribe to a store (Redux, Zustand, etc.) or call a data-fetching library
Class container example (legacy)
The original 2015 form looked like this — a class component, often connected to a Redux store, that wrapped a presentational component:

```js
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "./actions";
import Button from "./Button";

class ButtonContainer extends Component {
  componentDidMount() {
    this.props.fetchData();
  }

  handleClick = () => {
    // Handle button click
  };

  render() {
    return <Button onClick={this.handleClick} label="Click me" />;
  }
}

const mapDispatchToProps = {
  fetchData,
};

export default connect(null, mapDispatchToProps)(ButtonContainer);
```

Modern equivalent with a custom hook
In modern React, the same separation is expressed by extracting the logic into a custom hook and keeping a single function component. The presentational component (Button) does not change

```js
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchData } from "./actions";
import Button from "./Button";

function useButtonContainer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleClick = useCallback(() => {
    // Handle button click
  }, []);

  return { handleClick };
}

export default function ButtonContainer() {
  const { handleClick } = useButtonContainer();
  return <Button onClick={handleClick} label="Click me" />;
}
```

The custom hook is the "container" — it owns the data and behavior. The component that calls it is just a thin glue layer, and the presentational Button stays pure.

**Benefits**
**Separation of concerns:** By separating the UI from the logic, the codebase becomes more modular and easier to maintain.
**Reusability**: Presentational components can be reused across different parts of the application since they are not tied to specific logic.
**Testability**: Presentational components are easy to test because they are pure functions of their props; custom hooks can be tested in isolation with @testing-library/react's renderHook.

The **Presentational vs. Container component pattern** (often referred to as "Smart vs. Dumb" components) is a classic React architectural pattern that separates a component's **business logic and state management** from its **visual rendering UI**.

---

### 1. Container Components ("Smart" Components)

Container components are concerned with **how things work**.

- **Responsibilities:** Fetching data, managing complex application state, running side effects (like API calls or subscriptions), and defining event handler functions.
- **UI Markup:** They rarely render any direct DOM elements or styling themselves. Instead, they wrap and pass data down to presentational components.
- **Statefulness:** Almost always stateful.

---

### 2. Presentational Components ("Dumb" Components)

Presentational components are concerned with **how things look**.

- **Responsibilities:** Receiving data and callback functions exclusively via `props` and rendering the visual UI markup.
- **Reusability:** Because they don't contain business logic or fetch data directly, they are highly reusable and easy to test across different parts of an application.
- **Statefulness:** Usually stateless (or containing only purely local UI state, like whether a dropdown menu is open).

---

### Example: User List Implementation

#### The Container Component (Logic & Data)

```jsx
import { useState, useEffect } from "react";
import UserListUI from "./UserListUI";

// Container: Manages data fetching and state
export default function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // Passes data down to the presentational component
  return <UserListUI users={users} loading={loading} />;
}
```

#### The Presentational Component (UI Only)

```jsx
// Presentational: Only cares about rendering what it receives via props
export default function UserListUI({ users, loading }) {
  if (loading) return <p>Loading users...</p>;

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong> ({user.email})
        </li>
      ))}
    </ul>
  );
}
```

---

### Comparison at a Glance

| Feature                     | Container Components                      | Presentational Components                    |
| --------------------------- | ----------------------------------------- | -------------------------------------------- |
| **Primary Focus**           | How things work (Logic, Data, State).     | How things look (UI, Styling, Structure).    |
| **Data Source**             | Fetches data, connects to stores/APIs.    | Receives data via `props`.                   |
| **Reusability**             | Low (usually tied to specific app logic). | High (can be reused across the application). |
| **Awareness of Redux/APIs** | Yes.                                      | No (completely decoupled).                   |

---

### Modern React Context (Hooks Era)

While this pattern originated in the early days of React (especially popular when managing Redux codebases), the rise of **React Hooks** has shifted how developers approach it:

- Instead of creating wrapper container components just to fetch data or manage state, modern React often abstracts that logic into **Custom Hooks** (e.g., `useUsers()`).
- You can then use those custom hooks directly inside your functional components, blending logic and UI more cleanly without needing deep wrapper hierarchies, though the core philosophy of separating logic from markup remains a best practice.
