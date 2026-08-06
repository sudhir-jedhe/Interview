```js
function getUniqueValuesInAllArrays(arrays, iteratee) {
  // Create a new set to store the unique values.
  const uniqueValues = new Set();

  // Iterate over each array.
  for (const array of arrays) {
    // Iterate over each value in the array.
    for (const value of array) {
      // Get the iterated value.
      const iteratedValue = iteratee(value);

      // Add the iterated value to the set if it is not already present.
      if (!uniqueValues.has(iteratedValue)) {
        uniqueValues.add(iteratedValue);
      }
    }
  }

  // Return the array of unique values.
  return [...uniqueValues];
}
const arrays = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Get the unique values in all arrays, using the identity function as the iteratee.
const uniqueValues = getUniqueValuesInAllArrays(arrays, (value) => value);

// Print the unique values.
console.log(uniqueValues); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Get the unique values in all arrays, using a function that returns the square of the value as the iteratee.
const uniqueSquaredValues = getUniqueValuesInAllArrays(
  arrays,
  (value) => value * value
);

// Print the unique squared values.
console.log(uniqueSquaredValues); // [1, 4, 9, 16, 25, 36, 49, 64, 81]


```

```js
function mergeUsingSpread(...inputArrays) {
  let uniqueValues = new Set();

  // Using loop to go thofugh each array
  inputArrays.forEach((arr) => {
    // Here, adding the element of current
    // array into the Set of uniqueValues
    arr.forEach((ele) => {
      uniqueValues.add(ele);
    });
  });

  // Converting the set to array
  return Array.from(uniqueValues);
}

// Multiple Input arrays
let inputArray1 = [1, 2, 3, 4, 5];
let inputArray2 = [4, 5, 6, 7, 8];
let inputArray3 = [7, 8, 9, 10, 11];
let outputArray = mergeUsingSpread(inputArray1, inputArray2, inputArray3);
console.log(outputArray);

const numbers = [1, 2, 34, 1, 6, 8, 2, 3, 9];
const unique = [...new Set(numbers)];

```

## Unique Values in JavaScript

Removing duplicates from an array is a very common interview question.

***

# 1. Using `Set` (Recommended)

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];

const unique = [...new Set(arr)];

console.log(unique);
```

### Output

```javascript
[1, 2, 3, 4, 5]
```

✅ Simplest

✅ Fastest

✅ Most commonly used

***

# 2. Using `filter()`

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];

const unique = arr.filter(
  (item, index) =>
    arr.indexOf(item) === index
);

console.log(unique);
```

### Output

```javascript
[1, 2, 3, 4, 5]
```

***

# 3. Using `reduce()`

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];

const unique = arr.reduce(
  (acc, item) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }

    return acc;
  },
  []
);

console.log(unique);
```

***

# 4. Unique Strings

```javascript
const names = [
  "React",
  "Node",
  "React",
  "TypeScript"
];

const uniqueNames = [
  ...new Set(names)
];

console.log(uniqueNames);
```

### Output

```javascript
[
  "React",
  "Node",
  "TypeScript"
]
```

***

# 5. Unique Objects by ID

### Input

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir"
  },
  {
    id: 2,
    name: "John"
  },
  {
    id: 1,
    name: "Sudhir"
  }
];
```

### Solution

```javascript
const uniqueUsers = Array.from(
  new Map(
    users.map(user => [
      user.id,
      user
    ])
  ).values()
);

console.log(uniqueUsers);
```

### Output

```javascript
[
  {
    id: 1,
    name: "Sudhir"
  },
  {
    id: 2,
    name: "John"
  }
]
```

***

# 6. Unique Objects Using `filter()`

```javascript
const uniqueUsers =
  users.filter(
    (user, index, self) =>
      index ===
      self.findIndex(
        item => item.id === user.id
      )
  );

console.log(uniqueUsers);
```

***

# React Example

Suppose an API returns duplicate skills.

```jsx
const skills = [
  "React",
  "Node",
  "React",
  "Redux"
];

const uniqueSkills =
  [...new Set(skills)];

return (
  <ul>
    {uniqueSkills.map(skill => (
      <li key={skill}>
        {skill}
      </li>
    ))}
  </ul>
);
```

***

# Custom `uniq()` Function

```javascript
function uniq(arr) {
  return [...new Set(arr)];
}

console.log(
  uniq([
    1,
    2,
    2,
    3,
    3,
    4
  ])
);
```

Output:

```javascript
[1, 2, 3, 4]
```

***

# Interview Favorite: Count Unique Values

```javascript
const arr =
  [1,2,2,3,3,3,4];

console.log(
  new Set(arr).size
);
```

Output:

```javascript
4
```

***

# Complexity Comparison

| Method            | Time  | Space |
| ----------------- | ----- | ----- |
| Set               | O(n)  | O(n)  |
| filter + indexOf  | O(n²) | O(n)  |
| reduce + includes | O(n²) | O(n)  |
| Map (objects)     | O(n)  | O(n)  |

***

## Interview One-Liner

```javascript
const unique = [...new Set(arr)];
```

> `Set` is the preferred solution for removing duplicate primitive values because it automatically stores unique values and provides an efficient O(n) solution. For arrays of objects, use a `Map` keyed by a unique property such as `id`.


# 1. Unique Objects Using Different Keys

## Unique by `id`

### Input

```javascript
const users = [
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" },
  { id: 1, name: "Sudhir Updated" }
];
```

### Solution (Map)

```javascript
const uniqueUsers = [
  ...new Map(
    users.map(user => [user.id, user])
  ).values()
];

console.log(uniqueUsers);
```

### Output

```javascript
[
  { id: 1, name: "Sudhir Updated" },
  { id: 2, name: "John" }
]
```

**Note:** The last duplicate wins.

***

## Unique by `email`

```javascript
const users = [
  {
    name: "Sudhir",
    email: "sudhir@test.com"
  },
  {
    name: "John",
    email: "john@test.com"
  },
  {
    name: "Sudhir Duplicate",
    email: "sudhir@test.com"
  }
];

const uniqueUsers = [
  ...new Map(
    users.map(user => [user.email, user])
  ).values()
];

console.log(uniqueUsers);
```

***

## Unique by Multiple Keys

Suppose uniqueness depends on:

```javascript
country + city
```

### Input

```javascript
const locations = [
  {
    country: "India",
    city: "Pune"
  },
  {
    country: "India",
    city: "Mumbai"
  },
  {
    country: "India",
    city: "Pune"
  }
];
```

### Solution

```javascript
const uniqueLocations = [
  ...new Map(
    locations.map(item => [
      `${item.country}-${item.city}`,
      item
    ])
  ).values()
];

console.log(uniqueLocations);
```

### Output

```javascript
[
  {
    country: "India",
    city: "Pune"
  },
  {
    country: "India",
    city: "Mumbai"
  }
]
```

***

# 2. Set vs Filter Performance

## Using Set

```javascript
const unique =
  [...new Set(arr)];
```

### Complexity

```text
Time:  O(n)
Space: O(n)
```

Because:

* Set lookup ≈ O(1)
* Each value processed once

***

## Using Filter + indexOf

```javascript
const unique = arr.filter(
  (item, index) =>
    arr.indexOf(item) === index
);
```

### Complexity

```text
Time: O(n²)
Space: O(n)
```

Why?

For every element:

```javascript
indexOf()
```

scans the array again.

***

## Example

```javascript
const arr =
  Array.from(
    { length: 100000 },
    (_, i) => i % 1000
  );
```

### Set

```javascript
[...new Set(arr)]
```

Fast:

```text
~ O(100000)
```

***

### Filter

```javascript
arr.filter(
  (item, index) =>
    arr.indexOf(item) === index
);
```

Potentially:

```text
~ O(100000²)
```

Much slower for large datasets.

***

## Interview Answer

| Method            | Time Complexity |
| ----------------- | --------------- |
| Set               | O(n)            |
| Map               | O(n)            |
| filter + indexOf  | O(n²)           |
| reduce + includes | O(n²)           |

✅ Prefer `Set` or `Map`.

***

# 3. React Example: Filtering Unique User Input

Suppose users enter skills and duplicates should be removed.

### Component

```jsx
import { useState } from "react";

export default function SkillsInput() {
  const [skill, setSkill] =
    useState("");

  const [skills, setSkills] =
    useState([]);

  const addSkill = () => {
    setSkills(prev => [
      ...new Set([
        ...prev,
        skill.trim()
      ])
    ]);

    setSkill("");
  };

  return (
    <div>
      <input
        value={skill}
        onChange={e =>
          setSkill(e.target.value)
        }
        placeholder="Enter skill"
      />

      <button onClick={addSkill}>
        Add
      </button>

      <ul>
        {skills.map(skill => (
          <li key={skill}>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

***

### User Actions

```text
React
Node
React
Redux
Node
```

### State

```javascript
[
  "React",
  "Node",
  "Redux"
]
```

Duplicates are automatically removed.

***

# React Example: Unique Users by ID

```jsx
const users = [
  {
    id: 1,
    name: "Sudhir"
  },
  {
    id: 2,
    name: "John"
  },
  {
    id: 1,
    name: "Sudhir Updated"
  }
];

const uniqueUsers = [
  ...new Map(
    users.map(user => [
      user.id,
      user
    ])
  ).values()
];

return (
  <ul>
    {uniqueUsers.map(user => (
      <li key={user.id}>
        {user.name}
      </li>
    ))}
  </ul>
);
```

***

# Reusable Utility

```javascript
function uniqueBy(arr, keyFn) {
  return [
    ...new Map(
      arr.map(item => [
        keyFn(item),
        item
      ])
    ).values()
  ];
}
```

### Usage

```javascript
uniqueBy(users, user => user.id);

uniqueBy(
  users,
  user => user.email
);

uniqueBy(
  locations,
  item =>
    `${item.country}-${item.city}`
);
```

### Senior Interview One-Liner

> Use `Set` for primitive values and `Map` for objects with custom keys. Both provide an efficient **O(n)** solution, whereas `filter()` with `indexOf()` is **O(n²)** and should generally be avoided for large datasets.


## 1. Unique Values with Nested Objects

Suppose uniqueness depends on a nested property.

### Input

```javascript
const users = [
  {
    id: 1,
    profile: {
      email: "sudhir@test.com"
    }
  },
  {
    id: 2,
    profile: {
      email: "john@test.com"
    }
  },
  {
    id: 3,
    profile: {
      email: "sudhir@test.com"
    }
  }
];
```

### Unique by Nested Email

```javascript
const uniqueUsers = [
  ...new Map(
    users.map(user => [
      user.profile.email,
      user
    ])
  ).values()
];

console.log(uniqueUsers);
```

### Output

```javascript
[
  {
    id: 3,
    profile: {
      email: "sudhir@test.com"
    }
  },
  {
    id: 2,
    profile: {
      email: "john@test.com"
    }
  }
]
```

***

## 2. Uniqueness with Complex Keys

Sometimes uniqueness depends on multiple fields.

### Input

```javascript
const employees = [
  {
    firstName: "Sudhir",
    lastName: "Jedhe",
    city: "Pune"
  },
  {
    firstName: "John",
    lastName: "Smith",
    city: "London"
  },
  {
    firstName: "Sudhir",
    lastName: "Jedhe",
    city: "Pune"
  }
];
```

***

### Composite Key

```javascript
const uniqueEmployees = [
  ...new Map(
    employees.map(emp => [
      `${emp.firstName}-${emp.lastName}-${emp.city}`,
      emp
    ])
  ).values()
];

console.log(uniqueEmployees);
```

### Output

```javascript
[
  {
    firstName: "Sudhir",
    lastName: "Jedhe",
    city: "Pune"
  },
  {
    firstName: "John",
    lastName: "Smith",
    city: "London"
  }
]
```

***

## Generic `uniqueBy` Utility

```javascript
function uniqueBy(arr, keyFn) {
  return [
    ...new Map(
      arr.map(item => [
        keyFn(item),
        item
      ])
    ).values()
  ];
}
```

### Examples

```javascript
// By nested email
uniqueBy(
  users,
  user => user.profile.email
);

// By multiple fields
uniqueBy(
  employees,
  emp =>
    `${emp.firstName}-${emp.lastName}-${emp.city}`
);
```

***

## Handling Deep Objects

If you want uniqueness based on the entire object structure:

```javascript
const uniqueItems = [
  ...new Map(
    data.map(item => [
      JSON.stringify(item),
      item
    ])
  ).values()
];
```

### Example

```javascript
const data = [
  { a: 1, b: 2 },
  { a: 1, b: 2 },
  { a: 2, b: 3 }
];

console.log(uniqueItems);
```

Output:

```javascript
[
  { a: 1, b: 2 },
  { a: 2, b: 3 }
]
```

⚠️ For very large objects, `JSON.stringify()` can be expensive.

***

# React Example: Remove Duplicates from Form Input

### Add Unique Skills

```jsx
import { useState } from "react";

export default function SkillsForm() {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);

  const addSkill = () => {
    const newSkill = skill.trim();

    if (!newSkill) return;

    setSkills(prev => [
      ...new Set([
        ...prev,
        newSkill
      ])
    ]);

    setSkill("");
  };

  return (
    <div>
      <input
        value={skill}
        onChange={e =>
          setSkill(e.target.value)
        }
        placeholder="Enter skill"
      />

      <button onClick={addSkill}>
        Add Skill
      </button>

      <ul>
        {skills.map(item => (
          <li key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### User Input

```text
React
Node
React
Redux
Node
```

### Final State

```javascript
[
  "React",
  "Node",
  "Redux"
]
```

***

## React Example: Remove Duplicate Users by Email

```jsx
const users = [
  {
    name: "Sudhir",
    email: "sudhir@test.com"
  },
  {
    name: "John",
    email: "john@test.com"
  },
  {
    name: "Sudhir Copy",
    email: "sudhir@test.com"
  }
];

const uniqueUsers = useMemo(
  () =>
    [
      ...new Map(
        users.map(user => [
          user.email,
          user
        ])
      ).values()
    ],
  [users]
);
```

### Render

```jsx
<ul>
  {uniqueUsers.map(user => (
    <li key={user.email}>
      {user.name}
    </li>
  ))}
</ul>
```

***

## Performance Notes

### Primitive Values

```javascript
[...new Set(arr)]
```

**Time:** `O(n)`

***

### Objects with Custom Key

```javascript
new Map(...)
```

**Time:** `O(n)`

***

### Deep Object Comparison

```javascript
JSON.stringify(object)
```

**Time:** Depends on object size and structure.

Avoid for very large datasets if possible.

***

## Interview One-Liner

> For primitive values, use `Set`. For objects, use a `Map` keyed by a unique property (such as `id` or a nested field). For compound uniqueness, create a composite key (e.g., `firstName-lastName-city`). For deep object equality, `JSON.stringify()` can be used, though it may have performance implications on large datasets.


## Unique Values with Deep Nested Keys

When objects contain nested structures, you can create uniqueness based on deeply nested properties.

***

# Example 1: Unique by Nested Email

### Input

```javascript
const users = [
  {
    id: 1,
    profile: {
      contact: {
        email: "sudhir@test.com"
      }
    }
  },
  {
    id: 2,
    profile: {
      contact: {
        email: "john@test.com"
      }
    }
  },
  {
    id: 3,
    profile: {
      contact: {
        email: "sudhir@test.com"
      }
    }
  }
];
```

### Solution

```javascript
const uniqueUsers = [
  ...new Map(
    users.map(user => [
      user.profile.contact.email,
      user
    ])
  ).values()
];

console.log(uniqueUsers);
```

### Output

```javascript
[
  {
    id: 3,
    profile: {
      contact: {
        email: "sudhir@test.com"
      }
    }
  },
  {
    id: 2,
    profile: {
      contact: {
        email: "john@test.com"
      }
    }
  }
]
```

***

# Example 2: Unique by Multiple Deep Keys

### Input

```javascript
const employees = [
  {
    profile: {
      personal: {
        firstName: "Sudhir",
        lastName: "Jedhe"
      },
      location: {
        city: "Pune"
      }
    }
  },
  {
    profile: {
      personal: {
        firstName: "John",
        lastName: "Smith"
      },
      location: {
        city: "London"
      }
    }
  },
  {
    profile: {
      personal: {
        firstName: "Sudhir",
        lastName: "Jedhe"
      },
      location: {
        city: "Pune"
      }
    }
  }
];
```

### Composite Key

```javascript
const uniqueEmployees = [
  ...new Map(
    employees.map(emp => [
      `${emp.profile.personal.firstName}-${emp.profile.personal.lastName}-${emp.profile.location.city}`,
      emp
    ])
  ).values()
];

console.log(uniqueEmployees);
```

***

# Example 3: Generic Deep Path Utility

Instead of hardcoding:

```javascript
user.profile.contact.email
```

Create a reusable helper.

### Get Deep Property

```javascript
function getValue(obj, path) {
  return path
    .split(".")
    .reduce(
      (acc, key) => acc?.[key],
      obj
    );
}
```

### Generic `uniqueByPath`

```javascript
function uniqueByPath(arr, path) {
  return [
    ...new Map(
      arr.map(item => [
        getValue(item, path),
        item
      ])
    ).values()
  ];
}
```

### Usage

```javascript
const uniqueUsers =
  uniqueByPath(
    users,
    "profile.contact.email"
  );

console.log(uniqueUsers);
```

***

# Example 4: Deep Nested Array Data

### Input

```javascript
const projects = [
  {
    team: {
      lead: {
        email: "lead1@test.com"
      }
    }
  },
  {
    team: {
      lead: {
        email: "lead2@test.com"
      }
    }
  },
  {
    team: {
      lead: {
        email: "lead1@test.com"
      }
    }
  }
];
```

### Unique by Lead Email

```javascript
const uniqueProjects =
  uniqueByPath(
    projects,
    "team.lead.email"
  );

console.log(uniqueProjects);
```

***

# Example 5: Full Object Uniqueness

If uniqueness depends on the entire nested object:

```javascript
const data = [
  {
    profile: {
      city: "Pune",
      role: "React"
    }
  },
  {
    profile: {
      city: "Pune",
      role: "React"
    }
  },
  {
    profile: {
      city: "Mumbai",
      role: "React"
    }
  }
];

const unique = [
  ...new Map(
    data.map(item => [
      JSON.stringify(item),
      item
    ])
  ).values()
];

console.log(unique);
```

### Output

```javascript
[
  {
    profile: {
      city: "Pune",
      role: "React"
    }
  },
  {
    profile: {
      city: "Mumbai",
      role: "React"
    }
  }
]
```

***

# React Example

### Remove Duplicate Users by Deep Email

```jsx
import { useMemo } from "react";

function UsersList({ users }) {
  const uniqueUsers = useMemo(() => {
    return [
      ...new Map(
        users.map(user => [
          user.profile.contact.email,
          user
        ])
      ).values()
    ];
  }, [users]);

  return (
    <ul>
      {uniqueUsers.map(user => (
        <li key={user.id}>
          {user.profile.contact.email}
        </li>
      ))}
    </ul>
  );
}
```

***

# Interview Utility Function

```javascript
function uniqueBy(arr, selector) {
  return [
    ...new Map(
      arr.map(item => [
        selector(item),
        item
      ])
    ).values()
  ];
}
```

### Usage

```javascript
uniqueBy(
  users,
  user => user.profile.contact.email
);

uniqueBy(
  employees,
  emp =>
    `${emp.profile.personal.firstName}-${emp.profile.personal.lastName}-${emp.profile.location.city}`
);
```

***

## Complexity

### Map-Based Solution

```text
Time Complexity: O(n)
Space Complexity: O(n)
```

### Filter + findIndex

```text
Time Complexity: O(n²)
Space Complexity: O(n)
```

✅ For interviews and large datasets, `Map` with a deep key selector is generally the preferred solution.


## Unique Values with Deep Nested Keys + Null Safety

When working with deeply nested objects, some properties may be missing.

### Problem

```javascript
const users = [
  {
    id: 1,
    profile: {
      contact: {
        email: "sudhir@test.com"
      }
    }
  },
  {
    id: 2,
    profile: null
  },
  {
    id: 3,
    profile: {
      contact: {
        email: "john@test.com"
      }
    }
  },
  {
    id: 4,
    profile: {
      contact: {
        email: "sudhir@test.com"
      }
    }
  }
];
```

Direct access:

```javascript
user.profile.contact.email
```

can throw:

```javascript
Cannot read properties of null
```

***

# Null-Safe Unique by Nested Email

Using optional chaining:

```javascript
const uniqueUsers = [
  ...new Map(
    users.map(user => [
      user.profile?.contact?.email ??
        `missing-${user.id}`,
      user
    ])
  ).values()
];

console.log(uniqueUsers);
```

### Output

```javascript
[
  {
    id: 4,
    profile: {
      contact: {
        email: "sudhir@test.com"
      }
    }
  },
  {
    id: 2,
    profile: null
  },
  {
    id: 3,
    profile: {
      contact: {
        email: "john@test.com"
      }
    }
  }
]
```

***

# Generic Deep Path Helper

### Safe Getter

```javascript
function getValue(obj, path) {
  return path
    .split(".")
    .reduce(
      (acc, key) => acc?.[key],
      obj
    );
}
```

### Generic Unique Function

```javascript
function uniqueByPath(arr, path) {
  const map = new Map();

  for (const item of arr) {
    const key =
      getValue(item, path) ??
      Symbol();

    map.set(key, item);
  }

  return [...map.values()];
}
```

### Usage

```javascript
const uniqueUsers =
  uniqueByPath(
    users,
    "profile.contact.email"
  );
```

***

# Optimising `uniqueBy` for Large Nested Datasets

Imagine:

```javascript
100,000+
500,000+
records
```

### ❌ Slow Approach

```javascript
arr.filter(
  (item, index) =>
    index ===
    arr.findIndex(
      x => x.id === item.id
    )
);
```

Complexity:

```text
O(n²)
```

***

### ✅ Fast Approach

```javascript
function uniqueBy(
  arr,
  selector
) {
  const seen = new Map();

  for (const item of arr) {
    seen.set(
      selector(item),
      item
    );
  }

  return [...seen.values()];
}
```

Complexity:

```text
Time:  O(n)
Space: O(n)
```

***

### Large Dataset Example

```javascript
const uniqueUsers =
  uniqueBy(
    users,
    user =>
      user.profile?.contact?.email
  );
```

Benefits:

✅ Single pass

✅ No nested loops

✅ Map lookup ≈ O(1)

✅ Suitable for large API responses

***

# React Example: Filter Unique Nested Users

```jsx
import { useMemo } from "react";

function UsersList({ users }) {
  const uniqueUsers = useMemo(() => {
    const map = new Map();

    users.forEach(user => {
      const email =
        user.profile?.contact?.email;

      if (email) {
        map.set(email, user);
      }
    });

    return [...map.values()];
  }, [users]);

  return (
    <div>
      <h2>Unique Users</h2>

      <ul>
        {uniqueUsers.map(user => (
          <li key={user.id}>
            {user.profile.contact.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

***

## Example Data

```javascript
const users = [
  {
    id: 1,
    profile: {
      contact: {
        email:
          "sudhir@test.com"
      }
    }
  },
  {
    id: 2,
    profile: {
      contact: {
        email:
          "john@test.com"
      }
    }
  },
  {
    id: 3,
    profile: {
      contact: {
        email:
          "sudhir@test.com"
      }
    }
  }
];
```

### Rendered Output

```text
sudhir@test.com
john@test.com
```

Duplicate email removed.

***

# Reusable Production Utility

```javascript
function uniqueBy(
  arr,
  selector
) {
  const map = new Map();

  for (const item of arr) {
    const key = selector(item);

    if (key != null) {
      map.set(key, item);
    }
  }

  return [...map.values()];
}
```

### Usage

```javascript
uniqueBy(
  users,
  user =>
    user.profile?.contact?.email
);

uniqueBy(
  users,
  user =>
    `${user.profile?.personal?.firstName}-${user.profile?.personal?.lastName}`
);
```

***

## Senior Interview Answer

> For deeply nested objects, use optional chaining (`?.`) to safely access properties and avoid runtime errors. Use a `Map` keyed by the nested value to achieve O(n) deduplication. For large datasets, avoid `filter()` with `findIndex()` because it results in O(n²) complexity. In React, wrap the deduplication logic inside `useMemo()` to prevent unnecessary recalculations on every render.
