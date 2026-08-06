Yes, you’re right! In JavaScript, primitive values like `string`, `number`, and `boolean` behave in a way that might seem a bit counterintuitive at first, because they appear to have properties and methods, even though they are not objects by themselves.

### **Primitive Values and Wrapper Objects**

JavaScript uses **wrapper objects** to provide methods and properties for primitive values. This behavior is temporary and happens automatically when a method is called or a property is accessed. Behind the scenes, JavaScript creates a **wrapper object** that wraps the primitive value, allowing you to call methods like `toUpperCase()` or `toString()`, and then discards the wrapper once you're done.

#### **Why does this happen?**
The wrapper objects are created so that primitive values can exhibit object-like behavior. For example, strings are primitive values, but calling `toUpperCase()` on them requires an object with that method. JavaScript automatically converts the primitive value into an appropriate wrapper object to allow that method to be called.

Here’s a breakdown of how JavaScript works with primitives and wrapper objects:

### **String Wrapper Object**
In your example:

```js
let name = "marko";
console.log(name.toUpperCase()); // logs "MARKO"
```

Under the hood, JavaScript converts the primitive string `"marko"` into a `String` object temporarily, like this:

```js
console.log(new String(name).toUpperCase()); // logs "MARKO"
```

However, the `new String(name)` object is created **only for the duration of the method call** and is discarded afterward. This process is transparent to the user and occurs automatically.

### **The Wrapper Objects**

- **String**: Used for primitive strings.
- **Number**: Used for primitive numbers.
- **Boolean**: Used for primitive booleans.
- **Symbol**: Used for primitive symbols (though symbols have very limited methods).
- **BigInt**: Used for primitive BigInt values (introduced in ES2020).

### **How This Works:**
When you invoke a method on a primitive value (like `name.toUpperCase()`), JavaScript follows these steps:

1. **Automatic Boxing**: The primitive value is **boxed** into its corresponding wrapper object.
2. **Method Invocation**: The method is called on the wrapper object.
3. **Object Discard**: After the method invocation, the wrapper object is discarded, and you’re left with the primitive value.

### **Example with `number`**
For numbers, if you do something like this:

```js
let number = 123;
console.log(number.toFixed(2)); // logs "123.00"
```

JavaScript automatically converts the number `123` into a `Number` wrapper object behind the scenes:

```js
console.log((new Number(number)).toFixed(2)); // logs "123.00"
```

### **Primitive Types and Their Wrapper Objects**

Here’s a quick summary of the wrapper objects for each primitive type:

| **Primitive Type** | **Wrapper Object** | **Example** |
|--------------------|--------------------|-------------|
| String             | `String`           | `let str = "hello"; new String(str)` |
| Number             | `Number`           | `let num = 42; new Number(num)` |
| Boolean            | `Boolean`          | `let flag = true; new Boolean(flag)` |
| Symbol             | `Symbol`           | `let sym = Symbol('foo'); new Symbol(sym)` |
| BigInt             | `BigInt`           | `let bigInt = 123n; new BigInt(bigInt)` |

### **Important Notes**

1. **`null` and `undefined` are exceptions**: These two primitives do **not** have wrapper objects. JavaScript does not automatically box `null` or `undefined` when methods are called on them. This is why trying to call a method on `null` or `undefined` will result in a `TypeError`.

    ```js
    let nothing = null;
    nothing.toString(); // Throws TypeError: Cannot read property 'toString' of null
    ```

2. **Temporary Wrappers**: The wrapper objects are **temporary** and only exist for the duration of the operation. They do not persist in memory once the operation is complete.

3. **No Explicit Boxing**: You can manually create wrapper objects using `new String()`, `new Number()`, etc., but this is rarely necessary. JavaScript does it automatically for you when needed.

4. **Performance Considerations**: The automatic boxing of primitives is generally optimized by JavaScript engines. However, if you're doing a lot of operations on primitives in a loop, explicitly using the wrapper objects (though uncommon) might lead to performance overhead due to object creation and garbage collection.

### **Example with Boolean**

```js
let flag = true;
console.log(flag.toString()); // "true"
```

Under the hood, JavaScript does something similar:

```js
console.log(new Boolean(flag).toString()); // "true"
```

The `Boolean` wrapper object is created temporarily for the method call.

---

### **Summary**

- **Primitive values** (`string`, `number`, `boolean`, etc.) do not have properties or methods in a strict sense.
- When you call a method on a primitive value, JavaScript **automatically wraps** the primitive in its corresponding **wrapper object** (like `String`, `Number`, `Boolean`), so you can access methods like `toUpperCase()`, `toFixed()`, etc.
- These wrapper objects are **temporary** and discarded after the method is invoked.
- **`null` and `undefined`** do not get boxed into wrapper objects and will result in errors if you try to invoke methods on them.

This feature is part of JavaScript's design to provide a seamless experience, making it look like primitives have methods and properties while actually using objects behind the scenes to provide that functionality.