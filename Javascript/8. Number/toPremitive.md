Let's break down each case and explain what's happening in the JavaScript quiz:

---

### **Case 1**: 
```javascript
const obj1 = {
  valueOf() {
    return 1;
  },
  toString() {
    return "100";
  },
};

console.log(obj1 + 1);  // Output?
console.log(parseInt(obj1));  // Output?
```

**Explanation**:
- `obj1` has both `valueOf()` and `toString()` methods.
- When `obj1 + 1` is evaluated, JavaScript first checks if `valueOf()` is present. Since `valueOf()` returns `1`, the operation becomes `1 + 1`, which results in `2`.
- When `parseInt(obj1)` is called, JavaScript will try to convert `obj1` to a string first (because `parseInt` works with strings). Since `obj1.toString()` returns `"100"`, the result is `100`.

**Output**:
```
2
100
```

---

### **Case 2**:
```javascript
const obj2 = {
  [Symbol.toPrimitive]() {
    return 200;
  },

  valueOf() {
    return 1;
  },
  toString() {
    return "100";
  },
};

console.log(obj2 + 1);  // Output?
console.log(parseInt(obj2));  // Output?
```

**Explanation**:
- `obj2` defines the `Symbol.toPrimitive` method, which has the highest priority when performing type conversions.
- When `obj2 + 1` is evaluated, JavaScript first checks for the `Symbol.toPrimitive` method, which returns `200`. Therefore, the operation becomes `200 + 1`, resulting in `201`.
- `parseInt(obj2)` will convert `obj2` to a string using `toString()` because `parseInt` works with strings. The string `"100"` will be used, and `parseInt` returns `100`.

**Output**:
```
201
100
```

---

### **Case 3**:
```javascript
const obj3 = {
  toString() {
    return "100";
  },
};

console.log(+obj3);  // Output?
console.log(obj3 + 1);  // Output?
console.log(parseInt(obj3));  // Output?
```

**Explanation**:
- `obj3` defines the `toString()` method but not `valueOf()`.
- The unary `+` operator is used to convert `obj3` to a number. It calls the `toString()` method and results in `"100"`. When converted to a number, `"100"` becomes `100`.
- For `obj3 + 1`, JavaScript first calls the `toString()` method, which returns `"100"`, so `100 + 1` results in `101`.
- `parseInt(obj3)` calls `toString()` and returns `"100"`, so `parseInt("100")` results in `100`.

**Output**:
```
100
101
100
```

---

### **Case 4**:
```javascript
const obj4 = {
  valueOf() {
    return 1;
  },
};

console.log(obj4 + 1);  // Output?
console.log(parseInt(obj4));  // Output?
```

**Explanation**:
- `obj4` defines the `valueOf()` method, but not `toString()`.
- When `obj4 + 1` is evaluated, JavaScript calls `valueOf()`, which returns `1`, so the operation becomes `1 + 1`, resulting in `2`.
- `parseInt(obj4)` calls `valueOf()` (since `toString()` is not defined), which returns `1`. So `parseInt(1)` results in `1`.

**Output**:
```
2
1
```

---

### **Case 5**:
```javascript
const obj5 = {
  [Symbol.toPrimitive](hint) {
    return hint === "string" ? "100" : 1;
  },
};

console.log(obj5 + 1);  // Output?
console.log(parseInt(obj5));  // Output?
```

**Explanation**:
- `obj5` defines the `Symbol.toPrimitive` method, which returns different values depending on the `hint`. If the `hint` is `"string"`, it returns `"100"`, and for any other hint (such as `"number"`), it returns `1`.
- When `obj5 + 1` is evaluated, JavaScript calls the `Symbol.toPrimitive` method with the `"number"` hint (since the `+` operator expects a numeric value). The method returns `1`, so the operation becomes `1 + 1`, resulting in `2`.
- `parseInt(obj5)` calls `Symbol.toPrimitive` with the `"string"` hint, which returns `"100"`. Therefore, `parseInt("100")` results in `100`.

**Output**:
```
2
100
```

---

### Final Summary:

**Outputs**:

1. **Case 1**:
   ```
   2
   100
   ```

2. **Case 2**:
   ```
   201
   100
   ```

3. **Case 3**:
   ```
   100
   101
   100
   ```

4. **Case 4**:
   ```
   2
   1
   ```

5. **Case 5**:
   ```
   2
   100
   ```