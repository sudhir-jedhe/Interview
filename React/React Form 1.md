Here is a **production-ready, highly performant React Form architecture** that ticks all 6 requirements.

It combines **React Hook Form** (uncontrolled performance & scalable state) with **Zod** (type-safe validation schema), **TypeScript**, and **Tailwind CSS**. It includes a **reusable field architecture** that handles standard inputs, selects, and checkboxes with built-in accessibility (A11y).

---

## 1. Reusable Accessible Form Field Component (`FormField.tsx`)

This wrapper handles **labels, inputs, error messages, and ARIA attributes** cleanly. Placing `aria-invalid` and `aria-describedby` here ensures every field in your app is screen-reader accessible out of the box.

```tsx
import React, { useId } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: (inputProps: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
  }) => React.ReactNode;
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Build space-separated ARIA describedby IDs for screen readers
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      {hint && (
        <span id={hintId} className="text-xs text-slate-500">
          {hint}
        </span>
      )}

      {/* Render Slot for actual Input / Select / Checkbox */}
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
      })}

      {/* A11y: Live region reads errors automatically when they appear */}
      {error && (
        <span id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}

```

---

## 2. Validation Schema & TypeScript Types (`schema.ts`)

Using **Zod**, we define strict validation rules. Real-time validation, string trimming, and cross-field matches (e.g., password confirmation) are declared declaratively outside component render cycles.

```typescript
import { z } from 'zod';

export const userRegistrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name cannot exceed 50 characters'),

    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),

    role: z.enum(['developer', 'designer', 'manager', 'other'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms to proceed',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Attach error to confirmPassword field
  });

// Single Source of Truth TypeScript Type
export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;

```

---

## 3. The Complete Scalable Form Component (`RegistrationForm.tsx`)

By setting `mode: 'onChange'` inside `useForm`, validation triggers in **real-time as the user types**. The submit button automatically disables until all fields pass validation (`!isValid`) or while a submission is in flight (`isSubmitting`).

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from './FormField';
import { userRegistrationSchema, UserRegistrationFormData } from './schema';

export function RegistrationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    mode: 'onChange', // Real-time validation on keystroke/blur
    defaultValues: {
      fullName: '',
      email: '',
      role: 'developer',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: UserRegistrationFormData) => {
    try {
      // Simulate API Submission
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log('Valid Payload:', data);
      alert('Account created successfully!');
      reset();
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  // Submit button stays disabled until form is touched, valid, and not submitting
  const isSubmitDisabled = !isDirty || !isValid || isSubmitting;

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h2>
      <p className="text-sm text-slate-500 mb-6">Enter your details to register.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Field 1: Full Name */}
        <FormField label="Full Name" error={errors.fullName?.message}>
          {(a11yProps) => (
            <input
              {...a11yProps}
              {...register('fullName')}
              type="text"
              placeholder="e.g. Sudhir Jedhe"
              className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition ${
                errors.fullName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
          )}
        </FormField>

        {/* Field 2: Email */}
        <FormField label="Email Address" error={errors.email?.message}>
          {(a11yProps) => (
            <input
              {...a11yProps}
              {...register('email')}
              type="email"
              placeholder="name@company.com"
              className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition ${
                errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
          )}
        </FormField>

        {/* Field 3: Select Role */}
        <FormField label="Role" error={errors.role?.message}>
          {(a11yProps) => (
            <select
              {...a11yProps}
              {...register('role')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500"
            >
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Product Manager</option>
              <option value="other">Other</option>
            </select>
          )}
        </FormField>

        {/* Field 4: Password */}
        <FormField
          label="Password"
          hint="At least 8 chars, 1 uppercase, and 1 number."
          error={errors.password?.message}
        >
          {(a11yProps) => (
            <input
              {...a11yProps}
              {...register('password')}
              type="password"
              className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition ${
                errors.password ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
          )}
        </FormField>

        {/* Field 5: Confirm Password */}
        <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
          {(a11yProps) => (
            <input
              {...a11yProps}
              {...register('confirmPassword')}
              type="password"
              className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition ${
                errors.confirmPassword ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
          )}
        </FormField>

        {/* Field 6: Checkbox */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <input
              id="termsAccepted"
              type="checkbox"
              {...register('termsAccepted')}
              aria-invalid={Boolean(errors.termsAccepted)}
              aria-describedby={errors.termsAccepted ? 'terms-error' : undefined}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="termsAccepted" className="text-sm text-slate-700">
              I agree to the Terms and Conditions
            </label>
          </div>
          {errors.termsAccepted && (
            <span id="terms-error" role="alert" className="block text-xs font-medium text-red-600 mt-1">
              {errors.termsAccepted.message}
            </span>
          )}
        </div>

        {/* Submit Button (Disabled Until Form Passes Validation) */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          aria-disabled={isSubmitDisabled}
          className={`w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white transition ${
            isSubmitDisabled
              ? 'bg-slate-300 cursor-not-allowed opacity-70'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer shadow'
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

```

---

## Architectural Breakdown of the 6 Features

| Requirement                       | Implementation Detail                                                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Multiple Input Fields**      | Demonstrates text, email, password, dropdown select, and checkbox fields bound seamlessly in one form state.                                    |
| **2. Real-time Validation**       | `useForm({ mode: 'onChange' })` re-runs Zod checks instantly on every keystroke/touch without blocking the UI thread.                           |
| **3. Disable Submit Until Valid** | Driven by React Hook Form's `isValid` & `isDirty` state flags: `disabled={!isDirty                                                              |  | !isValid |  | isSubmitting}`. |
| **4. Reusable Architecture**      | `FormField` uses the render-prop pattern to inject dynamic `id`, `aria-invalid`, and `aria-describedby` props into any child input element.     |
| **5. Accessibility (A11y)**       | Direct label-to-input binding (`htmlFor`/`id`), error notifications via `role="alert"`, and explicit `aria-invalid` / `aria-describedby` links. |
| **6. Scalable for Large Forms**   | React Hook Form uses **uncontrolled inputs under the hood**, avoiding main-thread keystroke re-renders across parent containers.                |
