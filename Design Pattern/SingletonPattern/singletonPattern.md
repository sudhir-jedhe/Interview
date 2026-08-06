# Singleton Pattern in JavaScript & React

The **Singleton Pattern** ensures that:

> **Only one instance of a class exists throughout the application and provides a global access point to that instance.**

```text
Application
     ↓
Singleton Instance
     ↓
Shared Everywhere
```

***

# Why Use Singleton?

Imagine:

```text
API Client
Auth Service
Logger
WebSocket Connection
Feature Flag Service
```

Creating multiple instances can cause:

❌ Duplicate network connections

❌ Multiple caches

❌ Memory waste

❌ Inconsistent state

Singleton solves this.

***

# Basic JavaScript Singleton

```javascript
class Logger {
  static instance;

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    Logger.instance = this;
  }

  log(message) {
    console.log(message);
  }
}

const logger1 = new Logger();
const logger2 = new Logger();

console.log(logger1 === logger2);
```

Output:

```javascript
true
```

Only one instance exists.

***

# Modern Singleton Pattern

```javascript
class ApiClient {

  constructor() {
    console.log(
      "Api Client Created"
    );
  }

  get(url) {
    console.log(
      `GET ${url}`
    );
  }
}

const apiClient =
  new ApiClient();

export default apiClient;
```

Usage:

```javascript
import apiClient
from "./apiClient";

apiClient.get("/users");
```

Only one instance is created because ES modules are cached.

***

# React Example: API Client Singleton

## apiClient.js

```javascript
import axios from "axios";

class ApiClient {

  constructor() {

    this.client =
      axios.create({
        baseURL:
          "https://api.company.com"
      });
  }

  get(url) {
    return this.client.get(url);
  }

  post(url, data) {
    return this.client.post(
      url,
      data
    );
  }
}

export default new ApiClient();
```

***

## User Service

```javascript
import apiClient
from "./apiClient";

export const getUsers =
  () =>
    apiClient.get(
      "/users"
    );
```

***

# Singleton Auth Service

```javascript
class AuthService {

  constructor() {
    this.user = null;
  }

  login(user) {
    this.user = user;
  }

  getCurrentUser() {
    return this.user;
  }
}

export default new AuthService();
```

Usage:

```javascript
AuthService.login({
  name: "Sudhir"
});

console.log(
  AuthService.getCurrentUser()
);
```

Every component sees the same user.

***

# Singleton WebSocket Connection

## Problem

Without Singleton:

```javascript
new WebSocket(...)
new WebSocket(...)
new WebSocket(...)
```

Multiple connections.

***

## Solution

```javascript
class SocketService {

  static instance;

  constructor() {

    if (
      SocketService.instance
    ) {
      return SocketService.instance;
    }

    this.socket =
      new WebSocket(
        "ws://localhost:8080"
      );

    SocketService.instance =
      this;
  }
}

export default new SocketService();
```

Only one connection is established.

***

# Singleton + React Context

A common enterprise pattern.

```javascript
// services/notificationService.js

class NotificationService {

  listeners = [];

  subscribe(callback) {
    this.listeners.push(
      callback
    );
  }

  notify(message) {

    this.listeners.forEach(
      callback =>
        callback(message)
    );
  }
}

export default new NotificationService();
```

***

## Context Integration

```jsx
import NotificationService
from "./notificationService";

function App() {

  useEffect(() => {

    NotificationService.subscribe(
      message => {

        console.log(
          message
        );

      }
    );

  }, []);

  return null;
}
```

***

# Singleton Pattern vs Module Pattern

### Module Pattern

```javascript
const CartModule =
  (function () {

    let items = [];

    return {
      addItem() {}
    };

  })();
```

Focus:

```text
Encapsulation
```

***

### Singleton Pattern

```javascript
class ApiClient {}
export default new ApiClient();
```

Focus:

```text
Single Global Instance
```

***

# Singleton Pattern vs Provider Pattern

### Provider Pattern

```jsx
<UserProvider>
```

Creates React state-sharing scope.

***

### Singleton Pattern

```javascript
AuthService
```

Creates one application-wide instance.

Often used together:

```text
Provider
   ↓
Uses Singleton Service
```

***

# Common React Use Cases

✅ Axios API Client

✅ WebSocket Service

✅ Authentication Service

✅ Feature Flag Service

✅ Analytics Service

✅ Notification Service

✅ Logger Service

✅ Configuration Service

✅ Cache Manager

***

# Testing Singleton

```javascript
import apiClient
from "./apiClient";

test(
  "singleton instance",
  () => {

    const first =
      apiClient;

    const second =
      apiClient;

    expect(
      first
    ).toBe(second);
  }
);
```

***

# Interview Questions

### Q1. What is Singleton Pattern?

A creational design pattern that ensures only one instance of an object exists.

***

### Q2. Why use Singleton?

```text
Shared State
Single Connection
Shared Cache
Global Config
```

***

### Q3. Is ES Module a Singleton?

Practically, **yes**.

```javascript
export default new ApiClient();
```

The module is loaded once and cached.

***

### Q4. Real React Examples?

```text
Axios Client
WebSocket
Auth Service
Analytics
Logger
```

***

### Q5. Singleton vs Factory?

**Singleton**

```javascript
const client =
  new ApiClient();
```

One instance.

**Factory**

```javascript
createClient();
createClient();
```

Multiple instances.

***

# Senior React Interview Answer

> The Singleton Pattern ensures that only one instance of a service exists throughout an application. In React applications, common singleton services include Axios API clients, authentication managers, WebSocket connections, analytics providers, notification systems, and configuration services. Modern React projects often implement singletons simply by exporting a single instance from an ES module. This provides shared state, reduces resource consumption, prevents duplicate connections, and centralises application-wide functionality.


# Singleton Pattern in React.js

In React, the **Singleton Pattern** is commonly used for services that should have only **one instance** across the entire application.

Examples:

```text
✅ API Client (Axios)
✅ Auth Service
✅ WebSocket Service
✅ Analytics Service
✅ Logger Service
✅ Feature Flags
✅ Notification Service
✅ Cache Manager
```

***

# 1. API Client Singleton

Instead of creating Axios instances everywhere:

❌ Bad

```javascript
function Users() {
  const api = axios.create();
}

function Products() {
  const api = axios.create();
}
```

Creates multiple instances.

***

✅ Singleton

## apiClient.js

```javascript
import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: "https://api.company.com",
      timeout: 10000
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      config => {
        const token =
          localStorage.getItem("token");

        if (token) {
          config.headers.Authorization =
            `Bearer ${token}`;
        }

        return config;
      }
    );
  }

  get(url) {
    return this.client.get(url);
  }

  post(url, data) {
    return this.client.post(
      url,
      data
    );
  }
}

const apiClient =
  new ApiClient();

export default apiClient;
```

***

## Use Anywhere

```javascript
import apiClient
from "./apiClient";

apiClient.get("/users");
```

Same instance everywhere.

***

# 2. Auth Service Singleton

## AuthService.js

```javascript
class AuthService {

  user = null;

  login(user) {
    this.user = user;
  }

  logout() {
    this.user = null;
  }

  getCurrentUser() {
    return this.user;
  }

}

export default new AuthService();
```

***

## Usage

```javascript
import AuthService
from "./AuthService";

AuthService.login({
  id: 1,
  name: "Sudhir"
});

console.log(
  AuthService.getCurrentUser()
);
```

Output

```javascript
{
  id: 1,
  name: "Sudhir"
}
```

***

# 3. WebSocket Singleton

Without Singleton:

```javascript
new WebSocket()
new WebSocket()
new WebSocket()
```

Multiple connections.

***

## SocketService.js

```javascript
class SocketService {

  constructor() {

    if (
      SocketService.instance
    ) {
      return SocketService.instance;
    }

    this.socket =
      new WebSocket(
        "ws://localhost:8080"
      );

    SocketService.instance =
      this;
  }

  send(data) {
    this.socket.send(data);
  }
}

export default new SocketService();
```

***

## Usage

```javascript
import socketService
from "./SocketService";

socketService.send(
  "hello"
);
```

Only one WebSocket connection.

***

# 4. Singleton + React Context

Very common enterprise pattern.

```text
React Context
        ↓
Uses Singleton Service
```

***

## NotificationService

```javascript
class NotificationService {

  listeners = [];

  subscribe(callback) {
    this.listeners.push(
      callback
    );
  }

  notify(message) {

    this.listeners.forEach(
      callback =>
        callback(message)
    );
  }
}

export default new NotificationService();
```

***

## Provider

```jsx
import {
  createContext,
  useEffect,
  useState
} from "react";

import NotificationService
from "./NotificationService";

export const NotificationContext =
  createContext();

export function NotificationProvider({
  children
}) {

  const [message,
         setMessage] =
    useState("");

  useEffect(() => {

    NotificationService.subscribe(
      setMessage
    );

  }, []);

  return (
    <NotificationContext.Provider
      value={message}
    >
      {children}
    </NotificationContext.Provider>
  );
}
```

***

# 5. React Query Client Singleton

Production React apps usually create one QueryClient.

```javascript
import {
  QueryClient
} from
"@tanstack/react-query";

export const queryClient =
  new QueryClient();
```

***

## App.jsx

```jsx
import {
  QueryClientProvider
} from
"@tanstack/react-query";

import {
  queryClient
} from "./queryClient";

function App() {

  return (
    <QueryClientProvider
      client={queryClient}
    >
      <Dashboard />
    </QueryClientProvider>
  );
}
```

Single cache for entire app.

***

# Singleton vs Provider

## Singleton

```javascript
AuthService
```

```text
One Instance
Application Wide
```

***

## Provider

```jsx
<AuthProvider>
```

```text
React State Sharing
Component Tree Scope
```

***

# Singleton vs Module Pattern

## Singleton

```javascript
export default new ApiClient();
```

Focus:

```text
Single Instance
```

***

## Module Pattern

```javascript
const Module =
(function(){})();
```

Focus:

```text
Encapsulation
```

***

# Real Enterprise React Architecture

```text
React Component
       ↓
Custom Hook
       ↓
Provider
       ↓
Singleton Service
       ↓
API Client
       ↓
Backend
```

Example:

```text
User Page
    ↓
useUsers()
    ↓
UserProvider
    ↓
UserService (Singleton)
    ↓
ApiClient (Singleton)
```

***

# Interview Questions

### Q1. What is Singleton Pattern?

A creational design pattern that ensures only one instance of a class exists throughout the application.

***

### Q2. Why use Singleton in React?

```text
Shared State
Shared Cache
Single Connection
Global Configuration
```

***

### Q3. Are ES Modules Singletons?

Practically yes.

```javascript
export default new ApiClient();
```

Module loads once and is cached.

***

### Q4. Common React Examples?

```text
Axios Client
WebSocket Service
React Query Client
Auth Service
Analytics Service
Logger Service
```

***

### Q5. Singleton vs Factory?

**Singleton**

```javascript
new ApiClient()
```

created once.

**Factory**

```javascript
createApiClient()
```

creates many instances.

***

# Senior React Interview Answer

> In React applications, the Singleton Pattern is typically implemented by exporting a single instance of a service from an ES module. Common examples include Axios API clients, React Query clients, authentication managers, WebSocket connections, analytics services, feature flag services, and notification systems. The pattern ensures a single shared state, prevents duplicate connections, centralises configuration, and improves performance by reusing resources across the application.


# Singleton Pattern with React Context

A very common enterprise React architecture is:

```text
React Component
      ↓
Context Provider
      ↓
Singleton Service
      ↓
API / Storage / WebSocket
```

The **Context** manages UI updates, while the **Singleton** manages shared application services.

***

## Step 1: Singleton Auth Service

```javascript
// services/AuthService.js

class AuthService {
  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }

    this.user = null;

    AuthService.instance = this;
  }

  login(user) {
    this.user = user;
  }

  logout() {
    this.user = null;
  }

  getCurrentUser() {
    return this.user;
  }
}

export default new AuthService();
```

Only one instance exists across the application.

***

## Step 2: React Context

```jsx
// context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState
} from "react";

import AuthService
  from "../services/AuthService";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(
      AuthService.getCurrentUser()
    );

  const login = (
    credentials
  ) => {

    const loggedInUser = {
      id: 1,
      name: "Sudhir"
    };

    AuthService.login(
      loggedInUser
    );

    setUser(
      loggedInUser
    );
  };

  const logout = () => {

    AuthService.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth =
  () =>
    useContext(
      AuthContext
    );
```

***

## Step 3: Using Context

```jsx
function LoginPage() {

  const {
    login,
    user
  } = useAuth();

  return (
    <>
      <button
        onClick={login}
      >
        Login
      </button>

      {user && (
        <p>
          Welcome
          {" "}
          {user.name}
        </p>
      )}
    </>
  );
}
```

***

# Singleton vs Factory Pattern

This is one of the most frequently asked React interview questions.

***

## Singleton Pattern

### Purpose

Ensure only **one instance** exists.

```javascript
class ApiClient {}

export default new ApiClient();
```

Usage:

```javascript
import apiClient
from "./apiClient";

apiClient.get("/users");
```

Every component gets:

```text
Same Instance
Same Cache
Same Configuration
```

***

## Factory Pattern

### Purpose

Create **new objects** each time.

```javascript
function createApiClient() {
  return new ApiClient();
}
```

Usage:

```javascript
const client1 =
  createApiClient();

const client2 =
  createApiClient();
```

Result:

```text
Different Instances
Different Configurations
```

***

# Comparison

| Feature            | Singleton | Factory      |
| ------------------ | --------- | ------------ |
| Instances          | One       | Many         |
| Shared State       | ✅         | ❌            |
| Shared Cache       | ✅         | ❌            |
| Global Config      | ✅         | ❌            |
| Flexibility        | ❌ Lower   | ✅ Higher     |
| Test Isolation     | ⚠️ Harder | ✅ Easier     |
| React Query Client | ✅         | ❌            |
| API Client         | ✅         | ⚠️ Sometimes |

***

## Factory Example

Useful when each instance needs different configuration.

```javascript
class ApiClient {

  constructor(baseURL) {
    this.baseURL =
      baseURL;
  }
}

function createApiClient(
  baseURL
) {

  return new ApiClient(
    baseURL
  );
}
```

Usage:

```javascript
const userApi =
  createApiClient(
    "/users"
  );

const orderApi =
  createApiClient(
    "/orders"
  );
```

***

# Common Singleton Use Cases in React

## ✅ Axios API Client

```javascript
export default new ApiClient();
```

One configuration.

***

## ✅ React Query Client

```javascript
export const queryClient =
  new QueryClient();
```

One shared cache.

***

## ✅ Authentication Service

```javascript
AuthService
```

Single logged-in user state.

***

## ✅ WebSocket Service

```javascript
SocketService
```

One WebSocket connection.

***

## ✅ Analytics Service

```javascript
AnalyticsService
```

Single tracking provider.

***

## ✅ Feature Flag Service

```javascript
FeatureFlagService
```

Shared features and experiments.

***

## ✅ Notification Service

```javascript
NotificationService
```

Global notifications.

***

## ✅ Logger Service

```javascript
LoggerService
```

Centralised logging.

***

## ✅ Configuration Service

```javascript
ConfigService
```

Environment settings.

***

## ✅ Cache Manager

```javascript
CacheService
```

Shared application cache.

***

# Enterprise React Architecture

```text
React Component
       ↓
Custom Hook
       ↓
Context Provider
       ↓
Singleton Service
       ↓
API Client
       ↓
Backend
```

Example:

```text
UsersPage
   ↓
useUsers()
   ↓
UserProvider
   ↓
UserService (Singleton)
   ↓
ApiClient (Singleton)
```

***

# Senior React Interview Answer

> In React, the Singleton Pattern is commonly used for services that must have exactly one application-wide instance, such as API clients, authentication managers, WebSocket connections, analytics providers, React Query clients, notification systems, and feature flag services. React Context is often layered on top of singleton services so that UI components re-render when singleton-managed state changes. The key difference from the Factory Pattern is that a Singleton always returns the same instance, whereas a Factory creates new instances whenever requested.
