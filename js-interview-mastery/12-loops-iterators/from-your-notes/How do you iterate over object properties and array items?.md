Here are the standard and most efficient ways to iterate over object properties and array items in JavaScript.

---

### 1. Iterating Over Array Items

#### **`for...of` Loop (Recommended for readability)**

Best when you need a clean syntax and want to use `break` or `continue`.

```javascript
const numbers = [10, 20, 30];

for (const num of numbers) {
  console.log(num);
}

```

#### **Array `.forEach()` Method**

Best for executing a function on every item when you don't need to break out of the loop early.

```javascript
const colors = ['red', 'green', 'blue'];

colors.forEach((color, index) => {
  console.log(`${index}: ${color}`);
});

```

#### **`.map()`, `.filter()`, and `.reduce()**`

Best when you want to transform arrays or extract specific subsets into new arrays without mutating the original.

```javascript
const prices = [100, 200, 300];
const discounted = prices.map(price => price * 0.9); // Transforms items

```

---

### 2. Iterating Over Object Properties

#### **`Object.keys()`, `Object.values()`, and `Object.entries()**`

These static methods convert object parts into arrays, letting you use standard array iteration methods like `.forEach()` or `for...of`.

* **`Object.keys()`** (Iterates over keys):

```javascript
const user = { name: 'Alice', age: 30 };

Object.keys(user).forEach(key => {
  console.log(key, user[key]);
});

```

* **`Object.values()`** (Iterates over values):

```javascript
Object.values(user).forEach(value => {
  console.log(value);
});

```

* **`Object.entries()`** (Iterates over both key and value simultaneously—**most common**):

```javascript
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

```

#### **`for...in` Loop**

Iterates over all enumerable properties of an object (including inherited properties from its prototype chain).

> **Note:** It is generally recommended to use `Object.entries()` or guard it with `hasOwnProperty()` to avoid unexpected properties from prototypes.

```javascript
const car = { brand: 'Toyota', model: 'Camry' };

for (const key in car) {
  if (car.hasOwnProperty(key)) {
    console.log(key, car[key]);
  }
}

```
