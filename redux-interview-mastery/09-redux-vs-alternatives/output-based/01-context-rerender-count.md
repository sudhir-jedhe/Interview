## Given this setup, how many times does `NotificationBell` re-render when the user clicks "Add Notification" 3 times?

```jsx
const AppContext = createContext(null);

function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Ada' });
  const [notifications, setNotifications] = useState([]);
  const value = { user, notifications, setNotifications };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function UserName() {
  const { user } = useContext(AppContext);
  console.log('UserName render');
  return <span>{user.name}</span>;
}

function NotificationBell() {
  const { notifications } = useContext(AppContext);
  console.log('NotificationBell render');
  return <span>{notifications.length}</span>;
}

// Clicking a button 3 times calls: setNotifications(prev => [...prev, 'new'])
```

**Answer:** `NotificationBell` re-renders 3 times (correctly, since it reads `notifications`) — but `UserName` *also* re-renders 3 times, even though it never reads `notifications` and `user` never changed.

**Why:** `useContext` subscribes a component to the *entire* context value object, not to the specific field(s) the component destructures from it. Every time `AppProvider` re-renders (which happens on every `setNotifications` call, since that's a `useState` inside it), it creates a brand-new `value` object literal, and React propagates that new value to *every* consumer of `AppContext`, triggering a re-render regardless of which field each consumer actually reads. This is precisely the re-render granularity problem `useSelector` was built to avoid — a Redux equivalent, `useSelector(state => state.notifications)`, only re-renders `NotificationBell`-equivalent components when `state.notifications` itself changes, leaving a `UserName`-equivalent component reading `state.user` untouched. The fix within Context (splitting into `UserContext` and `NotificationsContext`) works, but it's manual work you have to remember to do for every independent piece of state — Redux's selector model gives you this granularity by default.
