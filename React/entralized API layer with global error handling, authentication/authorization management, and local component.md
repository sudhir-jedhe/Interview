Here is the complete **English translation and technical guide** for implementing a production-grade centralized API layer with global error handling, authentication/authorization management, and local component overrides in React.

---

### Architecture Overview

1. **Notification Context & Provider:** Triggers global UI alerts (e.g., Toast notifications).
2. **Centralized Axios Instance & Interceptors:** Intercepts every outgoing request and incoming response to handle errors centrally (401, 403, 500, etc.) and logs them.
3. **Local Component Override Flag (`skipGlobalError`):** Allows specific components (like form validation) to bypass the global toast and handle errors locally when needed.

---

### Step 1: Create the Global Notification Context

Create a React Context to manage and display global toast notifications across the application.

```jsx
// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className={`global-toast toast-${notification.type}`} style={toastStyle}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

const toastStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  padding: '12px 24px',
  backgroundColor: '#ff4d4f',
  color: '#fff',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 9999,
};

```

---

### Step 2: Build Centralized API Layer & Axios Interceptors

The Axios Interceptor acts as a middleware that intercepts all API responses. It handles auth failures, server errors, and logs data centrally.

```javascript
// src/services/apiClient.js
import axios from 'axios';

// Create Centralized Axios Instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
});

// Request Interceptor: Inject JWT Authorization token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized Error Logging Helper
const logErrorToService = (error) => {
  // Plug in logging services here (Sentry, Datadog, CloudWatch)
  console.error('[Global Error Log]:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message,
    timestamp: new Date().toISOString(),
  });
};

// Response Interceptor Setup
export const setupResponseInterceptors = (showNotification) => {
  apiClient.interceptors.response.use(
    // 1. Success Handler
    (response) => response,

    // 2. Global Error Handler
    async (error) => {
      const status = error.response?.status;
      const customMessage = error.response?.data?.message;

      // Log all errors to centralized logger
      logErrorToService(error);

      // Check for Local Override:
      // If the requesting component set `skipGlobalError: true`, pass error through to component
      if (error.config?.skipGlobalError) {
        return Promise.reject(error);
      }

      // Centralized Status Code Routing
      if (!error.response) {
        // Network failures / Server down
        showNotification('Network Error! Please check your internet connection.', 'error');
      } else {
        switch (status) {
          case 401: // Authentication Failure (Expired or Invalid Token)
            showNotification('Your session has expired. Please log in again.', 'error');
            localStorage.clear();
            // Redirect to Login Page
            window.location.href = '/login?session=expired';
            break;

          case 403: // Authorization Failure (Forbidden Access)
            showNotification('You do not have permission to access this resource.', 'error');
            break;

          case 404: // Resource Not Found
            showNotification(customMessage || 'Requested resource was not found.', 'error');
            break;

          case 500:
          case 502:
          case 503: // Internal Server Errors
            showNotification('A server error occurred. Please try again later.', 'error');
            break;

          default: // Fallback for other status codes (e.g. 400 Bad Request)
            showNotification(customMessage || 'Something went wrong! Please try again.', 'error');
            break;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;

```

---

### Step 3: Inject Notification Context into API Layer at App Root

Connect the `NotificationContext` trigger to the Axios Interceptor in `App.jsx`:

```jsx
// src/App.jsx
import React, { useEffect } from 'react';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { setupResponseInterceptors } from './services/apiClient';
import UserProfile from './components/UserProfile';
import LoginForm from './components/LoginForm';

function AxiosInterceptorSetup({ children }) {
  const { showNotification } = useNotification();

  useEffect(() => {
    // Inject the global notification handler into the API layer
    setupResponseInterceptors(showNotification);
  }, [showNotification]);

  return children;
}

export default function App() {
  return (
    <NotificationProvider>
      <AxiosInterceptorSetup>
        <div style={{ padding: '20px' }}>
          <h1>Global Error Handling Demo</h1>
          <UserProfile />
          <hr />
          <LoginForm />
        </div>
      </AxiosInterceptorSetup>
    </NotificationProvider>
  );
}

```

---

### Step 4: Component Usage (Global vs. Local Error Handling)

#### Scenario A: Pure Global Error Handling (Default)

In standard API calls, components don't need `catch` blocks for UI toast errors—the global interceptor handles toasts, logs, and authentication redirects automatically.

```jsx
// src/components/UserProfile.jsx
import React, { useState } from 'react';
import apiClient from '../services/apiClient';

export default function UserProfile() {
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      // If this throws 401, 403, or 500, Interceptor handles notification & logout automatically
      const response = await apiClient.get('/api/user/profile');
      setUser(response.data);
    } catch (error) {
      // No need to display toasts here! Just perform local component cleanup if required.
      console.log('API call failed; global interceptor handled notification.');
    }
  };

  return (
    <div>
      <button onClick={fetchUserData}>Fetch Profile</button>
      {user && <p>Name: {user.name}</p>}
    </div>
  );
}

```

---

#### Scenario B: Local Error Override (Form Validation)

When a component wants to render inline error messages (e.g., under a specific form input) and **suppress global toasts**, pass `skipGlobalError: true` in the Axios request config:

```jsx
// src/components/LoginForm.jsx
import React, { useState } from 'react';
import apiClient from '../services/apiClient';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const response = await apiClient.post(
        '/api/login',
        { email },
        { skipGlobalError: true } // 👈 Bypasses global toast notification
      );
      console.log('Logged in successfully', response.data);
    } catch (error) {
      // Component handles error locally in state
      if (error.response?.status === 400) {
        setLocalError('Please enter a valid email address.');
      } else {
        setLocalError('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login (Local Error Override Demo)</h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Login</button>

      {/* Render local UI error state */}
      {localError && <p style={{ color: 'red' }}>{localError}</p>}
    </form>
  );
}

```

---

### Core Benefits

1. **DRY (Don't Repeat Yourself):** Eliminates repetitive `try-catch` blocks for global notifications and `401 Unauthorized` redirect logic across every component.
2. **Centralized Logging:** Centralized entry point to forward runtime API failures to Sentry, Datadog, or backend log aggregators.
3. **Flexible Overrides:** The `skipGlobalError` flag gives components complete autonomy to render inline validation without annoying users with duplicate popups.
4. **Seamless Auth Lifecycles:** Unauthenticated requests or expired sessions clear state and redirect users cleanly.
