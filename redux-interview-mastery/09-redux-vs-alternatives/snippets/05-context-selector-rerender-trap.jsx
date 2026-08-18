// Requires: react
// Demonstrates the Context re-render trap that useSelector's slice-based subscription avoids.

import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Ada' });
  const [notifications, setNotifications] = useState([]);

  // BUG: bundling unrelated state into one context value object.
  // Every consumer re-renders when EITHER user OR notifications changes,
  // even components that only read one of the two.
  const value = { user, setUser, notifications, setNotifications };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function UserBadge() {
  const { user } = useContext(AppContext);
  console.log('UserBadge rendered'); // logs on EVERY notification change too
  return <span>{user.name}</span>;
}

// Redux/useSelector equivalent does NOT have this problem, because each
// useSelector call subscribes to exactly the slice it reads:
//
// function UserBadge() {
//   const user = useSelector((state) => state.user); // only re-renders when state.user changes
//   return <span>{user.name}</span>;
// }
//
// Fix within Context: split into two separate contexts (UserContext, NotificationsContext)
// so consumers only subscribe to the one they actually read.

export { AppProvider, UserBadge };
