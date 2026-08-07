Below is an in-depth explanation and code walkthrough of the given JSON parsing examples, focusing on different scenarios of `JSON.parse` usage:

---

### **Basic JSON Parsing**

```javascript
console.log(JSON.parse("-3")); // Output: -3
console.log(JSON.parse("12")); // Output: 12
console.log(JSON.parse("true")); // Output: true
console.log(JSON.parse('"falcon"')); // Output: falcon
```

#### **Explanation:**
- `JSON.parse` converts JSON strings to their equivalent JavaScript values.
- Numbers (`-3`, `12`), booleans (`true`), and strings (`"falcon"`) are directly parsed.

---

### **Parsing JSON Array**

```javascript
let data = `[
    {
      "id": 1,
      "first_name": "Robert",
      "last_name": "Schwartz",
      "email": "rob23@gmail.com"
    },
    {
      "id": 2,
      "first_name": "Lucy",
      "last_name": "Ballmer",
      "email": "lucyb56@gmail.com"
    },
    {
      "id": 3,
      "first_name": "Anna",
      "last_name": "Smith",
      "email": "annasmith23@gmail.com"
    }
  ]`;

let users = JSON.parse(data);

console.log(typeof users); // Output: object
console.log("-------------------");
console.log(users[1]); // Output: { id: 2, first_name: 'Lucy', last_name: 'Ballmer', email: 'lucyb56@gmail.com' }
console.log("-------------------");
console.log(users); // Outputs the entire array of objects.
```

#### **Explanation:**
- JSON data is parsed into a JavaScript array.
- `typeof users` is `object` since arrays are objects in JavaScript.

---

### **Recursive Parsing and Value Extraction**

```javascript
let user = `{
    "username": "John Doe",
    "email": "john.doe@example.com",
    "state": "married",
    "profiles": [
        {"name": "jd7", "job": "actor" },
        {"name": "johnd7", "job": "spy"}
    ],
    "active": true,
    "employed": true
}`;

let data = JSON.parse(user);

function printValues(obj) {
  for (var k in obj) {
    if (obj[k] instanceof Object) {
      printValues(obj[k]); // Recursive call for nested objects
    } else {
      console.log(obj[k]); // Print primitive values
    }
  }
}

printValues(data);
```

#### **Output:**
```plaintext
John Doe
john.doe@example.com
married
jd7
actor
johnd7
spy
true
true
```

#### **Explanation:**
- A recursive function `printValues` traverses and prints all values in a nested JSON object.

---

### **Custom Parsing with Date Transformation**

```javascript
let data =
  '{ "name": "John Doe", "dateOfBirth": "1976-12-01", "occupation": "gardener"}';

let user = JSON.parse(data, (key, value) => {
  if (key === "dateOfBirth") {
    return new Date(value); // Transform "dateOfBirth" to a JavaScript Date object
  }
  return value;
});

console.log(user);
// Output: { name: 'John Doe', dateOfBirth: 1976-12-01T00:00:00.000Z, occupation: 'gardener' }
```

#### **Explanation:**
- The `reviver` function in `JSON.parse` allows transformation of specific key-value pairs during parsing.

---

### **Custom `parseJSON` Function Implementation**

Below are two implementations of a custom JSON parsing function.

#### **Implementation 1: Basic Parsing**
```javascript
function parseJSON(input) {
  if (input === "") throw Error("Invalid JSON string");
  if (input === "null") return null;
  if (input === "true") return true;
  if (input === "false") return false;
  if (input[0] === '"') return input.slice(1, -1); // Remove quotes for strings
  if (!isNaN(Number(input))) return Number(input); // Convert numeric strings to numbers
  if (input[0] === "[") {
    return input
      .slice(1, -1)
      .split(",")
      .map((item) => parseJSON(item.trim())); // Parse array items
  }
  if (input[0] === "{") {
    return input
      .slice(1, -1)
      .split(",")
      .reduce((obj, item) => {
        const [key, value] = item.split(":").map((x) => x.trim());
        obj[parseJSON(key)] = parseJSON(value);
        return obj;
      }, {});
  }
}
```

#### **Test Cases**
```javascript
console.log(parseJSON('"hello"')); // Output: hello
console.log(parseJSON("true")); // Output: true
console.log(parseJSON("[1,2,3]")); // Output: [1, 2, 3]
console.log(parseJSON('{"key": "value", "num": 5}')); // Output: { key: 'value', num: 5 }
```

#### **Implementation 2: Validating JSON**
```javascript
function parseJSON(str) {
  if (!str || str.trim() === "") return null;

  try {
    return JSON.parse(str); // Use native JSON.parse
  } catch {
    return null; // Return null for invalid JSON strings
  }
}

console.log(parseJSON('{"name":"John"}')); // Output: { name: 'John' }
console.log(parseJSON("[1,2,3]")); // Output: [1, 2, 3]
console.log(parseJSON("")); // Output: null
```

#### **Explanation:**
- The custom function checks for valid JSON syntax and handles invalid cases gracefully.

--- 

By using `JSON.parse` effectively, you can parse, transform, and validate JSON data in various scenarios tailored to your application's needs.