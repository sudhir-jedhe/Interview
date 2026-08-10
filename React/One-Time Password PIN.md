An **OTP (One-Time Password) / PIN input component** built for React with TypeScript and Tailwind CSS.

### Key Features

* **Auto-advance**: Focus automatically shifts to the next input upon entering a digit.
* **Backspace & Navigation**: Backspace shifts focus backward and deletes digits cleanly; arrow keys allow horizontal navigation.
* **Paste Support**: Users can paste a full OTP code (e.g. `123456`) directly into any slot.
* **Numeric Enforcement**: Only numeric characters are accepted.
* **Masking Option**: Easily toggle password/dots masking for security sensitive codes.

---

### Implementation

```tsx
import React, { useState, useRef, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  masked?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  masked = false,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    // Allow only numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take last entered character if multiple characters somehow passed
    const lastChar = value.substring(value.length - 1);
    newOtp[index] = lastChar;
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");

    // Trigger onComplete callback if all slots are filled
    if (combinedOtp.length === length && !newOtp.includes("")) {
      onComplete?.(combinedOtp);
    }

    // Auto-advance to next input if digit entered
    if (lastChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input value
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Sanitize to numbers only and restrict to required length
    const numericData = pastedData.replace(/\D/g, "").slice(0, length);
    if (!numericData) return;

    const newOtp = [...otp];
    for (let i = 0; i < numericData.length; i++) {
      newOtp[i] = numericData[i];
    }
    setOtp(newOtp);

    // Focus last filled input or next empty slot
    const nextFocusIndex = Math.min(numericData.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length && !newOtp.includes("")) {
      onComplete?.(combinedOtp);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          type={masked ? "password" : "text"}
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all shadow-xs select-none"
        />
      ))}
    </div>
  );
};

```

---

### Usage Example

Here is a verification screen demonstration with timer and submit handlers:

```tsx
import React, { useState } from "react";
import { OTPInput } from "./OTPInput";

export default function VerificationScreen() {
  const [submittedOtp, setSubmittedOtp] = useState<string | null>(null);

  const handleOTPComplete = (otp: string) => {
    setSubmittedOtp(otp);
    console.log("OTP Completed:", otp);
    // Trigger verification API call here
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
        {/* Header Icon */}
        <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center justify-center text-2xl">
          🔒
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Enter Verification Code</h2>
          <p className="text-xs text-slate-400 mt-1">
            We sent a 6-digit code to <span className="text-slate-200 font-medium">+1 (555) ***-8921</span>
          </p>
        </div>

        {/* OTP Input Component */}
        <div className="py-2">
          <OTPInput length={6} onComplete={handleOTPComplete} />
        </div>

        {/* Verification Status */}
        {submittedOtp && (
          <div className="text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-500/30 px-4 py-2 rounded-lg">
            Verifying code: <span className="font-mono font-bold">{submittedOtp}</span>
          </div>
        )}

        {/* Resend Action */}
        <p className="text-xs text-slate-500">
          Didn't receive code?{" "}
          <button
            onClick={() => alert("New OTP sent!")}
            className="text-indigo-400 font-bold hover:underline"
          >
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
}

```
