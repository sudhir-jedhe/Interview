```javascript
Array.prototype.customMap = function(callback) {
    const newArray = [];
    for (let i = 0; i < this.length; i++) {
      newArray.push(callback(this[i]));
    }
    return newArray;
  };
  
  const numbers = [1, 2, 3, 4, 5];
  const squaredNumbers = numbers.customMap((number) => number * number);
  
  console.log(squaredNumbers); // [1, 4, 9, 16, 25]
  ```


```javascript
Array.prototype.customMap = function(callback, thisArg) {
    var mapArray = [];
    for (let i = 0; i < this.length; i++) {
        let current = this[i];
        mapArray.push(callback.call(thisArg, current, i, this));
    }
    return mapArray;
};

const result = arr.customMap((elem) => {
    return 3 * elem;
  });
console.log(result);
```

```js
function map(arr, mapCallback) {
  // First, we check if the parameters passed are right.
  if (!Array.isArray(arr) || !arr.length || typeof mapCallback !== 'function') { 
    return [];
  } else {
    let result = [];
    // We're making a results array every time we call this function
    // because we don't want to mutate the original array.
    for (let i = 0, len = arr.length; i < len; i++) {
      result.push(mapCallback(arr[i], i, arr)); 
      // push the result of the mapCallback in the 'result' array
    }
    return result; // return the result array
  }
}
```