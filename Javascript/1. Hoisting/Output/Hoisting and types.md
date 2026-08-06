### Outputs and Explanations

---

### 1. **Output**
```javascript
var a = 1;
function b() {
  a = 10;
  return;
  function a() {}
}
b();
console.log(a);
```
**Output**: `1`

**Explanation**: Inside the function `b`, the declaration `function a()` hoists a local `a` to the top of the scope, shadowing the global `a`. Assigning `a = 10` affects this local `a`, leaving the global `a` unchanged.

---

### 2. **Output**
```javascript
var a = {};
var b = { key: 'b' };
var c = { key: 'c' };

a[b] = 123;
a[c] = 456;
console.log(a[b]);
```
**Output**: `456`

**Explanation**: Objects `b` and `c` are converted to strings (`"[object Object]"`) as keys. The second assignment overwrites the first.

---

### 3. **Output**
```javascript
console.log("1" + 2);
console.log(2 + "1");
console.log(1 + 2 + 3 + 4 + "5");
```
**Output**:
```
"12"
"21"
"105"
```

---

### 4. **Purpose**
```javascript
function greetAll() {
  var args = Array.prototype.slice.call(arguments, 0);
}
```
**Purpose**: Converts the `arguments` object into a true array for easier manipulation.

---

### 5. **Output**
```javascript
function test() {
  console.log(a);
  console.log(foo());

  var a = 1;

  function foo() {
    return 2;
  }
}
test();
```
**Output**:
```
undefined
2
```

---

### 6. **Output**
```javascript
(function() {
  alert(inner);
  inner();
  function inner() {
    alert('inner');
  }
})();
```
**Output**: 
1. Alerts the function definition (depending on the environment).
2. Alerts `'inner'`.

---

### 7. **Output**
```javascript
(function {
  alert(inner);
  inner();
  var inner = function() {
    alert('inner');
  }
})();
```
**Output**: **SyntaxError**

---

### 8. **Output**
```javascript
(function() {
  f();
  f = function() {
    console.log(1);
  }
})();
function f() {
  console.log(2);
}
f();
```
**Output**:
```
2
TypeError: f is not a function
```

---

### 9. **Output**
```javascript
(function() {
  var x = 1;

  function x() {};

  console.log(x);
})();
```
**Output**: `1`

---

### 10. **Output**
```javascript
var f = function g(){ return 23; };
typeof g();
```
**Output**: `ReferenceError`

---

### 11. **Output**
```javascript
var y = 1, x = y = typeof x;
x;
```
**Output**: `"undefined"`

---

### 12. **Output**
```javascript
var x = [typeof x, typeof y][1];
typeof typeof x;
```
**Output**: `"string"`

---

### 13. **Output**
```javascript
(function(foo) {
  return typeof foo.bar;
})({ foo: { bar: 1 } });
```
**Output**: `"undefined"`

---

### 14. **Output**
```javascript
(function() {
    logMe();
    var logMe = function() {
        console.log('Jesus, George, it was a wonder I was even born.');
    };
    logMe();

    function logMe() {
        console.log('Great Scott!');
    }
    logMe();
})();
```
**Output**:
```
Great Scott!
Jesus, George, it was a wonder I was even born.
Great Scott!
```

---

### 15. **Output**
```javascript
new String('Hello') === 'Hello';
```
**Output**: `false`

---

### 16. **Output**
```javascript
"This is a string" instanceof String;
```
**Output**: `false`

---

### 17. **Output**
```javascript
(function f(){
  function f(){ return 1; }
  return f();
  function f(){ return 2; }
})();
```
**Output**: `2`

---

### 18. **Output**
```javascript
var text = 'outside';
function logIt(){
    console.log(text);
    var text = 'inside';
};
logIt();
```
**Output**: `undefined`

---

### 19. **Output**
```javascript
(function() {
   var a = b = 5;
})();
console.log(b);
```
**Output**: `5`

---

### 20. **Output**
```javascript
(a == 1 && a == 2 && a == 3); // true
```
**Trick**:
Define `a` with a custom `valueOf` method:
```javascript
var a = {
  value: 0,
  valueOf() {
    return ++this.value;
  }
};
```

---

### 21. **Output**
```javascript
foo();

var foo = function() {
  console.log(false);
}

foo();

function foo() {
  console.log(true);
}

foo();
```
**Output**:
```
true
false
false
```