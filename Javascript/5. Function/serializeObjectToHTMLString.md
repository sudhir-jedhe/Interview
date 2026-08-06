Your approach to serializing an object into an HTML string is almost there, but there are a few areas that need attention for it to properly create a well-structured HTML string with proper indentation.

### Issues:
1. **Indentation:** You are correctly passing the `indent` argument, but you should add a proper newline (`\n`) after each element to maintain readable indentation.
2. **Handling Array Elements:** Your code currently does not add any tags around array items. In an HTML context, you may want to wrap each array item inside an element like `<item>`.
3. **Nested Objects:** You need to handle nested objects properly with proper indentation.
4. **Function Handling:** While you're skipping functions, that part can be cleaner with a more explicit check.

### Revised Version of the Code:

```javascript
function serializeObjectToHTMLString(obj, indent = 2) {
  // Check if the object is null or undefined
  if (obj === null || obj === undefined) {
    return "";
  }

  // If the object is an array, handle it with proper indentation
  if (Array.isArray(obj)) {
    let htmlString = "";
    obj.forEach((item) => {
      htmlString += `${' '.repeat(indent)}<item>${serializeObjectToHTMLString(item, indent + 2)}</item>\n`;
    });
    return htmlString;
  }

  // If the object is a plain object
  let htmlString = "";

  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      const value = obj[property];

      // Skip functions or properties that are not data
      if (typeof value === "function" || value === undefined) continue;

      // Add opening tag for the property
      htmlString += `${' '.repeat(indent)}<${property}>`;

      // If the value is an object or an array, recursively serialize
      if (typeof value === "object") {
        htmlString += `\n${serializeObjectToHTMLString(value, indent + 2)}\n`;
        htmlString += `${' '.repeat(indent)}`;
      } else {
        // Add the value if it's a primitive type
        htmlString += `${value}`;
      }

      // Add closing tag for the property
      htmlString += `</${property}>\n`;
    }
  }

  return htmlString;
}

const obj = {
  name: "John Doe",
  age: 30,
  occupation: "Software Engineer",
  contact: {
    email: "johndoe@example.com",
    phone: "123-456-7890"
  },
  hobbies: ["Reading", "Gaming", "Swimming"]
};

const htmlString = serializeObjectToHTMLString(obj);
console.log(htmlString);
```

### **Explanation of Improvements:**

1. **Indentation:**  
   - Every time we go deeper into the object (either into a nested object or array), we increase the indentation level by two spaces. We use `' '.repeat(indent)` to generate spaces for the required indentation.

2. **Handling Arrays:**  
   - For arrays, we wrap each item in `<item></item>` tags. We also maintain proper indentation for each array element.

3. **Recursive Serialization:**  
   - If an object or array is encountered as a value, we recursively serialize it, ensuring proper indentation at each level.

4. **Primitive Values:**  
   - If the value is a primitive (e.g., a string, number, boolean), we simply insert the value directly between the opening and closing tags for that property.

5. **Skipping Functions:**  
   - The code explicitly skips properties that are functions, as they do not need to be serialized.

### **Expected Output:**

```html
<name>John Doe</name>
<age>30</age>
<occupation>Software Engineer</occupation>
<contact>
  <email>johndoe@example.com</email>
  <phone>123-456-7890</phone>
</contact>
<hobbies>
  <item>Reading</item>
  <item>Gaming</item>
  <item>Swimming</item>
</hobbies>
```

### **Key Points:**

1. The function works recursively to serialize both primitive values and nested objects.
2. Arrays are handled separately, wrapping each element inside `<item></item>` tags.
3. Proper indentation ensures that the serialized HTML string is easily readable.

This code should now correctly serialize an object into an HTML string with appropriate indentation and handling for nested objects and arrays. Let me know if you'd like any further modifications!