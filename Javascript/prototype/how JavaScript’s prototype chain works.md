Here is how JavaScript’s **prototype chain** works for both built-in objects and your own custom functions, tracking how it searches for properties and methods:

---

### 1. How JavaScript Finds Methods (The Prototype Chain Concept)

When you try to call a method or access a property on any object or array, JavaScript follows a specific search order:

1. **The Object Itself:** It checks if the property or method exists directly on the object.
2. **The Prototype (`__proto__` / `Object.getPrototypeOf()`):** If it isn't found there, JavaScript walks up to the object's prototype.
3. **Up the Chain:** It continues climbing higher up the prototype chain (Prototype $\rightarrow$ Parent Prototype $\rightarrow$ `Object.prototype`).
4. **End of Chain (`null`):** If it reaches `null` and still cannot find it, it returns `undefined` (or throws a `TypeError` if you tried to *call* a missing method).

---

### 2. Custom Function Example (Your Dog Example)

```javascript
function Dog(name) {
  this.name = name; // Own property assigned to the instance
}

// Adding a method to the constructor's prototype
Dog.prototype.bark = function() {
  return "Woof";
};

const dog = new Dog("Rex");

// Calling the method
console.log(dog.bark()); // Output: "Woof"

```

#### Step-by-Step Resolution

1. **Does `dog` have a `bark` method directly on itself?** No. `dog` only contains `{ name: "Rex" }`.
2. **Where does JavaScript look next?** It follows the internal link: `dog.__proto__` (which points precisely to `Dog.prototype`).
3. **Does `Dog.prototype` have `bark`?** Yes! It finds `bark` right there, executes it, and returns `"Woof"`.

---

### 3. Built-in Objects Example (Arrays)

```javascript
const nums = [1, 2, 3];

const doubled = nums.map(num => num * 2);
console.log(doubled); // Output: [2, 4, 6]

```

#### Step-by-Step Resolution

1. **Does the array `nums` have a `.map()` method directly on itself?** No. `nums` only contains the indexed elements `[1, 2, 3]`.
2. **Where does JavaScript look next?** It follows `nums.__proto__`, which points to **`Array.prototype`**.
3. **Does `Array.prototype` have `.map()`?** Yes! Built-in methods like `.map()`, `.filter()`, and `.forEach()` live on `Array.prototype`, which is why every array instance can use them.
4. If you kept going higher, `Array.prototype.__proto__` points to `Object.prototype`, and `Object.prototype.__proto__` points to **`null`** (the end of the line).
