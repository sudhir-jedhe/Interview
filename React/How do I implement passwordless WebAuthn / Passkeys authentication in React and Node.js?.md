Implementing passwordless **WebAuthn / Passkeys** authentication requires two distinct ceremonies: **Registration** (creating a public/private keypair bound to Touch ID, Face ID, Windows Hello, or 1Password) and **Authentication** (signing a server challenge with the stored private key).

The industry standard library for Node.js and React is **`@simplewebauthn`**, which converts raw binary ArrayBuffers into JSON-serializable payloads automatically.

---

### Prerequisites & Architecture

* **RP ID (Relying Party ID):** The domain of your application without scheme or port (e.g. `example.com` or `localhost`).
* **Origin:** The exact protocol, host, and port (e.g. `[https://example.com](https://example.com)` or `http://localhost:5173`).
* **HTTPS Requirement:** WebAuthn strictly requires HTTPS (except on `localhost`).

```
┌─────────────────┐                                  ┌────────────────────┐
│  React (Client) │                                  │  Node.js (Server)  │
└────────┬────────┘                                  └─────────┬──────────┘
         │                                                     │
         │ ──── 1. POST /api/passkey/register-options ───────► │ (Generates challenge,
         │ ◄─── 2. Returns PublicKeyCredentialCreationOptions  │  authenticatorSelection)
         │                                                     │
         │ [Browser: navigator.credentials.create()]           │
         │                                                     │
         │ ──── 3. POST /api/passkey/register-verify ────────► │ (Verifies signature,
         │ ◄─── 4. Returns Success / Session Cookie ────────── │  stores public key & counter)
         │                                                     │

```

---

### 1. Installation

```bash
# In your Node.js backend
npm install @simplewebauthn/server express express-session

# In your React frontend
npm install @simplewebauthn/browser

```

---

### 2. Node.js Backend Implementation (`server.ts`)

```typescript
import express, { Request, Response } from 'express';
import session from 'express-session';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/types';

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'webauthn-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
  })
);

// --- Configuration ---
const RP_NAME = 'My Modern App';
const RP_ID = process.env.RP_ID || 'localhost';
const EXPECTED_ORIGIN = process.env.ORIGIN || 'http://localhost:5173';

// In-Memory Database (Replace with PostgreSQL / MongoDB in production)
interface StoredPasskey {
  id: string; // Base64URL credential ID
  publicKey: Uint8Array; // Raw public key bytes
  counter: number;
  transports?: AuthenticatorTransportFuture[];
}

interface UserRecord {
  id: string;
  email: string;
  passkeys: StoredPasskey[];
}

const usersDb = new Map<string, UserRecord>();

// ─────────────────────────────────────────────────────────────
// 1. PASSKEY REGISTRATION CEREMONY
// ─────────────────────────────────────────────────────────────

// Step 1: Generate Registration Options
app.post('/api/passkey/register-options', async (req: Request, res: Response) => {
  const { email } = req.body;

  let user = usersDb.get(email);
  if (!user) {
    user = { id: Buffer.from(email).toString('base64url'), email, passkeys: [] };
    usersDb.set(email, user);
  }

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: Buffer.from(user.id),
    userName: user.email,
    userDisplayName: user.email.split('@')[0],
    attestationType: 'none',
    // Require discoverable credentials for Passwordless / Passkeys
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform', // Uses Touch ID / Face ID / Windows Hello
    },
    // Exclude credentials the user already registered to avoid duplicates
    excludeCredentials: user.passkeys.map((pk) => ({
      id: pk.id,
      transports: pk.transports,
    })),
  });

  // Temporarily store the challenge in the session for verification
  (req.session as any).currentChallenge = options.challenge;
  (req.session as any).registeringUserEmail = email;

  res.json(options);
});

// Step 2: Verify Registration Response
app.post('/api/passkey/register-verify', async (req: Request, res: Response) => {
  const body: RegistrationResponseJSON = req.body;
  const expectedChallenge = (req.session as any).currentChallenge;
  const email = (req.session as any).registeringUserEmail;

  const user = usersDb.get(email);
  if (!user || !expectedChallenge) {
    return res.status(400).json({ error: 'Session expired or invalid user' });
  }

  let verification: VerifiedRegistrationResponse;
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: EXPECTED_ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: false,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }

  if (verification.verified && verification.registrationInfo) {
    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Save the new Passkey public key and counter
    user.passkeys.push({
      id: credential.id,
      publicKey: credential.publicKey,
      counter: credential.counter,
      transports: body.response.transports as AuthenticatorTransportFuture[],
    });

    (req.session as any).currentChallenge = null;
    (req.session as any).userId = user.id;

    return res.json({ success: true, verified: true });
  }

  return res.status(400).json({ error: 'Verification failed' });
});

// ─────────────────────────────────────────────────────────────
// 2. PASSKEY AUTHENTICATION CEREMONY (DISCOVERABLE LOGIN)
// ─────────────────────────────────────────────────────────────

// Step 1: Generate Authentication Options
app.post('/api/passkey/login-options', async (req: Request, res: Response) => {
  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: 'preferred',
    // Passing an empty allowCredentials array allows "discoverable credentials" (one-click passkey selection)
    allowCredentials: [],
  });

  (req.session as any).currentChallenge = options.challenge;
  res.json(options);
});

// Step 2: Verify Authentication Response
app.post('/api/passkey/login-verify', async (req: Request, res: Response) => {
  const body: AuthenticationResponseJSON = req.body;
  const expectedChallenge = (req.session as any).currentChallenge;

  if (!expectedChallenge) {
    return res.status(400).json({ error: 'Missing challenge in session' });
  }

  // Find the passkey across all users by its Base64URL credential ID
  let foundUser: UserRecord | undefined;
  let storedPasskey: StoredPasskey | undefined;

  for (const user of usersDb.values()) {
    const match = user.passkeys.find((pk) => pk.id === body.id);
    if (match) {
      foundUser = user;
      storedPasskey = match;
      break;
    }
  }

  if (!foundUser || !storedPasskey) {
    return res.status(400).json({ error: 'Passkey credential not recognized' });
  }

  let verification: VerifiedAuthenticationResponse;
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: EXPECTED_ORIGIN,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: storedPasskey.id,
        credentialPublicKey: storedPasskey.publicKey,
        counter: storedPasskey.counter,
        transports: storedPasskey.transports,
      },
      requireUserVerification: false,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }

  if (verification.verified) {
    // Update the counter to prevent cloned authenticator attacks
    storedPasskey.counter = verification.authenticationInfo.newCounter;
    (req.session as any).userId = foundUser.id;
    (req.session as any).currentChallenge = null;

    return res.json({ success: true, user: { email: foundUser.email } });
  }

  return res.status(400).json({ error: 'Authentication failed' });
});

app.listen(3000, () => console.log('WebAuthn server listening on port 3000'));

```

---

### 3. React Frontend Implementation (`PasskeyAuth.tsx`)

`@simplewebauthn/browser` exposes `startRegistration()` and `startAuthentication()`, handling all communication with the browser's native `navigator.credentials.create()` and `navigator.credentials.get()` APIs.

```tsx
import React, { useState, useEffect } from 'react';
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from '@simplewebauthn/browser';

export function PasskeyAuth() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if the current browser and OS support WebAuthn
    setIsSupported(browserSupportsWebAuthn());

    // Optional: Conditional UI (Browser Autofill on input focus)
    if (browserSupportsWebAuthnAutofill()) {
      startAuthenticationAutofill();
    }
  }, []);

  // Conditional UI / Native Password Manager Autofill
  const startAuthenticationAutofill = async () => {
    try {
      const optsRes = await fetch('/api/passkey/login-options', { method: 'POST' });
      const optionsJSON = await optsRes.json();

      const authResp = await startAuthentication({
        optionsJSON,
        useBrowserAutofill: true,
      });

      const verifyRes = await fetch('/api/passkey/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResp),
      });

      const result = await verifyRes.json();
      if (result.success) {
        setStatus(`Logged in automatically as ${result.user.email}`);
      }
    } catch (err: any) {
      // Ignore abort/cancel errors caused by background autofill waiting
      if (err.name !== 'WebAuthnAbortError') {
        console.error('Autofill error:', err);
      }
    }
  };

  // 1. Create a Passkey (Registration)
  const handleRegisterPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('Requesting registration challenge...');
    try {
      const optionsRes = await fetch('/api/passkey/register-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const optionsJSON = await optionsRes.json();

      setStatus('Prompting device authenticator (Face ID / Touch ID)...');
      const regResp = await startRegistration({ optionsJSON });

      setStatus('Verifying passkey on server...');
      const verifyRes = await fetch('/api/passkey/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regResp),
      });

      const verifyResult = await verifyRes.json();
      if (verifyResult.verified) {
        setStatus('Passkey registered successfully! You can now sign in passwordlessly.');
      } else {
        setStatus(`Registration failed: ${verifyResult.error}`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  // 2. Sign In with Passkey (1-Click Authentication)
  const handleSignInWithPasskey = async () => {
    setStatus('Requesting authentication challenge...');
    try {
      const optionsRes = await fetch('/api/passkey/login-options', { method: 'POST' });
      const optionsJSON = await optionsRes.json();

      setStatus('Touch fingerprint or scan Face ID...');
      const authResp = await startAuthentication({ optionsJSON });

      setStatus('Verifying signature...');
      const verifyRes = await fetch('/api/passkey/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResp),
      });

      const verifyResult = await verifyRes.json();
      if (verifyResult.success) {
        setStatus(`Authenticated successfully as ${verifyResult.user.email}!`);
      } else {
        setStatus(`Authentication failed: ${verifyResult.error}`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  if (!isSupported) {
    return <div>WebAuthn is not supported in this browser environment.</div>;
  }

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <h2>Passwordless Passkey Sign-In</h2>

      <form onSubmit={handleRegisterPasskey} style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="alex@example.com"
          autoComplete="username webauthn"
          required
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '12px' }}
        />
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Create / Register Passkey
        </button>
      </form>

      <div style={{ textAlign: 'center', margin: '16px 0', color: '#64748b' }}>── OR ──</div>

      <button
        type="button"
        onClick={handleSignInWithPasskey}
        style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <span>🔑</span> Sign in with Passkey
      </button>

      {status && (
        <div style={{ marginTop: '16px', padding: '12px', borderRadius: '6px', backgroundColor: '#f8fafc', fontSize: '13px' }}>
          {status}
        </div>
      )}
    </div>
  );
}

```

---

### Key Security & Production Considerations

* **Signature Counter Verification:** WebAuthn authenticators increment an internal signature counter on every sign-in. Storing and validating that `newCounter > storedCounter` protects against physical authenticator cloning.
* **Syncable (Multi-Device) Passkeys:** Apple Keychain, Google Password Manager, and 1Password sync credentials across a user's devices. In this scenario, `counter` might stay at `0` for cloud-synced keys (which `@simplewebauthn/server` handles automatically).
* **Conditional UI (`autoComplete="username webauthn"`):** Adding `autoComplete="username webauthn"` to your email input enables native OS passkey suggestions directly in browser autofill dropdowns without forcing users to click a separate button.
