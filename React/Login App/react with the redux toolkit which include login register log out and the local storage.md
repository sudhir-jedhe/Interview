Here is a complete, production-ready React application setup using **Redux Toolkit (RTK)** to manage authentication state (`login`, `register`, `logout`) with automatic state persistence in **`localStorage`**.

---

### File Structure

```text
src/
├── app/
│   ├── store.js            # Redux store configuration
├── features/
│   └── auth/
│       └── authSlice.js    # Auth state, reducers, and localStorage logic
├── components/
│   ├── Login.jsx           # Login form
│   ├── Register.jsx        # Registration form
│   └── Dashboard.jsx       # Protected user dashboard
└── App.jsx                 # App entry component

```

---

### Step 1: Install Dependencies

```bash
npm install @reduxjs/toolkit react-redux

```

---

### Step 2: Create the Auth Slice (`features/auth/authSlice.js`)

This slice manages user credentials, authentication status, and synchronizes state directly with `localStorage`.

```javascript
import { createSlice } from '@reduxjs/toolkit';

// Helper: Safely load user data from localStorage
const storedUser = JSON.parse(localStorage.getItem('auth_user'));

const initialState = {
  user: storedUser ? storedUser : null,
  isAuthenticated: !!storedUser,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 1. REGISTER
    register: (state, action) => {
      const newUser = action.payload; // { email, password, name }
      
      state.user = { name: newUser.name, email: newUser.email };
      state.isAuthenticated = true;
      state.error = null;

      // Save user session and mock DB user in localStorage
      localStorage.setItem('registered_user', JSON.stringify(newUser));
      localStorage.setItem('auth_user', JSON.stringify(state.user));
    },

    // 2. LOGIN
    login: (state, action) => {
      const { email, password } = action.payload;
      const registeredUser = JSON.parse(localStorage.getItem('registered_user'));

      // Validate against registered user in localStorage
      if (registeredUser && registeredUser.email === email && registeredUser.password === password) {
        const loggedInUser = { name: registeredUser.name, email: registeredUser.email };
        
        state.user = loggedInUser;
        state.isAuthenticated = true;
        state.error = null;

        // Persist session to localStorage
        localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      } else {
        state.error = 'Invalid email or password';
      }
    },

    // 3. LOGOUT
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      // Remove session from localStorage
      localStorage.removeItem('auth_user');
    },

    // Clear authentication errors
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

```

---

### Step 3: Configure the Redux Store (`app/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

```

---

### Step 4: UI Components

#### 1. Register Component (`components/Register.jsx`)

```jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';

export default function Register({ switchToLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      dispatch(register(formData));
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none' }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Already have an account?{' '}
        <button onClick={switchToLogin} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>
          Login here
        </button>
      </p>
    </div>
  );
}

```

#### 2. Login Component (`components/Login.jsx`)

```jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';

export default function Login({ switchToRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(login(formData));
  };

  return (
    <div style={{ maxWidth: '350px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none' }}>
          Sign In
        </button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Don't have an account?{' '}
        <button onClick={switchToRegister} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>
          Register here
        </button>
      </p>
    </div>
  );
}

```

#### 3. Dashboard Component (`components/Dashboard.jsx`)

```jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Welcome, {user?.name}!</h2>
      <p>Logged in as: <strong>{user?.email}</strong></p>
      <button
        onClick={() => dispatch(logout())}
        style={{ padding: '10px 20px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
}

```

---

### Step 5: Main Application Component (`App.jsx`)

Connect the store using Redux `Provider` and display components dynamically based on `isAuthenticated`:

```jsx
import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './app/store';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function AuthApp() {
  const [isRegistering, setIsRegistering] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return isRegistering ? (
    <Register switchToLogin={() => setIsRegistering(false)} />
  ) : (
    <Login switchToRegister={() => setIsRegistering(true)} />
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthApp />
    </Provider>
  );
}

```

---

### How State Persistence Works

1. **On App Start:** `initialState` inspects `localStorage.getItem('auth_user')`. If a valid user session exists, `isAuthenticated` initializes to `true` directly.
2. **On Register / Login:** User details are written to `localStorage` via `localStorage.setItem('auth_user', ...)` inside the reducer.
3. **On Logout:** `localStorage.removeItem('auth_user')` clears saved credentials so page reloads land back on the Login screen.
