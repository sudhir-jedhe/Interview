# Problem: A destructuring-based `swap` and extracting/renaming nested API fields

Implement a destructuring-based `swap(a, b)` and a destructuring-based function that extracts and renames 3 specific nested fields from a deeply nested API response.

## Requirements

1. `swap(a, b)` — returns `[b, a]` using array destructuring, not a manual temp variable (note: since JS is pass-by-value for primitives, a true "swap the caller's variables" isn't possible through a function call the way it is with in-place array-index swapping — this returns the swapped pair for the caller to reassign).
2. `extractUserSummary(apiResponse)` — given a deeply nested API response shape, pull out and rename exactly 3 fields using nested destructuring in one statement.

## Solution

```js
function swap(a, b) {
  return [b, a];
}

let x = 1, y = 2;
[x, y] = swap(x, y);
console.log(x, y); // 2 1


const apiResponse = {
  meta: { requestId: 'abc123' },
  data: {
    account: {
      profile: {
        fullName: 'Ada Lovelace',
        contact: { emailAddress: 'ada@example.com' },
      },
      billing: { plan: 'pro' },
    },
  },
};

function extractUserSummary(response) {
  const {
    data: {
      account: {
        profile: {
          fullName: name,
          contact: { emailAddress: email },
        },
        billing: { plan },
      },
    },
  } = response;

  return { name, email, plan };
}

console.log(extractUserSummary(apiResponse));
// { name: 'Ada Lovelace', email: 'ada@example.com', plan: 'pro' }
```

## Why it works

`swap` leans on the fact that the right-hand side of an assignment (`[b, a]`) is fully evaluated into a temporary array *before* any destructuring assignment happens — so returning `[b, a]` and destructuring it back into `[x, y]` at the call site is a clean, readable two-line swap with no separate temp variable ever declared by the caller. This mirrors the classic in-place swap idiom `[x, y] = [y, x]`, just factored through a function boundary.

`extractUserSummary` chains three levels of object destructuring in a single `const` statement: each `key: newName` pair both narrows into a nested object *and* renames the extracted binding in the same step (`fullName: name` reads `response.data.account.profile.fullName` and binds it locally as `name`). Because none of the intermediate objects (`data`, `account`, `profile`, `contact`, `billing`) are ever `null`/`undefined` in a well-formed response, this direct nested-pattern approach works — if any intermediate value *could* legitimately be missing, this pattern would throw, and you'd want optional chaining plus manual fallbacks instead (destructuring patterns can't use `?.` mid-pattern).

## Edge cases worth testing

```js
console.log(swap('a', 'b'));           // [ 'b', 'a' ]
console.log(swap(swap(1, 2)[0], 3));   // swap(2, 3) -> [3, 2] — swap composes fine

// extractUserSummary throws if a required intermediate object is missing:
try {
  extractUserSummary({ data: { account: {} } });
} catch (e) {
  console.log(e instanceof TypeError); // true — profile/billing don't exist on {}
}
```
