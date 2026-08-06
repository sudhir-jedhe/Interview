For **Senior React / MERN interviews**, API handling is usually discussed in **3 layers**:

```text
1. Validation
2. Error Handling
3. Caching
```

***

# 1. API Validation

Never directly call APIs without validating input.

## Frontend Validation

Using React Hook Form + Zod

```bash
npm install react-hook-form zod
```

```jsx
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8)
});
```

***

## Validate Before API Call

```jsx
const handleSubmit =
  async values => {

    const result =
      loginSchema.safeParse(
        values
      );

    if (!result.success) {

      return;
    }

    await loginApi(values);
  };
```

***

## Backend Validation

Express + Joi

```js
const Joi =
  require("joi");

const schema =
  Joi.object({
    email:
      Joi.string()
        .email()
        .required(),

    password:
      Joi.string()
        .min(8)
        .required()
  });

const {
  error
} =
  schema.validate(req.body);

if (error) {

  return res.status(400)
    .json({
      message:
        error.details[0].message
    });
}
```

***

# 2. API Error Handling

A common interview question:

```text
How do you handle
4xx
5xx
Network Errors
Timeouts
```

***

## Axios Instance

```jsx
import axios
  from "axios";

const api =
  axios.create({
    baseURL:
      "/api",
    timeout: 10000
  });
```

***

## Request Interceptor

```jsx
api.interceptors.request.use(
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

## Response Interceptor

```jsx
api.interceptors.response.use(
  response => response,

  error => {

    if (
      error.response?.status ===
      401
    ) {

      logout();
    }

    return Promise.reject(
      error
    );
  }
);
```

***

# Centralized Error Helper

```jsx
export function getErrorMessage(
  error
) {

  if (
    error.response
  ) {

    return (
      error.response.data
        ?.message ||
      "Server Error"
    );
  }

  if (
    error.request
  ) {

    return (
      "Network Error"
    );
  }

  return (
    "Unexpected Error"
  );
}
```

Usage:

```jsx
try {

  await api.get(
    "/users"
  );

} catch (error) {

  toast.error(
    getErrorMessage(
      error
    )
  );
}
```

***

# Error UI States

```jsx
if (loading)
  return <Spinner />;

if (error)
  return (
    <ErrorState />
  );

return <Data />;
```

***

# 3. API Caching

Caching reduces:

```text
API Calls
Loading Time
Network Cost
```

***

# React Query Cache

```bash
npm install @tanstack/react-query
```

***

## Fetch Users

```jsx
const {
  data,
  isLoading
} = useQuery({
  queryKey: [
    "users"
  ],

  queryFn:
    fetchUsers,

  staleTime:
    5 * 60 * 1000
});
```

Meaning:

```text
5 Minutes
↓
No Refetch
↓
Use Cache
```

***

## Cache Flow

```text
First Request
      ↓
API Call
      ↓
Store Cache

Second Request
      ↓
Read Cache
```

***

## Invalidate Cache

After create/update/delete.

```jsx
const queryClient =
  useQueryClient();

queryClient.invalidateQueries({
  queryKey: [
    "users"
  ]
});
```

***

# Mutation Example

```jsx
const mutation =
  useMutation({
    mutationFn:
      createUser,

    onSuccess:
      () => {

        queryClient.invalidateQueries({
          queryKey:
            ["users"]
        });

      }
  });
```

***

# Cache Strategies

### Cache First

```text
Use Cache
↓
API If Missing
```

***

### Network First

```text
API
↓
Cache Fallback
```

***

### Stale While Revalidate

React Query default style:

```text
Show Cache
      ↓
Background Refetch
      ↓
Update UI
```

***

# Production Example

```jsx
function UsersList() {

  const {
    data,
    error,
    isLoading
  } = useQuery({
    queryKey: [
      "users"
    ],

    queryFn:
      () =>
        api.get(
          "/users"
        ),

    staleTime:
      300000,

    retry: 3
  });

  if (isLoading)
    return <Loader />;

  if (error)
    return (
      <ErrorPage />
    );

  return (
    <Users
      users={data}
    />
  );
}
```

***

# Interview Answer

### Validation

```text
Frontend
- React Hook Form
- Yup
- Zod

Backend
- Joi
- Express Validator
```

### Error Handling

```text
Try Catch
Axios Interceptors
Toast Messages
Error Boundaries
Central Error Handler
```

### Caching

```text
React Query
RTK Query
SWR

staleTime
cacheTime
invalidateQueries()
optimistic updates
```

### Senior React Architecture

```text
Component
    ↓

React Query

    ↓

Axios Client

    ↓

Interceptor

    ↓

Validation

    ↓

Backend

    ↓

Error Handling

    ↓

Cache Update
```

This is the architecture commonly expected in senior React/MERN interviews when discussing API integration, resiliency, authentication, and performance.
    


    For React + Node.js applications, a common enterprise API architecture combines:

```text
Frontend Validation
        ↓
Backend Validation (Joi)
        ↓
Axios Interceptors
        ↓
React Query Cache
```

Your React/MERN profile references API integration, JWT authentication, Axios, and modern React state management patterns.

# 1. Backend Validation with Joi

## Install

```bash
npm install joi
```

***

## Validation Schema

```js
const Joi = require("joi");

const createUserSchema =
  Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),

    email: Joi.string()
      .email()
      .required(),

    age: Joi.number()
      .min(18)
      .required()
  });
```

***

## Express Route

```js
app.post(
  "/users",
  async (req, res) => {

    const {
      error
    } = createUserSchema.validate(
      req.body
    );

    if (error) {

      return res.status(400).json({
        success: false,
        message:
          error.details[0].message
      });
    }

    const user =
      await User.create(
        req.body
      );

    return res.status(201).json({
      success: true,
      data: user
    });
  }
);
```

***

## Invalid Request

```json
{
  "name": "Su",
  "email": "abc"
}
```

Response:

```json
{
  "success": false,
  "message": "\"name\" length must be at least 3 characters long"
}
```

***

# 2. Axios Error Interceptor for Token Expiry

JWT Access Token:

```text
Expires In 15 Minutes
```

When expired:

```text
Backend Returns 401
```

***

## Axios Client

```js
import axios
  from "axios";

const api =
  axios.create({
    baseURL: "/api"
  });
```

***

## Response Interceptor

```js
api.interceptors.response.use(

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

        const newToken =
          response.data.accessToken;

        localStorage.setItem(
          "token",
          newToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(
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
API Request
      ↓
401 Unauthorized
      ↓
Refresh Token API
      ↓
New Access Token
      ↓
Retry Original Request
```

***

# 3. React Query Cache Invalidation After Mutation

One of the most asked interview questions.

Suppose:

```text
Users Page
```

is cached.

***

## Query

```jsx
const {
  data
} = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers
});
```

React Query caches:

```text
users
```

***

## Create User Mutation

```jsx
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

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

***

## Create User API

```jsx
const createUser =
  async user => {

    return api.post(
      "/users",
      user
    );
  };
```

***

## Usage

```jsx
mutation.mutate({
  name: "Sudhir",
  email:
    "sudhir@test.com"
});
```

***

## What Happens?

```text
Create User
      ↓
Mutation Success
      ↓
Invalidate Cache
      ↓
Refetch Users
      ↓
UI Updated
```

***

# Update Mutation

```jsx
const updateMutation =
  useMutation({

    mutationFn:
      updateUser,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["users"]
      });

      queryClient.invalidateQueries({
        queryKey: ["user-profile"]
      });

    }
  });
```

***

# Delete Mutation

```jsx
const deleteMutation =
  useMutation({

    mutationFn:
      deleteUser,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["users"]
      });

    }
  });
```

***

# Optimistic Update Example

```jsx
const mutation =
  useMutation({

    mutationFn:
      updateUser,

    onMutate:
      async newUser => {

        await queryClient.cancelQueries({
          queryKey: ["users"]
        });

        const previous =
          queryClient.getQueryData(
            ["users"]
          );

        queryClient.setQueryData(
          ["users"],
          old =>
            old.map(user =>
              user.id ===
              newUser.id
                ? newUser
                : user
            )
        );

        return { previous };
      }
  });
```

***

# Senior React Interview Answer

### Validation

```text
Frontend
→ React Hook Form
→ Yup / Zod

Backend
→ Joi
→ Express Validator
```

### Error Handling

```text
Axios Interceptors
401 Handling
Token Refresh
Global Error Handler
Toast Notifications
```

### Cache Management

```text
React Query
RTK Query
SWR

Mutation
    ↓
invalidateQueries()
    ↓
Refetch
    ↓
Updated UI
```

### Production Flow

```text
React Component
       ↓

React Query

       ↓

Axios

       ↓

JWT Interceptor

       ↓

Node.js API

       ↓

Joi Validation

       ↓

Database

       ↓

Invalidate Cache

       ↓

UI Refresh
```
For a **Senior React Developer** interview, this is the typical structure:

```text
1. React Hook Form Validation
2. API Error Handling
3. React Query Cache Updates
```

***

# 1. Frontend Input Validation with React Hook Form

## Install

```bash
npm install react-hook-form zod @hookform/resolvers
```

***

## Zod Schema

```jsx
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters"
    )
});
```

***

## Login Form

```jsx
import { useForm } from "react-hook-form";

import { zodResolver }
  from "@hookform/resolvers/zod";

function LoginForm() {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver:
      zodResolver(loginSchema)
  });

  const onSubmit =
    data => {
      console.log(data);
    };

  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
    >

      <input
        placeholder="Email"
        {...register("email")}
      />

      {errors.email && (
        <p>
          {errors.email.message}
        </p>
      )}

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
      />

      {errors.password && (
        <p>
          {errors.password.message}
        </p>
      )}

      <button>
        Login
      </button>

    </form>

  );
}
```

***

## Validation Flow

```text
User Input
      ↓
React Hook Form
      ↓
Zod Validation
      ↓
Error Message
      ↓
Prevent API Call
```

***

# 2. Handle API Errors Gracefully

Never show raw backend errors.

***

## Axios Client

```jsx
import axios from "axios";

const api =
  axios.create({
    baseURL: "/api",
    timeout: 10000
  });
```

***

## Central Error Handler

```jsx
export function getErrorMessage(
  error
) {

  if (error.response) {

    switch (
      error.response.status
    ) {

      case 400:
        return "Invalid request";

      case 401:
        return "Session expired";

      case 403:
        return "Access denied";

      case 404:
        return "Data not found";

      default:
        return "Something went wrong";
    }
  }

  if (error.request) {
    return "Network Error";
  }

  return "Unknown Error";
}
```

***

## API Call

```jsx
import toast
  from "react-hot-toast";

try {

  await api.get("/users");

} catch (error) {

  toast.error(
    getErrorMessage(
      error
    )
  );
}
```

***

## Error UI States

```jsx
function UsersPage() {

  const {
    data,
    error,
    isLoading
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState
        message="Unable to load users"
      />
    );
  }

  return (
    <UsersList
      users={data}
    />
  );
}
```

***

# Retry Button Example

```jsx
function ErrorState({
  message,
  retry
}) {

  return (

    <div>

      <p>{message}</p>

      <button
        onClick={retry}
      >
        Try Again
      </button>

    </div>

  );
}
```

***

# 3. React Query Cache Update After Mutation

React Query caches server data.

Example:

```text
GET /users

Cached As

["users"]
```

***

## Query

```jsx
const {
  data
} = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers
});
```

***

## Create User Mutation

```jsx
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

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

***

## Create Button

```jsx
<button
  onClick={() =>
    mutation.mutate({
      name: "Sudhir"
    })
  }
>
  Create User
</button>
```

***

## Cache Flow

```text
Create User
      ↓
Mutation Success
      ↓
Invalidate Cache
      ↓
Refetch Users
      ↓
Updated UI
```

***

# Optimistic Update (Senior Level)

Update UI before API completes.

```jsx
const mutation =
  useMutation({

    mutationFn:
      updateUser,

    onMutate:
      async newUser => {

        await queryClient.cancelQueries({
          queryKey: ["users"]
        });

        const previousUsers =
          queryClient.getQueryData([
            "users"
          ]);

        queryClient.setQueryData(
          ["users"],
          old =>
            old.map(user =>
              user.id ===
              newUser.id
                ? newUser
                : user
            )
        );

        return {
          previousUsers
        };
      },

    onError:
      (
        error,
        variables,
        context
      ) => {

        queryClient.setQueryData(
          ["users"],
          context.previousUsers
        );
      },

    onSettled: () => {

      queryClient.invalidateQueries({
        queryKey: ["users"]
      });

    }
  });
```

***

# Senior React Interview Answer

```text
Validation
----------
React Hook Form
Zod / Yup
Prevent invalid API calls

Error Handling
--------------
Axios interceptors
Central error helper
Toast notifications
Loading / Empty / Error states

Caching
--------
React Query
Stale-While-Revalidate
invalidateQueries()
Optimistic Updates

Flow
----
UI
 ↓
Validation
 ↓
API Call
 ↓
Error Handling
 ↓
React Query Cache
 ↓
UI Update
```

This is the architecture commonly expected in modern React, Next.js, and enterprise MERN applications for robust API handling.
