**React Hook Form** provides high-performance forms in React by leveraging **uncontrolled inputs** under the hood. Unlike traditional controlled components that trigger a full component re-render on every keystroke, React Hook Form isolated updates to the DOM node, keeping re-renders near zero.

When combined with **TypeScript** and **Zod** (for schema validation), you get type-safe forms with instant validation and autocomplete.

---

## 1. Setup Dependencies

Install React Hook Form, Zod, and the Zod resolver package:

```bash
npm install react-hook-form zod @hookform/resolvers

```

---

## 2. Complete Type-Safe Form Example

Here is a production-ready registration form with schema validation, custom error messages, and loading states.

### Step 1: Define Zod Schema & Infer Types

```typescript
// schema/registrationSchema.ts
import { z } from 'zod';

export const registrationSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username cannot exceed 20 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: z.enum(['developer', 'designer', 'manager'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Attach error specifically to confirmPassword field
  });

// Infer TypeScript type directly from the Zod schema
export type RegistrationFormData = z.infer<typeof registrationSchema>;

```

---

### Step 2: Build the Form Component

```tsx
// components/RegistrationForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, RegistrationFormData } from '../schema/registrationSchema';

export function RegistrationForm() {
  // Initialize useForm with TypeScript generics and Zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched', // Validates field when the user leaves/touches the field
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'developer',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form Submitted Successfully:', data);
      alert('Registration successful!');
      reset(); // Clear form fields
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: '400px',
        margin: '20px auto',
        padding: '24px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
      }}
    >
      <h2>Create Account</h2>

      {/* Username Field */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="username" style={{ display: 'block', fontWeight: 600 }}>
          Username:
        </label>
        <input
          id="username"
          type="text"
          {...register('username')} // Registers input ref & handlers
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.username && (
          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email" style={{ display: 'block', fontWeight: 600 }}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.email && (
          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="password" style={{ display: 'block', fontWeight: 600 }}>
          Password:
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.password && (
          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: 600 }}>
          Confirm Password:
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.confirmPassword && (
          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Select Role Dropdown */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="role" style={{ display: 'block', fontWeight: 600 }}>
          Role:
        </label>
        <select id="role" {...register('role')} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
        {errors.role && (
          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.role.message}
          </p>
        )}
      </div>

      {/* Checkbox */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input id="agreeToTerms" type="checkbox" {...register('agreeToTerms')} />
        <label htmlFor="agreeToTerms" style={{ fontSize: '14px' }}>
          I agree to the terms and conditions
        </label>
      </div>
      {errors.agreeToTerms && (
        <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '-8px', marginBottom: '16px' }}>
          {errors.agreeToTerms.message}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isSubmitting ? '#94a3b8' : '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

```

---

## 3. Working with Controlled Third-Party Inputs (`<Controller/>`)

For UI libraries like Material UI, Radix, or React Select that don't expose a native DOM `ref`, React Hook Form provides the **`<Controller/>`** component.

```tsx
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from 'react-select'; // Third-party controlled component

interface FormInput {
  skills: { value: string; label: string }[];
}

export function SkillsForm() {
  const { control, handleSubmit } = useForm<FormInput>();

  const skillOptions = [
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <label>Skills:</label>
      <Controller
        name="skills"
        control={control}
        rules={{ required: 'Please select at least one skill' }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <ReactSelect
              {...field}
              isMulti
              options={skillOptions}
            />
            {error && <span style={{ color: 'red' }}>{error.message}</span>}
          </div>
        )}
      />
      <button type="submit">Save</button>
    </form>
  );
}

```

---

## 4. Sub-Component Form Subscriptions (`useWatch`)

If a child component needs to read a specific form value without forcing the entire parent form to re-render, use the **`useWatch`** hook.

```tsx
import { useWatch, Control } from 'react-hook-form';
import { RegistrationFormData } from '../schema/registrationSchema';

// This child ONLY re-renders when the 'username' field changes
export function UsernamePreview({ control }: { control: Control<RegistrationFormData> }) {
  const username = useWatch({
    control,
    name: 'username',
  });

  return <p>Live Handle: @{username || 'username'}</p>;
}

```

---

## Key Performance Advantages

| Advantage                     | Mechanism                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| **No Keystroke Re-renders**   | Uses uncontrolled inputs; values are read directly from DOM refs during event handling.       |
| **Isolated Subscriptions**    | `useWatch` and `useFormState` allow deep sub-components to subscribe only to specific fields. |
| **Tiny Bundle Size**          | ~9kB gzipped with zero external dependencies.                                                 |
| **Built-in Async Validation** | Integrates natively with Zod/Yup resolvers for parallel field and form-level checks.          |

Show me how to build dynamic field array forms (adding/removing items) using useFieldArray in React Hook Form.

The **`useFieldArray`** hook from React Hook Form is designed specifically for managing dynamic form fields (lists of inputs where users can add, remove, swap, or prepend items dynamically).

It provides high performance because each item maintains its own internal ID (`field.id`), allowing React to append, prepend, or remove items **without re-rendering the entire list or losing input focus**.

---

## 1. Complete Example: Dynamic Invoice Item Builder

Here is a complete, type-safe example using **React Hook Form**, **TypeScript**, and **Zod** schema validation.

### Step 1: Define Zod Schema & Types

```typescript
// schema/invoiceSchema.ts
import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  price: z.coerce.number().min(0.01, 'Min $0.01'),
});

export const invoiceSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  items: z
    .array(invoiceItemSchema)
    .min(1, 'At least one invoice item is required'),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

```

---

### Step 2: Implement the Dynamic Form Component

```tsx
// components/InvoiceForm.tsx
import React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceSchema, InvoiceFormData } from '../schema/invoiceSchema';

export function InvoiceForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: '',
      items: [
        { description: 'Web Development', quantity: 1, price: 500 },
      ],
    },
  });

  // 1. Initialize useFieldArray
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'items', // Array key in form state
  });

  // 2. Watch items for real-time total calculation without full form re-renders
  const watchedItems = useWatch({
    control,
    name: 'items',
  });

  const totalAmount = (watchedItems || []).reduce((sum, item) => {
    const qty = Number(item?.quantity) || 0;
    const price = Number(item?.price) || 0;
    return sum + qty * price;
  }, 0);

  const onSubmit = (data: InvoiceFormData) => {
    console.log('Submitted Invoice Data:', data);
    alert(`Invoice created for ${data.clientName} with Total: $${totalAmount.toFixed(2)}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: '650px',
        margin: '20px auto',
        padding: '24px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
      }}
    >
      <h2>Create Invoice</h2>

      {/* Client Name Input */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="clientName" style={{ display: 'block', fontWeight: 600 }}>
          Client Name:
        </label>
        <input
          id="clientName"
          type="text"
          {...register('clientName')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.clientName && (
          <p style={{ color: '#dc2626', fontSize: '12px' }}>{errors.clientName.message}</p>
        )}
      </div>

      {/* Dynamic Items List Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Line Items</h3>
        <button
          type="button"
          onClick={() => append({ description: '', quantity: 1, price: 0 })}
          style={{ padding: '6px 12px', cursor: 'pointer' }}
        >
          + Add Item
        </button>
      </div>

      {errors.items?.root && (
        <p style={{ color: '#dc2626', fontSize: '12px' }}>{errors.items.root.message}</p>
      )}

      {/* Dynamic List Rendering */}
      <div style={{ marginTop: '12px' }}>
        {fields.map((field, index) => {
          const itemError = errors.items?.[index];

          return (
            <div
              // CRITICAL: Always use field.id as key (NOT array index)
              key={field.id}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
              }}
            >
              {/* Reorder Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                  style={{ fontSize: '10px' }}
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                  style={{ fontSize: '10px' }}
                >
                  ▼
                </button>
              </div>

              {/* Description Field */}
              <div style={{ flex: 2 }}>
                <input
                  type="text"
                  placeholder="Description"
                  {...register(`items.${index}.description` as const)}
                  style={{ width: '100%', padding: '6px' }}
                />
                {itemError?.description && (
                  <p style={{ color: '#dc2626', fontSize: '11px', margin: '2px 0 0' }}>
                    {itemError.description.message}
                  </p>
                )}
              </div>

              {/* Quantity Field */}
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="Qty"
                  {...register(`items.${index}.quantity` as const)}
                  style={{ width: '100%', padding: '6px' }}
                />
                {itemError?.quantity && (
                  <p style={{ color: '#dc2626', fontSize: '11px', margin: '2px 0 0' }}>
                    {itemError.quantity.message}
                  </p>
                )}
              </div>

              {/* Price Field */}
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  {...register(`items.${index}.price` as const)}
                  style={{ width: '100%', padding: '6px' }}
                />
                {itemError?.price && (
                  <p style={{ color: '#dc2626', fontSize: '11px', margin: '2px 0 0' }}>
                    {itemError.price.message}
                  </p>
                )}
              </div>

              {/* Remove Action */}
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1} // Prevent removing last item
                style={{
                  padding: '6px 10px',
                  backgroundColor: fields.length === 1 ? '#cbd5e1' : '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: fields.length === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Total Display */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          paddingTop: '12px',
          borderTop: '2px solid #e2e8f0',
        }}
      >
        <h3>Total Amount:</h3>
        <h3>${totalAmount.toFixed(2)}</h3>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '16px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Submit Invoice
      </button>
    </form>
  );
}

```

---

## 2. Key Helper Functions Provided by `useFieldArray`

| Method        | Syntax                     | Usage                                                           |
| ------------- | -------------------------- | --------------------------------------------------------------- |
| **`append`**  | `append(obj)`              | Adds item(s) to the **end** of the list.                        |
| **`prepend`** | `prepend(obj)`             | Adds item(s) to the **beginning** of the list.                  |
| **`insert`**  | `insert(index, obj)`       | Inserts item at a specific index position.                      |
| **`remove`**  | `remove(index)`            | Removes item at index (or multiple indices `remove([0, 1])`).   |
| **`swap`**    | `swap(indexA, indexB)`     | Swaps positions of two items in the array.                      |
| **`move`**    | `move(fromIndex, toIndex)` | Moves item from one index to another (great for drag-and-drop). |
| **`replace`** | `replace(newArray)`        | Replaces entire field array with a new dataset.                 |

---

## 3. Important Rules to Avoid Bugs

1. **Always use `field.id` as the React `key`:**
Do **not** use array `index` as the `key` in `.map()`. React Hook Form generates a unique internal identifier (`field.id`) for every row. Using `field.id` ensures inputs keep their correct value and focus state when items are reordered or deleted.

```tsx
// ❌ BAD
{fields.map((field, index) => <div key={index}>...</div>)}

// ✅ GOOD
{fields.map((field, index) => <div key={field.id}>...</div>)}

```

1. **Cast field names explicitly with `as const` in TypeScript:**
When registering dynamic fields (`items.${index}.fieldName`), append `as const` so TypeScript infers string literal paths properly.

```tsx
{...register(`items.${index}.description` as const)}

```

1. **Do not destruct `fields` and modify it directly:**
Treat `fields` as read-only. Always use helper methods (`append`, `remove`, `move`) to update array items.
