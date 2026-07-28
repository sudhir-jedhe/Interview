// This is a JavaScript Quiz from BFE.dev

const obj = {
  dev: "bfe",
  a: function () {
    return this.dev; // obj.a() =>  obj.dev
  },
  b() {
    // same as above as we can declare function same way
    return this.dev; // obj.b() =>  obj.dev
  },
  c: () => {
    return this.dev; // window.c() =>  undefined  lexical parent context
  },
  d: function () {
    return (() => {
      // IFFE , not assigned name.
      return this.dev;
      //  obj.d() =>  obj.dev array fuction called inside function so hold context from which it is calling
    })();

    /** same as IFFE
     const test = () => {
        return this,dev
     }

     test()
     */
  },
  e: function () {
    return this.b(); // invoke bm return obj.b => // obj.b() =>  obj.dev
  },
  f: function () {
    return this.b;
    // not caling, returning another function,
    // obj.f() =>  returning reference to b =>  return function b
    // obj.f() => b()
    // obj.f()() => b()() calling b globally obj.b() =>  window.dev
  },
  g: function () {
    return this.c(); //  undefined invocatoion , c is arrow function window.dev
  },
  h: function () {
    return this.c;
    // reference to arrow function, Obj.h() return c,  then Obj.h()() second invocation calling c . window,dev
  },
  i: function () {
    return () => {
      // obj.i() arrow function return and obj.i()() execute arrow function  => obj.dev
      return this.dev;
    };
  },
};

console.log(obj.a()); // bfe
console.log(obj.b()); // bfe
console.log(obj.c()); // undfined
console.log(obj.d()); // bfe
console.log(obj.e()); // bfe
console.log(obj.f()()); // undefined
console.log(obj.g()); // undefined
console.log(obj.h()()); // undefined
console.log(obj.i()()); // bfe


You nailed every single output! All 9 `console.log` predictions in your code are **100% correct**.

Here's the detailed breakdown for each case from BFE.dev (#150) so you have the exact reasoning ready for interview settings:

---

### Step-by-Step Execution Breakdown

#### 1. `obj.a()` ➔ `"bfe"`

* **Mechanism:** Regular function invoked via method call (`obj.a()`).
* **Why:** `this` binds dynamically to whatever object is left of the dot at call time (`obj`).

#### 2. `obj.b()` ➔ `"bfe"`

* **Mechanism:** ES6 method shorthand.
* **Why:** Mechanically identical to `a()`. The shorthand `b() {}` is just cleaner syntax for `b: function () {}`.

#### 3. `obj.c()` ➔ `undefined`

* **Mechanism:** Top-level arrow function property.
* **Why:** Arrow functions don't have their own `this`; they inherit it lexically from their enclosing scope. An **object literal `{}` does NOT create a block scope for `this**`—only functions or modules do. Thus, `c` captures `this` from the global execution context (`window` or `{}` in Node.js), where `dev` is undefined.

#### 4. `obj.d()` ➔ `"bfe"`

* **Mechanism:** Arrow IIFE inside a regular function.
* **Why:** When `obj.d()` is invoked, the outer function `d` sets `this = obj`. The inner arrow IIFE executes inside `d`'s scope and lexically inherits `d`'s `this` binding (`obj`).

#### 5. `obj.e()` ➔ `"bfe"`

* **Mechanism:** Method delegation.
* **Why:** `obj.e()` runs with `this = obj`. Inside `e`, it calls `this.b()`, which evaluates to `obj.b()`. `b` runs with `this = obj` and returns `"bfe"`.

#### 6. `obj.f()()` ➔ `undefined`

* **Mechanism:** Implicit binding loss via returned function reference.
* **Why:** `obj.f()` returns a direct reference to function `b`. Then, `()` immediately executes `b` as a standalone function call without an object target (`b()`). In non-strict mode, standalone function calls default `this` to `window`/`global`, where `dev` is undefined.

#### 7. `obj.g()` ➔ `undefined`

* **Mechanism:** Invoking a globally bound arrow function from inside a method.
* **Why:** `obj.g()` runs with `this = obj`. Inside, it executes `this.c()`, which calls arrow function `c`. Because arrow functions have immutable lexical `this` bindings established at definition (global context), invoking `c` from inside `obj` does **not** change its `this`.

#### 8. `obj.h()()` ➔ `undefined`

* **Mechanism:** Returning and calling a globally bound arrow function reference.
* **Why:** `obj.h()` returns the arrow function `c`. Invoking it as `c()` still uses `c`'s immutable lexical scope (`window`/`global`), resulting in `undefined`.

#### 9. `obj.i()()` ➔ `"bfe"`

* **Mechanism:** Closure returning a dynamically scoped arrow function.
* **Why:** Unlike `c`, the arrow function inside `i` is created **when `obj.i()` is called**. Because `i` was called as a method on `obj`, its `this` is `obj`. The returned arrow function captures `this = obj` at creation time, so invoking it later (`()`) safely preserves `"bfe"`.

---

### Cheat Sheet: The 3 Rules of `this`

1. **Regular Functions:** `this` depends on **HOW** the function is called (`obj.method()` ➔ `obj`, `func()` ➔ `window`/`undefined`).
2. **Arrow Functions:** `this` depends on **WHERE** the function was defined. It permanently locks to the `this` of its outer function/module context.
3. **Object Literals (`{}`):** Do **NOT** create a `this` scope. Only functions, classes, and top-level modules do.