### **What is JSON?**

**JSON (JavaScript Object Notation)** is a lightweight data-interchange format that is easy to read and write for humans and simple for machines to parse and generate. It follows JavaScript object syntax and is commonly used for transmitting data across networks, especially between a client (browser) and a server.

- **File Extension**: `.json`
- **MIME Type**: `application/json`
- **Popularized by**: Douglas Crockford

---

### **Why Do You Need JSON?**

- **Universal Format**: Since JSON is text-based, it is language-independent and can be used with virtually any programming language.
- **Data Transmission**: Data sent between a browser and a server must be in text format. JSON serves as a structured and lightweight format for this purpose.
- **Interoperability**: JSON makes it easy to share and exchange data across different systems and technologies.

---

### **Common JSON Operations**

#### 1. **Parsing JSON:**
   Converting a JSON-formatted string into a native JavaScript object.

   ```javascript
   const jsonString = '{"name":"John","age":31}';
   const jsonObject = JSON.parse(jsonString);
   console.log(jsonObject); // {name: "John", age: 31}
   ```

#### 2. **Stringifying JSON:**
   Converting a JavaScript object into a JSON-formatted string.

   ```javascript
   const jsonObject = { name: "John", age: 31 };
   const jsonString = JSON.stringify(jsonObject);
   console.log(jsonString); // '{"name":"John","age":31}'
   ```

---

### **Purpose of `JSON.stringify`**

The `JSON.stringify()` method converts a JavaScript object or value to a JSON-formatted string. This is particularly useful when:

1. Sending data to a server over a network.
2. Storing data in text-based storage systems (e.g., localStorage, databases).

Example:

```javascript
const data = { name: "Alice", age: 25 };
const jsonString = JSON.stringify(data);
console.log(jsonString); // '{"name":"Alice","age":25}'
```

---

### **Purpose of `JSON.parse`**

The `JSON.parse()` method parses a JSON-formatted string into a JavaScript object. This is commonly used when:

1. Receiving data from a server in string format.
2. Reading JSON strings from storage or files.

Example:

```javascript
const jsonString = '{"name":"Alice","age":25}';
const jsonObject = JSON.parse(jsonString);
console.log(jsonObject); // { name: "Alice", age: 25 }
```

---

### **Summary of JSON Operations**

| **Operation**       | **Method**        | **Description**                                                |
|----------------------|-------------------|----------------------------------------------------------------|
| **Stringify JSON**   | `JSON.stringify()` | Converts JavaScript objects to JSON-formatted strings.         |
| **Parse JSON**       | `JSON.parse()`     | Converts JSON-formatted strings into JavaScript objects.       |

JSON is a powerful tool for web development, simplifying the exchange and management of data between systems.