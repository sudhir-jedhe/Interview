A **`URIError`** in JavaScript is thrown when one of the global URI (Uniform Resource Identifier) handling functions is used incorrectly, usually by passing it a malformed string.

In web development, URIs (like URLs) often contain special characters that need to be encoded (converted into a safe format, like replacing a space with `%20`) and later decoded. JavaScript provides built-in functions for this, and passing broken data to them is what triggers this error.

Here are the most common causes and how to fix them:

## 1. Decoding Malformed Percent-Encoded Strings

The most frequent cause of a `URIError` happens when using `decodeURI()` or `decodeURIComponent()` on a string that has an invalid percent-encoding sequence.

A valid percent-encoding requires the `%` symbol followed by exactly two hexadecimal digits (e.g., `%20` for a space). If the string contains a lone `%` or an invalid sequence, the engine throws an error because it doesn't know how to decode it.

```javascript
// Valid decoding
console.log(decodeURIComponent("Hello%20World")); // "Hello World"

// Throws URIError: URI malformed
console.log(decodeURIComponent("100% off sale")); 

// Throws URIError: URI malformed (incomplete hex sequence)
console.log(decodeURI("%A")); 

```

**Fix:**
If you are dealing with unpredictable data (like user input or data scraped from external URLs), you should always wrap your decoding logic in a `try...catch` block to handle potential errors gracefully.

```javascript
let urlParam = "100% off sale";

try {
  let decoded = decodeURIComponent(urlParam);
  console.log(decoded);
} catch (error) {
  console.error("Failed to decode URI:", error.message);
  // Fallback logic here
}

```

## 2. Encoding Invalid Unicode Surrogates

While less common, you can also trigger a `URIError` when using `encodeURI()` or `encodeURIComponent()` if the string contains a "lone surrogate."

JavaScript strings use UTF-16, where some special characters (like emojis) are made up of two code units called a surrogate pair. If a string contains half of a pair without the other half, it is considered an invalid character, and the encoding functions will reject it.

```javascript
// \uD800 is a "high surrogate" that requires a matching "low surrogate"
let invalidString = '\uD800';

// Throws URIError: URI malformed
console.log(encodeURI(invalidString)); 

```

**Fix:** Ensure your strings are well-formed before encoding them. If you are programmatically chopping or slicing strings that might contain emojis or complex characters, make sure you aren't splitting them in the middle of a surrogate pair.

Occur when global URI encoding or decoding functions (`decodeURI()`, `decodeURIComponent()`, etc.) are passed an invalid URI format.

```javascript
// Example 1: Malformed percent-encoding sequence
decodeURI("%");

// Example 2: Incomplete hex sequence
decodeURIComponent("%A");

// Example 3: Invalid surrogate pair encoding
decodeURI("%E0%A0");

// Example 4: Invalid character sequence for URI decoding
decodeURIComponent("%G0%00");

// Example 5: Malformed URI component sequence
decodeURIComponent("https://example.com/%");

```
