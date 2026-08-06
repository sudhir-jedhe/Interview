export interface ExecutionStep {
  id: number;
  description: string;
  type: 'sync' | 'microtask' | 'macrotask';
  output: number;
}

export function runDemo1(): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let stepId = 0;

  // Synchronous execution
  steps.push({ id: ++stepId, description: 'Console log', type: 'sync', output: 1 });
  steps.push({ id: ++stepId, description: 'Promise executor', type: 'sync', output: 2 });
  steps.push({ id: ++stepId, description: 'After resolve()', type: 'sync', output: 3 });
  steps.push({ id: ++stepId, description: 'Console log', type: 'sync', output: 4 });
  steps.push({ id: ++stepId, description: 'Console log', type: 'sync', output: 7 });

  // Microtasks (Promise callbacks)
  steps.push({ id: ++stepId, description: 'First .then()', type: 'microtask', output: 5 });
  steps.push({ id: ++stepId, description: 'Second .then()', type: 'microtask', output: 6 });

  // Macrotasks (setTimeout callbacks)
  steps.push({ id: ++stepId, description: 'setTimeout 0ms', type: 'macrotask', output: 9 });
  steps.push({ id: ++stepId, description: 'setTimeout 10ms', type: 'macrotask', output: 8 });

  return steps;
}

export function runDemo2(): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let stepId = 0;

  // Synchronous execution
  steps.push({ id: ++stepId, description: 'Console log', type: 'sync', output: 4 });
  steps.push({ id: ++stepId, description: 'func1 - Console log', type: 'sync', output: 2 });

  // Microtasks (Promise callbacks)
  steps.push({ id: ++stepId, description: 'func1 - Promise.then()', type: 'microtask', output: 1 });
  steps.push({ id: ++stepId, description: 'func2 - await completion', type: 'microtask', output: 3 });

  return steps;
}

export function runDemo3(): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let stepId = 0;

  // Synchronous execution
  steps.push({ id: ++stepId, description: 'Console log', type: 'sync', output: 1 });
  steps.push({ id: ++stepId, description: 'Promise executor start', type: 'sync', output: 4 });
  steps.push({ id: ++stepId, description: 'Promise executor end', type: 'sync', output: 6 });
  steps.push({ id: ++stepId, description: 'Console log', type: 'sync', output: 13 });

  // Microtasks (Promise callbacks)
  steps.push({ id: ++stepId, description: 'First .catch()', type: 'microtask', output: 8 });
  steps.push({ id: ++stepId, description: 'First .then() after catch', type: 'microtask', output: 9 });
  steps.push({ id: ++stepId, description: 'Second .then()', type: 'microtask', output: 11 });
  steps.push({ id: ++stepId, description: 'Third .then(undefined)', type: 'microtask', output: 12 });

  // Macrotasks (setTimeout callbacks)
  steps.push({ id: ++stepId, description: 'setTimeout 0ms', type: 'macrotask', output: 3 });
  steps.push({ id: ++stepId, description: 'setTimeout 10ms', type: 'macrotask', output: 2 });

  return steps;
}

