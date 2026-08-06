Here is your code and explanation in Markdown format:

```javascript
// Create an object to track listeners associated with event names
Array.prototype.listeners = {};

// To add/assign a new event with listener
Array.prototype.addListener = function(name, callback) {
  // If no listeners are present for this event, create a new array for listeners
  if (!this.listeners[name]) {
    this.listeners[name] = [];
  }
  // Add the callback to the listeners array for the event
  this.listeners[name].push(callback);
};

// Method to push new items into the array and trigger the event
Array.prototype.pushWithEvent = function(event, args) {
  // Add the new values to the array
  this.push(...args);
  
  // Trigger the specified event
  this.triggerEvent(event, args);
};

// Method to pop the last item from the array and trigger the event
Array.prototype.popWithEvent = function(event) {
  // Remove the last element
  const element = this.pop();
  
  // Trigger the specified event for the removed element
  this.triggerEvent(event, element);
};

// Helper function to trigger all the callbacks for a specified event
Array.prototype.triggerEvent = function(eventName, elements) {
  // If listeners exist for the event, invoke all callbacks
  if (this.listeners[eventName]) {
    this.listeners[eventName].forEach(callback =>
      callback(eventName, elements, this)
    );
  }
};

// Method to remove a specific listener from an event
Array.prototype.removeListener = function(eventName, callback) {
  // If event listeners exist
  if (this.listeners[eventName]) {
    // Filter out the specific callback
    this.listeners[eventName] = this.listeners[eventName].filter((e) => e !== callback);
  }
};

// Sample usage:

// Initialize an empty array
const arr = [];

// Define listener callbacks
const onAdd = (eventName, items, Array) => {
  console.log('items were added', items);
};

const onAddAgain = (eventName, items, Array) => {
  console.log('items were added again', items);
};

// Add event listeners
arr.addListener('add', onAdd);
arr.addListener('add', onAddAgain);
arr.addListener('remove', (eventName, item, Array) => {
  console.log(item, ' was removed');
});

// Push new items to the array and trigger the 'add' event
arr.pushWithEvent('add', [1, 2, 3, 'a', 'b']);

// Remove the second 'add' listener
arr.removeListener('add', onAddAgain);

// Push more items to the array and trigger the 'add' event
arr.pushWithEvent('add', [4, 5]);

// Pop an item from the array and trigger the 'remove' event
arr.popWithEvent('remove');

// Output the final array
console.log(arr);
```

### Explanation:

1. **Custom Array Methods**:
    - **`addListener(name, callback)`**: Adds a callback to the event listeners for the specified event name.
    - **`pushWithEvent(event, args)`**: Pushes elements into the array and triggers an event (e.g., `add`).
    - **`popWithEvent(event)`**: Pops the last element from the array and triggers the event (e.g., `remove`).
    - **`triggerEvent(eventName, elements)`**: Triggers all the registered callbacks for the given event name, passing the relevant data.
    - **`removeListener(eventName, callback)`**: Removes the specific listener (callback) for a given event.

2. **Listener Management**:
    - The `listeners` object is used to track which callbacks are associated with each event name.
    - You can add multiple listeners for the same event (e.g., `add`), and they will be triggered in the order they were added.
    - You can also remove specific listeners using `removeListener`.

3. **Event Handling**:
    - When items are added (`pushWithEvent`), the `add` event is triggered.
    - When items are removed (`popWithEvent`), the `remove` event is triggered.

4. **Removing Listeners**:
    - You can remove specific listeners by calling `removeListener`. In the example, the second listener `onAddAgain` is removed before the second `pushWithEvent` call.

### Example Input:

```javascript
const arr = [];

const onAdd = (eventName, items, Array) => {
  console.log('items were added', items);
}

const onAddAgain = (eventName, items, Array) => {
  console.log('items were added again', items);
}

arr.addListener('add', onAdd);
arr.addListener('add', onAddAgain);
arr.addListener('remove', (eventName, item, Array) => {
  console.log(item, ' was removed');
});

arr.pushWithEvent('add', [1, 2, 3, 'a', 'b']);
arr.removeListener('add', onAddAgain); // removes the second listener
arr.pushWithEvent('add', [4, 5]);
arr.popWithEvent('remove');

console.log(arr);
```

### Example Output:

```bash
items were added [1, 2, 3, "a", "b"]
items were added again [1, 2, 3, "a", "b"]
items were added [4, 5]
5  was removed
[1, 2, 3, "a", "b", 4]
```

### Breakdown of Output:

1. **First `pushWithEvent('add', [1, 2, 3, 'a', 'b'])`**:
    - Both listeners for the `add` event are triggered:
      - `onAdd` prints: `items were added [1, 2, 3, "a", "b"]`.
      - `onAddAgain` prints: `items were added again [1, 2, 3, "a", "b"]`.

2. **Removing the second listener** (`removeListener('add', onAddAgain)`):
    - The second listener (`onAddAgain`) is removed, so it won't be triggered in future events.

3. **Second `pushWithEvent('add', [4, 5])`**:
    - Only the first listener (`onAdd`) is triggered:
      - `items were added [4, 5]`.

4. **`popWithEvent('remove')`**:
    - The last item (`5`) is removed, and the `remove` event is triggered:
      - `5 was removed`.

5. **Final `console.log(arr)`**:
    - The final array after all operations is: `[1, 2, 3, "a", "b", 4]`.

This solution allows you to add, remove, and manage listeners for custom events on arrays and also triggers those events when certain actions like `push` or `pop` occur.