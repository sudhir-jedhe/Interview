When a form field's existence, value, or validation rules depend on another field (e.g., selecting "Country = India" reveals a state dropdown, or selecting "ID Type = PAN" reveals a PAN input field), your state structure should shift from **flat independent state variables** to a **derived/computed state pattern** or a **discriminated union/normalized state object**.

Here is how your state architecture should evolve to handle field dependencies cleanly without introducing state synchronization bugs or unnecessary re-renders.

---

### 1. The Core Architectural Change: Prefer Derived State Over Duplicate State

The most common anti-pattern when introducing dependent fields is storing both the independent field, the dependent field, and the dependent field's *options or visibility status* separately in state, and then trying to keep them in sync using `useEffect`.

#### ❌ The Anti-Pattern: Duplicated / Sync-Heavy State

```tsx
// Anti-Pattern: Trying to keep dependent state in sync with useEffect
const [country, setCountry] = useState('');
const [statesList, setStatesList] = useState([]); // ❌ Unnecessary state
const [selectedState, setSelectedState] = useState('');

useEffect(() => {
  // Danger: Creates extra re-renders, race conditions, and out-of-sync state
  if (country === 'India') {
    setStatesList(['Maharashtra', 'Karnataka', 'Delhi']);
  } else {
    setStatesList([]);
  }
  setSelectedState(''); // Forgetting this leaves stale state behind!
}, [country]);

```

#### ✅ The Redesigned Architecture: Derived State

Do not store values in state if they can be calculated on the fly during rendering. Store only the minimal source of truth, and compute dependent values during the render pass (or memoize with `useMemo` if expensive).

```tsx
// Source of truth (minimal state)
const [country, setCountry] = useState<string>('');
const [selectedState, setSelectedState] = useState<string>('');

// Derived state (No useEffect required!)
const statesList = useMemo(() => {
  if (country === 'India') return ['Maharashtra', 'Karnataka', 'Delhi'];
  if (country === 'USA') return ['California', 'Texas', 'New York'];
  return [];
}, [country]);

const isStateFieldVisible = statesList.length > 0;

```

---

### 2. State Restructuring Patterns for Complex Dependencies

Depending on the nature of the dependency, use one of the following state structures:

---

#### Pattern A: Single Form Object with Reset Handlers

When fields are closely coupled inside a form, combine them into a single object and reset dependent values inside the primary change handler rather than in a `useEffect`.

```tsx
interface FormState {
  paymentMethod: 'CREDIT_CARD' | 'UPI' | 'NET_BANKING' | '';
  // Dependent fields:
  cardNumber: string;
  upiId: string;
  bankName: string;
}

const INITIAL_STATE: FormState = {
  paymentMethod: '',
  cardNumber: '',
  upiId: '',
  bankName: '',
};

export const DependentForm = () => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  // Clean reset logic handled at the interaction boundary
  const handlePaymentMethodChange = (method: FormState['paymentMethod']) => {
    setForm({
      paymentMethod: method,
      // Clear all dependent fields when the parent field changes
      cardNumber: '',
      upiId: '',
      bankName: '',
    });
  };

  return (
    <div>
      <select 
        value={form.paymentMethod} 
        onChange={(e) => handlePaymentMethodChange(e.target.value as any)}
      >
        <option value="">Select Payment Method</option>
        <option value="CREDIT_CARD">Credit Card</option>
        <option value="UPI">UPI</option>
      </select>

      {/* Conditionally rendered dependent fields */}
      {form.paymentMethod === 'CREDIT_CARD' && (
        <input
          type="text"
          placeholder="Card Number"
          value={form.cardNumber}
          onChange={(e) => setForm(prev => ({ ...prev, cardNumber: e.target.value }))}
        />
      )}

      {form.paymentMethod === 'UPI' && (
        <input
          type="text"
          placeholder="UPI ID (e.g. user@upi)"
          value={form.upiId}
          onChange={(e) => setForm(prev => ({ ...prev, upiId: e.target.value }))}
        />
      )}
    </div>
  );
};

```

---

#### Pattern B: TypeScript Discriminated Unions (Strict Type Safety)

If selecting a field fundamentally changes the schema or shape of the remaining form payload, model your state as a **Discriminated Union**. This enforces that invalid field combinations cannot exist in your type system.

```tsx
// State definition enforcing mutually exclusive dependent fields
type IdentityState =
  | { type: 'NONE' }
  | { type: 'PAN'; panNumber: string }
  | { type: 'PASSPORT'; passportNumber: string; expiryDate: string };

export const IdentityVerification = () => {
  const [identity, setIdentity] = useState<IdentityState>({ type: 'NONE' });

  return (
    <div>
      <select
        value={identity.type}
        onChange={(e) => {
          const type = e.target.value as IdentityState['type'];
          if (type === 'PAN') setIdentity({ type: 'PAN', panNumber: '' });
          else if (type === 'PASSPORT') setIdentity({ type: 'PASSPORT', passportNumber: '', expiryDate: '' });
          else setIdentity({ type: 'NONE' });
        }}
      >
        <option value="NONE">Select Govt ID</option>
        <option value="PAN">PAN Card</option>
        <option value="PASSPORT">Passport</option>
      </select>

      {identity.type === 'PAN' && (
        <input
          placeholder="ABCDE1234F"
          value={identity.panNumber}
          onChange={(e) => setIdentity({ ...identity, panNumber: e.target.value.toUpperCase() })}
        />
      )}

      {identity.type === 'PASSPORT' && (
        <>
          <input
            placeholder="Passport Number"
            value={identity.passportNumber}
            onChange={(e) => setIdentity({ ...identity, passportNumber: e.target.value })}
          />
          <input
            type="date"
            value={identity.expiryDate}
            onChange={(e) => setIdentity({ ...identity, expiryDate: e.target.value })}
          />
        </>
      )}
    </div>
  );
};

```

---

### 3. Handling Dependent Validation Rules with Yup / Zod

When fields depend on each other, form validation libraries (like `yup` or `zod`) handle conditionally required fields using `.when()` or `.refine()`.

```typescript
import * as yup from 'yup';

// Dynamic Schema where validation changes based on 'idType'
export const dynamicIdSchema = yup.object().shape({
  idType: yup.string().required('Please select an ID type'),
  
  // Conditionally required field using yup.when
  idNumber: yup.string().when('idType', {
    is: 'PAN',
    then: (schema) =>
      schema
        .required('PAN Card number is required')
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
    otherwise: (schema) =>
      schema.when('idType', {
        is: 'PASSPORT',
        then: (schema) =>
          schema
            .required('Passport number is required')
            .min(8, 'Passport must be at least 8 characters'),
        otherwise: (schema) => schema.notRequired(),
      }),
  }),
});

```

---

### Summary Checklist for Dependent Fields

1. **Eliminate Sync Effects:** Never sync dependent options or fields using `useEffect`. Calculate them directly during render or with `useMemo`.
2. **Clear Stale Values:** When a parent field changes, immediately reset or prune dependent values so hidden inputs don't submit stale data.
3. **Use Discriminated Unions:** Represent mutually exclusive dependent fields using type unions to prevent impossible state combinations.
4. **Decouple Validation:** Use schema conditional validation (`yup.when` / `zod.discriminatedUnion`) so hidden dependent fields do not block form submission with validation errors.
