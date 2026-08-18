# Problem 1: Type a Generic, Reusable `<Select<T>>` Component

## The setup

You need a `Select` component that works with any option data type — strings, numbers, or objects — taking `options: T[]` and calling `onChange(value: T)` when the user picks one, while rendering each option's label via a caller-supplied function.

## Your task

Implement `Select<T>` so that:
1. `options`, `onChange`, and a `getLabel` function are all correctly typed against the same generic `T`.
2. TypeScript infers `T` automatically from the `options` array at each call site, with no manual type argument needed.
3. The component correctly tracks which option is currently selected and compares by a caller-supplied key rather than by object identity (since options are often freshly-created objects on every render).

## Reference solution

```tsx
interface SelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getKey: (option: T) => string;
}

function Select<T>({ options, value, onChange, getLabel, getKey }: SelectProps<T>) {
  const selectedKey = value ? getKey(value) : "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextKey = e.target.value;
    const nextOption = options.find((opt) => getKey(opt) === nextKey);
    if (nextOption) {
      onChange(nextOption);
    }
  };

  return (
    <select value={selectedKey} onChange={handleChange}>
      <option value="" disabled>
        Select an option
      </option>
      {options.map((opt) => (
        <option key={getKey(opt)} value={getKey(opt)}>
          {getLabel(opt)}
        </option>
      ))}
    </select>
  );
}
```

Usage with a plain string union:

```tsx
type Currency = "USD" | "EUR" | "GBP";

function CurrencyPicker() {
  const [currency, setCurrency] = useState<Currency | null>(null);
  const currencies: Currency[] = ["USD", "EUR", "GBP"];

  return (
    <Select
      options={currencies}
      value={currency}
      onChange={setCurrency}
      getLabel={(c) => c}
      getKey={(c) => c}
    />
  );
}
```

Usage with an object type:

```tsx
interface Country {
  code: string;
  name: string;
}

function CountryPicker() {
  const [country, setCountry] = useState<Country | null>(null);
  const countries: Country[] = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
  ];

  return (
    <Select
      options={countries}
      value={country}
      onChange={setCountry}
      getLabel={(c) => c.name}
      getKey={(c) => c.code}
    />
  );
}
```

## Why `getKey` is necessary in addition to `getLabel`

A native `<select>` element identifies its selected `<option>` by its `value` attribute, which must be a string — you can't set an object as an HTML attribute value. Comparing `value === option` directly by reference would also silently break for object options that are freshly constructed each render (e.g., mapped from an API response), since two structurally identical objects aren't `===` equal in JavaScript. Requiring an explicit `getKey: (option: T) => string` sidesteps both problems: it gives the native `<select>` a stable string identity to track, and it gives `Select<T>` a reliable way to look the selected `T` back up from that string on change, regardless of whether `T` is a primitive or an object with no natural string identity of its own.

## Why generic inference works with no explicit type argument

TypeScript infers `T` from the `options` prop's array element type at each call site — `options={currencies}` (typed `Currency[]`) infers `T = Currency`; `options={countries}` (typed `Country[]`) infers `T = Country`. Once `T` is pinned down, every other prop referencing `T` (`value`, `onChange`, `getLabel`, `getKey`) is checked and autocompleted against that specific type, with zero manual `<Select<Currency>>` type argument needed.
