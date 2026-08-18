# Problem 3: Flatten an Over-Nested State Shape

## Task

Given this over-nested project-management state (projects containing embedded tasks containing embedded assignees), refactor it into a flat, normalized shape (`byId`/`allIds` per entity type, referencing each other by ID) and rewrite the single reducer case shown so it correctly updates one task's status without touching unrelated project or task references.

```javascript
// BEFORE: nested
const state = {
  projects: [
    {
      id: 'proj1',
      name: 'Website Redesign',
      tasks: [
        { id: 'task1', title: 'Design mockups', status: 'in-progress', assignee: { id: 'u1', name: 'Ada' } },
        { id: 'task2', title: 'Build components', status: 'todo', assignee: { id: 'u2', name: 'Grace' } },
      ],
    },
  ],
};

// BEFORE: updating task1's status requires a nested .map() inside a .map()
function reducer(state, action) {
  return {
    ...state,
    projects: state.projects.map((project) => ({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === action.payload.taskId ? { ...task, status: action.payload.status } : task
      ),
    })),
  };
}
```

## Solution

```javascript
// AFTER: flat, normalized — cross-referencing topic 08-normalizing-state's pattern
const state = {
  projects: {
    byId: { proj1: { id: 'proj1', name: 'Website Redesign', taskIds: ['task1', 'task2'] } },
    allIds: ['proj1'],
  },
  tasks: {
    byId: {
      task1: { id: 'task1', title: 'Design mockups', status: 'in-progress', assigneeId: 'u1' },
      task2: { id: 'task2', title: 'Build components', status: 'todo', assigneeId: 'u2' },
    },
    allIds: ['task1', 'task2'],
  },
  users: {
    byId: { u1: { id: 'u1', name: 'Ada' }, u2: { id: 'u2', name: 'Grace' } },
    allIds: ['u1', 'u2'],
  },
};

// AFTER: updating one task's status is a single-key patch, no traversal of projects at all
function tasksReducer(tasksState, action) {
  switch (action.type) {
    case 'task/statusChanged': {
      const { taskId, status } = action.payload;
      if (!tasksState.byId[taskId]) return tasksState;
      return {
        ...tasksState,
        byId: {
          ...tasksState.byId,
          [taskId]: { ...tasksState.byId[taskId], status },
        },
      };
    }
    default:
      return tasksState;
  }
}

// Verify: projects and users are completely untouched by this reducer call.
const nextTasks = tasksReducer(state.tasks, { type: 'task/statusChanged', payload: { taskId: 'task1', status: 'done' } });
console.assert(nextTasks.byId.task2 === state.tasks.byId.task2, 'task2 reference must be untouched');
console.assert(nextTasks.byId.task1.status === 'done', 'task1 status should be updated');
console.log('All assertions passed.');
```

## Why this is a strictly better shape

The reducer no longer needs to know which project a task belongs to at all — updating a task is purely a function of the task's own ID, which eliminates the nested `.map()`-inside-`.map()` entirely. A component subscribed to `task2` via a memoized `selectTaskById(state, 'task2')` never re-renders when `task1`'s status changes, because `tasksState.byId.task2` is the same reference before and after. If two tasks need to display their assignee's name, both read from the single `users.byId` table — renaming a user once updates every task's displayed assignee, with no duplicated `assignee` objects to keep in sync. This is the same transformation, and the same payoff, covered in full in `08-normalizing-state` — included here as this topic's own worked example because "flatten an over-nested shape" is one of the seven concrete anti-pattern fixes this topic covers.
