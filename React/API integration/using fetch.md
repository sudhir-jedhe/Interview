Here is a complete, production-ready React component demonstrating how to perform **asynchronous API integration** using **`useState`** and `useEffect`.

This example fetches data from a public API (`JSONPlaceholder`), handles loading states, catches network errors, and displays the data cleanly with Tailwind CSS.

### `ApiIntegration.jsx`

```jsx
import React, { useState, useEffect } from 'react';

export default function ApiIntegration() {
  // 1. Define states for data, loading, and error handling
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data asynchronously inside useEffect on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        // Check if HTTP response is successful (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err.message || 'Something went wrong while fetching data.');
      } finally {
        setLoading(false); // Always stop loading whether success or failure
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures it runs once on mount

  // Render: Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm text-gray-500 font-medium">Loading data...</span>
      </div>
    );
  }

  // Render: Error State
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-sm font-semibold text-red-600 mb-1">Failed to load data</p>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    );
  }

  // Render: Success Data State
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">User Directory (API)</h1>
      
      <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex flex-col"
          >
            <span className="text-sm font-semibold text-gray-800">{user.name}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
            <span className="text-xs text-blue-600 mt-1">{user.company.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

### Key Patterns Explained

1. **`async/await` with `try...catch...finally`:** Ensures clean asynchronous syntax while gracefully handling network faults or JSON parsing errors.
2. **Loading State (`loading`):** Renders a spinner or skeleton loader while the network request is in flight.
3. **Error State (`error`):** Catches failed requests (e.g., 404, 500, or network offline issues) and informs the user instead of letting the application crash.
4. **`useEffect` with Empty Dependency Array (`[]`):** Guarantees that the asynchronous API call triggers **only once** when the component first mounts.
