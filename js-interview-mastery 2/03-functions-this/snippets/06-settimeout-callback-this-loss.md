# `setTimeout` Callback Loses Method `this` Unless Arrow or Bind Is Used

```js
const clock = {
  time: '10:00',
  tickRegular() {
    setTimeout(function() {
      console.log(this?.time); // undefined — plain function, no implicit binding from setTimeout
    }, 0);
  },
  tickArrow() {
    setTimeout(() => {
      console.log(this.time); // '10:00' — arrow inherits `this` from tickArrow
    }, 0);
  }
};
clock.tickRegular();
clock.tickArrow();
```
