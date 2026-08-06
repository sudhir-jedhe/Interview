In JavaScript, **primitive values** like strings, numbers, and booleans do not have methods or properties of their own. However, JavaScript provides a concept called **boxing** to allow primitive values to behave like objects temporarily when accessing their properties or methods.

When you access a property like `length` on a string, JavaScript internally **wraps** the primitive string into a **String object** (this process is known as **boxing**), allowing you to access properties or methods like you would on an object. After the operation is done, the temporary `String` object is discarded (it is **garbage collected**), and the value is treated as a primitive again.

Let's break down the example:

```js
const { length } = "Sudhir";
console.log(length);
```

### Step-by-Step Explanation:

1. **Primitive String**: `"Sudhir"` is a primitive string. Normally, you cannot directly access properties like `length` on primitive values, but JavaScript temporarily wraps the string into a `String` object.

2. **Boxing**: When you access `length`, JavaScript **boxes** the string `"Sudhir"` into a `String` object. This is called **autoboxing**. This temporary object has the `length` property.

3. **Destructuring**: The `{ length }` syntax extracts the `length` property from the boxed `String` object. The length of the string `"Sudhir"` is `6`.

4. **Garbage Collection**: After the value `length` is extracted, the **boxed `String` object** is discarded and garbage collected. The primitive string `"Sudhir"` is now treated as a primitive again.

### Output:

```js
console.log(length);  // Output: 6
```

### Boxing Behavior in Detail:

When JavaScript "boxes" a primitive value, it creates a temporary object wrapper for the primitive. Here's how this works for different primitive types:

- **String**: When you access a property or method on a string, JavaScript creates a temporary `String` object. For example, `"Sudhir".length` creates a `String` object internally to access the `length` property.
  
- **Number**: Similarly, if you call a method like `.toFixed(2)` on a number (`5.678.toFixed(2)`), JavaScript boxes the number into a `Number` object temporarily.

- **Boolean**: If you access properties or methods on a boolean value, such as `true.toString()`, JavaScript temporarily boxes it into a `Boolean` object.

After accessing the property or calling the method, the **temporary wrapper object** is discarded and eligible for garbage collection.

### Example with Number Boxing:

```js
const num = 5;
console.log(num.toString());  // JavaScript boxes the number 5 into a Number object temporarily to call toString()
```

### Garbage Collection:

JavaScript’s **garbage collector** automatically cleans up any temporary objects created during the boxing process. Once the operation (like property access or method call) is complete, the boxed object is no longer needed, and it is discarded, allowing the garbage collector to reclaim that memory.

### Summary:

- **Boxing** is the process where JavaScript wraps primitive values like strings or numbers in their respective object types to allow property or method access.
- When you access a property like `length` on a string, JavaScript internally converts the string to a `String` object temporarily.
- After the operation, the temporary object is discarded and **garbage collected**.
  
This behavior is automatic and happens behind the scenes, making it easy to work with primitive values as if they were objects, without needing to explicitly create wrappers.