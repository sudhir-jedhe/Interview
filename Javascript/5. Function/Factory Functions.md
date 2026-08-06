**What Are Factory Functions in JavaScript?**
A function that creates and returns other functions - like a function manufacturer, hence the term factory. These are often closures and have access to values in their parent scope.

Factory functions help when creating similar functions with small changes. For example, functions that perform similar operations but with different inputs, as shown below.
```js
function makeMultiplier(multiplier) {
    return function(x) {
        return x * multiplier;
    }
}

let double = makeMultiplier(2);
console.log(double(5)); // prints 10

let triple = makeMultiplier(3);
console.log(triple(5)); // prints 15

```