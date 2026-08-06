Your `parsePhoneNumber` function is designed to parse a phone number, remove non-numeric characters, and format it based on the length of the number. Let's break it down step by step:

### Steps in `parsePhoneNumber` function:

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

### Example Usage:

Given the input `+1 (555) 555-5555`, the function will:

- Remove non-numeric characters to get `15555555555`.
- Extract the country code (`1`), area code (`555`), and local number (`555-5555`).
- Return the formatted number as `+1 (555) 555-5555`.

### Output for this Input:

```javascript
Parsed phone number: +1 (555) 555-5555
```

### Full Code:

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

### Edge Case Handling:

- The function checks for numbers that are too short or too long (less than 7 or more than 15 digits), throwing an error if the number doesn't fit the expected range.
- It also supports different formats, such as the presence or absence of a country code.

### Improvements:

1. **Flexible Formatting**:
   - Currently, the local number is always formatted with a hyphen (`$1-$2`). If you wanted to support different formats (such as spacing between digits or different delimiters), you could make the formatting more flexible.

2. **Handling Country Codes with More Than One Digit**:
   - The function works fine for country codes of length 1 (like `+1`), but country codes can have more than one digit. You might want to further enhance the function to handle country codes with more than one digit (e.g., `+44` for the UK).

### Example with More Complex Input:

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
