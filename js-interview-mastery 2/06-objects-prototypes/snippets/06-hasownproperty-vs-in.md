# Snippet: hasOwnProperty vs in

```js
function Car() {}
Car.prototype.wheels = 4;
const car = new Car();
car.color = "red";

console.log("color" in car);               // true
console.log("wheels" in car);              // true (inherited)
console.log(car.hasOwnProperty("color"));  // true
console.log(car.hasOwnProperty("wheels")); // false
```

`in` answers "is this property reachable anywhere on the chain?" `hasOwnProperty` answers "does this exact object define it itself?" — `wheels` is inherited from `Car.prototype`, so only `in` reports it as present.
