### 10. What are the differences between shallow copy and deep copy?

- **Shallow Copy**: Creates a copy of the object, but nested objects are still references to the original objects.
- **Deep Copy**: Creates a fully independent copy of the object, including nested objects.

Example:

```javascript
const obj1 = { a: 1, b: { c: 2 } };
const shallowCopy = { ...obj1 };
shallowCopy.b.c = 3;
console.log(obj1.b.c); // 3 (shallow copy modified the original object)
```
