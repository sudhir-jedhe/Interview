Implementing **OpenID Connect (OIDC)** and **OAuth 2.0 with PKCE (Proof Key for Code Exchange)** in a Micro-Frontend architecture requires establishing the **App Shell as the single Relying Party (RP)**.

Child MFEs must **never** initiate their own OIDC redirects, store duplicate refresh tokens, or talk directly to the Identity Provider (IdP). The App Shell handles the authentication handshake, code exchange, silent token renewal, and broadcasts session state down to child remotes.

The battle-tested standard library for this pattern is **`oidc-client-ts`** (or its React wrapper `react-oidc-context`).

---

### High-Level Architecture Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Shell (Relying Party)                       │
│  1. Inits UserManager with PKCE                                        │
│  2. Handles /auth/callback & code exchange                             │
│  3. Runs automatic silent token renewal (hidden iframe / refresh)     │
│  4. Broadcasts User / Access Token via context & custom events         │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
         (Passes Token/Claims)             (Emits auth:session-expired)
                   │                                 ▲
                   ▼                                 │
┌──────────────────────────────────────┐ ┌───────────┴───────────────────┐
│         Child MFE A (Billing)        │ │         Child MFE B (Orders)         │
│  • Reads token for API calls         │ │  • Dispatches 401 events to Shell     │
│  • Performs UI permission checks     │ │  • No OAuth credentials stored       │
└──────────────────────────────────────┘ └───────────────────────────────┘

```

---

### 1. App Shell OIDC Service Configuration (`authService.ts`)

Create a centralized OIDC manager configured with PKCE enabled (`response_type: 'code'`).

```typescript
// shell/src/auth/authService.ts
import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';

export const oidcConfig = {
  authority: 'https://auth.example.com/realms/production', // Keycloak, Auth0, Okta
  client_id: 'app-shell-spa',
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  response_type: 'code', // Mandates PKCE authorization code flow
  scope: 'openid profile email offline_access',
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: `${window.location.origin}/silent-renew.html`,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
};

export const userManager = new UserManager(oidcConfig);

// Helper functions for the Shell and Child MFEs
export async function login(redirectPath = window.location.pathname) {
  await userManager.signinRedirect({
    state: { returnUrl: redirectPath },
  });
}

export async function logout() {
  await userManager.signoutRedirect();
}

export async function getValidAccessToken(): Promise<string | null> {
  const user = await userManager.getUser();
  if (user && !user.expired) {
    return user.access_token;
  }
  return null;
}

```

---

### 2. OIDC Callback Handler (`AuthCallback.tsx`)

When the IdP redirects back to the SPA with the authorization `code` and `state`, the callback route exchanges the code using the stored PKCE code verifier and redirects the user back to their requested deep link.

```tsx
// shell/src/auth/AuthCallback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userManager } from './authService';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userManager
      .signinCallback()
      .then((user) => {
        // Retrieve original deep-link path from state, or default to root
        const returnUrl = (user?.state as any)?.returnUrl || '/';
        navigate(returnUrl, { replace: true });
      })
      .catch((err) => {
        console.error('OIDC Callback Error:', err);
        setError(err.message || 'Failed to complete authentication');
      });
  }, [navigate]);

  if (error) {
    return <div className="auth-error">Authentication failed: {error}</div>;
  }

  return <div className="auth-loading">Finalizing authentication handshake...</div>;
}

```

---

### 3. Silent Renew Helper (`public/silent-renew.html`)

For background token refresh via hidden iframe without interrupting active user workflows:

```html
<!-- shell/public/silent-renew.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Silent Renewal</title>
</head>
<body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/oidc-client-ts/3.0.1/oidc-client-ts.min.js"></script>
  <script>
    const userManager = new oidc.UserManager();
    userManager.signinSilentCallback().catch(function (error) {
      console.error('Silent renew callback error:', error);
    });
  </script>
</body>
</html>

```

---

### 4. App Shell Root Context & Event Bridge (`AuthProvider.tsx`)

The App Shell listens for OIDC lifecycle events (token expiration, user loaded, silent renew failures) and synchronizes with child MFEs using standard DOM events.

```tsx
// shell/src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'oidc-client-ts';
import { userManager, login, logout } from './authService';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial User Session Check
    userManager.getUser().then((loadedUser) => {
      if (loadedUser && !loadedUser.expired) {
        setUser(loadedUser);
      }
      setIsLoading(false);
    });

    // 2. OIDC Event Listeners
    const onUserLoaded = (loadedUser: User) => {
      setUser(loadedUser);
      // Dispatch event to child MFEs that a fresh access token is available
      window.dispatchEvent(
        new CustomEvent('auth:token-refreshed', {
          detail: { accessToken: loadedUser.access_token },
        })
      );
    };

    const onUserUnloaded = () => {
      setUser(null);
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    };

    const onSilentRenewError = (err: Error) => {
      console.warn('Silent renew failed:', err);
      // Re-trigger login flow if refresh fails
      login();
    };

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);
    userManager.events.addSilentRenewError(onSilentRenewError);

    // 3. Listen for 401 signals dispatched from Child MFEs
    const handleChildAuthFailure = () => {
      login();
    };
    window.addEventListener('auth:session-expired', handleChildAuthFailure);

    return () => {
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
      userManager.events.removeSilentRenewError(onSilentRenewError);
      window.removeEventListener('auth:session-expired', handleChildAuthFailure);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: user?.access_token || null,
        isLoading,
        login: () => login(),
        logout: () => logout(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

```

---

### 5. Consuming Auth in Child MFEs via Module Federation

Pass the session and token down from the shell to child micro-frontends through component props or a shared singleton store.

```tsx
// shell/src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { AuthCallback } from './auth/AuthCallback';

const BillingRemote = lazy(() => import('billing_mfe/BillingApp'));

function ShellRoutes() {
  const { user, accessToken, isLoading, login } = useAuth();

  if (isLoading) {
    return <div>Initializing security context...</div>;
  }

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/billing/*"
        element={
          user ? (
            <Suspense fallback={<div>Loading Remote MFE...</div>}>
              {/* Pass token and user profile into child MFE */}
              <BillingRemote
                accessToken={accessToken}
                userProfile={user.profile}
              />
            </Suspense>
          ) : (
            <div>
              <p>You must be signed in to view this section.</p>
              <button onClick={() => login()}>Sign In with OIDC</button>
            </div>
          )
        }
      />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShellRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

```

---

### 6. Child MFE: Making Authenticated API Calls & Token Refresh

Inside the child MFE, update outgoing API headers when the Shell broadcasts an `auth:token-refreshed` event.

```typescript
// child-mfe/src/api/client.ts
import axios from 'axios';

let currentToken: string | null = null;

export const setChildAuthToken = (token: string | null) => {
  currentToken = token;
};

export const apiClient = axios.create({
  baseURL: '/api/v1',
});

apiClient.interceptors.request.use((config) => {
  if (currentToken && config.headers) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Signal App Shell that token is invalid or revoked
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    }
    return Promise.reject(error);
  }
);

// Listen for updated tokens from the Shell
window.addEventListener('auth:token-refreshed', (e: Event) => {
  const { accessToken } = (e as CustomEvent).detail;
  setChildAuthToken(accessToken);
});

```

---

### Security Checklist for PKCE in Micro-Frontends

* **Strict Origin Whitelisting in IdP:** Configure the Identity Provider redirect URIs to point **exclusively** to the Shell's callback URL (e.g., `[https://app.example.com/auth/callback](https://app.example.com/auth/callback)`). Do not add child MFE asset CDNs as valid redirect URIs.
* **Keep PKCE Verifier in `sessionStorage`:** `oidc-client-ts` stores the ephemeral PKCE `code_verifier` in `sessionStorage` by default, protecting it from cross-tab leaking while completing the redirect loop.
* **Scope Down Child Access:** If MFEs talk to different backend services, consider having the App Shell or BFF issue bounded downstream audience tokens rather than giving all child MFEs global API access.
