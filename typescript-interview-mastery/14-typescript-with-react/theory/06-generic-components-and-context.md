# Generic Components and Typing Context

## Generic components

A generic component lets its prop types depend on a type parameter supplied at the usage site, the same way a generic function works — essential for reusable list/table/select components that should work with any data shape while staying fully type-safe.

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

interface Product {
  id: string;
  name: string;
}

function ProductList({ products }: { products: Product[] }) {
  return (
    <List
      items={products}
      keyExtractor={(p) => p.id}
      renderItem={(p) => <span>{p.name}</span>} // p is inferred as Product, not `any`
    />
  );
}
```

TypeScript infers `T` from the `items` prop's array element type at each call site, so `renderItem` and `keyExtractor`'s parameters are fully typed as `Product` with no manual annotation needed at the usage site — this is contextual generic inference, propagating the type parameter through every prop that references it.

**Syntax note for `.tsx` files:** `function List<T>(...)` works fine, but an arrow-function generic component needs a trailing comma to disambiguate from JSX (`const List = <T,>(props: ListProps<T>) => ...`), because `<T>` alone is parsed as an opening JSX tag in `.tsx` files — this is the same fundamental ambiguity that rules out the old `<Type>value` assertion syntax in `.tsx` files (covered in `12-type-inference-assertions`). Named function declarations don't have this problem, which is one reason they're often preferred for generic components.

## Typing `createContext`

`createContext` requires a default value, and the type of that default determines the context's type. The common friction point is contexts that logically have no sensible default (e.g., an auth context that only exists inside a provider) — passing `undefined` produces `Context<T | undefined>`, forcing every consumer to null-check.

```tsx
interface AuthContextValue {
  user: { id: string; name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);

  const login = async (email: string, password: string) => {
    /* ... */
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## The "possibly undefined" problem and its standard fix

```tsx
// Every consumer would otherwise need this repeated boilerplate:
function Profile() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("Profile must be used within AuthProvider");
  return <div>{ctx.user?.name}</div>;
}
```

The idiomatic fix is a custom hook wrapping `useContext` that centralizes the undefined-check once, so consumers never see `AuthContextValue | undefined` at all:

```tsx
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx; // narrowed to AuthContextValue, not | undefined
}

// consumers:
function Profile() {
  const { user, logout } = useAuth(); // fully typed, no undefined check needed here
  return <div>{user?.name}</div>;
}
```

This pattern — `createContext<T | undefined>(undefined)` plus a `useX()` hook that throws on a missing provider — is the standard, widely-adopted way to get both a safe default (fail loudly if used outside its provider, rather than silently getting `undefined` behavior) and ergonomic, non-nullable typing at every real consumption site.
