You're looking to convert between a query string and an object in JavaScript, which is a common task when working with URLs in web applications. Let's break down the two conversions: **query string to object** and **object to query string**, along with some efficient code solutions for both.

### 1. **Query String to Object**

A query string is a part of a URL that starts after the `?` character and contains key-value pairs, separated by `&`. For example:

```
https://example.com?page=1&count=10&sort=desc
```

#### Approach:

- **Use `URLSearchParams`**: This built-in API is useful for parsing query strings and handling their parameters.
- **Split the string**: If the query string is part of a URL, we can split the string on `?` to isolate the query string portion.
- **Convert to Object**: We can convert the query string to an object using `Object.fromEntries` combined with `URLSearchParams`.

Here’s a clean function to do that:

```javascript
const queryStringToObject = (url) => {
  // Split URL and isolate the query string part after '?'
  const queryString = url.split("?")[1];

  // Use URLSearchParams to parse the query string and convert it to an object
  return queryString
    ? Object.fromEntries(new URLSearchParams(queryString))
    : {};
};

// Example usage
const result = queryStringToObject(
  "https://example.com?page=1&count=10&sort=desc",
);
console.log(result);
// Output: { page: '1', count: '10', sort: 'desc' }
```

#### Explanation:

- The `split('?')[1]` isolates the query string from the full URL.
- `new URLSearchParams(queryString)` parses the query string into key-value pairs.
- `Object.fromEntries()` converts the pairs into an object.

### 2. **Object to Query String**

Conversely, converting an object to a query string means turning an object like this:

```javascript
const params = { page: "1", count: "10", sort: "desc" };
```

Into a string like this:

```
?page=1&count=10&sort=desc
```

#### Approach:

- **Use `Object.entries()`**: Convert the object to an array of key-value pairs.
- **Join the pairs**: Use `map()` and `join()` to concatenate the pairs into a query string.
- **Encode values**: Ensure that all values are properly URL-encoded.

Here’s a function to convert an object to a query string:

```javascript
function objectToQueryString(obj) {
  return obj
    ? Object.entries(obj) // Convert object to an array of key-value pairs
        .map(
          ([key, val]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
        ) // Encode each pair
        .join("&") // Join all pairs with '&'
    : ""; // Return an empty string if the object is empty
}

// Example usage
const queryString = objectToQueryString({
  page: "1",
  count: "10",
  sort: "desc",
});
console.log(queryString);
// Output: "page=1&count=10&sort=desc"
```

#### Explanation:

- `Object.entries(obj)` converts the object into an array of key-value pairs.
- `map()` is used to create a string for each pair, with `encodeURIComponent` to ensure proper URL encoding.
- `join('&')` concatenates the key-value pairs with `&`.

### 3. **Handling Undefined or Null Values**

Both of these functions should handle edge cases like `undefined`, `null`, or empty values:

#### For `queryStringToObject`:

`URLSearchParams` automatically ignores `null` or `undefined` parameters, but if you need to handle cases where parameters are missing or malformed, you might want to validate or filter those.

#### For `objectToQueryString`:

If you pass `undefined` or `null` values in the object, they should be omitted from the query string:

```javascript
const result = objectToQueryString({ page: "1", size: "2kg", key: undefined });
// Output: "page=1&size=2kg"
```

### 4. **Full Example with Both Functions**

Here’s a complete example that converts between a query string and an object, along with handling undefined values:

```javascript
// Convert object to query string
function objectToQueryString(obj) {
  return obj
    ? Object.entries(obj)
        .filter(([key, val]) => val !== undefined && val !== null) // Remove undefined/null values
        .map(
          ([key, val]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
        )
        .join("&")
    : "";
}

// Convert query string to object
const queryStringToObject = (url) => {
  const queryString = url.split("?")[1];
  return queryString
    ? Object.fromEntries(new URLSearchParams(queryString))
    : {};
};

// Example usage
const obj = {
  name: "John Doe",
  age: 30,
  occupation: "Software Engineer",
  key: undefined,
};
const queryString = objectToQueryString(obj);
console.log(queryString);
// Output: "name=John%20Doe&age=30&occupation=Software%20Engineer"

const objFromQuery = queryStringToObject(
  "https://example.com?page=1&count=10&sort=desc",
);
console.log(objFromQuery);
// Output: { page: '1', count: '10', sort: 'desc' }
```

### Conclusion:

These functions allow you to efficiently convert between query strings and JavaScript objects:

- **`objectToQueryString`**: Converts an object to a query string by iterating over the object’s entries and encoding them appropriately.
- **`queryStringToObject`**: Converts a query string back into an object, using the `URLSearchParams` API to parse the string.

Both functions handle common edge cases, such as `undefined` and `null` values.
