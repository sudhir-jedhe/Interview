In the provided code snippet, there is a slight issue with the `isNumber` function. It only returns `true` explicitly when the type of `value` is `"number"`. Otherwise, it implicitly returns `undefined`. While this works in practice for filtering, it's better to explicitly handle the `false` case to improve code readability and consistency.

Here's the revised and functioning version of your code:

```javascript
function isNumber(value) {
  return typeof value === "number";
}

let data = [10, null, "30", 1.4, "falcon", undefined, true, 17];

let res = data.filter(isNumber);
console.log(res);
```

### **Explanation**
1. **`isNumber` Function:**
   - The function checks if the type of the given `value` is `"number"`.
   - It explicitly returns `true` if the condition is met and `false` otherwise.

2. **`filter` Method:**
   - It applies the `isNumber` function to each element in the `data` array.
   - Only elements that return `true` are included in the filtered result.

3. **`data` Array:**
   - Contains a mix of numbers, strings, `null`, `undefined`, and other types.

4. **Output:**
   - Filters out only numeric values.

### **Output**
```javascript
[10, 1.4, 17]
```

This way, the code is clean, concise, and adheres to best practices.