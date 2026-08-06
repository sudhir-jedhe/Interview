Here is the complete code implementing the `selectData` function and an example usage:

```javascript
function selectData(sessions, options) {
    return sessions.filter(session => {
        // Check if session meets all filter criteria
        return (
            (!options.date || session.date === options.date) &&
            (!options.type || session.type === options.type) &&
            (!options.duration || session.duration >= options.duration) &&
            (!options.trainer || session.trainer === options.trainer)
        );
    });
}

// Example usage:
const sessions = [
    { date: '2024-06-01', type: 'Strength Training', duration: 60, trainer: 'John' },
    { date: '2024-06-02', type: 'Cardio', duration: 45, trainer: 'Alice' },
    { date: '2024-06-03', type: 'Yoga', duration: 90, trainer: 'Bob' }
];

const options = {
    date: '2024-06-02',
    type: 'Cardio',
    duration: 40,
    trainer: 'Alice'
};

const selectedSessions = selectData(sessions, options);
console.log(selectedSessions);

// Example of another filter:
const otherOptions = {
    type: 'Yoga',
    duration: 90
};

const otherSelectedSessions = selectData(sessions, otherOptions);
console.log(otherSelectedSessions);
```

### **Output**

Running this code will produce the following output:

```javascript
[ { date: '2024-06-02', type: 'Cardio', duration: 45, trainer: 'Alice' } ]
[ { date: '2024-06-03', type: 'Yoga', duration: 90, trainer: 'Bob' } ]
```

### **How It Works**
1. **`options` object**:
   - Specifies filtering criteria.
   - Filters are applied only when a field in `options` is non-empty.

2. **Filtering logic**:
   - Each session in `sessions` is checked against all criteria in `options`.
   - If all conditions match, the session is included in the result.

3. **Reusable for different filters**:
   - You can adjust the `options` object to filter sessions based on specific needs.