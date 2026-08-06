Your code snippets for getting today's date, yesterday's date, and tomorrow's date are working as expected. Let me break them down and explain how they work:

### 1. **`today` Function:**

This function simply returns the current date in `YYYY-MM-DD` format:

```javascript
const today = () => new Date();

today().toISOString().split('T')[0];
// 2018-10-18 (if the current date is 2018-10-18)
```

- **Explanation**:
  - `new Date()` creates a new `Date` object representing the current date and time.
  - `.toISOString()` converts the `Date` object into a string in ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
  - `.split('T')[0]` splits the string at the `T` character (which separates the date and time), and we take the first part, which is the date (`YYYY-MM-DD`).

- **Example**:
  If today is `October 18, 2018`, the result will be:
  ```javascript
  '2018-10-18'
  ```

### 2. **`yesterday` Function:**

This function returns yesterday's date in `YYYY-MM-DD` format:

```javascript
const yesterday = () => {
  let d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

yesterday().toISOString().split('T')[0];
// 2018-10-17 (if the current date is 2018-10-18)
```

- **Explanation**:
  - `new Date()` creates a new `Date` object for the current date.
  - `d.setDate(d.getDate() - 1)` changes the date to yesterday by subtracting 1 day from the current date.
  - `.toISOString().split('T')[0]` converts the date to the `YYYY-MM-DD` format.

- **Example**:
  If today is `October 18, 2018`, the result will be:
  ```javascript
  '2018-10-17'
  ```

### 3. **`tomorrow` Function:**

This function returns tomorrow's date in `YYYY-MM-DD` format:

```javascript
const tomorrow = () => {
  let d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};

tomorrow().toISOString().split('T')[0];
// 2018-10-19 (if the current date is 2018-10-18)
```

- **Explanation**:
  - `new Date()` creates a new `Date` object for the current date.
  - `d.setDate(d.getDate() + 1)` changes the date to tomorrow by adding 1 day to the current date.
  - `.toISOString().split('T')[0]` converts the date to the `YYYY-MM-DD` format.

- **Example**:
  If today is `October 18, 2018`, the result will be:
  ```javascript
  '2018-10-19'
  ```

### Full Example:

```javascript
// Get today's date
const today = () => new Date();
console.log(today().toISOString().split('T')[0]); // '2018-10-18'

// Get yesterday's date
const yesterday = () => {
  let d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};
console.log(yesterday().toISOString().split('T')[0]); // '2018-10-17'

// Get tomorrow's date
const tomorrow = () => {
  let d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};
console.log(tomorrow().toISOString().split('T')[0]); // '2018-10-19'
```

### Output:

- **Today's date**: `2018-10-18`
- **Yesterday's date**: `2018-10-17`
- **Tomorrow's date**: `2018-10-19`

### Conclusion:

These functions are all doing what they're supposed to:
- `today()` returns the current date.
- `yesterday()` returns the previous day.
- `tomorrow()` returns the next day.

They all return dates in the format `YYYY-MM-DD`, which is great for working with dates in JavaScript.