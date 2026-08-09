Building a scalable multi-step wizard form requires decoupling each step's validation schema while maintaining a single, unified form state across navigation steps.

By combining **React Hook Form**, **Zod**, and **TypeScript**, you can validate fields dynamically per step and preserve input data when users navigate backward and forward.

---

## Architecture Overview

1. **Step-by-Step Zod Schemas:** Define individual schemas per step, then merge them into a single master schema using `.merge()`.
2. **Unified State in Parent:** The parent component manages the current step counter (`step`) and holds the cumulative form values.
3. **`trigger()` Validation:** Before advancing to the next step, call React Hook Form's `trigger(['field1', 'field2'])` to validate only the fields relevant to the current step.
4. **Persistent Form Instance:** Keep `<form>` mounted in the parent so moving backward or forward never resets state or forces unmounting.

---

## 1. Define Step-by-Step Schemas (`schema.ts`)

```typescript
import { z } from 'zod';

// Step 1: Personal Info
export const stepOneSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

// Step 2: Account Security
export const stepTwoSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Step 3: Profile Configuration
export const stepThreeSchema = z.object({
  role: z.enum(['developer', 'designer', 'manager'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
  notifications: z.boolean().default(true),
});

// Combined Master Schema & Types
export const wizardSchema = stepOneSchema
  .merge(z.object({ password: z.string(), confirmPassword: z.string() }))
  .merge(stepThreeSchema);

export type WizardFormData = z.infer<typeof stepOneSchema> &
  z.infer<typeof stepTwoSchema> &
  z.infer<typeof stepThreeSchema>;

```

---

## 2. Define Step Field Keys for Validation Triggers (`constants.ts`)

Explicitly list which form keys belong to each step so `trigger()` validates only active fields.

```typescript
import { WizardFormData } from './schema';

export const STEP_FIELDS: Record<number, (keyof WizardFormData)[]> = {
  1: ['fullName', 'email'],
  2: ['password', 'confirmPassword'],
  3: ['role', 'bio', 'notifications'],
};

export const TOTAL_STEPS = 3;

```

---

## 3. Implement Sub-Step Components

Each step component receives `register`, `errors`, and `control` directly from the parent form context.

```tsx
// components/StepOne.tsx
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { WizardFormData } from '../schema';

interface StepProps {
  register: UseFormRegister<WizardFormData>;
  errors: FieldErrors<WizardFormData>;
}

export function StepOne({ register, errors }: StepProps) {
  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Step 1: Personal Details</h3>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Full Name</label>
        <input
          type="text"
          {...register('fullName')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.fullName && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Email Address</label>
        <input
          type="email"
          {...register('email')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.email && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.email.message}
          </p>
        )}
      </div>
    </div>
  );
}

```

```tsx
// components/StepTwo.tsx
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { WizardFormData } from '../schema';

export function StepTwo({ register, errors }: StepProps) {
  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Step 2: Security Credentials</h3>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Password</label>
        <input
          type="password"
          {...register('password')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.password && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Confirm Password</label>
        <input
          type="password"
          {...register('confirmPassword')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.confirmPassword && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </div>
  );
}

```

```tsx
// components/StepThree.tsx
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { WizardFormData } from '../schema';

export function StepThree({ register, errors }: StepProps) {
  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Step 3: Preferences</h3>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Role</label>
        <select {...register('role')} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Product Manager</option>
        </select>
        {errors.role && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.role.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Bio (Optional)</label>
        <textarea
          {...register('bio')}
          rows={3}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.bio && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.bio.message}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="notifications" {...register('notifications')} />
        <label htmlFor="notifications">Receive email notifications</label>
      </div>
    </div>
  );
}

```

---

## 4. Main Wizard Container (`MultiStepWizard.tsx`)

The main container initializes `useForm` once, renders step indicators, and handles step navigation with target validation.

```tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stepOneSchema, stepTwoSchema, stepThreeSchema, WizardFormData } from './schema';
import { STEP_FIELDS, TOTAL_STEPS } from './constants';
import { StepOne } from './StepOne';
import { StepTwo } from './StepTwo';
import { StepThree } from './StepThree';

// Select resolver dynamically depending on active step
const STEP_SCHEMAS = {
  1: stepOneSchema,
  2: stepTwoSchema,
  3: stepThreeSchema,
};

export function MultiStepWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize unified form instance
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<WizardFormData>({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'developer',
      bio: '',
      notifications: true,
    },
  });

  // Advance step ONLY if current step fields are valid
  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: WizardFormData) => {
    console.log('Final Wizard Payload:', data);
    alert('Wizard completed successfully!');
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '30px auto',
        padding: '24px',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Progress Bar Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600 }}>
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span style={{ color: '#64748b', fontSize: '14px' }}>
            {Math.round((currentStep / TOTAL_STEPS) * 100)}% Completed
          </span>
        </div>
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${(currentStep / TOTAL_STEPS) * 100}%`,
              background: '#2563eb',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Persistent Form Container */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step Views */}
        {currentStep === 1 && <StepOne register={register} errors={errors} />}
        {currentStep === 2 && <StepTwo register={register} errors={errors} />}
        {currentStep === 3 && <StepThree register={register} errors={errors} />}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: currentStep === 1 ? '#f1f5f9' : '#fff',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Back
          </button>

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Next Step →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#16a34a',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Registration'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

## Architectural Advantages

| Pattern Feature                 | Benefit                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **`trigger(fields)` Isolation** | Validates only active fields on `Next`, preventing unrendered step errors from blocking step progress.                         |
| **Step State Preservation**     | Inputs stay mounted in a single top-level `useForm` instance, preserving form state automatically across back/next navigation. |
| **Modular Sub-Components**      | Each step function receives typed `register` and `errors` props without needing complex global state providers like Redux.     |
| **Sub-Schema Composition**      | Step schemas are independently defined and composed using `.merge()`, guaranteeing strict type safety.                         |

Show me how to persist React Hook Form multi-step state in SessionStorage or URL query parameters.

Persisting multi-step form state ensures users never lose their progress if they refresh the page, navigate away accidentally, or share a link to a specific step.

Below are the two primary approaches:

1. **`SessionStorage` Approach:** Best for sensitive multi-step data (checkout, user onboarding) that should persist across page refreshes within a session, but stay private to that tab.
2. **`URL Query Parameters` Approach:** Best for shareable state, filters, or search wizards where step numbers and non-sensitive options should be deep-linkable.

---

## Method 1: Persistence using `SessionStorage`

This pattern synchronizes form data to `sessionStorage` in real-time as the user types using `useWatch` or `watch`, and initializes `useForm` with that stored state on mount.

### Step 1: Storage Helper Hook (`useFormSessionStorage.ts`)

```typescript
import { useEffect } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

export function useFormSessionStorage<T extends FieldValues>(
  storageKey: string,
  methods: UseFormReturn<T>
) {
  const { watch, reset } = methods;

  // 1. Load saved data on initial mount
  useEffect(() => {
    const savedData = sessionStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Reset form with stored values
        reset(parsed);
      } catch (err) {
        console.error('Failed to parse stored form state:', err);
      }
    }
  }, [storageKey, reset]);

  // 2. Subscribe to form changes and persist to SessionStorage
  useEffect(() => {
    const subscription = watch((value) => {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
    });
    // Unsubscribe listener when component unmounts
    return () => subscription.unsubscribe();
  }, [watch, storageKey]);
}

```

### Step 2: Implementation in Wizard Component

```tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormSessionStorage } from './useFormSessionStorage';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  plan: z.enum(['free', 'pro', 'enterprise']),
});

type FormData = z.infer<typeof formSchema>;

const STORAGE_KEY = 'ONBOARDING_WIZARD_DATA';
const STEP_KEY = 'ONBOARDING_WIZARD_STEP';

export function SessionStorageWizard() {
  // Restore initial step from sessionStorage or default to 1
  const [step, setStep] = useState<number>(() => {
    const savedStep = sessionStorage.getItem(STEP_KEY);
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      plan: 'pro',
    },
  });

  const { register, handleSubmit, trigger, formState: { errors } } = methods;

  // Auto-persist form input state to SessionStorage
  useFormSessionStorage(STORAGE_KEY, methods);

  // Persist active step index to SessionStorage
  useEffect(() => {
    sessionStorage.setItem(STEP_KEY, step.toString());
  }, [step]);

  const handleNext = async () => {
    const fieldsToValidate = step === 1 ? ['fullName', 'email'] : ['plan'];
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep((s) => s + 1);
  };

  const onSubmit = (data: FormData) => {
    console.log('Final Payload:', data);
    alert('Submitted successfully!');
    // Clear storage upon completion
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STEP_KEY);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <h2>Multi-Step Form (SessionStorage Persisted)</h2>
      <p style={{ color: '#666' }}>Try refreshing the page — your input remains intact!</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div>
            <label style={{ display: 'block' }}>Full Name</label>
            <input {...register('fullName')} style={{ width: '100%', padding: '8px' }} />
            {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName.message}</p>}

            <label style={{ display: 'block', marginTop: '12px' }}>Email</label>
            <input {...register('email')} style={{ width: '100%', padding: '8px' }} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <label style={{ display: 'block' }}>Select Plan</label>
            <select {...register('plan')} style={{ width: '100%', padding: '8px' }}>
              <option value="free">Free</option>
              <option value="pro">Pro ($19/mo)</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)}>Back</button>}
          {step === 1 ? (
            <button type="button" onClick={handleNext}>Next →</button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

## Method 2: Persistence using URL Query Parameters (Deep-Linkable)

This approach stores step counters and non-sensitive options directly in the URL query string (e.g., `?step=2&plan=pro`). It allows users to copy/paste or bookmark their exact location in the wizard.

### Code Example (React Router / Next.js / Standard Web API)

```tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  category: z.string().min(1, 'Select a category'),
  budget: z.coerce.number().min(100, 'Minimum budget is $100'),
});

type WizardQueryData = z.infer<typeof schema>;

export function UrlPersistedWizard() {
  // Read current URL parameters on initial render
  const getUrlParams = () => new URLSearchParams(window.location.search);

  const currentStep = parseInt(getUrlParams().get('step') || '1', 10);

  const methods = useForm<WizardQueryData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: getUrlParams().get('category') || 'engineering',
      budget: Number(getUrlParams().get('budget')) || 500,
    },
  });

  const { register, handleSubmit, watch } = methods;

  // Sync form state changes back into the URL query string without reloading page
  useEffect(() => {
    const subscription = watch((values) => {
      const params = new URLSearchParams(window.location.search);
      
      if (values.category) params.set('category', values.category);
      if (values.budget) params.set('budget', values.budget.toString());
      
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl); // Updates URL without adding history stack noise
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // Navigate step via URL
  const updateStepInUrl = (nextStep: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('step', nextStep.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, '', newUrl); // pushState allows browser Back button to return to step 1
    window.dispatchEvent(new Event('popstate')); // Trigger update
  };

  const onSubmit = (data: WizardQueryData) => {
    console.log('Final Payload:', data);
    alert('Submitted from URL parameters!');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <h2>URL-Persisted Wizard (Step {currentStep})</h2>
      <p style={{ color: '#666', fontSize: '13px' }}>
        Current URL: <code>{window.location.search || '?step=1'}</code>
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && (
          <div>
            <label style={{ display: 'block' }}>Category</label>
            <select {...register('category')} style={{ width: '100%', padding: '8px' }}>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>
            <button
              type="button"
              onClick={() => updateStepInUrl(2)}
              style={{ marginTop: '16px' }}
            >
              Next: Budget →
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <label style={{ display: 'block' }}>Estimated Budget ($)</label>
            <input
              type="number"
              {...register('budget')}
              style={{ width: '100%', padding: '8px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button type="button" onClick={() => updateStepInUrl(1)}>
                ← Back
              </button>
              <button type="submit">Submit</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

```

---

## Summary Comparison: When to Use Which

| Feature                         | `SessionStorage`                                                                      | `URL Query Parameters`                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Security / Privacy**          | High (Data remains private in client memory, not exposed in browser history or URLs). | Low (Data is visible in the browser URL bar and search history).          |
| **Shareability / Deep Linking** | No (Copying the URL will not recreate the state on another device/tab).               | **Yes** (Sending the link shares the exact step and selection).           |
| **Browser Back Button Support** | Requires custom event handling.                                                       | **Native** (Browser back/forward works out of the box using `pushState`). |
| **Storage Limit**               | ~5MB of JSON data.                                                                    | Limited by URL string length (~2,000 characters).                         |
| **Ideal Use Cases**             | User Registration, Credit Card Checkouts, Sensitive Multi-step Applications.          | Search Filters, Product Customizer Wizards, Shareable Surveys.            |

Show me how to use FormProvider and useFormContext in React Hook Form for deeply nested component trees.

In large or deeply nested forms (like multi-tab dashboards or multi-step wizards), passing `register`, `control`, and `errors` down through multiple layers of child components via props becomes tedious and error-prone (prop drilling).

React Hook Form provides **`FormProvider`** and **`useFormContext`** to solve this. `FormProvider` wraps your form container in a React Context, allowing any deeply nested child component to access form methods directly via `useFormContext()`.

---

## 1. How It Works

```
                     ┌────────────────────────────────┐
                     │          <FormProvider>        │  (Provides React Hook Form Context)
                     └────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        ┌──────────────────┐                   ┌──────────────────┐
        │  PersonalSection │                   │  AddressSection  │  (Intermediate Parents)
        └──────────────────┘                   └──────────────────┘
                 │                                       │
                 ▼                                       ▼
    ┌──────────────────────────┐           ┌──────────────────────────┐
    │  useFormContext()        │           │  useFormContext()        │  (Deeply Nested Inputs)
    │  <Input name="fullName"> │           │  <Input name="city">     │
    └──────────────────────────┘           └──────────────────────────┘

```

---

## 2. Complete Code Example

Below is a type-safe example demonstrating how to structure deeply nested form sections without passing props.

### Step 1: Define Zod Schema & Types (`schema.ts`)

```typescript
import { z } from 'zod';

export const userProfileSchema = z.object({
  personal: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
  }),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
  }),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

```

---

### Step 2: Build Deeply Nested Sub-Components (`SubSections.tsx`)

Instead of accepting `register` or `errors` as props, child components call **`useFormContext<UserProfileFormData>()`** to retrieve form methods directly.

```tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { UserProfileFormData } from './schema';

// -------------------------------------------------------------
// Deep Child 1: Personal Info Section
// -------------------------------------------------------------
export function PersonalInfoSection() {
  // Grab methods directly from Context
  const {
    register,
    formState: { errors },
  } = useFormContext<UserProfileFormData>();

  return (
    <fieldset style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
      <legend style={{ fontWeight: 600 }}>Personal Information</legend>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block' }}>Full Name:</label>
        <input
          type="text"
          {...register('personal.fullName')} // Path matching nested schema
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.personal?.fullName && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.personal.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label style={{ display: 'block' }}>Email Address:</label>
        <input
          type="email"
          {...register('personal.email')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.personal?.email && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.personal.email.message}
          </p>
        )}
      </div>
    </fieldset>
  );
}

// -------------------------------------------------------------
// Deep Child 2: Address Section
// -------------------------------------------------------------
export function AddressSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserProfileFormData>();

  return (
    <fieldset style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
      <legend style={{ fontWeight: 600 }}>Shipping Address</legend>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block' }}>Street Address:</label>
        <input
          type="text"
          {...register('address.street')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.address?.street && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.address.street.message}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block' }}>City:</label>
          <input
            type="text"
            {...register('address.city')}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.address?.city && (
            <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
              {errors.address.city.message}
            </p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block' }}>Zip Code:</label>
          <input
            type="text"
            {...register('address.zipCode')}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.address?.zipCode && (
            <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
              {errors.address.zipCode.message}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}

```

---

### Step 3: Wrap Main Component with `FormProvider` (`UserProfileForm.tsx`)

Initialize `useForm` at the top level and pass all returned methods to `<FormProvider {...methods}>`.

```tsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, UserProfileFormData } from './schema';
import { PersonalInfoSection, AddressSection } from './SubSections';

export function UserProfileForm() {
  // 1. Initialize useForm
  const methods = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      personal: { fullName: '', email: '' },
      address: { street: '', city: '', zipCode: '' },
    },
  });

  const onSubmit = (data: UserProfileFormData) => {
    console.log('Submitted Profile Data:', data);
    alert('Profile saved successfully!');
  };

  return (
    // 2. Wrap the form tree with FormProvider
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{
          maxWidth: '500px',
          margin: '30px auto',
          padding: '24px',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          fontFamily: 'sans-serif',
        }}
      >
        <h2>Account Settings</h2>

        {/* Deeply nested components require NO props! */}
        <PersonalInfoSection />
        <AddressSection />

        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {methods.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </FormProvider>
  );
}

```

---

## 3. Creating Reusable Input Components with `useFormContext`

You can also build generic, accessible form input elements that subscribe to context automatically.

```tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
}

export function FormInput({ name, label, type = 'text' }: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Helper function to resolve nested error messages (e.g., errors.personal?.fullName)
  const getNestedError = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  const error = getNestedError(errors, name);

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontWeight: 600 }}>{label}</label>
      <input
        type={type}
        {...register(name)}
        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
      />
      {error && (
        <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
          {error.message}
        </p>
      )}
    </div>
  );
}

```

### Usage anywhere inside `<FormProvider>`

```tsx
<FormInput name="personal.fullName" label="Full Name" />
<FormInput name="address.city" label="City" />

```

---

## When to Use `FormProvider`

| Scenario                                                     | Use Props | Use `FormProvider` |
| ------------------------------------------------------------ | --------- | ------------------ |
| **Simple form (1 layer of inputs)**                          | ✅         | ❌ (Overkill)       |
| **Medium form (1–2 shallow sub-components)**                 | ✅         | ❌                  |
| **Deeply nested form sections (Tabs, Accordions, Steps)**    | ❌         | ✅                  |
| **Reusable custom input library (`<FormInput name="...">`)** | ❌         | ✅                  |

Show me how to use useWatch and useFormState in React Hook Form to optimize re-renders in large forms.

In large forms with dozens or hundreds of fields, calling `watch()` or checking `formState` at the root component level forces the **entire form container** (and all its child components) to re-render whenever a single watched field or form status changes.

React Hook Form provides two isolated hooks—**`useWatch`** and **`useFormState`**—that leverage custom subscription patterns. They isolate re-renders **strictly to the individual child component** calling the hook, keeping the rest of the form tree completely untouched.

---

## 1. `useWatch`: Isolated Field Subscriptions

### The Problem with Root `watch()`

```tsx
// ❌ BAD: Re-renders ParentForm AND all 50 child inputs on EVERY keystroke in "firstName"
export function ParentForm() {
  const { watch, register } = useForm();
  const firstName = watch('firstName'); // Causes root re-render

  return (
    <form>
      <input {...register('firstName')} />
      <ExpensiveList /> {/* Re-renders unnecessarily! */}
      <Preview name={firstName} />
    </form>
  );
}

```

### The Solution: `useWatch` in a Child Component

By moving the subscription into a dedicated child component, **only that child re-renders** when the target field changes.

```tsx
import React from 'react';
import { useForm, useWatch, Control } from 'react-hook-form';

interface FormInputs {
  firstName: string;
  lastName: string;
  age: number;
}

// ✅ GOOD: Isolated Child Component
function NamePreview({ control }: { control: Control<FormInputs> }) {
  // Subscribes ONLY to 'firstName' and 'lastName'
  // ONLY NamePreview re-renders when these two inputs change
  const [firstName, lastName] = useWatch({
    control,
    name: ['firstName', 'lastName'],
  });

  return (
    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
      <strong>Live Header Preview:</strong> {firstName || 'Guest'} {lastName}
    </div>
  );
}

export function IsolatedWatchForm() {
  const { register, control, handleSubmit } = useForm<FormInputs>({
    defaultValues: { firstName: '', lastName: '', age: 18 },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      {/* Isolated subscriber - parent does NOT re-render when typing here */}
      <NamePreview control={control} />

      <div style={{ marginTop: '12px' }}>
        <input {...register('firstName')} placeholder="First Name" />
        <input {...register('lastName')} placeholder="Last Name" />
        <input type="number" {...register('age')} placeholder="Age" />
      </div>

      <button type="submit">Save</button>
    </form>
  );
}

```

---

## 2. `useFormState`: Isolated Form Status Subscriptions

### The Problem with Root `formState`

Destructuring `formState` (like `isDirty`, `isValid`, or `isSubmitting`) at the root `useForm()` level subscribes the entire parent container to state changes across all fields.

### The Solution: `useFormState` in Action Buttons / Indicators

Use `useFormState` in dedicated child components (like a Save button or Status badge) to ensure status changes only re-render that specific UI element.

```tsx
import React from 'react';
import { useForm, useFormState, Control } from 'react-hook-form';

interface FormInputs {
  email: string;
  notes: string;
}

// ✅ Isolated Submit Button Component
function SubmitButton({ control }: { control: Control<FormInputs> }) {
  // Subscribes ONLY to isSubmitting, isDirty, and isValid for this button
  const { isSubmitting, isDirty, isValid } = useFormState({
    control,
  });

  return (
    <button
      type="submit"
      disabled={!isDirty || !isValid || isSubmitting}
      style={{
        padding: '8px 16px',
        backgroundColor: !isDirty || !isValid ? '#cbd5e1' : '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: !isDirty || !isValid ? 'not-allowed' : 'pointer',
      }}
    >
      {isSubmitting ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

// ✅ Isolated Form Dirty/Pristine Status Badge
function FormStatusBadge({ control }: { control: Control<FormInputs> }) {
  const { isDirty, dirtyFields } = useFormState({ control });

  const modifiedCount = Object.keys(dirtyFields).length;

  return (
    <span style={{ fontSize: '12px', color: isDirty ? '#d97706' : '#16a34a' }}>
      {isDirty ? `● ${modifiedCount} unsaved change(s)` : '✓ All changes saved'}
    </span>
  );
}

export function IsolatedStateForm() {
  const { register, control, handleSubmit } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: { email: '', notes: '' },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} style={{ maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Account Settings</h3>
        <FormStatusBadge control={control} />
      </div>

      <input {...register('email', { required: true })} placeholder="Email" style={{ width: '100%', marginBottom: '8px' }} />
      <textarea {...register('notes')} placeholder="Notes" style={{ width: '100%', marginBottom: '8px' }} />

      {/* Only this button re-renders when validation or dirty state updates */}
      <SubmitButton control={control} />
    </form>
  );
}

```

---

## 3. Combining `FormProvider`, `useWatch`, and `useFormContext`

When working with deeply nested form trees, you don't even need to pass `control` as a prop. Child components can access `control` implicitly using **`useFormContext()`**.

```tsx
import React from 'react';
import { useForm, FormProvider, useFormContext, useWatch, useFormState } from 'react-hook-form';

// Deep child subscribing via Context + useWatch
function RealTimeTotal() {
  const { control } = useFormContext(); // Reads control from FormProvider
  
  const [quantity, price] = useWatch({
    control,
    name: ['quantity', 'price'],
  });

  const total = (Number(quantity) || 0) * (Number(price) || 0);

  return <div>Total Price: ${total.toFixed(2)}</div>;
}

// Deep child subscribing via Context + useFormState
function SaveIndicator() {
  const { control } = useFormContext();
  const { isSubmitting } = useFormState({ control });

  return isSubmitting ? <span>Saving data...</span> : null;
}

export function LargeFormDashboard() {
  const methods = useForm({
    defaultValues: { quantity: 1, price: 50 },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <input type="number" {...methods.register('quantity')} />
        <input type="number" {...methods.register('price')} />

        {/* These components isolate their own re-renders */}
        <RealTimeTotal />
        <SaveIndicator />

        <button type="submit">Checkout</button>
      </form>
    </FormProvider>
  );
}

```

---

## Performance Comparison Summary

| Method                    | Component Scope | Re-render Radius                                                               |
| ------------------------- | --------------- | ------------------------------------------------------------------------------ |
| **`useForm().watch()`**   | Root Form       | **Entire Form Container** and all child elements re-render on every keystroke. |
| **`useForm().formState`** | Root Form       | **Entire Form Container** re-renders on any validation/dirty flag update.      |
| **`useWatch()`**          | Child Component | **Only the specific child component** calling `useWatch` re-renders.           |
| **`useFormState()`**      | Child Component | **Only the specific child component** (e.g. `<SubmitButton/>`) re-renders.     |

In large or deeply nested form structures (such as multi-tab forms, accordions, or complex wizards), passing `register`, `control`, and `errors` down through multiple layers of props creates unnecessary prop drilling.

React Hook Form provides **`FormProvider`** and **`useFormContext`** to solve this. `FormProvider` wraps the parent container in a React Context, allowing any deeply nested child component to directly access form methods and state.

---

## How It Works

```
                     ┌────────────────────────────────┐
                     │          <FormProvider>        │  (Provides React Hook Form Context)
                     └────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        ┌──────────────────┐                   ┌──────────────────┐
        │  PersonalSection │                   │  AddressSection  │  (Intermediate Parents)
        └──────────────────┘                   └──────────────────┘
                 │                                       │
                 ▼                                       ▼
    ┌──────────────────────────┐           ┌──────────────────────────┐
    │  useFormContext()        │           │  useFormContext()        │  (Deeply Nested Inputs)
    │  <Input name="fullName"> │           │  <Input name="city">     │
    └──────────────────────────┘           └──────────────────────────┘

```

---

## 1. Schema & Types Definition (`schema.ts`)

Define a nested validation schema using **Zod** and infer the TypeScript type:

```typescript
import { z } from 'zod';

export const userProfileSchema = z.object({
  personal: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
  }),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
  }),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

```

---

## 2. Deeply Nested Sub-Components (`SubSections.tsx`)

Instead of taking `register` or `errors` via props, child components call **`useFormContext<UserProfileFormData>()`** to pull methods straight from context:

```tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { UserProfileFormData } from './schema';

// -------------------------------------------------------------
// Deep Child 1: Personal Info Section
// -------------------------------------------------------------
export function PersonalInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserProfileFormData>();

  return (
    <fieldset style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
      <legend style={{ fontWeight: 600 }}>Personal Information</legend>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 500 }}>Full Name:</label>
        <input
          type="text"
          {...register('personal.fullName')} // Path matching nested schema
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.personal?.fullName && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.personal.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 500 }}>Email Address:</label>
        <input
          type="email"
          {...register('personal.email')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.personal?.email && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.personal.email.message}
          </p>
        )}
      </div>
    </fieldset>
  );
}

// -------------------------------------------------------------
// Deep Child 2: Address Section
// -------------------------------------------------------------
export function AddressSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserProfileFormData>();

  return (
    <fieldset style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
      <legend style={{ fontWeight: 600 }}>Shipping Address</legend>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 500 }}>Street Address:</label>
        <input
          type="text"
          {...register('address.street')}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.address?.street && (
          <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
            {errors.address.street.message}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 500 }}>City:</label>
          <input
            type="text"
            {...register('address.city')}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.address?.city && (
            <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
              {errors.address.city.message}
            </p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 500 }}>Zip Code:</label>
          <input
            type="text"
            {...register('address.zipCode')}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.address?.zipCode && (
            <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
              {errors.address.zipCode.message}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}

```

---

## 3. Main Container with `FormProvider` (`UserProfileForm.tsx`)

Initialize `useForm` at the top level and spread all methods (`{...methods}`) into `<FormProvider>`:

```tsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, UserProfileFormData } from './schema';
import { PersonalInfoSection, AddressSection } from './SubSections';

export function UserProfileForm() {
  // 1. Initialize useForm
  const methods = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      personal: { fullName: '', email: '' },
      address: { street: '', city: '', zipCode: '' },
    },
  });

  const onSubmit = (data: UserProfileFormData) => {
    console.log('Submitted Profile Data:', data);
    alert('Profile saved successfully!');
  };

  return (
    // 2. Pass all form methods to FormProvider
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{
          maxWidth: '500px',
          margin: '30px auto',
          padding: '24px',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          fontFamily: 'sans-serif',
        }}
      >
        <h2>Account Settings</h2>

        {/* Deeply nested components require NO props! */}
        <PersonalInfoSection />
        <AddressSection />

        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {methods.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </FormProvider>
  );
}

```

---

## 4. Building Reusable Form Input Primitives

You can also create self-contained input primitives that automatically subscribe to the parent form context:

```tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
}

export function FormInput({ name, label, type = 'text' }: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Helper function to resolve nested error paths (e.g., "personal.fullName")
  const getNestedError = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  const error = getNestedError(errors, name);

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        {...register(name)}
        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
      />
      {error && (
        <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0' }}>
          {error.message}
        </p>
      )}
    </div>
  );
}

```

### Usage anywhere inside `<FormProvider>`

```tsx
<FormInput name="personal.fullName" label="Full Name" />
<FormInput name="address.city" label="City" />

```

---

## When to Use `FormProvider`

| Scenario                                          | Standard Props  | `FormProvider` |
| ------------------------------------------------- | --------------- | -------------- |
| **Simple Form (1 layer of components)**           | ✅ Preferred     | ❌ Overkill     |
| **Medium Form (Shallow sub-components)**          | ✅ Preferred     | ❌              |
| **Deeply Nested Trees (Tabs, Steps, Accordions)** | ❌ Prop Drilling | ✅ Recommended  |
| **Reusable Design System Input Library**          | ❌               | ✅ Recommended  |
