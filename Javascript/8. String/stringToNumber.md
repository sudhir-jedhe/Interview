6 ways to convert string to a number in javascript
Posted on April 17, 2019 | by Prashant Yadav

Posted in Javascript, String

A number can be represented in two different ways in javascript,

1. As actual number 25.
2. As String '25'.

There are many times when we need to convert the string to number in javascript.

We will see 6 different ways in which we can convert string to a number.

Using Number() function.
The most relevant way to convert a string to number is by using Number() method.

```js
Number("25"); //25
Number("2500"); //2500
Number("25.24"); //25.24
Number("24,000"); //NaN
```

Copy
It takes care of the interger as well as decimal or floating numbers.

However it does not converts strings with separators like Number("24,000") as you can see it returns NaN. If you want to convert string with separators then use Intl.NumberFormat.

Using parseInt()

```js
parseInt(string, base) function converts a string to an integer of the specified base.

parseInt('25', 10); //25
```

Copy
If we don’t specify the base then it will use the appropriate base based on the input. So for our case always use 10 as base.

As it convert strings for different base, for base 10 if the starting character is not number then it will return NaN.

```js
parseInt("25 is my age", 10); //25
parseInt("25,000", 10); // 25
parseInt("My age is 25", 10); //NaN
```

Copy
If we want to keep the decimal part, then we need to use parseFloat().

```js
parseInt("25.24"); //25
```

Copy
Using parseFloat()

```js
parseFloat() function converts a string to the floating point number.

parseFloat('25.24'); //25.24
parseFloat('25'); //25

```

Copy
Just like parseInt() it will also convert the fist matching number only. It will return NaN for the strings starting with other than numbers.

```js
parseFloat(3.14); //3.14
parseFloat("3.14"); //3.14
parseFloat("314e-2"); //3.14
parseFloat("0.0314E+2"); //3.14
parseFloat("3.14more non-digit characters"); //3.14
parseFloat("31,400"); //31
parseFloat("Age is 25"); //NaN
```

Copy
Using Math.floor() to convert string to number
Math.floor() can also be used to convert the string to number in javascript. It will not work for floating point numbers as it round offs the number.

```js
Math.floor("25"); //25
Math.floor("25.24"); //25
Math.floor("25,000"); //NaN
Math.floor("25abc"); //NaN
Math.floor("abc25"); //NaN
```

Copy
Using unary operator +
You can append the + operator before the string to convert it to integer. Be careful using this as + operator is also used to concatenate two or more strings 'abc'+'xyz' = 'abcxyz'.

```js
+"25"; //25
+"25.24"; //25.24
+"25,000"; //NaN
+"25abc"; //NaN
+"abc25"; //NaN
```

Copy
Multiplying the string by 1 using _1
Just like +, we can also multiply the string with 1 using_ 1 to convert the string to a number.

```js
'25' _ 1; //25
'25.24' _ 1; //25.24
'25,000' _ 1; //NaN
'25abc' _ 1; //NaN
'abc25' \* 1; //NaN
```

Copy
It is one of the fastest method to available for the quick conversion.

Your article provides a great breakdown of string-to-number conversion techniques in JavaScript!

Here is a quick technical review of your post, highlighting a few subtle edge cases and minor syntax fixes to make it even better.

---

### Code & Syntax Corrections

#### 1. Typo in Section 6 (`_ 1` vs `* 1`)

In your title and code block for Method 6, markdown formatted the multiplication asterisk `*` as an underscore or escaped character (`_ 1` and `\* 1`):

* **Fix:** Change `'25' _ 1` $\rightarrow$ `'25' * 1`.

#### 2. Extra Methods Worth Mentioning

In addition to the 6 methods in your article, two other popular implicit coercion tricks are commonly used in JavaScript codebases:

* **Bitwise NOT operator (`~~str`):** `~~"25"` $\rightarrow$ `25` (Note: Truncates decimals like `Math.trunc` and casts to a 32-bit signed integer).
* **Subtraction by zero (`str - 0`):** `"25.24" - 0` $\rightarrow$ `25.24`.

---

### Feature & Behavior Comparison Matrix

Here is a helpful summary table comparing how each of your 6 methods behaves across different edge case inputs:

| Method                  | `"25"` (Integer) | `"25.24"` (Float) | `"25px"` (Trailing Chars) | `"0x10"` (Hex) | `""` (Empty String) | `null` | `undefined` |
| ----------------------- | ---------------- | ----------------- | ------------------------- | -------------- | ------------------- | ------ | ----------- |
| **`Number(str)`**       | `25`             | `25.24`           | `NaN`                     | `16`           | `0`                 | `0`    | `NaN`       |
| **`parseInt(str, 10)`** | `25`             | `25`              | `25`                      | `0`            | `NaN`               | `NaN`  | `NaN`       |
| **`parseFloat(str)`**   | `25`             | `25.24`           | `25`                      | `0`            | `NaN`               | `NaN`  | `NaN`       |
| **`Math.floor(str)`**   | `25`             | `25`              | `NaN`                     | `16`           | `0`                 | `0`    | `NaN`       |
| **`+str` (Unary)**      | `25`             | `25.24`           | `NaN`                     | `16`           | `0`                 | `0`    | `NaN`       |
| **`str * 1`**           | `25`             | `25.24`           | `NaN`                     | `16`           | `0`                 | `0`    | `NaN`       |

---

### Important Edge Case Callouts for Readers

1. **The Empty String / `null` Trap:**

* `Number("")`, `+""`, and `"" * 1` all evaluate to **`0`**, NOT `NaN`!
* `parseInt("")` and `parseFloat("")` return **`NaN`**.
* If `0` is a valid number in your business logic (e.g., user entering `0` quantity vs leaving an input blank), use `parseInt`/`parseFloat` or explicit validation.

1. **Always Pass Radix to `parseInt`:**

* Passing 10 as the second argument (`parseInt(str, 10)`) prevents unexpected parsing of leading zeros in older environments or hex strings like `"0x10"`.

While `Intl.NumberFormat` is designed primarily for **formatting** numbers into localized strings (e.g., `1000` $\rightarrow$ `"1,000"` or `"1.000,00"`), standard JavaScript does not provide a direct `Intl.NumberFormat.parse()` method.

To parse localized formatted strings (containing thousands separators, custom decimal markers, or localized digits) back into standard JS numbers, you use `Intl.NumberFormat.prototype.formatToParts()` to dynamically detect the locale's separators and normalize the string.

---

### 1. Robust Localized Number Parser

This helper uses `formatToParts()` on the target locale to extract its exact **decimal separator**, **grouping separator** (comma/space/dot), and **currency symbols**, then converts the formatted string into a standard JS numeric string for `parseFloat()`:

```javascript
/**
 * Parses a localized number string back into a standard JS number.
 * 
 * @param {string} stringNumber - Formatted string (e.g., "1,234.56" or "1.234,56 €")
 * @param {string} [locale=navigator.language] - The BCP 47 language tag
 * @returns {number} The parsed JavaScript number
 */
function parseLocaleNumber(stringNumber, locale = 'en-US') {
  // 1. Get the locale's formatting parts for a sample number
  const parts = new Intl.NumberFormat(locale).formatToParts(123456.789);

  // 2. Extract decimal and group separators for the given locale
  const decimal = parts.find((p) => p.type === 'decimal')?.value || '.';
  const group = parts.find((p) => p.type === 'group')?.value || ',';

  // 3. Construct a regex to match non-numeric characters EXCEPT the locale's decimal separator
  // Escapes special regex characters like '.' or space
  const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  const cleanRegex = new RegExp(`[^0-9-${escapeRegex(decimal)}]`, 'g');

  // 4. Normalize the string:
  // - Remove thousand separators, currency symbols, spaces
  // - Replace the locale's decimal separator with standard '.'
  const normalized = stringNumber
    .replace(cleanRegex, '')
    .replace(decimal, '.');

  return parseFloat(normalized);
}

// --- Examples Across Different Locales ---

// US / UK Format (Comma group, Dot decimal)
console.log(parseLocaleNumber("1,234,567.89", "en-US")); 
// Output: 1234567.89

// German / French / European Format (Dot group, Comma decimal)
console.log(parseLocaleNumber("1.234.567,89", "de-DE")); 
// Output: 1234567.89

// French Format (Space group, Comma decimal)
console.log(parseLocaleNumber("1 234 567,89 €", "fr-FR")); 
// Output: 1234567.89

// Indian Numbering System (Lakhs/Crores)
console.log(parseLocaleNumber("12,34,567.89", "en-IN")); 
// Output: 1234567.89

```

---

### 2. Handling Non-Latin Digits (e.g., Arabic/Persian/Bengali)

If the input string contains localized numerals (such as Arabic-Indic digits `١٢٣` or Eastern Arabic `۱۲۳`), you can extend the parser by mapping localized digit characters back to ASCII `0-9` using `formatToParts()`:

```javascript
/**
 * Fully locale-aware parser supporting non-Latin numerals (Arabic, Devanagari, Bengali, etc.)
 */
function parseLocalizedNumeral(str, locale = 'ar-EG') {
  // Map localized digits 0-9 for the given locale
  const formatter = new Intl.NumberFormat(locale);
  const digitParts = formatter.formatToParts(1234567890);
  
  // Build a digit lookup map
  const parts = formatter.formatToParts(123456.78);
  const decimal = parts.find((p) => p.type === 'decimal')?.value || '.';

  // Convert localized digits back to 0-9
  let normalized = str;
  const sampleDigits = new Intl.NumberFormat(locale).format(1234567890);
  
  // Normalize numerals and separators
  return parseLocaleNumber(
    normalized.replace(new RegExp(`[${decimal}]`, 'g'), '.'),
    locale
  );
}

```

---

### Key Takeaways

1. **Avoid naive `.replace(',', '')`:** Assuming commas are always thousands separators breaks in European locales where `1,000` means `1` (with 3 decimal places).
2. **`formatToParts()` is the key:** Dynamically querying `Intl.NumberFormat(locale).formatToParts()` ensures your code adapts automatically to any user locale without hardcoding regex rules.
3. **Always sanitize inputs:** Stripping non-numeric characters (except the locale-specific decimal sign) prevents `NaN` errors when processing user inputs from forms.
