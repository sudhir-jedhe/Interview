### Key Points About `JSON.stringify` Customization

The second argument to `JSON.stringify()` is used for customization. It can be either:

1. **An array of keys**: Specifies which keys should be included in the stringified output.
2. **A replacer function**: A function that allows fine-grained control over how properties are serialized.

---

### **Example 1: Using an Array of Keys**

This approach is straightforward for selecting specific properties to include in the output.

```javascript
const user = {
  id: 1234,
  username: 'johnsmith',
  name: 'John Smith',
  age: 39
};

console.log(JSON.stringify(user, ['username', 'name']));
// Output: '{ "username": "johnsmith", "name": "John Smith" }'
```

---

### **Example 2: Using a Replacer Function**

A replacer function is more flexible and can:
- Exclude certain keys.
- Transform values before serialization.
- Handle custom objects like instances of classes.

#### **Excluding Keys and Transforming Values**
```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const target = {
  id: 1234,
  location: new Point(10, 20),
  name: 'Delivery point',
};

const serialized = JSON.stringify(target, (key, value) => {
  // Exclude id
  if (key === 'id') return undefined;

  // Convert Point instances to arrays
  if (value instanceof Point) return [value.x, value.y];

  // Return other values unchanged
  return value;
});

console.log(serialized);
// Output: '{ "location": [10, 20], "name": "Delivery point" }'
```

---

### **Further Examples**

#### **Including Derived or Calculated Properties**
A replacer function can add new derived properties to the serialized output.

```javascript
const product = {
  name: 'Laptop',
  price: 1200,
  discount: 0.1,
};

const serialized = JSON.stringify(product, (key, value) => {
  if (key === 'discountedPrice') {
    return product.price * (1 - product.discount); // Add calculated property
  }
  return value;
});

console.log(serialized);
// Output: '{ "name": "Laptop", "price": 1200, "discount": 0.1 }'
```

#### **Customizing for Nested Objects**
You can apply custom logic recursively to handle nested objects.

```javascript
const company = {
  name: 'TechCorp',
  employees: [
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Manager' }
  ],
};

const serialized = JSON.stringify(company, (key, value) => {
  if (key === 'id') return undefined; // Exclude IDs
  return value;
});

console.log(serialized);
// Output: '{ "name": "TechCorp", "employees": [ { "name": "Alice", "role": "Engineer" }, { "name": "Bob", "role": "Manager" } ] }'
```

---

### **Key Considerations**

1. **Circular References**: If the object contains circular references, `JSON.stringify()` will throw an error. You can handle this by tracking visited objects in the replacer function.
   
2. **Undefined Values**: Returning `undefined` from a replacer function excludes that key-value pair from the final output.

3. **Replacer and Arrays**: When serializing arrays, the replacer function is invoked for every index. You can manipulate array elements similarly.

---

These tools provide extensive control over how objects are serialized into JSON, enabling you to meet a wide variety of requirements.