# Quirks

What will be the output?

<!-- prettier-ignore-start -->
```javascript
function foo(x) {
console.log(arguments)
return x
}
foo(1, 2, 3, 4, 5)
```

When you run this code, the `console.log(arguments)` statement will output an **Array-like object** (specifically, an `Arguments` object) containing all the arguments passed to the function, regardless of whether they are formally defined in the function's parameter list.

### Output

```javascript
[Arguments] { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }

```

*(Note: Depending on the JavaScript environment, the exact representation in the console might look like `[Arguments] { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }` or similar object notation, often listing the `callee` and `Symbol(Symbol.iterator)` properties as well).*

---

### How It Works

* **`arguments` object:** Inside any standard JavaScript function, `arguments` is a local, array-like object accessible inside the function body that contains the values of all arguments passed to that function.
* **Parameters vs. Arguments:** Even though `foo` only explicitly accepts one parameter (`x`), calling `foo(1, 2, 3, 4, 5)` passes five values into the execution context. The `arguments` object captures all of them.
* **Return value:** The function ultimately returns `x`, which evaluates to `1` (the first argument assigned to parameter `x`).
<!-- prettier-ignore-end -->

and

<!-- prettier-ignore-start -->
```javascript
function foo(x) {
console.log(arguments)
return x
}(1, 2, 3, 4, 5)
```

If you run this exact snippet in JavaScript, it will result in a **`TypeError: (intermediate value)(...) is not a function`** (or a `SyntaxError` depending on how the parser handles it).

### Why This Happens

1. **Function Declaration vs. Expression:**
`function foo(x) { ... }` is written as a **function declaration**.
2. **The Grouping Operator `(1, 2, 3, 4, 5)`:**
Because the function declaration is immediately followed by parentheses containing a comma-separated list, JavaScript treats those parentheses as a grouping operator utilizing the comma operator.
3. **The Evaluation Breakdown:**

* The comma operator evaluates every expression from left to right and returns the value of the *last* one. So, `(1, 2, 3, 4, 5)` evaluates to `5`.
* The JavaScript engine then tries to execute the result of that expression as if it were a function call: `5(...)`.
* Since `5` is a number and not a function, JavaScript throws a `TypeError`.

---

### How to Fix It

If your intention was to define an anonymous function expression and immediately invoke it (an **IIFE** — Immediately Invoked Function Expression) while passing those arguments, you need to wrap the function definition itself in parentheses so the parser treats it as an expression:

```javascript
(function(x) {
    console.log(arguments);
    return x;
})(1, 2, 3, 4, 5);

```
<!-- prettier-ignore-end -->
---
What will be the output
<!-- prettier-ignore-start -->
```javascript
a = [1,2,3,4]
a[1.5] = 1.5
a // ?
```

In JavaScript, if you evaluate `a` after running that code, the output will be:

```javascript
[1, 2, 3, 4]

```

### Why?

1. **Arrays are Objects:** In JavaScript, arrays are fundamentally specialized objects where the elements are stored as properties with string keys (e.g., `'0'`, `'1'`, `'2'`, `'3'`).
2. **Non-Integer Indices:** JavaScript array indices must be non-negative integers. When you use a float like `1.5`, JavaScript converts it to the string `"1.5"` and treats it as a standard object property rather than a valid array index.
3. **Effect on Length:** Because `1.5` is not a valid integer index, it does not alter the array's elements or its `length` property (which remains `4`). Under the hood, you've just attached a custom property key `'1.5'` with the value `1.5` to the array object, which doesn't show up when standard array representations (like `console.log(a)` or evaluating `a`) are printed.
<!-- prettier-ignore-end -->
---
What will be the output
<!-- prettier-ignore-start -->
```javascript
function foo(){console.log("hello")}
foo.call.call.call.apply(function bar(x) {console.log(x)}, [this,"world"])
```
<!-- prettier-ignore-end -->

What will be the output

<!-- prettier-ignore-start -->
```javascript
console.log("1" + 2);
console.log(2 + "1");
console.log(1 + 2 + 3 + 4 + "5"); //<-- nb
```
<!-- prettier-ignore-end -->
---
Make it true
<!-- prettier-ignore-start -->
```javascript
var a;
/* put your code here */
a !== a; // should be true
```
<!-- prettier-ignore-end -->

What will be the output

<!-- prettier-ignore-start -->
```javascript
var scores = [98, 74,85, 77, 93,100,89];
var total = 0;
for (var score in scores) { 
  total += score;
} 
var mean = total / scores.length;
console.log(mean); //?
```
<!-- prettier-ignore-end -->
---
What will be the output
<!-- prettier-ignore-start -->
```javascript
[2, 3, -1, -6, 0, -108, 42, 10].sort();
```
<!-- prettier-ignore-end -->

What is the difference between 0 / -0 ?

---

What will be the output

<!-- prettier-ignore-start -->
```javascript
var y = 1;
if (function f(){}) {
  y += typeof f;
}
console.log(y);
```
<!-- prettier-ignore-end -->
---
What will be the output
<!-- prettier-ignore-start -->
```javascript
var foo = function bar(){ return 12; };
typeof bar();  
```
<!-- prettier-ignore-end -->
---
What will be the output
<!-- prettier-ignore-start -->
```javascript
var a={},
    b={key:'b'},
    c={key:'c'};

a[b]=123;
a[c]=456;
console.log(a[b]);
```
<!-- prettier-ignore-end -->
---
What will be the output?
<!-- prettier-ignore-start -->
```javascript
['11','11','11','11'].map(parseInt)
```
<!-- prettier-ignore-end -->
---
what will display alert?
<!-- prettier-ignore-start -->
```javascript
function aaa() {
    return
    {
        test: 1
    };
}
alert(typeof aaa());
```
<!-- prettier-ignore-end -->

What is alerted?

<!-- prettier-ignore-start -->
```javascript
function bar() {
    return foo;
    foo = 10;
    function foo() {}
    var foo = '11';
}
alert(typeof bar());
```
<!-- prettier-ignore-end -->
---
Output?
<!-- prettier-ignore-start -->
```javascript
console.log("1" - - "1")
```
<!-- prettier-ignore-end -->
---
what is the output?
<!-- prettier-ignore-start -->
```javascript
var x = 3;
var foo = {
    x: 2,
    baz: {
        x: 1,
        bar: function() {
            return this.x;
        }
    }
}
var go = foo.baz.bar;
alert(go());
alert(foo.baz.bar());
```
<!-- prettier-ignore-end -->
---
output?
<!-- prettier-ignore-start -->
```javascript
var myArr = ['foo', 'bar', 'baz'];
myArr.length = 0;
myArr.push('bin');
console.log(myArr);
```
<!-- prettier-ignore-end -->
---
Output?
<!-- prettier-ignore-start -->
```javascript
var x = 0;
function foo() {
    x++;
    this.x = x;
    return foo;
}
var bar = new new foo;
console.log(bar.x);
```
<!-- prettier-ignore-end -->
---
result?
<!-- prettier-ignore-start -->
```javascript
var bar = 1,
    foo = {};
foo: {
    bar: 2;
    baz: ++bar;
};
foo.baz + foo.bar + bar;
```
<!-- prettier-ignore-end -->
---
output?
<!-- prettier-ignore-start -->
```javascript
var myArr = ['foo', 'bar', 'baz'];
myArr[2];
console.log('2' in myArr);
```
<!-- prettier-ignore-end -->

output?

<!-- prettier-ignore-start -->
```javascript
function foo(a, b) {
    arguments[1] = 2;
    alert(b);
}
foo(1);
```
<!-- prettier-ignore-end -->
---
What value is alerted?
<!-- prettier-ignore-start -->
```javascript
function foo(){}
delete foo.length;
alert(typeof foo.length);
```
<!-- prettier-ignore-end -->
---
output ?
<!-- prettier-ignore-start -->
```javascript
var f = function g(){ return 23; };
typeof g();
```
<!-- prettier-ignore-end -->
---
output?
<!-- prettier-ignore-start -->
```javascript
var f = (function f(){ return "1"; }, function g(){ return 2; })();
typeof f;
```
<!-- prettier-ignore-end -->
---
output ?
<!-- prettier-ignore-start -->
```javascript
var a = 1,
    b = function a(x) {
        x && a(--x);
    };
alert(a);
```
<!-- prettier-ignore-end -->
---
output?
<!-- prettier-ignore-start -->
```javascript
function a() {
    alert(this);
}
a.call(null);
```
<!-- prettier-ignore-end -->
---
result?
<!-- prettier-ignore-start -->
```javascript
var foo = bar ? bar : 0;
```
<!-- prettier-ignore-end -->
---
How to empty an array in JavaScript ?
<!-- prettier-ignore-start -->
```javascript
var arrayList =  ['a','b','c','d','e','f'];
// how many ways? compare them
```
<!-- prettier-ignore-end -->
---
result? =)
<!-- prettier-ignore-start -->
```javascript
var a = (1,5 - 1) * 2
```
<!-- prettier-ignore-end -->
---
output?
<!-- prettier-ignore-start -->
```javascript
// http://stackoverflow.com/questions/39277394/why-settimeout-calls-make-different-result
setTimeout(function() {
  setTimeout(function() {
    console.log('foo');
  }, 50);
}, 100);
setTimeout(function() {
  setTimeout(function() {
    console.log('baz');
  }, 100);
}, 50);
```
<!-- prettier-ignore-end -->
---
result?
<!-- prettier-ignore-start -->
```javascript
5 > 3 > 2
```
<!-- prettier-ignore-end -->
---
what is logged in the console?
<!-- prettier-ignore-start -->
```javascript
var a;
if (a = (1+1==2)) {
    console.log(a);
} else {
    console.log('false');
}
```
<!-- prettier-ignore-end -->
---
are next expressions equal ? what's the result for both?
<!-- prettier-ignore-start -->
```javascript
1 << 33
(1 << 31) << 2
```
<!-- prettier-ignore-end -->

---

What will be the output

<!-- prettier-ignore-start -->
```javascript
let y = 1;
if (function F(){}) {
  y += typeof F;
}
console.log(y);
```
<!-- prettier-ignore-end -->

# WTF

The file about strange questions. But it still be usefull to discover logic

---

### From ["Хитрые задачки на собеседовании JavaScript"](https://habrahabr.ru/post/322568/)

what is g value?

<!-- prettier-ignore-start -->
```javascript
f = g = 0;
(function () {
  try {
    f = function() {
      return f();
    };
    f();
  } catch (e) {
    return g++ && f();
  } finally {
    return ++g;
  }
  function f() { g += 5; return 0; }
}) ();
```
<!-- prettier-ignore-end -->

---

what is g value?

<!-- prettier-ignore-start -->
```javascript
f = g = 0;
(function () {
  try {
    f = function() {
      return f();
    } && f();
  } catch (e) {
    return g++ && f();
  } finally {
    return ++g;
  }
  function f() { g += 5; return 0; }
}) ();
```
<!-- prettier-ignore-end -->

---

what will be the output?

<!-- prettier-ignore-start -->
```javascript
function b(b) {
  return this.b && b(b)
}
b(b.bind(b))
```
<!-- prettier-ignore-end -->

---

what will be the output?

<!-- prettier-ignore-start -->
```javascript
c = (c) => {
  return this.c && c(c)
}
c(c.bind(c))
```
<!-- prettier-ignore-end -->

---

output? ( just remember about prefix / postfix increment )

<!-- prettier-ignore-start -->
```javascript
var g = 0;
g = 1 && g++;
console.log(g);
```
<!-- prettier-ignore-end -->

which one is correct ? ( about IIFE trick )

<!-- prettier-ignore-start -->
```javascript
!function(){}()
function(){}()
true && function(){}()
(function(){})()
function(){}
!function(){}
```
<!-- prettier-ignore-end -->

---

what will expression return?

<!-- prettier-ignore-start -->
```javascript
var a = b = true, c = (a) => a;
(function a(a = c(b).a = c = () => a) { return a(); })()
```
<!-- prettier-ignore-end -->

---

result?

<!-- prettier-ignore-start -->
```javascript
var a = true;
(a = function () { return a })()
```
<!-- prettier-ignore-end -->

---

what will be the output?

<!-- prettier-ignore-start -->
```javascript
var v = 0;
try {
  throw v = (function(c) { throw v = function(a){ return v; } })();
} catch (e) {
  console.log (e()());
}
```
<!-- prettier-ignore-end -->

# Complex

Spiral output for array

<!-- prettier-ignore-start -->
```javascript
var m = [
  [0,  1,  2,  3,  4],
  [5,  6,  7,  8,  9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19]
];

var spiral = function (m) {
 // Put your code here
};
```
<!-- prettier-ignore-end -->

Should be `[0, 1, 2, 3, 4, 9, 14, 19, 18, 17, 16, 15, 10, 5, 6, 7, 8, 13, 12, 11]`

---

Sort array with semver-rules

<!-- prettier-ignore-start -->
```javascript
var arr = [ "1.0.5", "2.5.0", "0.12.0", "1", "1.23.45", "1.4.50", "1.2.3.4.5.6.7"];

function semverSor() {
  // put your code here
}

semverSor(arr);
```
<!-- prettier-ignore-end -->

Like `[ "0.12.0", "1", "1.0.5", "1.2.3.4.5.6.7", "1.4.50", "1.23.45", "2.5.0" ]`

---

Implement deepClone ( withour recursive links and functions
Simpliest , suppose is JSON.parse(JSON.stringify(m)) but we need real code =)

---

Implement bind(func, context). Make polyfill .bind(context)

---

Check if string is anagramm ( start-to-end is the same as end-to-start)
Like `ololo`.
Option -- the same without spaces like `olo lo`
Option - the same in functional style

---

We have next stub
Fill blank methods to describe algorithms for servicing multistory building with your elevator.
You have only low-leve intarface (HardwareElevator) with three states - stoppes, move up, move down.
Every floor has two buttons up/down
Inside cabin there are only buttons with numbers

<!-- prettier-ignore-start -->
```javascript
DIRECTION_DOWN = -1
DIRECTION_NONE = 0
DIRECTION_UP = 1

function HardwareElevator(){};
HardwareElevator.prototype = {
    moveUp:function(){console.log('moving up');},
    moveDown:function(){console.log('moving down');},
    stopAndOpenDoors:function(){console.log('stopping and opening doors');},
    getCurrentFloor:function(){console.log('getting current floor');},
    getCurrentDirection:function(){console.log('getting current drection');}
}

function Elevator() {
    this.hw = new HardwareElevator();
    this.hw.addEventListener("doorsClosed", _bind(this.onDoorsClosed, this));
    this.hw.addEventListener("beforeFloor", _bind(this.onBeforeFloor, this));
}
Elevator.prototype = {
    onDoorsClosed: function(floor) {
      // put your code here
    },
    onBeforeFloor: function(floor, direction) {
      // put your code here
    },
    floorButtonPressed: function(floor, direction) {
      // put your code here
    },
    cabinButtonPressed: function(floor) {
      // put your code here
    }
}
```
<!-- prettier-ignore-end -->
---
Implement chain map-method which can work with async functions ( promises-based )
Like:
<!-- prettier-ignore-start -->
```javascript
Chain([link1,link2,link3]).mapAsync(link => get(link)).mampAsync(page => printPage)
```
<!-- prettier-ignore-end -->
---

Write code which will output itself into console/document
---

We want to write calculations using functions and get the results. Let's have a look at some examples:
<!-- prettier-ignore-start -->
```javascript
seven(times(five())); // must return 35
four(plus(nine())); // must return 13
eight(minus(three())); // must return 5
six(dividedBy(two())); // must return 3
```
<!-- prettier-ignore-end -->

Requirements:

* There must be a function for each number from 0 ("zero") to 9 ("nine")
* There must be a function for each of the following mathematical operations: plus, minus, times, dividedBy (divided_by in Ruby)
* Each calculation consist of exactly one operation and two numbers
* The most outer function represents the left operand, the most inner function represents the right operand

---

Написать функцию котороя будет разворачивать буквы в словах предложения, но только лишь буквы цифры и специальные символы должны остаться на месте

```
<!-- prettier-ignore-end -->
// s1tar3t 2 hellow  ->  t1rat3s 2 wolleh
// s1ta$%r3t 2 hel^low  ->  t1ra$%t3s 2 wol^leh
// s1tar3t 2   low5  ->  t1rat3s 2   wol5
```

## <!-- prettier-ignore-end -->

Реализовать фукнционал, допускающий следующий код

<!-- prettier-ignore-start -->
```javascript
(3).add(5).multiply(2) // 16
```
<!-- prettier-ignore-end -->

Нужно реализовать следующие методы

* add
* subtract
* multiply
* divide
* square
* После должна появится возможность выстраивать команды в цепочку ( см пример выше )

---

Implement simple module system with injection system like in angular

<!-- prettier-ignore-start -->
```javascript
function($moduleName, $anotherModuleName){}
```
<!-- prettier-ignore-end -->

should get objects from `module('moduleName') / module(anotherModuleName)`

---

Output?

<!-- prettier-ignore-start -->
```javascript
var f = (function f(){ return "1"; }, function g(){ return 2; })();
typeof f;
```
<!-- prettier-ignore-end -->
---
Output?
<!-- prettier-ignore-start -->
```javascript
var text = 'outside';
function logIt(){
    console.log(text);
    var text = 'inside';
};
logIt();
```
<!-- prettier-ignore-end -->
---
Game where everyone win. Output?
<!-- prettier-ignore-start -->
```html
<button id="btn-0">Button 1!</button>
<button id="btn-1">Button 2!</button>
<button id="btn-2">Button 3!</button>
<script type="text/javascript">
    var prizes = ['A Unicorn!', 'A Hug!', 'Fresh Laundry!'];
    for (var btnNum = 0; btnNum < prizes.length; btnNum++) {
        // for each of our buttons, when the user clicks it...
        document.getElementById('btn-' + btnNum).onclick = function() {
            // tell her what she's won!
            alert(prizes[btnNum]);
        };
    }
</script>
```
<!-- prettier-ignore-end -->
---
Define a spacify function which takes a string as an argument, and returns the same string but with each character separated by a space

* `spacify('hello world') // => 'h e l l o  w o r l d'`
* `'hello world'.spacify() //  => 'h e l l o  w o r l d'`

---
Write a program that prints all the numbers from 1 to 100.  For multiples of 3, instead of the number, print "Fizz", for multiples of 5 print "Buzz". For numbers which are multiples of both 3 and 5, print "FizzBuzz".

Option: do it without conditional statements (if/switch/?:)
Option: do not use logical operators (&& / ||)
Option: do not use loops (for/do/while/etc)
---

Create lazy-evaluations POC
<!-- prettier-ignore-start -->
```javascript
var le = new LazyEval([1, 2, 3, 4, 5])
  .filter(i => i > 2)
  .map(i => i * 2);
le.value(); // [6, 8, 10]
```
<!-- prettier-ignore-end -->

*BUT!* all evaluations should be done only after .value() call

---

Create .bind method for function without using .call/.apply (only trash, only hardcore)

---

Create compose function

<!-- prettier-ignore-start -->
```javascript
const compose = (f1, f2) => value => f1( f2(value) )
```
<!-- prettier-ignore-end -->

* list of functions can has any length
* for zero-length list it should return `() => undefined`
  `compose(fn, fn1, fn2, fn3)` ... etc

---

Implement `.map` using `.reduce` for iteration ( for arrays )

---

Fnd average age for male-users

<!-- prettier-ignore-start -->
```javascript
var users = {
  'Bob': { age: 24, isMale: true },
  'Sam': { age: 23, isMale: true },
  'Mag': { age: 54, isMale: false },
  'Ken': { age: 43, isMale: true },
  'Marta': { age: 34, isMale: false },
  'Duglas': { age: 27, isMale: true },
  'Martin': { age: 34, isMale: true },
};
```
<!-- prettier-ignore-end -->

---

**Challenge:** Implement a tic-tac-toe game (3x3)

**Requirements:**

1. program must be a pure JavaScript solution. not looking for a web application here
1. program must play a game for both players with no user interaction
1. program must display the game board after each player move
1. program must display the game winner, or 'draw' if not won

**Notes:**

1. program does not have to choose a player move intelligently
1. don't bother drawing lines for the game board
1. feel free to use underscore/lodash if you like
1. feel free to use es6/es2015 features if you like

Begin when ready, and remember to verbalize your design and implementation thoughts as you proceed.

---

About promises:

* Suppose findData is a function that takes a query object and returns a promise for the result of the query.
* Suppose also that someRandomArrayOfQueries is an array of query objects.

---

Explain what would be printed by the following code and why

<!-- prettier-ignore-start -->
```javascript
function runMultipleQueries(queries) {
 var results = [];
 queries.forEach(doQuery);
 return results;

 function doQuery(query) {
   findData(query)
   .then(results.push.bind(results));
 } 
}
function log(value) {
 console.log(value);
}
runMultipleQueries(someRandomArrayOfQueries).forEach(log);
```
<!-- prettier-ignore-end -->

---

Create code to pass test ( mocha, but it doesn't metter )

<!-- prettier-ignore-start -->
```javascript
describe('Step 5', function() {
  it('add(2,8)(5).value() => 15', function() {
    add(2,8)(5).value()
      .should.be.exactly(15).and.be.a.Number;
  });
  it('add(3, 3, 5)(4)(3, 2).value() => 20', function() {
    add(3, 3, 5)(4)(3, 2).value()
      .should.be.exactly(20).and.be.a.Number;
  });
});
```
<!-- prettier-ignore-end -->

---

Given two identical DOM trees (not the same one), and a node from one of them find the node in the other one.

---

What is the difference between these four promises?

<!-- prettier-ignore-start -->
```javascript
doSomething().then(function () {
  return doSomethingElse();
});

doSomething().then(function () {
  doSomethingElse();
});

doSomething().then(doSomethingElse());

doSomething().then(doSomethingElse);
```
<!-- prettier-ignore-end -->

---

Implement function to remove duplication from list (array)

---

You have a function `rand7()` that generates a random integer from 1 to 7.
Use it to write a function `rand5()` that generates a random integer from 1 to 5.

* rand7() returns each integer with equal probability.
* rand5() must also return each integer with equal probability.

---

For next markup

<!-- prettier-ignore-start -->
```html
<div id="selectio">Select me!</div>
```
<!-- prettier-ignore-end -->

create js code ( via native js ) which on click at div will select all text inside
note - just check range/selection api

---

A polindromic number reads the same both ways.
The largest polindrome made from the product of two 2-digit numbers is 9009 = 91\*99.
Find the largest polindrom made from the product of two 3-digit numbers.

---

Given an input string, you should check if the string contains the same amount of 'x' and 'o'. The case doesn't matter - if the amount is equal, return a true otherwise return false.

<!-- prettier-ignore-start -->
```javascript
describe('sameXOAmount()', () => {
   it('should return `true` if number of `X` and `O` is equal', () => {
     expect(sameXOAmount('xXoO')).toEqual(true);
     expect(sameXOAmount('aAxXXbBoOo')).toEqual(true);
     expect(sameXOAmount('abc')).toEqual(true);
    });
   it('should return `false` if number of `X` and `O` is not equal', () => {
    expect(sameXOAmount('OaAxXbBoO')).toEqual(false);
    expect(sameXOAmount('xgXoXsdxOxz')).toEqual(false);
    expect(sameXOAmount('aaAmmMxMM')).toEqual(false);
   });
 });
```
<!-- prettier-ignore-end -->

---

Given an array of numbers, you should find the number which occurs an odd number of times within the array.
You can assume that there is always just one number with an odd amount.
Furthermore the array is never undefined and contains only numbers.

<!-- prettier-ignore-start -->
```javascript
describe('findOddAmount()', () => {
  it('should return the number which occurs with an odd frequency', () => {
     expect(findOddAmount([1, 2, 2, 3, 3])).toEqual(1);
     expect(findOddAmount([8, 8, 7, 7, 7])).toEqual(7);
     expect(findOddAmount([10, 3, 3, 10, 6, 10, 6, 1, 1])).toEqual(10);
   });
});
```
<!-- prettier-ignore-end -->

---

Create `uniq` function, witch takes a list and returns only uniq values from list. Like in lodash/underscore

---

Let imaging sequence `1010010001000010000010000001...` `(k(1->oo) "1{0xk}"`. Create function which takes number of symbols as an argument and returns n-first symbols of the sequence

---

Create `.bind` polyfill without using `.call`/`.apply` ( really tricky task, but it gives food for dicussion )

---

Based on list of chars, find the longes polindrome ( string equal in both directions: rtl = ltr ) like ['a', `'b', 'c', 'a', 'b', 'd'] => 'abcba' / 'abdba'`

---

Implement shuffle(list) function which suffle list ( randomize list elements )

---

Create Promise implementation

NB: In fact it was pair programmng session but it could be meditative task, wich takes as much time as you have. It covers a lot of topics - async / flow / thenable-interface / functions / exceptions etc.

---

<!-- prettier-ignore-start -->
```javascript
ar arr = [1,2,42,3];
var brr = [];

for (var i = 0; i < arr.length; i++) {
  if (arr[i] === 42) {
    // fill it as short as possible
    // to get brr equal to [1,2,3]
  }

  brr.push(arr[i]);
}
```
<!-- prettier-ignore-end -->

---

Write a `matchSum(list, targetValue)` function. Which takes list of numbers and target sum and returns pair of elements which gives target sum.

```
<!-- prettier-ignore-end -->
matchSum([4, 7, 1, 8, 9], 11); // [4, 7]
```

<!-- prettier-ignore-end -->

* what if you need return all pairs?
* could you implement linear complexity ?

---

Write your out `trim()` function (obviously - do not use `String.prototype.trim`). Extended: create `trim('zxc')` function which takes list of symbols to trim.

---

Are you familiar with common.js modules? When inside module we are able to use `module` / `exports` ? *( what's the difference in usage `module.exports` / `exports` ?) )* Please implement your own `require` function with the same functionality, as original.

---

**Light version**: Write a function checking that the given string is valid. We consider a string
to be valid if all the characters of the string have exactly the same frequency.

Examples:

* `aabbcc` is a valid string
* `aabbccc` is an invalid string

**Extended version**: Check if the string is valid as it is (same condition as before) or if **one** character
at one position can be removed from the string so it will become valid.

Examples:

* `aabbcc` -> **true**
* `aabbcccc` -> **false**
* `aabbccf` -> **true**
* `aaabbbcccf` -> **true**
* `aabbccc` -> **true**
* `abcddff` -> **false**
* `abcdefffff` -> **false**
* `aabbccddd` -> **true**

---

Again about brackets.

Easy part:

* '(', '{', '[' are called "openers".
* ')', '}', ']' are called "closers".
  Write an efficient function that tells us whether input string's openers
  and closers are properly nested.

Examples:

```
<!-- prettier-ignore-end -->
"{ [ ] ( ) }" -> true
"{ [ ( ] ) }" -> false
"{ [ }" -> false
"class Example { public do() { return; } }" -> true
"class Example { public do( { return; } }" -> false
```

<!-- prettier-ignore-end -->

Extra: handle also next types of brackes

```
<!-- prettier-ignore-end -->
<>
''
||
```

<!-- prettier-ignore-end -->

There might be multiple ways how to interpret lines `''''` (`'('')'` or `('')('')`) - in my concrete situation we agreed that we're closing bracket everytime we can. It influences to the cases like `'"'||'"'` which we interpret like `'("('(||)')")'`

Tests we agreed during an interview:

<!-- prettier-ignore-start -->
```javascript
test('', true);
test('some', true);
test('(', false);
test('()', true);
test('()[', false);
test('()[]', true);
test(')', false);
test('([)]', false);
test('((', false);
test('())', false);

test('class Example { public do() { return; } }', true);
test('class Example { public do( { return; } }', false);

test("('['", false); 
test("(')'", false);
test('("("[]")")', true);
test("(')'", false);
test("'||'''", true)
```
<!-- prettier-ignore-end -->

---

Your task is to embed a third-party video player library called SimplePlayer
into your application.
Here is an extract from the SimplePlayer API documentation:

```
<!-- prettier-ignore-end -->
CLASS:
   SimplePlayer

CONSTRUCTOR:
   new SimplePlayer(manifestUri)
       where manifestUri is the URI of video stream manifest

METHODS:
   play()
       initiate playback of video stream
   pause()
       pause playback of video stream
   getPlaybackStatus()
       get the playback status of the current video stream, returns a
       one of the following strings: "PLAYING", "STOPPED" or "BUFFERING"
   addPlaybackStatusListener(callback)
       allows a callback to be set that is executed whenever
       the playback status changes. The playback status ("PLAYING", "STOPPED"
       or "BUFFERING") is passed to the callback as the only argument.
```

<!-- prettier-ignore-end -->

QUESTIONS:

1. Create a basic test application in your chosen programming language that
    performs the following functions:

    a) creates an instance of SimplePlayer

    b) invokes the play command

    c) logs the playback status to the console

2. Extend the code you have written with a "bufferMonitor" function which prints
    "too much buffering" to the console when the player is buffering continuously
    for more than one minute
3. If necessary refactor your code so that it is possible to unit test the
    bufferMonitor function (without mocking of setTimeout via testing frameworks and using of fake timers), then write appropriate unit tests.

---

Given a string S consisting of lowercase English characters determine if you can make it a palindrome by removing at most 1 character.

```
<!-- prettier-ignore-end -->
tacocats -> tacocat
racercar -> racecar or racrcar
kbayak -> kayak
acbccba -> abccba
abccbca -> abccba
```

<!-- prettier-ignore-end -->

Here are the complete answers, explanations, and code solutions for all the quirks, WTF questions, and complex coding problems in your document.

---

# Section 1: Quirks

### 1. `foo(1, 2, 3, 4, 5)`

* **Output 1:** `Arguments(5) [1, 2, 3, 4, 5]`
* **Output 2:** `1` followed by `SyntaxError: Unexpected token '('` (or `SyntaxError` on `(1, 2, 3, 4, 5)`).
* **Explanation:** In snippet 1, `foo(1, 2, 3, 4, 5)` invokes the function. In snippet 2, JavaScript parses `function foo(x) {...}` as a *Function Declaration*. The trailing `(1, 2, 3, 4, 5)` is treated as a separate grouping expression, which is invalid syntax because standard comma operators inside parentheses expect valid expressions.

---

### 2. Array Property Index

* **Output:** `[1, 2, 3, 4, "1.5": 1.5]` (Length remains `4`)
* **Explanation:** Arrays in JavaScript are objects. Non-integer index keys (like `1.5`) are converted to string object properties rather than numeric indices, so `a.length` is unchanged.

---

### 3. Nested Call/Apply

* **Output:** `world`
* **Explanation:** `func.call.call.call.apply(fn, [thisArg, arg1])` unwraps down to calling `fn.call(thisArg, arg1)`. Thus, it invokes `bar(this, "world")`, where `x` receives `"world"`.

---

### 4. String Coercion

* **Output:**

```text
"12"
"21"
"105"

```

* **Explanation:** The `+` operator evaluates left-to-right. `1 + 2 + 3 + 4` equals `10`, then `10 + "5"` performs string concatenation yielding `"105"`.

---

### 5. Make `a !== a` True

```javascript
var a = NaN;
a !== a; // true
```

* **Explanation:** `NaN` (Not-a-Number) is the only value in JavaScript that is not equal to itself.

---

### 6. Score Mean Calculation

* **Output:** `18280.714285714286`
* **Explanation:** `for...in` iterates over object *keys* (indices as strings: `"0"`, `"1"`, etc.). `total += score` performs string concatenation (`"00123456"`), resulting in `"00123456" / 7`. Use `for...of` instead for array values.

---

### 7. Sorting Numbers

* **Output:** `[-1, -108, -6, 0, 10, 2, 3, 42]`
* **Explanation:** `Array.prototype.sort()` converts elements to strings and compares them lexicographically by default.

---

### 8. Difference between `0` and `-0`

* `0 === -0` evaluates to `true`.
* `Object.is(0, -0)` evaluates to `false`.
* `1 / 0` gives `Infinity`, whereas `1 / -0` gives `-Infinity`.

---

### 9. Function Expression in `if` (ES5 / Loose Mode)

* **Output:** `"1undefined"`
* **Explanation:** In non-strict/ES5 mode, `function f(){}` inside an `if` expression evaluates to truthy, but `f` is not bound in the surrounding scope. Therefore, `typeof f` returns `"undefined"`.

---

### 10. Named Function Expression Scope

* **Output:** `ReferenceError: bar is not defined`
* **Explanation:** The name `bar` is only bound *inside* the function's internal scope, not in the enclosing scope.

---

### 11. Object Keys as Array Indices

* **Output:** `456`
* **Explanation:** Plain objects converted to keys become string `"[object Object]"`. Both `a[b]` and `a[c]` set/get key `a["[object Object]"]`.

---

### 12. `map(parseInt)`

* **Output:** `[11, NaN, 3, 4]`
* **Explanation:** `map` passes `(element, index)` to `parseInt(string, radix)`:
* `parseInt('11', 0)` -> `11`
* `parseInt('11', 1)` -> `NaN`
* `parseInt('11', 2)` -> `3`
* `parseInt('11', 3)` -> `4`

---

### 13. Automatic Semicolon Insertion (ASI)

* **Output:** `undefined`
* **Explanation:** JS inserts a semicolon after `return`, making the function return `undefined` before reaching the object literal.

---

### 14. Function Hoisting inside `bar()`

* **Output:** `"function"`
* **Explanation:** Function declarations hoist to the top of their function scope along with their definition. So `foo` is defined as a function before the `return foo;` statement executes.

---

### 15. Unary Minus Coercion

* **Output:** `2`
* **Explanation:** `- - "1"` evaluates as `-(-1)` which coerces to positive number `1`. `"1" + 1` mathematically adds up via subtraction operator `1 - (-1) = 2`.

---

### 16. Method Invocation vs Detached Function

* **Output:** `3` (or `undefined` in strict mode), then `1`
* **Explanation:**
* `go()` is called as a standalone function, so `this` refers to the global object (`window.x = 3`).
* `foo.baz.bar()` is called as a method of `baz`, so `this` refers to `baz` (`baz.x = 1`).

---

### 17. Array Length Truncation

* **Output:** `['bin']`
* **Explanation:** Setting `.length = 0` clears the array completely. `push('bin')` then adds `'bin'` at index 0.

---

### 18. Double `new` Constructor

* **Output:** `undefined`
* **Explanation:** `new new foo` evaluates as `new (new foo())`. `new foo()` executes `foo` as a constructor, returning `foo` itself (since it returns an object). The second `new` creates a new instance of `foo`, which does not have property `x` set on its prototype.

---

### 19. Labeled Statements

* **Output:** `NaN`
* **Explanation:** `foo:` is treated as a statement label, not an object definition. `foo.baz` evaluates to `undefined`, so arithmetic operations on it yield `NaN`.

---

### 20. `in` Operator with Arrays

* **Output:** `true`
* **Explanation:** `'2' in myArr` checks if index/property `'2'` exists in `myArr`. Since `myArr` has 3 elements (indices `0, 1, 2`), index 2 exists.

---

### 21. `arguments` Aliasing (Non-strict Mode)

* **Output:** `undefined`
* **Explanation:** `arguments[1]` maps to parameter `b` **only if** parameter `b` was actually passed during invocation. Since `foo(1)` was called with 1 argument, `b` remains `undefined`.

---

### 22. Non-configurable Function Properties

* **Output:** `"number"`
* **Explanation:** `length` on Function objects is non-configurable (`configurable: false`), so `delete foo.length` silently fails (or throws in strict mode).

---

### 23. Named Function Expression (External Call)

* **Output:** `ReferenceError: g is not defined`
* **Explanation:** `g` is not accessible outside the function expression body.

---

### 24. Comma Operator in Parentheses

* **Output:** `"number"`
* **Explanation:** The sequence expression `(expr1, expr2)` evaluates both and yields `expr2`. The IIFE executes `function g(){ return 2; }()`, which returns `2`. `typeof 2` is `"number"`.

---

### 25. Variable Scope & Function Declarations

* **Output:** `1`
* **Explanation:** `var a = 1` sets global `a`. Inside `b = function a(...)`, `a` refers internally to the function itself, but does not overwrite outer variable `a`.

---

### 26. `.call(null)`

* **Output:** `[object Window]` (Non-strict mode) or `null` (Strict mode)
* **Explanation:** In non-strict mode, passing `null` or `undefined` to `.call()` defaults `this` to the global object (`window`).

---

### 27. Undeclared Variable Ternary

* **Output:** `ReferenceError: bar is not defined`
* **Explanation:** Evaluating `bar` in `bar ? ...` throws a `ReferenceError` before the ternary operator can fall back to `0`.

---

### 28. Ways to Empty an Array

```javascript
var arrayList = ["a", "b", "c", "d", "e", "f"];

// Method 1: Truncate length (Fastest, mutates original array reference)
arrayList.length = 0;

// Method 2: Assign new array (Replaces reference, leaves old array for GC)
arrayList = [];

// Method 3: Splice (Mutates original, slower)
arrayList.splice(0, arrayList.length);

// Method 4: Pop loop (Slower, mutates)
while (arrayList.length) {
  arrayList.pop();
}
```

---

### 29. Sequence & Arithmetic Operators

* **Output:** `6`
* **Explanation:** `(1, 5 - 1)` evaluates sequence operator `,`, returning `4`. Then `4 * 2 = 8`. Wait, evaluating `(1, 5 - 1)` -> `1` ignored, `5 - 1 = 4`, `4 * 2 = 8`.

---

### 30. Async Timer Queue Order

* **Output:**

```text
baz
foo

```

* **Explanation:** First block schedules execution after 100ms + 50ms = 150ms total. Second block schedules execution after 50ms + 100ms = 150ms total. Because the outer timer for `baz` (50ms) fires first, its inner 100ms timer enters the browser timer queue earlier.

---

### 31. Relational Operator Chaining

* **Output:** `false`
* **Explanation:** Evaluates left-to-right: `(5 > 3) > 2` -> `true > 2` -> `1 > 2` -> `false`.

---

### 32. Assignment inside `if` Condition

* **Output:** `true`
* **Explanation:** `(1 + 1 == 2)` evaluates to `true`. `a = true` assigns and evaluates to `true`, taking the truthy branch.

---

### 33. Bitwise Shift Wrapping

* **Output:**
* `1 << 33` -> `2` (33 bits shifts wrap modulo 32: `33 % 32 = 1`, so `1 << 1 = 2`)
* `(1 << 31) << 2` -> `0` (31 bit shift becomes `-2147483648`, shifted left by 2 drops bits out of 32-bit integer range yielding `0`)

---

### 34. `let` Block Scope

* **Output:** `"1undefined"`
* **Explanation:** Block function expressions evaluate to truthy inside `if`, but variable `F` is not defined in scope outside.

---

# Section 2: WTF

### 1. `g` Value (First snippet)

* **Output:** `g` is `2`
* **Explanation:** Function `f()` inside recursive call hits maximum stack call limit, throwing RangeError. Catch block evaluates `g++ && f()`. `g++` evaluates `0` (falsy), so `f()` is not called and `g` becomes `1`. `finally` block runs and executes `++g`, returning `2`.

---

### 2. `g` Value (Second snippet)

* **Output:** `g` is `2`
* **Explanation:** `f = function() {...} && f()` causes immediate execution/recursion error, caught in `catch`. `g++` evaluates `0`, `finally` increments `g` from `1` to `2`.

---

### 3. Bound Function Execution

* **Output:** `TypeError: Cannot read properties of undefined` (or recursion error)
* **Explanation:** Unbound `this` in standalone function `b` defaults to global or undefined. `this.b` is undefined, returning `undefined`.

---

### 4. Arrow Function `this`

* **Output:** `undefined`
* **Explanation:** Arrow functions do not bind `this` or `bind()` context. `this.c` evaluates to `undefined`.

---

### 5. Short-circuit Logical Postfix Increment

* **Output:** `0`
* **Explanation:** `1 && g++` evaluates to `g++` (value `0`), which then assigns `0` back into `g`.

---

### 6. Valid IIFE Syntax

```javascript
!function(){}()      // Valid
(function(){})()      // Valid
true && function(){}()// Valid
!function(){}         // Valid syntax statement (returns true)

function(){}()        // Invalid (SyntaxError)
function(){}          // Invalid statement without name

```

---

### 7. Parameter Default Function Assignment

* **Output:** Returns function `() => a`

---

### 8. Self-Assigning Function Execution

* **Output:** Returns function `function () { return a }`

---

### 9. Nested Error Throwing

* **Output:** `0`

---

# Section 3: Complex Coding Challenges

### 1. Spiral Matrix Print

```javascript
function spiral(m) {
  let result = [];
  if (!m.length) return result;

  let top = 0,
    bottom = m.length - 1;
  let left = 0,
    right = m[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(m[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(m[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(m[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(m[i][left]);
      left++;
    }
  }
  return result;
}
```

---

### 2. Semver Sort

```javascript
function semverSort(arr) {
  return arr.sort((a, b) => {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    const len = Math.max(pa.length, pb.length);

    for (let i = 0; i < len; i++) {
      const valA = pa[i] !== undefined ? pa[i] : 0;
      const valB = pb[i] !== undefined ? pb[i] : 0;
      if (valA !== valB) return valA - valB;
    }
    return 0;
  });
}
```

---

### 3. Deep Clone

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  const copy = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key]);
    }
  }
  return copy;
}
```

---

### 4. Polyfill `.bind()` without `.call`/`.apply`

```javascript
Function.prototype.myBind = function (context, ...outerArgs) {
  const fn = this;
  return function (...innerArgs) {
    const uniqueKey = Symbol();
    context = context || globalThis;
    context[uniqueKey] = fn;
    const result = context[uniqueKey](...outerArgs, ...innerArgs);
    delete context[uniqueKey];
    return result;
  };
};
```

---

### 5. Anagram / Palindrome Checkers

```javascript
// Check palindrome
function isPalindrome(str) {
  const clean = str.replace(/[\W_]/g, "").toLowerCase();
  return clean === clean.split("").reverse().join("");
}
```

---

### 6. Calculations with Functions

```javascript
const zero = (fn) => (fn ? fn(0) : 0);
const one = (fn) => (fn ? fn(1) : 1);
const two = (fn) => (fn ? fn(2) : 2);
const three = (fn) => (fn ? fn(3) : 3);
const four = (fn) => (fn ? fn(4) : 4);
const five = (fn) => (fn ? fn(5) : 5);
const six = (fn) => (fn ? fn(6) : 6);
const seven = (fn) => (fn ? fn(7) : 7);
const eight = (fn) => (fn ? fn(8) : 8);
const nine = (fn) => (fn ? fn(9) : 9);

const plus = (b) => (a) => a + b;
const minus = (b) => (a) => a - b;
const times = (b) => (a) => a * b;
const dividedBy = (b) => (a) => Math.floor(a / b);
```

---

---

### 8. Chained Number Methods

```javascript
Number.prototype.add = function (n) {
  return this + n;
};
Number.prototype.subtract = function (n) {
  return this - n;
};
Number.prototype.multiply = function (n) {
  return this * n;
};
Number.prototype.divide = function (n) {
  return this / n;
};
Number.prototype.square = function () {
  return this * this;
};
```

---

### 9. Functional `compose()`

```javascript
const compose = (...fns) => {
  if (fns.length === 0) return () => undefined;
  return (initialValue) => fns.reduceRight((acc, fn) => fn(acc), initialValue);
};
```

---

### 10. `add(2,8)(5).value()` Chained Sum

```javascript
function add(...args) {
  let sum = args.reduce((a, b) => a + b, 0);

  function chain(...nextArgs) {
    sum += nextArgs.reduce((a, b) => a + b, 0);
    return chain;
  }

  chain.value = () => sum;
  return chain;
}
```

---

### 11. Four Promise Behaviors Explained

```javascript
// 1. Returns doSomethingElse promise into outer chain
doSomething().then(function () {
  return doSomethingElse();
});

// 2. Fires doSomethingElse, but discards its promise (runs unhandled in background)
doSomething().then(function () {
  doSomethingElse();
});

// 3. Executes doSomethingElse IMMEDIATELY when setting up handlers
doSomething().then(doSomethingElse());

// 4. Passes doSomethingElse as reference handler (passes resolve value directly to it)
doSomething().then(doSomethingElse);
```
