Implementing Role-Based Access Control (RBAC) in React requires a centralized permissions model that controls access at both the **Route level** (page views) and the **Component/UI level** (buttons, actions, navigation links).

---

### 1. Define the Roles & Permissions Architecture

Instead of hardcoding roles (`admin`, `editor`, `viewer`) directly inside components, decouple roles from permissions. Map each role to a set of granular permission strings (e.g., `posts:read`, `posts:write`, `users:delete`).

```typescript
// types/auth.ts

export type Role = 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';

export type Permission = 
  | 'posts:read'
  | 'posts:create'
  | 'posts:delete'
  | 'users:manage';

// Role-to-Permissions Matrix
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ['posts:read', 'posts:create', 'posts:delete', 'users:manage'],
  EDITOR: ['posts:read', 'posts:create'],
  VIEWER: ['posts:read'],
};

export interface User {
  id: string;
  name: string;
  role: Role;
  // Permissions can also come directly from the JWT/API payload
  permissions?: Permission[]; 
}

```

---

### 2. Create the Auth & Permission Context

Manage the authenticated user state and expose helper functions (`hasPermission`, `hasRole`) via a custom hook.

```tsx
// context/AuthContext.tsx

import React, { createContext, useContext, useState, useMemo } from 'react';
import { User, Permission, Role, ROLE_PERMISSIONS } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roles: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Check direct permissions array or derive from user role
    const userPermissions = user.permissions || ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  // Check if user matches a specific role or set of roles
  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user) return false;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    return requiredRoles.includes(user.role);
  };

  const value = useMemo(
    () => ({ user, login, logout, hasPermission, hasRole }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

```

---

### 3. Route Guard for Page-Level Protection

Create a wrapper around React Router routes to redirect unauthorized users or show a 403 Forbidden page.

```tsx
// components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Permission, Role } from '../types/auth';

interface ProtectedRouteProps {
  requiredPermission?: Permission;
  requiredRoles?: Role[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  requiredRoles,
  redirectTo = '/unauthorized',
}) => {
  const { user, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  // 1. Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace />;
  }

  // 3. Check role requirement
  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render child routes
  return <Outlet />;
};

```

#### Configuring Routes with React Router v6+

```tsx
// AppRoutes.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CreatePost from './pages/CreatePost';
import Unauthorized from './pages/Unauthorized';

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected Section: Requires at least 'posts:read' */}
      <Route element={<ProtectedRoute requiredPermission="posts:read" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Editor & Admin Route */}
      <Route element={<ProtectedRoute requiredPermission="posts:create" />}>
        <Route path="/posts/create" element={<CreatePost />} />
      </Route>

      {/* Admin Only Route */}
      <Route element={<ProtectedRoute requiredRoles={['SUPER_ADMIN']} />}>
        <Route path="/users" element={<UserManagement />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

```

---

### 4. Component-Level Access Control (`<Can>` Component)

To conditionally render UI elements (like a "Delete" button) based on permissions, implement a declarative `<Can>` component wrapper or hook.

```tsx
// components/Can.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Permission, Role } from '../types/auth';

interface CanProps {
  perform?: Permission;
  role?: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({
  perform,
  role,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasRole } = useAuth();

  let isAllowed = true;

  if (perform) {
    isAllowed = isAllowed && hasPermission(perform);
  }

  if (role) {
    isAllowed = isAllowed && hasRole(role);
  }

  return isAllowed ? <>{children}</> : <>{fallback}</>;
};

```

#### Usage in Feature Components

```tsx
// pages/PostList.tsx

import { Can } from '../components/Can';

export const PostList = () => {
  return (
    <div>
      <h2>Posts</h2>

      {/* Rendered only if user has 'posts:create' permission */}
      <Can perform="posts:create">
        <button>Create New Post</button>
      </Can>

      <div className="post-item">
        <h3>Sample Post</h3>
        
        {/* Rendered only if user has 'posts:delete' permission */}
        <Can perform="posts:delete">
          <button style={{ color: 'red' }}>Delete Post</button>
        </Can>
      </div>
    </div>
  );
};

```

---

### 5. Filter Navigation Menus Dynamically

Filter navigation links dynamically in sidebars or headers so users only see menu options they have access to.

```tsx
// components/SidebarNavigation.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Permission } from '../types/auth';

interface NavItem {
  label: string;
  path: string;
  permission?: Permission;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', permission: 'posts:read' },
  { label: 'Create Post', path: '/posts/create', permission: 'posts:create' },
  { label: 'User Management', path: '/users', permission: 'users:manage' },
];

export const SidebarNavigation = () => {
  const { hasPermission } = useAuth();

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <nav>
      <ul>
        {visibleNavItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

```

---

### Architectural Rules & Best Practices

1. **Frontend RBAC is UX Only:** Hiding a button or blocking a route in React prevents accidental navigation, but it **does not provide security**. Every restricted API endpoint must independently verify roles and permissions on the backend (e.g., verifying JWT claims/scopes).
2. **Prefer Permissions over Role Strings:** Checking `hasPermission('users:manage')` is more scalable than checking `user.role === 'ADMIN'`. If business requirements change and an `HR_MANAGER` role is added later, you only update the central `ROLE_PERMISSIONS` matrix rather than updating dozens of component checks.
3. **Handle Permission Hydration:** Ensure your app shows a loading spinner until auth state and user claims/permissions are fully restored from local storage or the session endpoint to avoid flashing unauthorized pages on refresh.
