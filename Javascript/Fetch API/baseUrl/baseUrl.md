Using constants for API base URLs is an excellent practice for improving code maintainability and consistency. Here's a step-by-step guide to implementing this:

---

### **1. Create a `constants.js` File**
Define a file in your project to store shared constants. This makes it easy to manage and update API-related configurations.

#### Example: `src/utils/constants.js`
```javascript
export const BASE_API_URL = "http://localhost:5000/api";
```

---

### **2. Import the Constant in Your Files**
Instead of hardcoding the URL in multiple places, import the `BASE_API_URL` constant wherever it's needed. This avoids duplication and potential errors.

#### Example: `posts.jsx`
```javascript
import { BASE_API_URL } from "../utils/constants";

const fetchPosts = async () => {
  try {
    const { data } = await axios.get(`${BASE_API_URL}/posts`);
    console.log(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

fetchPosts();
```

#### Example: `users.jsx`
```javascript
import { BASE_API_URL } from "../utils/constants";

const fetchUsers = async () => {
  try {
    const { data } = await axios.get(`${BASE_API_URL}/users`);
    console.log(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

fetchUsers();
```

---

### **3. Change Base URL Easily**
If the base URL changes (e.g., during deployment to production), you only need to update the value in `constants.js`.

#### Example: Updating `constants.js`
```javascript
// For production:
export const BASE_API_URL = "https://api.productiondomain.com";

// For development:
export const BASE_API_URL = "http://localhost:5000/api";
```

---

### **4. Use Environment Variables for Different Environments**
For better scalability, manage the base URL using environment variables. 

#### Example: `.env` File
```env
REACT_APP_BASE_API_URL=http://localhost:5000/api
```

#### Updated `constants.js`:
```javascript
export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL || "http://localhost:5000/api";
```

#### Benefit:
This approach separates configuration from the codebase, making it easier to manage staging, production, and development environments.

---

### **5. Key Advantages**
1. **Centralized Management**: Updating the base URL in one place reflects across the entire application.
2. **Environment-Specific Configurations**: Easily switch between development, staging, and production environments.
3. **Improved Maintainability**: Reduces the risk of errors from hardcoding URLs in multiple files.

Would you like to see examples with additional features like error handling, token-based authentication, or reusable API utility functions?


Your approach is correct, but for a **Senior React production application**, I'd take it one step further and create a complete API layer.

# Recommended Folder Structure

```text
src/
├── api/
│   ├── axiosClient.js
│   ├── endpoints.js
│   └── userApi.js
│
├── constants/
│   └── apiConstants.js
│
├── hooks/
│   └── useUsers.js
│
├── services/
│   └── authService.js
│
└── utils/
```

***

# 1. Environment Variables

### `.env.development`

```env
VITE_API_URL=http://localhost:5000/api
```

### `.env.production`

```env
VITE_API_URL=https://api.mycompany.com/api
```

***

# 2. Constants

## apiConstants.js

```javascript
export const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const API_TIMEOUT =
  10000;
```

***

# 3. Axios Client (Recommended)

Instead of:

```javascript
axios.get(
  `${BASE_API_URL}/users`
);
```

everywhere.

Create:

## axiosClient.js

```javascript
import axios from "axios";

import {
  API_BASE_URL,
  API_TIMEOUT
} from "../constants/apiConstants";

const apiClient =
  axios.create({
    baseURL:
      API_BASE_URL,

    timeout:
      API_TIMEOUT,

    headers: {
      "Content-Type":
        "application/json"
    }
  });
```

***

# 4. Token Injection

```javascript
apiClient.interceptors.request.use(
  config => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);
```

***

# 5. Handle Token Expiry

```javascript
apiClient.interceptors.response.use(
  response => response,

  async error => {

    if (
      error.response?.status ===
      401
    ) {

      console.log(
        "Token expired"
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(
      error
    );
  }
);
```

***

# 6. Centralized API Endpoints

## endpoints.js

```javascript
export const API_ENDPOINTS = {
  USERS: "/users",

  POSTS: "/posts",

  LOGIN: "/auth/login",

  REFRESH:
    "/auth/refresh"
};
```

***

# 7. Service Layer

## userApi.js

```javascript
import apiClient
  from "./axiosClient";

import {
  API_ENDPOINTS
} from "./endpoints";

export const getUsers =
  async () => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.USERS
      );

    return response.data;
  };

export const getUser =
  async id => {

    const response =
      await apiClient.get(
        `${API_ENDPOINTS.USERS}/${id}`
      );

    return response.data;
  };
```

***

# 8. React Query Integration

```javascript
import { useQuery }
  from
  "@tanstack/react-query";

import { getUsers }
  from "../api/userApi";

export function useUsers() {

  return useQuery({

    queryKey: [
      "users"
    ],

    queryFn:
      getUsers,

    staleTime:
      300000
  });
}
```

Usage:

```javascript
const {
  data,
  isLoading,
  error
} = useUsers();
```

***

# 9. Benefits Over Simple Constants

## Basic

```javascript
axios.get(
 `${BASE_API_URL}/users`
);
```

Problems:

```text
Duplicate URLs
No interceptor
No caching
Hard to maintain
```

***

## Enterprise

```javascript
useUsers()
```

Benefits:

```text
✅ Environment Based

✅ Centralized URLs

✅ Axios Interceptors

✅ Token Management

✅ Error Handling

✅ React Query Cache

✅ Easy Testing

✅ Easy Maintenance
```

***

# Senior React Interview Answer

> Using constants for API URLs is a good starting point, but in enterprise React applications we typically create a dedicated API layer using environment variables, Axios instances, interceptors, endpoint constants, and React Query. This centralises URL management, authentication headers, token refresh logic, error handling, caching, and request configuration, resulting in a scalable and maintainable architecture.


For enterprise React applications, I recommend combining:

```text
Environment Variables
       ↓
Constants
       ↓
Axios Instance
       ↓
Token Refresh Interceptor
       ↓
Reusable API Services
       ↓
React Query
```

Your previous React/MERN materials reference API management with Axios, Fetch, JWT Authentication & Authorization, and React state management patterns.

# 1. Environment Variable Setup

## Vite

### `.env.development`

```env
VITE_API_URL=http://localhost:5000/api
```

### `.env.production`

```env
VITE_API_URL=https://api.company.com/api
```

### constants/api.js

```javascript
export const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const API_TIMEOUT =
  10000;
```

Usage:

```javascript
console.log(API_BASE_URL);
```

***

## Create React App

### `.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### constants/api.js

```javascript
export const API_BASE_URL =
  process.env.REACT_APP_API_URL;
```

***

# 2. Reusable Axios Utility

## axiosClient.js

```javascript
import axios from "axios";

import {
  API_BASE_URL,
  API_TIMEOUT
} from "../constants/api";

const apiClient =
  axios.create({
    baseURL:
      API_BASE_URL,

    timeout:
      API_TIMEOUT,

    headers: {
      "Content-Type":
        "application/json"
    }
  });

export default apiClient;
```

***

# 3. Token Injection

Instead of adding:

```javascript
Authorization: Bearer token
```

everywhere.

```javascript
apiClient.interceptors.request.use(
  config => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);
```

***

# 4. Token Refresh using Axios Interceptor

Very common interview question.

## Problem

```text
Access Token Expired
      ↓
API Returns 401
```

***

## Refresh Logic

```javascript
apiClient.interceptors.response.use(

  response => response,

  async error => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const response =
          await axios.post(
            "/auth/refresh-token",
            {},
            {
              withCredentials: true
            }
          );

        const newAccessToken =
          response.data.accessToken;

        localStorage.setItem(
          "token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return apiClient(
          originalRequest
        );

      } catch {

        localStorage.clear();

        window.location =
          "/login";
      }
    }

    return Promise.reject(
      error
    );
  }
);
```

***

## Flow

```text
API Call
    ↓
401 Unauthorized
    ↓
Refresh Token API
    ↓
New Access Token
    ↓
Retry Original API
```

***

# 5. Reusable API Utility Functions

Instead of:

```javascript
axios.get("/users")
axios.get("/posts")
axios.post("/login")
```

throughout the app.

***

## endpoints.js

```javascript
export const API_ENDPOINTS = {

  USERS: "/users",

  POSTS: "/posts",

  LOGIN: "/auth/login",

  REFRESH:
    "/auth/refresh-token"
};
```

***

## userApi.js

```javascript
import apiClient
  from "./axiosClient";

import {
  API_ENDPOINTS
} from "./endpoints";

export const getUsers =
  async () => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.USERS
      );

    return response.data;
  };

export const getUser =
  async id => {

    const response =
      await apiClient.get(
        `${API_ENDPOINTS.USERS}/${id}`
      );

    return response.data;
  };

export const createUser =
  async user => {

    const response =
      await apiClient.post(
        API_ENDPOINTS.USERS,
        user
      );

    return response.data;
  };
```

***

# 6. React Query Integration

## Query

```javascript
import { useQuery }
  from "@tanstack/react-query";

import { getUsers }
  from "../api/userApi";

export function useUsers() {

  return useQuery({

    queryKey: [
      "users"
    ],

    queryFn:
      getUsers,

    staleTime:
      5 * 60 * 1000
  });
}
```

Usage:

```javascript
const {
  data,
  isLoading
} = useUsers();
```

***

# 7. Mutation + Automatic Cache Refresh

```javascript
const queryClient =
  useQueryClient();

const mutation =
  useMutation({

    mutationFn:
      createUser,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["users"]
      });
    }
  });
```

Flow:

```text
Create User
      ↓
Mutation Success
      ↓
Invalidate Users Cache
      ↓
Refetch Users
      ↓
Updated UI
```

***

# Production Folder Structure

```text
src
│
├── api
│   ├── axiosClient.js
│   ├── endpoints.js
│   ├── userApi.js
│
├── constants
│   └── api.js
│
├── hooks
│   └── useUsers.js
│
├── context
│   └── AuthContext.js
│
└── pages
```

# Senior React Interview Answer

> Environment variables should be used to manage API URLs for different environments such as development, staging, and production. A reusable Axios instance centralises request configuration, JWT token injection, refresh-token handling, and global error management. API calls should be encapsulated inside service modules to avoid duplication. React Query can then consume these services, providing caching, background refetching, mutations, and cache invalidation, resulting in a scalable and maintainable enterprise-grade architecture.


A good enterprise approach is to **centralise all API error messages in one place** rather than scattering them across components. The enterprise interview materials in your environment also reference Axios interceptors, status-code handling, and centralised error processing patterns. [\[AI_Intevie...d_00003240 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Tushar%20Rathod_00003240.pdf?web=1), [\[Ankita Rup...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Ankita%20Rupale_React_AI_Inteview_Evaluation.pdf?web=1)

# Custom Error Configuration

## errorMessages.js

```javascript
export const ERROR_MESSAGES = {
  400: "Invalid request. Please verify your input.",

  401: "Your session has expired. Please login again.",

  403: "You do not have permission to perform this action.",

  404: "The requested resource could not be found.",

  409: "Data already exists.",

  422: "Validation failed. Please check the form.",

  429: "Too many requests. Please try again later.",

  500: "Internal server error. Please try again.",

  DEFAULT:
    "Something went wrong. Please try later."
};
```

***

# Reusable Error Helper

## getErrorMessage.js

```javascript
import { ERROR_MESSAGES }
  from "./errorMessages";

export function getErrorMessage(
  error
) {

  // Network Error
  if (!error.response) {

    return (
      "Network connection lost."
    );
  }

  const status =
    error.response.status;

  // Backend Custom Message
  if (
    error.response.data?.message
  ) {

    return (
      error.response.data.message
    );
  }

  return (
    ERROR_MESSAGES[status] ||
    ERROR_MESSAGES.DEFAULT
  );
}
```

***

# axiosClient with Custom Messages

## axiosClient.js

```javascript
import axios from "axios";
import toast from "react-hot-toast";

import {
  getErrorMessage
} from "./getErrorMessage";

const apiClient =
  axios.create({
    baseURL:
      import.meta.env.VITE_API_URL
  });

apiClient.interceptors.response.use(

  response => response,

  async error => {

    const message =
      getErrorMessage(error);

    toast.error(message);

    return Promise.reject(error);
  }
);

export default apiClient;
```

***

# Custom Messages Per Module

Sometimes different modules require different messages.

```javascript
const CUSTOM_ERRORS = {

  users: {
    404:
      "User not found"
  },

  posts: {
    404:
      "Post no longer exists"
  },

  orders: {
    404:
      "Order not found"
  }
};
```

***

# Example

## User API

```javascript
try {

  await apiClient.get(
    "/users/100"
  );

} catch (error) {

  console.log("Handled");
}
```

Backend:

```http
404 Not Found
```

Frontend Toast:

```text
User not found
```

***

# Validation Error Example

Backend Response

```json
{
  "message":
    "Email already exists"
}
```

Interceptor:

```javascript
if (
  error.response.data?.message
) {

  return (
    error.response.data.message
  );
}
```

Toast:

```text
Email already exists
```

***

# Production Pattern

```javascript
apiClient.interceptors.response.use(

  response => response,

  error => {

    const status =
      error.response?.status;

    switch (status) {

      case 401:
        toast.error(
          "Session expired"
        );
        logout();
        break;

      case 403:
        toast.error(
          "Access denied"
        );
        break;

      case 500:
        toast.error(
          "Server error"
        );
        break;

      default:
        toast.error(
          getErrorMessage(error)
        );
    }

    return Promise.reject(error);
  }
);
```

***

# Senior React Interview Answer

```text
Never hardcode error messages inside components.

Create:
  1. Axios instance
  2. Global response interceptor
  3. Central error map
  4. Error helper function

Benefits:
✅ Consistent messages
✅ Easy localisation
✅ Central maintenance
✅ Better user experience
✅ Cleaner components
```

A typical enterprise flow is:

```text
API Error
    ↓
Axios Interceptor
    ↓
Error Mapping
    ↓
Toast Notification
    ↓
Optional Redirect / Logout
    ↓
Component Receives Rejected Promise
```
