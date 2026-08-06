Thank you for providing this detailed explanation of the race condition examples in JavaScript. I'll create a React component that demonstrates these concepts in a practical scenario, allowing users to visualize and interact with different race condition scenarios.

```typescriptreact project="async-await-demo"
...
```

This component demonstrates several key concepts from your explanation:

1. **Simple Race Condition**: The "Run Simple Tasks" button demonstrates a basic race condition where multiple tasks are executed concurrently, and the first one to complete "wins" the race.
2. **Race Condition with Timeout**: The "Run Tasks with Timeout" button shows how to implement a timeout mechanism using `Promise.race()`. Each task races against a 2.5-second timeout.
3. **Fetching URLs with Timeout**: Users can add URLs to fetch, and the "Fetch URLs" button demonstrates fetching multiple URLs with a 5-second timeout for each request.
4. **Error Handling**: The component handles both successful and failed tasks/requests, displaying the results with appropriate styling (green for success, red for errors).
5. **State Management**: React's `useState` hook is used to manage the state of tasks, URLs, and input fields.
6. **Dynamic UI Updates**: The UI updates in real-time as tasks complete or fail, providing immediate feedback to the user.
7. **Reusable Utility Functions**: The `simulateTask` and `fetchWithTimeout` functions are extracted into a separate utility file for reusability and cleaner code organization.


This implementation provides an interactive way to understand and visualize race conditions in JavaScript. Users can experiment with different scenarios:

- See which task completes first in the simple race condition.
- Observe how timeouts affect task execution.
- Add and fetch multiple URLs, seeing how they resolve or time out.


The component uses the shadcn/ui components for a polished look, and it's responsive and accessible. It demonstrates how to apply these advanced asynchronous JavaScript concepts in a real-world React application, providing both visual feedback and console logging for a comprehensive understanding of the race condition behaviors.