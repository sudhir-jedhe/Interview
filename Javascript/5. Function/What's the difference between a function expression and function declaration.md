**What's the difference between a function expression and function declaration?**

```js
hoistedFunc();
notHoistedFunc();

function hoistedFunc(){
  console.log("I am hoisted");
}

var notHoistedFunc = function(){
  console.log("I will not be hoisted!");
}

```
The notHoistedFunc call throws an error while the hoistedFunc call does not because the hoistedFunc is hoisted while the notHoistedFunc is not.