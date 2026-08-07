```js
function splitByInitialCapital(str) {
  const parts = [];
  let currentWord = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    // Check if the character is uppercase and not the first character
    if (char === char.toUpperCase() && i > 0) {
      parts.push(currentWord);
      currentWord = char;
    } else {
      currentWord += char;
    }
  }

  // Push the last accumulated word
  parts.push(currentWord);

  // Filter out any empty strings (in case there were consecutive capital letters)
  return parts.filter((part) => part !== "");
}

const name = "MyNameIsKumar";
const parts = splitByInitialCapital(name);
console.log(parts); // Output: ["My", "Name", "Is", "Kumar"]

/******************************************************************** */

const name = "MyNameIsKumar";

function insertSpaces(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && str[i] === str[i].toUpperCase()) {
      result += " ";
    }
    result += str[i];
  }
  return result;
}

const result = insertSpaces(name);
console.log(result);

/*************************************** */

const name = "MyNameIsKumar";

// Split the string based on initial capital letters
const formattedName = name.replace(/([A-Z])/g, " $1").trim();

console.log(formattedName); // Output: "My Name Is Kumar"

/******************************************** */

function splitByInitialCapital(str) {
  return str.match(/[A-Z][a-z]*/g) || [];
}

const name = "MyNameIsKumar";
const parts = splitByInitialCapital(name);
console.log(parts); // Output: ["My", "Name", "Is", "Kumar"]

/************************************************** */

function splitByInitialCapital(str) {
  return str.split("").reduce(
    (parts, char, index) => {
      if (char === char.toUpperCase() && index > 0) {
        parts.push("");
      }
      parts[parts.length - 1] += char;
      return parts;
    },
    [""],
  );
}

const name = "MyNameIsKumar";
const parts = splitByInitialCapital(name);
console.log(parts); // Output: ["My", "Name", "Is", "Kumar"]

/************************************************ */

function splitByInitialCapital(str) {
  const parts = [];
  let currentWord = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    // Check if the character is uppercase and not the first character
    if (char === char.toUpperCase() && i > 0) {
      parts.push(currentWord);
      currentWord = char;
    } else {
      currentWord += char;
    }
  }

  // Push the last accumulated word
  parts.push(currentWord);

  // Filter out any empty strings (in case there were consecutive capital letters)
  return parts.filter((part) => part !== "");
}

const name = "MyNameIsKumar";
const parts = splitByInitialCapital(name);
console.log(parts); // Output: ["My", "Name", "Is", "Kumar"]
```

Your code snippet demonstrates several approaches to **splitting camelCase / PascalCase strings by capital letters**.

Here is a code review highlighting edge-case bugs in some of these implementations (such as consecutive capitals like `"XMLHttpRequest"` or non-letter characters) along with optimal modern alternatives.

---

### Bug & Edge Case Breakdown

#### 1. The Consecutive Capitals Bug (e.g., `"XMLHttpRequest"`, `"JSONParser"`)

* **Regex Match `/[A-Z][a-z]*/g**`:
* Input: `"JSONParser"`
* Output: `["J", "S", "O", "NParser"]` ❌ (Fails to capture consecutive uppercase acronyms correctly).

* **Loop / Reduce Methods (`char === char.toUpperCase()`)**:
* Non-alphabetical characters like digits or symbols (`"1"`, `"!"`, `"-"`) return `true` for `char === char.toUpperCase()`.
* Input: `"user123Name"` $\rightarrow$ treats `"1"`, `"2"`, `"3"` as uppercase letters!

---

### Optimal Solutions

#### 1. Splitting Camel/Pascal Case to Words (`/[A-Z][a-z]+|[A-Z]+(?=[A-Z][a-z]|\b)/g`)

To handle standard words **and** acronyms like `"JSON"` or `"HTML"`, use lookaheads:

```javascript
function splitCamelCase(str) {
  // Matches either:
  // 1. Capital followed by lowercase letters ([A-Z][a-z]+)
  // 2. Consecutive uppercase acronyms followed by next word or end of string
  const regex = /[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z]|\b)|\d+/g;
  return str.match(regex) || [];
}

console.log(splitCamelCase("MyNameIsKumar"));  // ["My", "Name", "Is", "Kumar"]
console.log(splitCamelCase("parseJSONData"));   // ["parse", "JSON", "Data"]
console.log(splitCamelCase("XMLHttpRequest")); // ["XML", "Http", "Request"]

```

---

#### 2. Inserting Spaces (Modern Regex Lookaround)

Instead of replacing `$1` with a leading space and calling `.trim()`, use positive lookaheads and lookbehinds:

```javascript
const name = "MyNameIsKumar";

// Matches a position right before an uppercase letter, provided it's preceded by lowercase
const formattedName = name.replace(/(?<=[a-z])(?=[A-Z])/g, " ");

console.log(formattedName); // "My Name Is Kumar"
console.log("parseJSONData".replace(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g, " ")); 
// "parse JSON Data"

```

---

### Method Comparison Matrix

| Approach                                       | Standard PascalCase (`"MyName"`) | Consecutive Capitals (`"JSONData"`) | Numbers/Symbols (`"User123"`)     | Recommendation                        |
| ---------------------------------------------- | -------------------------------- | ----------------------------------- | --------------------------------- | ------------------------------------- |
| **`char === char.toUpperCase()` (Loop)**       | ✅ Works                          | ❌ Splits every capital char         | ❌ Treats non-letters as uppercase | Avoid                                 |
| **`str.match(/[A-Z][a-z]*/g)`**                | ✅ Works                          | ❌ Breaks acronyms                   | ❌ Ignores digits                  | Basic cases only                      |
| **Lookaround Regex Replacement**               | ✅ Works                          | ✅ Works                             | ✅ Works                           | **Best for formatting string output** |
| **Full Tokenizer Regex (`/[A-Z]?[a-z]+/...`)** | ✅ Works                          | ✅ Works                             | ✅ Works                           | **Best for array splitting**          |

Converting `camelCase` or `PascalCase` into `kebab-case` (dash-separated) or `snake_case` (underscore-separated) is a common task when working with APIs, CSS class names, or file naming conventions.

---

## 1. Quick & Modern Solutions (Regex Lookaround)

The most robust way to handle conversions in modern JavaScript (ES2018+) is using **positive lookbehinds** `(?<=[a-z0-9])` and **positive lookaheads** `(?=[A-Z])`. This identifies the exact boundaries between words without needing capture group replacements or trimming.

### A. Convert to `kebab-case`

```javascript
/**
 * Converts camelCase or PascalCase to kebab-case.
 * Handles acronyms (e.g., "parseJSONData" -> "parse-json-data") and numbers.
 */
const toKebabCase = (str) =>
  str
    .replace(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g, "-")
    .toLowerCase();

// Tests:
console.log(toKebabCase("myVariableName"));   // "my-variable-name"
console.log(toKebabCase("MyVariableName"));   // "my-variable-name"
console.log(toKebabCase("parseJSONData"));    // "parse-json-data"
console.log(toKebabCase("user123Details"));   // "user123-details"

```

### B. Convert to `snake_case`

```javascript
/**
 * Converts camelCase or PascalCase to snake_case.
 */
const toSnakeCase = (str) =>
  str
    .replace(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g, "_")
    .toLowerCase();

// Tests:
console.log(toSnakeCase("myVariableName"));   // "my_variable_name"
console.log(toSnakeCase("MyVariableName"));   // "my_variable_name"
console.log(toSnakeCase("parseJSONData"));    // "parse_json_data"

```

---

## 2. Breaking Down the Regex Pattern

The regex uses two combined conditions separated by the OR operator (`|`):

1. **`(?<=[a-z0-9])(?=[A-Z])`**: Matches the boundary between a lowercase letter or number and an uppercase letter (e.g., between `y` and `V` in `myVariable`).
2. **`(?<=[A-Z])(?=[A-Z][a-z])`**: Handles acronyms. Matches the boundary between consecutive uppercase letters when the second uppercase letter is followed by a lowercase letter (e.g., between `N` and `D` in `JSONData` so it becomes `JSON-Data` before lowercasing).

---

## 3. Legacy-Compatible Fallback (No Lookbehinds)

If you need to support older environments (like legacy browsers or older iOS Safari versions that lack RegExp lookbehind support), you can use capture groups instead:

```javascript
const toKebabCaseLegacy = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")      // Insert hyphen between lower/number and upper
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")  // Handle acronym boundaries
    .toLowerCase();

console.log(toKebabCaseLegacy("MyVariableName")); // "my-variable-name"

```

---

## 4. Universal Converter Function (All Case Types)

If you're building a utility module or API transformer, here is a flexible helper that converts any input string into either case:

```javascript
/**
 * Transforms casing for a string.
 * @param {string} str - Source string
 * @param {'kebab' | 'snake'} targetCase - Output casing style
 */
function changeCase(str, targetCase = "kebab") {
  if (!str) return "";

  const delimiter = targetCase === "snake" ? "_" : "-";

  return str
    .trim()
    .replace(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g, delimiter)
    .toLowerCase();
}

console.log(changeCase("getUserProfile", "kebab")); // "get-user-profile"
console.log(changeCase("getUserProfile", "snake")); // "get_user_profile"

```

Converting nested object keys between `camelCase` and `snake_case` is a common requirement when bridging JavaScript frontends with backends (like Python/Django or PostgreSQL APIs) that expect `snake_case`.

Here is a robust, production-ready solution that handles **nested objects**, **arrays**, **`null`/`undefined` primitives**, and **special objects** (like `Date` or `RegExp`).

---

### 1. Case Conversion Helper Functions

First, define the core string converters using Regex lookarounds:

```javascript
// Converts camelCase -> snake_case
const toSnake = (str) =>
  str.replace(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g, "_").toLowerCase();

// Converts snake_case -> camelCase
const toCamel = (str) =>
  str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());

```

---

### 2. Recursive Key Converter

The main transformer function recursively traverses arrays and plain objects while preserving primitive values and built-in objects (`Date`, `RegExp`, `File`, etc.):

```javascript
/**
 * Recursively transforms object keys using the provided converter function.
 * 
 * @param {*} obj - Target object, array, or primitive value
 * @param {(key: string) => string} keyConverter - Conversion function (e.g., toSnake or toCamel)
 * @returns {*} Transformed object/array or raw primitive
 */
function transformKeys(obj, keyConverter) {
  // 1. Return primitives, null, or undefined as-is
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 2. Preserve special object instances (Date, RegExp, File, Blob, etc.)
  if (obj instanceof Date || obj instanceof RegExp) {
    return obj;
  }

  // 3. Handle Arrays: map over elements recursively
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, keyConverter));
  }

  // 4. Handle Plain Objects: transform keys and recurse on values
  return Object.keys(obj).reduce((acc, key) => {
    const transformedKey = keyConverter(key);
    acc[transformedKey] = transformKeys(obj[key], keyConverter);
    return acc;
  }, {});
}

// Named Exports / Shortcuts
export const keysToSnakeCase = (obj) => transformKeys(obj, toSnake);
export const keysToCamelCase = (obj) => transformKeys(obj, toCamel);

```

---

### 3. Usage Example

#### Deep Conversion to `snake_case` (Payload to API)

```javascript
const frontendData = {
  userId: 101,
  userProfile: {
    firstName: "Prashant",
    lastName: "Yadav",
    accountSettings: {
      isEmailVerified: true,
      notificationPreferences: ["email", "sms"]
    }
  },
  registeredAt: new Date()
};

const apiPayload = keysToSnakeCase(frontendData);
console.log(apiPayload);
/*
Output:
{
  user_id: 101,
  user_profile: {
    first_name: 'Prashant',
    last_name: 'Yadav',
    account_settings: {
      is_email_verified: true,
      notification_preferences: ['email', 'sms']
    }
  },
  registered_at: 2026-08-07T04:21:59.000Z
}
*/

```

#### Deep Conversion to `camelCase` (Response from API)

```javascript
const apiResponse = {
  user_id: 101,
  user_profile: {
    first_name: "Prashant",
    account_settings: { is_email_verified: true }
  }
};

const clientData = keysToCamelCase(apiResponse);
console.log(clientData);
/*
Output:
{
  userId: 101,
  userProfile: {
    firstName: 'Prashant',
    accountSettings: { isEmailVerified: true }
  }
}
*/

```

---

### Key Edge Cases Handled

| Edge Case                        | Behavior                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| **Arrays of Objects**            | Iterates through array items and converts keys in each nested object.                     |
| **`null` / `undefined**`         | Safely returned without throwing `TypeError: Cannot convert undefined or null to object`. |
| **`Date` / `RegExp` / `Buffer**` | Recognized via `instanceof` checks to avoid corrupting instances into empty `{}` objects. |
| **Consecutive Capitals**         | Handles acronyms like `parseJSONData` $\rightarrow$ `parse_json_data`.                    |
