# 5 Advanced React Component Patterns

## Frontend System Design + Senior React Interview Explanation

Advanced React component patterns are one of the most **important Senior React interview topics**.

Interviewers ask this to test:

✅ React architecture skills

✅ Reusability

✅ API design

✅ Component design maturity

✅ Enterprise-scale system design

✅ Deep understanding of composition

✅ Familiarity with modern React libraries

They separate mid-level developers from **Staff/Lead/Architect-level developers**.

Real-world usage:

```txt
Radix UI
Chakra UI
Material UI
Ant Design
Headless UI
Formik
React Query
LinkedIn
Slack
Vercel
Amazon design system
```

Below are the **5 most important advanced React component patterns** used in real-world enterprise systems.

Each pattern has:

- Explanation
- Use cases
- Full code
- Pros
- Cons

---

# 1. Compound Component Pattern

## What It Is

A parent component provides shared state through **React Context** to its children, which behave like slots.

Consumers compose components declaratively — similar to:

```txt
<select><option/></select>
```

Modern React libraries rely heavily on this pattern.

---

## When to Use

✅ Tabs

✅ Menus

✅ Modals

✅ Dropdowns

✅ Accordions

✅ Steppers

✅ Multi-step Forms

✅ Design system building blocks

---

## Example

```jsx
const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

Tabs.List = function List({ children }) {
  return <div>{children}</div>;
};

Tabs.Tab = function Tab({ children, tabKey }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  return <button onClick={() => setActiveTab(tabKey)}>{children}</button>;
};

Tabs.Panel = function Panel({ children, tabKey }) {
  const { activeTab } = useContext(TabsContext);

  return activeTab === tabKey ? <div>{children}</div> : null;
};

export default Tabs;
```

---

## Consumer API

```jsx
<Tabs defaultTab="home">
  <Tabs.List>
    <Tabs.Tab tabKey="home">Home</Tabs.Tab>

    <Tabs.Tab tabKey="profile">Profile</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel tabKey="home">Home Content</Tabs.Panel>

  <Tabs.Panel tabKey="profile">Profile Content</Tabs.Panel>
</Tabs>
```

---

## Pros

✅ Declarative

✅ Flexible layout

✅ Great for UI libraries

✅ Removes prop drilling

✅ Excellent accessibility

## Cons

❌ Requires Context

❌ Coupled parent-child relation

---

# 2. Provider Pattern

## What It Is

Uses React Context to share **global data** across the component tree.

Instead of drilling props:

```txt
A → B → C → D → Component
```

Wrap the tree in a Provider:

```jsx
<Provider>
  <App />
</Provider>
```

Any component can access data directly.

---

## When to Use

✅ Auth

✅ Theme

✅ Language

✅ Notifications

✅ Modals

✅ Router

✅ Feature flags

✅ Design system contexts

---

## Example — Auth Provider

```jsx
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    setUser(data.user);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

Usage:

```jsx
const { user, login } = useAuth();
```

---

## Pros

✅ Removes prop drilling

✅ Great API

✅ Perfect for shared state

✅ Works for auth, themes, modals, etc.

## Cons

❌ Not for high-frequency updates

❌ Can cause unnecessary rerenders (fix with `useMemo`)

---

# 3. Higher-Order Component (HOC) Pattern

## What It Is

A **function** that takes a component and returns a new one with extra behavior:

```jsx
const Enhanced = withAuth(Component);
```

Even in modern React, HOCs are used for:

- Auth wrappers
- Feature flags
- Analytics
- Logging
- Permissions
- Data fetching wrappers

Used by:

- Redux (`connect`)
- React Router v5 (`withRouter`)
- MobX (`observer`)
- Formik (`withFormik`)

---

## When to Use

✅ Cross-cutting concerns

✅ Wrapping legacy components

✅ Feature flags

✅ Rendering rules

✅ Enterprise systems

---

## Example — withLoading HOC

```jsx
function withLoading(Component) {
  return function Wrapper({ isLoading, ...props }) {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    return <Component {...props} />;
  };
}
```

Usage:

```jsx
const UserListWithLoader = withLoading(UserList);
```

Then:

```jsx
<UserListWithLoader isLoading={true} />
```

---

## Pros

✅ Reusable behavior

✅ Cross-cutting concerns

✅ Composable

✅ Great for wrapping legacy components

## Cons

❌ Nesting hell

❌ Debugging harder

❌ Ref forwarding required

❌ Less common in modern React (hooks replaced many use cases)

---

# 4. Render Props Pattern

## What It Is

A component uses a **function as a prop** to control rendering:

```jsx
<Component>{(state) => <Render />}</Component>
```

Used heavily in older React (React 15/16 era).

Still used in:

- Legacy libraries
- React Query components
- Downshift
- Formik (older versions)

---

## When to Use

✅ Fully custom rendering logic

✅ When you don’t want compound components

✅ Sharing behavior in a functional way

✅ Legacy support

---

## Example — MousePosition Render Prop

```jsx
class MouseTracker extends React.Component {
  state = {
    x: 0,
    y: 0,
  };

  handleMove = (e) => {
    this.setState({
      x: e.clientX,
      y: e.clientY,
    });
  };

  render() {
    return (
      <div onMouseMove={this.handleMove}>{this.props.children(this.state)}</div>
    );
  }
}
```

Usage:

```jsx
<MouseTracker>
  {({ x, y }) => (
    <p>
      Mouse at {x}, {y}
    </p>
  )}
</MouseTracker>
```

---

## Pros

✅ Flexible

✅ Reusable logic

✅ Ultra-custom rendering

## Cons

❌ Verbose

❌ Nested JSX

❌ Bad DX

❌ Poor readability

❌ Being replaced by hooks

Modern React prefers hooks or compound components.

---

# 5. Controlled + Uncontrolled Component Pattern

## What It Is

Components should support **both**:

- Controlled mode (parent controls state)
- Uncontrolled mode (component manages own state)

Used by:

- React `<input>`
- Ant Design components
- Chakra UI components
- Radix UI components

---

## When to Use

✅ Form inputs

✅ Tabs

✅ Modals

✅ Accordions

✅ Menus

✅ Dropdowns

✅ Wizards

✅ Steppers

✅ Sliders

✅ Toggle switches

---

## Example — Controlled + Uncontrolled Tabs

```jsx
function Tabs({ children, defaultTab, activeTab: controlledTab, onChange }) {
  const isControlled = controlledTab !== undefined;

  const [internalTab, setInternalTab] = useState(defaultTab);

  const currentTab = isControlled ? controlledTab : internalTab;

  function handleChange(tab) {
    if (!isControlled) {
      setInternalTab(tab);
    }

    onChange?.(tab);
  }

  return (
    <TabsContext.Provider
      value={{
        activeTab: currentTab,
        setActiveTab: handleChange,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}
```

Usage — Uncontrolled:

```jsx
<Tabs defaultTab="home">
```

Usage — Controlled:

```jsx
<Tabs
  activeTab={active}
  onChange={setActive}
>
```

---

## Pros

✅ Flexible API

✅ Handles all use cases

✅ Great for form integration

✅ Predictable state model

✅ Widely used in libraries

## Cons

❌ Requires careful implementation

❌ Need to handle both modes

❌ Consumers may confuse both APIs

---

# 6. Bonus Real-World Component Design Principle

## Combine All Patterns for Enterprise UI Libraries

Modern React apps combine:

- Compound
- Provider
- Hooks
- Controlled/Uncontrolled
- HOC
- Slot-based composition

Example:

```jsx
<Tabs.Root value={value} onValueChange={setValue}>
  <Tabs.List>
    <Tabs.Trigger value="a" />
  </Tabs.List>

  <Tabs.Content value="a" />
</Tabs.Root>
```

Used in:

- Radix UI
- Headless UI
- Chakra UI
- Material UI

Perfect for large-scale design systems.

---

# 7. Data Flow Diagram

```txt
Consumer
   │
   ▼
Advanced Pattern Component
   │
   ▼
Provides API + State + Structure
   │
   ▼
Composable Children
   │
   ▼
Consistent UI + Accessible + Reusable
```

---

# 8. Enterprise-Level Interview Answer

> Modern React apps use several advanced patterns to create scalable, reusable, and maintainable UI systems. Compound components provide declarative, accessible APIs with shared internal state via Context; the Provider pattern eliminates prop drilling for global data like auth, theme, or feature flags; the HOC pattern wraps components with reusable behaviors such as authentication or analytics; the Render Props pattern enables highly customizable rendering but has been largely replaced by hooks; and the Controlled/Uncontrolled pattern gives consumers flexibility to either manage state themselves or let the component do it — the standard in enterprise UI libraries. Modern component libraries like Radix UI, Chakra UI, and Material UI combine these patterns with hooks to build accessible, composable, and highly scalable design systems used across LinkedIn, Vercel, Slack, Notion, and enterprise product teams worldwide.
