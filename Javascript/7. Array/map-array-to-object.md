The provided solutions for **mapping an array of primitives** and **mapping an array of objects** to an object are clean and efficient. Here's a detailed explanation of how each part works, and additional examples for both cases.

---

### **Mapping an Array of Primitives to an Object**

The goal here is to take an array of primitives (numbers, strings, etc.) and transform it into an object, where each element becomes both a key and a value.

#### Example:

```javascript
const mapObject = (arr, fn) =>
  Object.fromEntries(arr.map((el, i, arr) => [el, fn(el, i, arr)]));

console.log(mapObject([1, 2, 3], a => a * a));
// Output: { 1: 1, 2: 4, 3: 9 }
```

#### **Explanation**:
1. `arr.map((el, i, arr) => [el, fn(el, i, arr)])`:
   - We use `Array.prototype.map()` to iterate over each element `el` in the array `arr`.
   - `map()` takes a callback function with parameters `el` (the element), `i` (the index), and `arr` (the original array).
   - For each element `el`, the callback creates a key-value pair where the key is `el` and the value is the result of applying the function `fn(el, i, arr)`.
   
2. `Object.fromEntries()`:
   - This method takes an array of key-value pairs (like `[[key1, value1], [key2, value2]]`) and returns an object created from those pairs.

In this case, for the input `[1, 2, 3]` and the function `a => a * a`, the object `{ 1: 1, 2: 4, 3: 9 }` is created, where each number is squared.

---

### **Mapping an Array of Objects to an Object**

Now, let's extend this concept to an array of objects. We want to use **two mapping functions**:
1. The first function (`mapKey`) maps the key of the object.
2. The second function (`mapValue`, which defaults to the identity function) maps the value of the object.

#### Example:

```javascript
const mapObject = (arr, mapKey, mapValue = i => i) =>
  Object.fromEntries(
    arr.map((el, i, arr) => [mapKey(el, i, arr), mapValue(el, i, arr)])
  );

const people = [ { name: 'John', age: 42 }, { name: 'Adam', age: 39 } ];

console.log(mapObject(people, p => p.name.toLowerCase()));
// Output: { john: { name: 'John', age: 42 }, adam: { name: 'Adam', age: 39 } }

console.log(mapObject(people, p => p.name.toLowerCase(), p => p.age));
// Output: { john: 42, adam: 39 }
```

#### **Explanation**:
1. `arr.map((el, i, arr) => [mapKey(el, i, arr), mapValue(el, i, arr)])`:
   - We map over the array `arr` (which contains objects like `{ name: 'John', age: 42 }`).
   - For each element `el` (an object), we apply the `mapKey` function to determine the **key** for the object and `mapValue` (or its default) to determine the **value**.

2. The result of the `map()` call is an array of key-value pairs, which `Object.fromEntries()` turns into an object.

#### **Use Cases**:
- **Map Objects by Key**:
   - `mapObject(people, p => p.name.toLowerCase())` maps each person's name (converted to lowercase) to the object itself.
   
- **Map Objects by Key-Value**:
   - `mapObject(people, p => p.name.toLowerCase(), p => p.age)` maps each person's name (converted to lowercase) to their corresponding age.

---

### **Additional Examples**:

1. **Mapping an Array of Numbers to their Squares**:

```javascript
const nums = [1, 2, 3, 4];
const result = mapObject(nums, num => num, num => num * num);
console.log(result);
// Output: { 1: 1, 2: 4, 3: 9, 4: 16 }
```
Here, the numbers are the keys, and their squares are the values.

2. **Mapping an Array of Strings to their Lengths**:

```javascript
const strings = ["apple", "banana", "cherry"];
const result = mapObject(strings, str => str, str => str.length);
console.log(result);
// Output: { apple: 5, banana: 6, cherry: 6 }
```
Here, the strings are the keys, and the lengths of the strings are the values.

3. **Mapping Objects by a Property**:

```javascript
const cars = [
  { make: "Toyota", model: "Corolla", year: 2020 },
  { make: "Honda", model: "Civic", year: 2021 },
];
const result = mapObject(cars, car => car.make, car => car.year);
console.log(result);
// Output: { Toyota: 2020, Honda: 2021 }
```
Here, the `make` of the car is used as the key, and the `year` is used as the value.

---

### **Summary**:

- **`mapObject(arr, fn)`**: This maps an array of primitives to an object by creating key-value pairs where the key is the element itself and the value is the result of applying a function.
  
- **`mapObject(arr, mapKey, mapValue)`**: This allows mapping an array of objects to an object. The `mapKey` function is used to determine the key of the object, and the `mapValue` function is used to determine the value.

- The combination of **`map()`** and **`Object.fromEntries()`** allows for very flexible and concise mapping of arrays into objects.

Let me know if you'd like further examples or explanations!