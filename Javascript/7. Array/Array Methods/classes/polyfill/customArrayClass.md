# CustomArray

```js
class CustomArray extends Array {
  constructor(...args) {
    super(...args);
  }
  customMap(callback) {
    const newArray = new CustomArray();

    for (let i = 0; i < this.length; i++) {
      newArray.push(callback(this[i], i, this));
    }

    return newArray;
  }

  customFilter(callback) {
    const newArray = new CustomArray();

    for (let i = 0; i < this.length; i++) {
      if (callback(this[i], i, this)) {
        newArray.push(this[i]);
      }
    }

    return newArray;
  }

  // Custom method: Double each element in the array
  double() {
    return this.map((item) => item * 2);
  }

  // Override the default toString method
  toString() {
    return `CustomArray: ${super.toString()}`;
  }
}

// Example usage:
const numbers = new CustomArray(1, 2, 3, 4, 5);

const squaredNumbers = numbers.customMap(function (item) {
  return item * item;
});

console.log(squaredNumbers); // Output: CustomArray [1, 4, 9, 16, 25]
console.log(squaredNumbers instanceof CustomArray); // Output: true
console.log(squaredNumbers instanceof Array); // Output: true

```
