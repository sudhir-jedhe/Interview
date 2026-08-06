In JavaScript, both `Object.seal()` and `Object.freeze()` are used to make objects immutable, but they offer different levels of protection. Let's explore the differences between `Object.seal()` and `Object.freeze()`, along with the third method, `Object.preventExtensions()`, to give a more comprehensive view.

### 1. **`Object.seal()`**

The `Object.seal()` method prevents new properties from being added to an object and marks all existing properties as **non-configurable**. However, the values of existing properties can still be modified as long as they are writable.

#### Key Features of `Object.seal()`:
- **Prevents new properties** from being added to the object.
- **Marks all existing properties as non-configurable**. This means you can't delete or reconfigure the properties.
- **Does not make properties immutable**. You can still change the values of existing properties if they are writable.

#### Example:
```javascript
const obj = {
  name: 'John',
  age: 30
};

Object.seal(obj);

obj.age = 35; // Allowed: property value can be modified
obj.city = 'New York'; // Not Allowed: can't add new properties
delete obj.name; // Not Allowed: can't delete properties
console.log(obj); // Output: { name: 'John', age: 35 }
```

#### Summary:
- **Can change property values** (if the properties are writable).
- **Cannot add or delete properties**.
- **Cannot reconfigure properties** (e.g., change a data property to an accessor property).

---

### 2. **`Object.freeze()`**

The `Object.freeze()` method makes an object **deeply immutable** by freezing its properties. This method is more restrictive than `Object.seal()`. It not only prevents adding/deleting properties but also makes the existing properties **non-writable**, **non-configurable**, and **non-enumerable** (i.e., can't modify the values or properties).

#### Key Features of `Object.freeze()`:
- **Prevents new properties** from being added.
- **Prevents existing properties from being modified**.
- **Prevents existing properties from being deleted**.
- **Makes properties non-writable, non-configurable, and non-enumerable**.

#### Example:
```javascript
const obj = {
  name: 'John',
  age: 30
};

Object.freeze(obj);

obj.age = 35; // Not Allowed: cannot modify values
obj.city = 'New York'; // Not Allowed: can't add new properties
delete obj.name; // Not Allowed: can't delete properties
console.log(obj); // Output: { name: 'John', age: 30 }
```

#### Summary:
- **Cannot modify property values** (even if they are writable).
- **Cannot add or delete properties**.
- **Cannot reconfigure properties** (e.g., cannot change property descriptors).

---

### 3. **`Object.preventExtensions()`**

The `Object.preventExtensions()` method prevents new properties from being added to an object, but it does **not affect the ability to modify existing properties**. This is a less restrictive method compared to `seal()` and `freeze()`.

#### Key Features of `Object.preventExtensions()`:
- **Prevents new properties** from being added to the object.
- **Allows existing properties to be modified**.
- **Does not prevent deletion of properties**.

#### Example:
```javascript
const obj = {
  name: 'John',
  age: 30
};

Object.preventExtensions(obj);

obj.age = 35; // Allowed: property value can be modified
obj.city = 'New York'; // Not Allowed: can't add new properties
delete obj.name; // Allowed: can delete existing properties
console.log(obj); // Output: { age: 35 }
```

#### Summary:
- **Can modify existing properties** (if they are writable).
- **Cannot add new properties**.
- **Can delete existing properties**.

---

### **Comparison Table:**

| Method                 | Adds New Properties   | Modifies Existing Properties | Deletes Properties | Makes Properties Non-Configurable |
|------------------------|-----------------------|------------------------------|--------------------|-----------------------------------|
| **`Object.preventExtensions()`** | No                    | Yes                          | Yes                | No                                |
| **`Object.seal()`**          | No                    | Yes (if writable)            | No                 | Yes                               |
| **`Object.freeze()`**        | No                    | No                           | No                 | Yes                               |

### **Key Differences**:

1. **Adding New Properties:**
   - `Object.preventExtensions()`: Allows modification of existing properties but prevents adding new ones.
   - `Object.seal()`: Prevents adding new properties and marks properties as non-configurable.
   - `Object.freeze()`: Prevents adding new properties and makes all properties immutable, including preventing modifications to existing ones.

2. **Modifying Existing Properties:**
   - `Object.preventExtensions()`: Allows modification of existing properties.
   - `Object.seal()`: Allows modification if properties are writable.
   - `Object.freeze()`: Does not allow modification of existing properties (even if writable).

3. **Deleting Properties:**
   - `Object.preventExtensions()`: Allows deleting existing properties.
   - `Object.seal()`: Does not allow deletion of properties.
   - `Object.freeze()`: Does not allow deletion of properties.

4. **Configuring Properties:**
   - `Object.preventExtensions()`: No impact on property configurations.
   - `Object.seal()`: Makes properties non-configurable (cannot redefine or change descriptors).
   - `Object.freeze()`: Makes properties non-configurable, non-writable, and non-enumerable.

---

### **Practical Use Cases:**

1. **`Object.preventExtensions()`**: 
   Use this when you want to ensure no new properties are added to an object, but you still want to allow modifications to the existing properties. For example, you might use it to lock the object structure but allow changes to data.

2. **`Object.seal()`**: 
   Use this when you want to ensure the structure of an object is fixed, but you still want to modify the values of the properties. This can be useful when you're working with objects that need to remain consistent in terms of their properties, but the values are expected to change over time.

3. **`Object.freeze()`**: 
   Use this when you need to make an object **completely immutable**, meaning no changes to its properties, no additions, and no deletions. This is useful when you need to guarantee the integrity of an object and prevent any accidental modifications.

---

### **Final Thoughts:**

- **`Object.preventExtensions()`** is the least restrictive of the three methods, allowing modification of existing properties but preventing additions.
- **`Object.seal()`** provides more security by disallowing property deletions and additions but still allows modification of writable properties.
- **`Object.freeze()`** offers the highest level of protection, making the object fully immutable.

By understanding these differences, you can choose the appropriate method based on your needs for object immutability and protection.