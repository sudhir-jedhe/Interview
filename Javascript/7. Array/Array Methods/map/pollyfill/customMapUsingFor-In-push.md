Write a program to polyfill map functionality of the Array
map iterates over the all values of array and passes value, index and array (itself) as the arguments Function returns a new array which is same as the length of the original array



```js
if (!Array.prototype.map) {
  Array.prototype.map = function (callback) {
    if (typeof callback !== "function")
      throw new Error("Argument passed has to be a function");
 
    let newArray = [];
 
    for (let index in this) {
      newArray.push(callback(this[index], index, this));
    }
    return newArray;
  };
}
```