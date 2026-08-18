To configure Keycloak realm roles and map them to fine-grained UI permissions across micro-frontends (MFEs), decouple **Identity Roles** (what Keycloak assigns, e.g., `realm-admin`, `support-tier-2`) from **Domain Permissions** (what specific UI buttons or routes need, e.g., `billing:refund`, `user:delete`).

Hardcoding raw Keycloak roles across disparate MFEs creates brittle coupling; when backend roles change, every MFE breaks. Instead, parse Keycloak tokens at the **App Shell**, translate them through a **Permission Matrix / Engine**, and pass unified permissions down to child MFEs.

---

### Step 1: Configure Keycloak Realm Roles & Custom Token Claims

#### 1. Define Realm & Client Roles in Keycloak

1. Go to **Keycloak Admin Console** $\rightarrow$ select your **Realm**.
2. Navigate to **Realm Roles** $\rightarrow$ Click **Create Role** (e.g., `FINANCE_ADMIN`, `SUPPORT_AGENT`, `AUDITOR`).
3. (Optional) Under **Clients** $\rightarrow$ select your client (e.g., `app-shell-client`) $\rightarrow$ **Roles** tab to create client-specific roles if access is scoped per micro-frontend.

#### 2. Add Fine-Grained Permissions via Keycloak Protocol Mappers

You can either map roles to permissions on the client side or have Keycloak embed explicit permission arrays directly into the JWT via a **Script Mapper** or **User Attribute Mapper**.

To map user attributes/groups directly to a `permissions` claim:

1. Navigate to **Clients** $\rightarrow$ select your client $\rightarrow$ **Client Scopes** / **Mappers**.
2. Add a Mapper of type **User Attribute** or **Hardcoded Claim**:

* **Name:** `ui-permissions`
* **Token Claim Name:** `permissions`
* **Claim JSON Type:** `JSON` / `String (multivalued)`
* **Add to ID Token & Access Token:** `ON`

The resulting JWT payload will look like this:

```json
{
  "sub": "usr_9918239",
  "email": "sarah.chen@example.com",
  "realm_access": {
    "roles": ["FINANCE_ADMIN", "default-roles-myrealm"]
  },
  "resource_access": {
    "billing-service": {
      "roles": ["invoice-manager"]
    }
  },
  "permissions": ["billing:view", "billing:export", "billing:refund", "users:read"]
}

```

---

### Step 2: Create the Shared Permissions Contract (`@org/permissions-core`)

Define a centralized type-safe contract shared across all MFEs via an npm library or Module Federation shared scope.

```typescript
// packages/permissions-core/src/types.ts

// 1. All discrete UI permissions available across the suite
export type UIPermission =
  // Billing MFE
  | 'billing:view'
  | 'billing:create-invoice'
  | 'billing:refund'
  // User Management MFE
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  // Analytics MFE
  | 'analytics:view'
  | 'analytics:export-raw';

// 2. Client-side Role-to-Permission Mapping Matrix
export const ROLE_PERMISSION_MATRIX: Record<string, UIPermission[]> = {
  FINANCE_ADMIN: [
    'billing:view',
    'billing:create-invoice',
    'billing:refund',
    'analytics:view',
    'analytics:export-raw',
  ],
  SUPPORT_AGENT: [
    'billing:view',
    'billing:refund',
    'users:read',
  ],
  AUDITOR: [
    'billing:view',
    'users:read',
    'analytics:view',
  ],
};

```

---

### Step 3: App Shell — Token Parsing & Permission Engine

The App Shell inspects the Keycloak token, resolves all applicable permissions, and creates a lightweight `PermissionContext`.

```typescript
// shell/src/auth/permissionEngine.ts
import { jwtDecode } from 'jwt-decode';
import { UIPermission, ROLE_PERMISSION_MATRIX } from '@org/permissions-core';

interface KeycloakTokenPayload {
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
  permissions?: UIPermission[]; // If pre-mapped by Keycloak
}

export function extractPermissions(accessToken: string): Set<UIPermission> {
  const permissions = new Set<UIPermission>();

  try {
    const decoded = jwtDecode<KeycloakTokenPayload>(accessToken);

    // 1. Direct permissions from token claim (if Keycloak provides them)
    if (Array.isArray(decoded.permissions)) {
      decoded.permissions.forEach((p) => permissions.add(p));
    }

    // 2. Derive permissions from Realm Roles
    const realmRoles = decoded.realm_access?.roles || [];
    realmRoles.forEach((role) => {
      const mappedPerms = ROLE_PERMISSION_MATRIX[role] || [];
      mappedPerms.forEach((p) => permissions.add(p));
    });

    // 3. Derive permissions from Client/Resource Roles
    const resourceAccess = decoded.resource_access || {};
    Object.values(resourceAccess).forEach((resource) => {
      resource.roles.forEach((role) => {
        const mappedPerms = ROLE_PERMISSION_MATRIX[role] || [];
        mappedPerms.forEach((p) => permissions.add(p));
      });
    });
  } catch (err) {
    console.error('Failed to parse permissions from token:', err);
  }

  return permissions;
}

```

---

### Step 4: Expose Context & Custom Directives for Child MFEs

#### A. The React Authorization Provider (`PermissionsProvider.tsx`)

```tsx
// packages/permissions-core/src/PermissionsProvider.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { UIPermission } from './types';

interface PermissionsContextType {
  hasPermission: (permission: UIPermission | UIPermission[]) => boolean;
  hasAllPermissions: (permissions: UIPermission[]) => boolean;
  permissions: Set<UIPermission>;
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

export const PermissionsProvider: React.FC<{
  permissions: Set<UIPermission>;
  children: React.ReactNode;
}> = ({ permissions, children }) => {
  const api = useMemo<PermissionsContextType>(() => ({
    hasPermission: (required) => {
      if (Array.isArray(required)) {
        return required.some((p) => permissions.has(p));
      }
      return permissions.has(required);
    },
    hasAllPermissions: (required) => {
      return required.every((p) => permissions.has(p));
    },
    permissions,
  }), [permissions]);

  return (
    <PermissionsContext.Provider value={api}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error('usePermissions must be used within PermissionsProvider');
  return ctx;
};

```

#### B. Granular Declarative Component (`<Can/>`)

```tsx
// packages/permissions-core/src/Can.tsx
import React from 'react';
import { UIPermission } from './types';
import { usePermissions } from './PermissionsProvider';

interface CanProps {
  perform: UIPermission | UIPermission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ perform, requireAll = false, fallback = null, children }: CanProps) {
  const { hasPermission, hasAllPermissions } = usePermissions();

  const isAllowed = Array.isArray(perform) && requireAll
    ? hasAllPermissions(perform)
    : hasPermission(perform);

  return isAllowed ? <>{children}</> : <>{fallback}</>;
}

```

---

### Step 5: Consuming Permissions Inside Child MFEs

Child MFEs receive either the parsed `Set<UIPermission>` or access token via Module Federation props and render features conditionally.

#### Granular Button / Action Guarding (Billing MFE)

```tsx
// billing-mfe/src/components/InvoiceActions.tsx
import React from 'react';
import { Can } from '@org/permissions-core';

export function InvoiceActions({ invoiceId }: { invoiceId: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => window.print()}>Print</button>

      {/* Only visible to users with "billing:refund" permission */}
      <Can
        perform="billing:refund"
        fallback={<span className="text-muted">Refund disabled</span>}
      >
        <button
          className="btn-danger"
          onClick={() => triggerRefund(invoiceId)}
        >
          Issue Full Refund
        </button>
      </Can>

      {/* Multi-permission check */}
      <Can perform={['analytics:export-raw', 'billing:create-invoice']} requireAll>
        <button onClick={() => triggerAuditLog(invoiceId)}>
          Generate Detailed Audit
        </button>
      </Can>
    </div>
  );
}

```

#### Route-Level Sub-View Guarding Inside Child Memory Routers

```tsx
// billing-mfe/src/routes/BillingRouter.tsx
import React from 'react';
import { usePermissions } from '@org/permissions-core';
import { RefundDashboard } from './RefundDashboard';
import { InvoicesList } from './InvoicesList';
import { AccessDenied } from './AccessDenied';

export function BillingRouter({ currentPath }: { currentPath: string }) {
  const { hasPermission } = usePermissions();

  if (currentPath === '/refunds') {
    if (!hasPermission('billing:refund')) {
      return <AccessDenied message="You do not have permission to access the Refunds console." />;
    }
    return <RefundDashboard />;
  }

  return <InvoicesList />;
}

```

---

### Architecture Summary Checklist

| Component                 | Responsibility                                                                                                   | Boundary Rule                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Keycloak**              | Assigns user identity, Realm Roles, and Groups.                                                                  | Knows nothing about React components or CSS.                                              |
| **App Shell**             | Decodes Keycloak JWT, extracts roles, derives `Set<UIPermission>`, and wraps remotes with `PermissionsProvider`. | Owns token refresh and global redirect guards.                                            |
| **Child MFEs**            | Consumes `<Can perform="..."/>` and `usePermissions()`.                                                          | Never hardcodes raw Keycloak role strings (e.g., `realm-admin`).                          |
| **Backend Microservices** | **Enforces strict authorization** on all incoming requests using the raw JWT claims.                             | UI hiding is purely for user experience; backend APIs must independently validate claims. |
