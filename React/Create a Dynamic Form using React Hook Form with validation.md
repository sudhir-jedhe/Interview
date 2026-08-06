Here is a complete, production-ready implementation of a **Dynamic Form** using **React Hook Form** (v7) and **TypeScript**.

This example uses React Hook Form's built-in `useFieldArray` hook to dynamically add, remove, and validate fields (e.g., adding multiple user skill sets or experience entries).

---

### Installation

```bash
npm install react-hook-form

```

---

### 1. The Dynamic Form Component (`DynamicForm.tsx`)

```tsx
import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';

// TypeScript types for form structure
interface SkillInput {
  name: string;
  experienceYears: number;
}

interface FormValues {
  developerName: string;
  email: string;
  skills: SkillInput[];
}

export function DynamicForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      developerName: '',
      email: '',
      skills: [{ name: '', experienceYears: 1 }], // Default initial row
    },
    mode: 'onTouched', // Validates on blur/interaction
  });

  // useFieldArray handles dynamic array manipulation
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Submitted Dynamic Form Data:', data);
    alert('Form submitted successfully! Check console for payload.');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Developer Profile (Dynamic Form)</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* --- Static Field 1: Developer Name --- */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="developerName" style={{ display: 'block', fontWeight: 'bold' }}>
            Developer Name *
          </label>
          <input
            id="developerName"
            type="text"
            {...register('developerName', { required: 'Developer name is required' })}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.developerName && (
            <p style={{ color: 'red', fontSize: '14px', margin: '4px 0 0' }}>
              {errors.developerName.message}
            </p>
          )}
        </div>

        {/* --- Static Field 2: Email --- */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold' }}>
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.email && (
            <p style={{ color: 'red', fontSize: '14px', margin: '4px 0 0' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* --- Dynamic Section: Skills Array --- */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Skills & Experience</legend>

          {fields.map((field, index) => (
            <div
              key={field.id} // Always use field.id as key for React Hook Form arrays
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: index !== fields.length - 1 ? '1px dashed #eee' : 'none',
              }}
            >
              {/* Skill Name */}
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: '12px' }}>Skill Name *</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js"
                  {...register(`skills.${index}.name` as const, {
                    required: 'Skill name is required',
                  })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.skills?.[index]?.name && (
                  <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0' }}>
                    {errors.skills[index]?.name?.message}
                  </p>
                )}
              </div>

              {/* Experience Years */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px' }}>Years *</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  {...register(`skills.${index}.experienceYears` as const, {
                    required: 'Required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Min 1 year' },
                  })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                {errors.skills?.[index]?.experienceYears && (
                  <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0' }}>
                    {errors.skills[index]?.experienceYears?.message}
                  </p>
                )}
              </div>

              {/* Remove Button */}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  style={{
                    marginTop: '20px',
                    padding: '8px 12px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* Add Skill Button */}
          <button
            type="button"
            onClick={() => append({ name: '', experienceYears: 1 })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            + Add Another Skill
          </button>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
}

```

---

### Key Features Used

1. **`useFieldArray`:** Provides helper methods like `append()` and `remove()` to dynamically modify the fields array without losing user input state or field focus.
2. **`field.id` for Keys:** When rendering `fields.map()`, React requires `key={field.id}` (generated automatically by `useFieldArray`) instead of using array indexes to ensure proper rendering and state alignment during re-orders or deletions.
3. **Dot-Notation Registration (`skills.${index}.name`):** React Hook Form natively parses nested field paths and array indices into a structured JSON payload upon submission.
4. **Typed Error Messaging:** Accessing `errors.skills?.[index]?.name?.message` provides type-safe, field-specific error feedback for every dynamically created row.
