
The code snippet highlights a fundamental problem with building URLs manually using template literals: **accidental newlines/indentation spaces**, manual encoding oversights, and brittle string formatting.

Using the native **`URL`** and **`URLSearchParams`** constructors provides built-in encoding, query parameter management, and cleaner code.

---

### Alternative URL Construction Patterns

#### 1. Concise Inline Constructor with `URLSearchParams`

Pass an object directly to `URLSearchParams` inside the `URL` constructor to set query parameters in a single line:

```javascript
const query = "Where's Waldø?";
const locale = "en-US";
const campaign = "promo_email";

const url = new URL(
  `https://examp.le?${new URLSearchParams({
    q: query,
    lang: locale,
    from: campaign,
  })}`
);

console.log(url.toString());
// "https://examp.le/?q=Where%27s+Wald%C3%B8%3F&lang=en-US&from=promo_email"

```

---

#### 2. Clean Utility Function for Dynamic APIs

When constructing URLs repeatedly across an application, abstract the pattern into a reusable helper function:

```javascript
/**
 * Construct a safe URL with query parameters
 * 
 * @param {string} baseUrl - Base URL or path
 * @param {Record<string, any>} params - Key-value pair query params
 * @returns {string} Fully constructed URL string
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    // Safely skip null or undefined parameters
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

// --- Usage ---
const finalUrl = buildUrl("https://examp.le", {
  q: "Where's Waldø?",
  lang: "en-US",
  from: "promo_email",
  unusedFilter: null, // Filtered out automatically
});

console.log(finalUrl);
// "https://examp.le/?q=Where%27s+Wald%C3%B8%3F&lang=en-US&from=promo_email"

```

---

### Key Technical Advantages of `new URL()`

| Feature                                | Template Literal / String Concatenation            | Native `URL` & `URLSearchParams`                             |
| -------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| **Space Encoding**                     | Converts spaces to `%20`                           | Converts spaces to `+` (standard for query string form data) |
| **Newlines / Indentation**             | Leaves accidental `\n` or spaces in the URL string | Cleans up whitespace in host and path definitions            |
| **Special Characters (`'`, `?`, `&`)** | Requires manual `encodeURIComponent()` calls       | **Automatically encodes** characters safely                  |
| **Array Parameters**                   | Requires custom splitting or join logic            | Supported natively via `url.searchParams.append("key", val)` |
