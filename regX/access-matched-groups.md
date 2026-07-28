### Regular Expressions and Extracting Data

In the provided examples, you're using regular expressions to extract parts of a string that match certain patterns. Let’s break down both of these examples in detail to understand how they work.

---

### Example 1: Date Extraction

```js
const regex = /(\d{2})-(\d{2})-(\d{4})/;
const inputString = "27-06-2023";
const match = regex.exec(inputString);

const day = match[1];
const month = match[2];
const year = match[3];

console.log(day);
console.log(month);
console.log(year);

// Output:
// 27
// 06
// 2023
```

#### Explanation:

- **Regex**: `/(\d{2})-(\d{2})-(\d{4})/`
  - `\d{2}`: Matches exactly two digits. This is used for the day and month.
  - `\d{4}`: Matches exactly four digits. This is used for the year.
  - `-`: The dash `-` is used as a separator between day, month, and year.
  - The entire pattern is wrapped in parentheses `()`, which captures groups.
- **Input**: `"27-06-2023"`
  - This is the string we want to match and extract information from.

- **Regex `exec` method**:
  - `regex.exec(inputString)` is used to execute the regular expression against the string. It returns an array where:
    - `match[0]`: The entire matched string (`"27-06-2023"`).
    - `match[1]`: The first captured group (day, `27`).
    - `match[2]`: The second captured group (month, `06`).
    - `match[3]`: The third captured group (year, `2023`).

- The extracted values (`match[1]`, `match[2]`, and `match[3]`) are assigned to `day`, `month`, and `year`.

- **Output**: The extracted parts of the date are printed:
  - `27`
  - `06`
  - `2023`

---

### Example 2: URL Parsing

```js
const regex = /(https?):\/\/([^:/\s]+)(:\d{2,5})?(\/[^\s]*)?/;
const inputString = "https://www.geeksforgeeks.com:8080/path/to/resource";
const match = regex.exec(inputString);

const protocol = match[1];
const domain = match[2];
const port = match[3];
const path = match[4];

console.log(protocol);
console.log(domain);
console.log(port);
console.log(path);

// Output:
// https
// www.geeksforgeeks.com
// :8080
// /path/to/resource
```

#### Explanation:

- **Regex**: `/((https?):\/\/([^:/\s]+)(:\d{2,5})?(\/[^\s]*)?)/`
  - `(https?)`: This captures the protocol (either `http` or `https`).
    - `https?` matches the literal string "http" or "https".
  - `:\/\/`: This matches the "://", which separates the protocol from the domain.
  - `([^:/\s]+)`: This captures the domain name, which consists of one or more characters that are not `:`, `/`, or whitespace (`\s`).
  - `(:\d{2,5})?`: This optionally captures the port number (if present). The `\d{2,5}` allows a number with 2 to 5 digits, and the colon `:` indicates the port.
  - `(\/[^\s]*)?`: This optionally captures the path, which starts with `/` and can contain any characters except whitespace.

- **Input**: `"https://www.geeksforgeeks.com:8080/path/to/resource"`
  - This is the URL you want to parse.

- **Regex `exec` method**:
  - `regex.exec(inputString)` is used to extract parts of the URL:
    - `match[0]`: The entire matched string (`"https://www.geeksforgeeks.com:8080/path/to/resource"`).
    - `match[1]`: The protocol (`"https"`).
    - `match[2]`: The domain (`"www.geeksforgeeks.com"`).
    - `match[3]`: The port (`":8080"`).
    - `match[4]`: The path (`"/path/to/resource"`).

- **Output**: The extracted parts of the URL are printed:
  - `https` (protocol)
  - `www.geeksforgeeks.com` (domain)
  - `:8080` (port)
  - `/path/to/resource` (path)

---

### Key Points

- **Capturing Groups**: Parentheses `()` are used in regular expressions to capture parts of the match. These captured groups are stored in the array returned by `exec()`.
- **Optional Matches**: The `?` symbol in regular expressions denotes that a part of the pattern is optional. For example, the port (`(:\d{2,5})?`) and the path (`(\/[^\s]*)?`) are optional in the URL regex.
- **Method `exec()`**: The `exec()` method executes the regular expression on the string and returns an array containing:
  - The entire match at index `0`.
  - The captured groups starting at index `1` onwards.

These regular expression techniques are very useful for parsing structured data like dates, URLs, or any string with a predictable pattern.
