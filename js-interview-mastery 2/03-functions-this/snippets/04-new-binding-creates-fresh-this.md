# `new` Binding Creates a Fresh `this`

```js
function Car(model) {
  this.model = model;
}
const car1 = new Car('Model 3');
const car2 = new Car('Model Y');
console.log(car1.model, car2.model); // 'Model 3' 'Model Y' — independent objects
```
