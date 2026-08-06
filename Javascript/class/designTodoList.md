To design a `TodoList` system that handles tasks with the ability to add tasks, mark them as complete, and filter them by tag and due date, we can break the problem down into two primary classes: `Task` and `TodoList`.

### The `Task` class:

- This class will represent an individual task.
- Each task has:
  - `taskId`: A unique identifier for the task.
  - `taskName`: The description of the task.
  - `dueDate`: The date the task is due.
  - `tags`: A set of tags associated with the task for categorization.
  - `finish`: A boolean that determines if the task has been completed or not.

### The `TodoList` class:

- This class will represent the entire list of tasks and contains operations to add tasks, get tasks, and complete tasks.
- `tasks`: A `Map` that stores tasks, where the key is `userId` and the value is an array of `Task` objects.
- `taskIdCounter`: A counter that generates unique task IDs as new tasks are added.

### Methods:

1. **`addTask(userId, taskDescription, dueDate, tags)`**:
   - Adds a new task for a given user, assigns a unique `taskId`, and stores the task in the `tasks` map.
   
2. **`getAllTasks(userId)`**:
   - Retrieves all uncompleted tasks for a given user, sorted by `dueDate`.

3. **`getTasksForTag(userId, tag)`**:
   - Retrieves all uncompleted tasks for a given user that have the specified tag, sorted by `dueDate`.

4. **`completeTask(userId, taskId)`**:
   - Marks a specified task as completed by changing the `finish` property of the task.

### Key Design Considerations:

- Tasks are stored in a `Map`, with the `userId` as the key. Each user can have multiple tasks.
- The `tags` property is stored as a `Set` to ensure that tags are unique.
- Sorting by `dueDate` ensures tasks are processed in the correct order.
- The `finish` property allows tasks to be marked as completed, and once completed, they no longer appear in the uncompleted task lists.

### Code Implementation:

```javascript
class Task {
    constructor(taskId, taskDescription, dueDate, tags) {
        this.taskId = taskId;            // Unique ID for the task
        this.taskName = taskDescription; // Task description
        this.dueDate = dueDate;          // Due date of the task
        this.tags = new Set(tags);       // Tags for categorizing the task
        this.finish = false;             // Indicates if the task is completed
    }
}

class TodoList {
    constructor() {
        this.taskIdCounter = 1; // Counter to generate sequential task ids
        this.tasks = new Map(); // Stores userId -> Array of tasks
    }

    // Add a new task for a given user
    addTask(userId, taskDescription, dueDate, tags) {
        const task = new Task(this.taskIdCounter++, taskDescription, dueDate, tags);
        
        // If the user doesn't have any tasks, initialize their task list
        if (!this.tasks.has(userId)) {
            this.tasks.set(userId, []);
        }

        // Add the task to the user's task list
        this.tasks.get(userId).push(task);
        
        // Return the taskId for the new task
        return task.taskId;
    }

    // Get all uncompleted tasks for a given user, sorted by due date
    getAllTasks(userId) {
        if (!this.tasks.has(userId)) return [];
        
        // Filter uncompleted tasks
        const tasks = this.tasks.get(userId);
        const uncompletedTasks = tasks.filter(task => !task.finish);
        
        // Sort tasks by due date
        uncompletedTasks.sort((a, b) => a.dueDate - b.dueDate);
        
        // Return task names of uncompleted tasks
        return uncompletedTasks.map(task => task.taskName);
    }

    // Get all uncompleted tasks for a given user that have the specific tag
    getTasksForTag(userId, tag) {
        if (!this.tasks.has(userId)) return [];
        
        // Filter tasks by tag and uncompleted status
        const tasks = this.tasks.get(userId);
        const taggedTasks = tasks.filter(task => task.tags.has(tag) && !task.finish);
        
        // Sort tagged tasks by due date
        taggedTasks.sort((a, b) => a.dueDate - b.dueDate);
        
        // Return task names of uncompleted tagged tasks
        return taggedTasks.map(task => task.taskName);
    }

    // Mark a task as completed
    completeTask(userId, taskId) {
        if (!this.tasks.has(userId)) return;
        
        // Find the task by taskId and mark it as completed
        const tasks = this.tasks.get(userId);
        for (let task of tasks) {
            if (task.taskId === taskId && !task.finish) {
                task.finish = true;
                break;
            }
        }
    }
}

// Example Usage
const todoList = new TodoList();

// Add tasks for userId 1
console.log(todoList.addTask(1, "Task1", 50, [])); // Output: 1
console.log(todoList.addTask(1, "Task2", 100, ["P1"])); // Output: 2

// Get all tasks for userId 1
console.log(todoList.getAllTasks(1)); // Output: ["Task1", "Task2"]

// Get all tasks for userId 5 (no tasks exist for this user)
console.log(todoList.getAllTasks(5)); // Output: []

// Add another task for userId 1
console.log(todoList.addTask(1, "Task3", 30, ["P1"])); // Output: 3

// Get tasks for userId 1 with tag "P1"
console.log(todoList.getTasksForTag(1, "P1")); // Output: ["Task3", "Task2"]

// Mark task with taskId 2 as completed
todoList.completeTask(1, 2);

// Get tasks for userId 1 with tag "P1" again (task 2 is now completed)
console.log(todoList.getTasksForTag(1, "P1")); // Output: ["Task3"]

// Get all tasks for userId 1 (task 2 is now completed)
console.log(todoList.getAllTasks(1)); // Output: ["Task3", "Task1"]
```

### Explanation:

1. **Task Class:**
   - The `Task` class represents individual tasks with properties like `taskId`, `taskName`, `dueDate`, `tags`, and `finish`.
   - `taskId` is assigned sequentially, starting from 1, using a counter in the `TodoList` class.
   - `tags` is a `Set` to allow for efficient checking of whether a task has a specific tag.
   - The `finish` property is a boolean to indicate whether the task is completed.

2. **TodoList Class:**
   - `taskIdCounter` is used to generate unique IDs for each new task.
   - `tasks` is a `Map` where each key is a `userId`, and the value is an array of `Task` objects for that user.
   - `addTask`: Adds a new task for a given user. It checks if the user already has tasks and adds the new task to the list.
   - `getAllTasks`: Filters tasks that are not completed and sorts them by `dueDate`. It returns the task names.
   - `getTasksForTag`: Filters tasks by both tag and completion status, then sorts them by `dueDate`. It returns the task names.
   - `completeTask`: Marks a specific task as completed by setting `finish` to `true`.

### Example Walkthrough:

1. **Add Tasks:**
   - The tasks are added sequentially with a task ID that increments with each new task. When we add tasks, we get back the `taskId` of each new task.
   
2. **Get All Tasks:**
   - Retrieves tasks that are not completed (`finish` is `false`), sorted by their due date.

3. **Get Tasks for Tag:**
   - Retrieves tasks that are uncompleted and have the specific tag, sorted by due date.

4. **Complete a Task:**
   - Marks a task as completed (`finish = true`), and it no longer appears in future task retrievals.

### Complexity:
- **Time Complexity**: 
  - For `addTask`, it's O(1) since adding a task to a map or list is constant time.
  - For `getAllTasks` and `getTasksForTag`, filtering and sorting take O(n log n), where `n` is the number of tasks for a user.
  - For `completeTask`, it's O(n) since we may need to iterate over all tasks for a user to find and mark a task as completed.

This approach provides an efficient way to manage a user's tasks and allows for various operations like sorting, filtering by tags, and completing tasks.