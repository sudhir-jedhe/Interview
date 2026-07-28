To call a loading function **only once when the component mounts**, use `useEffect` with an **empty dependency array (`[]`)**.

```jsx
import { useEffect } from "react";

function UserList() {
  const loadUsers = async () => {
    console.log("Loading users...");
    // API call here
  };

  useEffect(() => {
    loadUsers();
  }, []); // Runs only once after initial render

  return <div>User List</div>;
}
```

### Real-world example

```jsx
import { useState, useEffect } from "react";

function Dashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}
```

### Important React 18 Note

In **React Strict Mode (development only)**, `useEffect` may appear to run twice. This is intentional for detecting side effects. In production, it runs once.

If you need to guarantee a function executes only once even in Strict Mode, you can use `useRef`:

```jsx
import { useEffect, useRef } from "react";

function App() {
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;

    hasLoaded.current = true;
    console.log("Runs only once");
  }, []);

  return <div>App</div>;
}
```

**Interview answer:**
_"Use `useEffect(() => { loadData(); }, [])`. The empty dependency array ensures the effect runs after the initial render only. In React 18 Strict Mode, it may run twice in development, but only once in production."_
