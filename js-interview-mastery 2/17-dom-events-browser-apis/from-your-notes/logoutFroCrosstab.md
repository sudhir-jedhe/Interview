To immediately log a user out of **all open tabs and windows** simultaneously—including the current tab where the logout button was clicked—you can combine the `storage` event listener with a **`BroadcastChannel` API** or a **`storage` event trick** (since the native `storage` event only fires in *other* tabs, not the tab that made the change).

Here is the complete implementation using **React, Redux Toolkit, and React Router**.

---

## 1. Create a Global Cross-Tab Logout Hook

Using the `BroadcastChannel` API is the most reliable modern way to communicate instantly across all tabs (including the active one).

```jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from './authSlice'; // Path to your Redux auth slice

// Create a unique channel for auth events
const authChannel = new BroadcastChannel('auth_channel');

export const useGlobalLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogoutBroadcast = (event) => {
      if (event.data === 'LOGOUT') {
        // 1. Clear local storage token if not already cleared
        localStorage.removeItem('auth_token');

        // 2. Clear Redux state
        dispatch(logout());

        // 3. Redirect to login screen across all tabs
        navigate('/login', { replace: true });
      }
    };

    // Listen for messages from any tab
    authChannel.onmessage = handleLogoutBroadcast;

    // Cleanup channel listener on unmount
    return () => {
      authChannel.close();
    };
  }, [dispatch, navigate]);

  // Function to trigger logout globally across all tabs
  const triggerGlobalLogout = () => {
    // 1. Clear LocalStorage
    localStorage.removeItem('auth_token');

    // 2. Clear local Redux state
    dispatch(logout());

    // 3. Broadcast logout signal to all OTHER tabs
    authChannel.postMessage('LOGOUT');

    // 4. Redirect current tab
    navigate('/login', { replace: true });
  };

  return { triggerGlobalLogout };
};

```

---

## 2. Initialize the Hook in Your App Layout

Wrap your authenticated router structure with a layout component that calls the hook so the listener is always active.

```jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useGlobalLogout } from './useGlobalLogout';

const AuthAppLayout = () => {
  // Keeps the cross-tab listener active on all protected views
  useGlobalLogout();

  return (
    <div className="app-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthAppLayout;

```

---

## 3. Triggering the Logout from Any Component

Now, whenever a user clicks "Log Out" in any tab, `triggerGlobalLogout` will clear local storage, dispatch Redux clearance, push the broadcast signal, and route every open window to `/login` instantaneously.

```jsx
import React from 'react';
import { useGlobalLogout } from './useGlobalLogout';

const UserProfile = () => {
  const { triggerGlobalLogout } = useGlobalLogout();

  return (
    <button 
      onClick={triggerGlobalLogout} 
      className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700"
    >
      Log Out From All Tabs
    </button>
  );
};

export default UserProfile;

```