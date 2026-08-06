We can check if a value is an Array by using the Array.isArray method available from the Array global object. It returns true when the parameter pass to it is an Array otherwise false.

```js
console.log(Array.isArray(5));  //logs false
console.log(Array.isArray("")); //logs false
console.log(Array.isArray()); //logs false
console.log(Array.isArray(null)); //logs false
console.log(Array.isArray({ length: 5 })); //logs false

console.log(Array.isArray([])); //logs true

```
If your environment does not support this method you can use the polyfill implementation.

```js
   function isArray(value){
     return Object.prototype.toString.call(value) === "[object Array]"
   }

```