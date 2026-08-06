Certainly! Below is the code that transforms an object into an array-like structure using a **JavaScript Proxy**. This version incorporates methods like `map`, `reduce`, `forEach`, `filter`, and more, making it behave similarly to an array.

```javascript
// toKeyedArray function to wrap an object with array-like methods and behaviors
const toKeyedArray = obj => {
  // Define array-like methods for objects
  const methods = {
    map(target) {
      return callback =>
        Object.keys(target).map(key => callback(target[key], key, target));
    },
    reduce(target) {
      return (callback, accumulator) =>
        Object.keys(target).reduce(
          (acc, key) => callback(acc, target[key], key, target),
          accumulator
        );
    },
    forEach(target) {
      return callback =>
        Object.keys(target).forEach(key => callback(target[key], key, target));
    },
    filter(target) {
      return callback =>
        Object.keys(target).reduce((acc, key) => {
          if (callback(target[key], key, target)) acc[key] = target[key];
          return acc;
        }, {});
    },
    slice(target) {
      return (start, end) => Object.values(target).slice(start, end);
    },
    find(target) {
      return callback => {
        return (Object.entries(target).find(([key, value]) =>
          callback(value, key, target)
        ) || [])[0];
      };
    },
    findKey(target) {
      return callback =>
        Object.keys(target).find(key => callback(target[key], key, target));
    },
    includes(target) {
      return val => Object.values(target).includes(val);
    },
    keyOf(target) {
      return value =>
        Object.keys(target).find(key => target[key] === value) || null;
    },
    lastKeyOf(target) {
      return value =>
        Object.keys(target)
          .reverse()
          .find(key => target[key] === value) || null;
    },
  };

  const methodKeys = Object.keys(methods);

  // The handler intercepts the `get` operation and adds array-like behavior
  const handler = {
    get(target, prop, receiver) {
      if (methodKeys.includes(prop)) return methods[prop](...arguments);

      const [keys, values] = [Object.keys(target), Object.values(target)];
      if (prop === 'length') return keys.length; // Length of the object (number of keys)
      if (prop === 'keys') return keys; // Keys of the object
      if (prop === 'values') return values; // Values of the object
      if (prop === Symbol.iterator)
        return function* () {
          for (value of values) yield value; // Iterable over the values
          return;
        };
      else return Reflect.get(...arguments); // For normal properties, delegate to Reflect
    },
  };

  // Return a Proxy that intercepts access to the object
  return new Proxy(obj, handler);
};

// Example Usage
const x = toKeyedArray({ a: 'A', b: 'B' });

// Accessing properties and values
console.log(x.a);         // 'A'
console.log(x.keys);      // ['a', 'b']
console.log(x.values);    // ['A', 'B']
console.log([...x]);      // ['A', 'B']
console.log(x.length);    // 2

// Inserting values
x.c = 'c';  // x = { a: 'A', b: 'B', c: 'c' }
console.log(x.length);   // 3

// Array methods
x.forEach((v, i) => console.log(`${i}: ${v}`));  // Logs: 'a: A', 'b: B', 'c: c'
console.log(x.map((v, i) => i + v));             // ['aA', 'bB', 'cc']
console.log(x.filter((v, i) => v !== 'B'));      // { a: 'A', c: 'c' }
console.log(x.reduce((a, v, i) => ({ ...a, [v]: i }), {}));  // { A: 'a', B: 'b', c: 'c' }
console.log(x.slice(0, 2));                      // ['A', 'B']
console.log(x.slice(-1));                        // ['c']
console.log(x.find((v, i) => v === i));          // 'c'
console.log(x.findKey((v, i) => v === 'B'));     // 'b'
console.log(x.includes('c'));                    // true
console.log(x.includes('d'));                    // false
console.log(x.keyOf('B'));                       // 'b'
console.log(x.keyOf('a'));                       // null
console.log(x.lastKeyOf('c'));                   // 'c'
```

### **How It Works**

1. **Methods (like `map`, `reduce`, `filter`, etc.)**: 
   - These methods are defined in the `methods` object. When you call one of these methods (like `x.map()`), it gets intercepted by the Proxy and executed using the respective method.
   
2. **Special Properties (`keys`, `values`, `length`)**: 
   - These properties are handled directly in the Proxy handler to return the object's keys, values, or the number of keys (`length`).

3. **Iterable (`Symbol.iterator`)**:
   - The Proxy defines a custom iterator to allow the object to be iterated using a `for...of` loop or spread syntax (`[...x]`).

4. **Adding New Properties**:
   - You can add properties to the object just like a normal object, and the Proxy will adjust the length accordingly. For example, `x.c = 'c'` adds a new property `c` and updates `x.length` to 3.

5. **Accessing Properties**:
   - Direct property access (like `x.a` or `x.keys`) is intercepted by the Proxy, and either the value or a custom property (like `keys`, `values`, or `length`) is returned.

### **Example Output:**
```javascript
console.log(x.a);         // 'A'
console.log(x.keys);      // ['a', 'b']
console.log(x.values);    // ['A', 'B']
console.log([...x]);      // ['A', 'B']
console.log(x.length);    // 2

// Adding a new property
x.c = 'c';
console.log(x.length);    // 3

// Array-like methods
x.forEach((v, i) => console.log(`${i}: ${v}`));  // Logs: 'a: A', 'b: B', 'c: c'
console.log(x.map((v, i) => i + v));             // ['aA', 'bB', 'cc']
console.log(x.filter((v, i) => v !== 'B'));      // { a: 'A', c: 'c' }
console.log(x.reduce((a, v, i) => ({ ...a, [v]: i }), {}));  // { A: 'a', B: 'b', c: 'c' }
console.log(x.slice(0, 2));                      // ['A', 'B']
console.log(x.slice(-1));                        // ['c']
console.log(x.find((v, i) => v === i));          // 'c'
console.log(x.findKey((v, i) => v === 'B'));     // 'b'
console.log(x.includes('c'));                    // true
console.log(x.includes('d'));                    // false
console.log(x.keyOf('B'));                       // 'b'
console.log(x.keyOf('a'));                       // null
console.log(x.lastKeyOf('c'));                   // 'c'
```

### **Conclusion**

With this `Proxy`-based solution, you’ve turned a regular object into a powerful, array-like structure. It supports methods typically found in arrays, such as `map`, `reduce`, `filter`, and more, while still preserving the object’s key-value nature. This approach makes the object more versatile, allowing you to handle it like an array without needing to transform it explicitly.