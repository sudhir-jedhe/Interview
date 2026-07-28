In JavaScript, the `.length` property returns the number of **UTF-16 code units** in a string. When it comes to emoji characters like "👍", they are represented using more than one code unit in UTF-16, because they are "supplementary characters."

Here’s what happens when you run the code:

```javascript
console.log("👍".length);
```

### Explanation:

- The 👍 emoji is a **multicode unit character**. Specifically, it is made up of two UTF-16 code units: one for the skin tone modifier (👍) and one for the emoji itself. In JavaScript, these are stored as two separate code units.
- **UTF-16** uses 16-bit code units, and for some characters (such as emojis, certain symbols, and many other non-BMP characters), more than one code unit is required to represent them. The "👍" emoji, for example, is encoded as a surrogate pair in UTF-16.

### Output:

```javascript
console.log("👍".length); // Output: 2
```

### Why is this happening?

- The `👍` emoji is composed of **two code points** in UTF-16 encoding. When you call `.length` on a string containing this emoji, JavaScript counts the number of code units (16-bit chunks), not the number of characters or graphemes. In the case of "👍", it's counted as **2 units**.

### To get the **actual character count** (the number of visual characters or graphemes), you can use `Array.from()` to properly handle surrogate pairs:

```javascript
console.log(Array.from("👍").length); // Output: 1
```

This method will correctly count "👍" as a single character, because `Array.from()` splits the string into an array of **user-perceived characters**, not raw code units.
