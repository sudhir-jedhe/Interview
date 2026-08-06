Let's analyze the two JavaScript quiz examples in detail:

### First Example:

```javascript
var a = 1;
(function () {
  console.log(a + this.a); // Line 1
  var a = "2";
  console.log(a + this.a); // Line 2
})();
```

#### Step-by-Step Breakdown:

1. **Global Context**:
   - The global variable `a` is assigned the value `1`.

2. **IIFE (Immediately Invoked Function Expression)**:
   - The function is invoked immediately, and we have two `console.log` statements inside the function.
   - Inside the function, we have a local variable `a` declared with `var` and assigned the value `"2"`. However, due to **variable hoisting**, this variable declaration (but not the assignment) is moved to the top of the function scope. This will cause the local `a` to shadow the global `a`.

3. **Hoisting of `var a`**:
   - When JavaScript encounters the line `var a = "2";` inside the function, the declaration `var a` is hoisted to the top of the function scope, but the assignment of `"2"` happens only later in the code.
   - This means that at the time of `console.log(a + this.a)`, the local variable `a` is **undefined** (due to hoisting), and `this.a` refers to the global `a` which is `1`.

#### Output of the first `console.log` (`console.log(a + this.a)`):

- At this point in the function, the local `a` is hoisted but still `undefined`, and `this.a` refers to the global `a`, which is `1`.
- The expression is evaluated as `undefined + 1`, which results in `NaN` (Not-a-Number).

```javascript
console.log(a + this.a); // NaN
```

4. **Second `console.log` (`console.log(a + this.a)`)**:
   - By the time the second `console.log` is executed, the local variable `a` has been assigned the value `"2"`, so `a` is now `"2"`, but `this.a` still refers to the global `a`, which is `1`.
   - The expression becomes `"2" + 1`, which results in the string `"21"` due to string concatenation.

```javascript
console.log(a + this.a); // "21"
```

### Output of the first IIFE:

```
NaN
21
```

---

### Second Example:

```javascript
var name = 1;
(function () {
  console.log(name + this.name); // Line 1
  var name = "2";
  console.log(name + this.name); // Line 2
})();
```

#### Step-by-Step Breakdown:

1. **Global Context**:
   - The global variable `name` is assigned the value `1`.

2. **IIFE (Immediately Invoked Function Expression)**:
   - Inside the function, we again have two `console.log` statements.
   - Inside the function, we declare a local variable `name` with `var`, which is hoisted. The value is assigned later in the code.

3. **Hoisting of `var name`**:
   - As with the first example, the declaration `var name` is hoisted to the top of the function scope, but the assignment of `"2"` happens later.
   - At the time of `console.log(name + this.name)`, the local variable `name` is still **undefined** due to hoisting, and `this.name` refers to the global `name`, which is `1`.

#### Output of the first `console.log` (`console.log(name + this.name)`):

- At this point, the local `name` is hoisted but still `undefined`, and `this.name` refers to the global `name`, which is `1`.
- The expression becomes `undefined + 1`, which results in `NaN`.

```javascript
console.log(name + this.name); // NaN
```

4. **Second `console.log` (`console.log(name + this.name)`)**:
   - By the time the second `console.log` is executed, the local `name` has been assigned the value `"2"`, so `name` is now `"2"`, and `this.name` still refers to the global `name`, which is `1`.
   - The expression becomes `"2" + 1`, which results in the string `"21"` due to string concatenation.

```javascript
console.log(name + this.name); // "21"
```

### Output of the second IIFE:

```
NaN
21
```

---

### Final Output:

```javascript
NaN;
21;
NaN;
21;
```

### Summary:

- **Hoisting** of `var` declarations means that variables are declared at the top of their scope but are initialized later, leading to `undefined` values before initialization.
- **`this` behavior**:
  - Inside a function, `this` usually refers to the global object (in non-strict mode), so `this.name` and `this.a` refer to the global variables `name` and `a` respectively.
- **Expression Evaluation**:
  - In both cases, when a variable is accessed before it's initialized (due to hoisting), it results in `undefined`, leading to the expression evaluating to `NaN` when combined with a number.
  - Later, when the variable is initialized with a value, string concatenation occurs.
