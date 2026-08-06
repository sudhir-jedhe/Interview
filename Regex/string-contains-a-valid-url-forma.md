The provided code snippets all aim to check if a given string is a valid URL. There are three different approaches, each with its own logic. Let's break them down:

---

### **Approach 1: Using the `URL` constructor (built-in JavaScript method)**

```javascript
function isValidURL(url) {
  try {
    new URL(url); // Attempt to create a URL object.
    return true; // If the URL is valid, the constructor will not throw an error.
  } catch (error) {
    return false; // If an error occurs, it's an invalid URL.
  }
}

console.log(isValidURL("https://www.geeksforgeeks.org/")); // true
console.log(isValidURL("https://ide.geeksforgeeks.org/online-html-editor")); // true
console.log(isValidURL("invalid-url")); // false
```

### **Explanation**:

- This approach uses the **`URL` constructor** to attempt to parse the given URL string.
- If the string is a valid URL, the `URL` constructor will not throw an error, and the function returns `true`.
- If the string is invalid (e.g., "invalid-url"), it will throw an error, and the function will catch it, returning `false`.

### **Advantages**:

- It leverages the built-in URL validation functionality provided by the browser or Node.js environment.
- The `URL` constructor automatically checks for a well-formed URL with protocol (e.g., `https://` or `ftp://`).

---

### **Approach 2: Using Regular Expressions**

```javascript
function isValidURL(url) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

console.log(isValidURL("https://www.geeksforgeeks.org/")); // true
console.log(isValidURL("https://ide.geeksforgeeks.org/online-html-editor")); // true
console.log(isValidURL("invalid-url")); // false
```

### **Explanation**:

- This approach uses a **regular expression** to validate the URL.
- The regex checks:
  - The URL must start with `http://` or `https://` (or `ftp://`).
  - After the protocol, there should be a valid domain or path.
  - The regex ensures that the URL contains valid characters and structure.

### **Advantages**:

- You have full control over the pattern, and can tailor it to be more or less strict.
- Faster for simple use cases when you want to validate only the basic structure of a URL.

### **Disadvantages**:

- It doesn't fully cover all the possible edge cases that `URL` constructor handles, such as specific domain extensions, query parameters, or URL encoding.
- Writing and maintaining complex regex for URL validation can be cumbersome and error-prone.

---

### **Approach 3: Using `URL` constructor with additional checks**

```javascript
function isValidURL(url) {
  try {
    const urlObject = new URL(url);
    // Additional checks can be added here if necessary.
    return true; // If the URL is valid, return true.
  } catch (error) {
    return false; // If an error occurs, it's an invalid URL.
  }
}

console.log(isValidURL("https://www.geeksforgeeks.org/")); // true
console.log(isValidURL("https://ide.geeksforgeeks.org/online-html-editor")); // true
console.log(isValidURL("invalid-url")); // false
```

### **Explanation**:

- This approach is very similar to **Approach 1**, but it leaves room for additional checks if needed (such as checking the hostname or path after the URL is parsed).
- The `URL` constructor parses the URL string and throws an error if it's invalid.

### **Advantages**:

- Simple and reliable.
- Can be extended with additional logic if more validation is required beyond what the `URL` constructor provides.

---

### **Summary and Comparison**:

| **Approach**                        | **Method**                                  | **Advantages**                                                                      | **Disadvantages**                                                                      |
| ----------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **1. `URL` Constructor**            | Built-in `URL` constructor (`new URL(url)`) | - Fully reliable, based on browser/Node.js internals.<br>- Handles edge cases well. | - May not be available in all environments (e.g., in older versions of some browsers). |
| **2. Regular Expression**           | `RegExp.test()` with a custom URL regex     | - Fast for simple use cases.<br>- More flexible and customizable.                   | - Complex regex can be hard to maintain.<br>- Might miss some edge cases.              |
| **3. `URL` Constructor (extended)** | `new URL(url)` + extra checks               | - Flexible and reliable.<br>- Easy to extend with custom logic.                     | - Not much different from Approach 1 in its base form.                                 |

---

### **Best Practices**:

1. If you need full and reliable URL validation, it's best to use the **`URL` constructor** (Approach 1 or 3) since it handles the URL parsing according to official standards.
2. If you're looking for speed and simplicity and the URL format is known and controlled, a **regular expression** (Approach 2) can be a quick solution, though it may not cover all edge cases.
