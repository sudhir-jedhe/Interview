### Authentication vs Authorization vs Role-Based Access Control (RBAC)

Since you've worked with JWT Authentication & Authorization in React applications, this is a common interview topic.

***

# 1. Authentication

**Authentication = Who are you?**

The system verifies a user's identity.

Example:

```text
Username + Password
OTP
SSO (Azure AD, Okta)
JWT Login
```

Flow:

```text
Login
  ↓
Verify Credentials
  ↓
Generate JWT Token
  ↓
User Authenticated
```

Example JWT:

```json
{
  "id": 101,
  "name": "Sudhir"
}
```

***

# 2. Authorization

**Authorization = What are you allowed to do?**

After login, the application determines which resources the user can access.

Example:

```text
Admin     → Create/Delete Users
Manager   → View Reports
Employee  → View Profile
```

JWT:

```json
{
  "id": 101,
  "role": "admin"
}
```

***

# 3. Role-Based Access Control (RBAC)

A role defines permissions.

```text
Admin
Manager
Employee
Guest
```

Example:

| Role     | View Dashboard | Create User | Delete User |
| -------- | -------------- | ----------- | ----------- |
| Admin    | ✅              | ✅           | ✅           |
| Manager  | ✅              | ❌           | ❌           |
| Employee | ✅              | ❌           | ❌           |

***

# React Example

## User Object

```jsx
const user = {
  id: 1,
  name: "Sudhir",
  role: "admin"
};
```

***

## Conditional UI Rendering

```jsx
function Dashboard() {

  const user = {
    role: "admin"
  };

  return (
    <>
      <h1>Dashboard</h1>

      {user.role === "admin" && (
        <button>
          Delete User
        </button>
      )}
    </>
  );
}
```

Only Admin sees:

```text
Delete User
```

***

# Multiple Roles

JWT:

```json
{
  "id": 101,
  "roles": [
    "admin",
    "manager"
  ]
}
```

React:

```jsx
const hasRole =
  (...roles) =>
    roles.some(role =>
      user.roles.includes(role)
    );

{
  hasRole(
    "admin",
    "manager"
  ) && (
    <button>
      Export Report
    </button>
  );
}
```

***

# Protected Route by Role

```jsx
function ProtectedRoute({
  roles,
  children
}) {

  const { user } =
    useAuth();

  const allowed =
    roles.includes(
      user.role
    );

  return allowed
    ? children
    : <Navigate to="/403" />;
}
```

Usage:

```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute
      roles={["admin"]}
    >
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

***

# Interview Answer

```text
Authentication
→ Verifies user identity.

Authorization
→ Determines what resources
  a user can access.

Role
→ A collection of permissions
  assigned to a user.

RBAC
→ Uses roles such as Admin,
  Manager, and Employee to
  control application access.
```

### Easy Memory Trick

```text
Authentication = Who are you?
Authorization  = What can you do?
Role           = Permission Group
```


For enterprise React applications, a common pattern is to store user roles (decoded from JWT claims or returned by a `/me` API) in an `AuthContext`, then use those roles for both route protection and UI rendering. Your enterprise documents reference role-based access control (RBAC), protected routes, and role-scoped dashboards.

# 1. AuthContext with Multiple Roles

## Example JWT Payload

```json
{
  "id": 101,
  "name": "Sudhir",
  "roles": ["admin", "manager"]
}
```

## AuthContext.jsx

```jsx
import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext();

export const useAuth =
  () => useContext(AuthContext);

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState({
      id: 101,
      name: "Sudhir",
      roles: [
        "admin",
        "manager"
      ]
    });

  const hasRole = (...roles) => {
    return roles.some(role =>
      user?.roles?.includes(role)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

***

# 2. ProtectedRoute with Role Check

## ProtectedRoute.jsx

```jsx
import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "./AuthContext";

function ProtectedRoute({
  roles,
  children
}) {

  const {
    user
  } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
      />
    );
  }

  const allowed =
    roles.some(role =>
      user.roles.includes(role)
    );

  if (!allowed) {
    return (
      <Navigate
        to="/403"
      />
    );
  }

  return children;
}

export default ProtectedRoute;
```

***

## Route Configuration

```jsx
import {
  Routes,
  Route
} from "react-router-dom";

<Routes>

  <Route
    path="/admin"
    element={
      <ProtectedRoute
        roles={["admin"]}
      >
        <AdminPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute
        roles={[
          "admin",
          "manager"
        ]}
      >
        <ReportsPage />
      </ProtectedRoute>
    }
  />

</Routes>
```

### Access

```text
Admin Route
   ↓
admin ✅

Reports Route
   ↓
admin ✅
manager ✅
```

***

# 3. Conditional UI Rendering

## Navigation Menu

```jsx
import { useAuth }
  from "./AuthContext";

function Navigation() {

  const {
    hasRole
  } = useAuth();

  return (

    <nav>

      <a href="/">
        Home
      </a>

      {hasRole("admin") && (
        <a href="/admin">
          Admin
        </a>
      )}

      {hasRole(
        "admin",
        "manager"
      ) && (
        <a href="/reports">
          Reports
        </a>
      )}

    </nav>

  );
}
```

***

# Admin vs Manager Buttons

```jsx
function UserActions() {

  const {
    hasRole
  } = useAuth();

  return (

    <>
      {hasRole("admin") && (
        <button>
          Delete User
        </button>
      )}

      {hasRole(
        "admin",
        "manager"
      ) && (
        <button>
          Export Report
        </button>
      )}
    </>

  );
}
```

### Result

```text
Admin
 ├─ Delete User ✅
 └─ Export Report ✅

Manager
 ├─ Delete User ❌
 └─ Export Report ✅
```

***

# Enterprise-Style Permission Matrix

```jsx
const permissions = {
  admin: [
    "deleteUser",
    "editUser",
    "viewReports"
  ],

  manager: [
    "viewReports"
  ],

  employee: [
    "viewProfile"
  ]
};
```

Helper:

```jsx
function canAccess(
  user,
  permission
) {

  return user.roles.some(
    role =>
      permissions[role]
        ?.includes(
          permission
        )
  );
}
```

Usage:

```jsx
{
  canAccess(
    user,
    "deleteUser"
  ) && (
    <button>
      Delete
    </button>
  );
}
```

***

# Senior React Interview Answer

```text
Authentication
→ Identifies the user.

Authorization
→ Determines access rights.

Roles
→ Groups of permissions such as
   admin, manager, and employee.

ProtectedRoute
→ Restricts route access based on roles.

Conditional Rendering
→ Shows or hides UI elements depending
   on permissions contained in JWT claims.
```

A scalable enterprise approach is to store user roles in `AuthContext`, implement role-aware `ProtectedRoute` components, and centralise permission checks via a helper such as `hasRole()` or `canAccess()`. Role-based access control and protected-route patterns are reflected in the enterprise documentation found in your environment.


The enterprise documentation in your environment references **Role-Based Access Control (RBAC)**, protected routes, and role-scoped dashboards, which aligns with the React patterns below.

# 1. ProtectedRoute with Multiple Roles

Instead of checking a single role, allow access if the user has **any** of the required roles.

## ProtectedRoute.jsx

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({
  children,
  allowedRoles = []
}) {

  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission =
    allowedRoles.some(role =>
      user.roles.includes(role)
    );

  if (!hasPermission) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

## Route Configuration

```jsx
<Routes>

  <Route
    path="/admin"
    element={
      <ProtectedRoute
        allowedRoles={["admin"]}
      >
        <AdminPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute
        allowedRoles={[
          "admin",
          "manager"
        ]}
      >
        <ReportsPage />
      </ProtectedRoute>
    }
  />

</Routes>
```

***

# 2. Dynamically Update Roles in AuthContext

A common enterprise pattern is to refresh roles from:

```text
JWT Claims
/me API
SSO Provider
```

## AuthContext.jsx

```jsx
import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext();

export const useAuth =
  () => useContext(AuthContext);

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState({
      id: 101,
      name: "Sudhir",
      roles: ["manager"]
    });

  const updateRoles =
    (roles) => {

      setUser(prev => ({
        ...prev,
        roles
      }));
    };

  const hasRole =
    (...roles) =>
      roles.some(role =>
        user.roles.includes(role)
      );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateRoles,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

***

## Promote User to Admin

```jsx
function AdminTools() {

  const { updateRoles } =
    useAuth();

  const promoteUser = () => {

    updateRoles([
      "admin",
      "manager"
    ]);
  };

  return (
    <button
      onClick={promoteUser}
    >
      Make Admin
    </button>
  );
}
```

***

# 3. UI Rendering for Admin and Manager

Suppose:

```jsx
const user = {
  roles: [
    "admin",
    "manager"
  ]
};
```

***

## Role Helper

```jsx
const hasRole =
  (...roles) =>
    roles.some(role =>
      user.roles.includes(role)
    );
```

***

## Dashboard Buttons

```jsx
function DashboardActions() {

  const { hasRole } =
    useAuth();

  return (

    <div>

      {/* Admin Only */}
      {hasRole("admin") && (
        <button>
          Delete User
        </button>
      )}

      {/* Admin + Manager */}
      {hasRole(
        "admin",
        "manager"
      ) && (
        <button>
          Export Report
        </button>
      )}

      {/* Manager Only */}
      {hasRole(
        "manager"
      ) &&
      !hasRole(
        "admin"
      ) && (
        <button>
          Team Dashboard
        </button>
      )}

    </div>

  );
}
```

***

## Output Examples

### Admin User

```json
{
  "roles": ["admin"]
}
```

Visible:

```text
✅ Delete User
✅ Export Report
❌ Team Dashboard
```

***

### Manager User

```json
{
  "roles": ["manager"]
}
```

Visible:

```text
❌ Delete User
✅ Export Report
✅ Team Dashboard
```

***

### Admin + Manager

```json
{
  "roles": [
    "admin",
    "manager"
  ]
}
```

Visible:

```text
✅ Delete User
✅ Export Report
✅ Team Dashboard
```

***

# Senior React Interview Pattern

```text
JWT
 ↓
AuthContext
 ↓
user.roles

ProtectedRoute
 ↓
Route Authorization

hasRole()
 ↓
Conditional Rendering

Admin
Manager
Employee
```

This separates:

```text
Authentication → User Logged In

Authorization → What User Can Access

RBAC → Which Roles Grant Access
```

which is the most scalable approach for enterprise React applications.


Below is a common **production React RBAC (Role-Based Access Control)** implementation.

***

# 1. Update Roles Dynamically After Login

Typically the backend returns roles after authentication.

## Login Response

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": 101,
    "name": "Sudhir",
    "roles": ["manager"]
  }
}
```

## AuthContext

```jsx
import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext();

export const useAuth =
  () => useContext(AuthContext);

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const login =
    async (email, password) => {

      const response =
        await api.login(
          email,
          password
        );

      setUser(
        response.user
      );
    };

  const updateRoles =
    (roles) => {

      setUser(prev => ({
        ...prev,
        roles
      }));
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        updateRoles
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

***

## Promote User

```jsx
const {
  updateRoles
} = useAuth();

updateRoles([
  "admin",
  "manager"
]);
```

Before:

```json
["manager"]
```

After:

```json
["admin", "manager"]
```

***

# 2. Role-Based Route Redirection

User:

```json
{
  "roles": ["manager"]
}
```

Route:

```jsx
<ProtectedRoute
  allowedRoles={[
    "admin"
  ]}
>
  <AdminPage />
</ProtectedRoute>
```

***

## ProtectedRoute

```jsx
import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "./AuthContext";

function ProtectedRoute({
  allowedRoles,
  children
}) {

  const {
    user
  } = useAuth();

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const canAccess =
    allowedRoles.some(
      role =>
        user.roles.includes(
          role
        )
    );

  if (!canAccess) {

    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return children;
}
```

***

## Flow

```text
Unauthenticated
      ↓
/login

Authenticated
but no role
      ↓
/403

Authenticated
and role allowed
      ↓
Protected Page
```

***

# 3. UI Rendering for User with No Roles

Sometimes new users exist but have no assigned permissions.

Example:

```json
{
  "id": 101,
  "name": "Sudhir",
  "roles": []
}
```

***

## Dashboard

```jsx
function Dashboard() {

  const {
    user
  } = useAuth();

  if (
    !user.roles.length
  ) {

    return (

      <div>

        <h2>
          Access Pending
        </h2>

        <p>
          Your account has
          been created,
          but no roles have
          been assigned yet.
        </p>

      </div>

    );
  }

  return (
    <RoleBasedUI />
  );
}
```

***

# Admin + Manager UI

```jsx
function RoleBasedUI() {

  const {
    user
  } = useAuth();

  const hasRole =
    (...roles) =>
      roles.some(role =>
        user.roles.includes(
          role
        )
      );

  return (

    <>
      {hasRole("admin") && (

        <button>
          Delete User
        </button>

      )}

      {hasRole(
        "admin",
        "manager"
      ) && (

        <button>
          Export Report
        </button>

      )}

      {hasRole(
        "manager"
      ) && (

        <button>
          Team Dashboard
        </button>

      )}
    </>

  );
}
```

***

# Output Examples

### Admin

```json
{
  "roles": ["admin"]
}
```

Visible:

```text
✅ Delete User
✅ Export Report
❌ Team Dashboard
```

***

### Manager

```json
{
  "roles": ["manager"]
}
```

Visible:

```text
❌ Delete User
✅ Export Report
✅ Team Dashboard
```

***

### Admin + Manager

```json
{
  "roles": [
    "admin",
    "manager"
  ]
}
```

Visible:

```text
✅ Delete User
✅ Export Report
✅ Team Dashboard
```

***

### No Roles

```json
{
  "roles": []
}
```

Visible:

```text
Access Pending
Please contact administrator
```

***

# Senior React Interview Answer

```text
Authentication
→ User is logged in.

Authorisation
→ User has required permissions.

Roles
→ Stored in AuthContext or JWT claims.

ProtectedRoute
→ Redirects unauthenticated users to Login
   and unauthorised users to 403.

Conditional Rendering
→ Shows UI elements based on roles
   such as admin, manager, or employee.

No Roles
→ Show Access Pending state and
   restrict protected functionality.
```

This pattern scales well for large React applications using JWT, Context API, Redux, React Router, and RBAC.


The enterprise documentation in your environment references authentication, role-based access control (RBAC), role-scoped dashboards, and protected routes, which is the same pattern used below.

# 1. Update Roles After Token Refresh

A common scenario is:

```text
Initial Login
    ↓
roles = ["manager"]

Admin changes permissions
    ↓

Refresh Token API
    ↓

New Access Token
    ↓

roles = ["admin", "manager"]
```

## Refresh Response

```json
{
  "accessToken": "new-jwt-token",
  "user": {
    "id": 101,
    "name": "Sudhir",
    "roles": ["admin", "manager"]
  }
}
```

## AuthContext

```jsx
const AuthContext =
  createContext();

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const refreshAuth =
    async () => {

      const response =
        await api.refreshToken();

      const {
        accessToken,
        user
      } = response.data;

      // Update token
      setAccessToken(
        accessToken
      );

      // Update roles
      setUser(user);
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        refreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

After refresh:

```text
Old Roles
["manager"]

↓

New Roles
["admin", "manager"]
```

UI automatically re-renders.

***

# 2. Redirect Logic for Unauthorized Users

Typically there are three states:

```text
1. Not Logged In
2. Logged In But No Permission
3. Logged In And Allowed
```

## ProtectedRoute

```jsx
import {
  Navigate
} from "react-router-dom";

function ProtectedRoute({
  allowedRoles,
  children
}) {

  const { user } =
    useAuth();

  // Not authenticated
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const hasRole =
    allowedRoles.some(role =>
      user.roles.includes(role)
    );

  // Authenticated but forbidden
  if (!hasRole) {

    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return children;
}
```

***

## Route Behaviour

### User Not Logged In

```text
/admin
   ↓
/login
```

### User Logged In

```json
{
  "roles": ["employee"]
}
```

Trying:

```text
/admin
```

Result:

```text
403 Access Denied
```

***

### User Logged In

```json
{
  "roles": ["admin"]
}
```

Trying:

```text
/admin
```

Result:

```text
Admin Dashboard
```

***

# 3. Role-Based Redirect After Login

Some applications redirect users to different dashboards depending on their role. This aligns with role-based dashboard concepts described in the enterprise documentation.

```jsx
function redirectUser(user) {

  if (
    user.roles.includes(
      "admin"
    )
  ) {

    return "/admin-dashboard";
  }

  if (
    user.roles.includes(
      "manager"
    )
  ) {

    return "/manager-dashboard";
  }

  return "/dashboard";
}
```

Usage:

```jsx
const path =
  redirectUser(user);

navigate(path);
```

***

# Complete Flow

```text
Access Token Expired
        ↓
Refresh API
        ↓
New Token
        ↓
Updated Roles
        ↓
AuthContext Updated
        ↓
ProtectedRoute Re-evaluates
        ↓
User Gets New Permissions
```

# Senior React Interview Answer

> After a successful token refresh, the frontend should update both the access token and the user information (including roles) stored in AuthContext or Redux. Protected routes should first verify authentication and then verify authorisation by checking whether the user's roles match the required roles. Unauthenticated users should be redirected to the login page, while authenticated users without sufficient permissions should be redirected to an access-denied (403) page. This approach supports dynamic role changes without requiring the user to log out and log back in.


Role changes are common in enterprise applications. A user might log in as a **Manager**, and after a token refresh or profile refresh, be granted or lose roles such as **Admin**. Applications should update `AuthContext`, automatically re-render the UI, and re-evaluate protected routes. Role-based access control (RBAC) and protected-route patterns are reflected in the authentication and authorisation documentation found in your environment.

# 1. Remove a Role in AuthContext

## AuthContext

```jsx
import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext();

export const useAuth =
  () => useContext(AuthContext);

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState({
      id: 101,
      name: "Sudhir",
      roles: [
        "admin",
        "manager"
      ]
    });

  // Remove Role
  const removeRole =
    roleToRemove => {

      setUser(prev => ({
        ...prev,
        roles: prev.roles.filter(
          role =>
            role !== roleToRemove
        )
      }));
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        removeRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

***

## Usage

```jsx
const { removeRole } =
  useAuth();

removeRole("admin");
```

Before:

```json
{
  "roles": [
    "admin",
    "manager"
  ]
}
```

After:

```json
{
  "roles": [
    "manager"
  ]
}
```

React automatically re-renders.

***

# 2. Handle Role Changes Dynamically

Role changes usually arrive from:

```text
JWT Refresh
/me API
SSO Provider
Permission Service
```

## Refresh User Profile

```jsx
const refreshUser =
  async () => {

    const response =
      await api.get("/me");

    setUser(
      response.data.user
    );
  };
```

Example:

### Before

```json
{
  "roles": ["manager"]
}
```

### Backend Update

```json
{
  "roles": [
    "admin",
    "manager"
  ]
}
```

### After Refresh

```jsx
setUser(updatedUser);
```

UI automatically updates.

***

## Why This Works

```text
Backend Changes Role
        ↓
Refresh User
        ↓
AuthContext Updates
        ↓
Components Re-render
        ↓
Menus / Routes Update
```

***

# 3. Redirect After Login Based on Multiple Roles

Many enterprise applications send users to different dashboards depending on their highest-priority role. Role-based dashboards are described in the documentation found in your environment.

## Login Response

```json
{
  "name": "Sudhir",
  "roles": [
    "admin",
    "manager"
  ]
}
```

***

## Redirect Function

```jsx
function getLandingPage(
  user
) {

  if (
    user.roles.includes(
      "admin"
    )
  ) {
    return "/admin-dashboard";
  }

  if (
    user.roles.includes(
      "manager"
    )
  ) {
    return "/manager-dashboard";
  }

  if (
    user.roles.includes(
      "employee"
    )
  ) {
    return "/employee-dashboard";
  }

  return "/access-pending";
}
```

***

## Login Flow

```jsx
const login =
  async credentials => {

    const response =
      await api.login(
        credentials
      );

    const user =
      response.data.user;

    setUser(user);

    navigate(
      getLandingPage(
        user
      )
    );
  };
```

***

# Example Results

### Admin

```json
{
  "roles": ["admin"]
}
```

Redirect:

```text
/admin-dashboard
```

***

### Manager

```json
{
  "roles": ["manager"]
}
```

Redirect:

```text
/manager-dashboard
```

***

### Admin + Manager

```json
{
  "roles": [
    "admin",
    "manager"
  ]
}
```

Redirect:

```text
/admin-dashboard
```

(Admin takes priority.)

***

### No Roles

```json
{
  "roles": []
}
```

Redirect:

```text
/access-pending
```

***

# UI Rendering Example

```jsx
function DashboardActions() {

  const { user } =
    useAuth();

  return (
    <>
      {user.roles.includes(
        "admin"
      ) && (
        <button>
          Delete User
        </button>
      )}

      {user.roles.some(role =>
        [
          "admin",
          "manager"
        ].includes(role)
      ) && (
        <button>
          Export Report
        </button>
      )}
    </>
  );
}
```

### Admin

```text
✅ Delete User
✅ Export Report
```

### Manager

```text
❌ Delete User
✅ Export Report
```

### No Roles

```text
❌ Delete User
❌ Export Report
```

# Senior React Interview Answer

```text
Role changes should be driven from the backend and stored in AuthContext.

When roles change:
1. Refresh user profile or JWT claims.
2. Update AuthContext state.
3. React automatically re-renders.
4. Protected routes re-evaluate permissions.
5. Menus, buttons, and dashboards update immediately.

After login, users are typically redirected to different dashboards based on role priority (Admin → Manager → Employee). Users with no roles should be redirected to an Access Pending or 403 page until permissions are assigned.
```


Below is a **production-style React RBAC implementation**.

***

# 1. Add a Role in AuthContext

Suppose a user initially has:

```json
{
  "id": 101,
  "roles": ["manager"]
}
```

and after a token refresh the backend returns:

```json
{
  "id": 101,
  "roles": ["manager", "admin"]
}
```

## AuthContext

```jsx
import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext();

export const useAuth =
  () => useContext(AuthContext);

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState({
      id: 101,
      roles: ["manager"]
    });

  const addRole =
    role => {

      setUser(prev => ({
        ...prev,

        roles: [
          ...new Set([
            ...prev.roles,
            role
          ])
        ]
      }));
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        addRole,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

## Usage

```jsx
const { addRole } =
  useAuth();

addRole("admin");
```

Before:

```json
["manager"]
```

After:

```json
["manager", "admin"]
```

***

# 2. Handle Logout on Role Removal

Sometimes security policy requires immediate logout when a critical role is removed.

Example:

```text
Admin
 ↓
Admin Role Removed
 ↓
Logout User
```

## Remove Role

```jsx
const removeRole =
  roleToRemove => {

    setUser(prev => {

      const updatedRoles =
        prev.roles.filter(
          role =>
            role !== roleToRemove
        );

      // No roles left
      if (
        updatedRoles.length === 0
      ) {

        logout();

        return null;
      }

      return {
        ...prev,
        roles: updatedRoles
      };
    });
  };
```

***

## Alternative

Only logout if Admin role removed.

```jsx
const removeRole =
  roleToRemove => {

    setUser(prev => {

      const updatedRoles =
        prev.roles.filter(
          role =>
            role !== roleToRemove
        );

      if (
        roleToRemove ===
        "admin"
      ) {

        logout();
      }

      return {
        ...prev,
        roles: updatedRoles
      };
    });
  };
```

***

# 3. Redirect User After Losing Admin Role

User currently on:

```text
/admin-dashboard
```

Current roles:

```json
[
  "admin",
  "manager"
]
```

Backend updates:

```json
[
  "manager"
]
```

***

## Route Guard

```jsx
import {
  Navigate
} from "react-router-dom";

function AdminRoute({
  children
}) {

  const {
    user
  } = useAuth();

  const isAdmin =
    user?.roles?.includes(
      "admin"
    );

  if (!isAdmin) {

    return (
      <Navigate
        to="/manager-dashboard"
        replace
      />
    );
  }

  return children;
}
```

***

## Dynamic Redirect

```jsx
function getLandingPage(
  user
) {

  if (
    user.roles.includes(
      "admin"
    )
  ) {

    return "/admin-dashboard";
  }

  if (
    user.roles.includes(
      "manager"
    )
  ) {

    return "/manager-dashboard";
  }

  if (
    user.roles.includes(
      "employee"
    )
  ) {

    return "/employee-dashboard";
  }

  return "/access-pending";
}
```

***

## React Effect

Whenever roles change:

```jsx
const navigate =
  useNavigate();

useEffect(() => {

  navigate(
    getLandingPage(user)
  );

}, [user.roles]);
```

***

# Real Enterprise Flow

```text
User = Admin

/admin-dashboard

        ↓

Token Refresh

        ↓

Backend Returns

roles = ["manager"]

        ↓

AuthContext Updates

        ↓

ProtectedRoute Re-evaluates

        ↓

Redirect

/manager-dashboard
```

***

# Complete Example

```jsx
useEffect(() => {

  if (!user) {

    navigate("/login");
    return;
  }

  if (
    !user.roles.includes(
      "admin"
    )
  ) {

    navigate(
      getLandingPage(user)
    );
  }

}, [user]);
```

***

# Senior React Interview Answer

```text
Role changes should always originate from the backend
(JWT refresh, /me endpoint, SSO claim refresh).

When roles change:

1. Update AuthContext.
2. Re-render UI automatically.
3. Re-evaluate ProtectedRoutes.
4. Redirect users who lose access.
5. Optionally force logout if the user no longer
   has any valid roles.

Admin → Manager role downgrade should automatically
redirect the user away from admin-only screens to
their highest permitted dashboard.
```

Role-based access control (RBAC), protected routes, and role-scoped dashboards are common patterns in React applications and are also reflected in the authentication/authorisation documentation found in your environment.


When a user's roles change dynamically (for example after a token refresh, `/me` API call, or permission update), a good user experience is:

```text
Role Removed
    ↓
Show Notification
    ↓
Give Context
    ↓
Redirect User
```

This aligns with the role-based access control and protected-route patterns described in the authentication and authorisation documentation found in your environment.

# 1. Notify User Before Redirect

Suppose the user is currently on:

```text
/admin-dashboard
```

and loses:

```text
admin
```

role.

## AuthContext

```jsx
const removeRole = (
  roleToRemove
) => {

  setUser(prev => {

    const updatedRoles =
      prev.roles.filter(
        role =>
          role !== roleToRemove
      );

    if (
      roleToRemove === "admin"
    ) {

      setNotification(
        "Your administrator privileges have been removed."
      );
    }

    return {
      ...prev,
      roles: updatedRoles
    };
  });
};
```

***

## Notification Component

```jsx
function Toast({
  message
}) {

  if (!message)
    return null;

  return (
    <div className="toast">
      {message}
    </div>
  );
}
```

Result:

```text
⚠ Your administrator privileges
  have been removed.
```

***

# 2. Delayed Redirect

Allow the user to see the message.

```jsx
useEffect(() => {

  if (
    notification
  ) {

    const timer =
      setTimeout(() => {

        navigate(
          getLandingPage(
            user
          )
        );

      }, 3000);

    return () =>
      clearTimeout(
        timer
      );
  }

}, [
  notification
]);
```

Flow:

```text
Role Removed
      ↓
Toast Displayed
      ↓
3 Seconds
      ↓
Redirect
```

***

# 3. Dynamic ProtectedRoute

ProtectedRoute should automatically react when roles change.

## ProtectedRoute.jsx

```jsx
import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "./AuthContext";

function ProtectedRoute({
  allowedRoles,
  children
}) {

  const {
    user
  } = useAuth();

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const hasAccess =
    allowedRoles.some(
      role =>
        user.roles.includes(
          role
        )
    );

  if (!hasAccess) {

    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return children;
}
```

Whenever:

```jsx
setUser(...)
```

changes roles, React re-renders and `ProtectedRoute` immediately re-evaluates permissions.

***

# Example Role Change

## Before Refresh

```json
{
  "roles": [
    "admin",
    "manager"
  ]
}
```

Current page:

```text
/admin-dashboard
```

***

## Backend Response

```json
{
  "roles": [
    "manager"
  ]
}
```

***

## Auth Context Update

```jsx
setUser(
  response.data.user
);
```

***

## Result

```text
ProtectedRoute
      ↓
admin missing
      ↓
Access denied
      ↓
Redirect
```

***

# Smart Redirect Instead of 403

Rather than sending users to a generic forbidden page, redirect them to the highest role they still possess.

```jsx
function getLandingPage(
  user
) {

  if (
    user.roles.includes(
      "admin"
    )
  ) {
    return "/admin-dashboard";
  }

  if (
    user.roles.includes(
      "manager"
    )
  ) {
    return "/manager-dashboard";
  }

  if (
    user.roles.includes(
      "employee"
    )
  ) {
    return "/employee-dashboard";
  }

  return "/access-pending";
}
```

***

## Enhanced ProtectedRoute

```jsx
if (!hasAccess) {

  return (
    <Navigate
      to={
        getLandingPage(
          user
        )
      }
      replace
    />
  );
}
```

***

# Complete Enterprise Flow

```text
User On Admin Page
        ↓
Token Refresh
        ↓
Roles Updated
        ↓
Admin Role Removed
        ↓
Show Notification
        ↓
ProtectedRoute Re-runs
        ↓
Redirect To Manager Dashboard
```

# Senior React Interview Answer

> Role changes should be treated as real-time authorisation events. When a role is removed, update AuthContext, notify the user with a toast or banner, and allow ProtectedRoute to automatically re-evaluate access. If access is no longer permitted, redirect the user to their highest-authorised dashboard (for example Admin → Manager Dashboard) or to a 403/access-pending page if no valid roles remain. This ensures security while maintaining a smooth user experience.


Role-based access control (RBAC), protected routes, notifications, and role-scoped dashboards are common patterns in the authentication architecture described in your enterprise documentation.

# Example: Toast Notification Before Redirect

When a user loses the `admin` role, show a warning message before redirecting them.

## AuthContext.jsx

```jsx
const [notification, setNotification] =
  useState("");

const removeRole = (roleToRemove) => {

  setUser(prev => {

    const updatedRoles =
      prev.roles.filter(
        role => role !== roleToRemove
      );

    if (roleToRemove === "admin") {

      setNotification(
        "Your administrator access has been removed. You will be redirected."
      );
    }

    return {
      ...prev,
      roles: updatedRoles
    };
  });
};
```

***

## Toast Component

```jsx
function Toast({
  message,
  type = "warning"
}) {

  if (!message) return null;

  return (
    <div
      className={`toast ${type}`}
      role="alert"
    >
      {message}
    </div>
  );
}
```

***

## Usage

```jsx
<Toast
  message={notification}
/>
```

Result:

```text
⚠ Your administrator access has been removed.
⚠ You will be redirected.
```

***

# Delayed Redirect After Role Change

## Helper Function

```jsx
function getLandingPage(user) {

  if (user.roles.includes("admin")) {
    return "/admin-dashboard";
  }

  if (user.roles.includes("manager")) {
    return "/manager-dashboard";
  }

  if (user.roles.includes("employee")) {
    return "/employee-dashboard";
  }

  return "/access-pending";
}
```

***

## Role Change Effect

```jsx
import {
  useNavigate
} from "react-router-dom";

const navigate =
  useNavigate();

useEffect(() => {

  if (!notification) return;

  const timer =
    setTimeout(() => {

      navigate(
        getLandingPage(user),
        { replace: true }
      );

    }, 3000);

  return () =>
    clearTimeout(timer);

}, [
  notification,
  user,
  navigate
]);
```

***

# Complete Flow

```text
Admin User
      ↓
Role Removed
      ↓
AuthContext Updated
      ↓
Toast Appears

"Administrator access removed"

      ↓
Wait 3 Seconds
      ↓
Redirect
      ↓
Manager Dashboard
```

***

# ProtectedRoute Handling Dynamic Role Changes

```jsx
function ProtectedRoute({
  allowedRoles,
  children
}) {

  const {
    user
  } = useAuth();

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const hasAccess =
    allowedRoles.some(
      role =>
        user.roles.includes(role)
    );

  if (!hasAccess) {

    return (
      <Navigate
        to={getLandingPage(user)}
        replace
      />
    );
  }

  return children;
}
```

### Example

Before refresh:

```json
{
  "roles": [
    "admin",
    "manager"
  ]
}
```

After refresh:

```json
{
  "roles": [
    "manager"
  ]
}
```

User is currently on:

```text
/admin-dashboard
```

Result:

```text
Toast Notification
       ↓
ProtectedRoute Re-runs
       ↓
Redirect
       ↓
/manager-dashboard
```

This provides a better user experience than an immediate redirect because the user understands **why** access changed while still enforcing security controls.


Here's a **production-ready AuthContext** that demonstrates:

✅ Login  
✅ Logout  
✅ Role Updates  
✅ Role Removal Notification  
✅ Toast Message  
✅ Delayed Redirect  
✅ Dynamic Role Refresh  
✅ RBAC Helper Methods

***

# AuthContext.jsx

```jsx
import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

const AuthContext =
  createContext();

export const useAuth =
  () => useContext(AuthContext);

export function AuthProvider({
  children
}) {

  const navigate =
    useNavigate();

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [toast,
         setToast] =
    useState(null);

  //----------------------------------
  // Login
  //----------------------------------

  const login =
    async (email, password) => {

      const response =
        await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email,
            password
          }),
          credentials: "include"
        });

      const data =
        await response.json();

      setUser(data.user);

      setToken(
        data.accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );
    };

  //----------------------------------
  // Logout
  //----------------------------------

  const logout =
    async () => {

      try {

        await fetch(
          "/api/logout",
          {
            method: "POST",
            credentials: "include"
          }
        );

      } catch (error) {

        console.error(error);
      }

      setUser(null);

      setToken(null);

      localStorage.clear();

      navigate(
        "/login",
        { replace: true }
      );
    };

  //----------------------------------
  // Role Helpers
  //----------------------------------

  const hasRole =
    (...roles) =>
      roles.some(role =>
        user?.roles?.includes(
          role
        )
      );

  //----------------------------------
  // Add Role
  //----------------------------------

  const addRole =
    role => {

      setUser(prev => ({
        ...prev,
        roles: [
          ...new Set([
            ...prev.roles,
            role
          ])
        ]
      }));
    };

  //----------------------------------
  // Remove Role
  //----------------------------------

  const removeRole =
    roleToRemove => {

      setUser(prev => {

        const updatedRoles =
          prev.roles.filter(
            role =>
              role !==
              roleToRemove
          );

        if (
          roleToRemove ===
          "admin"
        ) {

          setToast({
            type:
              "warning",
            message:
              "Administrator access removed. Redirecting..."
          });
        }

        return {
          ...prev,
          roles:
            updatedRoles
        };
      });
    };

  //----------------------------------
  // Get Landing Page
  //----------------------------------

  const getLandingPage =
    currentUser => {

      if (
        currentUser?.roles?.includes(
          "admin"
        )
      ) {
        return (
          "/admin-dashboard"
        );
      }

      if (
        currentUser?.roles?.includes(
          "manager"
        )
      ) {
        return (
          "/manager-dashboard"
        );
      }

      if (
        currentUser?.roles?.includes(
          "employee"
        )
      ) {
        return (
          "/employee-dashboard"
        );
      }

      return (
        "/access-pending"
      );
    };

  //----------------------------------
  // Redirect After Role Change
  //----------------------------------

  useEffect(() => {

    if (
      !toast ||
      !user
    ) {
      return;
    }

    const timer =
      setTimeout(() => {

        navigate(
          getLandingPage(
            user
          ),
          {
            replace: true
          }
        );

        setToast(
          null
        );

      }, 3000);

    return () =>
      clearTimeout(
        timer
      );

  }, [
    toast,
    user,
    navigate
  ]);

  //----------------------------------
  // Refresh User
  //----------------------------------

  const refreshUser =
    async () => {

      try {

        const response =
          await fetch(
            "/api/me",
            {
              credentials:
                "include"
            }
          );

        const data =
          await response.json();

        setUser(
          data.user
        );

      } catch (error) {

        console.error(error);
      }
    };

  //----------------------------------

  return (

    <AuthContext.Provider
      value={{
        user,
        token,

        login,
        logout,

        addRole,
        removeRole,

        refreshUser,

        hasRole
      }}
    >
      {children}

      {toast && (

        <Toast
          type={
            toast.type
          }
          message={
            toast.message
          }
        />

      )}

    </AuthContext.Provider>

  );
}
```

***

# Toast Component

```jsx
function Toast({
  message,
  type
}) {

  return (

    <div
      className={`toast ${type}`}
      role="alert"
    >
      {message}
    </div>

  );
}
```

***

# ProtectedRoute

```jsx
import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "./AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles
}) {

  const {
    user
  } = useAuth();

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const allowed =
    allowedRoles.some(
      role =>
        user.roles.includes(
          role
        )
    );

  if (!allowed) {

    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return children;
}
```

***

# Dynamic Role Change Flow

```text
User
-----------
["admin","manager"]

Current Page
-----------
/admin-dashboard

Backend Refresh
-----------
["manager"]

AuthContext Updated
-----------
removeRole("admin")

Toast Appears
-----------
"Administrator access removed"

3 Seconds
-----------
Redirect

/manager-dashboard
```

***

# Senior React Interview Answer

A production RBAC solution should:

```text
✔ Store user + roles in AuthContext
✔ Update roles from token refresh or /me API
✔ Provide hasRole() helper
✔ Re-evaluate ProtectedRoutes automatically
✔ Notify users when permissions change
✔ Redirect to the highest allowed dashboard
✔ Logout users if no valid roles remain
✔ Refresh permissions dynamically without reload
```

This pattern works well with React Router, JWT Authentication, Context API, Redux, and enterprise role-based access control implementations.


For a production React application, I recommend using **react-hot-toast** or **react-toastify** because they support accessibility, positioning, custom themes, and auto-dismiss behaviour.

***

# 1. Integrate Toast into a React App

## Install

```bash
npm install react-hot-toast
```

***

## App.jsx

```jsx
import { Toaster } from "react-hot-toast";
import Dashboard from "./Dashboard";

function App() {
  return (
    <>
      <Dashboard />

      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
}

export default App;
```

***

## Trigger Toast

```jsx
import toast from "react-hot-toast";

function Dashboard() {

  const handleRoleRemoved =
    () => {

      toast.error(
        "Administrator access removed"
      );
    };

  return (
    <button
      onClick={
        handleRoleRemoved
      }
    >
      Remove Role
    </button>
  );
}
```

***

# 2. Custom Toast Styles

## Success Toast

```jsx
toast.success(
  "Role Updated",
  {
    duration: 4000,

    style: {
      background: "#22c55e",
      color: "#fff",
      padding: "16px"
    }
  }
);
```

***

## Error Toast

```jsx
toast.error(
  "Admin Access Removed",
  {
    duration: 5000,

    style: {
      background: "#ef4444",
      color: "white"
    }
  }
);
```

***

## Warning Toast

```jsx
toast(
  "Your permissions changed",
  {
    icon: "⚠️",

    style: {
      background: "#f59e0b",
      color: "#fff"
    }
  }
);
```

***

# 3. Toast with Role Removal + Delayed Redirect

## AuthContext

```jsx
import toast
  from "react-hot-toast";

const removeRole =
  roleToRemove => {

    const updatedRoles =
      user.roles.filter(
        role =>
          role !== roleToRemove
      );

    setUser({
      ...user,
      roles: updatedRoles
    });

    toast.error(
      "Admin access removed. Redirecting..."
    );

    setTimeout(() => {

      navigate(
        getLandingPage({
          ...user,
          roles:
            updatedRoles
        })
      );

    }, 3000);
  };
```

***

## Flow

```text
Admin Role Removed
        ↓
Toast Appears
        ↓
Wait 3 Seconds
        ↓
Redirect Manager Dashboard
```

***

# 4. Test Role Change Notifications

## Dashboard Component

```jsx
function Dashboard() {

  const {
    removeRole
  } = useAuth();

  return (
    <button
      onClick={() =>
        removeRole(
          "admin"
        )
      }
    >
      Remove Admin
    </button>
  );
}
```

***

# Jest + React Testing Library

```jsx
import {
  render,
  screen,
  fireEvent
} from "@testing-library/react";

test(
  "shows role removal toast",
  () => {

    render(<Dashboard />);

    fireEvent.click(
      screen.getByText(
        "Remove Admin"
      )
    );

    expect(
      screen.getByText(
        /admin access removed/i
      )
    ).toBeInTheDocument();

  }
);
```

***

# Test Redirect After Delay

```jsx
jest.useFakeTimers();

test(
  "redirects after role removal",
  () => {

    removeRole("admin");

    jest.advanceTimersByTime(
      3000
    );

    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/manager-dashboard"
    );

  }
);
```

***

# Enterprise Production Pattern

```text
JWT Refresh
     ↓
Role Change
     ↓
AuthContext Updated
     ↓
Toast Notification
     ↓
ProtectedRoute Re-check
     ↓
Redirect
     ↓
Dashboard Updated
```

***

# Senior React Interview Answer

```text
When a user's roles change dynamically, the frontend should:

1. Update AuthContext state.
2. Display a toast notification explaining the change.
3. Re-evaluate ProtectedRoute permissions.
4. Redirect the user to the highest-authorised route after a short delay.
5. Verify this behaviour using React Testing Library and fake timers.

This provides both security and a good user experience because users understand why access changed before navigation occurs.
```
