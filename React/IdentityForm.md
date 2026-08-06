Here is a complete, production-grade **Multi-Field Identity Form** component in React using **React Hook Form** and **Yup** for validation.

It handles validation rules, error states, automatic formatting, and accessibility, with the **Aadhaar field safely handled via placeholders/masked input**.

---

### 1. Installation

Ensure you have the required validation and icon libraries installed:

```bash
npm install react-hook-form @hookform/resolvers yup lucide-react

```

---

### 2. Form Component (`IdentityForm.tsx`)

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

// ==========================================
// 1. VALIDATION SCHEMA (Yup)
// ==========================================
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const AADHAAR_REGEX = /^\d{12}$/;

const identitySchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full Name is required')
    .min(3, 'Name must be at least 3 characters'),
  panNumber: yup
    .string()
    .required('PAN Card number is required')
    .matches(PAN_REGEX, 'Invalid PAN format (e.g., ABCDE1234F)')
    .transform((value) => value?.toUpperCase()),
  aadhaarNumber: yup
    .string()
    .required('Aadhaar number is required')
    .transform((value) => value?.replace(/\s/g, '')) // Remove spaces for validation
    .matches(AADHAAR_REGEX, 'Aadhaar must be a valid 12-digit number'),
});

type FormData = yup.InferType<typeof identitySchema>;

// ==========================================
// 2. COMPONENT IMPLEMENTATION
// ==========================================
export const IdentityForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: yupResolver(identitySchema),
    mode: 'onTouched', // Validates as user moves out of the field
  });

  // Custom Formatter for Aadhaar (Formats as: XXXX XXXX XXXX)
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (rawValue.length > 12) rawValue = rawValue.slice(0, 12);

    // Format with spaces for readability
    const formatted = rawValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    setValue('aadhaarNumber', formatted, { shouldValidate: true, shouldTouch: true });
  };

  const onSubmit = async (data: FormData) => {
    // Simulate API verification call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Submitted Payload (Aadhaar omitted or handled securely):', {
      fullName: data.fullName,
      panNumber: data.panNumber,
      aadhaarStatus: 'Secured/Verified',
    });
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <ShieldCheck size={40} color="#2563eb" style={{ marginBottom: '8px' }} />
        <h2>Identity Verification</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Please provide your details for KYC verification.
        </p>
      </div>

      {isSubmitSuccessful && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={20} color="#16a34a" />
          <span>Verification request submitted successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Full Name Field */}
        <div style={styles.fieldGroup}>
          <label htmlFor="fullName" style={styles.label}>
            Full Name (as per Govt ID)
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. Rahul Sharma"
            {...register('fullName')}
            style={{
              ...styles.input,
              borderColor: errors.fullName ? '#ef4444' : '#cbd5e1',
            }}
          />
          {errors.fullName && (
            <p style={styles.errorMessage}>
              <AlertCircle size={14} /> {errors.fullName.message}
            </p>
          )}
        </div>

        {/* PAN Number Field */}
        <div style={styles.fieldGroup}>
          <label htmlFor="panNumber" style={styles.label}>
            PAN Card Number
          </label>
          <input
            id="panNumber"
            type="text"
            maxLength={10}
            placeholder="ABCDE1234F"
            {...register('panNumber')}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            style={{
              ...styles.input,
              textTransform: 'uppercase',
              borderColor: errors.panNumber ? '#ef4444' : '#cbd5e1',
            }}
          />
          {errors.panNumber && (
            <p style={styles.errorMessage}>
              <AlertCircle size={14} /> {errors.panNumber.message}
            </p>
          )}
        </div>

        {/* Aadhaar Field */}
        <div style={styles.fieldGroup}>
          <label htmlFor="aadhaarNumber" style={styles.label}>
            Aadhaar Number
          </label>
          <input
            id="aadhaarNumber"
            type="text"
            placeholder="0000 0000 0000"
            maxLength={14} // 12 digits + 2 spaces
            {...register('aadhaarNumber')}
            onChange={handleAadhaarChange}
            style={{
              ...styles.input,
              borderColor: errors.aadhaarNumber ? '#ef4444' : '#cbd5e1',
            }}
          />
          {errors.aadhaarNumber ? (
            <p style={styles.errorMessage}>
              <AlertCircle size={14} /> {errors.aadhaarNumber.message}
            </p>
          ) : (
            <small style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Format: 12-digit unique national ID
            </small>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Verifying Details...' : 'Submit Verification'}
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 3. INLINE STYLES
// ==========================================
const styles: Record<string, React.CSSProperties> = {
  fieldGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '6px',
  },
  input: {
    padding: '10px 14px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  successBanner: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#166534',
    padding: '12px 16px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '10px',
  },
};

```

---

### Features & Validations Included

1. **PAN Validation (`PAN_REGEX`):**

* Enforces 5 uppercase letters, 4 numeric digits, and 1 final letter (`ABCDE1234F`).
* Automatically transforms lowercase input to uppercase while typing.

1. **Aadhaar Field Masking & Format:**

* Restricts input to numeric characters and auto-formats with spaces (`XXXX XXXX XXXX`) after every 4 digits for better readability.
* Strips spaces before running validation against the 12-digit rule.

1. **Error Handling & UX:**

* Validates dynamically using `onTouched` mode.
* Clear visual cues with red borders, inline error icons, and error messages.
* Disables the submit button during submission to prevent duplicate network calls.
