Here is a complete, working example demonstrating two independent forms (e.g., a **User Bio Editor** and a **Username Editor**) updating a single user profile.

It uses **`useOptimistic`** to apply instant UI updates and **`AbortController`** to cancel in-flight network requests if a user rapidly resubmits a form, preventing race conditions.

```tsx
import React, { useState, useOptimistic, useTransition, useRef } from 'react';

// 1. Data Models
interface UserProfile {
  username: string;
  bio: string;
}

// 2. Simulated Async REST API call with AbortSignal support
async function updateProfileApi(
  update: Partial<UserProfile>,
  signal: AbortSignal
): Promise<Partial<UserProfile>> {
  // Simulate network latency (1.5s)
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 1500);
    // Handle request abortion
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Request canceled by user resubmission.', 'AbortError'));
    });
  });

  return update;
}

export function ConcurrentFormsProfile() {
  // Real server-confirmed state
  const [profile, setProfile] = useState<UserProfile>({
    username: 'alex_dev',
    bio: 'Building awesome React 19 apps!',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Transitions for non-blocking concurrent updates
  const [isBioPending, startBioTransition] = useTransition();
  const [isUsernamePending, startUsernameTransition] = useTransition();

  // AbortController refs to manage in-flight request cancellation per form
  const bioAbortRef = useRef<AbortController | null>(null);
  const usernameAbortRef = useRef<AbortController | null>(null);

  // 3. Centralized Optimistic State (Derived from real `profile` state)
  const [optimisticProfile, setOptimisticProfile] = useOptimistic(
    profile,
    (current: UserProfile, update: Partial<UserProfile>) => ({
      ...current,
      ...update,
    })
  );

  // 4. Form 1 Action Handler: Update Bio
  const handleBioSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const newBio = formData.get('bio') as string;

    // Abort any existing in-flight bio request
    if (bioAbortRef.current) {
      bioAbortRef.current.abort();
    }
    const controller = new AbortController();
    bioAbortRef.current = controller;

    startBioTransition(async () => {
      // Step A: Trigger immediate optimistic UI update
      setOptimisticProfile({ bio: newBio });

      try {
        // Step B: Send API request with abort signal
        const result = await updateProfileApi({ bio: newBio }, controller.signal);

        // Step C: Update real server state on success
        setProfile((prev) => ({ ...prev, ...result }));
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Bio update request aborted.');
          return; // Ignore canceled request errors
        }
        setErrorMsg(err.message || 'Failed to update bio.');
      }
    });
  };

  // 5. Form 2 Action Handler: Update Username
  const handleUsernameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const newUsername = formData.get('username') as string;

    // Abort any existing in-flight username request
    if (usernameAbortRef.current) {
      usernameAbortRef.current.abort();
    }
    const controller = new AbortController();
    usernameAbortRef.current = controller;

    startUsernameTransition(async () => {
      // Step A: Trigger immediate optimistic UI update
      setOptimisticProfile({ username: newUsername });

      try {
        // Step B: Send API request with abort signal
        const result = await updateProfileApi({ username: newUsername }, controller.signal);

        // Step C: Update real server state on success
        setProfile((prev) => ({ ...prev, ...result }));
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Username update request aborted.');
          return;
        }
        setErrorMsg(err.message || 'Failed to update username.');
      }
    });
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>User Profile Settings</h2>

      {/* Profile Card Preview (Renders Optimistic State Instantly) */}
      <div
        style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3>@{optimisticProfile.username}</h3>
        <p>{optimisticProfile.bio}</p>

        {(isBioPending || isUsernamePending) && (
          <small style={{ color: '#2563eb' }}>
            ⏳ Saving changes to server...
          </small>
        )}
      </div>

      {errorMsg && (
        <p style={{ color: '#dc2626', background: '#fee2e2', padding: '8px', borderRadius: '4px' }}>
          {errorMsg}
        </p>
      )}

      {/* Form A: Bio Editor */}
      <form onSubmit={handleBioSubmit} style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
          Update Bio
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            name="bio"
            defaultValue={profile.bio}
            style={{ flex: 1, padding: '8px' }}
            required
          />
          <button type="submit">Save Bio</button>
        </div>
      </form>

      {/* Form B: Username Editor (Can run concurrently with Bio form!) */}
      <form onSubmit={handleUsernameSubmit}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
          Update Username
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            name="username"
            defaultValue={profile.username}
            style={{ flex: 1, padding: '8px' }}
            required
          />
          <button type="submit">Save Username</button>
        </div>
      </form>
    </div>
  );
}

```

---

### How This Solution Meets All Requirements

1. **Concurrent Form Processing:** The user can click "Save Bio" and immediately click "Save Username" without waiting for the first request to finish. Both forms update the shared `optimisticProfile` state independently.
2. **Race Condition Prevention (`AbortController`):** If a user clicks "Save Bio", changes their mind, types a new bio, and clicks "Save Bio" again before the first request finishes, `bioAbortRef.current.abort()` cancels the initial request.
3. **Automatic Rollbacks:** If an API request throws a network error (and isn't an `AbortError`), the `profile` state is not updated via `setProfile`, causing React to automatically drop the optimistic state and revert the UI to the actual server-confirmed profile on the next render.
