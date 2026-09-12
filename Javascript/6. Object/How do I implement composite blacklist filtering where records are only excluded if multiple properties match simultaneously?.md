To exclude a record only when **multiple properties match simultaneously** (a logical **AND** condition per blacklist rule), each blacklist rule must define a composite set of criteria. A record is dropped if it satisfies **all** criteria of at least **one** composite rule.

---

### 1. The Implementation

This implementation accepts a list of compound blacklist objects. It supports primitives, arrays of acceptable matching values (using `Set` for $O(1)$ lookups), and deep nested dot-paths.

```javascript
/**
 * Resolves dot-notated property paths (e.g., "meta.risk.level").
 */
function getPathValue(obj, pathSegments) {
  let curr = obj;
  for (let i = 0; i < pathSegments.length; i++) {
    if (curr == null) return undefined;
    curr = curr[pathSegments[i]];
  }
  return curr;
}

/**
 * Pre-compiles composite blacklist rules for high-performance filtering.
 * 
 * @param {Array<Object>} compositeRules - Array of rule objects.
 * Every key-value pair within a rule must match for the rule to trigger (AND).
 * If ANY rule triggers, the record is rejected (OR).
 */
function createCompositeBlacklistFilter(compositeRules) {
  // Pre-compile rules into optimized matchers
  const compiledRules = compositeRules.map((rule) => {
    const conditions = Object.entries(rule).map(([path, target]) => {
      const pathSegments = path.split('.');

      let matcher;
      if (typeof target === 'function') {
        matcher = target;
      } else if (target instanceof Set) {
        matcher = (val) => target.has(val);
      } else if (Array.isArray(target)) {
        const set = new Set(target);
        matcher = (val) => set.has(val);
      } else {
        matcher = (val) => val === target;
      }

      return { pathSegments, matcher };
    });

    // A composite rule matches ONLY if EVERY condition inside it matches (AND)
    return function matchesRule(record) {
      return conditions.every(({ pathSegments, matcher }) => {
        const value = getPathValue(record, pathSegments);
        return value !== undefined && matcher(value);
      });
    };
  });

  // Filter callback: keep records that do NOT match ANY composite rule
  return function isAllowed(record) {
    for (let i = 0; i < compiledRules.length; i++) {
      if (compiledRules[i](record)) {
        return false; // Matched a composite blacklist rule -> EXCLUDE
      }
    }
    return true; // Passed all composite rules -> KEEP
  };
}

/**
 * Main helper function to filter records.
 */
function filterByCompositeBlacklist(records, compositeRules) {
  const isAllowed = createCompositeBlacklistFilter(compositeRules);
  return records.filter(isAllowed);
}

```

---

### 2. Example Usage

Consider an access-control system where users are only blacklisted under specific simultaneous combinations:

* **Rule 1:** `role: 'contractor'` **AND** `status: 'pending'` (active contractors or pending full-time employees are fine).
* **Rule 2:** `country: 'US'` **AND** `riskLevel: 'high'` **AND** `verified: false`.

```javascript
const users = [
  // Excluded by Rule 1: contractor + pending
  { id: 1, name: 'Alice', role: 'contractor', status: 'pending', country: 'US', meta: { risk: 'low', verified: true } },

  // Kept: contractor, but status is active
  { id: 2, name: 'Bob', role: 'contractor', status: 'active', country: 'US', meta: { risk: 'low', verified: true } },

  // Kept: pending, but role is employee
  { id: 3, name: 'Charlie', role: 'employee', status: 'pending', country: 'CA', meta: { risk: 'low', verified: true } },

  // Excluded by Rule 2: US + high risk + not verified
  { id: 4, name: 'Dave', role: 'employee', status: 'active', country: 'US', meta: { risk: 'high', verified: false } },

  // Kept: US + high risk, but verified is true
  { id: 5, name: 'Eve', role: 'employee', status: 'active', country: 'US', meta: { risk: 'high', verified: true } },
];

const compositeBlacklist = [
  // Composite Rule 1 (Simultaneous AND)
  {
    role: 'contractor',
    status: 'pending',
  },

  // Composite Rule 2 (Simultaneous AND with nested paths & multiple matches)
  {
    country: ['US', 'CA'],
    'meta.risk': 'high',
    'meta.verified': false,
  },
];

const cleanUsers = filterByCompositeBlacklist(users, compositeBlacklist);

console.log(cleanUsers.map((u) => u.name));
// Output: [ 'Bob', 'Charlie', 'Eve' ]

```

---

### 3. How the Logic Evaluates

The boolean logic applied to each record evaluates according to **De Morgan's Laws**:

$$\text{Keep} = \neg (\text{Rule}_1 \lor \text{Rule}_2 \lor \dots \lor \text{Rule}_N)$$

$$\text{Where each rule is: } \text{Rule}_i = (\text{Condition}_{i1} \land \text{Condition}_{i2} \land \dots \land \text{Condition}_{ik})$$

* **Short-circuiting optimization:**
* Inside each rule, `Array.prototype.every()` stops evaluating as soon as one condition fails ($false$), immediately skipping the rest of that rule.
* Across rules, the outer `for` loop halts as soon as any complete rule matches ($true$), instantly discarding the blacklisted record without checking subsequent rules.
