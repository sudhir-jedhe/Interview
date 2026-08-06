### Explanation of Methods to Remove Properties from an Object

In JavaScript, there are several ways to **remove or set properties** in an object, depending on your needs (e.g., mutating the object, not mutating the object, etc.). Let's go over the three methods you provided: **setting a property to `undefined`**, **using the `delete` operator**, and **using object destructuring with the spread operator**.

---

### 1. **Setting a Property to `undefined`**

```javascript
const pet = {
  species: 'dog',
  age: 3,
  name: 'celeste',
  gender: 'female'
};

pet.gender = undefined;
Object.keys(pet); // ['species', 'age', 'name', 'gender']
```

#### Explanation:
- When you set a property to `undefined`, the property **remains in the object**, but its value becomes `undefined`.
- **Important**: The property is still present in the object (it’s just `undefined`), so `Object.keys(pet)` will **still list the `gender` property**.
- This does **not remove** the property from the object, but rather **mutates the value** of the property.
- This approach is generally not optimal when you want to truly "remove" a property, as it might cause confusion since the property still exists in the object, even though its value is `undefined`.

---

### 2. **Using the `delete` Operator**

```javascript
const pet = {
  species: 'dog',
  age: 3,
  name: 'celeste',
  gender: 'female'
};

delete pet.gender;
Object.keys(pet); // ['species', 'age', 'name']
```

#### Explanation:
- The `delete` operator **removes the property** from the object entirely.
- After using `delete`, `Object.keys(pet)` no longer lists `gender` because the property has been **removed** from the object.
- **Mutation**: The `delete` operator mutates the original object. It's **not non-mutating**, meaning it directly modifies the object by removing the property.
- This is a more "permanent" solution than setting a property to `undefined`.

---

### 3. **Using Object Destructuring with the Spread Operator**

```javascript
const pet = {
  species: 'dog',
  age: 3,
  name: 'celeste',
  gender: 'female'
};

const { gender, ...newPet } = pet;
Object.keys(pet); // ['species', 'age', 'name', 'gender']
Object.keys(newPet); // ['species', 'age', 'name']
```

#### Explanation:
- **Destructuring** allows you to extract properties from an object and optionally exclude certain ones.
- In this case, `{ gender, ...newPet } = pet`:
  - The `gender` property is **extracted** from the `pet` object.
  - The rest of the properties (`species`, `age`, `name`) are gathered into a new object `newPet` using the **spread operator** (`...`).
- The **original `pet` object remains unchanged**, while a **new object (`newPet`) is created** without the `gender` property.
- **No Mutation**: This method does not mutate the original `pet` object, which makes it a safer approach when you want to avoid changing the original data.

---

### **Comparing the Approaches**

1. **Setting a property to `undefined`:**
   - The property still exists in the object but has an undefined value.
   - The object is mutated, and the property remains in `Object.keys(pet)`.
   - Not the best choice when you want to "remove" a property because it still exists in the object.

2. **Using the `delete` operator:**
   - The property is completely removed from the object.
   - The object is mutated.
   - Suitable when you want to **permanently** remove a property.

3. **Using object destructuring with the spread operator:**
   - The property is omitted from the new object, and the original object is unchanged.
   - **Non-mutating**, which is useful if you want to keep the original object intact.
   - Creates a **new object**, so if you're interested in the result of removing a property without modifying the original, this is a good choice.

---

### Summary:

- **`undefined` assignment**: The property remains in the object, but its value is `undefined`. This does not remove the property.
- **`delete` operator**: Completely removes the property from the object but mutates it.
- **Object destructuring**: Creates a new object with certain properties omitted, leaving the original object unchanged.

Choose the method based on whether or not you want to mutate the original object, and whether you want the property to **still exist** or be completely **removed**.