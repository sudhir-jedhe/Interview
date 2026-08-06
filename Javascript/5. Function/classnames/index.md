To implement the `classNames` function, we'll need to handle different types of inputs such as strings, numbers, arrays, and objects. The function should join these input values conditionally, ensuring that falsy values are ignored and that class names are de-duplicated. Arrays should be recursively flattened to handle nested arrays or objects.

### Approach

1. **String and Number**: Add to the final class names string.
2. **Object**: If the key has a truthy value, add the key (class name).
3. **Array**: Recursively flatten the array and process each element.
4. **Falsy Values**: Ignore values like `null`, `false`, `undefined`, and `""`.

### Steps
- We'll use a helper function to recursively process the arguments.
- Use a `Set` to store the class names and ensure uniqueness.
- Join the class names with a space between them, ensuring no leading or trailing spaces.

### Solution

```typescript
export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;

export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  const classes: Set<string> = new Set();

  // Helper function to process each argument recursively
  function classNamesImpl(...args: Array<ClassValue>) {
    args.forEach((arg) => {
      if (!arg) return; // Ignore falsy values

      const argType = typeof arg;

      // Handle string and number types
      if (argType === 'string' || argType === 'number') {
        classes.add(String(arg)); // Use add to handle de-duplication
        return;
      }

      // Handle arrays (recursively call classNamesImpl for each element)
      if (Array.isArray(arg)) {
        classNamesImpl(...arg);
        return;
      }

      // Handle objects (check for truthy values)
      if (argType === 'object') {
        const objArg = arg as ClassDictionary;
        for (const key in objArg) {
          // Only process own properties and truthy values
          if (Object.hasOwn(objArg, key) && objArg[key]) {
            classes.add(key); // Use add to handle de-duplication
          }
        }
        return;
      }
    });
  }

  // Start processing with the provided arguments
  classNamesImpl(...args);

  // Convert Set to Array and join to form the final string
  return Array.from(classes).join(' ');
}
```

### Explanation:
1. **`classNamesImpl` Function**: This helper function processes each argument recursively.
   - If the argument is a string or number, it adds it to the `Set` to ensure uniqueness.
   - If the argument is an array, it recursively processes the array's elements.
   - If the argument is an object, it loops through the object's keys and adds the keys with truthy values.
2. **`Set` for De-duplication**: We use a `Set` to avoid duplicate class names.
3. **Return**: Finally, the `Set` is converted to an array and joined with a space to form the final string of class names.

### Examples:

```typescript
console.log(classNames('foo', 'bar')); // 'foo bar'
console.log(classNames('foo', { bar: true })); // 'foo bar'
console.log(classNames({ 'foo-bar': true })); // 'foo-bar'
console.log(classNames({ 'foo-bar': false })); // ''
console.log(classNames({ foo: true }, { bar: true })); // 'foo bar'
console.log(classNames({ foo: true, bar: true })); // 'foo bar'
console.log(classNames({ foo: true, bar: false, qux: true })); // 'foo qux'
console.log(classNames('a', ['b', { c: true, d: false }])); // 'a b c'
console.log(classNames('foo', { bar: true, duck: false }, 'baz', { quux: true })); // 'foo bar baz quux'
console.log(classNames(null, false, 'bar', undefined, { baz: null }, '')); // 'bar'
```

### Notes:
- **Falsy Values**: Any falsy values (e.g., `null`, `undefined`, `false`, `""`) are ignored.
- **Flattening Arrays**: Nested arrays and objects are recursively processed.
- **De-duplication**: The `Set` ensures that each class name appears only once in the final output.

This solution provides a flexible and robust way to handle various input types while ensuring the output string is formatted correctly, with no extra spaces or duplicate class names.