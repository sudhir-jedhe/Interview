```js
const students = [
    { name: 'sudhir', subject: 'English', marks: 50 },
    { name: 'sudhir', subject: 'Science', marks: 70 },
    { name: 'sudhir', subject: 'Maths', marks: 40 },
    { name: 'Sagar', subject: 'English', marks: 43 },
    { name: 'Sagar', subject: 'Science', marks: 80 },
    { name: 'Sagar', subject: 'Maths', marks: 60 }
];

// Function to calculate percentages for each student
const calculatePercentages = (students) => {
    const studentResults = {};

    // Group marks by student
    students.forEach(({ name, marks }) => {
        if (!studentResults[name]) {
            studentResults[name] = { totalMarks: 0, subjectCount: 0 };
        }
        studentResults[name].totalMarks += marks;
        studentResults[name].subjectCount++;
    });

    // Calculate percentage for each student
    return Object.entries(studentResults).map(([name, { totalMarks, subjectCount }]) => ({
        name,
        totalMarks,
        percentage: ((totalMarks / (subjectCount * 100)) * 100).toFixed(2) + '%'
    }));
};

// Call the function and log the results
const percentages = calculatePercentages(students);
console.log(percentages);


/********************************** */

const students = [
    { name: 'sudhir', subject: 'English', marks: 50 },
    { name: 'sudhir', subject: 'Science', marks: 70 },
    { name: 'sudhir', subject: 'Maths', marks: 40 },
    { name: 'Sagar', subject: 'English', marks: 43 },
    { name: 'Sagar', subject: 'Science', marks: 80 },
    { name: 'Sagar', subject: 'Maths', marks: 60 }
];

// Function to calculate percentages for each student
const calculatePercentages = (students) => {
    const studentResults = {};

    students.forEach(({ name, marks }) => {
        if (!studentResults[name]) studentResults[name] = { totalMarks: 0, subjectCount: 0 };
        studentResults[name].totalMarks += marks;
        studentResults[name].subjectCount++;
    });

    return Object.keys(studentResults).map(name => {
        const { totalMarks, subjectCount } = studentResults[name];
        return { name, percentage: ((totalMarks / (subjectCount * 100)) * 100).toFixed(2) + '%' };
    });
};

console.log(calculatePercentages(students));

```

// Both implementations successfully achieve the target output:

```js
[
  { name: 'sudhir', totalMarks: 160, percentage: '53.33%' }, // First version includes totalMarks
  { name: 'Sagar', totalMarks: 183, percentage: '61.00%' }
]

```

Here is a quick breakdown comparing the two approaches and how you can optimize this pattern further using standard modern JavaScript.

---

### Comparison of the Two Approaches

| Metric          | Version 1 (`Object.entries`)                                                      | Version 2 (`Object.keys`)                                    |
| --------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Readability** | High (Destructures `[name, { totalMarks, subjectCount }]` directly in parameters) | Moderate (Requires extra lookup line `studentResults[name]`) |
| **Cleanliness** | Eliminates manual property access inside `.map()`                                 | Requires double-referencing key lookups                      |
| **Output**      | Retains `totalMarks` alongside `percentage`                                       | Omits `totalMarks` in final object                           |

`Object.entries()` in Version 1 is generally preferred over `Object.keys()` because it avoids the redundant object lookup inside the map loop.

---

### Modern Idiomatic Refactor (`Array.prototype.reduce`)

When aggregating an array into an object or summary list, `Array.prototype.reduce()` is the standard functional approach in JavaScript. It avoids managing external mutable state (`studentResults`) outside the transformation scope:

```js
const calculatePercentages = (students) => {
  // 1. Aggregate totals using reduce
  const grouped = students.reduce((acc, { name, marks }) => {
    acc[name] = acc[name] || { totalMarks: 0, subjectCount: 0 };
    acc[name].totalMarks += marks;
    acc[name].subjectCount += 1;
    return acc;
  }, {});

  // 2. Map aggregated data to desired output format
  return Object.entries(grouped).map(([name, { totalMarks, subjectCount }]) => ({
    name,
    totalMarks,
    percentage: `${((totalMarks / (subjectCount * 100)) * 100).toFixed(2)}%`
  }));
};

```

---

### Edge Cases to Consider

1. **Max Marks per Subject Assumptions**:
Both snippets assume each subject is out of **100**. If max possible marks vary per subject, you should store `maxMarks` per subject entry rather than multiplying `subjectCount * 100`.
2. **Case Sensitivity**:
If student names have inconsistent casing (e.g., `'Sudhir'` vs `'sudhir'`), object key aggregation will treat them as separate students. Normalizing keys with `.toLowerCase()` prevents duplication:

```js
const key = name.toLowerCase();

```
