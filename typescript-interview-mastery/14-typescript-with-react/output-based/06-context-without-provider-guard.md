```tsx
interface CartContextValue {
  items: string[];
  addItem: (id: string) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function CartSummary() {
  const cart = useContext(CartContext);
  return <div>{cart.items.length} items</div>;
}
```

Does this compile?

**Answer:** No — `Object is possibly 'undefined'` on `cart.items.length`, because `useContext(CartContext)` returns `CartContextValue | undefined` (matching the context's declared type, since `createContext` was given `undefined` as its default value).

**Why:** `createContext<CartContextValue | undefined>(undefined)` is deliberate — it means "there is no sensible default value; every real consumer must be wrapped in a `<CartContext.Provider>`." But that honesty comes with an obligation: every direct `useContext(CartContext)` call must handle the `undefined` case, because the type system can't know whether a `<CartSummary />` instance happens to be rendered outside its provider. The idiomatic fix is a wrapping hook that performs the check once and throws a clear error, so every other consumer gets a non-nullable type for free:

```tsx
function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

function CartSummary() {
  const cart = useCart(); // fully typed as CartContextValue, no undefined check needed
  return <div>{cart.items.length} items</div>;
}
```
