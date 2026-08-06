# Proxy Design Pattern in JavaScript & React

The **Proxy Pattern** is a structural design pattern that provides a **surrogate or placeholder** for another object to control access to it.

```text
Client
   ↓
Proxy
   ↓
Real Object
```

The proxy can add:

✅ Caching

✅ Authentication

✅ Logging

✅ Rate Limiting

✅ Lazy Loading

✅ Access Control

✅ API Request Management

***

# Real World Example

```text
React Component
      ↓
API Proxy
      ↓
Backend API
```

Instead of calling APIs directly:

```javascript
api.getUsers()
```

you call:

```javascript
proxy.getUsers()
```

and the proxy can:

```text
Check Cache
Check Auth
Log Request
Retry
```

***

# Basic JavaScript Example

## Real Service

```javascript
class UserService {
  getUsers() {
    console.log(
      "API Call"
    );

    return [
      "Sudhir",
      "John"
    ];
  }
}
```

***

## Proxy

```javascript
class UserServiceProxy {

  constructor() {
    this.service =
      new UserService();

    this.cache = null;
  }

  getUsers() {

    if (this.cache) {

      console.log(
        "Returning Cache"
      );

      return this.cache;
    }

    const users =
      this.service.getUsers();

    this.cache = users;

    return users;
  }
}
```

***

## Usage

```javascript
const proxy =
  new UserServiceProxy();

proxy.getUsers();
proxy.getUsers();
```

Output

```text
API Call

Returning Cache
```

***

# ES6 Proxy Object

JavaScript has a built-in:

```javascript
Proxy
```

***

## Logging Proxy

```javascript
const user = {
  name: "Sudhir",
  role: "Lead"
};

const proxy =
  new Proxy(user, {

    get(target, prop) {

      console.log(
        `Accessing ${prop}`
      );

      return target[prop];
    }

  });

console.log(
  proxy.name
);
```

Output

```text
Accessing name

Sudhir
```

***

# React Example 1: API Proxy

## API Client

```javascript
class ApiService {

  async getUsers() {

    const response =
      await fetch("/users");

    return response.json();
  }
}
```

***

## Proxy Service

```javascript
class ApiProxy {

  constructor() {
    this.api =
      new ApiService();

    this.cache = {};
  }

  async getUsers() {

    if (
      this.cache.users
    ) {

      return this.cache.users;
    }

    const data =
      await this.api.getUsers();

    this.cache.users =
      data;

    return data;
  }
}
```

***

## Hook

```jsx
import {
  useEffect,
  useState
} from "react";

const api =
  new ApiProxy();

function Users() {

  const [users,
         setUsers] =
    useState([]);

  useEffect(() => {

    api.getUsers()
       .then(setUsers);

  }, []);

  return (
    <>
      {users.map(user => (
        <div
          key={user.id}
        >
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# React Example 2: Authentication Proxy

## Real Service

```javascript
class ReportsService {

  getReports() {
    return [
      "Q1 Report",
      "Q2 Report"
    ];
  }
}
```

***

## Auth Proxy

```javascript
class ReportsProxy {

  constructor(user) {

    this.user = user;

    this.service =
      new ReportsService();
  }

  getReports() {

    if (
      !this.user?.isAdmin
    ) {

      throw new Error(
        "Access Denied"
      );
    }

    return this.service.getReports();
  }
}
```

***

Usage

```javascript
const reports =
  new ReportsProxy({
    isAdmin: true
  });

console.log(
  reports.getReports()
);
```

***

# React Example 3: Image Lazy Loading Proxy

```jsx
function LazyImage({
  src,
  alt
}) {

  const [loaded,
         setLoaded] =
    useState(false);

  return (

    <>

      {!loaded &&
       <div>
        Loading...
       </div>
      }

      {src} =>
          setLoaded(true)
        }
      />

    </>

  );
}
```

Proxy Logic:

```text
Placeholder
     ↓
Image Loads
     ↓
Show Image
```

***

# Proxy Pattern for API Client

Enterprise React applications often use:

```text
Axios Client
      ↓
Proxy Layer
      ↓
Backend
```

Example:

```javascript
class UserApiProxy {

  async getUsers() {

    console.log(
      "GET /users"
    );

    return apiClient.get(
      "/users"
    );
  }
}
```

Proxy adds:

```text
Logging
Caching
Retries
Circuit Breaker
Monitoring
```

***

# Proxy vs Decorator

### Proxy

Controls access.

```javascript
AuthProxy

CacheProxy
```

***

### Decorator

Adds behaviour.

```javascript
withLogging(
 userService
)
```

***

# Proxy vs Adapter

### Proxy

Same interface.

```javascript
proxy.getUsers()
```

***

### Adapter

Converts interface.

```javascript
oldApi()
↓
newApi()
```

***

# React Enterprise Use Cases

✅ API Caching

✅ Authentication

✅ Authorisation

✅ Circuit Breaker

✅ Retry Layer

✅ Logging

✅ Lazy Loading

✅ Image Placeholders

✅ Feature Flags

✅ Analytics Tracking

***

# Interview Questions

### Q1. What is Proxy Pattern?

A structural pattern that provides a placeholder object to control access to another object.

***

### Q2. Why Use Proxy?

```text
Caching
Security
Logging
Lazy Loading
```

***

### Q3. Difference Between Proxy and Decorator?

**Proxy**

```text
Control Access
```

**Decorator**

```text
Enhance Behaviour
```

***

### Q4. Real React Examples?

```text
API Client Layer
React Query Cache
Auth Guards
Feature Flags
Lazy Images
```

***

### Q5. How is Proxy useful with APIs?

```text
API
 ↓
Proxy
 ↓
Cache
Retry
Auth
Logging
```

before reaching the backend.

***

# Senior React Interview Answer

> The Proxy Pattern provides an intermediary object that controls access to another object. In React applications it is commonly used around API clients, authentication services, caching layers, retry mechanisms, circuit breakers, analytics, and lazy-loading components. A proxy maintains the same interface as the underlying object while adding capabilities such as caching, security, logging, monitoring, and request orchestration. This helps keep business logic clean and improves maintainability in large-scale React applications.


# Proxy Pattern Use Cases in React

The **Proxy Pattern** sits between a client and a real object/service and controls access to it.

```text
Component
    ↓
Proxy
    ↓
Actual Service
```

Typical React use cases:

### ✅ API Caching

```text
Component
   ↓
UserApiProxy
   ↓
Cache Check
   ↓
API
```

Avoids repeated network calls.

***

### ✅ Authentication & Authorisation

```text
React Page
    ↓
Auth Proxy
    ↓
Check JWT Token
    ↓
API
```

Only authorised users access resources.

***

### ✅ Retry & Circuit Breaker

```text
Proxy
   ↓
Retry Logic
   ↓
Circuit Breaker
   ↓
Backend
```

Prevents service failures from impacting the UI.

***

### ✅ Logging & Analytics

```text
User Click
    ↓
Proxy
    ↓
Track Event
    ↓
Execute Action
```

Useful for audit trails and analytics.

***

### ✅ Lazy Loading

```text
Placeholder
    ↓
Proxy
    ↓
Load Heavy Component
```

Common with images and large modules.

***

# Example: Proxy with Authentication + Caching

***

## Real Service

```javascript
// UserService.js

class UserService {
  async getUsers() {
    console.log("API Request");

    const response =
      await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

    return response.json();
  }
}

export default UserService;
```

***

## Auth + Cache Proxy

```javascript
// UserServiceProxy.js

import UserService
from "./UserService";

class UserServiceProxy {

  constructor() {
    this.service =
      new UserService();

    this.cache = null;
  }

  isAuthenticated() {
    return Boolean(
      localStorage.getItem(
        "token"
      )
    );
  }

  async getUsers() {

    // Authentication Check
    if (
      !this.isAuthenticated()
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    // Cache Check
    if (this.cache) {

      console.log(
        "Returning Cached Data"
      );

      return this.cache;
    }

    // Call Real Service
    const users =
      await this.service.getUsers();

    this.cache = users;

    return users;
  }
}

export default new UserServiceProxy();
```

***

## React Component

```jsx
import {
  useEffect,
  useState
} from "react";

import userProxy
from "./UserServiceProxy";

function Users() {

  const [users,
         setUsers] =
    useState([]);

  const [error,
         setError] =
    useState("");

  useEffect(() => {

    userProxy
      .getUsers()
      .then(setUsers)
      .catch(error =>
        setError(
          error.message
        )
      );

  }, []);

  if (error) {
    return (
      <h2>{error}</h2>
    );
  }

  return (
    <>
      {users.map(user => (
        <div
          key={user.id}
        >
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# Another Enterprise Example

## API Proxy with Permission Check

```javascript
class ReportsProxy {

  constructor(user) {
    this.user = user;
  }

  async getReports() {

    if (
      this.user.role !==
      "ADMIN"
    ) {

      throw new Error(
        "Access Denied"
      );
    }

    return fetch("/reports")
      .then(res =>
        res.json()
      );
  }
}
```

***

# Proxy Pattern vs Decorator Pattern

Many interviews ask this.

***

## Proxy Pattern

### Goal

Control access.

```text
Authentication
Caching
Lazy Loading
Rate Limiting
```

### Example

```javascript
proxy.getUsers();
```

Internally:

```text
Auth Check
↓
Cache Check
↓
API Call
```

***

## Decorator Pattern

### Goal

Add new behaviour.

### Example

```javascript
withLogging(
  userService
);
```

Original service:

```javascript
getUsers()
```

Decorated service:

```javascript
log()
getUsers()
```

***

# Comparison

| Feature              | Proxy          | Decorator     |
| -------------------- | -------------- | ------------- |
| Purpose              | Control Access | Add Behaviour |
| Authentication       | ✅              | ❌             |
| Caching              | ✅              | ❌             |
| Lazy Loading         | ✅              | ❌             |
| Logging              | ✅ Possible     | ✅ Common      |
| Retry Logic          | ✅              | ❌             |
| Extend Functionality | ⚠️ Limited     | ✅             |
| Same Interface       | ✅              | ✅             |

***

# Decorator Example

```javascript
class UserService {
  getUsers() {
    return ["Sudhir"];
  }
}

class LoggingDecorator {

  constructor(service) {
    this.service = service;
  }

  getUsers() {

    console.log(
      "Before Call"
    );

    const result =
      this.service.getUsers();

    console.log(
      "After Call"
    );

    return result;
  }
}

const service =
  new LoggingDecorator(
    new UserService()
  );

service.getUsers();
```

Output:

```text
Before Call
After Call
```

***

# When to Use What?

### Use Proxy When

```text
✅ Authentication
✅ Authorisation
✅ Caching
✅ Circuit Breaker
✅ Retry Logic
✅ Lazy Loading
```

### Use Decorator When

```text
✅ Add Logging
✅ Add Metrics
✅ Add Analytics
✅ Add Validation
✅ Add Formatting
```

***

# Senior React Interview Answer

> The Proxy Pattern provides an intermediary that controls access to another object. In React applications it is commonly used for API caching, authentication, permission checks, retry mechanisms, circuit breakers, and lazy loading. The Decorator Pattern, on the other hand, focuses on extending behaviour without changing the original object. A simple rule is: **Proxy controls access, Decorator enhances behaviour**. In enterprise React applications, API service layers frequently use both patterns together—Proxy for caching/authentication and Decorator for logging, telemetry, and monitoring.


# Proxy Pattern with Lazy Loading (React)

A very common React use case is loading heavy components **only when needed**.

```text
User Opens Dashboard
        ↓
Proxy Component
        ↓
Load Actual Component
```

***

## Without Proxy

```jsx
import ReportsDashboard
  from "./ReportsDashboard";

function App() {
  return (
    <ReportsDashboard />
  );
}
```

Problem:

```text
ReportsDashboard loads immediately
Large bundle size
Slow initial page load
```

***

## With Proxy (React.lazy)

### Real Component

```jsx
// ReportsDashboard.jsx

export default function ReportsDashboard() {
  return (
    <div>
      Reports Loaded
    </div>
  );
}
```

***

### Proxy Component

```jsx
import React, {
  Suspense,
  lazy
} from "react";

const ReportsDashboard =
  lazy(() =>
    import(
      "./ReportsDashboard"
    )
  );

export default function Dashboard() {

  return (
    <Suspense
      fallback={
        <div>
          Loading Reports...
        </div>
      }
    >
      <ReportsDashboard />
    </Suspense>
  );
}
```

***

### Flow

```text
User Opens Page
       ↓
Proxy Placeholder
       ↓
Download Component
       ↓
Render Component
```

This is called a **Virtual Proxy**.

***

# Proxy Pattern for API Rate Limiting

A proxy can prevent excessive requests.

```text
React Component
      ↓
Rate Limit Proxy
      ↓
API Service
```

***

## Real Service

```javascript
class UserService {

  async getUsers() {

    const response =
      await fetch("/users");

    return response.json();
  }
}
```

***

## Rate Limiting Proxy

```javascript
class RateLimitProxy {

  constructor() {

    this.service =
      new UserService();

    this.lastRequest = 0;

    this.delay = 3000;
  }

  async getUsers() {

    const now =
      Date.now();

    if (
      now -
      this.lastRequest <
      this.delay
    ) {

      throw new Error(
        "Too Many Requests"
      );
    }

    this.lastRequest =
      now;

    return this.service.getUsers();
  }
}
```

***

## React Usage

```jsx
const api =
  new RateLimitProxy();

async function loadUsers() {

  try {

    const users =
      await api.getUsers();

    console.log(users);

  } catch (error) {

    console.error(
      error.message
    );
  }
}
```

***

### Enterprise Version

```text
Auth Check
     ↓
Rate Limit Check
     ↓
Cache Check
     ↓
API Call
```

Often combined into one API proxy layer.

***

# Proxy Pattern vs Adapter Pattern

Interview favourite.

***

# Proxy Pattern

### Purpose

**Controls access** to an object.

```text
Authentication
Caching
Rate Limiting
Lazy Loading
Retry Logic
Circuit Breaker
```

***

### Structure

```text
Client
  ↓
Proxy
  ↓
Real Service
```

***

### Example

```javascript
proxy.getUsers();
```

Proxy performs:

```text
Validate Token
Check Cache
Rate Limit
Call API
```

***

# Adapter Pattern

### Purpose

**Converts one interface into another.**

Useful when integrating external systems.

***

### Example

Old API

```javascript
class LegacyApi {

  fetchEmployees() {
    return [];
  }
}
```

New Application expects:

```javascript
getUsers()
```

***

## Adapter

```javascript
class UserAdapter {

  constructor() {

    this.api =
      new LegacyApi();
  }

  getUsers() {

    return this.api
      .fetchEmployees();
  }
}
```

Usage:

```javascript
const users =
  new UserAdapter()
    .getUsers();
```

***

### Structure

```text
Client
  ↓
Adapter
  ↓
Legacy API
```

***

# Comparison Table

| Feature                   | Proxy Pattern  | Adapter Pattern   |
| ------------------------- | -------------- | ----------------- |
| Main Goal                 | Control Access | Convert Interface |
| Authentication            | ✅              | ❌                 |
| Caching                   | ✅              | ❌                 |
| Rate Limiting             | ✅              | ❌                 |
| Lazy Loading              | ✅              | ❌                 |
| Retry Logic               | ✅              | ❌                 |
| API Compatibility         | ❌              | ✅                 |
| Legacy System Integration | ❌              | ✅                 |
| Same Interface Preserved  | ✅              | ❌                 |

***

# Real React Use Cases

## Proxy Pattern

```text
✅ API Caching
✅ Authentication
✅ Role-based Access
✅ Retry Logic
✅ Circuit Breaker
✅ Rate Limiting
✅ Lazy Loading
✅ Feature Flags
```

***

## Adapter Pattern

```text
✅ Legacy REST APIs
✅ Third-party SDKs
✅ Payment Gateways
✅ Different Backend Response Formats
✅ CMS Integrations
```

Example:

```text
Backend A
{
  user_id: 1,
  user_name: "Sudhir"
}

Backend B
{
  id: 1,
  name: "Sudhir"
}

Adapter
↓
{
  id: 1,
  name: "Sudhir"
}
```

***

# Senior React Interview Answer

> The Proxy Pattern provides an intermediary that controls access to another object. In React, common uses include API caching, authentication, rate limiting, retry logic, circuit breakers, and lazy-loaded components. The Adapter Pattern, by contrast, is used to make incompatible interfaces work together by converting one API contract into another. A simple way to remember the difference is: **Proxy controls access; Adapter changes the interface**. In enterprise React applications, proxy layers often sit in front of API clients, while adapters are used when integrating legacy APIs, third-party services, or inconsistent backend response formats.
# Proxy Pattern with Retry Logic

A common enterprise React architecture:

```text
React Component
      ↓
Proxy Service
      ↓
Retry Logic
      ↓
API Service
```

The proxy automatically retries transient failures.

***

## Real Service

```javascript
class UserService {
  async getUsers() {
    const response =
      await fetch("/api/users");

    if (!response.ok) {
      throw new Error(
        "API Failed"
      );
    }

    return response.json();
  }
}
```

***

## Retry Proxy

```javascript
class RetryProxy {

  constructor() {
    this.service =
      new UserService();
  }

  async getUsers(
    retries = 3
  ) {

    let lastError;

    for (
      let attempt = 1;
      attempt <= retries;
      attempt++
    ) {

      try {

        console.log(
          `Attempt ${attempt}`
        );

        return await this
          .service
          .getUsers();

      } catch (error) {

        lastError = error;

        if (
          attempt < retries
        ) {

          const delay =
            1000 *
            Math.pow(
              2,
              attempt
            );

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                delay
              )
          );
        }
      }
    }

    throw lastError;
  }
}
```

***

## React Usage

```jsx
const api =
  new RetryProxy();

useEffect(() => {

  api
    .getUsers()
    .then(setUsers)
    .catch(setError);

}, []);
```

***

# Retry Flow

```text
Request
   ↓
Fail
   ↓
Retry 1 (2 sec)
   ↓
Fail
   ↓
Retry 2 (4 sec)
   ↓
Fail
   ↓
Retry 3 (8 sec)
   ↓
Error
```

***

# Proxy Pattern with Circuit Breaker

Circuit Breaker protects the backend from repeated failures.

***

## Real API

```javascript
class ReportService {

  async getReports() {

    const response =
      await fetch(
        "/api/reports"
      );

    if (!response.ok) {
      throw new Error(
        "Service Down"
      );
    }

    return response.json();
  }
}
```

***

## Circuit Breaker Proxy

```javascript
class CircuitBreakerProxy {

  constructor() {

    this.service =
      new ReportService();

    this.failures = 0;

    this.state =
      "CLOSED";

    this.threshold = 3;

    this.timeout =
      10000;

    this.nextTry = 0;
  }

  async getReports() {

    if (
      this.state ===
      "OPEN"
    ) {

      if (
        Date.now() <
        this.nextTry
      ) {

        throw new Error(
          "Circuit Open"
        );
      }

      this.state =
        "HALF_OPEN";
    }

    try {

      const result =
        await this.service
          .getReports();

      this.failures = 0;

      this.state =
        "CLOSED";

      return result;

    } catch (error) {

      this.failures++;

      if (
        this.failures >=
        this.threshold
      ) {

        this.state =
          "OPEN";

        this.nextTry =
          Date.now() +
          this.timeout;
      }

      throw error;
    }
  }
}
```

***

## React Component

```jsx
const reportApi =
  new CircuitBreakerProxy();

function Reports() {

  const [data,
         setData] =
    useState([]);

  const [error,
         setError] =
    useState("");

  const loadReports =
    async () => {

      try {

        const reports =
          await reportApi
            .getReports();

        setData(reports);

      } catch (error) {

        setError(
          error.message
        );
      }
    };

  return (
    <>
      <button
        onClick={
          loadReports
        }
      >
        Load Reports
      </button>

      {error && (
        <p>{error}</p>
      )}
    </>
  );
}
```

***

# Enterprise Version: Retry + Circuit Breaker Proxy

In real applications, both are usually combined:

```text
React Component
        ↓
API Proxy
        ↓
Authentication
        ↓
Caching
        ↓
Retry Logic
        ↓
Circuit Breaker
        ↓
Backend API
```

***

## Combined Proxy

```javascript
class EnterpriseApiProxy {

  constructor() {

    this.api =
      new UserService();

    this.failures = 0;

    this.threshold = 3;
  }

  async execute() {

    for (
      let retry = 1;
      retry <= 3;
      retry++
    ) {

      try {

        return await this.api
          .getUsers();

      } catch (error) {

        this.failures++;

        if (
          this.failures >=
          this.threshold
        ) {

          throw new Error(
            "Circuit Open"
          );
        }

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              retry * 1000
            )
        );
      }
    }
  }
}
```

***

# Interview Comparison

| Pattern   | Purpose                 |
| --------- | ----------------------- |
| Proxy     | Control Access          |
| Decorator | Add Behaviour           |
| Adapter   | Convert Interface       |
| Facade    | Simplify Complex System |

***

# Proxy + Retry Use Cases

✅ API Retry

✅ Rate Limiting

✅ Authentication

✅ Logging

✅ Analytics

✅ Caching

✅ Exponential Backoff

***

# Proxy + Circuit Breaker Use Cases

✅ Microservices

✅ Payment Gateways

✅ Notification Services

✅ Dashboard APIs

✅ Reporting Systems

✅ External Vendor APIs

***

# Senior React Interview Answer

> The Proxy Pattern is commonly used as an API gateway layer in React applications. A Retry Proxy automatically retries transient failures using exponential backoff, while a Circuit Breaker Proxy prevents repeated requests to unhealthy services by opening the circuit after a failure threshold is reached. In enterprise applications, a single API proxy often combines authentication, caching, logging, retry logic, rate limiting, and circuit breaker functionality to provide resilience, performance, and security while keeping React components clean and focused on UI concerns.
