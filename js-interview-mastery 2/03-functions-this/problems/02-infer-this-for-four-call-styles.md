# Problem: Correctly Infer `this` for Four Different Call Styles

## Problem Statement

Write one function, `whoIsThis`, and call it four different ways — as a plain function call, as an object method, via `call`/`apply`/`bind`, and via `new` — logging and explaining what `this` resolves to in each case, tying each result back to the specific binding rule responsible.

## Requirements

- Cover all four binding rules in one runnable example: default, implicit, explicit, and `new`.
- For each call style, explicitly state *which rule applies* and *why the others don't*.
- Run in strict mode explicitly, since default binding differs between strict and non-strict mode (this makes the "default" case deterministic rather than environment-dependent).

## Approach

Define a single function once, then invoke it four separate ways, using `'use strict'` at the top so default binding is reliably `undefined` rather than depending on whether the code happens to run as a script or a module. Explain the precedence reasoning inline as comments, since interviewers specifically want the *reasoning*, not just the output.

## Solution

```js
'use strict';

function whoIsThis(label) {
  console.log(`[${label}]`, this);
  return this;
}

// 1. Default binding — plain, unqualified call. No object precedes it, no
// call/apply/bind, no `new`. In strict mode, `this` is `undefined`.
whoIsThis('default'); // this === undefined

// 2. Implicit binding — called as a method (obj.method()). `this` is set to
// whatever object appears directly before the dot at the CALL site — not
// wherever the function happens to be defined.
const obj = { name: 'obj-instance', whoIsThis };
obj.whoIsThis('implicit'); // this === obj

// 3. Explicit binding — call/apply/bind override the default/implicit rules.
// Even though we invoke it as `explicitThis.call(...)` with no object owning
// the function, `call` forces `this` to the object we pass in.
const explicitTarget = { name: 'explicit-target' };
whoIsThis.call(explicitTarget, 'explicit-call');   // this === explicitTarget
whoIsThis.apply(explicitTarget, ['explicit-apply']); // this === explicitTarget
const boundWhoIsThis = whoIsThis.bind(explicitTarget);
boundWhoIsThis('explicit-bind');                    // this === explicitTarget, permanently

// 4. `new` binding — highest precedence of all. `new` creates a brand-new
// object and forces `this` to be that object inside the function body,
// regardless of how the function was defined or whether it was bound.
function Widget(label) {
  console.log('[new]', this);
  this.label = label;
}
const w = new Widget('new-instance'); // this === the newly created Widget instance
console.log(w.label); // 'new-instance'

// Precedence recap, highest to lowest: new > explicit (call/apply/bind) > implicit (obj.method()) > default (plain call).
// Rule 3 also demonstrates that even a *bound* function can't have its `this`
// overridden by a later call/apply — but it CAN still be overridden by `new`
// if the bound function is used as a constructor (see ../problems/01-bind-context-polyfill.md).
```

**Why this works:** each call site demonstrates exactly one rule in isolation by construction — case 1 has nothing preceding the call and no explicit/`new` mechanism involved, case 2 has an object immediately before the dot, case 3 explicitly overrides `this` via `call`/`apply`/`bind`, and case 4 uses `new`, which unconditionally wins regardless of anything else. Running in strict mode removes the only source of environment-dependent ambiguity (what "default binding" resolves to), making the demonstration fully deterministic.
