```js
import "./PhoneInput.css";
import React, { useState } from "react";

// src/PhoneInput.js

const PhoneInput = ({ value, onChange }) => {
  const [phone, setPhone] = useState(value || "");

  const formatPhoneNumber = (input) => {
    const cleaned = ("" + input).replace(/\D/g, ""); // Remove non-digit characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match the phone number format

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`; // Format as (123) 456-7890
    }

    return input; // Return unformatted input if it doesn't match
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    setPhone(formattedValue);
    onChange(formattedValue);
  };

  return (
    <div className="phone-input-container">
      <input
        type="tel"
        value={phone}
        onChange={handleChange}
        placeholder="(123) 456-7890"
        maxLength="14" // Prevent entering more than 14 characters
      />
    </div>
  );
};

export default PhoneInput;
```
