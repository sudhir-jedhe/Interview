**`aggregateSkillEndorsements`** is a common frontend coding interview problem (frequently associated with companies like LinkedIn).

The task is to take a list of raw endorsement records and group them by skill, returning a summary containing the skill name, an array of unique endorsing users, and the total endorsement count.

---

### Problem Description

#### Input

An array of endorsement objects, each with `skill` and `user` properties:

```javascript
const endorsements = [
  { skill: "css", user: "Bill" },
  { skill: "javascript", user: "Chad" },
  { skill: "javascript", user: "Bill" },
  { skill: "css", user: "Sue" },
  { skill: "javascript", user: "Sue" },
  { skill: "html", user: "Sue" },
  { skill: "css", user: "Bill" }, // Optional duplicate check
];
```

#### Output

An array of objects representing summarized skills:

```javascript
[
  { skill: "javascript", users: ["Chad", "Bill", "Sue"], count: 3 },
  { skill: "css", users: ["Bill", "Sue"], count: 2 },
  { skill: "html", users: ["Sue"], count: 1 },
];
```

---

### JavaScript Implementation ($\mathcal{O}(n)$ Time Complexity)

Using `Map` and `Set` is the most efficient and readable way to handle both group aggregation and duplicate user removal.

```javascript
/**
 * Aggregates skill endorsements by grouping unique users per skill.
 *
 * @param {Array<{skill: string, user: string}>} endorsements
 * @returns {Array<{skill: string, users: string[], count: number}>}
 */
function aggregateSkillEndorsements(endorsements) {
  if (!Array.isArray(endorsements) || endorsements.length === 0) {
    return [];
  }

  // Map key: skill name | Map value: Set of unique user names
  const skillMap = new Map();

  for (const { skill, user } of endorsements) {
    if (!skill || !user) continue; // Skip invalid entries

    if (!skillMap.has(skill)) {
      skillMap.set(skill, new Set());
    }

    // Set automatically prevents duplicate users for the same skill
    skillMap.get(skill).add(user);
  }

  // Convert map entries into the required output array format
  const result = [];
  for (const [skill, userSet] of skillMap.entries()) {
    const users = Array.from(userSet);
    result.push({
      skill,
      users,
      count: users.length,
    });
  }

  return result;
}

// Example Execution
const endorsements = [
  { skill: "css", user: "Bill" },
  { skill: "javascript", user: "Chad" },
  { skill: "javascript", user: "Bill" },
  { skill: "css", user: "Sue" },
  { skill: "javascript", user: "Sue" },
  { skill: "html", user: "Sue" },
];

console.log(aggregateSkillEndorsements(endorsements));
```

---

### Alternative One-Liner Approach (`Array.prototype.reduce`)

If an interviewer asks for a functional programming solution using standard array methods:

```javascript
function aggregateSkillEndorsements(endorsements) {
  const map = endorsements.reduce((acc, { skill, user }) => {
    if (!acc[skill]) {
      acc[skill] = new Set();
    }
    acc[skill].add(user);
    return acc;
  }, {});

  return Object.entries(map).map(([skill, userSet]) => ({
    skill,
    users: [...userSet],
    count: userSet.size,
  }));
}
```

---

### Key Technical Considerations

1. **Duplicate Endorsements:** Using a `Set` ensures that if a user endorses the same skill multiple times, they are only counted once.
2. **Time Complexity:** $\mathcal{O}(n)$, where $n$ is the number of endorsements. We loop through the endorsements array once and then through the unique skill keys once.
3. **Space Complexity:** $\mathcal{O}(n)$ to store unique skills and users in the map.
