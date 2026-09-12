/**
 * Authentication context.
 *
 * Notes on the shape:
 *
 *   `status` is a three-state enum, not a boolean. On first paint you do not
 *   yet know whether the stored session is valid, and guessing "logged out"
 *   flashes the login screen at a signed-in user.
 *
 *   The token is held in MEMORY, not localStorage — localStorage is readable
 *   by any injected script. Only the non-sensitive user profile is persisted,
 *   so a reload can restore the session shell instantly.
 */

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Permission, Role, User } from '@/types/domain';
import { readStored, removeStored, writeStored } from '@/lib/storage';
import { roleHas } from './permissions';

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  can: (permission: Permission) => boolean;
  error: string | null;
  isPending: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** In-memory token store — never persisted. */
let accessToken: string | null = null;
export const getAccessToken = () => accessToken;

/**
 * Only the PROFILE is stored — never the token.
 *
 * The profile is a display shell (name, role, scope) so a reload does not
 * flash an empty topbar while the session is re-established. The access
 * token stays in the module-level `accessToken` above, in memory, so it dies
 * with the tab and nothing else on the origin can read it.
 */
const PROFILE_KEY = 'profile';

/** Demo accounts. A real build would POST /auth/login instead. */
const ACCOUNTS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'admin@spiro.com',
    password: 'spiro',
    user: {
      id: 'u1',
      name: 'Super Admin',
      email: 'admin@spiro.com',
      role: 'super_admin',
      country: 'ALL',
      avatarUrl: null,
    },
  },
  {
    email: 'operator@spiro.com',
    password: 'spiro',
    user: {
      id: 'u2',
      name: 'Kofi Mensah',
      email: 'operator@spiro.com',
      role: 'operator',
      country: 'Togo',
      avatarUrl: null,
    },
  },
  {
    email: 'viewer@spiro.com',
    password: 'spiro',
    user: {
      id: 'u3',
      name: 'Ama Doe',
      email: 'viewer@spiro.com',
      role: 'viewer',
      country: 'Benin',
      avatarUrl: null,
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('unknown');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Bootstrap: restore the session shell before deciding what to render.
  useEffect(() => {
    try {
      const raw = readStored<User | null>('local', PROFILE_KEY, null);
      if (raw) {
        setUser(raw);
        accessToken = 'restored-demo-token';
        setStatus('authenticated');
        return;
      }
    } catch {
      /* corrupt stored profile — fall through to anonymous */
    }
    setStatus('anonymous');
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsPending(true);
    setError(null);

    // Stand-in for the network round trip.
    await new Promise((r) => setTimeout(r, 500));

    const match = ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );

    if (!match) {
      setIsPending(false);
      // Deliberately vague: never reveal whether the EMAIL exists.
      setError('Incorrect email or password.');
      throw new Error('Invalid credentials');
    }

    accessToken = `demo-token-${match.user.id}`;
    setUser(match.user);
    setStatus('authenticated');
    setIsPending(false);

    try {
      writeStored('local', PROFILE_KEY, match.user);
    } catch {
      /* non-fatal */
    }
  }, []);

  const signOut = useCallback(() => {
    accessToken = null;
    setUser(null);
    setStatus('anonymous');
    try {
      removeStored('local', PROFILE_KEY);
    } catch {
      /* non-fatal */
    }
  }, []);

  const can = useCallback(
    (permission: Permission) => (user ? roleHas(user.role, permission) : false),
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, signIn, signOut, can, error, isPending }),
    [user, status, signIn, signOut, can, error, isPending]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

/** React 19's `use()` reads context and throws a clear error when missing. */
export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export const DEMO_ACCOUNTS = ACCOUNTS.map((a) => ({
  email: a.email,
  password: a.password,
  role: a.user.role as Role,
}));
