Your `parsePhoneNumber` function is designed to parse a phone number, remove non-numeric characters, and format it based on the length of the number. Let's break it down step by step:

### Steps in `parsePhoneNumber` function

1. **Remove Non-Numeric Characters**:
   - The line `const numericString = phoneNumberString.replace(/\D/g, "");` removes all non-numeric characters from the input phone number string, leaving only digits.
2. **Validate Phone Number Length**:
   - The function checks if the length of the numeric string is between 7 and 15 digits (inclusive). If the length is outside this range, it throws an error.

3. **Extract Country Code, Area Code, and Local Number**:
   - If the numeric string is 11 or more digits long, the function assumes it includes a **country code** (the first digits), an **area code** (the next 3 digits), and a **local number** (the remaining digits).
   - If the numeric string is exactly 10 digits, the function assumes it includes an **area code** and a **local number**.
   - If the numeric string is 7 digits long, it assumes it's just the **local number** (no country code or area code).

4. **Format the Phone Number**:
   - The phone number is formatted with a country code (if available), an area code (if available), and a local number formatted with a hyphen between the last 4 digits.

5. **Return the Formatted Number**:
   - Finally, the function returns the formatted phone number string.

### Example Usage

Given the input `+1 (555) 555-5555`, the function will:

- Remove non-numeric characters to get `15555555555`.
- Extract the country code (`1`), area code (`555`), and local number (`555-5555`).
- Return the formatted number as `+1 (555) 555-5555`.

### Output for this Input

```javascript
Parsed phone number: +1 (555) 555-5555
```

### Full Code

```javascript
function parsePhoneNumber(phoneNumberString) {
  // Remove non-numeric characters
  const numericString = phoneNumberString.replace(/\D/g, "");

  // Check if the numeric string has a valid length
  if (numericString.length < 7 || numericString.length > 15) {
    throw new Error("Invalid phone number");
  }

  // Extract country code, area code, and local number based on length
  let countryCode, areaCode, localNumber;
  if (numericString.length >= 11) {
    countryCode = numericString.substring(0, numericString.length - 10);
    areaCode = numericString.substring(
      numericString.length - 10,
      numericString.length - 7,
    );
    localNumber = numericString.substring(numericString.length - 7);
  } else if (numericString.length >= 10) {
    areaCode = numericString.substring(0, numericString.length - 7);
    localNumber = numericString.substring(numericString.length - 7);
  } else {
    localNumber = numericString;
  }

  // Format the parsed phone number
  let formattedPhoneNumber = "";
  if (countryCode) {
    formattedPhoneNumber += `+${countryCode} `;
  }
  if (areaCode) {
    formattedPhoneNumber += `(${areaCode}) `;
  }
  formattedPhoneNumber += localNumber.replace(/(\d{3})(\d{4})/, "$1-$2");

  return formattedPhoneNumber;
}

try {
  const phoneNumber = parsePhoneNumber("+1 (555) 555-5555");
  console.log("Parsed phone number:", phoneNumber); // Output: +1 (555) 555-5555
} catch (error) {
  console.error("Error:", error.message);
}
```

### Edge Case Handling

- The function checks for numbers that are too short or too long (less than 7 or more than 15 digits), throwing an error if the number doesn't fit the expected range.
- It also supports different formats, such as the presence or absence of a country code.

### Improvements

1. **Flexible Formatting**:
   - Currently, the local number is always formatted with a hyphen (`$1-$2`). If you wanted to support different formats (such as spacing between digits or different delimiters), you could make the formatting more flexible.

2. **Handling Country Codes with More Than One Digit**:
   - The function works fine for country codes of length 1 (like `+1`), but country codes can have more than one digit. You might want to further enhance the function to handle country codes with more than one digit (e.g., `+44` for the UK).

### Example with More Complex Input

```javascript
const phoneNumber = parsePhoneNumber("+44 20 7946 0958");
console.log("Parsed phone number:", phoneNumber); // Output: +44 (20) 794-60958
```

Let me know if you need any further adjustments or have additional questions!

If you want to parse phone numbers using **vanilla custom JavaScript** (without relying on heavy third-party libraries like `libphonenumber-js`), you can build a light, custom `parsePhoneNumber` parser using **Regular Expressions (Regex)**.

Building a custom parser is great for simple use cases, such as extracting country codes, stripping formatting characters, or sanitizing phone numbers into standard **E.164 format** (e.g., `+12125550123`).

---

### Custom `parsePhoneNumber` Function

Here is a flexible custom JavaScript function that sanitizes input, extracts digits, parses country codes, and validates the phone number.

```javascript
function parsePhoneNumber(input, defaultCountryCode = "1") {
  if (!input || typeof input !== "string") {
    return { isValid: false, error: "Invalid input string" };
  }

  // 1. Remove all non-numeric characters except the leading '+'
  const cleaned = input.trim().replace(/(?!^\+)[^\d]/g, "");

  let hasPlus = cleaned.startsWith("+");
  let rawDigits = cleaned.replace(/\D/g, "");

  if (rawDigits.length === 0) {
    return { isValid: false, error: "No digits found" };
  }

  let countryCode = "";
  let nationalNumber = "";

  // 2. Parse Country Code vs National Number
  if (hasPlus) {
    // Basic mapping for common country code lengths
    // (In production, replace with your specific target country codes)
    if (rawDigits.startsWith("1")) {
      // North America (US/CA)
      countryCode = "1";
      nationalNumber = rawDigits.slice(1);
    } else if (rawDigits.startsWith("44")) {
      // UK
      countryCode = "44";
      nationalNumber = rawDigits.slice(2);
    } else if (rawDigits.startsWith("91")) {
      // India
      countryCode = "91";
      nationalNumber = rawDigits.slice(2);
    } else {
      // Fallback: Default to first 1-3 digits as country code
      countryCode = rawDigits.slice(0, 3);
      nationalNumber = rawDigits.slice(3);
    }
  } else {
    // If no leading '+', treat whole input as national number and use default code
    countryCode = defaultCountryCode.replace(/\D/g, "");

    // Strip leading trunk prefix '0' if present (e.g., UK numbers like 07911...)
    nationalNumber = rawDigits.replace(/^0/, "");
  }

  // 3. E.164 Format Generation (+[CountryCode][NationalNumber])
  const e164 = `+${countryCode}${nationalNumber}`;

  // 4. Basic Length Validation (E.164 allows 7 to 15 digits total)
  const totalDigits = countryCode.length + nationalNumber.length;
  const isValid =
    totalDigits >= 7 && totalDigits <= 15 && nationalNumber.length >= 6;

  return {
    isValid,
    e164: isValid ? e164 : null,
    countryCode,
    nationalNumber,
    formattedNational: formatNational(nationalNumber, countryCode),
    rawDigits,
  };
}

// Helper: Custom Local Formatting function
function formatNational(number, countryCode) {
  // US / Canada (10 digits) -> (XXX) XXX-XXXX
  if (countryCode === "1" && number.length === 10) {
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
  }
  // India (10 digits) -> XXXXX XXXXX
  if (countryCode === "91" && number.length === 10) {
    return `${number.slice(0, 5)} ${number.slice(5)}`;
  }
  // Generic grouping (groups of 3 or 4 digits)
  return number.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}
```

---

### Examples & Output

#### 1. International Number Input (`+` prefix)

```javascript
const res1 = parsePhoneNumber("+1 (212) 555-0123");
console.log(res1);
/*
{
  isValid: true,
  e164: "+12125550123",
  countryCode: "1",
  nationalNumber: "2125550123",
  formattedNational: "(212) 555-0123",
  rawDigits: "12125550123"
}
*/
```

#### 2. Local Number Input (Default Country)

```javascript
// UK number entered locally with leading '0'
const res2 = parsePhoneNumber("07911 123456", "44");
console.log(res2.e164); // "+447911123456"
console.log(res2.nationalNumber); // "7911123456" (Leading zero stripped)
```

#### 3. Handling Messy Input

```javascript
const res3 = parsePhoneNumber("+91  98765-43210");
console.log(res3.e164); // "+919876543210"
console.log(res3.formattedNational); // "98765 43210"
```

---

### Key Capabilities of This Custom Solution

1. **Removes Junk Characters:** Strips brackets, hyphens, extra spaces, and extension characters.
2. **Handles Trunk Prefixes:** Automatically strips leading zeroes (`07911...` $\rightarrow$ `7911...`) when converting local inputs to international format.
3. **E.164 Standardization:** Formats numbers for safe storage in databases or API payloads (`+12125550123`).
4. **Zero Dependencies:** Pure JS with high runtime performance ($O(N)$ execution speed).

> **When to use custom JS vs a library:**
>
> - Use **Custom JS** if you only support a few target countries or need light validation/formatting without inflating bundle size.
> - Use **`libphonenumber-js`** if you need precise validation rules, area code verification, or carrier detection for all 200+ countries worldwide.

Your custom implementation provides a solid foundation for handling phone numbers without bloating your application bundle.

However, when running your provided UK example through your code, a **formatting bug** occurs due to variable national length assumptions.

---

### The Bug in Your Example Output

In your explanation, you provided this test case:

```javascript
const phoneNumber = parsePhoneNumber("+44 20 7946 0958");

```

Your code output was listed as `+44 (20) 794-60958`.

#### Why This Failed

In your code, `localNumber` is extracted using a hardcoded fixed length of 7 digits:

```javascript
localNumber = numericString.substring(numericString.length - 7);

```

In `+44 20 7946 0958`:

1. `numericString` is `442079460958` (12 digits total).
2. `countryCode` takes everything before the last 10 digits $\rightarrow$ `"44"`.
3. `areaCode` takes the next 3 digits $\rightarrow$ `"207"`.
4. `localNumber` takes the remaining 7 digits $\rightarrow$ `"9460958"`.
5. `localNumber.replace(/(\d{3})(\d{4})/, "$1-$2")` formats `9460958` as `946-0958`.

This incorrectly broke London's 2-digit area code `20` into `(207)` and produced the invalid format **`+44 (207) 946-0958`**.

---

### Understanding National Number Structure

Phone numbers globally do **not** follow the fixed US format of a 3-digit area code + 7-digit local number:

- **US / Canada (NANP):** Fixed 3-digit Area Code + 7-digit Subscriber Number ($3 + 7 = 10$ digits total).
- **United Kingdom:** Variable 2- to 5-digit Area Code + 5- to 8-digit Subscriber Number ($10$ or $11$ digits total).
- **Japan:** Variable 1- to 4-digit Area Code + 4- to 8-digit Subscriber Number.
- **Germany:** Variable 2- to 5-digit Area Code.

---

### Fixing National Number Formatting

If you want a lightweight solution without bringing in Google's `libphonenumber-js` ($~150\text{KB}$ minified), you can map common country codes to their respective digit-grouping regular expressions:

```javascript
/**
 * Country-aware phone number formatter
 * @param {string} phoneNumber - Raw phone input
 * @return {string} Standardized formatted string
 */
function parseAndFormatPhone(phoneNumber) {
  // 1. Sanitize input to digits and leading plus
  const cleaned = phoneNumber.trim().replace(/(?!^\+)[^\d]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    throw new Error("Invalid phone number length");
  }

  // 2. Define country patterns (Country Code -> Regex Matcher & Replacer)
  const countryRules = [
    // US / Canada (+1): +1 (XXX) XXX-XXXX
    {
      code: "1",
      rule: /^1(\d{3})(\d{3})(\d{4})$/,
      format: "+1 ($1) $2-$3"
    },
    // UK (+44 London/Major Cities): +44 XX XXXX XXXX
    {
      code: "44",
      rule: /^44(\d{2})(\d{4})(\d{4})$/,
      format: "+44 $1 $2 $3"
    },
    // India (+91): +91 XXXXX-XXXXX
    {
      code: "91",
      rule: /^91(\d{5})(\d{5})$/,
      format: "+91 $1-$2"
    }
  ];

  // 3. Match against known rules
  for (const { rule, format } of countryRules) {
    if (rule.test(digitsOnly)) {
      return digitsOnly.replace(rule, format);
    }
  }

  // 4. Fallback for generic international numbers: +CCC XXXX...
  return cleaned.startsWith("+") 
    ? `+${digitsOnly}` 
    : digitsOnly;
}

// --- Verification ---
console.log(parseAndFormatPhone("+1 (555) 555-5555"));  // "+1 (555) 555-5555"
console.log(parseAndFormatPhone("+44 20 7946 0958"));   // "+44 20 7946 0958" (Correct!)
console.log(parseAndFormatPhone("+91 9876543210"));     // "+91 98765-43210"

```

---

### Production Recommendation

| Scale                                    | Recommended Strategy              | Why                                                                                        |
| ---------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| **Form Inputs (US Only)**                | Standard Regex / Masking          | Simple, zero overhead                                                                      |
| **Multi-Country (2–5 target countries)** | Custom Rules Lookup (Code above)  | Lightweight, accurate for your specific locales                                            |
| **Global Enterprise (200+ countries)**   | `libphonenumber-js` (core bundle) | Handles carrier validation, variable area codes, and E.164 compliance accurately worldwide |

Building a real-time phone number input mask requires handling user typing, deletion (backspace), pasting, and cursor position without jumping or corrupting the input sequence.

The most robust approach uses an **Unmasked Value Buffer**—stripping all non-digits first on every input event, applying a template mask (e.g., `(XXX) XXX-XXXX`), and reconstructing the string dynamically.

---

### Vanilla JavaScript Phone Mask Implementation

Here is a complete, reusable vanilla JavaScript solution that handles real-time masking, backspace behavior, and copy-paste.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Real-Time Phone Number Mask</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; }
    .input-group { display: flex; flex-direction: column; gap: 6px; max-width: 300px; }
    input { padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
  </style>
</head>
<body>

  <div class="input-group">
    <label for="phone">Phone Number (US/Canada)</label>
    <input 
      type="tel" 
      id="phone" 
      placeholder="(555) 555-5555" 
      autocomplete="tel"
      maxlength="14"
    />
  </div>

  <script>
    /**
     * Real-time phone masking helper
     * @param {HTMLInputElement} inputEl - Target input element
     * @param {string} template - Mask template ('X' represents a digit)
     */
    function createPhoneMask(inputEl, template = "(XXX) XXX-XXXX") {
      
      const format = (value) => {
        // 1. Extract raw digits only
        const digits = value.replace(/\D/g, "");
        let formatted = "";
        let digitIndex = 0;

        // 2. Map raw digits onto template slots ('X')
        for (let i = 0; i < template.length; i++) {
          if (digitIndex >= digits.length) break;

          if (template[i] === "X") {
            formatted += digits[digitIndex];
            digitIndex++;
          } else {
            formatted += template[i];
          }
        }

        return formatted;
      };

      // Handle typing and pasting
      inputEl.addEventListener("input", (e) => {
        const cursorPosition = inputEl.selectionStart;
        const previousValue = inputEl.value;
        const formattedValue = format(previousValue);

        inputEl.value = formattedValue;

        // Adjust cursor position so it doesn't jump to the end unnecessarily
        if (e.inputType === "deleteContentBackward") {
          inputEl.setSelectionRange(cursorPosition, cursorPosition);
        }
      });

      // Expose a helper to extract raw unmasked digits for form submission/API
      return {
        getUnmaskedValue: () => inputEl.value.replace(/\D/g, "")
      };
    }

    // Attach to element
    const phoneInput = document.getElementById("phone");
    const mask = createPhoneMask(phoneInput);

    // Demonstration of unmasked value access
    phoneInput.addEventListener("blur", () => {
      console.log("Unmasked E.164-compatible digits:", mask.getUnmaskedValue());
    });
  </script>
</body>
</html>

```

---

### Key Mechanics Explained

#### 1. Digit Extraction First

Rather than trying to regex-replace formatted characters on the fly, `value.replace(/\D/g, "")` cleans the input down to raw numeric characters on every keystroke. Formatting is then freshly calculated from the raw buffer.

#### 2. Template Injection

The template uses a wildcard character (`X`). As the loop traverses the template string:

- If it hits `X`, it consumes the next available digit.
- If it hits formatting characters like `(`, `)`, `-`, or spaces, it appends them automatically as soon as the user reaches that section.

#### 3. Cursor Shift Guard (`deleteContentBackward`)

When users press **Backspace** over formatting characters (e.g., deleting the space in `(555) 555`), standard browser behavior can cause the cursor to jump erratically to the end of the field. Checking `e.inputType === "deleteContentBackward"` preserves the expected cursor position.

---

### Supporting Dynamic Mask Templates (Multi-Country)

If you need your input field to dynamically shift masks based on country selection:

```javascript
const masks = {
  US: "(XXX) XXX-XXXX",       // 10 digits
  UK: "XXXX XXXXXX",         // 10 digits
  IN: "XXXXX-XXXXX",         // 10 digits
  INTL: "+X XXX XXX XXXX"    // Generic international
};

function applyDynamicMask(inputEl, countryCode) {
  const template = masks[countryCode] || masks.US;
  
  // Re-apply formatting with new country template
  const rawDigits = inputEl.value.replace(/\D/g, "");
  inputEl.maxLength = template.length;
  
  // Format existing digits with new mask
  let formatted = "";
  let dIdx = 0;
  for (let i = 0; i < template.length && dIdx < rawDigits.length; i++) {
    if (template[i] === "X") {
      formatted += rawDigits[dIdx++];
    } else {
      formatted += template[i];
    }
  }
  inputEl.value = formatted;
}

```

Managing caret position during mid-string edits is the hardest part of building a custom input mask. When a user inserts or deletes a character in the middle of a string, inserting formatting characters (like `(`, `)`, `-`, or spaces) shifts string indices. If you don't calculate caret displacement, the browser defaults to placing the cursor at the very end of the string or jumping unpredictably.

To manage the caret position precisely, you must calculate **how many raw digits existed before the caret *before* formatting** and map the caret to the **corresponding position *after* formatting**.

---

### Key Mechanics of Caret Alignment

1. **Before Formatted Mutation:** Count how many raw digits (`\D`) exist to the left of the selection start before applying the mask (`digitsBeforeCaret`).
2. **Apply Formatting:** Re-run the raw digits through the template engine.
3. **After Formatted Mutation:** Iterate through the new formatted string until you encounter the same number of raw digits (`digitsBeforeCaret`), and place the caret immediately after the $N$-th digit.
4. **Special Backspace Rule:** If the user deletes a non-digit character (like a hyphen or space), adjust the caret to delete the preceding digit instead of getting "stuck" on formatting characters.

---

### Complete Solution with Caret Management

Here is a vanilla JavaScript implementation featuring caret position synchronization for insertions, deletions, and mid-string paste actions:

```javascript
/**
 * Attaches a precise caret-managed input mask to an HTMLInputElement.
 * @param {HTMLInputElement} input - Target input element
 * @param {string} template - Mask template ('X' represents a raw digit slot)
 */
function attachCaretManagedMask(input, template = "(XXX) XXX-XXXX") {
  
  // Format raw digits based on the template
  function format(digits) {
    let formatted = "";
    let digitIndex = 0;

    for (let i = 0; i < template.length; i++) {
      if (digitIndex >= digits.length) break;

      if (template[i] === "X") {
        formatted += digits[digitIndex++];
      } else {
        formatted += template[i];
      }
    }
    return formatted;
  }

  // Calculate new caret index based on unmasked digit index
  function calculateNewCaretPos(formatted, targetDigitCount) {
    if (targetDigitCount === 0) {
      // Position before the first digit slot
      const firstSlot = template.indexOf("X");
      return firstSlot !== -1 ? firstSlot : 0;
    }

    let currentDigits = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        currentDigits++;
        if (currentDigits === targetDigitCount) {
          return i + 1; // Place caret right after the target digit
        }
      }
    }
    return formatted.length;
  }

  input.addEventListener("input", (e) => {
    const rawVal = input.value;
    const selectionStart = input.selectionStart || 0;
    const inputType = e.inputType;

    // 1. Count raw digits before original selection point
    const textBeforeCaret = rawVal.slice(0, selectionStart);
    let digitsBeforeCaret = textBeforeCaret.replace(/\D/g, "").length;

    // 2. Adjust for backspacing over non-digits
    if (inputType === "deleteContentBackward") {
      const charJustDeleted = rawVal[selectionStart];
      // If we deleted a non-digit, decrease digit count to consume the digit to the left
      if (charJustDeleted && /\D/.test(charJustDeleted) && digitsBeforeCaret > 0) {
        digitsBeforeCaret--;
      }
    }

    // 3. Extract all raw digits and re-format
    const allDigits = rawVal.replace(/\D/g, "");
    const formattedVal = format(allDigits);

    // 4. Calculate new caret position
    let newCaretPos = calculateNewCaretPos(formattedVal, digitsBeforeCaret);

    // 5. Update DOM value and set selection range
    input.value = formattedVal;

    // Skip static formatting characters immediately following caret position
    while (newCaretPos < formattedVal.length && /\D/.test(formattedVal[newCaretPos])) {
      // Exception: Don't skip if we are backspacing
      if (inputType === "deleteContentBackward") break;
      newCaretPos++;
    }

    input.setSelectionRange(newCaretPos, newCaretPos);
  });
}

```

---

### Step-by-Step Scenario Walkthrough

#### Scenario: User Inserts a Digit Mid-String

1. **Initial State:** `(555) 123-4567`
2. **Target Edit:** User places cursor between `1` and `2`, then types `9`.

- Raw value before event processing: `(555) 1923-4567`

- Cursor position in raw value: index `8` (after `9`).

1. **Digit Count:** Digits before cursor $\rightarrow$ `5, 5, 5, 1, 9` ($5$ digits total).
2. **Re-Formatting:** Raw digits `55519234567` (truncated to max length) $\rightarrow$ `(555) 192-3456`.
3. **Caret Mapping:** Find position in `(555) 192-3456` immediately following the 5th digit (`9`).
4. **Result:** Caret lands precisely after `9`, resulting in `(555) 19|2-3456`.

---

### Edge-Case Handling Summary

| Event / Edge Case                | Problem                                                                                                | Solution                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Deleting a Hyphen or Space**   | Default backspace deletes `"-"`, leaving the digit intact while keeping the cursor in the same slot.   | Decrement `digitsBeforeCaret` when `deleteContentBackward` targets a non-digit character.              |
| **Landing on Static Characters** | Caret lands right before `"-"` or `")"`, forcing the user to type over formatting characters.          | Scan forward after calculation and advance `newCaretPos` past static formatting characters.            |
| **Pasting Multiple Digits**      | Pasting a 5-digit sequence mid-string displaces the caret by only 1 character if using simple offsets. | Digit-count tracking automatically scales the caret offset by the total number of new digits inserted. |

Handling caret positions in controlled input masks within frameworks like React or Vue is notoriously difficult.

Because React and Vue re-render asynchronously—and because updating state schedules a DOM update that runs *after* the browser’s native input event—the browser will natively reset the caret to the end of the input field during state reconciliation.

To prevent caret jumps, you must **synchronize the caret position manually immediately after DOM mutations occur** (using `useLayoutEffect` / `flushSync` in React or `nextTick` in Vue).

---

## 1. React Implementation (`useLayoutEffect` approach)

In React, standard `useEffect` runs asynchronously after the paint, causing visual flickering or delayed jumps. `useLayoutEffect` executes synchronously **after DOM mutations but before the browser paints**, making it the ideal place to update `selectionStart` and `selectionEnd`.

```tsx
import React, { useState, useRef, useLayoutEffect } from "react";

const PHONE_MASK = "(XXX) XXX-XXXX";

export const MaskedPhoneInput = () => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Track caret location target across renders
  const caretTargetRef = useRef<number | null>(null);

  // 1. Format raw digits into template
  const format = (rawDigits: string) => {
    let formatted = "";
    let dIdx = 0;
    for (let i = 0; i < PHONE_MASK.length && dIdx < rawDigits.length; i++) {
      if (PHONE_MASK[i] === "X") {
        formatted += rawDigits[dIdx++];
      } else {
        formatted += PHONE_MASK[i];
      }
    }
    return formatted;
  };

  // 2. Map unmasked digit count back to formatted string index
  const calculateCaretPos = (formatted: string, targetDigits: number) => {
    if (targetDigits === 0) return PHONE_MASK.indexOf("X");
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        count++;
        if (count === targetDigits) return i + 1;
      }
    }
    return formatted.length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawValue = input.value;
    const selectionStart = input.selectionStart || 0;
    
    // Count how many raw digits exist to the left of cursor BEFORE formatting
    const digitsBeforeCaret = rawValue.slice(0, selectionStart).replace(/\D/g, "").length;
    
    const formatted = format(rawValue.replace(/\D/g, ""));
    let newCaretPos = calculateCaretPos(formatted, digitsBeforeCaret);

    // Advance caret past static symbols if needed
    while (newCaretPos < formatted.length && /\D/.test(formatted[newCaretPos])) {
      newCaretPos++;
    }

    // Save intended caret position for useLayoutEffect
    caretTargetRef.current = newCaretPos;
    setValue(formatted);
  };

  // 3. Synchronously restore caret position BEFORE browser paint
  useLayoutEffect(() => {
    if (inputRef.current && caretTargetRef.current !== null) {
      const pos = caretTargetRef.current;
      inputRef.current.setSelectionRange(pos, pos);
      caretTargetRef.current = null; // Reset
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder="(555) 555-5555"
    />
  );
};

```

---

## 2. Vue 3 Implementation (`nextTick` approach)

In Vue 3, two-way data binding (`v-model`) triggers component re-renders. To update the caret without jumps, compute the new caret offset inside your event handler and update `inputEl.setSelectionRange()` inside `nextTick()`.

```vue
<script setup>
import { ref, nextTick } from 'vue';

const PHONE_MASK = "(XXX) XXX-XXXX";
const value = ref("");
const inputRef = ref(null);

const format = (rawDigits) => {
  let formatted = "";
  let dIdx = 0;
  for (let i = 0; i < PHONE_MASK.length && dIdx < rawDigits.length; i++) {
    if (PHONE_MASK[i] === "X") {
      formatted += rawDigits[dIdx++];
    } else {
      formatted += PHONE_MASK[i];
    }
  }
  return formatted;
};

const calculateCaretPos = (formatted, targetDigits) => {
  if (targetDigits === 0) return PHONE_MASK.indexOf("X");
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === targetDigits) return i + 1;
    }
  }
  return formatted.length;
};

const handleInput = (event) => {
  const input = event.target;
  const rawValue = input.value;
  const selectionStart = input.selectionStart || 0;

  // Count raw digits prior to cursor position
  const digitsBeforeCaret = rawValue.slice(0, selectionStart).replace(/\D/g, "").length;

  const formatted = format(rawValue.replace(/\D/g, ""));
  let newCaretPos = calculateCaretPos(formatted, digitsBeforeCaret);

  while (newCaretPos < formatted.length && /\D/.test(formatted[newCaretPos])) {
    newCaretPos++;
  }

  // Update Reactive State
  value.value = formatted;

  // Wait for Vue DOM reconciliation, then set caret position
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.setSelectionRange(newCaretPos, newCaretPos);
    }
  });
};
</script>

<template>
  <input
    ref="inputRef"
    type="tel"
    :value="value"
    @input="handleInput"
    placeholder="(555) 555-5555"
  />
</template>

```

---

## Key Framework Differences Summary

| Feature                 | React                                        | Vue 3                                                                            |
| ----------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| **DOM Sync Timing**     | `useLayoutEffect` (synchronous before paint) | `nextTick()` (asynchronous microtask right after Virtual DOM patch)              |
| **State Reference**     | `useRef` to store pending caret position     | Local variable enclosed inside `handleInput` + `nextTick`                        |
| **Input Value Binding** | `value={state}` + `onChange`                 | `:value="state"` + `@input` (Avoid `v-model` directly to keep control of events) |

Packaging input mask logic into reusable abstractions simplifies forms and isolates DOM/caret manipulation from UI components.

---

## 1. Reusable React Custom Hook (`useMask`)

A React custom hook can manage the unmasked value, formatted value, event handlers, and `useLayoutEffect` caret positioning internally, returning props you can directly spread onto any `<input />`.

```tsx
import { useState, useRef, useLayoutEffect, ChangeEvent } from "react";

interface UseMaskOptions {
  mask: string; // e.g., "(XXX) XXX-XXXX"
  defaultValue?: string;
}

export function useMask({ mask, defaultValue = "" }: UseMaskOptions) {
  const [value, setValue] = useState(() => formatDigits(defaultValue.replace(/\D/g, ""), mask));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingCaretRef = useRef<number | null>(null);

  // Helper: Format raw digits into template mask
  function formatDigits(rawDigits: string, template: string): string {
    let formatted = "";
    let dIdx = 0;
    for (let i = 0; i < template.length && dIdx < rawDigits.length; i++) {
      if (template[i] === "X") {
        formatted += rawDigits[dIdx++];
      } else {
        formatted += template[i];
      }
    }
    return formatted;
  }

  // Helper: Map unmasked digit count back to formatted string index
  function calculateCaretPos(formatted: string, targetDigits: number): number {
    if (targetDigits === 0) return Math.max(0, mask.indexOf("X"));
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        count++;
        if (count === targetDigits) return i + 1;
      }
    }
    return formatted.length;
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawVal = input.value;
    const selectionStart = input.selectionStart || 0;

    // 1. Calculate raw digits to left of caret
    const digitsBeforeCaret = rawVal.slice(0, selectionStart).replace(/\D/g, "").length;

    // 2. Format raw digits
    const unmasked = rawVal.replace(/\D/g, "");
    const formatted = formatDigits(unmasked, mask);

    // 3. Compute new caret position
    let newCaretPos = calculateCaretPos(formatted, digitsBeforeCaret);
    while (newCaretPos < formatted.length && /\D/.test(formatted[newCaretPos])) {
      newCaretPos++;
    }

    pendingCaretRef.current = newCaretPos;
    setValue(formatted);
  };

  // Restore caret position synchronously before browser paint
  useLayoutEffect(() => {
    if (inputRef.current && pendingCaretRef.current !== null) {
      const pos = pendingCaretRef.current;
      inputRef.current.setSelectionRange(pos, pos);
      pendingCaretRef.current = null;
    }
  }, [value]);

  return {
    value,
    unmaskedValue: value.replace(/\D/g, ""),
    inputProps: {
      ref: inputRef,
      value,
      onChange,
    },
    setValue: (val: string) => setValue(formatDigits(val.replace(/\D/g, ""), mask)),
  };
}

```

### Usage in React

```tsx
export function PhoneForm() {
  const phoneMask = useMask({ mask: "(XXX) XXX-XXXX" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Raw submission payload:", phoneMask.unmaskedValue); // "5551234567"
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="tel" placeholder="(555) 555-5555" {...phoneMask.inputProps} />
      <button type="submit">Submit</button>
    </form>
  );
}

```

---

## 2. Reusable Vue 3 Custom Directive (`v-mask`)

In Vue 3, custom directives seamlessly attach logic to native `<input>` DOM elements and work out of the box with `v-model`.

```typescript
// vMask.ts
import { Directive, nextTick } from "vue";

function formatDigits(rawDigits: string, template: string): string {
  let formatted = "";
  let dIdx = 0;
  for (let i = 0; i < template.length && dIdx < rawDigits.length; i++) {
    if (template[i] === "X") {
      formatted += rawDigits[dIdx++];
    } else {
      formatted += template[i];
    }
  }
  return formatted;
}

function calculateCaretPos(formatted: string, targetDigits: number, mask: string): number {
  if (targetDigits === 0) return Math.max(0, mask.indexOf("X"));
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === targetDigits) return i + 1;
    }
  }
  return formatted.length;
}

export const vMask: Directive<HTMLInputElement, string> = {
  mounted(el, binding) {
    const mask = binding.value;

    const handleInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const rawVal = input.value;
      const selectionStart = input.selectionStart || 0;

      const digitsBeforeCaret = rawVal.slice(0, selectionStart).replace(/\D/g, "").length;
      const formatted = formatDigits(rawVal.replace(/\D/g, ""), mask);

      let newCaretPos = calculateCaretPos(formatted, digitsBeforeCaret, mask);
      while (newCaretPos < formatted.length && /\D/.test(formatted[newCaretPos])) {
        newCaretPos++;
      }

      // 1. Update element value
      input.value = formatted;

      // 2. Dispatch native input event to keep v-model reactive binding in sync
      input.dispatchEvent(new Event("input"));

      // 3. Restore caret position after Vue patch cycle
      nextTick(() => {
        input.setSelectionRange(newCaretPos, newCaretPos);
      });
    };

    el.addEventListener("input", handleInput);
  },
};

```

### Usage in Vue 3

```vue
<script setup>
import { ref } from 'vue';
import { vMask } from './vMask';

const phone = ref("");
</script>

<template>
  <div class="form-group">
    <!-- Attach directive with string mask passed as argument -->
    <input 
      v-model="phone" 
      v-mask="'(XXX) XXX-XXXX'" 
      type="tel" 
      placeholder="(555) 555-5555" 
    />
    <p>Formatted Output: {{ phone }}</p>
  </div>
</template>

```

---

## Direct Architectural Comparison

| Feature                       | React Hook (`useMask`)                     | Vue 3 Directive (`v-mask`)                                             |
| ----------------------------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| **API Boundary**              | State-driven (`inputProps` spreading)      | DOM-driven (`v-mask="'...'"` attribute binding)                        |
| **`v-model` / State Sync**    | Exposes `value` & `unmaskedValue` directly | Dispatches synthetic native `Event('input')` to auto-trigger `v-model` |
| **Lifecycle Synchronization** | `useLayoutEffect`                          | `nextTick`                                                             |
| **Reusability**               | Works inside custom wrapper components     | Attaches directly to native `<input>` or UI library inputs             |
