These are the three most common Redux Toolkit traps that cause hard-to-trace runtime bugs, broken reactivity, or performance degradation:

---

### Trap 1: Mutating and Returning State Simultaneously in Immer

Because RTK uses Immer inside `createSlice`, you are allowed to write "mutating" logic. However, Immer requires you to **either** mutate the draft **or** return a brand new value—never both.

* **The Mistake:**

```javascript
// ❌ Broken: Combining mutation with returning
const userSlice = createSlice({
  name: 'user',
  initialState: { names: [] },
  reducers: {
    addName: (state, action) => {
      // .push() returns the new array length (a number), NOT the state!
      // Returning a primitive while modifying state crashes Immer.
      return state.names.push(action.payload);
    },
    resetUser: (state) => {
      state = {}; // ❌ Reassigning the draft variable does nothing!
    }
  }
});

```

* **The Fix:**
* If mutating, do not return:

```javascript
addName: (state, action) => {
  state.names.push(action.payload); // No return
}

```

* If replacing the whole state, explicitly return the new object:

```javascript
resetUser: () => initialState // Returning a new value replaces the draft entirely

```

---

### Trap 2: Putting Non-Serializable Values in State or Actions

Redux DevTools, time-travel debugging, and state persistence rely on all data being strictly serializable into JSON.

* **The Mistake:** Storing promises, class instances, functions, Symbols, or non-serializable objects (like `new Date()`, `AxiosError`, `AbortController`, or DOM nodes) in the slice state or passing them through action payloads.

```javascript
// ❌ Broken: Storing non-serializable Date and Error instances
state.lastUpdated = new Date();
state.error = error; // entire error instance with methods/call stacks

```

* **The Symptoms:** Redux Toolkit’s serializability middleware throws runtime console warnings, and tools like Redux DevTools or state hydrators fail to serialize the store.
* **The Fix:** Convert non-serializable values into plain serializable structures before dispatching:

```javascript
// Pass strings, numbers, or plain objects
state.lastUpdated = new Date().toISOString();
state.error = error.message;

```

---

### Trap 3: Forgetting the RTK Query Middleware in `configureStore`

When adopting RTK Query for data fetching, developers often register the API's reducer in `configureStore` but forget to attach its generated middleware.

* **The Mistake:**

```javascript
// ❌ Broken: Reducer is added, but middleware is omitted
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Missing middleware setup!
});

```

* **The Symptoms:**
* Auto-fetching and subscriptions fail to update or cache correctly.
* Polling, cache refetching, and tag invalidation (`invalidatesTags`) stop working completely.
* You receive runtime errors warning that the RTK Query middleware was not detected.

* **The Fix:** Always chain the API slice's middleware into `getDefaultMiddleware`:

```javascript
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

```

Here is a complete, step-by-step implementation of a multi-step form featuring **logical sections (Wizard/Stepper)**, **controlled components** (integrated cleanly alongside uncontrolled performance), and **dynamic/conditional rendering**.

---

### Architecture Overview

1. **Step-by-Step Navigation (Stepper):** Break 20+ fields into 3 distinct logical steps (*Personal*, *Account & Role*, *Preferences & Dynamic Items*).
2. **Controlled vs. Uncontrolled Integration:** Use React Hook Form’s `Controller` for UI components that require strict controlled value tracking (e.g., custom dropdowns, sliders, or switch toggles).
3. **Conditional/Dynamic Fields:**

* Conditionally show fields based on another field’s value (e.g., show "Company Name" only if `role === 'business'`).
* Dynamically add/remove a list of items using `useFieldArray`.

1. **Step-by-Step Validation:** Only validate fields belonging to the current step before advancing.

---

### Step 1: Define the Zod Schema

Split schemas per step so each view validates independently before proceeding.

```javascript
import { z } from 'zod';

export const stepOneSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

export const stepTwoSchema = z.object({
  accountType: z.enum(['individual', 'business']),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  // Controlled component example: notification frequency
  notificationFrequency: z.enum(['daily', 'weekly', 'never']),
}).superRefine((val, ctx) => {
  if (val.accountType === 'business') {
    if (!val.companyName || val.companyName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['companyName'],
        message: 'Company Name is required for business accounts',
      });
    }
    if (!val.taxId || val.taxId.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['taxId'],
        message: 'Tax ID is required for business accounts',
      });
    }
  }
});

export const stepThreeSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(1, 'Skill name cannot be blank'),
      level: z.enum(['beginner', 'intermediate', 'expert']),
    })
  ).min(1, 'Add at least one skill'),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
});

export const fullFormSchema = stepOneSchema.and(stepTwoSchema).and(stepThreeSchema);

```

---

### Step 2: Implement the Multi-Step Form

```jsx
import React, { useState } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fullFormSchema } from './schemas';

const STEP_FIELDS = {
  0: ['fullName', 'email', 'phone'],
  1: ['accountType', 'companyName', 'taxId', 'notificationFrequency'],
  2: ['skills', 'termsAccepted'],
};

export default function ComplexMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(fullFormSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      accountType: 'individual',
      companyName: '',
      taxId: '',
      notificationFrequency: 'weekly',
      skills: [{ name: '', level: 'beginner' }],
      termsAccepted: false,
    },
  });

  // Dynamic list logic using useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  // Watch accountType for conditional rendering without re-rendering the whole form
  const selectedAccountType = useWatch({
    control,
    name: 'accountType',
  });

  // Validate only the current step before advancing
  const nextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data) => {
    console.log('Final Form Data Submitted:', data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {['1. Personal', '2. Account Info', '3. Skills & Review'].map((label, index) => (
          <div
            key={label}
            className={`text-sm font-semibold pb-2 border-b-2 ${
              currentStep === index
                ? 'border-blue-600 text-blue-600'
                : currentStep > index
                ? 'border-green-500 text-green-500'
                : 'border-gray-200 text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ================= STEP 1: Personal Details ================= */}
        {currentStep === 0 && (
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                {...register('fullName')}
                className="w-full border p-2 rounded"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="w-full border p-2 rounded"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                {...register('phone')}
                className="w-full border p-2 rounded"
                placeholder="+1 555-0199"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </section>
        )}

        {/* ================= STEP 2: Conditional & Controlled Section ================= */}
        {currentStep === 1 && (
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Account Type</label>
              <select {...register('accountType')} className="w-full border p-2 rounded">
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </div>

            {/* CONDITIONAL RENDERING: Displayed only when business is selected */}
            {selectedAccountType === 'business' && (
              <div className="p-4 bg-gray-50 border rounded space-y-4">
                <p className="text-sm font-semibold text-gray-600">Company Information</p>
                <div>
                  <label className="block text-sm font-medium">Company Name</label>
                  <input
                    {...register('companyName')}
                    className="w-full border p-2 rounded bg-white"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Corporate Tax ID</label>
                  <input
                    {...register('taxId')}
                    className="w-full border p-2 rounded bg-white"
                  />
                  {errors.taxId && (
                    <p className="text-red-500 text-xs mt-1">{errors.taxId.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* CONTROLLED COMPONENT: Using <Controller> for third-party or custom UI */}
            <div>
              <label className="block text-sm font-medium">Notification Frequency</label>
              <Controller
                name="notificationFrequency"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-4 mt-1">
                    {['daily', 'weekly', 'never'].map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => field.onChange(option)}
                        className={`px-3 py-1.5 rounded border capitalize text-sm ${
                          field.value === option
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>
          </section>
        )}

        {/* ================= STEP 3: Dynamic Arrays & Confirmation ================= */}
        {currentStep === 2 && (
          <section className="space-y-4">
            <label className="block text-sm font-medium">Skills & Specializations</label>
            
            {/* DYNAMIC LIST: Appending and removing nested fields */}
            {fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    {...register(`skills.${index}.name`)}
                    placeholder="Skill (e.g., React, Node)"
                    className="w-full border p-2 rounded text-sm"
                  />
                  {errors.skills?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.skills[index].name.message}
                    </p>
                  )}
                </div>

                <select
                  {...register(`skills.${index}.level`)}
                  className="border p-2 rounded text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="px-3 py-2 text-sm text-red-500 border border-red-200 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ name: '', level: 'beginner' })}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              + Add Another Skill
            </button>
            {errors.skills?.root && (
              <p className="text-red-500 text-xs mt-1">{errors.skills.root.message}</p>
            )}

            <div className="pt-4 border-t">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('termsAccepted')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">I accept terms and conditions</span>
              </label>
              {errors.termsAccepted && (
                <p className="text-red-500 text-xs mt-1">{errors.termsAccepted.message}</p>
              )}
            </div>
          </section>
        )}

        {/* ================= Action Buttons ================= */}
        <div className="flex justify-between pt-6 border-t">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Back
            </button>
          ) : <div />}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
            >
              Submit Application
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Key Patterns Applied

* **Per-Step Validation via `trigger([...keys])`:** Advancing to the next tab checks only current-step fields, allowing partial inputs without tripping future-step validation errors.
* **Granular Conditional Rendering (`useWatch`):** Using `useWatch` isolates value subscriptions to specific variables (like `accountType`), ensuring conditional branches render without forcing re-renders across unaffected inputs.
* **Controlled Component via `<Controller>`:** The notification frequency buttons demonstrate how to wrap non-standard UI controls with custom click handlers while preserving standard form validation and submission.
* **Array Memory Safety (`useFieldArray`):** Renders dynamic rows keyed by `fieldItem.id` (generated internally by RHF) rather than array indices, preventing focus loss and mismatched input states during deletions.
