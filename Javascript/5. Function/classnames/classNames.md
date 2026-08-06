### Classnames Function Problem

The problem revolves around constructing a `classNames` function that takes multiple arguments (strings, arrays, and objects), processes them, and returns a string of CSS class names. The implementation needs to handle various data types, manage recursive data structures (arrays/objects), and provide a final string of valid class names.

Let's walk through the problem and solution step by step.

### Problem Requirements
1. **Handle Multiple Arguments**: The function should be able to handle multiple arguments of various types, including strings, arrays, and objects.
2. **Recursive Handling for Arrays and Objects**: For arrays and objects, the function needs to recursively traverse and handle their contents.
3. **De-duplicating**: We want to avoid repeating class names. If the same class name appears multiple times, it should only appear once in the final output string.

### Types of Inputs
- **Strings**: Directly added to the output.
- **Numbers**: Converted to strings and added.
- **Arrays**: Recursively processed, with each element being treated as a class name.
- **Objects**: Each key is checked. If the value is truthy, the key (class name) is added to the output.

### Steps to Implement
1. **Initial Validation**: Ignore falsy values (e.g., `null`, `undefined`, `false`).
2. **String and Number Handling**: Add them directly to the `classes` array.
3. **Array Handling**: Recursively call the `classNames` function on arrays.
4. **Object Handling**: Loop through the object's properties, adding keys that have truthy values.
5. **De-duplication**: Use a `Set` to collect class names to avoid duplicates.

---

### Solution Code

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
  // Using a Set to automatically handle de-duplication
  const classes: Set<string> = new Set();

  // Recursive helper function to process arguments
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

### Explanation
1. **Argument Processing**:
   - For each argument, the function checks its type:
     - **String/Number**: Adds to the `classes` set after converting to a string.
     - **Array**: Calls `classNamesImpl` recursively for each element.
     - **Object**: Iterates over the object’s keys and adds keys with truthy values to the set.
2. **Set for De-duplication**: The `Set` data structure automatically handles duplicate class names by ensuring only unique values are stored.
3. **Final Output**: After processing all arguments, the `Set` is converted to an array and joined into a string.

### Example Usage

```typescript
console.log(classNames('foo', 'bar', { foo: true, baz: false }, ['qux', 'foo']));
// Output: "foo bar qux"

console.log(classNames('foo', { bar: true, baz: false }, ['qux', 'bar']));
// Output: "foo bar qux"
```

### Key Features:
- **Recursive Handling**: Supports arrays and nested arrays/objects.
- **De-duplication**: Uses a `Set` to automatically eliminate duplicate class names.
- **Flexible**: Handles strings, numbers, arrays, and objects, making it adaptable to various use cases.
- **Robust**: Handles falsy values and prevents unnecessary class names.

### Performance Considerations
- Using a `Set` for de-duplication is efficient in terms of both time (O(1) insertion) and space.
- Recursion depth should be considered if the input structure is too deep (though unlikely for typical use cases).

This solution addresses the problem efficiently while ensuring that the output is as expected, even with various types of inputs and multiple nested structures.