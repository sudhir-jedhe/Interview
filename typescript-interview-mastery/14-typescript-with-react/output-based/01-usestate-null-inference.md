```tsx
interface Product {
  id: string;
  price: number;
}

function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct(id).then((p: Product) => setProduct(p));
  }, [id]);

  return <div>{product?.price}</div>;
}

declare function fetchProduct(id: string): Promise<Product>;
```

Does this compile?

**Answer:** No — `setProduct(p)` fails with `Argument of type 'Product' is not assignable to parameter of type 'null'`, and `product?.price` also errors since `product` has no `price` property on type `null`.

**Why:** `useState(null)` with no explicit generic infers the state's type purely from the initial value, which is the literal type `null` — not `Product | null`. TypeScript has no way to know from `null` alone that a `Product` will be stored there later; the initial value is the only signal it has for inference at that call site. The fix is an explicit generic that includes every type the state will actually hold: `useState<Product | null>(null)`. This is one of the most common `useState` typing mistakes, and the fix is always to state the full union explicitly rather than relying on the initial value to imply it.
