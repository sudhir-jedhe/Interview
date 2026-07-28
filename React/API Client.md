# Build an API Client (Senior React / JavaScript Interview)

As a React Project Lead, you'll often be expected to design an API client that centralises:

- Authentication
- Error handling
- Retry logic
- Request cancellation
- Timeout handling
- Logging
- Response transformation

Enterprise API engineering discussions frequently emphasise API gateways, retries, throttling, and API-first architectures. [06-API-Gateway-Design.md](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/06-API-Gateway-Design.md?web=1&EntityRepresentationId=1ac0b9c6-1695-470a-bb07-481fc3ddee67) describes JWT validation, rate limiting and gateway patterns, while [Cloud_Architecture_Design_Patterns_Session.md](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Documents/Cloud_Architecture_Design_Patterns_Session.md?web=1&EntityRepresentationId=fa554f0b-34fb-4d58-a0b6-442320be70a8) lists retry and throttling patterns commonly used in scalable systems. citeturn54search74turn54search84

---

# Architecture

```text
React Component
      │
      ▼
API Service Layer
      │
      ▼
API Client
      │
      ▼
Interceptors
      │
      ▼
Fetch / Axios
      │
      ▼
Backend API
```

---

# Folder Structure

```text
src/
 ├── api/
 │   ├── apiClient.ts
 │   ├── interceptors.ts
 │   ├── auth.ts
 │   └── endpoints.ts
 │
 ├── services/
 │   └── userService.ts
 │
 └── pages/
```

---

# API Client Using Fetch

## apiClient.ts

```ts
type RequestOptions = RequestInit & {
  timeout?: number;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeout = 5000, ...fetchOptions } = options;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  get<T>(url: string) {
    return this.request<T>(url);
  }

  post<T>(url: string, body: unknown) {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(url: string, body: unknown) {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete<T>(url: string) {
    return this.request<T>(url, {
      method: "DELETE",
    });
  }
}

export const api = new ApiClient("https://api.example.com");
```

Reusable API wrappers and centralised client structures are widely used to keep network logic in one place. citeturn54search62turn54search63

---

# Authentication Interceptor

```ts
function getAuthToken() {
  return localStorage.getItem("token");
}
```

```ts
headers: {
  Authorization:
    `Bearer ${getAuthToken()}`,
  "Content-Type":
    "application/json"
}
```

API gateway and API-first patterns commonly rely on JWT-based authentication. [06-API-Gateway-Design.md](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/06-API-Gateway-Design.md?web=1&EntityRepresentationId=1ac0b9c6-1695-470a-bb07-481fc3ddee67) references JWT validation at the gateway layer. citeturn54search74

---

# Retry Logic

```ts
async function retryRequest(fn, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries) {
        throw error;
      }
    }
  }
}
```

Retry is a recognised cloud design pattern and commonly appears in production API clients. [Cloud_Architecture_Design_Patterns_Session.md](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Documents/Cloud_Architecture_Design_Patterns_Session.md?web=1&EntityRepresentationId=fa554f0b-34fb-4d58-a0b6-442320be70a8) explicitly lists a Retry Pattern. citeturn54search84

---

# Service Layer

## userService.ts

```ts
import { api } from "./apiClient";

export const userService = {
  getUsers() {
    return api.get("/users");
  },

  getUser(id) {
    return api.get(`/users/${id}`);
  },

  createUser(data) {
    return api.post("/users", data);
  },
};
```

---

# React Usage

```tsx
function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getUsers().then(setUsers);
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

# Type-Safe Version

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

const users = await api.get<User[]>("/users");
```

Type-safe API clients are commonly recommended for large React applications to improve maintainability and catch errors earlier. citeturn54search67turn54search64

---

# Production Features

### Request Cancellation

```ts
const controller = new AbortController();

api.get("/users", {
  signal: controller.signal,
});

controller.abort();
```

### Request Queue

```text
Limit concurrent requests
```

### Response Cache

```text
Cache GET calls
```

### Token Refresh

```text
401
 ↓
refresh token
 ↓
retry request
```

### Rate Limiting

```text
Retry-After Header
```

API testing discussions within the organisation also mention validation of authentication, response codes, and rate-limit handling. API Testing With SASVA highlights these validation areas. citeturn54search78

---

# Senior Interview Answer

> I would build a centralised API client that wraps Fetch/Axios and provides a consistent interface for GET, POST, PUT and DELETE operations. The client should support authentication, timeout handling, retries, cancellation, error normalisation, logging, and response transformation. Business services would consume the API client rather than calling Fetch directly, keeping components clean and making the architecture scalable and testable. [\[react.wiki\]](https://react.wiki/api/production-api-client/), [\[dev.to\]](https://dev.to/ajmal_hasan/api-wrappers-using-axios-fetch-55dl)

This is the approach typically expected in a **Senior React / Frontend Architect machine coding interview**.
